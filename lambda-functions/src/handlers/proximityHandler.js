// 경로 근접성 검사 Lambda 함수 구현
// POST /api/directions/check-proximity, POST /api/directions/alternative-route Lambda 함수

const { success, error: errorResponse, validationError } = require('../utils/response');
const { logRequest, logResponse, error } = require('../utils/logger');
const ProximityCheckService = require('../services/ProximityCheckService');
const NaverDirectionsService = require('../services/NaverDirectionsService');
const DynamoDBService = require('../services/DynamoDBService');
const Joi = require('joi');

// 서비스 인스턴스 생성
const dynamoDBService = new DynamoDBService();
const proximityService = new ProximityCheckService(dynamoDBService);
const directionsService = new NaverDirectionsService();

/**
 * 경로 근접성 검사 핸들러
 * POST /api/directions/check-proximity
 */
async function checkProximity(event, context) {
  const startTime = Date.now();
  
  try {
    logRequest(event, 'checkProximity');

    // 요청 본문 파싱 및 검증
    const requestBody = JSON.parse(event.body || '{}');
    const validationResult = validateProximityRequest(requestBody);
    
    if (validationResult.error) {
      const response = validationError(
        'Invalid request body',
        validationResult.error.details
      );
      logResponse(response, 'checkProximity', Date.now() - startTime);
      return response;
    }

    const { routePath, proximityRadius, includeFloodPoints } = validationResult.value;

    // 활성 홍수 지점 조회
    const floodPoints = await proximityService.getActiveFloodPoints();

    // 경로 근접성 검사 실행
    const proximityResult = await proximityService.checkRouteProximity(
      routePath,
      floodPoints,
      proximityRadius
    );

    // 응답 데이터 구성
    const responseData = {
      ...proximityResult,
      routeInfo: {
        pointCount: routePath.length,
        totalDistance: calculateRouteDistance(routePath),
      },
      floodPointsChecked: floodPoints.length,
    };

    // 홍수 지점 정보 포함 옵션
    if (includeFloodPoints && proximityResult.hasProximityAlert) {
      responseData.detailedAlerts = proximityResult.alertPoints.map(alert => ({
        floodPoint: {
          id: alert.floodPoint.id,
          coordinates: {
            latitude: alert.floodPoint.latitude,
            longitude: alert.floodPoint.longitude,
          },
          severity: alert.floodPoint.severity,
          alertType: alert.floodPoint.alertType,
        },
        distance: alert.distance,
        alertLevel: alert.alertLevel,
      }));
    }

    const response = success(responseData);
    logResponse(response, 'checkProximity', Date.now() - startTime);
    return response;

  } catch (err) {
    error('Failed to check route proximity', err, {
      body: event.body,
    });

    const response = errorResponse(
      'Failed to check route proximity',
      500,
      'PROXIMITY_CHECK_ERROR'
    );
    logResponse(response, 'checkProximity', Date.now() - startTime);
    return response;
  }
}

/**
 * 대체 경로 계산 핸들러
 * POST /api/directions/alternative-route
 */
async function getAlternativeRoute(event, context) {
  const startTime = Date.now();
  
  try {
    logRequest(event, 'getAlternativeRoute');

    // 요청 본문 파싱 및 검증
    const requestBody = JSON.parse(event.body || '{}');
    const validationResult = validateAlternativeRouteRequest(requestBody);
    
    if (validationResult.error) {
      const response = validationError(
        'Invalid request body',
        validationResult.error.details
      );
      logResponse(response, 'getAlternativeRoute', Date.now() - startTime);
      return response;
    }

    const { 
      start, 
      goal, 
      avoidanceRadius, 
      includeOriginalRoute,
      routeOptions 
    } = validationResult.value;

    // 활성 홍수 지점 조회
    const floodPoints = await proximityService.getActiveFloodPoints();

    // 홍수 지역 정보 구성
    const floodAreas = floodPoints.map(point => ({
      latitude: point.latitude,
      longitude: point.longitude,
      radius: avoidanceRadius,
      severity: point.severity,
      alertType: point.alertType,
      id: point.id,
    }));

    // 대체 경로 계산
    const alternativeResult = await directionsService.calculateRouteWithAvoidance(
      start,
      goal,
      floodAreas
    );

    if (!alternativeResult.success) {
      const response = errorResponse(
        alternativeResult.error.message,
        500,
        alternativeResult.error.code
      );
      logResponse(response, 'getAlternativeRoute', Date.now() - startTime);
      return response;
    }

    // 응답 데이터 구성
    const responseData = {
      alternativeRoute: alternativeResult.data,
      avoidanceInfo: {
        floodAreasConsidered: floodAreas.length,
        avoidanceRadius,
        routeOptions,
      },
    };

    // 원본 경로 포함 옵션
    if (includeOriginalRoute) {
      const originalRoute = await directionsService.calculateRoute(start, goal, routeOptions);
      if (originalRoute.success) {
        responseData.originalRoute = originalRoute.data;
        
        // 경로 비교 정보
        const altSummary = alternativeResult.data.route?.traoptimal?.summary;
        const origSummary = originalRoute.data.route?.traoptimal?.summary;
        
        if (altSummary && origSummary) {
          responseData.routeComparison = {
            distanceDifference: altSummary.distance - origSummary.distance,
            durationDifference: altSummary.duration - origSummary.duration,
            tollFareDifference: (altSummary.tollFare || 0) - (origSummary.tollFare || 0),
            safetyImprovement: true, // 홍수 지역 회피
          };
        }
      }
    }

    const response = success(responseData);
    logResponse(response, 'getAlternativeRoute', Date.now() - startTime);
    return response;

  } catch (err) {
    error('Failed to get alternative route', err, {
      body: event.body,
    });

    const response = errorResponse(
      'Failed to calculate alternative route',
      500,
      'ALTERNATIVE_ROUTE_ERROR'
    );
    logResponse(response, 'getAlternativeRoute', Date.now() - startTime);
    return response;
  }
}

/**
 * 지역별 근접성 분석 핸들러
 * POST /api/directions/analyze-region
 */
async function analyzeRegionalProximity(event, context) {
  const startTime = Date.now();
  
  try {
    logRequest(event, 'analyzeRegionalProximity');

    // 요청 본문 파싱 및 검증
    const requestBody = JSON.parse(event.body || '{}');
    const validationResult = validateRegionalAnalysisRequest(requestBody);
    
    if (validationResult.error) {
      const response = validationError(
        'Invalid request body',
        validationResult.error.details
      );
      logResponse(response, 'analyzeRegionalProximity', Date.now() - startTime);
      return response;
    }

    const { bounds, proximityRadius } = validationResult.value;

    // 지역별 근접성 분석 실행
    const analysisResult = await proximityService.analyzeRegionalProximity(
      bounds,
      proximityRadius
    );

    const response = success(analysisResult);
    logResponse(response, 'analyzeRegionalProximity', Date.now() - startTime);
    return response;

  } catch (err) {
    error('Failed to analyze regional proximity', err, {
      body: event.body,
    });

    const response = errorResponse(
      'Failed to analyze regional proximity',
      500,
      'REGIONAL_ANALYSIS_ERROR'
    );
    logResponse(response, 'analyzeRegionalProximity', Date.now() - startTime);
    return response;
  }
}

/**
 * 근접성 검사 요청 검증
 * @param {Object} requestBody - 요청 본문
 * @returns {Object} 검증 결과
 */
function validateProximityRequest(requestBody) {
  const schema = Joi.object({
    routePath: Joi.array()
      .items(
        Joi.array().items(Joi.number()).length(2) // [lng, lat] 형식
      )
      .min(2)
      .required(),
    proximityRadius: Joi.number().min(100).max(5000).default(1500), // 100m ~ 5km
    includeFloodPoints: Joi.boolean().default(false),
  });

  return schema.validate(requestBody);
}

/**
 * 대체 경로 요청 검증
 * @param {Object} requestBody - 요청 본문
 * @returns {Object} 검증 결과
 */
function validateAlternativeRouteRequest(requestBody) {
  const schema = Joi.object({
    start: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
    }).required(),
    goal: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
    }).required(),
    avoidanceRadius: Joi.number().min(500).max(5000).default(1500), // 0.5km ~ 5km
    includeOriginalRoute: Joi.boolean().default(true),
    routeOptions: Joi.object({
      option: Joi.string().valid('traoptimal', 'tracomfort', 'trafast').default('traoptimal'),
      avoid: Joi.string().valid('ferry', 'toll', 'tunnel'),
    }).default({}),
  });

  return schema.validate(requestBody);
}

/**
 * 지역 분석 요청 검증
 * @param {Object} requestBody - 요청 본문
 * @returns {Object} 검증 결과
 */
function validateRegionalAnalysisRequest(requestBody) {
  const schema = Joi.object({
    bounds: Joi.object({
      north: Joi.number().min(-90).max(90).required(),
      south: Joi.number().min(-90).max(90).required(),
      east: Joi.number().min(-180).max(180).required(),
      west: Joi.number().min(-180).max(180).required(),
    }).required(),
    proximityRadius: Joi.number().min(100).max(10000).default(1500), // 100m ~ 10km
  });

  return schema.validate(requestBody);
}

/**
 * 경로 전체 거리 계산
 * @param {Array} routePath - 경로 좌표 배열 [[lng, lat], ...]
 * @returns {number} 전체 거리 (미터)
 */
function calculateRouteDistance(routePath) {
  if (!routePath || routePath.length < 2) return 0;

  let totalDistance = 0;
  
  for (let i = 0; i < routePath.length - 1; i++) {
    const start = routePath[i];
    const end = routePath[i + 1];
    
    totalDistance += calculateDistance(
      start[1], start[0], // lat, lng
      end[1], end[0]
    );
  }
  
  return totalDistance;
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

module.exports = {
  checkProximity,
  getAlternativeRoute,
  analyzeRegionalProximity,
};