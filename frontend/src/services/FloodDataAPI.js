// FloodDataAPI.js
// 백엔드 API 호출 서비스 (침수 데이터, 한강홍수통제소 데이터, 다중 소스 데이터)

/**
 * 홍수 데이터 API 클래스
 */
class FloodDataAPI {
  constructor(baseURL = '') {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  /**
   * HTTP 요청 헬퍼
   * @param {string} url - 요청 URL
   * @param {Object} options - 요청 옵션
   * @returns {Promise<Object>} 응답 데이터
   */
  async request(url, options = {}) {
    const fullURL = `${this.baseURL}${url}`
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    }

    try {
      const response = await fetch(fullURL, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API request failed: ${fullURL}`, error)
      throw error
    }
  }

  /**
   * GET 요청
   * @param {string} url - 요청 URL
   * @param {Object} params - 쿼리 파라미터
   * @param {Object} options - 추가 옵션
   * @returns {Promise<Object>} 응답 데이터
   */
  async get(url, params = {}, options = {}) {
    const queryString = new URLSearchParams(params).toString()
    const fullURL = queryString ? `${url}?${queryString}` : url
    
    return this.request(fullURL, {
      method: 'GET',
      ...options,
    })
  }

  /**
   * POST 요청
   * @param {string} url - 요청 URL
   * @param {Object} data - 요청 데이터
   * @param {Object} options - 추가 옵션
   * @returns {Promise<Object>} 응답 데이터
   */
  async post(url, data = {}, options = {}) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    })
  }

  /**
   * PUT 요청
   * @param {string} url - 요청 URL
   * @param {Object} data - 요청 데이터
   * @param {Object} options - 추가 옵션
   * @returns {Promise<Object>} 응답 데이터
   */
  async put(url, data = {}, options = {}) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    })
  }

  /**
   * DELETE 요청
   * @param {string} url - 요청 URL
   * @param {Object} options - 추가 옵션
   * @returns {Promise<Object>} 응답 데이터
   */
  async delete(url, options = {}) {
    return this.request(url, {
      method: 'DELETE',
      ...options,
    })
  }

  // ===== 홍수 데이터 API =====

  /**
   * 전체 홍수 데이터 조회
   * @param {Object} params - 쿼리 파라미터
   * @returns {Promise<Object>} 홍수 데이터
   */
  async getFloodData(params = {}) {
    return this.get('/api/flood-data', params)
  }

  /**
   * 한강홍수통제소 데이터 조회
   * @param {Object} params - 쿼리 파라미터
   * @returns {Promise<Object>} 한강홍수통제소 데이터
   */
  async getHanRiverData(params = {}) {
    return this.get('/api/flood-data/hanriver', params)
  }

  /**
   * 위치 기반 홍수 데이터 조회
   * @param {Object} location - 위치 정보
   * @param {number} location.latitude - 위도
   * @param {number} location.longitude - 경도
   * @param {number} location.radius - 반경 (미터)
   * @returns {Promise<Object>} 위치 기반 홍수 데이터
   */
  async getFloodDataByLocation(location) {
    const { latitude, longitude, radius = 5000 } = location
    
    return this.get('/api/flood-data/location', {
      latitude,
      longitude,
      radius,
    })
  }

  /**
   * 영역 기반 홍수 데이터 조회
   * @param {Object} bounds - 영역 경계
   * @param {number} bounds.north - 북쪽 경계
   * @param {number} bounds.south - 남쪽 경계
   * @param {number} bounds.east - 동쪽 경계
   * @param {number} bounds.west - 서쪽 경계
   * @returns {Promise<Object>} 영역 내 홍수 데이터
   */
  async getFloodDataByBounds(bounds) {
    return this.get('/api/flood-data/location', bounds)
  }

  // ===== 다중 소스 데이터 API =====

  /**
   * 특정 위치의 다중 소스 데이터 조회
   * @param {string} locationId - 위치 ID
   * @returns {Promise<Object>} 다중 소스 데이터
   */
  async getMultiSourceData(locationId) {
    return this.get(`/api/flood-data/multi-source/${locationId}`)
  }

  /**
   * 다중 소스 데이터 목록 조회
   * @param {Object} params - 쿼리 파라미터
   * @returns {Promise<Object>} 다중 소스 데이터 목록
   */
  async getMultiSourceDataList(params = {}) {
    return this.get('/api/flood-data/multi-source', params)
  }

  // ===== 데이터 갱신 API =====

  /**
   * 홍수 데이터 갱신
   * @param {Object} options - 갱신 옵션
   * @returns {Promise<Object>} 갱신 결과
   */
  async refreshFloodData(options = {}) {
    const {
      apiTypes = ['waterlevel', 'realtime', 'forecast'],
      forceRefresh = false,
      region = null,
    } = options

    return this.post('/api/flood-data/refresh', {
      apiTypes,
      forceRefresh,
      region,
    })
  }

  /**
   * 특정 지역 데이터 갱신
   * @param {string} region - 지역명
   * @returns {Promise<Object>} 갱신 결과
   */
  async refreshRegionData(region) {
    return this.post(`/api/flood-data/refresh/${region}`)
  }

  /**
   * 데이터 상태 조회
   * @returns {Promise<Object>} 데이터 상태
   */
  async getDataStatus() {
    return this.get('/api/flood-data/status')
  }

  /**
   * 오래된 데이터 정리
   * @param {number} maxAgeHours - 최대 보관 시간 (시간)
   * @returns {Promise<Object>} 정리 결과
   */
  async cleanupOldData(maxAgeHours = 24) {
    return this.post('/api/flood-data/cleanup', { maxAgeHours })
  }

  // ===== 네이버 API =====

  /**
   * 안전 경로 조회
   * @param {Object} routeParams - 경로 파라미터
   * @returns {Promise<Object>} 안전 경로 데이터
   */
  async getSafeRoute(routeParams) {
    const {
      start,
      goal,
      waypoints = [],
      option = 'trafast',
      avoid = [],
    } = routeParams

    return this.get('/api/directions/safe-route', {
      start: `${start.longitude},${start.latitude}`,
      goal: `${goal.longitude},${goal.latitude}`,
      waypoints: waypoints.map(wp => `${wp.longitude},${wp.latitude}`).join(':'),
      option,
      avoid: avoid.join(','),
    })
  }

  /**
   * 주소 지오코딩
   * @param {string} address - 주소
   * @returns {Promise<Object>} 지오코딩 결과
   */
  async geocodeAddress(address) {
    return this.post('/api/geocoding/address', { address })
  }

  /**
   * 좌표 역지오코딩
   * @param {Object} coordinates - 좌표
   * @returns {Promise<Object>} 역지오코딩 결과
   */
  async reverseGeocode(coordinates) {
    const { latitude, longitude } = coordinates
    
    return this.post('/api/geocoding/reverse', {
      latitude,
      longitude,
    })
  }

  // ===== 경로 근접성 검사 API =====

  /**
   * 경로 근접성 검사
   * @param {Object} routeData - 경로 데이터
   * @returns {Promise<Object>} 근접성 검사 결과
   */
  async checkRouteProximity(routeData) {
    const {
      routePath,
      proximityRadius = 1500,
    } = routeData

    return this.post('/api/directions/check-proximity', {
      routePath,
      proximityRadius,
    })
  }

  /**
   * 대체 경로 요청
   * @param {Object} alternativeParams - 대체 경로 파라미터
   * @returns {Promise<Object>} 대체 경로 데이터
   */
  async getAlternativeRoute(alternativeParams) {
    const {
      originalRoute,
      avoidPoints = [],
      proximityRadius = 1500,
    } = alternativeParams

    return this.post('/api/directions/alternative-route', {
      originalRoute,
      avoidPoints,
      proximityRadius,
    })
  }

  // ===== 실시간 업데이트 =====

  /**
   * WebSocket 연결 설정
   * @param {Function} onMessage - 메시지 수신 콜백
   * @param {Function} onError - 오류 콜백
   * @returns {WebSocket} WebSocket 인스턴스
   */
  connectWebSocket(onMessage, onError) {
    const wsURL = this.baseURL.replace(/^http/, 'ws') + '/ws'
    const ws = new WebSocket(wsURL)

    ws.onopen = () => {
      console.log('WebSocket connected')
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (onMessage) onMessage(data)
      } catch (error) {
        console.error('WebSocket message parse error:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      if (onError) onError(error)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
    }

    return ws
  }

  // ===== 유틸리티 메서드 =====

  /**
   * API 응답 캐싱
   * @param {string} key - 캐시 키
   * @param {Function} apiCall - API 호출 함수
   * @param {number} ttl - 캐시 유효 시간 (밀리초)
   * @returns {Promise<Object>} 캐시된 또는 새로운 데이터
   */
  async withCache(key, apiCall, ttl = 300000) { // 5분 기본값
    const cacheKey = `floodapi_${key}`
    const cached = localStorage.getItem(cacheKey)
    
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < ttl) {
          return data
        }
      } catch (error) {
        console.warn('Cache parse error:', error)
      }
    }

    try {
      const data = await apiCall()
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now(),
      }))
      return data
    } catch (error) {
      // 캐시된 데이터가 있으면 오류 시에도 반환
      if (cached) {
        try {
          const { data } = JSON.parse(cached)
          console.warn('Using stale cache due to API error:', error)
          return data
        } catch (cacheError) {
          console.error('Cache fallback failed:', cacheError)
        }
      }
      throw error
    }
  }

  /**
   * 배치 요청
   * @param {Array} requests - 요청 배열
   * @param {number} batchSize - 배치 크기
   * @returns {Promise<Array>} 응답 배열
   */
  async batchRequests(requests, batchSize = 5) {
    const results = []
    
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize)
      const batchResults = await Promise.allSettled(
        batch.map(request => request())
      )
      
      results.push(...batchResults.map(result => 
        result.status === 'fulfilled' ? result.value : { error: result.reason }
      ))
    }
    
    return results
  }

  /**
   * 재시도 로직이 있는 요청
   * @param {Function} apiCall - API 호출 함수
   * @param {number} maxRetries - 최대 재시도 횟수
   * @param {number} delay - 재시도 간격 (밀리초)
   * @returns {Promise<Object>} 응답 데이터
   */
  async withRetry(apiCall, maxRetries = 3, delay = 1000) {
    let lastError
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall()
      } catch (error) {
        lastError = error
        
        if (attempt < maxRetries) {
          console.warn(`API call failed, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, delay))
          delay *= 2 // 지수 백오프
        }
      }
    }
    
    throw lastError
  }

  /**
   * 요청 취소 토큰 생성
   * @returns {Object} 취소 토큰
   */
  createCancelToken() {
    const controller = new AbortController()
    
    return {
      signal: controller.signal,
      cancel: (reason = 'Request cancelled') => {
        controller.abort(reason)
      },
    }
  }

  /**
   * 캐시 정리
   * @param {string} pattern - 정리할 캐시 키 패턴
   */
  clearCache(pattern = 'floodapi_') {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(pattern))
    keys.forEach(key => localStorage.removeItem(key))
    console.log(`Cleared ${keys.length} cache entries`)
  }
}

// 기본 인스턴스 생성
const floodDataAPI = new FloodDataAPI()

export default floodDataAPI
export { FloodDataAPI }