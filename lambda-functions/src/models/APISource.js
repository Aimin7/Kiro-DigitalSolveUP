// APISource 데이터 모델
// DynamoDB용 공공 API 정보 관리 모델

const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

/**
 * APISource 데이터 모델 클래스
 * 한강홍수통제소 API 소스 정보 관리
 */
class APISource {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.apiType = data.apiType;
    this.name = data.name;
    this.endpoint = data.endpoint;
    this.baseUrl = data.baseUrl;
    this.method = data.method || 'GET';
    this.headers = data.headers || {};
    this.parameters = data.parameters || {};
    this.lastUpdated = data.lastUpdated || new Date().toISOString();
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.responseFormat = data.responseFormat || 'json';
    this.updateInterval = data.updateInterval || 300000; // 5분
    this.timeout = data.timeout || 10000; // 10초
    this.retryCount = data.retryCount || 3;
    this.lastSuccessTime = data.lastSuccessTime || null;
    this.lastErrorTime = data.lastErrorTime || null;
    this.lastError = data.lastError || null;
    this.successCount = data.successCount || 0;
    this.errorCount = data.errorCount || 0;
    this.averageResponseTime = data.averageResponseTime || 0;
    this.dataQuality = data.dataQuality || {};
    this.metadata = data.metadata || {};
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * 한강홍수통제소 기본 API 소스들 생성
   * @returns {Array<APISource>} API 소스 배열
   */
  static createDefaultSources() {
    const baseUrl = process.env.HANRIVER_BASE_URL || 'http://211.188.52.85:9191';
    
    return [
      new APISource({
        apiType: 'waterlevel',
        name: '수위관측소 정보',
        endpoint: process.env.HANRIVER_WATERLEVEL_ENDPOINT || '/waterlevelinfo/info.json',
        baseUrl,
        method: 'GET',
        responseFormat: 'json',
        updateInterval: 300000, // 5분
        metadata: {
          description: '한강홍수통제소 수위관측소 정보 API',
          dataFields: ['stationId', 'stationName', 'waterLevel', 'alertLevel', 'dangerLevel'],
          coordinateSystem: 'WGS84',
        },
      }),
      new APISource({
        apiType: 'realtime',
        name: '실시간 수위 정보',
        endpoint: process.env.HANRIVER_REALTIME_ENDPOINT || '/getWaterLevel1D/list/1D/1018683/20230701/20230930.json',
        baseUrl,
        method: 'GET',
        responseFormat: 'json',
        updateInterval: 60000, // 1분
        metadata: {
          description: '한강홍수통제소 실시간 수위 정보 API',
          dataFields: ['stationId', 'waterLevel', 'flowRate', 'timestamp'],
          coordinateSystem: 'WGS84',
        },
      }),
      new APISource({
        apiType: 'forecast',
        name: '홍수예보발령 정보',
        endpoint: process.env.HANRIVER_FORECAST_ENDPOINT || '/fldfct/list/20230715.json',
        baseUrl,
        method: 'GET',
        responseFormat: 'json',
        updateInterval: 600000, // 10분
        metadata: {
          description: '한강홍수통제소 홍수예보발령 정보 API',
          dataFields: ['forecastId', 'region', 'alertType', 'issueTime', 'validUntil'],
          coordinateSystem: 'WGS84',
        },
      }),
    ];
  }

  /**
   * 완전한 API URL 생성
   * @returns {string} 완전한 URL
   */
  getFullUrl() {
    if (!this.baseUrl || !this.endpoint) {
      throw new Error('Base URL and endpoint are required');
    }
    
    const url = new URL(this.endpoint, this.baseUrl);
    
    // GET 파라미터 추가
    if (this.method === 'GET' && this.parameters) {
      Object.entries(this.parameters).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    return url.toString();
  }

  /**
   * API 호출 성공 기록
   * @param {number} responseTime - 응답 시간 (밀리초)
   * @param {Object} dataQuality - 데이터 품질 정보
   */
  recordSuccess(responseTime, dataQuality = {}) {
    this.lastSuccessTime = new Date().toISOString();
    this.successCount += 1;
    this.lastError = null;
    
    // 평균 응답 시간 계산
    if (this.averageResponseTime === 0) {
      this.averageResponseTime = responseTime;
    } else {
      this.averageResponseTime = (this.averageResponseTime + responseTime) / 2;
    }
    
    // 데이터 품질 정보 업데이트
    this.dataQuality = {
      ...this.dataQuality,
      ...dataQuality,
      lastQualityCheck: new Date().toISOString(),
    };
    
    this.updatedAt = new Date().toISOString();
  }

  /**
   * API 호출 실패 기록
   * @param {Error} error - 오류 정보
   */
  recordError(error) {
    this.lastErrorTime = new Date().toISOString();
    this.errorCount += 1;
    this.lastError = {
      message: error.message,
      code: error.code || 'UNKNOWN_ERROR',
      timestamp: new Date().toISOString(),
    };
    
    this.updatedAt = new Date().toISOString();
  }

  /**
   * API 상태 확인
   * @returns {Object} 상태 정보
   */
  getHealthStatus() {
    const now = Date.now();
    const lastSuccessAge = this.lastSuccessTime ? 
      now - new Date(this.lastSuccessTime).getTime() : null;
    const lastErrorAge = this.lastErrorTime ? 
      now - new Date(this.lastErrorTime).getTime() : null;
    
    // 성공률 계산
    const totalCalls = this.successCount + this.errorCount;
    const successRate = totalCalls > 0 ? this.successCount / totalCalls : 0;
    
    // 상태 결정
    let status = 'unknown';
    if (totalCalls === 0) {
      status = 'untested';
    } else if (successRate >= 0.9 && (!lastErrorAge || lastErrorAge > 3600000)) { // 1시간
      status = 'healthy';
    } else if (successRate >= 0.5) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }
    
    return {
      status,
      successRate,
      totalCalls,
      successCount: this.successCount,
      errorCount: this.errorCount,
      averageResponseTime: this.averageResponseTime,
      lastSuccessAge,
      lastErrorAge,
      lastError: this.lastError,
      isActive: this.isActive,
    };
  }

  /**
   * 데이터 신선도 확인
   * @returns {boolean} 신선한 데이터 여부
   */
  isFresh() {
    if (!this.lastSuccessTime) return false;
    
    const age = Date.now() - new Date(this.lastSuccessTime).getTime();
    return age <= this.updateInterval * 2; // 업데이트 간격의 2배 이내
  }

  /**
   * 다음 업데이트 시간 계산
   * @returns {Date} 다음 업데이트 시간
   */
  getNextUpdateTime() {
    if (!this.lastUpdated) return new Date();
    
    return new Date(new Date(this.lastUpdated).getTime() + this.updateInterval);
  }

  /**
   * 업데이트 필요 여부 확인
   * @returns {boolean} 업데이트 필요 여부
   */
  needsUpdate() {
    return Date.now() >= this.getNextUpdateTime().getTime();
  }

  /**
   * API 소스 비활성화
   * @param {string} reason - 비활성화 사유
   */
  deactivate(reason) {
    this.isActive = false;
    this.metadata.deactivationReason = reason;
    this.metadata.deactivatedAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * API 소스 활성화
   */
  activate() {
    this.isActive = true;
    delete this.metadata.deactivationReason;
    delete this.metadata.deactivatedAt;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * 데이터 유효성 검증
   * @returns {Object} 검증 결과
   */
  validate() {
    const schema = Joi.object({
      id: Joi.string().required(),
      apiType: Joi.string().valid('waterlevel', 'realtime', 'forecast').required(),
      name: Joi.string().required(),
      endpoint: Joi.string().required(),
      baseUrl: Joi.string().uri().required(),
      method: Joi.string().valid('GET', 'POST', 'PUT', 'DELETE').default('GET'),
      headers: Joi.object().default({}),
      parameters: Joi.object().default({}),
      lastUpdated: Joi.string().isoDate().required(),
      isActive: Joi.boolean().default(true),
      responseFormat: Joi.string().valid('json', 'xml', 'csv').default('json'),
      updateInterval: Joi.number().min(1000).default(300000),
      timeout: Joi.number().min(1000).default(10000),
      retryCount: Joi.number().min(0).default(3),
      lastSuccessTime: Joi.string().isoDate().allow(null),
      lastErrorTime: Joi.string().isoDate().allow(null),
      lastError: Joi.object().allow(null),
      successCount: Joi.number().min(0).default(0),
      errorCount: Joi.number().min(0).default(0),
      averageResponseTime: Joi.number().min(0).default(0),
      dataQuality: Joi.object().default({}),
      metadata: Joi.object().default({}),
      createdAt: Joi.string().isoDate().required(),
      updatedAt: Joi.string().isoDate().required(),
    });

    return schema.validate(this.toObject());
  }

  /**
   * DynamoDB 저장용 객체로 변환
   * @returns {Object} DynamoDB 아이템
   */
  toDynamoDBItem() {
    return {
      id: this.id,
      apiType: this.apiType,
      name: this.name,
      endpoint: this.endpoint,
      baseUrl: this.baseUrl,
      method: this.method,
      headers: this.headers,
      parameters: this.parameters,
      lastUpdated: this.lastUpdated,
      isActive: this.isActive,
      responseFormat: this.responseFormat,
      updateInterval: this.updateInterval,
      timeout: this.timeout,
      retryCount: this.retryCount,
      lastSuccessTime: this.lastSuccessTime,
      lastErrorTime: this.lastErrorTime,
      lastError: this.lastError,
      successCount: this.successCount,
      errorCount: this.errorCount,
      averageResponseTime: this.averageResponseTime,
      dataQuality: this.dataQuality,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * 일반 객체로 변환
   * @returns {Object} 일반 객체
   */
  toObject() {
    return {
      id: this.id,
      apiType: this.apiType,
      name: this.name,
      endpoint: this.endpoint,
      baseUrl: this.baseUrl,
      method: this.method,
      headers: this.headers,
      parameters: this.parameters,
      lastUpdated: this.lastUpdated,
      isActive: this.isActive,
      responseFormat: this.responseFormat,
      updateInterval: this.updateInterval,
      timeout: this.timeout,
      retryCount: this.retryCount,
      lastSuccessTime: this.lastSuccessTime,
      lastErrorTime: this.lastErrorTime,
      lastError: this.lastError,
      successCount: this.successCount,
      errorCount: this.errorCount,
      averageResponseTime: this.averageResponseTime,
      dataQuality: this.dataQuality,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * JSON 직렬화
   * @returns {Object} JSON 객체
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * DynamoDB 아이템에서 APISource 인스턴스 생성
   * @param {Object} item - DynamoDB 아이템
   * @returns {APISource} APISource 인스턴스
   */
  static fromDynamoDBItem(item) {
    return new APISource(item);
  }

  /**
   * API 타입별 기본 설정 가져오기
   * @param {string} apiType - API 타입
   * @returns {Object} 기본 설정
   */
  static getDefaultConfig(apiType) {
    const configs = {
      waterlevel: {
        updateInterval: 300000, // 5분
        timeout: 10000,
        retryCount: 3,
        expectedFields: ['stationId', 'stationName', 'waterLevel'],
      },
      realtime: {
        updateInterval: 60000, // 1분
        timeout: 8000,
        retryCount: 2,
        expectedFields: ['stationId', 'waterLevel', 'timestamp'],
      },
      forecast: {
        updateInterval: 600000, // 10분
        timeout: 15000,
        retryCount: 3,
        expectedFields: ['forecastId', 'region', 'alertType'],
      },
    };

    return configs[apiType] || {};
  }

  /**
   * 통계 정보 계산
   * @param {Array<APISource>} sources - API 소스 배열
   * @returns {Object} 통계 정보
   */
  static calculateStatistics(sources) {
    if (!sources || sources.length === 0) {
      return {
        totalSources: 0,
        activeSources: 0,
        healthySources: 0,
        averageSuccessRate: 0,
        averageResponseTime: 0,
      };
    }

    const activeSources = sources.filter(s => s.isActive);
    const healthyStatuses = sources.map(s => s.getHealthStatus());
    const healthySources = healthyStatuses.filter(s => s.status === 'healthy');
    
    const totalSuccessRate = healthyStatuses.reduce((sum, s) => sum + s.successRate, 0);
    const totalResponseTime = sources.reduce((sum, s) => sum + s.averageResponseTime, 0);

    return {
      totalSources: sources.length,
      activeSources: activeSources.length,
      healthySources: healthySources.length,
      averageSuccessRate: sources.length > 0 ? totalSuccessRate / sources.length : 0,
      averageResponseTime: sources.length > 0 ? totalResponseTime / sources.length : 0,
      byType: {
        waterlevel: sources.filter(s => s.apiType === 'waterlevel').length,
        realtime: sources.filter(s => s.apiType === 'realtime').length,
        forecast: sources.filter(s => s.apiType === 'forecast').length,
      },
    };
  }
}

module.exports = APISource;