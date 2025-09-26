// RealtimeService.js
// WebSocket 클라이언트 및 네이버 지도 자동 갱신 서비스

import floodDataAPI from './FloodDataAPI'

/**
 * 실시간 서비스 클래스
 */
class RealtimeService {
  constructor() {
    this.websocket = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
    this.subscriptions = new Map()
    this.eventListeners = new Map()
    this.heartbeatInterval = null
    this.connectionStats = {
      connectTime: null,
      totalMessages: 0,
      totalErrors: 0,
      lastMessageTime: null,
    }
  }

  /**
   * WebSocket 연결 시작
   * @param {string} wsUrl - WebSocket URL
   * @param {Object} options - 연결 옵션
   * @returns {Promise<boolean>} 연결 성공 여부
   */
  async connect(wsUrl, options = {}) {
    const {
      autoReconnect = true,
      heartbeatInterval = 30000, // 30초
      timeout = 10000, // 10초
    } = options

    if (this.isConnected) {
      console.warn('WebSocket is already connected')
      return true
    }

    return new Promise((resolve, reject) => {
      try {
        console.log('Connecting to WebSocket:', wsUrl)
        
        this.websocket = new WebSocket(wsUrl)
        
        // 연결 타임아웃 설정
        const timeoutId = setTimeout(() => {
          if (!this.isConnected) {
            this.websocket.close()
            reject(new Error('WebSocket connection timeout'))
          }
        }, timeout)

        this.websocket.onopen = (event) => {
          clearTimeout(timeoutId)
          this.isConnected = true
          this.reconnectAttempts = 0
          this.connectionStats.connectTime = Date.now()
          
          console.log('WebSocket connected')
          
          // 하트비트 시작
          if (heartbeatInterval > 0) {
            this.startHeartbeat(heartbeatInterval)
          }
          
          this.emit('connected', { event })
          resolve(true)
        }

        this.websocket.onmessage = (event) => {
          this.handleMessage(event)
        }

        this.websocket.onclose = (event) => {
          this.handleClose(event, autoReconnect)
        }

        this.websocket.onerror = (event) => {
          this.handleError(event)
          if (!this.isConnected) {
            clearTimeout(timeoutId)
            reject(new Error('WebSocket connection failed'))
          }
        }

      } catch (error) {
        console.error('WebSocket connection error:', error)
        reject(error)
      }
    })
  }

  /**
   * WebSocket 연결 해제
   */
  disconnect() {
    if (this.websocket) {
      this.isConnected = false
      this.stopHeartbeat()
      this.websocket.close(1000, 'Client disconnect')
      this.websocket = null
      
      console.log('WebSocket disconnected')
      this.emit('disconnected')
    }
  }

  /**
   * 메시지 전송
   * @param {Object} message - 전송할 메시지
   * @returns {boolean} 전송 성공 여부
   */
  send(message) {
    if (!this.isConnected || !this.websocket) {
      console.warn('WebSocket is not connected')
      return false
    }

    try {
      const messageStr = JSON.stringify(message)
      this.websocket.send(messageStr)
      
      console.log('Message sent:', message.type)
      return true
    } catch (error) {
      console.error('Failed to send message:', error)
      this.connectionStats.totalErrors++
      return false
    }
  }

  /**
   * 룸 구독
   * @param {string} room - 룸 이름
   * @param {Object} filters - 필터 조건
   * @returns {boolean} 구독 성공 여부
   */
  subscribe(room, filters = {}) {
    const success = this.send({
      type: 'subscribe',
      data: { room, filters }
    })

    if (success) {
      this.subscriptions.set(room, { filters, subscribedAt: Date.now() })
      console.log('Subscribed to room:', room)
    }

    return success
  }

  /**
   * 룸 구독 해제
   * @param {string} room - 룸 이름
   * @returns {boolean} 구독 해제 성공 여부
   */
  unsubscribe(room) {
    const success = this.send({
      type: 'unsubscribe',
      data: { room }
    })

    if (success) {
      this.subscriptions.delete(room)
      console.log('Unsubscribed from room:', room)
    }

    return success
  }

  /**
   * 홍수 데이터 실시간 구독
   * @param {Object} options - 구독 옵션
   * @returns {boolean} 구독 성공 여부
   */
  subscribeToFloodData(options = {}) {
    const {
      region = null,
      severity = null,
      alertType = null,
      location = null,
      radius = null,
    } = options

    const filters = {}
    if (region) filters.region = region
    if (severity) filters.severity = severity
    if (alertType) filters.alertType = alertType
    if (location && radius) {
      filters.location = location
      filters.radius = radius
    }

    return this.subscribe('flood_data', filters)
  }

  /**
   * 근접성 알림 실시간 구독
   * @param {Array} routePath - 경로 좌표 배열
   * @param {number} proximityRadius - 근접 반경
   * @returns {boolean} 구독 성공 여부
   */
  subscribeToProximityAlerts(routePath, proximityRadius = 1500) {
    return this.subscribe('proximity_alerts', {
      routePath,
      proximityRadius,
    })
  }

  /**
   * 홍수 데이터 요청
   * @param {Object} params - 요청 파라미터
   * @returns {boolean} 요청 성공 여부
   */
  requestFloodData(params = {}) {
    return this.send({
      type: 'get_flood_data',
      data: params
    })
  }

  /**
   * 근접성 검사 요청
   * @param {Array} routePath - 경로 좌표 배열
   * @param {number} proximityRadius - 근접 반경
   * @returns {boolean} 요청 성공 여부
   */
  requestProximityCheck(routePath, proximityRadius = 1500) {
    return this.send({
      type: 'proximity_check',
      data: { routePath, proximityRadius }
    })
  }

  /**
   * 메시지 처리
   * @param {MessageEvent} event - WebSocket 메시지 이벤트
   */
  handleMessage(event) {
    try {
      const message = JSON.parse(event.data)
      
      this.connectionStats.totalMessages++
      this.connectionStats.lastMessageTime = Date.now()
      
      console.log('Message received:', message.type)
      
      // 메시지 타입별 처리
      switch (message.type) {
        case 'connection_established':
          this.handleConnectionEstablished(message)
          break
          
        case 'subscription_confirmed':
          this.handleSubscriptionConfirmed(message)
          break
          
        case 'flood_data_update':
          this.handleFloodDataUpdate(message)
          break
          
        case 'proximity_alert':
          this.handleProximityAlert(message)
          break
          
        case 'flood_data_response':
          this.handleFloodDataResponse(message)
          break
          
        case 'proximity_check_response':
          this.handleProximityCheckResponse(message)
          break
          
        case 'pong':
          this.handlePong(message)
          break
          
        case 'error':
          this.handleServerError(message)
          break
          
        default:
          console.warn('Unknown message type:', message.type)
          this.emit('unknown_message', message)
      }
      
      // 모든 메시지에 대한 일반 이벤트 발생
      this.emit('message', message)
      
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error)
      this.connectionStats.totalErrors++
    }
  }

  /**
   * 연결 확인 메시지 처리
   * @param {Object} message - 메시지
   */
  handleConnectionEstablished(message) {
    console.log('Connection established:', message.connectionId)
    this.emit('connection_established', message)
  }

  /**
   * 구독 확인 메시지 처리
   * @param {Object} message - 메시지
   */
  handleSubscriptionConfirmed(message) {
    console.log('Subscription confirmed:', message.room)
    this.emit('subscription_confirmed', message)
  }

  /**
   * 홍수 데이터 업데이트 처리
   * @param {Object} message - 메시지
   */
  handleFloodDataUpdate(message) {
    console.log('Flood data updated:', message.data?.length || 0, 'items')
    this.emit('flood_data_update', message.data)
  }

  /**
   * 근접성 알림 처리
   * @param {Object} message - 메시지
   */
  handleProximityAlert(message) {
    console.log('Proximity alert:', message.data?.alertPoints?.length || 0, 'points')
    this.emit('proximity_alert', message.data)
  }

  /**
   * 홍수 데이터 응답 처리
   * @param {Object} message - 메시지
   */
  handleFloodDataResponse(message) {
    console.log('Flood data response received')
    this.emit('flood_data_response', message.data)
  }

  /**
   * 근접성 검사 응답 처리
   * @param {Object} message - 메시지
   */
  handleProximityCheckResponse(message) {
    console.log('Proximity check response received')
    this.emit('proximity_check_response', message.data)
  }

  /**
   * Pong 메시지 처리
   * @param {Object} message - 메시지
   */
  handlePong(message) {
    console.log('Pong received')
    this.emit('pong', message)
  }

  /**
   * 서버 오류 메시지 처리
   * @param {Object} message - 메시지
   */
  handleServerError(message) {
    console.error('Server error:', message.message)
    this.connectionStats.totalErrors++
    this.emit('server_error', message)
  }

  /**
   * 연결 종료 처리
   * @param {CloseEvent} event - 종료 이벤트
   * @param {boolean} autoReconnect - 자동 재연결 여부
   */
  handleClose(event, autoReconnect) {
    this.isConnected = false
    this.stopHeartbeat()
    
    console.log('WebSocket closed:', event.code, event.reason)
    
    this.emit('disconnected', { code: event.code, reason: event.reason })
    
    // 자동 재연결
    if (autoReconnect && event.code !== 1000) { // 정상 종료가 아닌 경우
      this.attemptReconnect()
    }
  }

  /**
   * 오류 처리
   * @param {Event} event - 오류 이벤트
   */
  handleError(event) {
    console.error('WebSocket error:', event)
    this.connectionStats.totalErrors++
    this.emit('error', event)
  }

  /**
   * 재연결 시도
   */
  async attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached')
      this.emit('reconnect_failed')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
    
    setTimeout(async () => {
      try {
        // 이전 WebSocket URL 재사용 (실제 구현에서는 URL 저장 필요)
        await this.connect(this.lastConnectedUrl)
        
        // 이전 구독 복원
        this.restoreSubscriptions()
        
        this.emit('reconnected')
      } catch (error) {
        console.error('Reconnection failed:', error)
        this.attemptReconnect()
      }
    }, delay)
  }

  /**
   * 구독 복원
   */
  restoreSubscriptions() {
    this.subscriptions.forEach((subscription, room) => {
      this.subscribe(room, subscription.filters)
    })
  }

  /**
   * 하트비트 시작
   * @param {number} interval - 하트비트 간격 (밀리초)
   */
  startHeartbeat(interval) {
    this.stopHeartbeat()
    
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.send({ type: 'ping' })
      }
    }, interval)
  }

  /**
   * 하트비트 중지
   */
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  /**
   * 이벤트 리스너 등록
   * @param {string} eventType - 이벤트 타입
   * @param {Function} listener - 리스너 함수
   * @returns {Function} 리스너 제거 함수
   */
  on(eventType, listener) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set())
    }
    
    this.eventListeners.get(eventType).add(listener)
    
    // 리스너 제거 함수 반환
    return () => {
      const listeners = this.eventListeners.get(eventType)
      if (listeners) {
        listeners.delete(listener)
      }
    }
  }

  /**
   * 이벤트 리스너 제거
   * @param {string} eventType - 이벤트 타입
   * @param {Function} listener - 리스너 함수
   */
  off(eventType, listener) {
    const listeners = this.eventListeners.get(eventType)
    if (listeners) {
      listeners.delete(listener)
    }
  }

  /**
   * 이벤트 발생
   * @param {string} eventType - 이벤트 타입
   * @param {*} data - 이벤트 데이터
   */
  emit(eventType, data) {
    const listeners = this.eventListeners.get(eventType)
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data)
        } catch (error) {
          console.error('Event listener error:', error)
        }
      })
    }
  }

  /**
   * 연결 상태 확인
   * @returns {boolean} 연결 상태
   */
  isConnectedToServer() {
    return this.isConnected && this.websocket?.readyState === WebSocket.OPEN
  }

  /**
   * 연결 통계 조회
   * @returns {Object} 연결 통계
   */
  getConnectionStats() {
    return {
      ...this.connectionStats,
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      subscriptionCount: this.subscriptions.size,
      uptime: this.connectionStats.connectTime ? 
        Date.now() - this.connectionStats.connectTime : 0,
    }
  }

  /**
   * 활성 구독 목록 조회
   * @returns {Array} 구독 목록
   */
  getActiveSubscriptions() {
    return Array.from(this.subscriptions.entries()).map(([room, subscription]) => ({
      room,
      filters: subscription.filters,
      subscribedAt: subscription.subscribedAt,
      duration: Date.now() - subscription.subscribedAt,
    }))
  }

  /**
   * 폴백 모드로 전환 (HTTP 폴링)
   * @param {Object} options - 폴링 옵션
   */
  enableFallbackMode(options = {}) {
    const {
      interval = 30000, // 30초
      maxRetries = 3,
    } = options

    console.log('Enabling fallback mode (HTTP polling)')
    
    this.fallbackInterval = setInterval(async () => {
      try {
        // HTTP API를 통한 데이터 폴링
        const floodData = await floodDataAPI.getFloodData()
        this.emit('flood_data_update', floodData.data)
      } catch (error) {
        console.error('Fallback polling failed:', error)
      }
    }, interval)

    this.emit('fallback_enabled')
  }

  /**
   * 폴백 모드 비활성화
   */
  disableFallbackMode() {
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval)
      this.fallbackInterval = null
      console.log('Fallback mode disabled')
      this.emit('fallback_disabled')
    }
  }

  /**
   * 서비스 정리
   */
  cleanup() {
    this.disconnect()
    this.disableFallbackMode()
    this.eventListeners.clear()
    this.subscriptions.clear()
    console.log('RealtimeService cleaned up')
  }
}

// 싱글톤 인스턴스 생성
const realtimeService = new RealtimeService()

export default realtimeService
export { RealtimeService }