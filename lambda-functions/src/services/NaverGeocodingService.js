// NaverGeocodingService 구현
// 네이버 Geocoding API 연동 서비스

const axios = require('axios');
const { info, error, debug, warn } = require('../utils/logger');
const environment = require('../config/environment');

/**
 * 네이버 지오코딩 서비스 클래스
 */
class NaverGeocodingService {
  constructor(options = {}) {
    this.clientId = environment.naver.clientId;
    this.clientSecret = environment.naver.clientSecret;
    this.baseUrl = 'https://naveropenapi.apigw.ntruss.com';
    this.timeout = options.timeout || 10000;
    this.retryCount = options.retryCount || 2;
    this.retryDelay = options.retryDelay || 1000;
    
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
        debug(`Naver API request attempt ${attempt}`, { operation });
        
        const startTime = Date.now();
        const response = await requestFn();
        const responseTime = Date.now() - startTime;
        
        info('Naver API request successful', { 
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

        // 특정 에러는 재시도하지 않음
        if (this.shouldNotRetry(err)) {
          error('Naver API request failed (non-retryable)', err, errorInfo);
          break;
        }
        
        warn(`Naver API request failed (attempt ${attempt})`, errorInfo);
        
        // 마지막 시도가 아니면 대기
        if (attempt < this.retryCount) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }
    
    const errorCode = this.getErrorCode(lastError);
    
    error('Naver API request failed after all retries', lastError, { 
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
    
    // 4xx 에러는 대부분 재시도하지 않음 (429 제외)
    if (status >= 400 && status < 500 && status !== 429) {
      return true;
    }
    
    return false;
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
      case 404: return 'NOT_FOUND';
      case 429: return 'RATE_LIMIT_ERROR';
      case 500: return 'SERVER_ERROR';
      default: return 'API_ERROR';
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
   * 주소를 좌표로 변환 (Geocoding)
   * @param {string} address - 주소
   * @returns {Promise<Object>} 좌표 변환 결과
   */
  async addressToCoordinates(address) {
    try {
      debug('Converting address to coordinates', { address });

      if (!address || typeof address !== 'string') {
        throw new Error('Valid address is required');
      }

      if (!this.clientId || !this.clientSecret) {
        throw new Error('Naver API credentials not configured');
      }

      const client = this.createHttpClient();
      
      return this.requestWithRetry(async () => {
        const response = await client.get('/map-geocode/v2/geocode', {
          params: {
            query: address,
          },
        });
        
        // 응답 데이터 검증
        if (!response.data || !response.data.addresses || response.data.addresses.length === 0) {
          throw new Error('No geocoding results found for the address');
        }
        
        const result = response.data.addresses[0];
        
        // 좌표 유효성 검사
        const latitude = parseFloat(result.y);
        const longitude = parseFloat(result.x);
        
        if (isNaN(latitude) || isNaN(longitude)) {
          throw new Error('Invalid coordinates in geocoding response');
        }
        
        return {
          ...response,
          data: {
            latitude,
            longitude,
            address: result.roadAddress || result.jibunAddress,
            roadAddress: result.roadAddress,
            jibunAddress: result.jibunAddress,
            englishAddress: result.englishAddress,
            addressElements: result.addressElements,
            accuracy: this.parseAccuracy(result),
            matchLevel: this.parseMatchLevel(result),
          },
        };
      }, 'addressToCoordinates');
    } catch (err) {
      error('Failed to convert address to coordinates', err, { address });
      
      return {
        success: false,
        error: {
          message: err.message,
          code: 'GEOCODING_ERROR',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 좌표를 주소로 변환 (Reverse Geocoding)
   * @param {number} latitude - 위도
   * @param {number} longitude - 경도
   * @returns {Promise<Object>} 주소 변환 결과
   */
  async coordinatesToAddress(latitude, longitude) {
    try {
      debug('Converting coordinates to address', { latitude, longitude });

      // 좌표 유효성 검사
      if (!this.isValidCoordinate(latitude, longitude)) {
        throw new Error('Invalid coordinates provided');
      }

      if (!this.clientId || !this.clientSecret) {
        throw new Error('Naver API credentials not configured');
      }

      const client = this.createHttpClient();
      
      return this.requestWithRetry(async () => {
        const response = await client.get('/map-reversegeocode/v2/gc', {
          params: {
            coords: `${longitude},${latitude}`,
            sourcecrs: 'epsg:4326',
            targetcrs: 'epsg:4326',
            orders: 'roadaddr,legalcode,admcode',
            output: 'json',
          },
        });
        
        // 응답 데이터 검증
        if (!response.data || !response.data.results || response.data.results.length === 0) {
          throw new Error('No reverse geocoding results found for the coordinates');
        }
        
        const result = response.data.results[0];
        const region = result.region;
        
        return {
          ...response,
          data: {
            address: this.buildFullAddress(region),
            roadAddress: this.buildRoadAddress(region),
            region: {
              area1: region.area1?.name || '',
              area2: region.area2?.name || '',
              area3: region.area3?.name || '',
              area4: region.area4?.name || '',
            },
            land: result.land,
            coordinates: {
              latitude,
              longitude,
            },
          },
        };
      }, 'coordinatesToAddress');
    } catch (err) {
      error('Failed to convert coordinates to address', err, { latitude, longitude });
      
      return {
        success: false,
        error: {
          message: err.message,
          code: 'REVERSE_GEOCODING_ERROR',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 좌표 유효성 검사
   * @param {number} latitude - 위도
   * @param {number} longitude - 경도
   * @returns {boolean} 유효성 여부
   */
  isValidCoordinate(latitude, longitude) {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return false;
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      return false;
    }

    if (latitude < -90 || latitude > 90) {
      return false;
    }

    if (longitude < -180 || longitude > 180) {
      return false;
    }

    return true;
  }

  /**
   * 정확도 정보 파싱
   * @param {Object} result - 지오코딩 결과
   * @returns {string} 정확도 레벨
   */
  parseAccuracy(result) {
    // 네이버 API의 정확도 정보 파싱
    if (result.addressElements) {
      const types = result.addressElements.map(el => el.types).flat();
      
      if (types.includes('BUILDING_NUMBER')) return 'building';
      if (types.includes('ROAD_NAME')) return 'street';
      if (types.includes('AREA')) return 'area';
    }
    
    return 'unknown';
  }

  /**
   * 매치 레벨 파싱
   * @param {Object} result - 지오코딩 결과
   * @returns {string} 매치 레벨
   */
  parseMatchLevel(result) {
    if (result.roadAddress && result.jibunAddress) return 'exact';
    if (result.roadAddress || result.jibunAddress) return 'partial';
    return 'approximate';
  }

  /**
   * 전체 주소 구성
   * @param {Object} region - 지역 정보
   * @returns {string} 전체 주소
   */
  buildFullAddress(region) {
    const parts = [];
    
    if (region.area1?.name) parts.push(region.area1.name);
    if (region.area2?.name) parts.push(region.area2.name);
    if (region.area3?.name) parts.push(region.area3.name);
    if (region.area4?.name) parts.push(region.area4.name);
    
    return parts.join(' ');
  }

  /**
   * 도로명 주소 구성
   * @param {Object} region - 지역 정보
   * @returns {string} 도로명 주소
   */
  buildRoadAddress(region) {
    const parts = [];
    
    if (region.area1?.name) parts.push(region.area1.name);
    if (region.area2?.name) parts.push(region.area2.name);
    if (region.area3?.name) parts.push(region.area3.name);
    
    return parts.join(' ');
  }

  /**
   * 배치 지오코딩 (여러 주소 동시 처리)
   * @param {Array<string>} addresses - 주소 배열
   * @returns {Promise<Array>} 변환 결과 배열
   */
  async batchAddressToCoordinates(addresses) {
    try {
      debug('Starting batch geocoding', { count: addresses.length });

      if (!Array.isArray(addresses) || addresses.length === 0) {
        throw new Error('Valid addresses array is required');
      }

      // 동시 요청 수 제한 (API 제한 고려)
      const batchSize = 5;
      const results = [];
      
      for (let i = 0; i < addresses.length; i += batchSize) {
        const batch = addresses.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (address, index) => {
          try {
            const result = await this.addressToCoordinates(address);
            return {
              index: i + index,
              address,
              ...result,
            };
          } catch (err) {
            return {
              index: i + index,
              address,
              success: false,
              error: {
                message: err.message,
                code: 'BATCH_GEOCODING_ERROR',
              },
            };
          }
        });
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // API 제한을 고려한 지연
        if (i + batchSize < addresses.length) {
          await this.delay(100);
        }
      }

      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;

      info('Batch geocoding completed', {
        totalAddresses: addresses.length,
        successCount,
        failureCount,
        successRate: successCount / addresses.length,
      });

      return {
        success: true,
        results,
        summary: {
          total: addresses.length,
          successful: successCount,
          failed: failureCount,
          successRate: successCount / addresses.length,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      error('Failed to perform batch geocoding', err, { addressCount: addresses.length });
      throw new Error(`Batch geocoding failed: ${err.message}`);
    }
  }

  /**
   * 지오코딩 서비스 상태 확인
   * @returns {Promise<Object>} 서비스 상태
   */
  async checkServiceHealth() {
    try {
      debug('Checking Naver Geocoding service health');

      if (!this.clientId || !this.clientSecret) {
        return {
          healthy: false,
          error: 'API credentials not configured',
          timestamp: new Date().toISOString(),
        };
      }

      // 테스트 주소로 상태 확인
      const testAddress = '서울특별시 중구 세종대로 110';
      const startTime = Date.now();
      
      const result = await this.addressToCoordinates(testAddress);
      const responseTime = Date.now() - startTime;

      const health = {
        healthy: result.success,
        responseTime,
        testAddress,
        timestamp: new Date().toISOString(),
      };

      if (!result.success) {
        health.error = result.error;
      }

      info('Naver Geocoding service health check completed', health);

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

  /**
   * API 사용량 통계 (추정)
   * @returns {Object} 사용량 통계
   */
  getUsageStatistics() {
    // 실제 구현에서는 사용량을 추적하는 로직 필요
    return {
      requestCount: 0,
      successCount: 0,
      errorCount: 0,
      averageResponseTime: 0,
      lastRequestTime: null,
      rateLimitStatus: 'unknown',
    };
  }

  /**
   * 좌표 정규화
   * @param {number} latitude - 위도
   * @param {number} longitude - 경도
   * @param {number} precision - 정밀도 (소수점 자릿수)
   * @returns {Object} 정규화된 좌표
   */
  normalizeCoordinates(latitude, longitude, precision = 6) {
    if (!this.isValidCoordinate(latitude, longitude)) {
      throw new Error('Invalid coordinates for normalization');
    }

    const factor = Math.pow(10, precision);
    
    return {
      latitude: Math.round(latitude * factor) / factor,
      longitude: Math.round(longitude * factor) / factor,
      precision,
    };
  }

  /**
   * 두 좌표 간 거리 계산
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
}

module.exports = NaverGeocodingService;