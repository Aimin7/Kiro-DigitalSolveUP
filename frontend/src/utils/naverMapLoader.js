/**
 * 네이버 지도 API 동적 로더
 */

let isLoading = false
let isLoaded = false
let loadPromise = null

/**
 * 네이버 지도 API 스크립트를 동적으로 로드
 * @returns {Promise<boolean>} 로드 성공 여부
 */
export const loadNaverMapAPI = () => {
  // 이미 로드된 경우
  if (isLoaded && window.naver && window.naver.maps) {
    return Promise.resolve(true)
  }

  // 로딩 중인 경우 기존 Promise 반환
  if (isLoading && loadPromise) {
    return loadPromise
  }

  // 환경 변수에서 클라이언트 ID 가져오기
  const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID
  
  console.log('🔍 환경변수 디버깅:')
  console.log('- VITE_NAVER_MAP_CLIENT_ID:', clientId)
  console.log('- 모든 환경변수:', import.meta.env)
  
  if (!clientId) {
    console.error('❌ VITE_NAVER_MAP_CLIENT_ID 환경 변수가 설정되지 않았습니다.')
    console.error('현재 환경변수:', Object.keys(import.meta.env))
    return Promise.reject(new Error('네이버 지도 API 클라이언트 ID가 없습니다.'))
  }

  console.log('🗺️ 네이버 지도 API 로드 시작:', clientId)

  isLoading = true
  
  loadPromise = new Promise((resolve, reject) => {
    // 이미 스크립트가 존재하는지 확인
    const existingScript = document.querySelector('script[src*="oapi.map.naver.com"]')
    if (existingScript) {
      existingScript.remove()
    }

    // 스크립트 엘리먼트 생성
    const script = document.createElement('script')
    script.type = 'text/javascript'
    // 개인/일반 통합 네이버 지도 API 사용
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=geocoder`
    script.async = true

    // 타임아웃 설정 (10초)
    const timeout = setTimeout(() => {
      console.error('⏰ 네이버 지도 API 로드 타임아웃')
      isLoading = false
      loadPromise = null
      reject(new Error('네이버 지도 API 로드 타임아웃'))
    }, 10000)

    // 로드 성공 이벤트
    script.onload = () => {
      clearTimeout(timeout)
      console.log('✅ 네이버 지도 API 스크립트 로드 완료')
      
      // API 객체가 실제로 사용 가능한지 확인
      const checkAPI = () => {
        if (window.naver && window.naver.maps) {
          console.log('✅ 네이버 지도 API 객체 확인 완료')
          isLoaded = true
          isLoading = false
          loadPromise = null
          resolve(true)
        } else {
          console.log('⏳ 네이버 지도 API 객체 대기 중...')
          setTimeout(checkAPI, 100)
        }
      }

      checkAPI()
    }

    // 로드 실패 이벤트
    script.onerror = (error) => {
      clearTimeout(timeout)
      console.error('❌ 네이버 지도 API 로드 실패:', error)
      isLoading = false
      loadPromise = null
      reject(new Error('네이버 지도 API 로드에 실패했습니다.'))
    }

    // DOM에 스크립트 추가
    document.head.appendChild(script)
  })

  return loadPromise
}

/**
 * 네이버 지도 API 로드 상태 확인
 * @returns {boolean} 로드 완료 여부
 */
export const isNaverMapAPILoaded = () => {
  return isLoaded && window.naver && window.naver.maps
}

/**
 * 네이버 지도 API 로드 대기
 * @param {number} timeout - 타임아웃 (밀리초)
 * @returns {Promise<boolean>} 로드 완료 여부
 */
export const waitForNaverMapAPI = (timeout = 10000) => {
  return new Promise((resolve, reject) => {
    if (isNaverMapAPILoaded()) {
      resolve(true)
      return
    }

    const startTime = Date.now()
    const checkInterval = setInterval(() => {
      if (isNaverMapAPILoaded()) {
        clearInterval(checkInterval)
        resolve(true)
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval)
        reject(new Error('네이버 지도 API 로드 대기 타임아웃'))
      }
    }, 100)
  })
}

/**
 * 환경 변수 확인
 * @returns {Object} 환경 변수 정보
 */
export const getEnvironmentInfo = () => {
  return {
    clientId: import.meta.env.VITE_NAVER_MAP_CLIENT_ID,
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD,
  }
}