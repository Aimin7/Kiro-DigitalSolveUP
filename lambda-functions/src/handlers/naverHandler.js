// 네이버 API Lambda 함수 구현
// GET /api/directions/safe-route, POST /api/geocoding/address Lambda 함수

const { success, error: errorResponse, validationError } = require('../utils/response');
const { logRequest, logResponse, error } = require('../utils/logger');
const NaverGeocodingService = require('../services/NaverGeocodingService');
const NaverDirectionsService = require('../services/NaverDirectionsService');
const DynamoDBService = require('../services/DynamoDBService');
const Joi = require('joi');

// 서비스 인스턴스 생성
const geocodingService = new NaverGeocodingService();
const directionsService = new NaverDirectionsService();
const dynamoDBService = new DynamoDBService();

/**
 * 안전 경로 안내 핸들러
 * GET /api/directions/safe-route
 */
async function getSafeRoute(event, context) {
  const startTime = Date.now();
  
  try {
    logRequest(event, 'getSafeRoute');

    // 쿼리 파라미터 검증
    const queryParams = event.queryStringParameters || {};
    const validationResult = validateSafeRouteQuery(queryParams);
    
    if (validationResult.error) {
      const response = validationError(
        'Invalid query parameters',
        validationResult.error.details
      );
      logResponse(response, 'getSafeRoute', Date.now() - startTime);
      return response;
    }

    const { 
      startLat, 
      startLng, 
      goalLat, 
      goalLng, 
      avoidanceRadius 
    } = validationResult.value;

    // 활성 홍수 지점 조회
    const floodPoints = await getActiveFloodPoints();

    // 안전 경로 계산
    const safeRouteResult = await directionsService.calculateSafeRoute(
      { latitude: startLat, longitude: startLng },
      { latitude: goalLat, longitude: goalLng },
      floodPoints.map(point => ({
        latitude: point.latitude,
        longitude: point.longitude,
        radius: avoidanceRadius,
        severity: point.severity,
        alertType: point.alertType,
      }))
    );

    if (!safeRouteResult.success) {
      const response = errorResponse(
        safeRouteResult.error.message,
        500,
        safeRouteResult.error.code
      );
      logResponse(response, 'getSafeRoute', Date.now() - startTime);
      return response;
    }

    const responseData = {
      ...safeRouteResult.data,
      avoidanceRadius,
      floodPointsConsidered: floodPoints.length,
      routeAnalysis: {
        isSafeRoute: safeRouteResult.data.routeIsSafe,
        avoidedFloodPoints: safeRouteResult.data.avoidedAreas?.length || 0,
        proximityAlerts: safeRouteResult.data.proximityCheck?.alertPoints?.length || 0,
      },
    };

    const response = success(responseData);
    logResponse(response, 'getSafeRoute', Date.now() - startTime);
    return response;

  } catch (err) {
    error('Failed to get safe route', err, {
      queryParams: event.queryStringParameters,
    });

    const response = errorResponse(
      'Failed to calculate safe route',
      500,
      'SAFE_ROUTE_ERROR'
    );
    logResponse(response, 'getSafeRoute', Date.now() - startTime);
    return response;
  }
}

/**
 * 주소 지오코딩 핸들러
 * POST /api/geocoding/address
 */
async function geocodeAddress(event, context) {
  const startTime = Date.now();
  
  try {
    logRequest(event, 'geocodeAddress');

    // 요청 본문 파싱
    const requestBody = JSON.parse(event.body || '{}');
    const validationResult = validateGeocodingRequest(requestBody);
    
    if (validationResult.error) {
      const response = validationError(
        'Invalid request body',
        validationResult.error.details
      );
      logResponse(response, 'geocodeAddress', Date.now() - startTime);
      return response;
    }

    const { address, coordinates, operation } = validationResult.value;

    let geocodingResult;

    if (operation === 'addressToCoordinates') {
      // 주소 -> 좌표 변환
      geocodingResult = await geocodingService.addressToCoordinates(address);
    } else if (operation === 'coordinatesToAddress') {
      // 좌표 -> 주소 변환
      geocodingResult = await geocodingService.coordinatesToAddress(
        coordinates.latitude,
        coordinates.longitude
      );
    } else {
      const response = validationError('Invalid operation specified');
      logResponse(response, 'geocodeAddress', Date.now() - startTime);
      return response;
    }

    if (!geocodingResult.success) {
      const response = errorResponse(
        geocodingResult.error.message,
        400,
        geocodingResult.error.code
      );
      logResponse(response, 'geocodeAddress', Date.now() - startTime);
      return response;
    }

    const response = success(geocodingResult.data);
    logResponse(response, 'geocodeAddress', Date.now() - startTime);
    return response;

  } catch (err) {
    error('Failed to geocode address', err, {
      body: event.body,
    });

    const response = errorResponse(
      'Failed to process geocoding request',
      500,
      'GEOCODING_ERROR'
    );
    logResponse(response, 'geocodeAddress', Date.now() - startTime);
    return response;
  }
}

/**
 * 배치 지오코딩 핸들러
 * POST /api/geocoding/batch
 */
async function batchGeocode(event, context) {
  const startTime = Date.now();
  
  try {
    logRequest(event, 'batchGeocode');

    // 요청 본문 파싱
    const requestBody = JSON.parse(event.body || '{}');
    const validationResult = validateBatchGeocodingRequest(requestBody);
    
    if (validationResult.error) {
      const response = validationError(
        'Invalid request body',
        validationResult.error.details
      );
      logResponse(response, 'batchGeocode', Date.now() - startTime);
      return response;
    }

    const { addresses } = validationResult.value;

    // 배치 지오코딩 실행
    const batchResult = await geocodingService.batchAddressToCoordinates(addresses);

    if (!batchResult.success) {
      const response = errorResponse(
        'Batch geocoding failed',
        500,
        'BATCH_GEOCODING_ERROR'
      );
      logResponse(response, 'batchGeocode', Date.now() - startTime);
      return response;
    }

    const response = success(batchResult);
    logResponse(response, 'batchGeocode', Date.now() - startTime);
    return response;

  } catch (err) {
    error('Failed to perform batch geocoding', err, {
      body: event.body,
    });

    const response = errorResponse(
      'Failed to process batch geocoding request',
      500,
      'BATCH_GEOCODING_ERROR'
    );
    logResponse(response, 'batchGeocode', Date.now() - startTime);
    return response;
  }
}

/**
 * 네이버 서비스 상태 확인 핸들러
 * GET /api/naver/health
 */
async function checkNaverServiceHealth(event, context) {
  const startTime = Date.now();
  
  try {
    logRequest(event, 'checkNaverServiceHealth');

    // 지오코딩 및 길찾기 서비스 상태 확인
    const [geocodingHealth, directionsHealth] = await Promise.allSettled([
      geocodingService.checkServiceHealth(),
      directionsService.checkServiceHealth(),
    ]);

    const healthStatus = {
      overall: 'healthy',
      services: {
        geocoding: geocodingHealth.status === 'fulfilled' ? 
          geocodingHealth.value : { healthy: false, error: geocodingHealth.reason.message },
        directions: directionsHealth.status === 'fulfilled' ? 
          directionsHealth.value : { healthy: false, error: directionsHealth.reason.message },
      },
      timestamp: new Date().toISOString(),
    };

    // 전체 상태 결정
    const allHealthy = Object.values(healthStatus.services).every(service => service.healthy);
    const anyHealthy = Object.values(healthStatus.services).some(service => service.healthy);
    
    if (allHealthy) {
      healthStatus.overall = 'healthy';
    } else if (anyHealthy) {
      healthStatus.overall = 'degraded';
    } else {
      healthStatus.overall = 'unhealthy';
    }

    const response = success(healthStatus);
    logResponse(response, 'checkNaverServiceHealth', Date.now() - startTime);
    return response;

  } catch (err) {
    error('Failed to check Naver service health', err);

    const response = errorResponse(
      'Failed to check service health',
      500,
      'HEALTH_CHECK_ERROR'
    );
    logResponse(response, 'checkNaverServiceHealth', Date.now() - startTime);
    return response;
  }
}

/**
 * 안전 경로 쿼리 파라미터 검증
 * @param {Object} queryParams - 쿼리 파라미터
 * @returns {Object} 검증 결과
 */
function validateSafeRouteQuery(queryParams) {
  const schema = Joi.object({
    startLat: Joi.number().min(-90).max(90).required(),
    startLng: Joi.number().min(-180).max(180).required(),
    goalLat: Joi.number().min(-90).max(90).required(),
    goalLng: Joi.number().min(-180).max(180).required(),
    avoidanceRadius: Joi.number().min(500).max(5000).default(1500), // 0.5km ~ 5km
  });

  return schema.validate(queryParams);
}

/**
 * 지오코딩 요청 검증
 * @param {Object} requestBody - 요청 본문
 * @returns {Object} 검증 결과
 */
function validateGeocodingRequest(requestBody) {
  const schema = Joi.object({
    operation: Joi.string().valid('addressToCoordinates', 'coordinatesToAddress').required(),
    address: Joi.string().when('operation', {
      is: 'addressToCoordinates',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
    }).when('operation', {
      is: 'coordinatesToAddress',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  });

  return schema.validate(requestBody);
}

/**
 * 배치 지오코딩 요청 검증
 * @param {Object} requestBody - 요청 본문
 * @returns {Object} 검증 결과
 */
function validateBatchGeocodingRequest(requestBody) {
  const schema = Joi.object({
    addresses: Joi.array().items(Joi.string().min(1)).min(1).max(50).required(),
  });

  return schema.validate(requestBody);
}

/**
 * 활성 홍수 지점 조회
 * @returns {Promise<Array>} 활성 홍수 지점 배열
 */
async function getActiveFloodPoints() {
  try {
    const result = await dynamoDBService.getItemsByStatus('active', {
      limit: 1000,
    });

    return result.items.map(item => ({
      id: item.id,
      latitude: item.latitude,
      longitude: item.longitude,
      severity: item.severity,
      alertType: item.alertType,
    })).filter(point => point.latitude && point.longitude);
  } catch (err) {
    error('Failed to get active flood points', err);
    return [];
  }
}

module.exports = {
  getSafeRoute,
  geocodeAddress,
  batchGeocode,
  checkNaverServiceHealth,
};