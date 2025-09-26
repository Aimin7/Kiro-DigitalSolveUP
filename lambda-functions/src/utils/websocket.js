// websocket.js
// 클라이언트-서버 실시간 통신 설정 유틸리티

const { info, error, debug, warn } = require('./logger');

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
      totalErrors: 0,
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
      debug('WebSocket connection attempt', { connectionId, routeKey });

      // 연결 정보 저장
      const connectionInfo = {
        connectionId,
        connectedAt: Date.now(),
        lastActivity: Date.now(),
        subscriptions: new Set(),
        metadata: this.extractConnectionMetadata(event),
      };

      this.connections.set(connectionId, connectionInfo);
      this.connectionStats.totalConnections++;
      this.connectionStats.activeConnections++;

      // 연결 성공 메시지 전송
      await this.sendMessage(connectionId, {
        type: 'connection_established',
        connectionId,
        timestamp: new Date().toISOString(),
      });

      info('WebSocket connected', { 
        connectionId, 
        totalConnections: this.connectionStats.activeConnections 
      });

      return {
        statusCode: 200,
        body: 'Connected',
      };
    } catch (err) {
      error('WebSocket connection failed', err, { connectionId });
      return {
        statusCode: 500,
        body: 'Connection failed',
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
      debug('WebSocket disconnection', { connectionId });

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
        body: 'Disconnected',
      };
    } catch (err) {
      error('WebSocket disconnection failed', err, { connectionId });
      return {
        statusCode: 500,
        body: 'Disconnection failed',
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
        body: JSON.stringify(response || { status: 'processed' }),
      };
    } catch (err) {
      error('WebSocket message processing failed', err, { connectionId });
      
      // 오류 메시지 전송
      await this.sendMessage(connectionId, {
        type: 'error',
        message: 'Message processing failed',
        timestamp: new Date().toISOString(),
      });

      this.connectionStats.totalErrors++;

      return {
        statusCode: 400,
        body: 'Message processing failed',
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
    const { type, data } = message;

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
        
        warn('Unknown message type', { type, connectionId });
        return { error: 'Unknown message type' };
    }
  }

  /**
   * 구독 처리
   * @param {string} connectionId - 연결 ID
   * @param {Object} data - 구독 데이터
   * @returns {Object} 처리 결과
   */
  handleSubscribe(connectionId, data) {
    const { room, filters = {} } = data;

    if (!room) {
      return { error: 'Room name is required' };
    }

    this.subscribeToRoom(connectionId, room, filters);

    debug('Client subscribed to room', { connectionId, room, filters });

    return {
      type: 'subscription_confirmed',
      room,
      filters,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 구독 해제 처리
   * @param {string} connectionId - 연결 ID
   * @param {Object} data - 구독 해제 데이터
   * @returns {Object} 처리 결과
   */
  handleUnsubscribe(connectionId, data) {
    const { room } = data;

    if (!room) {
      return { error: 'Room name is required' };
    }

    this.unsubscribeFromRoom(connectionId, room);

    debug('Client unsubscribed from room', { connectionId, room });

    return {
      type: 'unsubscription_confirmed',
      room,
      timestamp: new Date().toISOString(),
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
      timestamp: new Date().toISOString(),
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
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      error('Failed to get flood data', err, { connectionId });
      return {
        type: 'error',
        message: 'Failed to get flood data',
        timestamp: new Date().toISOString(),
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
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      error('Failed to check proximity', err, { connectionId });
      return {
        type: 'error',
        message: 'Failed to check proximity',
        timestamp: new Date().toISOString(),
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
      subscribedAt: Date.now(),
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
      debug('Room not found for broadcast', { room });
      return;
    }

    const { excludeConnection = null, applyFilters = true } = options;
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
      error('Broadcast failed', err, { room });
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
        Data: JSON.stringify(message),
      }).promise();

      debug('Message sent to connection', { connectionId, messageType: message.type });
      return true;
    } catch (err) {
      if (err.statusCode === 410) {
        // 연결이 끊어진 경우
        warn('Connection is stale, removing', { connectionId });
        this.handleStaleConnection(connectionId);
      } else {
        error('Failed to send message', err, { connectionId });
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
      const distance = this.calculateDistance(
        filters.location,
        { lat: message.data?.latitude, lng: message.data?.longitude }
      );
      
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
      requestId: requestContext.requestId,
    };
  }

  /**
   * 커스텀 메시지 핸들러 등록
   * @param {string} messageType - 메시지 타입
   * @param {Function} handler - 핸들러 함수
   */
  registerMessageHandler(messageType, handler) {
    this.messageHandlers.set(messageType, handler);
    debug('Message handler registered', { messageType });
  }

  /**
   * 연결 통계 조회
   * @returns {Object} 연결 통계
   */
  getConnectionStats() {
    return {
      ...this.connectionStats,
      roomCount: this.rooms.size,
      connectionDetails: Array.from(this.connections.entries()).map(([id, info]) => ({
        connectionId: id,
        connectedAt: info.connectedAt,
        lastActivity: info.lastActivity,
        subscriptions: Array.from(info.subscriptions),
      })),
    };
  }

  /**
   * API Gateway Management API 인스턴스 가져오기
   * @returns {Object} API Gateway Management API
   */
  getApiGatewayManagementApi() {
    const AWS = require('aws-sdk');
    
    return new AWS.ApiGatewayManagementApi({
      endpoint: process.env.WEBSOCKET_API_ENDPOINT,
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
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
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
      timestamp: new Date().toISOString(),
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
      timestamp: new Date().toISOString(),
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
  messageHandler: (event, context) => webSocketManager.handleMessage(event, context),
};