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

/***/ 3778:
/***/ ((module) => {

"use strict";
module.exports = require("aws-sdk");

/***/ }),

/***/ 9888:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// websocket.js
// 클라이언트-서버 실시간 통신 설정 유틸리티

const {
  info,
  error,
  debug,
  warn
} = __webpack_require__(1626);

/**
 * WebSocket 연결 관리 클래스
 */
class WebSocketManager {
  constructor() {
    this.connections = new Map();
    this.rooms = new Map();
    this.messageHandlers = new Map();
    this.connectionStats = {
      totalConnections: 0,
      activeConnections: 0,
      totalMessages: 0,
      totalErrors: 0
    };
  }

  /**
   * WebSocket 연결 처리
   * @param {Object} event - API Gateway WebSocket 이벤트
   * @param {Object} context - Lambda 컨텍스트
   * @returns {Promise<Object>} 응답
   */
  async handleConnect(event, context) {
    const connectionId = event.requestContext.connectionId;
    const routeKey = event.requestContext.routeKey;
    try {
      debug('WebSocket connection attempt', {
        connectionId,
        routeKey
      });

      // 연결 정보 저장
      const connectionInfo = {
        connectionId,
        connectedAt: Date.now(),
        lastActivity: Date.now(),
        subscriptions: new Set(),
        metadata: this.extractConnectionMetadata(event)
      };
      this.connections.set(connectionId, connectionInfo);
      this.connectionStats.totalConnections++;
      this.connectionStats.activeConnections++;

      // 연결 성공 메시지 전송
      await this.sendMessage(connectionId, {
        type: 'connection_established',
        connectionId,
        timestamp: new Date().toISOString()
      });
      info('WebSocket connected', {
        connectionId,
        totalConnections: this.connectionStats.activeConnections
      });
      return {
        statusCode: 200,
        body: 'Connected'
      };
    } catch (err) {
      error('WebSocket connection failed', err, {
        connectionId
      });
      return {
        statusCode: 500,
        body: 'Connection failed'
      };
    }
  }

  /**
   * WebSocket 연결 해제 처리
   * @param {Object} event - API Gateway WebSocket 이벤트
   * @param {Object} context - Lambda 컨텍스트
   * @returns {Promise<Object>} 응답
   */
  async handleDisconnect(event, context) {
    const connectionId = event.requestContext.connectionId;
    try {
      debug('WebSocket disconnection', {
        connectionId
      });
      const connectionInfo = this.connections.get(connectionId);
      if (connectionInfo) {
        // 모든 구독에서 제거
        connectionInfo.subscriptions.forEach(subscription => {
          this.unsubscribeFromRoom(connectionId, subscription);
        });

        // 연결 정보 제거
        this.connections.delete(connectionId);
        this.connectionStats.activeConnections--;
      }
      info('WebSocket disconnected', {
        connectionId,
        totalConnections: this.connectionStats.activeConnections
      });
      return {
        statusCode: 200,
        body: 'Disconnected'
      };
    } catch (err) {
      error('WebSocket disconnection failed', err, {
        connectionId
      });
      return {
        statusCode: 500,
        body: 'Disconnection failed'
      };
    }
  }

  /**
   * WebSocket 메시지 처리
   * @param {Object} event - API Gateway WebSocket 이벤트
   * @param {Object} context - Lambda 컨텍스트
   * @returns {Promise<Object>} 응답
   */
  async handleMessage(event, context) {
    const connectionId = event.requestContext.connectionId;
    const routeKey = event.requestContext.routeKey;
    try {
      const message = JSON.parse(event.body || '{}');
      debug('WebSocket message received', {
        connectionId,
        routeKey,
        messageType: message.type
      });

      // 연결 활동 시간 업데이트
      this.updateLastActivity(connectionId);
      this.connectionStats.totalMessages++;

      // 메시지 타입별 처리
      const response = await this.processMessage(connectionId, message, routeKey);
      return {
        statusCode: 200,
        body: JSON.stringify(response || {
          status: 'processed'
        })
      };
    } catch (err) {
      error('WebSocket message processing failed', err, {
        connectionId
      });

      // 오류 메시지 전송
      await this.sendMessage(connectionId, {
        type: 'error',
        message: 'Message processing failed',
        timestamp: new Date().toISOString()
      });
      this.connectionStats.totalErrors++;
      return {
        statusCode: 400,
        body: 'Message processing failed'
      };
    }
  }

  /**
   * 메시지 처리
   * @param {string} connectionId - 연결 ID
   * @param {Object} message - 메시지 객체
   * @param {string} routeKey - 라우트 키
   * @returns {Promise<Object>} 처리 결과
   */
  async processMessage(connectionId, message, routeKey) {
    const {
      type,
      data
    } = message;
    switch (type) {
      case 'subscribe':
        return this.handleSubscribe(connectionId, data);
      case 'unsubscribe':
        return this.handleUnsubscribe(connectionId, data);
      case 'ping':
        return this.handlePing(connectionId);
      case 'get_flood_data':
        return this.handleGetFloodData(connectionId, data);
      case 'proximity_check':
        return this.handleProximityCheck(connectionId, data);
      default:
        // 커스텀 메시지 핸들러 확인
        const handler = this.messageHandlers.get(type);
        if (handler) {
          return handler(connectionId, data);
        }
        warn('Unknown message type', {
          type,
          connectionId
        });
        return {
          error: 'Unknown message type'
        };
    }
  }

  /**
   * 구독 처리
   * @param {string} connectionId - 연결 ID
   * @param {Object} data - 구독 데이터
   * @returns {Object} 처리 결과
   */
  handleSubscribe(connectionId, data) {
    const {
      room,
      filters = {}
    } = data;
    if (!room) {
      return {
        error: 'Room name is required'
      };
    }
    this.subscribeToRoom(connectionId, room, filters);
    debug('Client subscribed to room', {
      connectionId,
      room,
      filters
    });
    return {
      type: 'subscription_confirmed',
      room,
      filters,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 구독 해제 처리
   * @param {string} connectionId - 연결 ID
   * @param {Object} data - 구독 해제 데이터
   * @returns {Object} 처리 결과
   */
  handleUnsubscribe(connectionId, data) {
    const {
      room
    } = data;
    if (!room) {
      return {
        error: 'Room name is required'
      };
    }
    this.unsubscribeFromRoom(connectionId, room);
    debug('Client unsubscribed from room', {
      connectionId,
      room
    });
    return {
      type: 'unsubscription_confirmed',
      room,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Ping 처리
   * @param {string} connectionId - 연결 ID
   * @returns {Object} Pong 응답
   */
  handlePing(connectionId) {
    return {
      type: 'pong',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 홍수 데이터 요청 처리
   * @param {string} connectionId - 연결 ID
   * @param {Object} data - 요청 데이터
   * @returns {Promise<Object>} 홍수 데이터
   */
  async handleGetFloodData(connectionId, data) {
    try {
      // 실제 구현에서는 FloodDataAPI 서비스 사용
      const floodData = await this.getFloodDataFromService(data);
      return {
        type: 'flood_data_response',
        data: floodData,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      error('Failed to get flood data', err, {
        connectionId
      });
      return {
        type: 'error',
        message: 'Failed to get flood data',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 근접성 검사 요청 처리
   * @param {string} connectionId - 연결 ID
   * @param {Object} data - 검사 데이터
   * @returns {Promise<Object>} 근접성 검사 결과
   */
  async handleProximityCheck(connectionId, data) {
    try {
      // 실제 구현에서는 ProximityCheckService 사용
      const proximityResult = await this.checkProximityFromService(data);
      return {
        type: 'proximity_check_response',
        data: proximityResult,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      error('Failed to check proximity', err, {
        connectionId
      });
      return {
        type: 'error',
        message: 'Failed to check proximity',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 룸 구독
   * @param {string} connectionId - 연결 ID
   * @param {string} room - 룸 이름
   * @param {Object} filters - 필터 조건
   */
  subscribeToRoom(connectionId, room, filters = {}) {
    // 룸이 없으면 생성
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Map());
    }

    // 연결을 룸에 추가
    this.rooms.get(room).set(connectionId, {
      connectionId,
      filters,
      subscribedAt: Date.now()
    });

    // 연결 정보에 구독 추가
    const connectionInfo = this.connections.get(connectionId);
    if (connectionInfo) {
      connectionInfo.subscriptions.add(room);
    }
  }

  /**
   * 룸 구독 해제
   * @param {string} connectionId - 연결 ID
   * @param {string} room - 룸 이름
   */
  unsubscribeFromRoom(connectionId, room) {
    const roomConnections = this.rooms.get(room);
    if (roomConnections) {
      roomConnections.delete(connectionId);

      // 룸이 비어있으면 제거
      if (roomConnections.size === 0) {
        this.rooms.delete(room);
      }
    }

    // 연결 정보에서 구독 제거
    const connectionInfo = this.connections.get(connectionId);
    if (connectionInfo) {
      connectionInfo.subscriptions.delete(room);
    }
  }

  /**
   * 룸에 메시지 브로드캐스트
   * @param {string} room - 룸 이름
   * @param {Object} message - 메시지
   * @param {Object} options - 브로드캐스트 옵션
   */
  async broadcastToRoom(room, message, options = {}) {
    const roomConnections = this.rooms.get(room);
    if (!roomConnections) {
      debug('Room not found for broadcast', {
        room
      });
      return;
    }
    const {
      excludeConnection = null,
      applyFilters = true
    } = options;
    const broadcastPromises = [];
    roomConnections.forEach((subscription, connectionId) => {
      if (connectionId === excludeConnection) {
        return;
      }

      // 필터 적용
      if (applyFilters && !this.messageMatchesFilters(message, subscription.filters)) {
        return;
      }
      broadcastPromises.push(this.sendMessage(connectionId, message));
    });
    try {
      await Promise.allSettled(broadcastPromises);
      debug('Message broadcasted to room', {
        room,
        recipientCount: broadcastPromises.length
      });
    } catch (err) {
      error('Broadcast failed', err, {
        room
      });
    }
  }

  /**
   * 개별 연결에 메시지 전송
   * @param {string} connectionId - 연결 ID
   * @param {Object} message - 메시지
   * @returns {Promise<boolean>} 전송 성공 여부
   */
  async sendMessage(connectionId, message) {
    try {
      // AWS API Gateway Management API 사용
      const apiGatewayManagementApi = this.getApiGatewayManagementApi();
      await apiGatewayManagementApi.postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(message)
      }).promise();
      debug('Message sent to connection', {
        connectionId,
        messageType: message.type
      });
      return true;
    } catch (err) {
      if (err.statusCode === 410) {
        // 연결이 끊어진 경우
        warn('Connection is stale, removing', {
          connectionId
        });
        this.handleStaleConnection(connectionId);
      } else {
        error('Failed to send message', err, {
          connectionId
        });
      }
      return false;
    }
  }

  /**
   * 메시지가 필터와 일치하는지 확인
   * @param {Object} message - 메시지
   * @param {Object} filters - 필터 조건
   * @returns {boolean} 일치 여부
   */
  messageMatchesFilters(message, filters) {
    if (!filters || Object.keys(filters).length === 0) {
      return true;
    }

    // 지역 필터
    if (filters.region && message.data?.region !== filters.region) {
      return false;
    }

    // 심각도 필터
    if (filters.severity && message.data?.severity !== filters.severity) {
      return false;
    }

    // 경보 유형 필터
    if (filters.alertType && message.data?.alertType !== filters.alertType) {
      return false;
    }

    // 위치 기반 필터
    if (filters.location && filters.radius) {
      const distance = this.calculateDistance(filters.location, {
        lat: message.data?.latitude,
        lng: message.data?.longitude
      });
      if (distance > filters.radius) {
        return false;
      }
    }
    return true;
  }

  /**
   * 끊어진 연결 처리
   * @param {string} connectionId - 연결 ID
   */
  handleStaleConnection(connectionId) {
    const connectionInfo = this.connections.get(connectionId);
    if (connectionInfo) {
      // 모든 구독에서 제거
      connectionInfo.subscriptions.forEach(room => {
        this.unsubscribeFromRoom(connectionId, room);
      });

      // 연결 정보 제거
      this.connections.delete(connectionId);
      this.connectionStats.activeConnections--;
    }
  }

  /**
   * 연결 활동 시간 업데이트
   * @param {string} connectionId - 연결 ID
   */
  updateLastActivity(connectionId) {
    const connectionInfo = this.connections.get(connectionId);
    if (connectionInfo) {
      connectionInfo.lastActivity = Date.now();
    }
  }

  /**
   * 연결 메타데이터 추출
   * @param {Object} event - WebSocket 이벤트
   * @returns {Object} 메타데이터
   */
  extractConnectionMetadata(event) {
    const headers = event.headers || {};
    const requestContext = event.requestContext || {};
    return {
      userAgent: headers['User-Agent'],
      origin: headers.Origin,
      sourceIp: requestContext.identity?.sourceIp,
      stage: requestContext.stage,
      requestId: requestContext.requestId
    };
  }

  /**
   * 커스텀 메시지 핸들러 등록
   * @param {string} messageType - 메시지 타입
   * @param {Function} handler - 핸들러 함수
   */
  registerMessageHandler(messageType, handler) {
    this.messageHandlers.set(messageType, handler);
    debug('Message handler registered', {
      messageType
    });
  }

  /**
   * 연결 통계 조회
   * @returns {Object} 연결 통계
   */
  getConnectionStats() {
    return _objectSpread(_objectSpread({}, this.connectionStats), {}, {
      roomCount: this.rooms.size,
      connectionDetails: Array.from(this.connections.entries()).map(([id, info]) => ({
        connectionId: id,
        connectedAt: info.connectedAt,
        lastActivity: info.lastActivity,
        subscriptions: Array.from(info.subscriptions)
      }))
    });
  }

  /**
   * API Gateway Management API 인스턴스 가져오기
   * @returns {Object} API Gateway Management API
   */
  getApiGatewayManagementApi() {
    const AWS = __webpack_require__(3778);
    return new AWS.ApiGatewayManagementApi({
      endpoint: process.env.WEBSOCKET_API_ENDPOINT
    });
  }

  /**
   * 거리 계산
   * @param {Object} pos1 - 첫 번째 위치
   * @param {Object} pos2 - 두 번째 위치
   * @returns {number} 거리 (미터)
   */
  calculateDistance(pos1, pos2) {
    if (!pos1 || !pos2 || !pos1.lat || !pos1.lng || !pos2.lat || !pos2.lng) {
      return Infinity;
    }
    const R = 6371000; // 지구 반지름 (미터)
    const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
    const dLng = (pos2.lng - pos1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * 홍수 데이터 서비스에서 데이터 가져오기 (플레이스홀더)
   * @param {Object} params - 요청 파라미터
   * @returns {Promise<Object>} 홍수 데이터
   */
  async getFloodDataFromService(params) {
    // 실제 구현에서는 적절한 서비스 호출
    return {
      data: [],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 근접성 검사 서비스에서 결과 가져오기 (플레이스홀더)
   * @param {Object} params - 검사 파라미터
   * @returns {Promise<Object>} 근접성 검사 결과
   */
  async checkProximityFromService(params) {
    // 실제 구현에서는 적절한 서비스 호출
    return {
      hasProximityAlert: false,
      alertPoints: [],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 정리
   */
  cleanup() {
    this.connections.clear();
    this.rooms.clear();
    this.messageHandlers.clear();
    info('WebSocketManager cleaned up');
  }
}

// 싱글톤 인스턴스 생성
const webSocketManager = new WebSocketManager();
module.exports = {
  WebSocketManager,
  webSocketManager,
  // Lambda 핸들러 함수들
  connectHandler: (event, context) => webSocketManager.handleConnect(event, context),
  disconnectHandler: (event, context) => webSocketManager.handleDisconnect(event, context),
  messageHandler: (event, context) => webSocketManager.handleMessage(event, context)
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(9888);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=websocket.js.map