// refreshHandler.js
// 데이터 갱신 Lambda 함수 구현
// POST /api/flood-data/refresh

const { success, error: errorResponse, badRequest } = require('../utils/response');
const { info, error, debug } = require('../utils/logger');
const HanRiverAPIService = require('../services/HanRiverAPIService');
const DataNormalizationService = require('../services/DataNormalizationService');
const MultiSourceDataService = require('../services/MultiSourceDataService');

/**
 * 데이터 갱신 핸들러
 * @param {Object} event - Lambda 이벤트
 * @param {Object} context - Lambda 컨텍스트
 * @returns {Promise<Object>} HTTP 응답
 */
exports.refreshFloodData = async (event, context) => {
  try {
    debug('Starting flood data refresh', {
      requestId: context.awsRequestId,
      body: event.body,
    });

    // 요청 파라미터 파싱
    const body = event.body ? JSON.parse(event.body) : {};
    const {
      apiTypes = ['waterlevel', 'realtime', 'forecast'], // 갱신할 API 타입들
      forceRefresh = false, // 강제 갱신 여부
      region = null, // 특정 지역만 갱신
    } = body;

    // API 타입 검증
    const validApiTypes = ['waterlevel', 'realtime', 'forecast'];
    const invalidTypes = apiTypes.filter(type => !validApiTypes.includes(type));
    
    if (invalidTypes.length > 0) {
      return badRequest(`Invalid API types: ${invalidTypes.join(', ')}`);
    }

    // 서비스 인스턴스 생성
    const hanRiverService = new HanRiverAPIService();
    const normalizationService = new DataNormalizationService();
    const multiSourceService = new MultiSourceDataService();

    const refreshResults = {
      requestId: context.awsRequestId,
      timestamp: new Date().toISOString(),
      apiTypes,
      forceRefresh,
      region,
      results: {},
      summary: {
        totalProcessed: 0,
        totalStored: 0,
        totalUpdated: 0,
        totalErrors: 0,
        processingTime: 0,
      },
    };

    const startTime = Date.now();

    // 각 API 타입별로 데이터 갱신
    for (const apiType of apiTypes) {
      try {
        debug(`Refreshing ${apiType} data`, { apiType, region });
        
        const apiResult = await refreshAPIData(
          apiType,
          hanRiverService,
          normalizationService,
          multiSourceService,
          { forceRefresh, region }
        );

        refreshResults.results[apiType] = apiResult;
        refreshResults.summary.totalProcessed += apiResult.processed;
        refreshResults.summary.totalStored += apiResult.stored;
        refreshResults.summary.totalUpdated += apiResult.updated;
        refreshResults.summary.totalErrors += apiResult.errors;

        info(`${apiType} data refresh completed`, {
          processed: apiResult.processed,
          stored: apiResult.stored,
          updated: apiResult.updated,
          errors: apiResult.errors,
        });
      } catch (err) {
        error(`Failed to refresh ${apiType} data`, err);
        
        refreshResults.results[apiType] = {
          success: false,
          error: err.message,
          processed: 0,
          stored: 0,
          updated: 0,
          errors: 1,
        };
        
        refreshResults.summary.totalErrors++;
      }
    }

    refreshResults.summary.processingTime = Date.now() - startTime;

    // 전체 결과 로깅
    info('Flood data refresh completed', {
      requestId: context.awsRequestId,
      summary: refreshResults.summary,
      apiTypes,
    });

    return success(refreshResults);
  } catch (err) {
    error('Flood data refresh failed', err, {
      requestId: context.awsRequestId,
      event: {
        httpMethod: event.httpMethod,
        path: event.path,
        body: event.body,
      },
    });

    return errorResponse('Internal server error during data refresh');
  }
};

/**
 * 특정 API 타입의 데이터 갱신
 * @param {string} apiType - API 타입
 * @param {HanRiverAPIService} hanRiverService - 한강 API 서비스
 * @param {DataNormalizationService} normalizationService - 정규화 서비스
 * @param {MultiSourceDataService} multiSourceService - 다중 소스 서비스
 * @param {Object} options - 갱신 옵션
 * @returns {Promise<Object>} 갱신 결과
 */
async function refreshAPIData(apiType, hanRiverService, normalizationService, multiSourceService, options = {}) {
  const { forceRefresh, region } = options;
  
  try {
    debug(`Starting ${apiType} API data refresh`, { apiType, options });

    let rawData = [];
    let normalizedData = [];

    // API 타입별 데이터 수집
    switch (apiType) {
      case 'waterlevel':
        rawData = await hanRiverService.getWaterLevelStations(region);
        normalizedData = normalizationService.normalizeWaterLevelData(rawData);
        break;
        
      case 'realtime':
        rawData = await hanRiverService.getRealtimeWaterLevel(region);
        normalizedData = normalizationService.normalizeRealtimeData(rawData);
        break;
        
      case 'forecast':
        rawData = await hanRiverService.getFloodForecast(region);
        normalizedData = normalizationService.normalizeForecastData(rawData);
        break;
        
      default:
        throw new Error(`Unsupported API type: ${apiType}`);
    }

    if (normalizedData.length === 0) {
      return {
        success: true,
        apiType,
        processed: rawData.length,
        stored: 0,
        updated: 0,
        errors: 0,
        message: 'No valid data to store',
      };
    }

    // 다중 소스 데이터 저장
    const storeResult = await storeAPIData(apiType, normalizedData, multiSourceService, forceRefresh);

    return {
      success: true,
      apiType,
      processed: rawData.length,
      stored: storeResult.stored,
      updated: storeResult.updated,
      errors: storeResult.errors,
      dataQuality: {
        rawCount: rawData.length,
        normalizedCount: normalizedData.length,
        validationRate: normalizedData.length / rawData.length,
      },
    };
  } catch (err) {
    error(`Failed to refresh ${apiType} API data`, err);
    throw err;
  }
}

/**
 * API 데이터 저장
 * @param {string} apiType - API 타입
 * @param {Array} normalizedData - 정규화된 데이터
 * @param {MultiSourceDataService} multiSourceService - 다중 소스 서비스
 * @param {boolean} forceRefresh - 강제 갱신 여부
 * @returns {Promise<Object>} 저장 결과
 */
async function storeAPIData(apiType, normalizedData, multiSourceService, forceRefresh) {
  try {
    debug(`Storing ${apiType} data`, { 
      count: normalizedData.length, 
      forceRefresh 
    });

    let storeResult;

    // API 타입별 저장 방식
    switch (apiType) {
      case 'waterlevel':
        storeResult = await multiSourceService.storeMultiSourceData(
          normalizedData, [], [] // 수위관측소 데이터만
        );
        break;
        
      case 'realtime':
        storeResult = await multiSourceService.storeMultiSourceData(
          [], normalizedData, [] // 실시간 데이터만
        );
        break;
        
      case 'forecast':
        storeResult = await multiSourceService.storeMultiSourceData(
          [], [], normalizedData // 예보 데이터만
        );
        break;
        
      default:
        throw new Error(`Unsupported API type for storage: ${apiType}`);
    }

    if (!storeResult.success) {
      throw new Error('Failed to store data to multi-source service');
    }

    return {
      stored: storeResult.results.statistics.newItems,
      updated: storeResult.results.statistics.updatedItems,
      errors: storeResult.results.statistics.errorItems,
    };
  } catch (err) {
    error(`Failed to store ${apiType} data`, err);
    throw err;
  }
}

/**
 * 전체 데이터 갱신 (스케줄러용)
 * @param {Object} event - Lambda 이벤트
 * @param {Object} context - Lambda 컨텍스트
 * @returns {Promise<Object>} HTTP 응답
 */
exports.scheduledRefresh = async (event, context) => {
  try {
    debug('Starting scheduled flood data refresh', {
      requestId: context.awsRequestId,
      source: event.source,
    });

    // 스케줄된 갱신은 모든 API 타입을 대상으로 함
    const refreshEvent = {
      body: JSON.stringify({
        apiTypes: ['waterlevel', 'realtime', 'forecast'],
        forceRefresh: false,
        region: null,
      }),
      httpMethod: 'POST',
      path: '/api/flood-data/refresh',
    };

    const result = await exports.refreshFloodData(refreshEvent, context);
    
    info('Scheduled flood data refresh completed', {
      requestId: context.awsRequestId,
      statusCode: result.statusCode,
    });

    return result;
  } catch (err) {
    error('Scheduled flood data refresh failed', err, {
      requestId: context.awsRequestId,
    });

    return errorResponse('Scheduled refresh failed');
  }
};

/**
 * 데이터 품질 검사 및 정리
 * @param {Object} event - Lambda 이벤트
 * @param {Object} context - Lambda 컨텍스트
 * @returns {Promise<Object>} HTTP 응답
 */
exports.cleanupOldData = async (event, context) => {
  try {
    debug('Starting old data cleanup', {
      requestId: context.awsRequestId,
    });

    const queryParams = event.queryStringParameters || {};
    const maxAgeHours = parseInt(queryParams.maxAgeHours) || 24;

    const multiSourceService = new MultiSourceDataService();
    const cleanupResult = await multiSourceService.cleanupOldData(maxAgeHours);

    if (!cleanupResult.success) {
      return errorResponse('Failed to cleanup old data');
    }

    info('Old data cleanup completed', {
      requestId: context.awsRequestId,
      deletedCount: cleanupResult.deletedCount,
      maxAgeHours,
    });

    return success({
      message: 'Old data cleanup completed',
      deletedCount: cleanupResult.deletedCount,
      unprocessedCount: cleanupResult.unprocessedCount,
      maxAgeHours,
      cutoffTime: cleanupResult.cutoffTime,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    error('Old data cleanup failed', err, {
      requestId: context.awsRequestId,
    });

    return errorResponse('Old data cleanup failed');
  }
};

/**
 * 데이터 상태 확인
 * @param {Object} event - Lambda 이벤트
 * @param {Object} context - Lambda 컨텍스트
 * @returns {Promise<Object>} HTTP 응답
 */
exports.getDataStatus = async (event, context) => {
  try {
    debug('Getting data status', {
      requestId: context.awsRequestId,
    });

    const multiSourceService = new MultiSourceDataService();
    const statusResult = await multiSourceService.getAPIStatistics();

    if (!statusResult.success) {
      return errorResponse('Failed to get data status');
    }

    const status = {
      timestamp: new Date().toISOString(),
      apis: statusResult.data,
      overall: {
        totalAPIs: statusResult.data.overall.totalAPIs,
        availableAPIs: statusResult.data.overall.availableAPIs,
        totalDataPoints: statusResult.data.overall.totalDataPoints,
        healthScore: calculateHealthScore(statusResult.data),
      },
    };

    info('Data status retrieved', {
      requestId: context.awsRequestId,
      availableAPIs: status.overall.availableAPIs,
      totalDataPoints: status.overall.totalDataPoints,
      healthScore: status.overall.healthScore,
    });

    return success(status);
  } catch (err) {
    error('Failed to get data status', err, {
      requestId: context.awsRequestId,
    });

    return errorResponse('Failed to get data status');
  }
};

/**
 * 데이터 건강도 점수 계산
 * @param {Object} apiData - API 데이터 통계
 * @returns {number} 건강도 점수 (0-100)
 */
function calculateHealthScore(apiData) {
  const apis = ['waterlevel', 'realtime', 'forecast'];
  let score = 0;
  let maxScore = 0;

  apis.forEach(apiType => {
    maxScore += 100;
    
    if (apiData[apiType] && apiData[apiType].available) {
      score += 80; // 기본 점수
      
      // 데이터 수에 따른 추가 점수
      const dataCount = apiData[apiType].count;
      if (dataCount > 100) {
        score += 20;
      } else if (dataCount > 50) {
        score += 15;
      } else if (dataCount > 10) {
        score += 10;
      } else if (dataCount > 0) {
        score += 5;
      }
    }
  });

  return Math.round((score / maxScore) * 100);
}

/**
 * 특정 지역 데이터 갱신
 * @param {Object} event - Lambda 이벤트
 * @param {Object} context - Lambda 컨텍스트
 * @returns {Promise<Object>} HTTP 응답
 */
exports.refreshRegionData = async (event, context) => {
  try {
    debug('Starting region data refresh', {
      requestId: context.awsRequestId,
      pathParameters: event.pathParameters,
    });

    const region = event.pathParameters?.region;
    if (!region) {
      return badRequest('Region parameter is required');
    }

    // 지역별 갱신 이벤트 생성
    const refreshEvent = {
      body: JSON.stringify({
        apiTypes: ['waterlevel', 'realtime', 'forecast'],
        forceRefresh: false,
        region,
      }),
      httpMethod: 'POST',
      path: '/api/flood-data/refresh',
    };

    const result = await exports.refreshFloodData(refreshEvent, context);
    
    info('Region data refresh completed', {
      requestId: context.awsRequestId,
      region,
      statusCode: result.statusCode,
    });

    return result;
  } catch (err) {
    error('Region data refresh failed', err, {
      requestId: context.awsRequestId,
      region: event.pathParameters?.region,
    });

    return errorResponse('Region data refresh failed');
  }
};