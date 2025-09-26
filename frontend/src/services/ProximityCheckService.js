// ProximityCheckService.js
// 경로와 홍수주의보 지점 1.5km 반경 검사 클라이언트 서비스

import floodDataAPI from './FloodDataAPI'

/**
 * 근접성 검사 클라이언트 서비스 클래스
 */
class ProximityCheckService {
  constructor() {
    this.defaultProximityRadius = 1500 // 1.5km (미터)
    this.activeChecks = new Map()
    this.monitoringIntervals = new Map()
  }

  /**
   * 경로와 홍수 지점 간 근접성 검사
   * @param {Array} routePath - 경로 좌표 배열 [[lng, lat], ...]
   * @param {Object} options - 검사 옵션
   * @returns {Promise<Object>} 근접성 검사 결과
   */
  async checkRouteProximity(routePath, options = {}) {
    const {
      proximityRadius = this.defaultProximityRadius,
      useCache = true,
      cacheKey = null,
    } = options

    try {
      // 캐시 키 생성
      const key = cacheKey || this.generateCacheKey(routePath, proximityRadius)
      
      // API 호출
      const apiCall = () => floodDataAPI.checkRouteProximity({
        routePath,
        proximityRadius,
      })

      let result
      if (useCache) {
        result = await floodDataAPI.withCache(key, apiCall, 60000) // 1분 캐시
      } else {
        result = await apiCall()
      }

      // 결과 후처리
      const processedResult = this.processProximityResult(result)
      
      // 활성 검사 목록에 추가
      this.activeChecks.set(key, {
        routePath,
        options,
        result: processedResult,
        timestamp: Date.now(),
      })

      return processedResult
    } catch (error) {
      console.error('Route proximity check failed:', error)
      throw new Error(`근접성 검사 실패: ${error.message}`)
    }
  }

  /**
   * 실시간 경로 모니터링 시작
   * @param {Array} routePath - 경로 좌표 배열
   * @param {Function} callback - 결과 콜백
   * @param {Object} options - 모니터링 옵션
   * @returns {string} 모니터링 ID
   */
  startRouteMonitoring(routePath, callback, options = {}) {
    const {
      interval = 30000, // 30초
      proximityRadius = this.defaultProximityRadius,
      onError = null,
    } = options

    const monitoringId = this.generateMonitoringId(routePath)
    
    // 초기 검사
    this.checkRouteProximity(routePath, { proximityRadius, useCache: false })
      .then(result => callback(result))
      .catch(error => {
        console.error('Initial proximity check failed:', error)
        if (onError) onError(error)
      })

    // 주기적 검사 설정
    const intervalId = setInterval(async () => {
      try {
        const result = await this.checkRouteProximity(routePath, { 
          proximityRadius, 
          useCache: false 
        })
        callback(result)
      } catch (error) {
        console.error('Periodic proximity check failed:', error)
        if (onError) onError(error)
      }
    }, interval)

    this.monitoringIntervals.set(monitoringId, {
      intervalId,
      routePath,
      callback,
      options,
      startTime: Date.now(),
    })

    console.log(`Route monitoring started: ${monitoringId}`)
    return monitoringId
  }

  /**
   * 경로 모니터링 중지
   * @param {string} monitoringId - 모니터링 ID
   */
  stopRouteMonitoring(monitoringId) {
    const monitoring = this.monitoringIntervals.get(monitoringId)
    
    if (monitoring) {
      clearInterval(monitoring.intervalId)
      this.monitoringIntervals.delete(monitoringId)
      console.log(`Route monitoring stopped: ${monitoringId}`)
    }
  }

  /**
   * 모든 모니터링 중지
   */
  stopAllMonitoring() {
    this.monitoringIntervals.forEach((monitoring, id) => {
      clearInterval(monitoring.intervalId)
    })
    this.monitoringIntervals.clear()
    console.log('All route monitoring stopped')
  }

  /**
   * 대체 경로 요청
   * @param {Object} originalRoute - 원본 경로 정보
   * @param {Array} avoidPoints - 회피할 지점들
   * @param {Object} options - 대체 경로 옵션
   * @returns {Promise<Object>} 대체 경로 데이터
   */
  async getAlternativeRoute(originalRoute, avoidPoints = [], options = {}) {
    const {
      proximityRadius = this.defaultProximityRadius,
      routeOption = 'trafast',
      maxAlternatives = 3,
    } = options

    try {
      const result = await floodDataAPI.getAlternativeRoute({
        originalRoute,
        avoidPoints,
        proximityRadius,
        routeOption,
        maxAlternatives,
      })

      return this.processAlternativeRouteResult(result)
    } catch (error) {
      console.error('Alternative route request failed:', error)
      throw new Error(`대체 경로 요청 실패: ${error.message}`)
    }
  }

  /**
   * 경로 안전도 평가
   * @param {Array} routePath - 경로 좌표 배열
   * @param {Object} options - 평가 옵션
   * @returns {Promise<Object>} 안전도 평가 결과
   */
  async evaluateRouteSafety(routePath, options = {}) {
    try {
      const proximityResult = await this.checkRouteProximity(routePath, options)
      
      const safetyEvaluation = {
        overallScore: this.calculateSafetyScore(proximityResult),
        riskLevel: this.determineRiskLevel(proximityResult),
        recommendations: this.generateSafetyRecommendations(proximityResult),
        alertSummary: this.summarizeAlerts(proximityResult),
        routeMetrics: this.calculateRouteMetrics(proximityResult),
      }

      return safetyEvaluation
    } catch (error) {
      console.error('Route safety evaluation failed:', error)
      throw new Error(`경로 안전도 평가 실패: ${error.message}`)
    }
  }

  /**
   * 근처 위험 지역 조회
   * @param {Object} location - 중심 위치
   * @param {Object} options - 조회 옵션
   * @returns {Promise<Array>} 근처 위험 지역 목록
   */
  async getNearbyHazards(location, options = {}) {
    const {
      radius = this.defaultProximityRadius,
      severityFilter = null,
      alertTypeFilter = null,
    } = options

    try {
      const floodData = await floodDataAPI.getFloodDataByLocation({
        latitude: location.lat,
        longitude: location.lng,
        radius,
      })

      let hazards = floodData.data || []

      // 필터 적용
      if (severityFilter) {
        hazards = hazards.filter(h => h.severity === severityFilter)
      }

      if (alertTypeFilter) {
        hazards = hazards.filter(h => h.alertType === alertTypeFilter)
      }

      // 거리순 정렬
      hazards = hazards.map(hazard => ({
        ...hazard,
        distance: this.calculateDistance(location, {
          lat: hazard.latitude,
          lng: hazard.longitude,
        }),
      })).sort((a, b) => a.distance - b.distance)

      return hazards
    } catch (error) {
      console.error('Nearby hazards query failed:', error)
      throw new Error(`근처 위험 지역 조회 실패: ${error.message}`)
    }
  }

  /**
   * 경로 최적화 제안
   * @param {Array} routePath - 원본 경로
   * @param {Object} options - 최적화 옵션
   * @returns {Promise<Object>} 최적화 제안
   */
  async suggestRouteOptimization(routePath, options = {}) {
    try {
      const proximityResult = await this.checkRouteProximity(routePath, options)
      
      if (proximityResult.safeRoute) {
        return {
          needsOptimization: false,
          message: '현재 경로는 안전합니다.',
          originalRoute: routePath,
        }
      }

      const optimizationSuggestions = {
        needsOptimization: true,
        riskPoints: proximityResult.alertPoints,
        suggestions: [],
      }

      // 위험 구간별 최적화 제안 생성
      proximityResult.alertPoints.forEach((alertPoint, index) => {
        const suggestion = this.generateOptimizationSuggestion(alertPoint, index)
        optimizationSuggestions.suggestions.push(suggestion)
      })

      // 전체 대체 경로 제안
      if (proximityResult.alertPoints.length > 2) {
        const alternativeRoute = await this.getAlternativeRoute(
          { path: routePath },
          proximityResult.alertPoints.map(p => p.coordinates)
        )
        
        optimizationSuggestions.alternativeRoute = alternativeRoute
      }

      return optimizationSuggestions
    } catch (error) {
      console.error('Route optimization suggestion failed:', error)
      throw new Error(`경로 최적화 제안 실패: ${error.message}`)
    }
  }

  // ===== 유틸리티 메서드 =====

  /**
   * 캐시 키 생성
   * @param {Array} routePath - 경로
   * @param {number} proximityRadius - 근접 반경
   * @returns {string} 캐시 키
   */
  generateCacheKey(routePath, proximityRadius) {
    const pathHash = this.hashArray(routePath)
    return `proximity_${pathHash}_${proximityRadius}`
  }

  /**
   * 모니터링 ID 생성
   * @param {Array} routePath - 경로
   * @returns {string} 모니터링 ID
   */
  generateMonitoringId(routePath) {
    const pathHash = this.hashArray(routePath)
    const timestamp = Date.now()
    return `monitor_${pathHash}_${timestamp}`
  }

  /**
   * 배열 해시 생성
   * @param {Array} array - 해시할 배열
   * @returns {string} 해시 문자열
   */
  hashArray(array) {
    const str = JSON.stringify(array)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 32비트 정수로 변환
    }
    return Math.abs(hash).toString(36)
  }

  /**
   * 근접성 결과 후처리
   * @param {Object} result - 원본 결과
   * @returns {Object} 후처리된 결과
   */
  processProximityResult(result) {
    return {
      ...result,
      processedAt: new Date().toISOString(),
      alertSummary: this.summarizeAlerts(result),
      riskLevel: this.determineRiskLevel(result),
      safetyScore: this.calculateSafetyScore(result),
    }
  }

  /**
   * 대체 경로 결과 후처리
   * @param {Object} result - 원본 결과
   * @returns {Object} 후처리된 결과
   */
  processAlternativeRouteResult(result) {
    return {
      ...result,
      processedAt: new Date().toISOString(),
      routes: result.routes?.map(route => ({
        ...route,
        safetyScore: this.calculateRouteSafetyScore(route),
        estimatedTime: this.formatDuration(route.duration),
        estimatedDistance: this.formatDistance(route.distance),
      })) || [],
    }
  }

  /**
   * 안전도 점수 계산
   * @param {Object} proximityResult - 근접성 결과
   * @returns {number} 안전도 점수 (0-100)
   */
  calculateSafetyScore(proximityResult) {
    if (proximityResult.safeRoute) return 100

    let score = 100
    const { alertPoints = [], minDistance } = proximityResult

    // 알림 지점 수에 따른 감점
    score -= alertPoints.length * 10

    // 최단 거리에 따른 감점
    if (minDistance < 500) score -= 30
    else if (minDistance < 1000) score -= 20
    else score -= 10

    // 심각도별 감점
    const highCount = alertPoints.filter(p => p.severity === 'high').length
    const mediumCount = alertPoints.filter(p => p.severity === 'medium').length
    
    score -= highCount * 20
    score -= mediumCount * 10

    return Math.max(0, Math.min(100, score))
  }

  /**
   * 위험도 레벨 결정
   * @param {Object} proximityResult - 근접성 결과
   * @returns {string} 위험도 레벨
   */
  determineRiskLevel(proximityResult) {
    if (proximityResult.safeRoute) return 'safe'

    const { alertPoints = [], minDistance } = proximityResult
    const highCount = alertPoints.filter(p => p.severity === 'high').length
    
    if (highCount > 0 || minDistance < 500) return 'high'
    if (alertPoints.length > 2 || minDistance < 1000) return 'medium'
    return 'low'
  }

  /**
   * 알림 요약 생성
   * @param {Object} proximityResult - 근접성 결과
   * @returns {Object} 알림 요약
   */
  summarizeAlerts(proximityResult) {
    const { alertPoints = [] } = proximityResult
    
    const summary = {
      total: alertPoints.length,
      bySeverity: {
        high: alertPoints.filter(p => p.severity === 'high').length,
        medium: alertPoints.filter(p => p.severity === 'medium').length,
        low: alertPoints.filter(p => p.severity === 'low').length,
      },
      byAlertType: {},
      closestDistance: proximityResult.minDistance,
    }

    // 경보 유형별 집계
    alertPoints.forEach(point => {
      const alertType = point.alertType || 'unknown'
      summary.byAlertType[alertType] = (summary.byAlertType[alertType] || 0) + 1
    })

    return summary
  }

  /**
   * 안전 권장사항 생성
   * @param {Object} proximityResult - 근접성 결과
   * @returns {Array} 권장사항 목록
   */
  generateSafetyRecommendations(proximityResult) {
    const recommendations = []
    const { alertPoints = [], minDistance, riskLevel } = proximityResult

    if (riskLevel === 'high') {
      recommendations.push({
        priority: 'high',
        message: '즉시 대체 경로를 이용하세요',
        action: 'request_alternative',
      })
    }

    if (minDistance < 500) {
      recommendations.push({
        priority: 'high',
        message: '위험 지역과 매우 가깝습니다. 우회를 권장합니다',
        action: 'avoid_area',
      })
    }

    const hasSpecialAlert = alertPoints.some(p => p.alertType === '특보')
    if (hasSpecialAlert) {
      recommendations.push({
        priority: 'medium',
        message: '홍수특보 발령 지역이 있습니다. 주의하세요',
        action: 'monitor_alerts',
      })
    }

    recommendations.push({
      priority: 'low',
      message: '실시간 교통 정보를 확인하세요',
      action: 'check_traffic',
    })

    return recommendations
  }

  /**
   * 경로 메트릭 계산
   * @param {Object} proximityResult - 근접성 결과
   * @returns {Object} 경로 메트릭
   */
  calculateRouteMetrics(proximityResult) {
    const { routeAnalysis = {} } = proximityResult
    
    return {
      totalDistance: this.formatDistance(routeAnalysis.totalDistance),
      estimatedTime: this.estimateRouteTime(routeAnalysis.totalDistance),
      riskDensity: this.calculateRiskDensity(proximityResult),
      safetyRating: this.getSafetyRating(proximityResult),
    }
  }

  /**
   * 최적화 제안 생성
   * @param {Object} alertPoint - 알림 지점
   * @param {number} index - 인덱스
   * @returns {Object} 최적화 제안
   */
  generateOptimizationSuggestion(alertPoint, index) {
    return {
      id: `opt_${index}`,
      type: 'avoid_point',
      priority: alertPoint.severity,
      location: alertPoint.coordinates,
      distance: alertPoint.distance,
      message: `${alertPoint.alertType} 지역을 ${Math.round(alertPoint.distance)}m 우회하세요`,
      estimatedDelay: this.estimateDetourTime(alertPoint.distance),
    }
  }

  /**
   * 거리 계산
   * @param {Object} pos1 - 첫 번째 위치
   * @param {Object} pos2 - 두 번째 위치
   * @returns {number} 거리 (미터)
   */
  calculateDistance(pos1, pos2) {
    const R = 6371000 // 지구 반지름 (미터)
    const dLat = (pos2.lat - pos1.lat) * Math.PI / 180
    const dLng = (pos2.lng - pos1.lng) * Math.PI / 180
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  /**
   * 거리 포맷팅
   * @param {number} distance - 거리 (미터)
   * @returns {string} 포맷된 거리
   */
  formatDistance(distance) {
    if (!distance) return 'N/A'
    
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)}km`
    }
    return `${Math.round(distance)}m`
  }

  /**
   * 시간 포맷팅
   * @param {number} duration - 시간 (초)
   * @returns {string} 포맷된 시간
   */
  formatDuration(duration) {
    if (!duration) return 'N/A'
    
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`
    }
    return `${minutes}분`
  }

  /**
   * 경로 시간 추정
   * @param {number} distance - 거리 (미터)
   * @returns {string} 추정 시간
   */
  estimateRouteTime(distance) {
    if (!distance) return 'N/A'
    
    // 평균 속도 40km/h로 가정
    const timeInSeconds = (distance / 1000) * 90 // 40km/h = 90초/km
    return this.formatDuration(timeInSeconds)
  }

  /**
   * 위험 밀도 계산
   * @param {Object} proximityResult - 근접성 결과
   * @returns {number} 위험 밀도 (위험지점/km)
   */
  calculateRiskDensity(proximityResult) {
    const { alertPoints = [], routeAnalysis = {} } = proximityResult
    const distance = routeAnalysis.totalDistance || 1000 // 기본값 1km
    
    return Math.round((alertPoints.length / distance) * 1000 * 100) / 100
  }

  /**
   * 안전 등급 반환
   * @param {Object} proximityResult - 근접성 결과
   * @returns {string} 안전 등급
   */
  getSafetyRating(proximityResult) {
    const score = this.calculateSafetyScore(proximityResult)
    
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }

  /**
   * 우회 시간 추정
   * @param {number} distance - 우회 거리 (미터)
   * @returns {string} 추정 우회 시간
   */
  estimateDetourTime(distance) {
    // 우회로는 일반적으로 20% 더 걸림
    const detourDistance = distance * 1.2
    const timeInSeconds = (detourDistance / 1000) * 90
    return this.formatDuration(timeInSeconds)
  }

  /**
   * 경로 안전도 점수 계산 (개별 경로용)
   * @param {Object} route - 경로 정보
   * @returns {number} 안전도 점수
   */
  calculateRouteSafetyScore(route) {
    // 경로별 안전도 계산 로직
    // 실제 구현에서는 경로의 위험 지점 정보를 기반으로 계산
    return Math.floor(Math.random() * 40) + 60 // 임시 구현
  }

  /**
   * 서비스 정리
   */
  cleanup() {
    this.stopAllMonitoring()
    this.activeChecks.clear()
    console.log('ProximityCheckService cleaned up')
  }
}

// 싱글톤 인스턴스 생성
const proximityCheckService = new ProximityCheckService()

export default proximityCheckService
export { ProximityCheckService }