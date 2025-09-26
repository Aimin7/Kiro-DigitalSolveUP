// 침수 데이터 Lambda 함수 구현
// GET /api/flood-data, GET /api/flood-data/hanriver Lambda 함수

const { success, error: errorResponse, validationError } = require('../utils/response');
const { logRequest, logResponse, error } = require('../utils/logger');
const DynamoDBService = require('../services/DynamoDBService');
const HanRiverAPIService = require('../services/HanRiverAPIService');
const Joi = require('joi');

// 서비스 인스턴스 생성
const dynamoDBService = new DynamoDBService();
const hanRiverService = new HanRiverAPIService();

/**
 * 침수 데이터 조회 핸들러
 * GET /api/flood-data
 */
async function getFloodData(event, context) {
  const startTime = Date.now();
  
  try {
    logRequest(event, 'getFloodData');

    // 쿼리 파라미터 검증
    const queryParams = event.queryStringParameters || {};
    const validationResult = validateFloodDataQuery(queryParams);
    
    if (validationResult.error) {
      const response = validationError(
        'Invalid query parameters',
        validationResult.error.details
      );
      logResponse(response, 'getFloodData', Date.now() - startTime);
      return response;
    }

    const { latitude, longitude, radius, status, severity, limit, offset } = validationResult.value;

    let floodData;

    // 위치 기반 조회
    if (latitude && longitude && radius) {
      floodData = await getFloodDataByLocation(latitude, longitude, radius, {
        status,
        severity,
        limit,
        offset,
      });
    } else {
      // 전체 조회 또는 상태별 조회
      floodData = await getAllFloodData({
        status,
        severity,
        limit,
        offset,
      });
    }

    const response = success(floodData);
    logResponse(response, 'getFloodData', Date.now() - startTime);
    return response;

  } catch (err) {
    error('Failed to get flood data', err, {
      event: {
        httpMethod: event.httpMethod,
        path: event.path,
        queryStringParameters: event.queryStringParameters,
      },
    });

    const response = errorResponse(
      'Failed to retrieve flood data',
      500,
      'FLOOD_DATA_ERROR'
    );
    logResponse(response, 'getFloodData', Date.now() - startTime);
    return response;
  }
}

/**
 * 한강홍수통제소 원본 데이터 조회 핸들러
 * GET /api/flood-data/hanriver
 */
async function getHanRiverData(event, context) {
  const startTime = Date.now();
  
  try {
    logRequest(event, 'getHanRiverData');

    // 쿼리 파라미터 검증
    const queryParams = event.queryStringParameters || {};
    const validationResult = validateHanRiverQuery(queryParams);
    
    if (validationResult.error) {
      const response = validationError(
        'Invalid query parameters',
        validationResult.error.details
      );
      logResponse(response, 'getHanRiverData', Date.now() - startTime);
      return response;
    }

    const { apiType, includeMetadata } = validationResult.value;

    // 한강홍수통제소 API 데이터 조회
    let hanRiverData;
    
    if (apiType) {
      // 특정 API 타입만 조회
      hanRiverData = await getSingleHanRiverAPI(apiType);
    } else {
      // 모든 API 데이터 조회
      hanRiverData = await hanRiverService.fetchAllData();
    }

    // 메타데이터 제외 옵션
    if (!includeMetadata && hanRiverData.metadata) {
      delete hanRiverData.metadata;
    }

    const response = success(hanRiverData);
    logResponse(response, 'getHanRiverData', Date.now() - startTime);
    return response;

  } catch (err) {
    error('Failed to get Han River data', err, {
      event: {
        httpMethod: event.httpMethod,
        path: event.path,
        queryStringParameters: event.queryStringParameters,
      },
    });

    const response = errorResponse(
      'Failed to retrieve Han River data',
      500,
      'HANRIVER_DATA_ERROR'
    );
    logResponse(response, 'getHanRiverData', Date.now() - startTime);
    return response;
  }
}

/**
 * 쿼리 파라미터 검증 (침수 데이터)
 * @param {Object} queryParams - 쿼리 파라미터
 * @returns {Object} 검증 결과
 */
function validateFloodDataQuery(queryParams) {
  const schema = Joi.object({
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
    radius: Joi.number().min(100).max(50000).default(5000), // 100m ~ 50km
    status: Joi.string().valid('active', 'resolved'),
    severity: Joi.string().valid('low', 'medium', 'high'),
    limit: Joi.number().min(1).max(1000).default(100),
    offset: Joi.number().min(0).default(0),
  }).with('latitude', 'longitude').with('longitude', 'latitude');

  return schema.validate(queryParams);
}

/**
 * 쿼리 파라미터 검증 (한강홍수통제소 데이터)
 * @param {Object} queryParams - 쿼리 파라미터
 * @returns {Object} 검증 결과
 */
function validateHanRiverQuery(queryParams) {
  const schema = Joi.object({
    apiType: Joi.string().valid('waterlevel', 'realtime', 'forecast'),
    includeMetadata: Joi.boolean().default(true),
  });

  return schema.validate(queryParams);
}

/**
 * 위치 기반 침수 데이터 조회
 * @param {number} latitude - 위도
 * @param {number} longitude - 경도
 * @param {number} radius - 반경 (미터)
 * @param {Object} options - 추가 옵션
 * @returns {Promise<Object>} 침수 데이터
 */
async function getFloodDataByLocation(latitude, longitude, radius, options = {}) {
  try {
    // 모든 활성 데이터 조회 (최적화 필요)
    const queryOptions = {
      limit: options.limit * 2, // 거리 필터링을 고려하여 더 많이 조회
    };

    if (options.status) {
      const statusResult = await dynamoDBService.getItemsByStatus(options.status, queryOptions);
      var allItems = statusResult.items;
    } else {
      const scanResult = await dynamoDBService.scanItems({
        filterExpression: '#status = :status',
        expressionAttributeNames: { '#status': 'status' },
        expressionAttributeValues: { ':status': 'active' },
        limit: queryOptions.limit,
      });
      var allItems = scanResult.items;
    }

    // 거리 기반 필터링
    const nearbyItems = allItems
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
        ...item,
        distance: calculateDistance(latitude, longitude, item.latitude, item.longitude),
      }));

    // 심각도 필터링
    let filteredItems = nearbyItems;
    if (options.severity) {
      filteredItems = nearbyItems.filter(item => item.severity === options.severity);
    }

    // 거리순 정렬
    filteredItems.sort((a, b) => a.distance - b.distance);

    // 페이지네이션
    const offset = options.offset || 0;
    const limit = options.limit || 100;
    const paginatedItems = filteredItems.slice(offset, offset + limit);

    return {
      items: paginatedItems,
      pagination: {
        total: filteredItems.length,
        offset,
        limit,
        hasMore: offset + limit < filteredItems.length,
      },
      searchArea: {
        center: { latitude, longitude },
        radius,
        unit: 'meters',
      },
      summary: {
        totalFound: filteredItems.length,
        returned: paginatedItems.length,
        averageDistance: filteredItems.length > 0 ? 
          filteredItems.reduce((sum, item) => sum + item.distance, 0) / filteredItems.length : 0,
      },
    };
  } catch (err) {
    error('Failed to get flood data by location', err, { latitude, longitude, radius });
    throw err;
  }
}

/**
 * 전체 침수 데이터 조회
 * @param {Object} options - 조회 옵션
 * @returns {Promise<Object>} 침수 데이터
 */
async function getAllFloodData(options = {}) {
  try {
    let result;

    if (options.status) {
      // 상태별 조회
      result = await dynamoDBService.getItemsByStatus(options.status, {
        limit: options.limit,
      });
    } else {
      // 전체 스캔 (활성 데이터만)
      result = await dynamoDBService.scanItems({
        filterExpression: '#status = :status',
        expressionAttributeNames: { '#status': 'status' },
        expressionAttributeValues: { ':status': 'active' },
        limit: options.limit,
      });
    }

    let items = result.items || [];

    // 심각도 필터링
    if (options.severity) {
      items = items.filter(item => item.severity === options.severity);
    }

    // 타임스탬프 기준 정렬 (최신순)
    items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // 페이지네이션
    const offset = options.offset || 0;
    const paginatedItems = items.slice(offset, offset + (options.limit || 100));

    return {
      items: paginatedItems,
      pagination: {
        total: items.length,
        offset,
        limit: options.limit || 100,
        hasMore: result.lastEvaluatedKey !== undefined,
      },
      summary: {
        totalFound: items.length,
        returned: paginatedItems.length,
        severityDistribution: calculateSeverityDistribution(items),
      },
    };
  } catch (err) {
    error('Failed to get all flood data', err, options);
    throw err;
  }
}

/**
 * 단일 한강홍수통제소 API 데이터 조회
 * @param {string} apiType - API 타입
 * @returns {Promise<Object>} API 데이터
 */
async function getSingleHanRiverAPI(apiType) {
  try {
    let result;

    switch (apiType) {
      case 'waterlevel':
        result = await hanRiverService.fetchWaterLevelData();
        break;
      case 'realtime':
        result = await hanRiverService.fetchRealtimeData();
        break;
      case 'forecast':
        result = await hanRiverService.fetchForecastData();
        break;
      default:
        throw new Error(`Invalid API type: ${apiType}`);
    }

    return {
      [apiType]: result,
      metadata: {
        apiType,
        timestamp: new Date().toISOString(),
        dataCount: result.success ? result.data.length : 0,
      },
    };
  } catch (err) {
    error('Failed to get single Han River API data', err, { apiType });
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
 * @param {Array} items - 아이템 배열
 * @returns {Object} 심각도별 분포
 */
function calculateSeverityDistribution(items) {
  const distribution = { low: 0, medium: 0, high: 0 };
  
  items.forEach(item => {
    if (distribution[item.severity] !== undefined) {
      distribution[item.severity]++;
    }
  });
  
  return distribution;
}

module.exports = {
  getFloodData,
  getHanRiverData,
};