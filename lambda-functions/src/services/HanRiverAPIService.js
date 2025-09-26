// HanRiverAPIService 구현
// 한강홍수통제소 3개 API 개별 호출 및 데이터 수집 서비스
// 수위관측소, 실시간수위, 홍수예보발령 API 각각의 원본 정보 보존

const axios = require('axios');
const { info, error, debug, warn } = require('../utils/logger');
const environment = require('../config/environment');

/**
 * 한강홍수통제소 API 서비스 클래스
 */
class HanRiverAPIService {
  constructor() {
    this.baseUrl = environment.hanriver.baseUrl;
    this.endpoints = environment.hanriver.endpoints;
    this.timeout = 15000; // 15초
    this.retryCount = 3;
    this.retryDelay = 1000; // 1초
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
        'Content-Type': 'application/json',
        'User-Agent': 'FloodInfoApp/1.0',
      },
    });
  }

  /**
   * 재시도 로직이 포함된 HTTP 요청
   * @param {Function} requestFn - 요청 함수
   * @param {string} apiType - API 타입
   * @returns {Promise<Object>} 응답 결과
   */
  async requestWithRetry(requestFn, apiType) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.retryCount; attempt++) {
      try {
        debug(`Han River API request attempt ${attempt}`, { apiType });
        
        const startTime = Date.now();
        const response = await requestFn();
        const responseTime = Date.now() - startTime;
        
        info('Han River API request successful', { 
          apiType,
          attempt,
          responseTime,
          dataSize: JSON.stringify(response.data).length,
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
        warn(`Han River API request failed (attempt ${attempt})`, { 
          apiType,
          attempt,
          error: err.message,
          status: err.response?.status,
        });
        
        // 마지막 시도가 아니면 대기
        if (attempt < this.retryCount) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }
    
    error('Han River API request failed after all retries', lastError, { 
      apiType,
      attempts: this.retryCount,
    });
    
    return {
      success: false,
      error: {
        message: lastError.message,
        code: lastError.code || 'API_ERROR',
        status: lastError.response?.status,
        attempts: this.retryCount,
      },
      timestamp: new Date().toISOString(),
    };
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
   * 수위관측소 데이터 조회
   * @returns {Promise<Object>} 수위관측소 데이터
   */
  async fetchWaterLevelData() {
    const client = this.createHttpClient();
    
    return this.requestWithRetry(async () => {
      const response = await client.get(this.endpoints.waterlevel);
      
      // 응답 데이터 검증
      if (!response.data) {
        throw new Error('Empty response from water level API');
      }
      
      // 데이터 구조 정규화
      const normalizedData = this.normalizeWaterLevelResponse(response.data);
      
      return {
        ...response,
        data: normalizedData,
      };
    }, 'waterlevel');
  }

  /**
   * 실시간 수위 데이터 조회
   * @returns {Promise<Object>} 실시간 수위 데이터
   */
  async fetchRealtimeData() {
    const client = this.createHttpClient();
    
    return this.requestWithRetry(async () => {
      const response = await client.get(this.endpoints.realtime);
      
      // 응답 데이터 검증
      if (!response.data) {
        throw new Error('Empty response from realtime API');
      }
      
      // 데이터 구조 정규화
      const normalizedData = this.normalizeRealtimeResponse(response.data);
      
      return {
        ...response,
        data: normalizedData,
      };
    }, 'realtime');
  }

  /**
   * 홍수예보발령 데이터 조회
   * @returns {Promise<Object>} 홍수예보발령 데이터
   */
  async fetchForecastData() {
    const client = this.createHttpClient();
    
    return this.requestWithRetry(async () => {
      const response = await client.get(this.endpoints.forecast);
      
      // 응답 데이터 검증
      if (!response.data) {
        throw new Error('Empty response from forecast API');
      }
      
      // 데이터 구조 정규화
      const normalizedData = this.normalizeForecastResponse(response.data);
      
      return {
        ...response,
        data: normalizedData,
      };
    }, 'forecast');
  }

  /**
   * 모든 API 데이터 동시 조회
   * @returns {Promise<Object>} 모든 API 데이터
   */
  async fetchAllData() {
    debug('Fetching all Han River API data');
    
    const startTime = Date.now();
    
    // 모든 API를 병렬로 호출
    const [waterLevelResult, realtimeResult, forecastResult] = await Promise.allSettled([
      this.fetchWaterLevelData(),
      this.fetchRealtimeData(),
      this.fetchForecastData(),
    ]);
    
    const totalTime = Date.now() - startTime;
    
    // 결과 정리
    const results = {
      waterlevel: this.processSettledResult(waterLevelResult, 'waterlevel'),
      realtime: this.processSettledResult(realtimeResult, 'realtime'),
      forecast: this.processSettledResult(forecastResult, 'forecast'),
      metadata: {
        totalTime,
        timestamp: new Date().toISOString(),
        successCount: 0,
        errorCount: 0,
      },
    };
    
    // 성공/실패 카운트
    Object.values(results).forEach(result => {
      if (result.success) {
        results.metadata.successCount++;
      } else if (result.error) {
        results.metadata.errorCount++;
      }
    });
    
    info('Han River API batch fetch completed', {
      totalTime,
      successCount: results.metadata.successCount,
      errorCount: results.metadata.errorCount,
    });
    
    return results;
  }

  /**
   * Promise.allSettled 결과 처리
   * @param {Object} settledResult - Promise.allSettled 결과
   * @param {string} apiType - API 타입
   * @returns {Object} 처리된 결과
   */
  processSettledResult(settledResult, apiType) {
    if (settledResult.status === 'fulfilled') {
      return {
        ...settledResult.value,
        apiType,
        endpoint: this.endpoints[apiType],
      };
    } else {
      return {
        success: false,
        error: {
          message: settledResult.reason.message,
          code: 'API_ERROR',
        },
        apiType,
        endpoint: this.endpoints[apiType],
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 수위관측소 응답 데이터 정규화
   * @param {Object} rawData - 원본 응답 데이터
   * @returns {Array} 정규화된 데이터
   */
  normalizeWaterLevelResponse(rawData) {
    try {
      // 원본 데이터 구조에 따라 조정 필요
      let dataArray = rawData;
      
      // 응답이 객체이고 data 필드가 있는 경우
      if (rawData.data && Array.isArray(rawData.data)) {
        dataArray = rawData.data;
      }
      // 응답이 객체이고 list 필드가 있는 경우
      else if (rawData.list && Array.isArray(rawData.list)) {
        dataArray = rawData.list;
      }
      // 응답이 배열이 아닌 경우 배열로 변환
      else if (!Array.isArray(rawData)) {
        dataArray = [rawData];
      }
      
      return dataArray.map(item => ({
        stationId: item.stationId || item.stnId || item.id,
        stationName: item.stationName || item.stnNm || item.name,
        waterLevel: this.parseFloat(item.waterLevel || item.wl || item.level),
        alertLevel: this.parseFloat(item.alertLevel || item.alertWl || item.alert),
        dangerLevel: this.parseFloat(item.dangerLevel || item.dangerWl || item.danger),
        timestamp: this.parseTimestamp(item.timestamp || item.obsTime || item.time),
        coordinates: this.parseCoordinates(item),
        originalData: item, // 원본 데이터 보존
      }));
    } catch (err) {
      error('Failed to normalize water level response', err, { rawData });
      throw new Error(`Water level data normalization failed: ${err.message}`);
    }
  }

  /**
   * 실시간 수위 응답 데이터 정규화
   * @param {Object} rawData - 원본 응답 데이터
   * @returns {Array} 정규화된 데이터
   */
  normalizeRealtimeResponse(rawData) {
    try {
      let dataArray = rawData;
      
      if (rawData.data && Array.isArray(rawData.data)) {
        dataArray = rawData.data;
      } else if (rawData.list && Array.isArray(rawData.list)) {
        dataArray = rawData.list;
      } else if (!Array.isArray(rawData)) {
        dataArray = [rawData];
      }
      
      return dataArray.map(item => ({
        stationId: item.stationId || item.stnId || item.id,
        waterLevel: this.parseFloat(item.waterLevel || item.wl || item.level),
        flowRate: this.parseFloat(item.flowRate || item.flow || item.discharge),
        timestamp: this.parseTimestamp(item.timestamp || item.obsTime || item.time),
        coordinates: this.parseCoordinates(item),
        originalData: item, // 원본 데이터 보존
      }));
    } catch (err) {
      error('Failed to normalize realtime response', err, { rawData });
      throw new Error(`Realtime data normalization failed: ${err.message}`);
    }
  }

  /**
   * 홍수예보발령 응답 데이터 정규화
   * @param {Object} rawData - 원본 응답 데이터
   * @returns {Array} 정규화된 데이터
   */
  normalizeForecastResponse(rawData) {
    try {
      let dataArray = rawData;
      
      if (rawData.data && Array.isArray(rawData.data)) {
        dataArray = rawData.data;
      } else if (rawData.list && Array.isArray(rawData.list)) {
        dataArray = rawData.list;
      } else if (!Array.isArray(rawData)) {
        dataArray = [rawData];
      }
      
      return dataArray.map(item => ({
        forecastId: item.forecastId || item.fcstId || item.id,
        region: item.region || item.area || item.location,
        alertType: this.normalizeAlertType(item.alertType || item.alert || item.warning),
        issueTime: this.parseTimestamp(item.issueTime || item.issueDate || item.time),
        validUntil: this.parseTimestamp(item.validUntil || item.validTime || item.endTime),
        description: item.description || item.content || item.message,
        coordinates: this.parseCoordinates(item),
        originalData: item, // 원본 데이터 보존
      }));
    } catch (err) {
      error('Failed to normalize forecast response', err, { rawData });
      throw new Error(`Forecast data normalization failed: ${err.message}`);
    }
  }

  /**
   * 부동소수점 파싱
   * @param {*} value - 파싱할 값
   * @returns {number|null} 파싱된 숫자 또는 null
   */
  parseFloat(value) {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * 타임스탬프 파싱
   * @param {*} value - 파싱할 값
   * @returns {string|null} ISO 타임스탬프 또는 null
   */
  parseTimestamp(value) {
    if (!value) return null;
    
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date.toISOString();
    } catch (err) {
      warn('Failed to parse timestamp', { value });
      return null;
    }
  }

  /**
   * 좌표 파싱
   * @param {Object} item - 데이터 아이템
   * @returns {Object|null} 좌표 객체 또는 null
   */
  parseCoordinates(item) {
    try {
      let latitude = null;
      let longitude = null;
      
      // 다양한 좌표 필드명 시도
      const latFields = ['latitude', 'lat', 'y', 'yCoord'];
      const lngFields = ['longitude', 'lng', 'lon', 'x', 'xCoord'];
      
      for (const field of latFields) {
        if (item[field] !== undefined) {
          latitude = this.parseFloat(item[field]);
          break;
        }
      }
      
      for (const field of lngFields) {
        if (item[field] !== undefined) {
          longitude = this.parseFloat(item[field]);
          break;
        }
      }
      
      // 좌표 유효성 검사
      if (latitude !== null && longitude !== null &&
          latitude >= -90 && latitude <= 90 &&
          longitude >= -180 && longitude <= 180) {
        return { latitude, longitude };
      }
      
      return null;
    } catch (err) {
      warn('Failed to parse coordinates', { item });
      return null;
    }
  }

  /**
   * 경보 유형 정규화
   * @param {string} alertType - 원본 경보 유형
   * @returns {string} 정규화된 경보 유형
   */
  normalizeAlertType(alertType) {
    if (!alertType) return '주의보';
    
    const normalized = alertType.toString().toLowerCase();
    
    if (normalized.includes('특보') || normalized.includes('emergency')) {
      return '특보';
    } else if (normalized.includes('경보') || normalized.includes('warning')) {
      return '경보';
    } else {
      return '주의보';
    }
  }

  /**
   * API 상태 확인
   * @returns {Promise<Object>} API 상태 정보
   */
  async checkAPIHealth() {
    debug('Checking Han River API health');
    
    const healthChecks = await Promise.allSettled([
      this.checkEndpointHealth('waterlevel'),
      this.checkEndpointHealth('realtime'),
      this.checkEndpointHealth('forecast'),
    ]);
    
    const results = {
      waterlevel: this.processHealthCheck(healthChecks[0], 'waterlevel'),
      realtime: this.processHealthCheck(healthChecks[1], 'realtime'),
      forecast: this.processHealthCheck(healthChecks[2], 'forecast'),
      overall: {
        timestamp: new Date().toISOString(),
        healthyCount: 0,
        unhealthyCount: 0,
      },
    };
    
    // 전체 상태 계산
    Object.keys(results).forEach(key => {
      if (key !== 'overall') {
        if (results[key].healthy) {
          results.overall.healthyCount++;
        } else {
          results.overall.unhealthyCount++;
        }
      }
    });
    
    results.overall.status = results.overall.healthyCount === 3 ? 'healthy' : 
                            results.overall.healthyCount > 0 ? 'degraded' : 'unhealthy';
    
    info('Han River API health check completed', results.overall);
    
    return results;
  }

  /**
   * 개별 엔드포인트 상태 확인
   * @param {string} apiType - API 타입
   * @returns {Promise<Object>} 상태 확인 결과
   */
  async checkEndpointHealth(apiType) {
    const client = this.createHttpClient();
    const startTime = Date.now();
    
    try {
      const response = await client.get(this.endpoints[apiType]);
      const responseTime = Date.now() - startTime;
      
      return {
        healthy: true,
        responseTime,
        status: response.status,
        dataSize: JSON.stringify(response.data).length,
      };
    } catch (err) {
      const responseTime = Date.now() - startTime;
      
      return {
        healthy: false,
        responseTime,
        error: err.message,
        status: err.response?.status,
      };
    }
  }

  /**
   * 상태 확인 결과 처리
   * @param {Object} settledResult - Promise.allSettled 결과
   * @param {string} apiType - API 타입
   * @returns {Object} 처리된 상태 정보
   */
  processHealthCheck(settledResult, apiType) {
    const baseInfo = {
      apiType,
      endpoint: this.endpoints[apiType],
      timestamp: new Date().toISOString(),
    };
    
    if (settledResult.status === 'fulfilled') {
      return {
        ...baseInfo,
        ...settledResult.value,
      };
    } else {
      return {
        ...baseInfo,
        healthy: false,
        error: settledResult.reason.message,
      };
    }
  }

  /**
   * 데이터 품질 검사
   * @param {Object} apiData - API 데이터
   * @returns {Object} 품질 검사 결과
   */
  analyzeDataQuality(apiData) {
    const quality = {
      timestamp: new Date().toISOString(),
      apis: {},
      overall: {
        score: 0,
        issues: [],
      },
    };
    
    Object.keys(apiData).forEach(apiType => {
      if (apiType === 'metadata') return;
      
      const data = apiData[apiType];
      const apiQuality = {
        available: data.success,
        dataCount: data.success ? data.data.length : 0,
        completeness: 0,
        freshness: 0,
        issues: [],
      };
      
      if (data.success && data.data.length > 0) {
        // 완성도 검사
        apiQuality.completeness = this.calculateCompleteness(data.data, apiType);
        
        // 신선도 검사
        apiQuality.freshness = this.calculateFreshness(data.data);
        
        // 이상 데이터 검사
        apiQuality.issues = this.detectDataIssues(data.data, apiType);
      }
      
      quality.apis[apiType] = apiQuality;
    });
    
    // 전체 품질 점수 계산
    const apiScores = Object.values(quality.apis).map(api => {
      if (!api.available) return 0;
      return (api.completeness + api.freshness) / 2;
    });
    
    quality.overall.score = apiScores.length > 0 ? 
      apiScores.reduce((sum, score) => sum + score, 0) / apiScores.length : 0;
    
    // 전체 이슈 수집
    quality.overall.issues = Object.values(quality.apis)
      .flatMap(api => api.issues || []);
    
    return quality;
  }

  /**
   * 데이터 완성도 계산
   * @param {Array} data - 데이터 배열
   * @param {string} apiType - API 타입
   * @returns {number} 완성도 점수 (0-1)
   */
  calculateCompleteness(data, apiType) {
    if (!data || data.length === 0) return 0;
    
    const requiredFields = {
      waterlevel: ['stationId', 'waterLevel', 'coordinates'],
      realtime: ['stationId', 'waterLevel', 'timestamp'],
      forecast: ['forecastId', 'region', 'alertType'],
    };
    
    const required = requiredFields[apiType] || [];
    if (required.length === 0) return 1;
    
    let totalScore = 0;
    
    data.forEach(item => {
      let itemScore = 0;
      required.forEach(field => {
        if (item[field] !== null && item[field] !== undefined) {
          itemScore++;
        }
      });
      totalScore += itemScore / required.length;
    });
    
    return totalScore / data.length;
  }

  /**
   * 데이터 신선도 계산
   * @param {Array} data - 데이터 배열
   * @returns {number} 신선도 점수 (0-1)
   */
  calculateFreshness(data) {
    if (!data || data.length === 0) return 0;
    
    const now = Date.now();
    const maxAge = 3600000; // 1시간
    
    let totalFreshness = 0;
    let validTimestamps = 0;
    
    data.forEach(item => {
      if (item.timestamp) {
        const age = now - new Date(item.timestamp).getTime();
        const freshness = Math.max(0, 1 - (age / maxAge));
        totalFreshness += freshness;
        validTimestamps++;
      }
    });
    
    return validTimestamps > 0 ? totalFreshness / validTimestamps : 0.5;
  }

  /**
   * 데이터 이상 감지
   * @param {Array} data - 데이터 배열
   * @param {string} apiType - API 타입
   * @returns {Array} 이상 사항 목록
   */
  detectDataIssues(data, apiType) {
    const issues = [];
    
    if (!data || data.length === 0) {
      issues.push({ type: 'NO_DATA', severity: 'high' });
      return issues;
    }
    
    // 중복 데이터 검사
    const ids = data.map(item => item.stationId || item.forecastId).filter(Boolean);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      issues.push({ type: 'DUPLICATE_DATA', severity: 'medium' });
    }
    
    // 좌표 누락 검사
    const missingCoords = data.filter(item => !item.coordinates).length;
    if (missingCoords > data.length * 0.1) { // 10% 이상
      issues.push({ type: 'MISSING_COORDINATES', severity: 'medium', count: missingCoords });
    }
    
    // 수위 데이터 이상 검사 (waterlevel, realtime)
    if (apiType === 'waterlevel' || apiType === 'realtime') {
      const invalidLevels = data.filter(item => 
        item.waterLevel !== null && (item.waterLevel < -10 || item.waterLevel > 50)
      ).length;
      
      if (invalidLevels > 0) {
        issues.push({ type: 'INVALID_WATER_LEVEL', severity: 'high', count: invalidLevels });
      }
    }
    
    return issues;
  }
}

module.exports = HanRiverAPIService;