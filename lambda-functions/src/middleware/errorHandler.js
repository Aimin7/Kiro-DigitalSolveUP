// errorHandler.js
// 한강홍수통제소 및 네이버 API 오류 처리 및 로깅 미들웨어

const { error, warn, info } = require('../utils/logger');
const { errorResponse } = require('../utils/response');

/**
 * 오류 처리 미들웨어 클래스
 */
class ErrorHandler {
  constructor() {
    this.errorCounts = new Map();
    this.errorPatterns = new Map();
    this.circuitBreakers = new Map();
  }

  /**
   * Lambda 함수용 오류 처리 래퍼
   * @param {Function} handler - Lambda 핸들러 함수
   * @returns {Function} 래핑된 핸들러
   */
  wrapLambdaHandler(handler) {
    return async (event, context) => {
      const startTime = Date.now();
      const requestId = context.awsRequestId;

      try {
        // 요청 로깅
        info('Lambda invocation started', {
          requestId,
          functionName: context.functionName,
          httpMethod: event.httpMethod,
          path: event.path,
          userAgent: event.headers?.['User-Agent'],
          sourceIp: event.requestContext?.identity?.sourceIp,
        });

        // 핸들러 실행
        const result = await handler(event, context);

        // 성공 로깅
        info('Lambda invocation completed', {
          requestId,
          statusCode: result.statusCode,
          duration: Date.now() - startTime,
        });

        return result;
      } catch (err) {
        // 오류 처리 및 로깅
        return this.handleLambdaError(err, event, context, startTime);
      }
    };
  }

  /**
   * Lambda 오류 처리
   * @param {Error} err - 발생한 오류
   * @param {Object} event - Lambda 이벤트
   * @param {Object} context - Lambda 컨텍스트
   * @param {number} startTime - 시작 시간
   * @returns {Object} 오류 응답
   */
  handleLambdaError(err, event, context, startTime) {
    const requestId = context.awsRequestId;
    const duration = Date.now() - startTime;

    // 오류 분류 및 로깅
    const errorInfo = this.classifyError(err);
    
    error('Lambda invocation failed', err, {
      requestId,
      functionName: context.functionName,
      httpMethod: event.httpMethod,
      path: event.path,
      duration,
      errorType: errorInfo.type,
      errorCode: errorInfo.code,
      isRetryable: errorInfo.retryable,
    });

    // 오류 통계 업데이트
    this.updateErrorStats(errorInfo.type, requestId);

    // 서킷 브레이커 확인
    this.checkCircuitBreaker(errorInfo.type);

    // 클라이언트 응답 생성
    return this.generateErrorResponse(errorInfo, requestId);
  }

  /**
   * 오류 분류
   * @param {Error} err - 오류 객체
   * @returns {Object} 분류된 오류 정보
   */
  classifyError(err) {
    const errorInfo = {
      type: 'UNKNOWN_ERROR',
      code: 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred',
      statusCode: 500,
      retryable: false,
      clientMessage: 'Internal server error',
    };

    // 네트워크 오류
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
      errorInfo.type = 'NETWORK_ERROR';
      errorInfo.code = err.code;
      errorInfo.statusCode = 503;
      errorInfo.retryable = true;
      errorInfo.clientMessage = 'Service temporarily unavailable';
    }
    // HTTP 오류
    else if (err.response) {
      const status = err.response.status;
      errorInfo.type = 'HTTP_ERROR';
      errorInfo.code = `HTTP_${status}`;
      errorInfo.statusCode = status;
      
      if (status >= 500) {
        errorInfo.retryable = true;
        errorInfo.clientMessage = 'External service error';
      } else if (status === 429) {
        errorInfo.type = 'RATE_LIMIT_ERROR';
        errorInfo.retryable = true;
        errorInfo.clientMessage = 'Rate limit exceeded';
      } else if (status >= 400) {
        errorInfo.retryable = false;
        errorInfo.clientMessage = 'Bad request';
      }
    }
    // 한강홍수통제소 API 오류
    else if (err.message.includes('HanRiver') || err.message.includes('한강홍수통제소')) {
      errorInfo.type = 'HANRIVER_API_ERROR';
      errorInfo.code = 'HANRIVER_API_FAILED';
      errorInfo.statusCode = 502;
      errorInfo.retryable = true;
      errorInfo.clientMessage = 'Flood data service temporarily unavailable';
    }
    // 네이버 API 오류
    else if (err.message.includes('Naver') || err.message.includes('네이버')) {
      errorInfo.type = 'NAVER_API_ERROR';
      errorInfo.code = 'NAVER_API_FAILED';
      errorInfo.statusCode = 502;
      errorInfo.retryable = true;
      errorInfo.clientMessage = 'Map service temporarily unavailable';
    }
    // DynamoDB 오류
    else if (err.code && err.code.startsWith('Dynamo')) {
      errorInfo.type = 'DATABASE_ERROR';
      errorInfo.code = err.code;
      errorInfo.statusCode = 503;
      errorInfo.retryable = true;
      errorInfo.clientMessage = 'Database service temporarily unavailable';
    }
    // 검증 오류
    else if (err.name === 'ValidationError' || err.message.includes('validation')) {
      errorInfo.type = 'VALIDATION_ERROR';
      errorInfo.code = 'VALIDATION_FAILED';
      errorInfo.statusCode = 400;
      errorInfo.retryable = false;
      errorInfo.clientMessage = 'Invalid request data';
    }
    // 권한 오류
    else if (err.code === 'AccessDenied' || err.message.includes('permission')) {
      errorInfo.type = 'PERMISSION_ERROR';
      errorInfo.code = 'ACCESS_DENIED';
      errorInfo.statusCode = 403;
      errorInfo.retryable = false;
      errorInfo.clientMessage = 'Access denied';
    }
    // 타임아웃 오류
    else if (err.code === 'TimeoutError' || err.message.includes('timeout')) {
      errorInfo.type = 'TIMEOUT_ERROR';
      errorInfo.code = 'REQUEST_TIMEOUT';
      errorInfo.statusCode = 504;
      errorInfo.retryable = true;
      errorInfo.clientMessage = 'Request timeout';
    }

    return errorInfo;
  }

  /**
   * 오류 통계 업데이트
   * @param {string} errorType - 오류 타입
   * @param {string} requestId - 요청 ID
   */
  updateErrorStats(errorType, requestId) {
    const now = Date.now();
    const windowSize = 300000; // 5분 윈도우

    if (!this.errorCounts.has(errorType)) {
      this.errorCounts.set(errorType, []);
    }

    const errors = this.errorCounts.get(errorType);
    errors.push({ timestamp: now, requestId });

    // 오래된 오류 제거 (5분 이상)
    const cutoff = now - windowSize;
    const recentErrors = errors.filter(e => e.timestamp > cutoff);
    this.errorCounts.set(errorType, recentErrors);

    // 오류 패턴 감지
    this.detectErrorPatterns(errorType, recentErrors);
  }

  /**
   * 오류 패턴 감지
   * @param {string} errorType - 오류 타입
   * @param {Array} recentErrors - 최근 오류 목록
   */
  detectErrorPatterns(errorType, recentErrors) {
    const errorCount = recentErrors.length;
    const timeWindow = 300000; // 5분

    // 높은 오류율 감지
    if (errorCount >= 10) {
      warn('High error rate detected', {
        errorType,
        errorCount,
        timeWindow: timeWindow / 1000,
      });

      this.errorPatterns.set(errorType, {
        pattern: 'HIGH_ERROR_RATE',
        count: errorCount,
        detectedAt: Date.now(),
      });
    }

    // 급격한 오류 증가 감지
    const lastMinute = recentErrors.filter(e => 
      e.timestamp > Date.now() - 60000
    ).length;

    if (lastMinute >= 5) {
      warn('Error spike detected', {
        errorType,
        errorsInLastMinute: lastMinute,
      });

      this.errorPatterns.set(errorType, {
        pattern: 'ERROR_SPIKE',
        count: lastMinute,
        detectedAt: Date.now(),
      });
    }
  }

  /**
   * 서킷 브레이커 확인
   * @param {string} errorType - 오류 타입
   */
  checkCircuitBreaker(errorType) {
    const errors = this.errorCounts.get(errorType) || [];
    const threshold = 20; // 5분간 20개 오류 시 서킷 브레이커 작동
    const timeWindow = 300000; // 5분

    if (errors.length >= threshold) {
      const circuitBreaker = {
        isOpen: true,
        openedAt: Date.now(),
        errorCount: errors.length,
        timeWindow,
      };

      this.circuitBreakers.set(errorType, circuitBreaker);

      error('Circuit breaker opened', {
        errorType,
        errorCount: errors.length,
        threshold,
      });

      // 30초 후 반개방 상태로 전환
      setTimeout(() => {
        const cb = this.circuitBreakers.get(errorType);
        if (cb && cb.isOpen) {
          cb.isOpen = false;
          cb.isHalfOpen = true;
          info('Circuit breaker half-opened', { errorType });
        }
      }, 30000);
    }
  }

  /**
   * 서킷 브레이커 상태 확인
   * @param {string} errorType - 오류 타입
   * @returns {Object|null} 서킷 브레이커 상태
   */
  getCircuitBreakerStatus(errorType) {
    return this.circuitBreakers.get(errorType) || null;
  }

  /**
   * 오류 응답 생성
   * @param {Object} errorInfo - 오류 정보
   * @param {string} requestId - 요청 ID
   * @returns {Object} HTTP 응답
   */
  generateErrorResponse(errorInfo, requestId) {
    const response = {
      error: {
        code: errorInfo.code,
        message: errorInfo.clientMessage,
        type: errorInfo.type,
        requestId,
        timestamp: new Date().toISOString(),
        retryable: errorInfo.retryable,
      },
    };

    // 재시도 가능한 오류인 경우 Retry-After 헤더 추가
    const headers = {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
    };

    if (errorInfo.retryable) {
      headers['Retry-After'] = '30'; // 30초 후 재시도
    }

    return {
      statusCode: errorInfo.statusCode,
      headers,
      body: JSON.stringify(response),
    };
  }

  /**
   * API별 오류 처리기
   * @param {string} apiType - API 타입 ('hanriver', 'naver')
   * @returns {Function} 오류 처리 함수
   */
  createAPIErrorHandler(apiType) {
    return (err, context = {}) => {
      const enhancedError = new Error(err.message);
      enhancedError.originalError = err;
      enhancedError.apiType = apiType;
      enhancedError.context = context;

      // API별 특별 처리
      if (apiType === 'hanriver') {
        enhancedError.message = `HanRiver API Error: ${err.message}`;
        
        // 한강홍수통제소 API 특정 오류 코드 처리
        if (err.response?.status === 503) {
          enhancedError.message = 'HanRiver API service temporarily unavailable';
        }
      } else if (apiType === 'naver') {
        enhancedError.message = `Naver API Error: ${err.message}`;
        
        // 네이버 API 특정 오류 코드 처리
        if (err.response?.status === 429) {
          enhancedError.message = 'Naver API rate limit exceeded';
        }
      }

      throw enhancedError;
    };
  }

  /**
   * 오류 통계 조회
   * @returns {Object} 오류 통계
   */
  getErrorStats() {
    const stats = {
      timestamp: new Date().toISOString(),
      errorTypes: {},
      circuitBreakers: {},
      patterns: {},
    };

    // 오류 타입별 통계
    this.errorCounts.forEach((errors, errorType) => {
      stats.errorTypes[errorType] = {
        count: errors.length,
        lastError: errors.length > 0 ? errors[errors.length - 1].timestamp : null,
      };
    });

    // 서킷 브레이커 상태
    this.circuitBreakers.forEach((cb, errorType) => {
      stats.circuitBreakers[errorType] = {
        isOpen: cb.isOpen,
        isHalfOpen: cb.isHalfOpen,
        openedAt: cb.openedAt,
        errorCount: cb.errorCount,
      };
    });

    // 오류 패턴
    this.errorPatterns.forEach((pattern, errorType) => {
      stats.patterns[errorType] = pattern;
    });

    return stats;
  }

  /**
   * 오류 통계 초기화
   */
  resetErrorStats() {
    this.errorCounts.clear();
    this.errorPatterns.clear();
    this.circuitBreakers.clear();
    info('Error statistics reset');
  }

  /**
   * 헬스 체크
   * @returns {Object} 헬스 체크 결과
   */
  healthCheck() {
    const stats = this.getErrorStats();
    const now = Date.now();
    
    let status = 'healthy';
    const issues = [];

    // 서킷 브레이커 확인
    Object.entries(stats.circuitBreakers).forEach(([errorType, cb]) => {
      if (cb.isOpen) {
        status = 'unhealthy';
        issues.push(`Circuit breaker open for ${errorType}`);
      }
    });

    // 높은 오류율 확인
    Object.entries(stats.errorTypes).forEach(([errorType, errorStats]) => {
      if (errorStats.count >= 10) {
        status = status === 'healthy' ? 'warning' : status;
        issues.push(`High error rate for ${errorType}: ${errorStats.count} errors`);
      }
    });

    return {
      status,
      timestamp: new Date().toISOString(),
      issues,
      stats,
    };
  }
}

// 싱글톤 인스턴스 생성
const errorHandler = new ErrorHandler();

module.exports = {
  ErrorHandler,
  errorHandler,
  
  // 편의 함수들
  wrapHandler: (handler) => errorHandler.wrapLambdaHandler(handler),
  createAPIErrorHandler: (apiType) => errorHandler.createAPIErrorHandler(apiType),
  getErrorStats: () => errorHandler.getErrorStats(),
  healthCheck: () => errorHandler.healthCheck(),
};