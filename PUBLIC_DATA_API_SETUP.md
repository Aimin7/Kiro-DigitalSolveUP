# 공공 데이터 API 설정 가이드

이 문서는 침수 정보 표시 앱에서 공공 데이터 API를 사용하기 위한 설정 가이드입니다.

## 🏛️ 민관협력 지원 플랫폼 API 설정

### 1. 민관협력 지원 플랫폼 회원가입

1. [민관협력 지원 플랫폼](https://digitalsolveup.kr/)에 접속
2. 회원가입 및 로그인
3. 메인화면 우측 상단의 '사용 신청'을 통해 신청서 작성 및 제출
4. 사용 신청 승인 안내 문자를 수신 후 사용

### 2. 필요한 API 신청

침수 정보 표시 앱에서 사용하는 주요 API들:

#### 기상청 API
- **기상특보 조회서비스**: 기상특보 정보
- **동네예보 조회서비스**: 날씨 예보
- **실시간 관측정보**: 강수량, 수위 등

#### 한강홍수통제소 API
- **실시간 수위정보**: 한강 수계 수위
- **홍수예보**: 홍수 예보 정보
- **댐 방류정보**: 댐 방류 현황

#### 행정안전부 API
- **재해문자 발송현황**: 재해 관련 문자
- **대피소 정보**: 임시대피소 위치

### 3. API 키 발급

각 API별로 다음 단계를 수행하세요:

1. **API 검색 및 선택**
2. **신청하기** 클릭
3. **콘솔에서 API 발급 정보 확인**

## 🔑 환경 변수 설정

발급받은 API 키들을 환경 변수로 설정하세요:

```bash
# .env.local 파일에 추가

# 기상청 API
VITE_KMA_API_KEY=YOUR_KMA_API_KEY_HERE

# 한강홍수통제소 API  
VITE_HANRIVER_API_KEY=YOUR_HANRIVER_API_KEY_HERE

# 행정안전부 API
VITE_MOIS_API_KEY=YOUR_MOIS_API_KEY_HERE

```

## 📊 주요 API 사용법

### 1. 기상청 동네예보 API

```javascript
// 기상 정보 조회
const getWeatherInfo = async (nx, ny) => {
  const apiKey = import.meta.env.VITE_KMA_API_KEY
  const baseUrl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0'
  
  const params = new URLSearchParams({
    serviceKey: apiKey,
    pageNo: '1',
    numOfRows: '1000',
    dataType: 'JSON',
    base_date: getToday(),
    base_time: '0500',
    nx: nx,
    ny: ny
  })
  
  try {
    const response = await fetch(`${baseUrl}/getVilageFcst?${params}`)
    const data = await response.json()
    return data.response.body.items.item
  } catch (error) {
    console.error('기상 정보 조회 실패:', error)
    return null
  }
}
```

### 2. 한강홍수통제소 수위 API

```javascript
// 실시간 수위 정보 조회
const getWaterLevel = async (stationId) => {
  const apiKey = import.meta.env.VITE_HANRIVER_API_KEY
  const baseUrl = 'http://apis.data.go.kr/B552061/hanRiverFloodService'
  
  const params = new URLSearchParams({
    serviceKey: apiKey,
    pageNo: '1',
    numOfRows: '10',
    dataType: 'JSON',
    stationId: stationId
  })
  
  try {
    const response = await fetch(`${baseUrl}/getRealTimeWaterLevel?${params}`)
    const data = await response.json()
    return data.response.body.items.item
  } catch (error) {
    console.error('수위 정보 조회 실패:', error)
    return null
  }
}
```

### 3. 행정안전부 대피소 API

```javascript
// 대피소 정보 조회
const getShelterInfo = async (sigunguCode) => {
  const apiKey = import.meta.env.VITE_MOIS_API_KEY
  const baseUrl = 'http://apis.data.go.kr/1741000/TsunamiShelter3'
  
  const params = new URLSearchParams({
    serviceKey: apiKey,
    pageNo: '1',
    numOfRows: '1000',
    dataType: 'JSON',
    sigungu_cd: sigunguCode
  })
  
  try {
    const response = await fetch(`${baseUrl}/getTsunamiShelter3List?${params}`)
    const data = await response.json()
    return data.TsunamiShelter[1].row
  } catch (error) {
    console.error('대피소 정보 조회 실패:', error)
    return null
  }
}
```

## 🔧 API 통합 서비스

### 공공 데이터 API 통합 클래스

```javascript
// PublicDataAPI.js
class PublicDataAPI {
  constructor() {
    this.kmaApiKey = import.meta.env.VITE_KMA_API_KEY
    this.hanriverApiKey = import.meta.env.VITE_HANRIVER_API_KEY
    this.moisApiKey = import.meta.env.VITE_MOIS_API_KEY
    
    this.validateApiKeys()
  }
  
  validateApiKeys() {
    const keys = {
      'KMA API': this.kmaApiKey,
      'HanRiver API': this.hanriverApiKey,
      'MOIS API': this.moisApiKey
    }
    
    Object.entries(keys).forEach(([name, key]) => {
      if (!key || key === 'YOUR_API_KEY_HERE') {
        console.warn(`${name} 키가 설정되지 않았습니다.`)
      }
    })
  }
  
  // 통합 홍수 정보 조회
  async getFloodInfo(location) {
    const [weather, waterLevel, shelters] = await Promise.allSettled([
      this.getWeatherInfo(location.nx, location.ny),
      this.getWaterLevel(location.stationId),
      this.getShelterInfo(location.sigunguCode)
    ])
    
    return {
      weather: weather.status === 'fulfilled' ? weather.value : null,
      waterLevel: waterLevel.status === 'fulfilled' ? waterLevel.value : null,
      shelters: shelters.status === 'fulfilled' ? shelters.value : null,
      timestamp: new Date().toISOString()
    }
  }
  
  // 에러 처리가 포함된 API 호출
  async safeApiCall(apiFunction, fallback = null) {
    try {
      return await apiFunction()
    } catch (error) {
      console.error('공공 데이터 API 호출 실패:', error)
      return fallback
    }
  }
}

export default new PublicDataAPI()
```

## 📈 사용량 관리

### 1. API 호출 제한

대부분의 공공 데이터 API는 다음과 같은 제한이 있습니다:

- **일일 호출 한도**: 1,000 ~ 10,000회
- **분당 호출 한도**: 60 ~ 600회
- **동시 연결 수**: 10개

### 2. 캐싱 전략

```javascript
// API 응답 캐싱
class APICache {
  constructor(ttl = 300000) { // 5분 기본 TTL
    this.cache = new Map()
    this.ttl = ttl
  }
  
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }
  
  get(key) {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }
  
  clear() {
    this.cache.clear()
  }
}

const apiCache = new APICache()

// 캐시를 사용한 API 호출
const getCachedWeatherInfo = async (nx, ny) => {
  const cacheKey = `weather_${nx}_${ny}`
  const cached = apiCache.get(cacheKey)
  
  if (cached) {
    return cached
  }
  
  const data = await getWeatherInfo(nx, ny)
  if (data) {
    apiCache.set(cacheKey, data)
  }
  
  return data
}
```

### 3. 요청 제한 (Rate Limiting)

```javascript
// 요청 제한 클래스
class RateLimiter {
  constructor(maxRequests = 60, windowMs = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    this.requests = []
  }
  
  async checkLimit() {
    const now = Date.now()
    
    // 윈도우 밖의 요청 제거
    this.requests = this.requests.filter(
      time => now - time < this.windowMs
    )
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests)
      const waitTime = this.windowMs - (now - oldestRequest)
      
      console.log(`Rate limit exceeded. Waiting ${waitTime}ms`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
      
      return this.checkLimit()
    }
    
    this.requests.push(now)
    return true
  }
}

const rateLimiter = new RateLimiter()

// Rate limiting이 적용된 API 호출
const limitedApiCall = async (apiFunction) => {
  await rateLimiter.checkLimit()
  return apiFunction()
}
```

## 🔒 보안 고려사항

### 1. API 키 보호

```javascript
// API 키 검증
const validateApiKey = (key, keyName) => {
  if (!key) {
    throw new Error(`${keyName} API 키가 설정되지 않았습니다.`)
  }
  
  if (key.includes('YOUR_') || key.includes('EXAMPLE')) {
    throw new Error(`${keyName} API 키가 예제 값입니다. 실제 키로 변경하세요.`)
  }
  
  return true
}

// 환경별 API 키 관리
const getApiKey = (keyName) => {
  const key = import.meta.env[keyName]
  validateApiKey(key, keyName)
  return key
}
```

### 2. CORS 프록시 설정

공공 데이터 API는 CORS를 지원하지 않으므로 프록시가 필요합니다:

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api/public-data': {
        target: 'http://apis.data.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/public-data/, '')
      }
    }
  }
})

// 프록시를 통한 API 호출
const callPublicDataAPI = async (endpoint, params) => {
  const url = `/api/public-data${endpoint}?${params.toString()}`
  const response = await fetch(url)
  return response.json()
}
```

## 🧪 테스트

### API 연결 테스트

```javascript
// 공공 데이터 API 연결 테스트
const testPublicDataAPIs = async () => {
  const tests = [
    {
      name: '기상청 API',
      test: () => getWeatherInfo(60, 127)
    },
    {
      name: '한강홍수통제소 API',
      test: () => getWaterLevel('1018680')
    },
    {
      name: '행정안전부 API',
      test: () => getShelterInfo('11110')
    }
  ]
  
  for (const { name, test } of tests) {
    try {
      console.log(`${name} 테스트 시작...`)
      const result = await test()
      
      if (result) {
        console.log(`✅ ${name} 연결 성공`)
      } else {
        console.log(`⚠️ ${name} 데이터 없음`)
      }
    } catch (error) {
      console.error(`❌ ${name} 연결 실패:`, error.message)
    }
  }
}

// 개발자 도구에서 실행
testPublicDataAPIs()
```

## 🔍 문제 해결

### 일반적인 오류

1. **"SERVICE_KEY_IS_NOT_REGISTERED_ERROR"**
   - API 키 확인
   - 승인 상태 확인

2. **"INVALID_REQUEST_PARAMETER_ERROR"**
   - 파라미터 형식 확인
   - 필수 파라미터 누락 확인

3. **"SERVICE_ACCESS_DENIED_ERROR"**
   - 서비스 이용 승인 확인
   - 이용 기간 확인

4. **CORS 오류**
   - 프록시 서버 설정
   - 서버 사이드에서 API 호출

### 디버깅 도구

```javascript
// API 응답 로깅
const logApiResponse = (apiName, response) => {
  console.group(`📊 ${apiName} API 응답`)
  console.log('Status:', response.status)
  console.log('Headers:', response.headers)
  console.log('Data:', response.data)
  console.groupEnd()
}

// 에러 추적
const trackApiError = (apiName, error) => {
  console.group(`❌ ${apiName} API 오류`)
  console.error('Error:', error.message)
  console.error('Stack:', error.stack)
  console.groupEnd()
  
  // 에러 리포팅 서비스로 전송
  // sendErrorReport(apiName, error)
}
```

## 📞 지원

공공 데이터 API 관련 문제가 발생하면:

1. 각 기관별 API 문의처
2. [민관협력 지원 플랫폼 운영 사무국 이메일 문의](support@cccr.or.kr)
3. 프로젝트 이슈 생성

## 📚 참고 자료

- [민관협력 지원 플랫폼](https://digitalsolveup.kr/)
- [공공 데이터 포털](https://www.data.go.kr/)
- [기상청 API 가이드](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15084084)
- [한강홍수통제소 API](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15077586)
- [행정안전부 API](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15000895)
