// security.js
// 크로스 오리진 요청 처리 및 AWS 환경 보안 설정 미들웨어

const { info, warn, error } = require('../utils/logger');

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
    const defaultOrigins = [
      'http://localhost:3000',
      'http://localhost:5173', // Vite 기본 포트
      'https://localhost:3000',
      'https://localhost:5173',
    ];

    if (origins) {
      return origins.split(',').map(origin => origin.trim());
    }

    // 프로덕션 환경에서는 환경 변수 필수
    if (process.env.NODE_ENV === 'production') {
      warn('ALLOWED_ORIGINS not set in production environment');
      return [];
    }

    return defaultOrigins;
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
      'Access-Control-Max-Age': '86400', // 24시간
      'Vary': 'Origin',
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
      'Expires': '0',
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
      reason: null,
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
      windowMs = 60000, // 1분
      maxRequests = 100,
      skipSuccessfulRequests = false,
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
      resetTime: windowStart + windowMs,
    };

    if (!result.allowed) {
      warn('Rate limit exceeded', {
        identifier,
        count: result.count,
        limit: result.limit,
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
      reason: null,
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
      headers: {},
    };

    const origin = event.headers?.Origin || event.headers?.origin;
    const userAgent = event.headers?.['User-Agent'] || event.headers?.['user-agent'];
    const sourceIp = event.requestContext?.identity?.sourceIp;
    const method = event.httpMethod;

    // CORS 헤더 생성
    result.headers = {
      ...result.headers,
      ...this.generateCORSHeaders(origin, method),
      ...this.generateSecurityHeaders(),
    };

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

    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i,
      /go-http-client/i,
    ];

    // 허용된 봇들 (검색 엔진 등)
    const allowedBots = [
      /googlebot/i,
      /bingbot/i,
      /slurp/i, // Yahoo
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
    const headers = {
      ...this.generateSecurityHeaders(),
      ...additionalHeaders,
    };

    return {
      statusCode,
      headers,
      body: typeof body === 'string' ? body : JSON.stringify(body),
    };
  }

  /**
   * 보안 위반 로깅
   * @param {string} violationType - 위반 유형
   * @param {Object} details - 상세 정보
   */
  logSecurityViolation(violationType, details) {
    warn('Security violation detected', {
      violationType,
      ...details,
      timestamp: new Date().toISOString(),
    });

    // 심각한 보안 위반의 경우 알림 (실제 구현에서는 SNS 등 사용)
    if (['IP_BLACKLISTED', 'RATE_LIMIT_EXCEEDED', 'INVALID_API_KEY'].includes(violationType)) {
      error('Critical security violation', {
        violationType,
        ...details,
      });
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
      const recentRequests = requests.filter(timestamp => 
        now - timestamp < oneHour
      );
      
      totalRequests += recentRequests.length;
      
      if (recentRequests.length > 100) { // 시간당 100개 이상
        rateLimitedIPs++;
      }
    });

    return {
      timestamp: new Date().toISOString(),
      totalRequests,
      rateLimitedIPs,
      allowedOrigins: this.allowedOrigins.length,
      ipWhitelist: this.ipWhitelist.length,
      ipBlacklist: this.ipBlacklist.length,
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
      ipBlacklist: this.ipBlacklist.length,
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
      const recentRequests = requests.filter(timestamp => 
        now - timestamp < oneHour
      );
      
      if (recentRequests.length === 0) {
        this.rateLimitStore.delete(ip);
      } else {
        this.rateLimitStore.set(ip, recentRequests);
      }
    });

    info('Security middleware cleanup completed', {
      remainingIPs: this.rateLimitStore.size,
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
  validateRequest: (event) => securityMiddleware.validateRequest(event),
  createSecureResponse: (statusCode, body, headers) => 
    securityMiddleware.createSecureResponse(statusCode, body, headers),
  generateCORSHeaders: (origin, method) => 
    securityMiddleware.generateCORSHeaders(origin, method),
  getSecurityStats: () => securityMiddleware.getSecurityStats(),
};