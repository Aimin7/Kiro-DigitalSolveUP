// NaverDirectionsService 구현
// 네이버 Directions 5 API 연동 및 1.5km 우회 경로 계산 서비스

const axios = require('axios');
const { info, error, debug, warn } = require('../utils/logger');
const environment = require('../config/environment');

/**
 * 네이버 길찾기 서비스 클래스
 */
class NaverDirectionsService {
  constructor(options = {}) {
    this.clientId = environment.naver.clientId;
    this.clientSecret = environment.naver.clientSecret;
    this.baseUrl = 'https://naveropenapi.apigw.ntruss.com';
    this.timeout = options.timeout || 15000;
    this.retryCount = options.retryCount || 2;
    this.retryDelay = options.retryDelay || 1000;
    this.avoidanceRadius = 1500; // 1.5km 우회 반경
    
    if (!this.clientId || !this.clientSecret) {
      warn('Naver API credentials not configured');
    }
  }

  /**
   * HTTP 클라이언트 생성
   * @returns {Object} Axios 인스턴스
   */
  createHttpClient() {
    return axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'X-NCP-APIGW-API-KEY-ID': this.clientId,
        'X-NCP-APIGW-API-KEY': this.clientSecret,
        'Content-Type': 'application/json',
        'User-Agent': 'FloodInfoApp/1.0',
      },
    });
  }

  /**
   * 재시도 로직이 포함된 HTTP 요청
   * @param {Function} requestFn - 요청 함수
   * @param {string} operation - 작업명
   * @returns {Promise<Object>} 응답 결과
   */
  async requestWithRetry(requestFn, operation) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.retryCount; attempt++) {
      try {
        debug(`Naver Directions API request attempt ${attempt}`, { operation });
        
        const startTime = Date.now();
        const response = await requestFn();
        const responseTime = Date.now() - startTime;
        
        info('Naver Directions API request successful', { 
          operation,
          attempt,
          responseTime,
          status: response.status,
        });
        
        return {
          success: true,
          data: response.data,
          responseTime,
          attempt,
          timestamp: new Date().toISOString(),
        };
      } catch (err) {
        lastError = err;
        
        const errorInfo = {
          operation,
          attempt,
          error: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
        };

        if (this.shouldNotRetry(err)) {
          error('Naver Directions API request failed (non-retryable)', err, errorInfo);
          break;
        }
        
        warn(`Naver Directions API request failed (attempt ${attempt})`, errorInfo);
        
        if (attempt < this.retryCount) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }
    
    const errorCode = this.getErrorCode(lastError);
    
    error('Naver Directions API request failed after all retries', lastError, { 
      operation,
      attempts: this.retryCount,
      errorCode,
    });
    
    return {
      success: false,
      error: {
        message: lastError.message,
        code: errorCode,
        status: lastError.response?.status,
        attempts: this.retryCount,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 재시도하지 않을 에러인지 확인
   * @param {Error} error - 에러 객체
   * @returns {boolean} 재시도하지 않을 에러 여부
   */
  shouldNotRetry(error) {
    if (!error.response) return false;
    
    const status = error.response.status;
    return status >= 400 && status < 500 && status !== 429;
  }

  /**
   * 에러 코드 추출
   * @param {Error} error - 에러 객체
   * @returns {string} 에러 코드
   */
  getErrorCode(error) {
    if (!error.response) {
      if (error.code === 'ECONNABORTED') return 'TIMEOUT_ERROR';
      if (error.code === 'ENOTFOUND') return 'NETWORK_ERROR';
      return 'NETWORK_ERROR';
    }
    
    const status = error.response.status;
    
    switch (status) {
      case 400: return 'BAD_REQUEST';
      case 401: return 'AUTHENTICATION_ERROR';
      case 403: return 'FORBIDDEN';
      case 404: return 'NO_ROUTE_FOUND';
      case 429: return 'RATE_LIMIT_ERROR';
      case 500: return 'SERVER_ERROR';
      default: return 'DIRECTIONS_ERROR';
    }
  }

  /**
   * 지연 함수
   * @param {number} ms - 지연 시간 (밀리초)
   * @returns {Promise} 지연 Promise
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 경로 계산
   * @param {Object} start - 출발지 { latitude, longitude }
   * @param {Object} goal - 목적지 { latitude, longitude }
   * @param {Object} options - 경로 옵션
   * @returns {Promise<Object>} 경로 계산 결과
   */
  async calculateRoute(start, goal, options = {}) {
    try {
      debug('Calculating route', { start, goal, options });

      if (!this.isValidCoordinate(start.latitude, start.longitude)) {
        throw new Error('Invalid start coordinates');
      }

      if (!this.isValidCoordinate(goal.latitude, goal.longitude)) {
        throw new Error('Invalid goal coordinates');
      }

      if (!this.clientId || !this.clientSecret) {
        throw new Error('Naver API credentials not configured');
      }

      const client = this.createHttpClient();
      
      return this.requestWithRetry(async () => {
        const params = {
          start: `${start.longitude},${start.latitude}`,
          goal: `${goal.longitude},${goal.latitude}`,
          option: options.option || 'traoptimal',
        };

        // 경유지 추가
        if (options.waypoints && options.waypoints.length > 0) {
          const waypointStr = options.waypoints
            .map(wp => `${wp.longitude},${wp.latitude}`)
            .join('|');
          params.waypoints = waypointStr;
        }

        // 회피 옵션
        if (options.avoid) {
          params.avoid = options.avoid; // ferry, toll, tunnel, etc.
        }

        const response = await client.get('/map-direction/v1/driving', {
          params,
        });
        
        // 응답 데이터 검증
        if (!response.data || !response.data.route) {
          throw new Error('No route found in response');
        }

        const routeData = this.processRouteResponse(response.data, start, goal);
        
        return {
          ...response,
          data: routeData,
        };
      }, 'calculateRoute');
    } catch (err) {
      error('Failed to calculate route', err, { start, goal });
      
      return {
        success: false,
        error: {
          message: err.message,
          code: 'ROUTE_CALCULATION_ERROR',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 경로 응답 데이터 처리
   * @param {Object} responseData - API 응답 데이터
   * @param {Object} start - 출발지
   * @param {Object} goal - 목적지
   * @returns {Object} 처리된 경로 데이터
   */
  processRouteResponse(responseData, start, goal) {
    const processedData = {
      route: {},
      summary: {
        start: { latitude: start.latitude, longitude: start.longitude },
        goal: { latitude: goal.latitude, longitude: goal.longitude },
        routeCount: 0,
      },
    };

    // 각 경로 옵션별 처리
    Object.keys(responseData.route).forEach(routeType => {
      const routeInfo = responseData.route[routeType];
      
      if (routeInfo && routeInfo.length > 0) {
        const route = routeInfo[0]; // 첫 번째 경로 사용
        
        processedData.route[routeType] = {
          summary: {
            distance: route.summary.distance,
            duration: route.summary.duration,
            tollFare: route.summary.tollFare || 0,
            fuelPrice: route.summary.fuelPrice || 0,
            bbox: route.summary.bbox,
          },
          path: this.decodePath(route.path),
          sections: route.section?.map(section => ({
            pointIndex: section.pointIndex,
            pointCount: section.pointCount,
            distance: section.distance,
            name: section.name,
            congestion: section.congestion,
            speed: section.speed,
          })) || [],
        };
        
        processedData.summary.routeCount++;
      }
    });

    return processedData;
  }

  /**
   * 경로 패스 디코딩
   * @param {string} encodedPath - 인코딩된 경로
   * @returns {Array} 디코딩된 좌표 배열 [[lng, lat], ...]
   */
  decodePath(encodedPath) {
    if (!encodedPath) return [];
    
    try {
      // 네이버 API의 경로 인코딩 형식에 따라 디코딩
      // 실제 구현에서는 네이버의 인코딩 방식에 맞게 수정 필요
      const coordinates = [];
      const path = encodedPath.split(',');
      
      for (let i = 0; i < path.length; i += 2) {
        if (i + 1 < path.length) {
          const lng = parseFloat(path[i]);
          const lat = parseFloat(path[i + 1]);
          
          if (!isNaN(lng) && !isNaN(lat)) {
            coordinates.push([lng, lat]);
          }
        }
      }
      
      return coordinates;
    } catch (err) {
      warn('Failed to decode path', { encodedPath, error: err.message });
      return [];
    }
  }

  /**
   * 홍수 지점을 우회하는 안전 경로 계산
   * @param {Object} start - 출발지
   * @param {Object} goal - 목적지
   * @param {Array} floodAreas - 홍수 지역 배열
   * @returns {Promise<Object>} 안전 경로 계산 결과
   */
  async calculateSafeRoute(start, goal, floodAreas) {
    try {
      debug('Calculating safe route avoiding flood areas', {
        start,
        goal,
        floodAreaCount: floodAreas.length,
      });

      // 기본 경로 계산
      const originalRoute = await this.calculateRoute(start, goal);
      
      if (!originalRoute.success) {
        return originalRoute;
      }

      // 기본 경로가 홍수 지역과 근접한지 확인
      const proximityCheck = await this.checkRouteProximity(
        originalRoute.data.route.traoptimal?.path || [],
        floodAreas,
        this.avoidanceRadius
      );

      // 근접하지 않으면 기본 경로 반환
      if (!proximityCheck.hasProximityAlert) {
        return {
          success: true,
          data: {
            originalRoute: originalRoute.data,
            safeRoute: originalRoute.data,
            avoidedAreas: [],
            routeIsSafe: true,
          },
          timestamp: new Date().toISOString(),
        };
      }

      // 우회 경로 계산
      const safeRoute = await this.calculateRouteWithAvoidance(start, goal, floodAreas);

      return {
        success: true,
        data: {
          originalRoute: originalRoute.data,
          safeRoute: safeRoute.success ? safeRoute.data : null,
          avoidedAreas: floodAreas,
          routeIsSafe: false,
          proximityCheck,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      error('Failed to calculate safe route', err, { start, goal });
      throw new Error(`Safe route calculation failed: ${err.message}`);
    }
  }

  /**
   * 회피 지역을 고려한 경로 계산
   * @param {Object} start - 출발지
   * @param {Object} goal - 목적지
   * @param {Array} avoidAreas - 회피 지역 배열
   * @returns {Promise<Object>} 우회 경로 계산 결과
   */
  async calculateRouteWithAvoidance(start, goal, avoidAreas) {
    try {
      debug('Calculating route with avoidance', {
        start,
        goal,
        avoidAreaCount: avoidAreas.length,
      });

      // 회피 지역 주변에 경유지 생성
      const waypoints = this.generateAvoidanceWaypoints(start, goal, avoidAreas);

      // 경유지를 포함한 경로 계산
      const routeOptions = {
        option: 'traoptimal',
        waypoints,
      };

      const avoidanceRoute = await this.calculateRoute(start, goal, routeOptions);

      if (!avoidanceRoute.success) {
        // 경유지 방식이 실패하면 다른 경로 옵션 시도
        const alternativeOptions = ['tracomfort', 'trafast'];
        
        for (const option of alternativeOptions) {
          const altRoute = await this.calculateRoute(start, goal, { option });
          
          if (altRoute.success) {
            const altProximityCheck = await this.checkRouteProximity(
              altRoute.data.route[option]?.path || [],
              avoidAreas,
              this.avoidanceRadius
            );

            if (!altProximityCheck.hasProximityAlert) {
              return altRoute;
            }
          }
        }
      }

      return avoidanceRoute;
    } catch (err) {
      error('Failed to calculate route with avoidance', err);
      throw err;
    }
  }

  /**
   * 회피용 경유지 생성
   * @param {Object} start - 출발지
   * @param {Object} goal - 목적지
   * @param {Array} avoidAreas - 회피 지역 배열
   * @returns {Array} 경유지 배열
   */
  generateAvoidanceWaypoints(start, goal, avoidAreas) {
    const waypoints = [];
    
    // 출발지와 목적지를 잇는 직선 경로 상에서 회피 지역과 교차하는 지점 찾기
    const routeLine = this.createRouteLine(start, goal);
    
    avoidAreas.forEach(area => {
      const intersection = this.findLineCircleIntersection(
        routeLine,
        { center: area, radius: area.radius || this.avoidanceRadius }
      );

      if (intersection.intersects) {
        // 회피 지점 생성 (원의 접선 방향으로)
        const avoidancePoint = this.generateAvoidancePoint(
          area,
          routeLine,
          this.avoidanceRadius * 1.2 // 여유 거리
        );
        
        if (avoidancePoint) {
          waypoints.push(avoidancePoint);
        }
      }
    });

    // 경유지를 출발지에서 목적지 순서로 정렬
    waypoints.sort((a, b) => {
      const distA = this.calculateDistance(start.latitude, start.longitude, a.latitude, a.longitude);
      const distB = this.calculateDistance(start.latitude, start.longitude, b.latitude, b.longitude);
      return distA - distB;
    });

    debug('Generated avoidance waypoints', { waypointCount: waypoints.length });

    return waypoints;
  }

  /**
   * 경로 라인 생성
   * @param {Object} start - 시작점
   * @param {Object} end - 끝점
   * @returns {Object} 경로 라인 정보
   */
  createRouteLine(start, end) {
    return {
      start: { latitude: start.latitude, longitude: start.longitude },
      end: { latitude: end.latitude, longitude: end.longitude },
      length: this.calculateDistance(start.latitude, start.longitude, end.latitude, end.longitude),
    };
  }

  /**
   * 직선과 원의 교차점 찾기
   * @param {Object} line - 직선 정보
   * @param {Object} circle - 원 정보
   * @returns {Object} 교차 정보
   */
  findLineCircleIntersection(line, circle) {
    // 간단한 교차 검사 (정확한 기하학적 계산 필요)
    const startDist = this.calculateDistance(
      line.start.latitude,
      line.start.longitude,
      circle.center.latitude,
      circle.center.longitude
    );

    const endDist = this.calculateDistance(
      line.end.latitude,
      line.end.longitude,
      circle.center.latitude,
      circle.center.longitude
    );

    const intersects = startDist <= circle.radius || endDist <= circle.radius ||
                      (startDist > circle.radius && endDist > circle.radius && 
                       Math.min(startDist, endDist) <= circle.radius);

    return {
      intersects,
      startDistance: startDist,
      endDistance: endDist,
    };
  }

  /**
   * 회피 지점 생성
   * @param {Object} avoidArea - 회피 지역
   * @param {Object} routeLine - 경로 라인
   * @param {number} avoidanceDistance - 회피 거리
   * @returns {Object|null} 회피 지점
   */
  generateAvoidancePoint(avoidArea, routeLine, avoidanceDistance) {
    try {
      // 회피 지역 중심에서 경로 라인에 수직인 방향으로 회피 지점 생성
      const centerLat = avoidArea.latitude;
      const centerLng = avoidArea.longitude;

      // 경로의 방향 벡터 계산
      const routeVector = {
        lat: routeLine.end.latitude - routeLine.start.latitude,
        lng: routeLine.end.longitude - routeLine.start.longitude,
      };

      // 수직 벡터 계산 (90도 회전)
      const perpVector = {
        lat: -routeVector.lng,
        lng: routeVector.lat,
      };

      // 벡터 정규화
      const perpLength = Math.sqrt(perpVector.lat ** 2 + perpVector.lng ** 2);
      if (perpLength === 0) return null;

      const normalizedPerp = {
        lat: perpVector.lat / perpLength,
        lng: perpVector.lng / perpLength,
      };

      // 회피 거리만큼 이동한 지점 계산
      const avoidanceOffset = avoidanceDistance / 111000; // 대략적인 도/미터 변환

      const avoidancePoint = {
        latitude: centerLat + (normalizedPerp.lat * avoidanceOffset),
        longitude: centerLng + (normalizedPerp.lng * avoidanceOffset),
      };

      // 좌표 유효성 검사
      if (this.isValidCoordinate(avoidancePoint.latitude, avoidancePoint.longitude)) {
        return avoidancePoint;
      }

      return null;
    } catch (err) {
      warn('Failed to generate avoidance point', { avoidArea, error: err.message });
      return null;
    }
  }

  /**
   * 경로와 홍수 지점 간 근접성 검사
   * @param {Array} routePath - 경로 좌표 배열
   * @param {Array} floodPoints - 홍수 지점 배열
   * @param {number} proximityRadius - 근접 반경
   * @returns {Promise<Object>} 근접성 검사 결과
   */
  async checkRouteProximity(routePath, floodPoints, proximityRadius) {
    try {
      if (!routePath || routePath.length === 0) {
        return { hasProximityAlert: false, alertPoints: [] };
      }

      const alertPoints = [];
      let minDistance = Infinity;

      for (const floodPoint of floodPoints) {
        let pointMinDistance = Infinity;

        // 경로의 각 세그먼트에 대해 거리 계산
        for (let i = 0; i < routePath.length - 1; i++) {
          const segmentStart = routePath[i];
          const segmentEnd = routePath[i + 1];

          // 세그먼트와 홍수 지점 간 최단 거리 계산
          const distance = this.pointToLineDistance(
            { latitude: floodPoint.latitude, longitude: floodPoint.longitude },
            { latitude: segmentStart[1], longitude: segmentStart[0] },
            { latitude: segmentEnd[1], longitude: segmentEnd[0] }
          );

          pointMinDistance = Math.min(pointMinDistance, distance);
        }

        if (pointMinDistance <= proximityRadius) {
          alertPoints.push({
            floodPoint,
            distance: pointMinDistance,
          });

          minDistance = Math.min(minDistance, pointMinDistance);
        }
      }

      return {
        hasProximityAlert: alertPoints.length > 0,
        alertPoints,
        minDistance: alertPoints.length > 0 ? minDistance : null,
      };
    } catch (err) {
      error('Failed to check route proximity', err);
      throw err;
    }
  }

  /**
   * 점과 선분 간 최단 거리 계산
   * @param {Object} point - 점 좌표
   * @param {Object} lineStart - 선분 시작점
   * @param {Object} lineEnd - 선분 끝점
   * @returns {number} 최단 거리 (미터)
   */
  pointToLineDistance(point, lineStart, lineEnd) {
    // 선분의 길이가 0인 경우
    const lineLength = this.calculateDistance(
      lineStart.latitude,
      lineStart.longitude,
      lineEnd.latitude,
      lineEnd.longitude
    );

    if (lineLength === 0) {
      return this.calculateDistance(
        point.latitude,
        point.longitude,
        lineStart.latitude,
        lineStart.longitude
      );
    }

    // 점에서 선분으로의 투영 계산
    const t = Math.max(0, Math.min(1, 
      ((point.latitude - lineStart.latitude) * (lineEnd.latitude - lineStart.latitude) +
       (point.longitude - lineStart.longitude) * (lineEnd.longitude - lineStart.longitude)) /
      (lineLength ** 2)
    ));

    // 투영점 계산
    const projectionLat = lineStart.latitude + t * (lineEnd.latitude - lineStart.latitude);
    const projectionLng = lineStart.longitude + t * (lineEnd.longitude - lineStart.longitude);

    // 점과 투영점 간 거리 반환
    return this.calculateDistance(
      point.latitude,
      point.longitude,
      projectionLat,
      projectionLng
    );
  }

  /**
   * 좌표 유효성 검사
   * @param {number} latitude - 위도
   * @param {number} longitude - 경도
   * @returns {boolean} 유효성 여부
   */
  isValidCoordinate(latitude, longitude) {
    return typeof latitude === 'number' && typeof longitude === 'number' &&
           !isNaN(latitude) && !isNaN(longitude) &&
           latitude >= -90 && latitude <= 90 &&
           longitude >= -180 && longitude <= 180;
  }

  /**
   * 두 좌표 간 거리 계산 (Haversine 공식)
   * @param {number} lat1 - 첫 번째 위도
   * @param {number} lng1 - 첫 번째 경도
   * @param {number} lat2 - 두 번째 위도
   * @param {number} lng2 - 두 번째 경도
   * @returns {number} 거리 (미터)
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000; // 지구 반지름 (미터)
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * 경로 계산 서비스 상태 확인
   * @returns {Promise<Object>} 서비스 상태
   */
  async checkServiceHealth() {
    try {
      debug('Checking Naver Directions service health');

      if (!this.clientId || !this.clientSecret) {
        return {
          healthy: false,
          error: 'API credentials not configured',
          timestamp: new Date().toISOString(),
        };
      }

      // 테스트 경로로 상태 확인 (서울시청 -> 동대문)
      const testStart = { latitude: 37.5665, longitude: 126.9780 };
      const testGoal = { latitude: 37.5651, longitude: 126.9895 };
      const startTime = Date.now();
      
      const result = await this.calculateRoute(testStart, testGoal);
      const responseTime = Date.now() - startTime;

      const health = {
        healthy: result.success,
        responseTime,
        testRoute: { start: testStart, goal: testGoal },
        timestamp: new Date().toISOString(),
      };

      if (!result.success) {
        health.error = result.error;
      }

      info('Naver Directions service health check completed', health);

      return health;
    } catch (err) {
      error('Failed to check service health', err);
      
      return {
        healthy: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

module.exports = NaverDirectionsService;