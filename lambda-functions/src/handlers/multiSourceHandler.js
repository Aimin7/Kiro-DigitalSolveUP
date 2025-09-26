// 다중 소스 데이터 Lambda 함수 구현
// GET /api/flood-data/multi-source/{locationId} Lambda 함수 (3개 API 정보 구분 조회)

const { success, error: errorResponse, notFound, validationError } = require('../utils/response');
const { logRequest, logResponse, error } = require('../utils/logger');
const DynamoDBService = require('../services/DynamoDBService');
const MultiSourceDataService = require('../services/MultiSourceDataService');
const Joi = require('joi');

// 서비스 인스턴스 생성
const dynamoDBService = new DynamoDBService();
const multiSourceService = new MultiSourceDataService(dynamoDBService);

/**
 * 다중 소스 데이터 조회 핸들러
 * GET /api/flood-data/multi-source/{locationId}
 */
async function getMultiSourceData(event, context) {
  const startTime = Date.now();
  
  try {
    logRequest(event, 'getMultiSourceData');

    // 경로 파라미터 검증
    const locationId = event.pathParameters?.locationId;
    if (!locationId) {
      const response = validationError('Location ID is required');
      logResponse(response, 'getMultiSourceData', Date.now() - startTime);
      return response;
    }

    // 쿼리 파라미터 검증
    const queryParams = event.queryStringParameters || {};
    const validationResult = validateMultiSourceQuery(queryParams);
    
    if (validationResult.error) {
      const response = validationError(
        'Invalid query parameters',
        validationResult.error.details
      );
      logResponse(response, 'getMultiSourceData', Date.now() - startTime);
      return response;
    }

    const { includeInactive, format } = validationResult.value;

    // 다중 소스 데이터 조회
    const multiSourceResult = await multiSourceService.getMultiSourceDataByLocation(locationId);

    if (!multiSourceResult.found) {
      const response = notFound(`Location data not found for ID: ${locationId}`);
      logResponse(response, 'getMultiSourceData', Date.now() - startTime);
      return response;
    }

    // 응답 데이터 포맷팅
    const responseData = formatMultiSourceResponse(
      multiSourceResult.data,
      { includeInactive, format }
    );

    const response = success(responseData);
    logResponse(response, 'getMultiSourceData', Date.now() - startTime);
    return response;

  } catch (err) {
    error('Failed to get multi-source data', err, {
      locationId: event.pathParameters?.locationId,
      queryParams: event.queryStringParameters,
    });

    const response = errorResponse(
      'Failed to retrieve multi-source data',
      500,
      'MULTI_SOURCE_ERROR'
    );
    logResponse(response, 'getMultiSourceData', Date.now() - startTime);
    return response;
  }
}

/**
 * 다중 소스 데이터 목록 조회 핸들러
 * GET /api/flood-data/multi-source
 */
async function getMultiSourceDataList(event, context) {
  const startTime = Date.now();
  
  try {
    logRequest(event, 'getMultiSourceDataList');

    // 쿼리 파라미터 검증
    const queryParams = event.queryStringParameters || {};
    const validationResult = validateMultiSourceListQuery(queryParams);
    
    if (validationResult.error) {
      const response = validationError(
        'Invalid query parameters',
        validationResult.error.details
      );
      logResponse(response, 'getMultiSourceDataList', Date.now() - startTime);
      return response;
    }

    const { 
      latitude, 
      longitude, 
      radius, 
      minSources, 
      severity, 
      limit, 
      offset 
    } = validationResult.value;

    let multiSourceDataList;

    // 위치 기반 조회
    if (latitude && longitude) {
      multiSourceDataList = await multiSourceService.getMultiSourceDataNearby(
        latitude,
        longitude,
        radius
      );
    } else {
      // 전체 조회
      multiSourceDataList = await getAllMultiSourceData({
        minSources,
        severity,
        limit,
        offset,
      });
    }

    // 필터링 적용
    let filteredData = multiSourceDataList;

    if (minSources > 1) {
      filteredData = filteredData.filter(item => 
        item.availableAPIs && item.availableAPIs.length >= minSources
      );
    }

    if (severity) {
      filteredData = filteredData.filter(item => {
        // 가장 높은 심각도 확인
        const maxSeverity = getMaxSeverityFromMultiSource(item);
        return maxSeverity === severity;
      });
    }

    // 페이지네이션 (위치 기반이 아닌 경우)
    if (!latitude || !longitude) {
      const paginatedData = filteredData.slice(offset, offset + limit);
      filteredData = paginatedData;
    }

    const responseData = {
      items: filteredData.map(item => formatMultiSourceSummary(item)),
      pagination: {
        total: filteredData.length,
        offset: offset || 0,
        limit: limit || 50,
        hasMore: filteredData.length === limit,
      },
      summary: {
        totalLocations: filteredData.length,
        multiSourceCount: filteredData.filter(item => 
          item.availableAPIs && item.availableAPIs.length > 1
        ).length,
        apiDistribution: calculateAPIDistribution(filteredData),
      },
    };

    if (latitude && longitude) {
      responseData.searchArea = {
        center: { latitude, longitude },
        radius: radius || 5000,
        unit: 'meters',
      };
    }

    const response = success(responseData);
    logResponse(response, 'getMultiSourceDataList', Date.now() - startTime);
    return response;

  } catch (err) {
    error('Failed to get multi-source data list', err, {
      queryParams: event.queryStringParameters,
    });

    const response = errorResponse(
      'Failed to retrieve multi-source data list',
      500,
      'MULTI_SOURCE_LIST_ERROR'
    );
    logResponse(response, 'getMultiSourceDataList', Date.now() - startTime);
    return response;
  }
}

/**
 * 다중 소스 통계 조회 핸들러
 * GET /api/flood-data/multi-source/statistics
 */
async function getMultiSourceStatistics(event, context) {
  const startTime = Date.now();
  
  try {
    logRequest(event, 'getMultiSourceStatistics');

    // 통계 데이터 조회
    const statistics = await multiSourceService.getMultiSourceStatistics();

    const response = success(statistics);
    logResponse(response, 'getMultiSourceStatistics', Date.now() - startTime);
    return response;

  } catch (err) {
    error('Failed to get multi-source statistics', err);

    const response = errorResponse(
      'Failed to retrieve multi-source statistics',
      500,
      'STATISTICS_ERROR'
    );
    logResponse(response, 'getMultiSourceStatistics', Date.now() - startTime);
    return response;
  }
}

/**
 * 쿼리 파라미터 검증 (다중 소스 데이터)
 * @param {Object} queryParams - 쿼리 파라미터
 * @returns {Object} 검증 결과
 */
function validateMultiSourceQuery(queryParams) {
  const schema = Joi.object({
    includeInactive: Joi.boolean().default(false),
    format: Joi.string().valid('detailed', 'summary').default('detailed'),
  });

  return schema.validate(queryParams);
}

/**
 * 쿼리 파라미터 검증 (다중 소스 데이터 목록)
 * @param {Object} queryParams - 쿼리 파라미터
 * @returns {Object} 검증 결과
 */
function validateMultiSourceListQuery(queryParams) {
  const schema = Joi.object({
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
    radius: Joi.number().min(100).max(50000).default(5000),
    minSources: Joi.number().min(1).max(3).default(1),
    severity: Joi.string().valid('low', 'medium', 'high'),
    limit: Joi.number().min(1).max(200).default(50),
    offset: Joi.number().min(0).default(0),
  }).with('latitude', 'longitude').with('longitude', 'latitude');

  return schema.validate(queryParams);
}

/**
 * 다중 소스 응답 데이터 포맷팅
 * @param {Object} multiSourceData - 다중 소스 데이터
 * @param {Object} options - 포맷팅 옵션
 * @returns {Object} 포맷팅된 응답 데이터
 */
function formatMultiSourceResponse(multiSourceData, options = {}) {
  const { includeInactive, format } = options;

  const baseResponse = {
    locationId: multiSourceData.locationId,
    coordinates: {
      latitude: multiSourceData.latitude,
      longitude: multiSourceData.longitude,
    },
    availableAPIs: multiSourceData.availableAPIs,
    lastUpdated: multiSourceData.lastUpdated,
    dataCount: multiSourceData.dataCount,
  };

  // API별 데이터 섹션
  const apiSections = {
    waterLevelData: formatAPISection(
      multiSourceData.waterLevelData,
      'waterlevel',
      { includeInactive, format }
    ),
    realtimeData: formatAPISection(
      multiSourceData.realtimeData,
      'realtime',
      { includeInactive, format }
    ),
    forecastData: formatAPISection(
      multiSourceData.forecastData,
      'forecast',
      { includeInactive, format }
    ),
  };

  return {
    ...baseResponse,
    ...apiSections,
    metadata: {
      responseFormat: format,
      includeInactive,
      generatedAt: new Date().toISOString(),
    },
  };
}

/**
 * API 섹션 포맷팅
 * @param {Object} apiData - API 데이터
 * @param {string} apiType - API 타입
 * @param {Object} options - 포맷팅 옵션
 * @returns {Object|null} 포맷팅된 API 섹션
 */
function formatAPISection(apiData, apiType, options = {}) {
  if (!apiData) {
    return {
      available: false,
      message: '해당 API 정보 없음',
      apiType,
    };
  }

  const section = {
    available: true,
    apiType,
    timestamp: apiData.timestamp,
    normalizedAt: apiData.normalizedAt,
  };

  if (options.format === 'summary') {
    // 요약 정보만 포함
    section.summary = createAPISummary(apiData, apiType);
  } else {
    // 상세 정보 포함
    section.data = apiData;
    section.summary = createAPISummary(apiData, apiType);
  }

  return section;
}

/**
 * API 요약 정보 생성
 * @param {Object} apiData - API 데이터
 * @param {string} apiType - API 타입
 * @returns {Object} 요약 정보
 */
function createAPISummary(apiData, apiType) {
  const summary = {
    apiType,
    hasData: !!apiData,
  };

  if (!apiData) return summary;

  switch (apiType) {
    case 'waterlevel':
      summary.stationName = apiData.stationName;
      summary.waterLevel = apiData.waterLevel;
      summary.alertLevel = apiData.alertLevel;
      summary.status = getWaterLevelStatus(apiData);
      break;

    case 'realtime':
      summary.waterLevel = apiData.waterLevel;
      summary.flowRate = apiData.flowRate;
      summary.measurementTime = apiData.timestamp;
      break;

    case 'forecast':
      summary.region = apiData.region;
      summary.alertType = apiData.alertType;
      summary.issueTime = apiData.issueTime;
      summary.validUntil = apiData.validUntil;
      summary.isActive = new Date(apiData.validUntil) > new Date();
      break;
  }

  return summary;
}

/**
 * 수위 상태 판단
 * @param {Object} waterLevelData - 수위 데이터
 * @returns {string} 수위 상태
 */
function getWaterLevelStatus(waterLevelData) {
  if (!waterLevelData.waterLevel) return 'unknown';

  const { waterLevel, alertLevel, dangerLevel } = waterLevelData;

  if (dangerLevel && waterLevel >= dangerLevel) return 'danger';
  if (alertLevel && waterLevel >= alertLevel) return 'alert';
  return 'normal';
}

/**
 * 다중 소스 요약 정보 포맷팅
 * @param {Object} item - 다중 소스 아이템
 * @returns {Object} 요약 정보
 */
function formatMultiSourceSummary(item) {
  return {
    locationId: item.locationId,
    coordinates: {
      latitude: item.latitude,
      longitude: item.longitude,
    },
    availableAPIs: item.availableAPIs,
    sourceCount: item.availableAPIs ? item.availableAPIs.length : 0,
    lastUpdated: item.lastUpdated,
    distance: item.distance, // 위치 기반 조회 시에만 포함
    maxSeverity: getMaxSeverityFromMultiSource(item),
    hasMultipleSources: item.availableAPIs && item.availableAPIs.length > 1,
  };
}

/**
 * 다중 소스에서 최대 심각도 추출
 * @param {Object} multiSourceItem - 다중 소스 아이템
 * @returns {string} 최대 심각도
 */
function getMaxSeverityFromMultiSource(multiSourceItem) {
  const severities = [];

  // 각 API에서 심각도 정보 추출
  if (multiSourceItem.waterLevelData) {
    const status = getWaterLevelStatus(multiSourceItem.waterLevelData);
    if (status === 'danger') severities.push('high');
    else if (status === 'alert') severities.push('medium');
    else severities.push('low');
  }

  if (multiSourceItem.forecastData) {
    const alertType = multiSourceItem.forecastData.alertType;
    if (alertType === '특보') severities.push('high');
    else if (alertType === '경보') severities.push('medium');
    else severities.push('low');
  }

  if (multiSourceItem.realtimeData) {
    // 실시간 데이터에서는 기본적으로 medium으로 설정
    severities.push('medium');
  }

  // 가장 높은 심각도 반환
  if (severities.includes('high')) return 'high';
  if (severities.includes('medium')) return 'medium';
  return 'low';
}

/**
 * 전체 다중 소스 데이터 조회
 * @param {Object} options - 조회 옵션
 * @returns {Promise<Array>} 다중 소스 데이터 배열
 */
async function getAllMultiSourceData(options = {}) {
  try {
    // 위치별로 그룹화된 데이터 조회
    const allData = await dynamoDBService.scanItems({
      filterExpression: '#status = :status',
      expressionAttributeNames: { '#status': 'status' },
      expressionAttributeValues: { ':status': 'active' },
      limit: options.limit * 3, // API 타입별로 여러 아이템이 있을 수 있음
    });

    // 위치별로 그룹화
    const locationGroups = new Map();
    
    allData.items.forEach(item => {
      if (!locationGroups.has(item.locationId)) {
        locationGroups.set(item.locationId, {
          locationId: item.locationId,
          latitude: item.latitude,
          longitude: item.longitude,
          availableAPIs: [],
          lastUpdated: item.timestamp,
          dataCount: 0,
        });
      }

      const group = locationGroups.get(item.locationId);
      
      if (!group.availableAPIs.includes(item.apiType)) {
        group.availableAPIs.push(item.apiType);
      }
      
      group.dataCount++;
      
      if (new Date(item.timestamp) > new Date(group.lastUpdated)) {
        group.lastUpdated = item.timestamp;
      }

      // API별 데이터 추가
      if (item.apiType === 'waterlevel' && item.originalData) {
        group.waterLevelData = item.originalData;
      } else if (item.apiType === 'realtime' && item.originalData) {
        group.realtimeData = item.originalData;
      } else if (item.apiType === 'forecast' && item.originalData) {
        group.forecastData = item.originalData;
      }
    });

    return Array.from(locationGroups.values());
  } catch (err) {
    error('Failed to get all multi-source data', err, options);
    throw err;
  }
}

/**
 * API 분포 계산
 * @param {Array} items - 아이템 배열
 * @returns {Object} API별 분포
 */
function calculateAPIDistribution(items) {
  const distribution = {
    waterlevel: 0,
    realtime: 0,
    forecast: 0,
    multiSource: 0,
  };

  items.forEach(item => {
    if (item.availableAPIs) {
      item.availableAPIs.forEach(api => {
        if (distribution[api] !== undefined) {
          distribution[api]++;
        }
      });

      if (item.availableAPIs.length > 1) {
        distribution.multiSource++;
      }
    }
  });

  return distribution;
}

module.exports = {
  getMultiSourceData,
  getMultiSourceDataList,
  getMultiSourceStatistics,
};