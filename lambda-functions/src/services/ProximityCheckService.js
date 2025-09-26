// ProximityCheckService 구현
// 경로와 홍수주의보 지점 간 1.5km 반경 검사 서비스

const { info, error, debug, warn } = require('../utils/logger');
const FloodInfo = require('../models/FloodInfo');
const DynamoDBService = require('./DynamoDBService');

/**
 * 근접성 검사 서비스 클래스
 */
class ProximityCheckService {
  constructor() {
    this.dynamoService = new DynamoDBService();
    this.defaultProximityRadius = 1500; // 1.5km (미터)
    this.routeSegmentLength = 100; // 경로 세그먼트 길이 (미터)
  }

  /**
   * 경로와 홍수 지점 간 근접성 검사
   * @param {Array} routePath - 경로 좌표 배열 [[lng, lat], ...]
   * @param {number} proximityRadius - 근접 반경 (미터, 기본값: 1500)
   * @returns {Promise<Object>} 근접성 검사 결과
   */
  async checkRouteProximity(routePath, proximityRadius = this.defaultProximityRadius) {
    try {
      debug('Checking route proximity', {
        routePoints: routePath?.length,
        proximityRadius,
      });

      if (!routePath || !Array.isArray(routePath) || routePath.length < 2) {
        throw new Error('Invalid route path provided');
      }

      // 경로 경계 박스 계산
      const routeBounds = this.calculateRouteBounds(routePath, proximityRadius);
      
      // 경계 박스 내의 활성 홍수 지점 조회
      const floodPoints = await this.getFloodPointsInBounds(routeBounds);
      
      if (floodPoints.length === 0) {
        return {
          hasProximityAlert: false,
          alertPoints: [],
          safeRoute: true,
          minDistance: null,
          routeAnalysis: {
            totalDistance: this.calculateRouteDistance(routePath),
            checkedPoints: routePath.length,
            floodPointsInArea: 0,
          },
        };
      }

      // 각 홍수 지점에 대해 경로와의 최단 거리 계산
      const proximityResults = floodPoints.map(floodPoint => {
        const minDistance = this.calculateMinDistanceToRoute(routePath, floodPoint);
        
        return {
          floodPoint,
          minDistance,
          isWithinRadius: minDistance <= proximityRadius,
          alertLevel: this.determineAlertLevel(minDistance, proximityRadius, floodPoint.severity),
        };
      });

      // 근접 알림이 필요한 지점들 필터링
      const alertPoints = proximityResults.filter(result => result.isWithinRadius);
      
      // 가장 가까운 거리
      const minDistance = Math.min(...proximityResults.map(r => r.minDistance));
      
      // 경로 분석 정보
      const routeAnalysis = {
        totalDistance: this.calculateRouteDistance(routePath),
        checkedPoints: routePath.length,
        floodPointsInArea: floodPoints.length,
        alertPointsCount: alertPoints.length,
        severityDistribution: this.analyzeSeverityDistribution(alertPoints),
      };

      const result = {
        hasProximityAlert: alertPoints.length > 0,
        alertPoints: alertPoints.map(ap => ({
          id: ap.floodPoint.id,
          locationId: ap.floodPoint.locationId,
          coordinates: {
            latitude: ap.floodPoint.latitude,
            longitude: ap.floodPoint.longitude,
          },
          distance: Math.round(ap.minDistance),
          alertType: ap.floodPoint.alertType,
          severity: ap.floodPoint.severity,
          alertLevel: ap.alertLevel,
          availableAPIs: ap.floodPoint.availableAPIs,
          timestamp: ap.floodPoint.timestamp,
        })),
        safeRoute: alertPoints.length === 0,
        minDistance: Math.round(minDistance),
        routeAnalysis,
        proximityRadius,
        timestamp: new Date().toISOString(),
      };

      info('Route proximity check completed', {
        hasAlert: result.hasProximityAlert,
        alertPointsCount: result.alertPoints.length,
        minDistance: result.minDistance,
        routeDistance: result.routeAnalysis.totalDistance,
      });

      return result;
    } catch (err) {
      error('Failed to check route proximity', err, {
        routePoints: routePath?.length,
        proximityRadius,
      });
      throw new Error(`Route proximity check failed: ${err.message}`);
    }
  }

  /**
   * 경로 경계 박스 계산
   * @param {Array} routePath - 경로 좌표 배열
   * @param {number} buffer - 버퍼 거리 (미터)
   * @returns {Object} 경계 박스
   */
  calculateRouteBounds(routePath, buffer) {
    let minLat = Infinity, maxLat = -Infinity;
    let minLng = Infinity, maxLng = -Infinity;

    routePath.forEach(([lng, lat]) => {
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    });

    // 버퍼를 도 단위로 변환 (대략적인 변환)
    const bufferDegrees = buffer / 111320; // 1도 ≈ 111.32km

    return {
      north: maxLat + bufferDegrees,
      south: minLat - bufferDegrees,
      east: maxLng + bufferDegrees,
      west: minLng - bufferDegrees,
    };
  }

  /**
   * 경계 박스 내의 홍수 지점 조회
   * @param {Object} bounds - 경계 박스
   * @returns {Promise<Array>} 홍수 지점 배열
   */
  async getFloodPointsInBounds(bounds) {
    try {
      // 전체 활성 데이터 조회 (최적화 필요)
      const result = await this.dynamoService.getItemsByStatus('active', {
        limit: 1000,
      });

      if (!result.items || result.items.length === 0) {
        return [];
      }

      // 경계 박스 내 필터링
      const floodPoints = result.items
        .map(item => FloodInfo.fromDynamoDBItem(item))
        .filter(floodInfo => 
          floodInfo.latitude >= bounds.south &&
          floodInfo.latitude <= bounds.north &&
          floodInfo.longitude >= bounds.west &&
          floodInfo.longitude <= bounds.east
        );

      return floodPoints;
    } catch (err) {
      warn('Failed to get flood points in bounds', { error: err.message, bounds });
      return [];
    }
  }

  /**
   * 경로와 지점 간 최단 거리 계산
   * @param {Array} routePath - 경로 좌표 배열
   * @param {Object} floodPoint - 홍수 지점
   * @returns {number} 최단 거리 (미터)
   */
  calculateMinDistanceToRoute(routePath, floodPoint) {
    let minDistance = Infinity;

    // 각 경로 세그먼트에 대해 최단 거리 계산
    for (let i = 0; i < routePath.length - 1; i++) {
      const segmentStart = { latitude: routePath[i][1], longitude: routePath[i][0] };
      const segmentEnd = { latitude: routePath[i + 1][1], longitude: routePath[i + 1][0] };
      
      const distance = this.calculateDistanceToSegment(
        segmentStart,
        segmentEnd,
        floodPoint
      );
      
      minDistance = Math.min(minDistance, distance);
    }

    return minDistance;
  }

  /**
   * 점과 선분 간 최단 거리 계산
   * @param {Object} segmentStart - 선분 시작점
   * @param {Object} segmentEnd - 선분 끝점
   * @param {Object} point - 기준점
   * @returns {number} 최단 거리 (미터)
   */
  calculateDistanceToSegment(segmentStart, segmentEnd, point) {
    // 선분의 길이
    const segmentLength = FloodInfo.calculateDistance(
      segmentStart.latitude,
      segmentStart.longitude,
      segmentEnd.latitude,
      segmentEnd.longitude
    );

    if (segmentLength === 0) {
      // 선분이 점인 경우
      return FloodInfo.calculateDistance(
        segmentStart.latitude,
        segmentStart.longitude,
        point.latitude,
        point.longitude
      );
    }

    // 벡터 계산을 위한 좌표 변환 (간단한 평면 근사)
    const dx = segmentEnd.longitude - segmentStart.longitude;
    const dy = segmentEnd.latitude - segmentStart.latitude;
    const px = point.longitude - segmentStart.longitude;
    const py = point.latitude - segmentStart.latitude;

    // 투영 비율 계산
    const t = Math.max(0, Math.min(1, (px * dx + py * dy) / (dx * dx + dy * dy)));

    // 선분 상의 가장 가까운 점
    const closestLat = segmentStart.latitude + t * dy;
    const closestLng = segmentStart.longitude + t * dx;

    // 거리 계산
    return FloodInfo.calculateDistance(
      closestLat,
      closestLng,
      point.latitude,
      point.longitude
    );
  }

  /**
   * 경로 전체 거리 계산
   * @param {Array} routePath - 경로 좌표 배열
   * @returns {number} 전체 거리 (미터)
   */
  calculateRouteDistance(routePath) {
    let totalDistance = 0;
    
    for (let i = 0; i < routePath.length - 1; i++) {
      const start = routePath[i];
      const end = routePath[i + 1];
      
      totalDistance += FloodInfo.calculateDistance(
        start[1], start[0],
        end[1], end[0]
      );
    }
    
    return totalDistance;
  }

  /**
   * 경고 레벨 결정
   * @param {number} distance - 거리 (미터)
   * @param {number} proximityRadius - 근접 반경
   * @param {string} severity - 홍수 심각도
   * @returns {string} 경고 레벨
   */
  determineAlertLevel(distance, proximityRadius, severity) {
    if (distance === null || distance === undefined) {
      return 'none';
    }

    // 거리 기반 기본 레벨
    let baseLevel;
    if (distance <= proximityRadius * 0.3) { // 30% 이내
      baseLevel = 'high';
    } else if (distance <= proximityRadius * 0.7) { // 70% 이내
      baseLevel = 'medium';
    } else {
      baseLevel = 'low';
    }

    // 홍수 심각도에 따른 조정
    if (severity === 'high') {
      return baseLevel === 'low' ? 'medium' : 'high';
    } else if (severity === 'medium') {
      return baseLevel;
    } else {
      return baseLevel === 'high' ? 'medium' : baseLevel;
    }
  }

  /**
   * 심각도 분포 분석
   * @param {Array} alertPoints - 알림 지점 배열
   * @returns {Object} 심각도별 분포
   */
  analyzeSeverityDistribution(alertPoints) {
    const distribution = { low: 0, medium: 0, high: 0 };
    
    alertPoints.forEach(point => {
      const severity = point.floodPoint.severity;
      if (distribution[severity] !== undefined) {
        distribution[severity]++;
      }
    });
    
    return distribution;
  }

  /**
   * 대체 경로 제안을 위한 위험 지역 식별
   * @param {Array} routePath - 원본 경로
   * @param {Array} alertPoints - 알림 지점들
   * @returns {Array} 위험 구간 배열
   */
  identifyRiskSegments(routePath, alertPoints) {
    const riskSegments = [];
    
    alertPoints.forEach(alertPoint => {
      const floodPoint = alertPoint.floodPoint;
      
      // 각 경로 세그먼트와의 거리 계산
      for (let i = 0; i < routePath.length - 1; i++) {
        const segmentStart = { latitude: routePath[i][1], longitude: routePath[i][0] };
        const segmentEnd = { latitude: routePath[i + 1][1], longitude: routePath[i + 1][0] };
        
        const distance = this.calculateDistanceToSegment(segmentStart, segmentEnd, floodPoint);
        
        if (distance <= alertPoint.minDistance * 1.1) { // 10% 여유
          riskSegments.push({
            segmentIndex: i,
            floodPointId: floodPoint.id,
            distance,
            severity: floodPoint.severity,
            alertLevel: alertPoint.alertLevel,
          });
        }
      }
    });
    
    return riskSegments;
  }

  /**
   * 경로 안전성 점수 계산
   * @param {Object} proximityResult - 근접성 검사 결과
   * @returns {number} 안전성 점수 (0-100)
   */
  calculateRouteSafetyScore(proximityResult) {
    if (!proximityResult.hasProximityAlert) {
      return 100;
    }

    let score = 100;
    const { alertPoints, routeAnalysis } = proximityResult;

    // 알림 지점 수에 따른 감점
    score -= alertPoints.length * 10;

    // 최단 거리에 따른 감점
    if (proximityResult.minDistance < 500) {
      score -= 30;
    } else if (proximityResult.minDistance < 1000) {
      score -= 20;
    } else {
      score -= 10;
    }

    // 심각도에 따른 감점
    const { high, medium } = routeAnalysis.severityDistribution;
    score -= high * 20 + medium * 10;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * 실시간 근접성 모니터링
   * @param {Array} routePath - 경로
   * @param {Function} callback - 알림 콜백
   * @param {Object} options - 모니터링 옵션
   * @returns {Object} 모니터링 제어 객체
   */
  startProximityMonitoring(routePath, callback, options = {}) {
    const {
      interval = 30000, // 30초
      proximityRadius = this.defaultProximityRadius,
    } = options;

    let isMonitoring = true;
    let lastCheckTime = null;

    const monitor = async () => {
      if (!isMonitoring) return;

      try {
        const result = await this.checkRouteProximity(routePath, proximityRadius);
        
        // 상태 변화가 있거나 새로운 알림이 있는 경우 콜백 호출
        if (result.hasProximityAlert || 
            (lastCheckTime && result.timestamp !== lastCheckTime)) {
          callback(result);
        }
        
        lastCheckTime = result.timestamp;
      } catch (err) {
        error('Proximity monitoring error', err);
        callback({ error: err.message });
      }

      if (isMonitoring) {
        setTimeout(monitor, interval);
      }
    };

    // 초기 검사 시작
    monitor();

    return {
      stop: () => {
        isMonitoring = false;
        info('Proximity monitoring stopped');
      },
      isActive: () => isMonitoring,
    };
  }
}

module.exports = ProximityCheckService;