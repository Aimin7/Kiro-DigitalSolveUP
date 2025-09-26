// 로깅 유틸리티

const environment = require('../config/environment');

/**
 * 로그 레벨 정의
 */
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
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
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    stage: environment.stage,
    ...meta,
  };
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
  const errorMeta = {
    ...meta,
    error: error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : null,
  };
  
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
      'x-forwarded-for': event.headers?.['x-forwarded-for'],
    },
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
    duration: `${duration}ms`,
  });
}

module.exports = {
  error,
  warn,
  info,
  debug,
  logRequest,
  logResponse,
  LOG_LEVELS,
};