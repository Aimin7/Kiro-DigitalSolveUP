// 위치 기반 침수 데이터 Lambda 함수 구현
// GET /api/flood-data/location Lambda 함수

const { success, error: errorResponse, validationError } = require('../utils/response');
const { logRequest, logResponse, error } = require('../utils/logger');
const DynamoDBService = require('../services/DynamoDBService');
const Joi = require('joi');

// 서비스 인스턴스 생성
const dynamoDBService = new DynamoDBService();

/**
 * 위치 기반 침수 데이터 조회 핸들러
 * GET /api/flood-data/location
 */
async function getFloodDataByLocation(event, context) {
  const startTime = Date.now();
  
  try {
    logRequest(event, 'getFloodDataByLocation');

    // 쿼리 파라미터 검증
    const queryParams = event.queryStringParameters || {};
    const validationResult = validateLocationQuery(queryParams);
    
    if (validationResult.error) {
      const response = validationError(
        'Invalid query parameters',
        validationResult.error.details
      );
      logResponse(response, 'getFloodDataByLocation', Date.now() - startTime);
      return response;
    }

    const { 
      latitude, 
      longitude, 
      radius, 
      severity, 
      alertType, 
      limit, 
      offset 
    } = validationResult.value;

    // 위치 기반 침수 데이터 조회
    const locationData = await getFloodPointsNearLocation(
      latitude,
      longitude,
      radius,
      { severity, alertType, limit, offset }
    );

    const response = success(locationData);
    logResponse(response, 'getFloodDataByLocation', Date.now() - startTime);
    return response;

  } catch (err) {
    error('Failed to get flood data by location', err, {
      queryParams: event.queryStringParameters,
    });

    const response = errorResponse(
      'Failed to retrieve location-based flood data',
      500,
      'LOCATION_FLOOD_ERROR'
    );
    logResponse(response, 'getFloodDataByLocation', Date.now() - startTime);
    return response;
  }
}

/**
 * 쿼리 파라미터 검증
 * @param {Object} queryParams - 쿼리 파라미터
 * @returns {Object} 검증 결과
 */
function validateLocationQuery(queryParams) {
  const schema = Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    radius: Joi.number().min(100).max(50000).default(5000), // 100m ~ 50km
    severity: Joi.string().valid('low', 'medium', 'high'),
    alertType: Joi.string().valid('주의보', '경보', '특보'),
    limit: Joi.number().min(1).max(500).default(100),
    offset: Joi.number().min(0).default(0),
  });

  return schema.validate(queryParams);
}

/**
 * 위치 주변 침수 지점 조회
 * @param {number} latitude - 위도
 * @param {number} longitude - 경도
 * @param {number} radius - 반경 (미터)
 * @param {Object} options - 추가 옵션
 * @returns {Promise<Object>} 위치 기반 침수 데이터
 */
async function getFloodPointsNearLocation(latitude, longitude, radius, options = {}) {
  try {
    // 활성 상태의 모든 침수 데이터 조회
    const allData = await dynamoDBService.getItemsByStatus('active', {
      limit: options.limit * 2, // 거리 필터링을 고려하여 더 많이 조회
    });

    // 거리 기반 필터링 및 거리 계산
    const nearbyPoints = allData.items
      .filter(item => {
        if (!item.latitude || !item.longitude) return false;

        const distance = calculateDistance(
          latitude,
          longitude,
          item.latitude,
          item.longitude
        );

        return distance <= radius;
      })
      .map(item => ({
        id: item.id,
        locationId: item.locationId,
        latitude: item.latitude,
        longitude: item.longitude,
        alertType: item.alertType,
        severity: item.severity,
        timestamp: item.timestamp,
        status: item.status,
        sources: item.sources || [],
        availableAPIs: item.availableAPIs || [],
        distance: calculateDistance(latitude, longitude, item.latitude, item.longitude),
        address: item.address,
      }));

    // 심각도 필터링
    let filteredPoints = nearbyPoints;
    if (options.severity) {
      filteredPoints = nearbyPoints.filter(point => point.severity === options.severity);
    }

    // 경보 유형 필터링
    if (options.alertType) {
      filteredPoints = filteredPoints.filter(point => point.alertType === options.alertType);
    }

    // 거리순 정렬
    filteredPoints.sort((a, b) => a.distance - b.distance);

    // 페이지네이션
    const offset = options.offset || 0;
    const limit = options.limit || 100;
    const paginatedPoints = filteredPoints.slice(offset, offset + limit);

    // 응답 데이터 구성
    return {
      center: { latitude, longitude },
      radius,
      floodPoints: paginatedPoints,
      totalCount: filteredPoints.length,
      searchArea: {
        center: { latitude, longitude },
        radius,
        unit: 'meters',
      },
      pagination: {
        limit,
        offset,
        total: filteredPoints.length,
        hasMore: offset + limit < filteredPoints.length,
      },
      summary: {
        nearbyCount: filteredPoints.length,
        returnedCount: paginatedPoints.length,
        closestDistance: paginatedPoints.length > 0 ? paginatedPoints[0].distance : null,
        averageDistance: filteredPoints.length > 0 ? 
          filteredPoints.reduce((sum, point) => sum + point.distance, 0) / filteredPoints.length : 0,
        severityDistribution: calculateSeverityDistribution(filteredPoints),
        alertTypeDistribution: calculateAlertTypeDistribution(filteredPoints),
      },
    };
  } catch (err) {
    error('Failed to get flood points near location', err, { latitude, longitude, radius });
    throw err;
  }
}

/**
 * 거리 계산 (Haversine 공식)
 * @param {number} lat1 - 첫 번째 위도
 * @param {number} lon1 - 첫 번째 경도
 * @param {number} lat2 - 두 번째 위도
 * @param {number} lon2 - 두 번째 경도
 * @returns {number} 거리 (미터)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // 지구 반지름 (미터)
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * 심각도 분포 계산
 * @param {Array} points - 침수 지점 배열
 * @returns {Object} 심각도별 분포
 */
function calculateSeverityDistribution(points) {
  const distribution = { low: 0, medium: 0, high: 0 };
  
  points.forEach(point => {
    if (distribution[point.severity] !== undefined) {
      distribution[point.severity]++;
    }
  });
  
  return distribution;
}

/**
 * 경보 유형 분포 계산
 * @param {Array} points - 침수 지점 배열
 * @returns {Object} 경보 유형별 분포
 */
function calculateAlertTypeDistribution(points) {
  const distribution = { '주의보': 0, '경보': 0, '특보': 0 };
  
  points.forEach(point => {
    if (distribution[point.alertType] !== undefined) {
      distribution[point.alertType]++;
    }
  });
  
  return distribution;
}

module.exports = {
  getFloodDataByLocation,
};