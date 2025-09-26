// LocationService.js
// 사용자 위치 권한 관리 및 현재 위치 획득 서비스

/**
 * 위치 서비스 클래스
 */
class LocationService {
  constructor() {
    this.watchId = null
    this.lastKnownPosition = null
    this.locationCallbacks = new Set()
    this.errorCallbacks = new Set()
    this.permissionStatus = 'unknown' // 'granted', 'denied', 'prompt', 'unknown'
  }

  /**
   * 위치 권한 상태 확인
   * @returns {Promise<string>} 권한 상태
   */
  async checkPermissionStatus() {
    try {
      if (!navigator.permissions) {
        return 'unknown'
      }

      const permission = await navigator.permissions.query({ name: 'geolocation' })
      this.permissionStatus = permission.state
      
      // 권한 상태 변경 감지
      permission.addEventListener('change', () => {
        this.permissionStatus = permission.state
        this.notifyPermissionChange(permission.state)
      })

      return permission.state
    } catch (error) {
      console.warn('Permission API not supported:', error)
      return 'unknown'
    }
  }

  /**
   * 현재 위치 가져오기 (한 번)
   * @param {Object} options - 위치 옵션
   * @returns {Promise<Object>} 위치 정보
   */
  async getCurrentPosition(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5분
    }

    const finalOptions = { ...defaultOptions, ...options }

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = this.formatPosition(position)
          this.lastKnownPosition = locationData
          this.notifyLocationUpdate(locationData)
          resolve(locationData)
        },
        (error) => {
          const locationError = this.formatError(error)
          this.notifyLocationError(locationError)
          reject(locationError)
        },
        finalOptions
      )
    })
  }

  /**
   * 위치 추적 시작
   * @param {Object} options - 위치 옵션
   * @returns {number} watch ID
   */
  startWatching(options = {}) {
    if (this.watchId !== null) {
      this.stopWatching()
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000, // 1분
    }

    const finalOptions = { ...defaultOptions, ...options }

    if (!navigator.geolocation) {
      const error = new Error('Geolocation is not supported by this browser')
      this.notifyLocationError(this.formatError({ code: 0, message: error.message }))
      return null
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const locationData = this.formatPosition(position)
        this.lastKnownPosition = locationData
        this.notifyLocationUpdate(locationData)
      },
      (error) => {
        const locationError = this.formatError(error)
        this.notifyLocationError(locationError)
      },
      finalOptions
    )

    return this.watchId
  }

  /**
   * 위치 추적 중지
   */
  stopWatching() {
    if (this.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
  }

  /**
   * 위치 업데이트 콜백 등록
   * @param {Function} callback - 위치 업데이트 콜백
   */
  onLocationUpdate(callback) {
    if (typeof callback === 'function') {
      this.locationCallbacks.add(callback)
    }
  }

  /**
   * 위치 업데이트 콜백 제거
   * @param {Function} callback - 제거할 콜백
   */
  offLocationUpdate(callback) {
    this.locationCallbacks.delete(callback)
  }

  /**
   * 위치 오류 콜백 등록
   * @param {Function} callback - 오류 콜백
   */
  onLocationError(callback) {
    if (typeof callback === 'function') {
      this.errorCallbacks.add(callback)
    }
  }

  /**
   * 위치 오류 콜백 제거
   * @param {Function} callback - 제거할 콜백
   */
  offLocationError(callback) {
    this.errorCallbacks.delete(callback)
  }

  /**
   * 마지막 알려진 위치 반환
   * @returns {Object|null} 위치 정보
   */
  getLastKnownPosition() {
    return this.lastKnownPosition
  }

  /**
   * 위치 권한 요청
   * @returns {Promise<boolean>} 권한 허용 여부
   */
  async requestPermission() {
    try {
      // 권한 상태 확인
      const permissionStatus = await this.checkPermissionStatus()
      
      if (permissionStatus === 'granted') {
        return true
      }

      if (permissionStatus === 'denied') {
        throw new Error('Location permission denied')
      }

      // 위치 요청을 통해 권한 요청
      await this.getCurrentPosition({ timeout: 5000 })
      return true
    } catch (error) {
      console.warn('Location permission request failed:', error)
      return false
    }
  }

  /**
   * 두 지점 간 거리 계산 (Haversine formula)
   * @param {number} lat1 - 첫 번째 지점 위도
   * @param {number} lng1 - 첫 번째 지점 경도
   * @param {number} lat2 - 두 번째 지점 위도
   * @param {number} lng2 - 두 번째 지점 경도
   * @returns {number} 거리 (미터)
   */
  static calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000 // 지구 반지름 (미터)
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  /**
   * 위치가 특정 영역 내에 있는지 확인
   * @param {Object} position - 확인할 위치
   * @param {Object} bounds - 영역 경계
   * @returns {boolean} 영역 내 포함 여부
   */
  static isWithinBounds(position, bounds) {
    const { latitude, longitude } = position
    const { north, south, east, west } = bounds

    return latitude >= south && 
           latitude <= north && 
           longitude >= west && 
           longitude <= east
  }

  /**
   * 위치 정보 포맷팅
   * @param {GeolocationPosition} position - 브라우저 위치 객체
   * @returns {Object} 포맷된 위치 정보
   */
  formatPosition(position) {
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp,
      formattedTimestamp: new Date(position.timestamp).toISOString(),
    }
  }

  /**
   * 위치 오류 포맷팅
   * @param {GeolocationPositionError} error - 브라우저 위치 오류 객체
   * @returns {Object} 포맷된 오류 정보
   */
  formatError(error) {
    const errorMessages = {
      1: 'Location access denied by user',
      2: 'Location information unavailable',
      3: 'Location request timeout',
    }

    return {
      code: error.code,
      message: error.message || errorMessages[error.code] || 'Unknown location error',
      timestamp: Date.now(),
      formattedTimestamp: new Date().toISOString(),
    }
  }

  /**
   * 위치 업데이트 알림
   * @param {Object} locationData - 위치 데이터
   */
  notifyLocationUpdate(locationData) {
    this.locationCallbacks.forEach(callback => {
      try {
        callback(locationData)
      } catch (error) {
        console.error('Location callback error:', error)
      }
    })
  }

  /**
   * 위치 오류 알림
   * @param {Object} errorData - 오류 데이터
   */
  notifyLocationError(errorData) {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(errorData)
      } catch (error) {
        console.error('Location error callback error:', error)
      }
    })
  }

  /**
   * 권한 변경 알림
   * @param {string} permissionState - 권한 상태
   */
  notifyPermissionChange(permissionState) {
    console.log('Location permission changed:', permissionState)
    
    if (permissionState === 'denied' && this.watchId !== null) {
      this.stopWatching()
    }
  }

  /**
   * 서비스 정리
   */
  cleanup() {
    this.stopWatching()
    this.locationCallbacks.clear()
    this.errorCallbacks.clear()
    this.lastKnownPosition = null
    this.permissionStatus = 'unknown'
  }

  /**
   * 위치 정확도 평가
   * @param {number} accuracy - 정확도 (미터)
   * @returns {string} 정확도 등급
   */
  static evaluateAccuracy(accuracy) {
    if (accuracy <= 5) return 'excellent'
    if (accuracy <= 10) return 'good'
    if (accuracy <= 50) return 'fair'
    if (accuracy <= 100) return 'poor'
    return 'very-poor'
  }

  /**
   * 위치 데이터 유효성 검사
   * @param {Object} position - 위치 데이터
   * @returns {boolean} 유효성 여부
   */
  static isValidPosition(position) {
    if (!position || typeof position !== 'object') {
      return false
    }

    const { latitude, longitude } = position

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return false
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      return false
    }

    if (latitude < -90 || latitude > 90) {
      return false
    }

    if (longitude < -180 || longitude > 180) {
      return false
    }

    return true
  }

  /**
   * 한국 영역 내 위치인지 확인
   * @param {Object} position - 위치 정보
   * @returns {boolean} 한국 영역 내 여부
   */
  static isInKorea(position) {
    const koreaBounds = {
      north: 38.9,
      south: 33.0,
      east: 132.0,
      west: 124.0,
    }

    return this.isWithinBounds(position, koreaBounds)
  }

  /**
   * 위치 정보를 주소로 변환 (역지오코딩)
   * @param {Object} position - 위치 정보
   * @returns {Promise<string>} 주소 문자열
   */
  async reverseGeocode(position) {
    try {
      // 실제 구현에서는 네이버 Geocoding API 사용
      const response = await fetch('/api/geocoding/reverse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: position.latitude,
          longitude: position.longitude,
        }),
      })

      if (!response.ok) {
        throw new Error('Reverse geocoding failed')
      }

      const data = await response.json()
      return data.address || '주소를 찾을 수 없습니다'
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return '주소 변환 실패'
    }
  }
}

// 싱글톤 인스턴스 생성
const locationService = new LocationService()

export default locationService
export { LocationService }