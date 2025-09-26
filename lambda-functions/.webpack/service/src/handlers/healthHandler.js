/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 1626:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// 로깅 유틸리티

const environment = __webpack_require__(2508);

/**
 * 로그 레벨 정의
 */
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

/**
 * 현재 로그 레벨 설정
 */
const currentLogLevel = environment.isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;

/**
 * 로그 메시지 포맷팅
 * @param {string} level - 로그 레벨
 * @param {string} message - 메시지
 * @param {Object} meta - 추가 메타데이터
 * @returns {Object} 포맷된 로그 객체
 */
function formatLog(level, message, meta = {}) {
  return _objectSpread({
    timestamp: new Date().toISOString(),
    level,
    message,
    stage: environment.stage
  }, meta);
}

/**
 * 로그 출력 함수
 * @param {number} level - 로그 레벨 숫자
 * @param {string} levelName - 로그 레벨 이름
 * @param {string} message - 메시지
 * @param {Object} meta - 추가 메타데이터
 */
function log(level, levelName, message, meta = {}) {
  if (level <= currentLogLevel) {
    const logData = formatLog(levelName, message, meta);
    if (level === LOG_LEVELS.ERROR) {
      console.error(JSON.stringify(logData));
    } else if (level === LOG_LEVELS.WARN) {
      console.warn(JSON.stringify(logData));
    } else {
      console.log(JSON.stringify(logData));
    }
  }
}

/**
 * 에러 로그
 * @param {string} message - 메시지
 * @param {Error|Object} error - 에러 객체
 * @param {Object} meta - 추가 메타데이터
 */
function error(message, error = null, meta = {}) {
  const errorMeta = _objectSpread(_objectSpread({}, meta), {}, {
    error: error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : null
  });
  log(LOG_LEVELS.ERROR, 'ERROR', message, errorMeta);
}

/**
 * 경고 로그
 * @param {string} message - 메시지
 * @param {Object} meta - 추가 메타데이터
 */
function warn(message, meta = {}) {
  log(LOG_LEVELS.WARN, 'WARN', message, meta);
}

/**
 * 정보 로그
 * @param {string} message - 메시지
 * @param {Object} meta - 추가 메타데이터
 */
function info(message, meta = {}) {
  log(LOG_LEVELS.INFO, 'INFO', message, meta);
}

/**
 * 디버그 로그
 * @param {string} message - 메시지
 * @param {Object} meta - 추가 메타데이터
 */
function debug(message, meta = {}) {
  log(LOG_LEVELS.DEBUG, 'DEBUG', message, meta);
}

/**
 * API 요청 로그
 * @param {Object} event - Lambda 이벤트 객체
 * @param {string} functionName - 함수명
 */
function logRequest(event, functionName) {
  info('API Request', {
    function: functionName,
    httpMethod: event.httpMethod,
    path: event.path,
    queryStringParameters: event.queryStringParameters,
    headers: {
      'user-agent': event.headers?.['user-agent'],
      'x-forwarded-for': event.headers?.['x-forwarded-for']
    }
  });
}

/**
 * API 응답 로그
 * @param {Object} response - Lambda 응답 객체
 * @param {string} functionName - 함수명
 * @param {number} duration - 실행 시간 (ms)
 */
function logResponse(response, functionName, duration) {
  info('API Response', {
    function: functionName,
    statusCode: response.statusCode,
    duration: `${duration}ms`
  });
}
module.exports = {
  error,
  warn,
  info,
  debug,
  logRequest,
  logResponse,
  LOG_LEVELS
};

/***/ }),

/***/ 2508:
/***/ ((module) => {

// 환경 변수 설정 및 검증

const requiredEnvVars = ['STAGE', 'REGION', 'DYNAMODB_TABLE_NAME'];
const optionalEnvVars = (/* unused pure expression or super */ null && (['NAVER_CLIENT_ID', 'NAVER_CLIENT_SECRET', 'HANRIVER_BASE_URL', 'HANRIVER_WATERLEVEL_ENDPOINT', 'HANRIVER_REALTIME_ENDPOINT', 'HANRIVER_FORECAST_ENDPOINT']));

// 환경 변수 검증
function validateEnvironment() {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// 환경 변수 객체 생성
const environment = {
  // 기본 설정
  stage: process.env.STAGE,
  region: process.env.REGION,
  nodeEnv: "production" || 0,
  // AWS 설정
  dynamodbTableName: process.env.DYNAMODB_TABLE_NAME,
  // 네이버 API 설정
  naver: {
    clientId: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET
  },
  // 한강홍수통제소 API 설정
  hanriver: {
    baseUrl: process.env.HANRIVER_BASE_URL || 'http://211.188.52.85:9191',
    endpoints: {
      waterlevel: process.env.HANRIVER_WATERLEVEL_ENDPOINT || '/waterlevelinfo/info.json',
      realtime: process.env.HANRIVER_REALTIME_ENDPOINT || '/getWaterLevel1D/list/1D/1018683/20230701/20230930.json',
      forecast: process.env.HANRIVER_FORECAST_ENDPOINT || '/fldfct/list/20230715.json'
    }
  },
  // 개발 환경 여부
  isDevelopment: "production" === 'development',
  isTest: "production" === 'test',
  isProduction: "production" === 'production',
  isOffline: process.env.IS_OFFLINE === 'true'
};

// 환경 변수 검증 실행 (테스트 환경 제외)
if (!environment.isTest) {
  validateEnvironment();
}
module.exports = environment;

/***/ }),

/***/ 2589:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// errorHandler.js
// 한강홍수통제소 및 네이버 API 오류 처리 및 로깅 미들웨어

const {
  error,
  warn,
  info
} = __webpack_require__(1626);
const {
  errorResponse
} = __webpack_require__(9021);

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
          sourceIp: event.requestContext?.identity?.sourceIp
        });

        // 핸들러 실행
        const result = await handler(event, context);

        // 성공 로깅
        info('Lambda invocation completed', {
          requestId,
          statusCode: result.statusCode,
          duration: Date.now() - startTime
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
      isRetryable: errorInfo.retryable
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
      clientMessage: 'Internal server error'
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
    errors.push({
      timestamp: now,
      requestId
    });

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
        timeWindow: timeWindow / 1000
      });
      this.errorPatterns.set(errorType, {
        pattern: 'HIGH_ERROR_RATE',
        count: errorCount,
        detectedAt: Date.now()
      });
    }

    // 급격한 오류 증가 감지
    const lastMinute = recentErrors.filter(e => e.timestamp > Date.now() - 60000).length;
    if (lastMinute >= 5) {
      warn('Error spike detected', {
        errorType,
        errorsInLastMinute: lastMinute
      });
      this.errorPatterns.set(errorType, {
        pattern: 'ERROR_SPIKE',
        count: lastMinute,
        detectedAt: Date.now()
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
        timeWindow
      };
      this.circuitBreakers.set(errorType, circuitBreaker);
      error('Circuit breaker opened', {
        errorType,
        errorCount: errors.length,
        threshold
      });

      // 30초 후 반개방 상태로 전환
      setTimeout(() => {
        const cb = this.circuitBreakers.get(errorType);
        if (cb && cb.isOpen) {
          cb.isOpen = false;
          cb.isHalfOpen = true;
          info('Circuit breaker half-opened', {
            errorType
          });
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
        retryable: errorInfo.retryable
      }
    };

    // 재시도 가능한 오류인 경우 Retry-After 헤더 추가
    const headers = {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId
    };
    if (errorInfo.retryable) {
      headers['Retry-After'] = '30'; // 30초 후 재시도
    }
    return {
      statusCode: errorInfo.statusCode,
      headers,
      body: JSON.stringify(response)
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
      patterns: {}
    };

    // 오류 타입별 통계
    this.errorCounts.forEach((errors, errorType) => {
      stats.errorTypes[errorType] = {
        count: errors.length,
        lastError: errors.length > 0 ? errors[errors.length - 1].timestamp : null
      };
    });

    // 서킷 브레이커 상태
    this.circuitBreakers.forEach((cb, errorType) => {
      stats.circuitBreakers[errorType] = {
        isOpen: cb.isOpen,
        isHalfOpen: cb.isHalfOpen,
        openedAt: cb.openedAt,
        errorCount: cb.errorCount
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
      stats
    };
  }
}

// 싱글톤 인스턴스 생성
const errorHandler = new ErrorHandler();
module.exports = {
  ErrorHandler,
  errorHandler,
  // 편의 함수들
  wrapHandler: handler => errorHandler.wrapLambdaHandler(handler),
  createAPIErrorHandler: apiType => errorHandler.createAPIErrorHandler(apiType),
  getErrorStats: () => errorHandler.getErrorStats(),
  healthCheck: () => errorHandler.healthCheck()
};

/***/ }),

/***/ 3778:
/***/ ((module) => {

"use strict";
module.exports = require("aws-sdk");

/***/ }),

/***/ 8157:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// security.js
// 크로스 오리진 요청 처리 및 AWS 환경 보안 설정 미들웨어

const {
  info,
  warn,
  error
} = __webpack_require__(1626);

/**
 * 보안 미들웨어 클래스
 */
class SecurityMiddleware {
  constructor() {
    this.allowedOrigins = this.getAllowedOrigins();
    this.rateLimitStore = new Map();
    this.ipWhitelist = this.getIPWhitelist();
    this.ipBlacklist = this.getIPBlacklist();
  }

  /**
   * 허용된 오리진 목록 가져오기
   * @returns {Array} 허용된 오리진 목록
   */
  getAllowedOrigins() {
    const origins = process.env.ALLOWED_ORIGINS || '';
    const defaultOrigins = ['http://localhost:3000', 'http://localhost:5173',
    // Vite 기본 포트
    'https://localhost:3000', 'https://localhost:5173'];
    if (origins) {
      return origins.split(',').map(origin => origin.trim());
    }

    // 프로덕션 환경에서는 환경 변수 필수
    if (true) {
      warn('ALLOWED_ORIGINS not set in production environment');
      return [];
    }
    // removed by dead control flow

  }

  /**
   * IP 화이트리스트 가져오기
   * @returns {Array} IP 화이트리스트
   */
  getIPWhitelist() {
    const whitelist = process.env.IP_WHITELIST || '';
    return whitelist ? whitelist.split(',').map(ip => ip.trim()) : [];
  }

  /**
   * IP 블랙리스트 가져오기
   * @returns {Array} IP 블랙리스트
   */
  getIPBlacklist() {
    const blacklist = process.env.IP_BLACKLIST || '';
    return blacklist ? blacklist.split(',').map(ip => ip.trim()) : [];
  }

  /**
   * CORS 헤더 생성
   * @param {string} origin - 요청 오리진
   * @param {string} method - HTTP 메서드
   * @returns {Object} CORS 헤더
   */
  generateCORSHeaders(origin, method = 'GET') {
    const isOriginAllowed = this.isOriginAllowed(origin);
    const headers = {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-API-Key',
      'Access-Control-Max-Age': '86400',
      // 24시간
      'Vary': 'Origin'
    };
    if (isOriginAllowed) {
      headers['Access-Control-Allow-Origin'] = origin;
      headers['Access-Control-Allow-Credentials'] = 'true';
    } else {
      // 오리진이 허용되지 않은 경우 와일드카드 사용 (자격 증명 없이)
      headers['Access-Control-Allow-Origin'] = '*';
      headers['Access-Control-Allow-Credentials'] = 'false';
    }
    return headers;
  }

  /**
   * 오리진 허용 여부 확인
   * @param {string} origin - 요청 오리진
   * @returns {boolean} 허용 여부
   */
  isOriginAllowed(origin) {
    if (!origin) return false;

    // 정확한 매치
    if (this.allowedOrigins.includes(origin)) {
      return true;
    }

    // 와일드카드 패턴 매치
    return this.allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        const pattern = allowedOrigin.replace(/\*/g, '.*');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(origin);
      }
      return false;
    });
  }

  /**
   * 보안 헤더 생성
   * @returns {Object} 보안 헤더
   */
  generateSecurityHeaders() {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
  }

  /**
   * IP 주소 검증
   * @param {string} ipAddress - IP 주소
   * @returns {Object} 검증 결과
   */
  validateIPAddress(ipAddress) {
    const result = {
      allowed: true,
      reason: null
    };

    // IP 주소가 없는 경우
    if (!ipAddress) {
      result.allowed = false;
      result.reason = 'No IP address provided';
      return result;
    }

    // 블랙리스트 확인
    if (this.ipBlacklist.length > 0 && this.ipBlacklist.includes(ipAddress)) {
      result.allowed = false;
      result.reason = 'IP address is blacklisted';
      return result;
    }

    // 화이트리스트 확인 (화이트리스트가 설정된 경우)
    if (this.ipWhitelist.length > 0 && !this.ipWhitelist.includes(ipAddress)) {
      result.allowed = false;
      result.reason = 'IP address not in whitelist';
      return result;
    }
    return result;
  }

  /**
   * 요청 속도 제한
   * @param {string} identifier - 식별자 (IP 주소 등)
   * @param {Object} limits - 제한 설정
   * @returns {Object} 속도 제한 결과
   */
  checkRateLimit(identifier, limits = {}) {
    const {
      windowMs = 60000,
      // 1분
      maxRequests = 100,
      skipSuccessfulRequests = false
    } = limits;
    const now = Date.now();
    const windowStart = now - windowMs;

    // 기존 요청 기록 가져오기
    let requests = this.rateLimitStore.get(identifier) || [];

    // 윈도우 밖의 요청 제거
    requests = requests.filter(timestamp => timestamp > windowStart);

    // 현재 요청 추가
    requests.push(now);

    // 업데이트된 요청 기록 저장
    this.rateLimitStore.set(identifier, requests);
    const result = {
      allowed: requests.length <= maxRequests,
      count: requests.length,
      limit: maxRequests,
      remaining: Math.max(0, maxRequests - requests.length),
      resetTime: windowStart + windowMs
    };
    if (!result.allowed) {
      warn('Rate limit exceeded', {
        identifier,
        count: result.count,
        limit: result.limit
      });
    }
    return result;
  }

  /**
   * API 키 검증
   * @param {string} apiKey - API 키
   * @param {string} requiredScope - 필요한 스코프
   * @returns {Object} 검증 결과
   */
  validateAPIKey(apiKey, requiredScope = null) {
    const result = {
      valid: false,
      scope: null,
      reason: null
    };

    // API 키가 없는 경우
    if (!apiKey) {
      result.reason = 'API key is required';
      return result;
    }

    // 환경 변수에서 유효한 API 키 목록 가져오기
    const validAPIKeys = this.getValidAPIKeys();
    const keyInfo = validAPIKeys.find(key => key.key === apiKey);
    if (!keyInfo) {
      result.reason = 'Invalid API key';
      return result;
    }

    // 만료 확인
    if (keyInfo.expiresAt && Date.now() > keyInfo.expiresAt) {
      result.reason = 'API key has expired';
      return result;
    }

    // 스코프 확인
    if (requiredScope && !keyInfo.scopes.includes(requiredScope)) {
      result.reason = `Insufficient scope. Required: ${requiredScope}`;
      return result;
    }
    result.valid = true;
    result.scope = keyInfo.scopes;
    return result;
  }

  /**
   * 유효한 API 키 목록 가져오기
   * @returns {Array} API 키 목록
   */
  getValidAPIKeys() {
    const apiKeysEnv = process.env.API_KEYS || '';
    if (!apiKeysEnv) {
      return [];
    }
    try {
      return JSON.parse(apiKeysEnv);
    } catch (err) {
      error('Failed to parse API_KEYS environment variable', err);
      return [];
    }
  }

  /**
   * 요청 검증
   * @param {Object} event - Lambda 이벤트
   * @returns {Object} 검증 결과
   */
  validateRequest(event) {
    const result = {
      valid: true,
      errors: [],
      headers: {}
    };
    const origin = event.headers?.Origin || event.headers?.origin;
    const userAgent = event.headers?.['User-Agent'] || event.headers?.['user-agent'];
    const sourceIp = event.requestContext?.identity?.sourceIp;
    const method = event.httpMethod;

    // CORS 헤더 생성
    result.headers = _objectSpread(_objectSpread(_objectSpread({}, result.headers), this.generateCORSHeaders(origin, method)), this.generateSecurityHeaders());

    // OPTIONS 요청은 CORS preflight이므로 추가 검증 생략
    if (method === 'OPTIONS') {
      return result;
    }

    // IP 주소 검증
    const ipValidation = this.validateIPAddress(sourceIp);
    if (!ipValidation.allowed) {
      result.valid = false;
      result.errors.push(`IP validation failed: ${ipValidation.reason}`);
    }

    // 속도 제한 확인
    const rateLimitResult = this.checkRateLimit(sourceIp);
    if (!rateLimitResult.allowed) {
      result.valid = false;
      result.errors.push('Rate limit exceeded');
      result.headers['X-RateLimit-Limit'] = rateLimitResult.limit.toString();
      result.headers['X-RateLimit-Remaining'] = rateLimitResult.remaining.toString();
      result.headers['X-RateLimit-Reset'] = Math.ceil(rateLimitResult.resetTime / 1000).toString();
    }

    // User-Agent 검증 (봇 차단)
    if (this.isSuspiciousUserAgent(userAgent)) {
      result.valid = false;
      result.errors.push('Suspicious user agent detected');
    }

    // API 키 검증 (필요한 경우)
    const apiKey = event.headers?.['X-API-Key'] || event.headers?.['x-api-key'];
    if (process.env.REQUIRE_API_KEY === 'true') {
      const apiKeyValidation = this.validateAPIKey(apiKey);
      if (!apiKeyValidation.valid) {
        result.valid = false;
        result.errors.push(`API key validation failed: ${apiKeyValidation.reason}`);
      }
    }

    // 요청 크기 제한
    const contentLength = parseInt(event.headers?.['Content-Length'] || '0');
    const maxBodySize = parseInt(process.env.MAX_BODY_SIZE || '1048576'); // 1MB 기본값

    if (contentLength > maxBodySize) {
      result.valid = false;
      result.errors.push(`Request body too large: ${contentLength} bytes (max: ${maxBodySize})`);
    }
    return result;
  }

  /**
   * 의심스러운 User-Agent 확인
   * @param {string} userAgent - User-Agent 문자열
   * @returns {boolean} 의심스러운 여부
   */
  isSuspiciousUserAgent(userAgent) {
    if (!userAgent) return true;
    const suspiciousPatterns = [/bot/i, /crawler/i, /spider/i, /scraper/i, /curl/i, /wget/i, /python/i, /java/i, /go-http-client/i];

    // 허용된 봇들 (검색 엔진 등)
    const allowedBots = [/googlebot/i, /bingbot/i, /slurp/i // Yahoo
    ];

    // 허용된 봇인지 먼저 확인
    if (allowedBots.some(pattern => pattern.test(userAgent))) {
      return false;
    }

    // 의심스러운 패턴 확인
    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  /**
   * 보안 응답 생성
   * @param {number} statusCode - HTTP 상태 코드
   * @param {Object} body - 응답 본문
   * @param {Object} additionalHeaders - 추가 헤더
   * @returns {Object} HTTP 응답
   */
  createSecureResponse(statusCode, body, additionalHeaders = {}) {
    const headers = _objectSpread(_objectSpread({}, this.generateSecurityHeaders()), additionalHeaders);
    return {
      statusCode,
      headers,
      body: typeof body === 'string' ? body : JSON.stringify(body)
    };
  }

  /**
   * 보안 위반 로깅
   * @param {string} violationType - 위반 유형
   * @param {Object} details - 상세 정보
   */
  logSecurityViolation(violationType, details) {
    warn('Security violation detected', _objectSpread(_objectSpread({
      violationType
    }, details), {}, {
      timestamp: new Date().toISOString()
    }));

    // 심각한 보안 위반의 경우 알림 (실제 구현에서는 SNS 등 사용)
    if (['IP_BLACKLISTED', 'RATE_LIMIT_EXCEEDED', 'INVALID_API_KEY'].includes(violationType)) {
      error('Critical security violation', _objectSpread({
        violationType
      }, details));
    }
  }

  /**
   * 보안 통계 조회
   * @returns {Object} 보안 통계
   */
  getSecurityStats() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    let totalRequests = 0;
    let rateLimitedIPs = 0;
    this.rateLimitStore.forEach((requests, ip) => {
      const recentRequests = requests.filter(timestamp => now - timestamp < oneHour);
      totalRequests += recentRequests.length;
      if (recentRequests.length > 100) {
        // 시간당 100개 이상
        rateLimitedIPs++;
      }
    });
    return {
      timestamp: new Date().toISOString(),
      totalRequests,
      rateLimitedIPs,
      allowedOrigins: this.allowedOrigins.length,
      ipWhitelist: this.ipWhitelist.length,
      ipBlacklist: this.ipBlacklist.length
    };
  }

  /**
   * 보안 설정 업데이트
   * @param {Object} config - 새로운 설정
   */
  updateSecurityConfig(config) {
    if (config.allowedOrigins) {
      this.allowedOrigins = config.allowedOrigins;
    }
    if (config.ipWhitelist) {
      this.ipWhitelist = config.ipWhitelist;
    }
    if (config.ipBlacklist) {
      this.ipBlacklist = config.ipBlacklist;
    }
    info('Security configuration updated', {
      allowedOrigins: this.allowedOrigins.length,
      ipWhitelist: this.ipWhitelist.length,
      ipBlacklist: this.ipBlacklist.length
    });
  }

  /**
   * 정리 작업 (메모리 누수 방지)
   */
  cleanup() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    // 1시간 이상 된 속도 제한 기록 제거
    this.rateLimitStore.forEach((requests, ip) => {
      const recentRequests = requests.filter(timestamp => now - timestamp < oneHour);
      if (recentRequests.length === 0) {
        this.rateLimitStore.delete(ip);
      } else {
        this.rateLimitStore.set(ip, recentRequests);
      }
    });
    info('Security middleware cleanup completed', {
      remainingIPs: this.rateLimitStore.size
    });
  }
}

// 싱글톤 인스턴스 생성
const securityMiddleware = new SecurityMiddleware();

// 정기적인 정리 작업 (1시간마다)
setInterval(() => {
  securityMiddleware.cleanup();
}, 60 * 60 * 1000);
module.exports = {
  SecurityMiddleware,
  securityMiddleware,
  // 편의 함수들
  validateRequest: event => securityMiddleware.validateRequest(event),
  createSecureResponse: (statusCode, body, headers) => securityMiddleware.createSecureResponse(statusCode, body, headers),
  generateCORSHeaders: (origin, method) => securityMiddleware.generateCORSHeaders(origin, method),
  getSecurityStats: () => securityMiddleware.getSecurityStats()
};

/***/ }),

/***/ 9021:
/***/ ((module) => {

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// HTTP 응답 유틸리티 함수들

/**
 * 성공 응답 생성
 * @param {*} data - 응답 데이터
 * @param {number} statusCode - HTTP 상태 코드 (기본값: 200)
 * @param {Object} headers - 추가 헤더
 * @returns {Object} Lambda 응답 객체
 */
function success(data, statusCode = 200, headers = {}) {
  return {
    statusCode,
    headers: _objectSpread({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    }, headers),
    body: JSON.stringify({
      success: true,
      data,
      timestamp: new Date().toISOString()
    })
  };
}

/**
 * 에러 응답 생성
 * @param {string} message - 에러 메시지
 * @param {number} statusCode - HTTP 상태 코드 (기본값: 500)
 * @param {string} errorCode - 에러 코드
 * @param {Object} headers - 추가 헤더
 * @returns {Object} Lambda 응답 객체
 */
function error(message, statusCode = 500, errorCode = 'INTERNAL_ERROR', headers = {}) {
  return {
    statusCode,
    headers: _objectSpread({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    }, headers),
    body: JSON.stringify({
      success: false,
      error: {
        message,
        code: errorCode,
        statusCode
      },
      timestamp: new Date().toISOString()
    })
  };
}

/**
 * 유효성 검사 에러 응답 생성
 * @param {string} message - 에러 메시지
 * @param {Array} details - 상세 에러 정보
 * @returns {Object} Lambda 응답 객체
 */
function validationError(message, details = []) {
  return error(message, 400, 'VALIDATION_ERROR', {}, {
    details
  });
}

/**
 * 404 Not Found 응답 생성
 * @param {string} resource - 찾을 수 없는 리소스명
 * @returns {Object} Lambda 응답 객체
 */
function notFound(resource = 'Resource') {
  return error(`${resource} not found`, 404, 'NOT_FOUND');
}

/**
 * 401 Unauthorized 응답 생성
 * @param {string} message - 에러 메시지
 * @returns {Object} Lambda 응답 객체
 */
function unauthorized(message = 'Unauthorized') {
  return error(message, 401, 'UNAUTHORIZED');
}

/**
 * 403 Forbidden 응답 생성
 * @param {string} message - 에러 메시지
 * @returns {Object} Lambda 응답 객체
 */
function forbidden(message = 'Forbidden') {
  return error(message, 403, 'FORBIDDEN');
}

/**
 * 429 Too Many Requests 응답 생성
 * @param {string} message - 에러 메시지
 * @returns {Object} Lambda 응답 객체
 */
function tooManyRequests(message = 'Too many requests') {
  return error(message, 429, 'TOO_MANY_REQUESTS');
}
module.exports = {
  success,
  error,
  validationError,
  notFound,
  unauthorized,
  forbidden,
  tooManyRequests
};

/***/ }),

/***/ 9601:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// dynamodb.js
// DynamoDB 클라이언트 설정 및 테이블 스키마 정의

const AWS = __webpack_require__(3778);
const {
  info,
  error,
  debug
} = __webpack_require__(1626);

/**
 * DynamoDB 설정 클래스
 */
class DynamoDBConfig {
  constructor() {
    this.dynamodb = null;
    this.documentClient = null;
    this.tableSchemas = new Map();
    this.isInitialized = false;
  }

  /**
   * DynamoDB 클라이언트 초기화
   * @param {Object} options - 초기화 옵션
   */
  initialize(options = {}) {
    const {
      region = process.env.AWS_REGION || 'ap-northeast-2',
      endpoint = process.env.DYNAMODB_ENDPOINT,
      accessKeyId = process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    } = options;
    const config = {
      region,
      apiVersion: '2012-08-10'
    };

    // 로컬 개발 환경용 엔드포인트 설정
    if (endpoint) {
      config.endpoint = endpoint;
    }

    // 자격 증명 설정 (Lambda에서는 IAM 역할 사용)
    if (accessKeyId && secretAccessKey) {
      config.accessKeyId = accessKeyId;
      config.secretAccessKey = secretAccessKey;
    }
    this.dynamodb = new AWS.DynamoDB(config);
    this.documentClient = new AWS.DynamoDB.DocumentClient(config);
    this.defineTableSchemas();
    this.isInitialized = true;
    info('DynamoDB client initialized', {
      region,
      endpoint: !!endpoint
    });
  }

  /**
   * 테이블 스키마 정의
   */
  defineTableSchemas() {
    // FloodInfo 테이블 스키마
    this.tableSchemas.set('FloodInfo', {
      TableName: process.env.FLOOD_INFO_TABLE || 'FloodInfo',
      KeySchema: [{
        AttributeName: 'id',
        KeyType: 'HASH' // Partition key
      }, {
        AttributeName: 'timestamp',
        KeyType: 'RANGE' // Sort key
      }],
      AttributeDefinitions: [{
        AttributeName: 'id',
        AttributeType: 'S'
      }, {
        AttributeName: 'timestamp',
        AttributeType: 'S'
      }, {
        AttributeName: 'locationId',
        AttributeType: 'S'
      }, {
        AttributeName: 'status',
        AttributeType: 'S'
      }, {
        AttributeName: 'severity',
        AttributeType: 'S'
      }, {
        AttributeName: 'alertType',
        AttributeType: 'S'
      }],
      GlobalSecondaryIndexes: [{
        IndexName: 'LocationIndex',
        KeySchema: [{
          AttributeName: 'locationId',
          KeyType: 'HASH'
        }, {
          AttributeName: 'timestamp',
          KeyType: 'RANGE'
        }],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }, {
        IndexName: 'StatusIndex',
        KeySchema: [{
          AttributeName: 'status',
          KeyType: 'HASH'
        }, {
          AttributeName: 'timestamp',
          KeyType: 'RANGE'
        }],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }, {
        IndexName: 'SeverityIndex',
        KeySchema: [{
          AttributeName: 'severity',
          KeyType: 'HASH'
        }, {
          AttributeName: 'timestamp',
          KeyType: 'RANGE'
        }],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }, {
        IndexName: 'AlertTypeIndex',
        KeySchema: [{
          AttributeName: 'alertType',
          KeyType: 'HASH'
        }, {
          AttributeName: 'timestamp',
          KeyType: 'RANGE'
        }],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
      },
      StreamSpecification: {
        StreamEnabled: true,
        StreamViewType: 'NEW_AND_OLD_IMAGES'
      },
      TimeToLiveSpecification: {
        AttributeName: 'ttl',
        Enabled: true
      }
    });

    // APISource 테이블 스키마
    this.tableSchemas.set('APISource', {
      TableName: process.env.API_SOURCE_TABLE || 'APISource',
      KeySchema: [{
        AttributeName: 'sourceId',
        KeyType: 'HASH' // Partition key
      }],
      AttributeDefinitions: [{
        AttributeName: 'sourceId',
        AttributeType: 'S'
      }, {
        AttributeName: 'apiType',
        AttributeType: 'S'
      }, {
        AttributeName: 'status',
        AttributeType: 'S'
      }],
      GlobalSecondaryIndexes: [{
        IndexName: 'APITypeIndex',
        KeySchema: [{
          AttributeName: 'apiType',
          KeyType: 'HASH'
        }],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }, {
        IndexName: 'StatusIndex',
        KeySchema: [{
          AttributeName: 'status',
          KeyType: 'HASH'
        }],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    });
    debug('Table schemas defined', {
      tableCount: this.tableSchemas.size,
      tables: Array.from(this.tableSchemas.keys())
    });
  }

  /**
   * 테이블 생성
   * @param {string} tableName - 테이블 이름
   * @returns {Promise<boolean>} 생성 성공 여부
   */
  async createTable(tableName) {
    if (!this.isInitialized) {
      throw new Error('DynamoDB client not initialized');
    }
    const schema = this.tableSchemas.get(tableName);
    if (!schema) {
      throw new Error(`Table schema not found: ${tableName}`);
    }
    try {
      // 테이블 존재 여부 확인
      const exists = await this.tableExists(schema.TableName);
      if (exists) {
        info('Table already exists', {
          tableName: schema.TableName
        });
        return true;
      }

      // 테이블 생성
      debug('Creating table', {
        tableName: schema.TableName
      });
      await this.dynamodb.createTable(schema).promise();

      // 테이블 활성화 대기
      await this.waitForTableActive(schema.TableName);
      info('Table created successfully', {
        tableName: schema.TableName
      });
      return true;
    } catch (err) {
      error('Failed to create table', err, {
        tableName: schema.TableName
      });
      throw err;
    }
  }

  /**
   * 모든 테이블 생성
   * @returns {Promise<boolean>} 생성 성공 여부
   */
  async createAllTables() {
    const tableNames = Array.from(this.tableSchemas.keys());
    try {
      for (const tableName of tableNames) {
        await this.createTable(tableName);
      }
      info('All tables created successfully', {
        tableCount: tableNames.length
      });
      return true;
    } catch (err) {
      error('Failed to create all tables', err);
      throw err;
    }
  }

  /**
   * 테이블 존재 여부 확인
   * @param {string} tableName - 테이블 이름
   * @returns {Promise<boolean>} 존재 여부
   */
  async tableExists(tableName) {
    try {
      await this.dynamodb.describeTable({
        TableName: tableName
      }).promise();
      return true;
    } catch (err) {
      if (err.code === 'ResourceNotFoundException') {
        return false;
      }
      throw err;
    }
  }

  /**
   * 테이블 활성화 대기
   * @param {string} tableName - 테이블 이름
   * @param {number} maxWaitTime - 최대 대기 시간 (밀리초)
   * @returns {Promise<void>}
   */
  async waitForTableActive(tableName, maxWaitTime = 300000) {
    // 5분
    const startTime = Date.now();
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const result = await this.dynamodb.describeTable({
          TableName: tableName
        }).promise();
        if (result.Table.TableStatus === 'ACTIVE') {
          debug('Table is active', {
            tableName
          });
          return;
        }
        debug('Waiting for table to become active', {
          tableName,
          status: result.Table.TableStatus
        });

        // 5초 대기
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (err) {
        error('Error checking table status', err, {
          tableName
        });
        throw err;
      }
    }
    throw new Error(`Table did not become active within ${maxWaitTime}ms: ${tableName}`);
  }

  /**
   * 테이블 삭제
   * @param {string} tableName - 테이블 이름
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  async deleteTable(tableName) {
    if (!this.isInitialized) {
      throw new Error('DynamoDB client not initialized');
    }
    const schema = this.tableSchemas.get(tableName);
    if (!schema) {
      throw new Error(`Table schema not found: ${tableName}`);
    }
    try {
      const exists = await this.tableExists(schema.TableName);
      if (!exists) {
        info('Table does not exist', {
          tableName: schema.TableName
        });
        return true;
      }
      debug('Deleting table', {
        tableName: schema.TableName
      });
      await this.dynamodb.deleteTable({
        TableName: schema.TableName
      }).promise();
      info('Table deleted successfully', {
        tableName: schema.TableName
      });
      return true;
    } catch (err) {
      error('Failed to delete table', err, {
        tableName: schema.TableName
      });
      throw err;
    }
  }

  /**
   * 테이블 스키마 조회
   * @param {string} tableName - 테이블 이름
   * @returns {Object} 테이블 스키마
   */
  getTableSchema(tableName) {
    return this.tableSchemas.get(tableName);
  }

  /**
   * 테이블 이름 조회
   * @param {string} schemaName - 스키마 이름
   * @returns {string} 실제 테이블 이름
   */
  getTableName(schemaName) {
    const schema = this.tableSchemas.get(schemaName);
    return schema ? schema.TableName : null;
  }

  /**
   * DocumentClient 조회
   * @returns {AWS.DynamoDB.DocumentClient} DocumentClient 인스턴스
   */
  getDocumentClient() {
    if (!this.isInitialized) {
      throw new Error('DynamoDB client not initialized');
    }
    return this.documentClient;
  }

  /**
   * DynamoDB 클라이언트 조회
   * @returns {AWS.DynamoDB} DynamoDB 클라이언트 인스턴스
   */
  getDynamoDBClient() {
    if (!this.isInitialized) {
      throw new Error('DynamoDB client not initialized');
    }
    return this.dynamodb;
  }

  /**
   * 테이블 상태 확인
   * @param {string} tableName - 테이블 이름
   * @returns {Promise<Object>} 테이블 상태 정보
   */
  async getTableStatus(tableName) {
    const schema = this.tableSchemas.get(tableName);
    if (!schema) {
      throw new Error(`Table schema not found: ${tableName}`);
    }
    try {
      const result = await this.dynamodb.describeTable({
        TableName: schema.TableName
      }).promise();
      return {
        tableName: schema.TableName,
        status: result.Table.TableStatus,
        itemCount: result.Table.ItemCount,
        tableSize: result.Table.TableSizeBytes,
        creationDateTime: result.Table.CreationDateTime,
        provisionedThroughput: result.Table.ProvisionedThroughput,
        globalSecondaryIndexes: result.Table.GlobalSecondaryIndexes?.map(gsi => ({
          indexName: gsi.IndexName,
          status: gsi.IndexStatus,
          itemCount: gsi.ItemCount,
          indexSize: gsi.IndexSizeBytes
        })) || []
      };
    } catch (err) {
      if (err.code === 'ResourceNotFoundException') {
        return {
          tableName: schema.TableName,
          status: 'NOT_EXISTS'
        };
      }
      throw err;
    }
  }

  /**
   * 모든 테이블 상태 확인
   * @returns {Promise<Array>} 모든 테이블 상태 정보
   */
  async getAllTableStatus() {
    const tableNames = Array.from(this.tableSchemas.keys());
    const statusPromises = tableNames.map(tableName => this.getTableStatus(tableName).catch(err => ({
      tableName,
      status: 'ERROR',
      error: err.message
    })));
    return Promise.all(statusPromises);
  }

  /**
   * TTL 설정
   * @param {string} tableName - 테이블 이름
   * @param {string} attributeName - TTL 속성 이름
   * @returns {Promise<boolean>} 설정 성공 여부
   */
  async enableTTL(tableName, attributeName = 'ttl') {
    const schema = this.tableSchemas.get(tableName);
    if (!schema) {
      throw new Error(`Table schema not found: ${tableName}`);
    }
    try {
      await this.dynamodb.updateTimeToLive({
        TableName: schema.TableName,
        TimeToLiveSpecification: {
          AttributeName: attributeName,
          Enabled: true
        }
      }).promise();
      info('TTL enabled', {
        tableName: schema.TableName,
        attributeName
      });
      return true;
    } catch (err) {
      error('Failed to enable TTL', err, {
        tableName: schema.TableName
      });
      throw err;
    }
  }

  /**
   * 스트림 설정
   * @param {string} tableName - 테이블 이름
   * @param {string} streamViewType - 스트림 뷰 타입
   * @returns {Promise<boolean>} 설정 성공 여부
   */
  async enableStream(tableName, streamViewType = 'NEW_AND_OLD_IMAGES') {
    const schema = this.tableSchemas.get(tableName);
    if (!schema) {
      throw new Error(`Table schema not found: ${tableName}`);
    }
    try {
      await this.dynamodb.updateTable({
        TableName: schema.TableName,
        StreamSpecification: {
          StreamEnabled: true,
          StreamViewType: streamViewType
        }
      }).promise();
      info('Stream enabled', {
        tableName: schema.TableName,
        streamViewType
      });
      return true;
    } catch (err) {
      error('Failed to enable stream', err, {
        tableName: schema.TableName
      });
      throw err;
    }
  }

  /**
   * 헬스 체크
   * @returns {Promise<Object>} 헬스 체크 결과
   */
  async healthCheck() {
    try {
      const tableStatuses = await this.getAllTableStatus();
      const healthyTables = tableStatuses.filter(t => t.status === 'ACTIVE').length;
      const totalTables = tableStatuses.length;
      const health = {
        status: healthyTables === totalTables ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        tables: {
          total: totalTables,
          healthy: healthyTables,
          unhealthy: totalTables - healthyTables
        },
        details: tableStatuses
      };
      return health;
    } catch (err) {
      error('Health check failed', err);
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: err.message
      };
    }
  }
}

// 싱글톤 인스턴스 생성
const dynamoDBConfig = new DynamoDBConfig();

// 환경 변수가 있으면 자동 초기화
if (process.env.AWS_REGION || process.env.DYNAMODB_ENDPOINT) {
  dynamoDBConfig.initialize();
}
module.exports = {
  DynamoDBConfig,
  dynamoDBConfig
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
// healthHandler.js
// 헬스 체크 및 시스템 상태 조회 Lambda 함수

const {
  success,
  error: errorResponse
} = __webpack_require__(9021);
const {
  info,
  error,
  debug
} = __webpack_require__(1626);
const {
  dynamoDBConfig
} = __webpack_require__(9601);
const {
  errorHandler
} = __webpack_require__(2589);
const {
  securityMiddleware
} = __webpack_require__(8157);

/**
 * 기본 헬스 체크
 * @param {Object} event - Lambda 이벤트
 * @param {Object} context - Lambda 컨텍스트
 * @returns {Promise<Object>} HTTP 응답
 */
exports.healthCheck = async (event, context) => {
  try {
    debug('Health check requested', {
      requestId: context.awsRequestId,
      userAgent: event.headers?.['User-Agent']
    });
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'flood-info-backend',
      version: process.env.npm_package_version || '1.0.0',
      stage: process.env.STAGE || 'dev',
      region: process.env.REGION || 'ap-northeast-2',
      requestId: context.awsRequestId,
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        limit: parseInt(context.memoryLimitInMB)
      },
      lambda: {
        functionName: context.functionName,
        functionVersion: context.functionVersion,
        remainingTime: context.getRemainingTimeInMillis()
      }
    };
    info('Health check completed', {
      requestId: context.awsRequestId,
      status: healthStatus.status
    });
    return success(healthStatus);
  } catch (err) {
    error('Health check failed', err, {
      requestId: context.awsRequestId
    });
    return errorResponse('Health check failed');
  }
};

/**
 * 상세 시스템 상태 조회
 * @param {Object} event - Lambda 이벤트
 * @param {Object} context - Lambda 컨텍스트
 * @returns {Promise<Object>} HTTP 응답
 */
exports.getSystemStatus = async (event, context) => {
  try {
    debug('System status requested', {
      requestId: context.awsRequestId
    });
    const startTime = Date.now();

    // 병렬로 각 컴포넌트 상태 확인
    const [databaseHealth, errorHandlerHealth, securityHealth, environmentHealth] = await Promise.allSettled([checkDatabaseHealth(), checkErrorHandlerHealth(), checkSecurityHealth(), checkEnvironmentHealth()]);
    const systemStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'flood-info-backend',
      version: process.env.npm_package_version || '1.0.0',
      stage: process.env.STAGE || 'dev',
      region: process.env.REGION || 'ap-northeast-2',
      requestId: context.awsRequestId,
      checkDuration: Date.now() - startTime,
      components: {
        database: getHealthResult(databaseHealth),
        errorHandler: getHealthResult(errorHandlerHealth),
        security: getHealthResult(securityHealth),
        environment: getHealthResult(environmentHealth)
      },
      system: {
        uptime: process.uptime(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          limit: parseInt(context.memoryLimitInMB),
          usage: Math.round(process.memoryUsage().heapUsed / (parseInt(context.memoryLimitInMB) * 1024 * 1024) * 100)
        },
        lambda: {
          functionName: context.functionName,
          functionVersion: context.functionVersion,
          remainingTime: context.getRemainingTimeInMillis(),
          coldStart: !global.isWarm
        },
        nodejs: {
          version: process.version,
          platform: process.platform,
          arch: process.arch
        }
      }
    };

    // 전체 상태 결정
    const componentStatuses = Object.values(systemStatus.components).map(c => c.status);
    if (componentStatuses.includes('unhealthy')) {
      systemStatus.status = 'unhealthy';
    } else if (componentStatuses.includes('warning')) {
      systemStatus.status = 'warning';
    }

    // Lambda 웜업 표시
    global.isWarm = true;
    info('System status check completed', {
      requestId: context.awsRequestId,
      status: systemStatus.status,
      duration: systemStatus.checkDuration
    });
    return success(systemStatus);
  } catch (err) {
    error('System status check failed', err, {
      requestId: context.awsRequestId
    });
    return errorResponse('System status check failed');
  }
};

/**
 * 데이터베이스 상태 확인
 * @returns {Promise<Object>} 데이터베이스 상태
 */
async function checkDatabaseHealth() {
  try {
    // DynamoDB 초기화 확인
    if (!dynamoDBConfig.isInitialized) {
      dynamoDBConfig.initialize();
    }

    // 테이블 상태 확인
    const tableStatuses = await dynamoDBConfig.getAllTableStatus();
    const healthyTables = tableStatuses.filter(t => t.status === 'ACTIVE').length;
    const totalTables = tableStatuses.length;
    const health = {
      status: healthyTables === totalTables ? 'healthy' : 'unhealthy',
      tables: {
        total: totalTables,
        healthy: healthyTables,
        unhealthy: totalTables - healthyTables
      },
      details: tableStatuses.map(t => ({
        name: t.tableName,
        status: t.status,
        itemCount: t.itemCount,
        size: t.tableSize
      }))
    };
    return health;
  } catch (err) {
    return {
      status: 'unhealthy',
      error: err.message
    };
  }
}

/**
 * 오류 처리기 상태 확인
 * @returns {Object} 오류 처리기 상태
 */
function checkErrorHandlerHealth() {
  try {
    const health = errorHandler.healthCheck();
    return health;
  } catch (err) {
    return {
      status: 'unhealthy',
      error: err.message
    };
  }
}

/**
 * 보안 미들웨어 상태 확인
 * @returns {Object} 보안 상태
 */
function checkSecurityHealth() {
  try {
    const stats = securityMiddleware.getSecurityStats();
    const health = {
      status: 'healthy',
      stats,
      configuration: {
        allowedOrigins: stats.allowedOrigins,
        ipWhitelist: stats.ipWhitelist,
        ipBlacklist: stats.ipBlacklist
      }
    };

    // 높은 속도 제한 IP가 많으면 경고
    if (stats.rateLimitedIPs > 10) {
      health.status = 'warning';
      health.warning = 'High number of rate-limited IPs';
    }
    return health;
  } catch (err) {
    return {
      status: 'unhealthy',
      error: err.message
    };
  }
}

/**
 * 환경 설정 상태 확인
 * @returns {Object} 환경 상태
 */
function checkEnvironmentHealth() {
  const requiredEnvVars = ['STAGE', 'REGION', 'FLOOD_INFO_TABLE', 'API_SOURCE_TABLE'];
  const optionalEnvVars = ['NAVER_CLIENT_ID', 'NAVER_CLIENT_SECRET', 'HANRIVER_BASE_URL', 'ALLOWED_ORIGINS'];
  const health = {
    status: 'healthy',
    environment: {
      stage: process.env.STAGE,
      region: process.env.REGION,
      nodeVersion: process.version
    },
    configuration: {
      required: {},
      optional: {}
    },
    issues: []
  };

  // 필수 환경 변수 확인
  requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    health.configuration.required[envVar] = {
      configured: !!value,
      value: value ? '[CONFIGURED]' : '[MISSING]'
    };
    if (!value) {
      health.status = 'unhealthy';
      health.issues.push(`Missing required environment variable: ${envVar}`);
    }
  });

  // 선택적 환경 변수 확인
  optionalEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    health.configuration.optional[envVar] = {
      configured: !!value,
      value: value ? '[CONFIGURED]' : '[NOT_SET]'
    };
    if (!value) {
      health.issues.push(`Optional environment variable not set: ${envVar}`);
    }
  });

  // 경고 상태 결정
  if (health.status === 'healthy' && health.issues.length > 0) {
    health.status = 'warning';
  }
  return health;
}

/**
 * Promise.allSettled 결과를 헬스 체크 결과로 변환
 * @param {Object} settledResult - Promise.allSettled 결과
 * @returns {Object} 헬스 체크 결과
 */
function getHealthResult(settledResult) {
  if (settledResult.status === 'fulfilled') {
    return settledResult.value;
  } else {
    return {
      status: 'unhealthy',
      error: settledResult.reason?.message || 'Unknown error'
    };
  }
}

/**
 * 외부 API 상태 확인
 * @param {Object} event - Lambda 이벤트
 * @param {Object} context - Lambda 컨텍스트
 * @returns {Promise<Object>} HTTP 응답
 */
exports.checkExternalAPIs = async (event, context) => {
  try {
    debug('External API status check requested', {
      requestId: context.awsRequestId
    });
    const startTime = Date.now();

    // 외부 API 상태 확인
    const [hanRiverHealth, naverHealth] = await Promise.allSettled([checkHanRiverAPIHealth(), checkNaverAPIHealth()]);
    const apiStatus = {
      timestamp: new Date().toISOString(),
      requestId: context.awsRequestId,
      checkDuration: Date.now() - startTime,
      apis: {
        hanRiver: getHealthResult(hanRiverHealth),
        naver: getHealthResult(naverHealth)
      }
    };

    // 전체 상태 결정
    const apiStatuses = Object.values(apiStatus.apis).map(api => api.status);
    apiStatus.overallStatus = apiStatuses.includes('unhealthy') ? 'unhealthy' : apiStatuses.includes('warning') ? 'warning' : 'healthy';
    info('External API status check completed', {
      requestId: context.awsRequestId,
      overallStatus: apiStatus.overallStatus,
      duration: apiStatus.checkDuration
    });
    return success(apiStatus);
  } catch (err) {
    error('External API status check failed', err, {
      requestId: context.awsRequestId
    });
    return errorResponse('External API status check failed');
  }
};

/**
 * 한강홍수통제소 API 상태 확인
 * @returns {Promise<Object>} API 상태
 */
async function checkHanRiverAPIHealth() {
  try {
    const baseUrl = process.env.HANRIVER_BASE_URL;
    if (!baseUrl) {
      return {
        status: 'warning',
        message: 'Han River API URL not configured'
      };
    }

    // 간단한 연결 테스트 (실제 구현에서는 HanRiverAPIService 사용)
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      timeout: 5000
    });
    return {
      status: response.ok ? 'healthy' : 'unhealthy',
      responseTime: Date.now() - startTime,
      statusCode: response.status
    };
  } catch (err) {
    return {
      status: 'unhealthy',
      error: err.message
    };
  }
}

/**
 * 네이버 API 상태 확인
 * @returns {Promise<Object>} API 상태
 */
async function checkNaverAPIHealth() {
  try {
    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return {
        status: 'warning',
        message: 'Naver API credentials not configured'
      };
    }

    // 네이버 API는 실제 요청 없이는 상태 확인이 어려우므로 설정 확인만
    return {
      status: 'healthy',
      message: 'Naver API credentials configured',
      configured: true
    };
  } catch (err) {
    return {
      status: 'unhealthy',
      error: err.message
    };
  }
}

/**
 * 성능 메트릭 조회
 * @param {Object} event - Lambda 이벤트
 * @param {Object} context - Lambda 컨텍스트
 * @returns {Promise<Object>} HTTP 응답
 */
exports.getPerformanceMetrics = async (event, context) => {
  try {
    debug('Performance metrics requested', {
      requestId: context.awsRequestId
    });
    const metrics = {
      timestamp: new Date().toISOString(),
      requestId: context.awsRequestId,
      lambda: {
        functionName: context.functionName,
        functionVersion: context.functionVersion,
        memoryLimit: parseInt(context.memoryLimitInMB),
        remainingTime: context.getRemainingTimeInMillis(),
        coldStart: !global.isWarm
      },
      process: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        version: process.version,
        platform: process.platform,
        arch: process.arch
      },
      errors: errorHandler.getErrorStats(),
      security: securityMiddleware.getSecurityStats()
    };

    // 메모리 사용률 계산
    metrics.memoryUsagePercent = Math.round(metrics.process.memory.heapUsed / (metrics.lambda.memoryLimit * 1024 * 1024) * 100);

    // Lambda 웜업 표시
    global.isWarm = true;
    info('Performance metrics retrieved', {
      requestId: context.awsRequestId,
      memoryUsage: metrics.memoryUsagePercent,
      uptime: metrics.process.uptime
    });
    return success(metrics);
  } catch (err) {
    error('Performance metrics retrieval failed', err, {
      requestId: context.awsRequestId
    });
    return errorResponse('Performance metrics retrieval failed');
  }
};
})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=healthHandler.js.map