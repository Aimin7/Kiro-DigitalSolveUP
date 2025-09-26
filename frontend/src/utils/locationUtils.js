/**
 * 위치 서비스 유틸리티 함수들
 */

/**
 * 브라우저의 위치 서비스 지원 여부 확인
 * @returns {boolean} 지원 여부
 */
export const isGeolocationSupported = () => {
  return 'geolocation' in navigator
}

/**
 * 보안 컨텍스트 확인 (HTTPS, localhost 등)
 * @returns {boolean} 보안 컨텍스트 여부
 */
export const isSecureContext = () => {
  return window.isSecureContext || 
         location.protocol === 'https:' || 
         location.hostname === 'localhost' ||
         location.hostname === '127.0.0.1'
}

/**
 * 위치 권한 상태 확인
 * @returns {Promise<string>} 권한 상태 ('granted', 'denied', 'prompt', 'unknown')
 */
export const checkLocationPermission = async () => {
  try {
    if (!navigator.permissions) {
      return 'unknown'
    }

    const permission = await navigator.permissions.query({ name: 'geolocation' })
    return permission.state
  } catch (error) {
    console.warn('Permission API not supported:', error)
    return 'unknown'
  }
}

/**
 * 위치 정보 가져오기 (Promise 기반)
 * @param {Object} options - 위치 옵션
 * @returns {Promise<GeolocationPosition>} 위치 정보
 */
export const getCurrentPosition = (options = {}) => {
  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 300000, // 5분
  }

  const finalOptions = { ...defaultOptions, ...options }

  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      finalOptions
    )
  })
}

/**
 * 위치 오류 메시지 생성
 * @param {GeolocationPositionError} error - 위치 오류 객체
 * @returns {Object} 오류 정보
 */
export const getLocationErrorInfo = (error) => {
  const errorInfo = {
    code: error.code,
    message: error.message,
    suggestion: '',
    canRetry: false,
  }

  switch (error.code) {
    case error.PERMISSION_DENIED:
      errorInfo.message = '위치 접근 권한이 거부되었습니다.'
      errorInfo.suggestion = '브라우저 설정에서 위치 권한을 허용해주세요.'
      errorInfo.canRetry = false
      break
    case error.POSITION_UNAVAILABLE:
      errorInfo.message = '위치 정보를 사용할 수 없습니다.'
      errorInfo.suggestion = 'GPS가 활성화되어 있는지 확인해주세요.'
      errorInfo.canRetry = true
      break
    case error.TIMEOUT:
      errorInfo.message = '위치 정보 요청이 시간 초과되었습니다.'
      errorInfo.suggestion = '다시 시도해주세요.'
      errorInfo.canRetry = true
      break
    default:
      errorInfo.message = '알 수 없는 오류가 발생했습니다.'
      errorInfo.suggestion = '잠시 후 다시 시도해주세요.'
      errorInfo.canRetry = true
      break
  }

  return errorInfo
}

/**
 * 기본 위치 목록 (한국 주요 도시)
 */
export const DEFAULT_LOCATIONS = {
  seoul: { lat: 37.5665, lng: 126.9780, name: '서울시청' },
  busan: { lat: 35.1796, lng: 129.0756, name: '부산시청' },
  daegu: { lat: 35.8714, lng: 128.6014, name: '대구시청' },
  incheon: { lat: 37.4563, lng: 126.7052, name: '인천시청' },
  gwangju: { lat: 35.1595, lng: 126.8526, name: '광주시청' },
  daejeon: { lat: 36.3504, lng: 127.3845, name: '대전시청' },
  ulsan: { lat: 35.5384, lng: 129.3114, name: '울산시청' },
  sejong: { lat: 36.4800, lng: 127.2890, name: '세종시청' },
}

/**
 * 사용자에게 기본 위치 선택 옵션 제공
 * @returns {Promise<Object>} 선택된 위치 정보
 */
export const selectDefaultLocation = () => {
  return new Promise((resolve) => {
    const locationOptions = Object.entries(DEFAULT_LOCATIONS)
      .map(([key, location], index) => `${index + 1}. ${location.name}`)
      .join('\n')

    const message = `위치 서비스를 사용할 수 없습니다.\n기본 위치를 선택해주세요:\n\n${locationOptions}\n\n번호를 입력하세요 (기본값: 1)`

    const userInput = prompt(message, '1')
    const selectedIndex = parseInt(userInput) - 1

    const locationKeys = Object.keys(DEFAULT_LOCATIONS)
    const selectedKey = locationKeys[selectedIndex] || locationKeys[0]
    const selectedLocation = DEFAULT_LOCATIONS[selectedKey]

    resolve(selectedLocation)
  })
}

/**
 * 위치 정확도 평가
 * @param {number} accuracy - 정확도 (미터)
 * @returns {Object} 정확도 정보
 */
export const evaluateLocationAccuracy = (accuracy) => {
  let level, description, color

  if (accuracy <= 5) {
    level = 'excellent'
    description = '매우 정확'
    color = '#4CAF50'
  } else if (accuracy <= 10) {
    level = 'good'
    description = '정확'
    color = '#8BC34A'
  } else if (accuracy <= 50) {
    level = 'fair'
    description = '보통'
    color = '#FF9800'
  } else if (accuracy <= 100) {
    level = 'poor'
    description = '부정확'
    color = '#FF5722'
  } else {
    level = 'very-poor'
    description = '매우 부정확'
    color = '#F44336'
  }

  return { level, description, color, accuracy }
}

/**
 * 두 지점 간 거리 계산 (Haversine formula)
 * @param {number} lat1 - 첫 번째 지점 위도
 * @param {number} lng1 - 첫 번째 지점 경도
 * @param {number} lat2 - 두 번째 지점 위도
 * @param {number} lng2 - 두 번째 지점 경도
 * @returns {number} 거리 (미터)
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
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
 * 위치가 한국 영역 내에 있는지 확인
 * @param {number} lat - 위도
 * @param {number} lng - 경도
 * @returns {boolean} 한국 영역 내 여부
 */
export const isInKorea = (lat, lng) => {
  const koreaBounds = {
    north: 38.9,
    south: 33.0,
    east: 132.0,
    west: 124.0,
  }

  return lat >= koreaBounds.south && 
         lat <= koreaBounds.north && 
         lng >= koreaBounds.west && 
         lng <= koreaBounds.east
}

/**
 * 위치 정보를 포맷팅
 * @param {GeolocationPosition} position - 브라우저 위치 객체
 * @returns {Object} 포맷된 위치 정보
 */
export const formatPosition = (position) => {
  const accuracy = evaluateLocationAccuracy(position.coords.accuracy)
  
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    accuracyInfo: accuracy,
    altitude: position.coords.altitude,
    altitudeAccuracy: position.coords.altitudeAccuracy,
    heading: position.coords.heading,
    speed: position.coords.speed,
    timestamp: position.timestamp,
    formattedTimestamp: new Date(position.timestamp).toLocaleString('ko-KR'),
    isInKorea: isInKorea(position.coords.latitude, position.coords.longitude),
  }
}