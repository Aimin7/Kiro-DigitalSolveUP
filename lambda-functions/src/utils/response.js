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
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      ...headers,
    },
    body: JSON.stringify({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    }),
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
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      ...headers,
    },
    body: JSON.stringify({
      success: false,
      error: {
        message,
        code: errorCode,
        statusCode,
      },
      timestamp: new Date().toISOString(),
    }),
  };
}

/**
 * 유효성 검사 에러 응답 생성
 * @param {string} message - 에러 메시지
 * @param {Array} details - 상세 에러 정보
 * @returns {Object} Lambda 응답 객체
 */
function validationError(message, details = []) {
  return error(message, 400, 'VALIDATION_ERROR', {}, { details });
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
  tooManyRequests,
};