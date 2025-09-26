# 네이버 API 설정 가이드

이 문서는 침수 정보 표시 앱에서 네이버 지도 API를 사용하기 위한 설정 가이드입니다.

## 🗺️ 네이버 지도 API 설정

### 1. 네이버 개발자 센터 가입

1. [네이버 개발자 센터](https://developers.naver.com/)에 접속
2. 네이버 계정으로 로그인
3. 개발자 등록 (최초 1회)

### 2. 애플리케이션 등록

1. **Application 등록** 클릭
2. 애플리케이션 정보 입력:
   - **애플리케이션 이름**: `침수 정보 표시 앱`
   - **사용 API**: `Maps` 선택
   - **환경 추가**: `WEB` 선택
   - **서비스 URL**: 
     - 개발: `http://localhost:5173`
     - 운영: `https://your-domain.com`

### 3. API 키 발급

1. 등록된 애플리케이션 선택
2. **Client ID** 복사
3. 환경 변수에 설정:

```bash
# .env.local 파일에 추가
VITE_NAVER_MAP_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
```

## 🔧 API 사용 설정

### 지도 API 권한 설정

네이버 개발자 센터에서 다음 API들을 활성화하세요:

- **Maps**: 지도 표시
- **Geocoding**: 주소 ↔ 좌표 변환
- **Directions**: 경로 탐색 (선택사항)
- **Static Map**: 정적 지도 (선택사항)

### 도메인 등록

**Web 서비스 URL**에 다음 도메인들을 등록하세요:

```
# 개발 환경
http://localhost:3000
http://localhost:5173
http://127.0.0.1:3000
http://127.0.0.1:5173

# 운영 환경
https://your-domain.com
https://www.your-domain.com
```

## 📊 사용량 모니터링

### 1. API 호출량 확인

네이버 개발자 센터에서 API 사용량을 모니터링할 수 있습니다:

- 일일 호출량
- 월간 호출량
- 오류 발생률

### 2. 사용량 제한

무료 플랜 제한:
- **Maps API**: 월 100,000회
- **Geocoding API**: 월 10,000회
- **Directions API**: 월 10,000회

### 3. 유료 플랜

사용량이 많은 경우 유료 플랜으로 업그레이드:
- 네이버 클라우드 플랫폼 가입
- Maps API 상품 신청
- 결제 정보 등록

## 🔒 보안 설정

### 1. Referer 제한

네이버 개발자 센터에서 Referer 제한을 설정하여 무단 사용을 방지하세요:

```
https://your-domain.com/*
https://www.your-domain.com/*
```

### 2. 클라이언트 측 보안

```javascript
// 환경 변수 검증
if (!import.meta.env.VITE_NAVER_MAP_CLIENT_ID) {
  console.error('네이버 지도 API 클라이언트 ID가 설정되지 않았습니다.')
  throw new Error('NAVER_MAP_CLIENT_ID is required')
}

// API 키 노출 방지
const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID
if (clientId === 'YOUR_NAVER_MAP_CLIENT_ID_HERE') {
  console.warn('기본 API 키를 사용 중입니다. 실제 키로 변경하세요.')
}
```

## 🚀 최적화 팁

### 1. 지도 로딩 최적화

```javascript
// 지연 로딩
const loadMapWhenNeeded = async () => {
  if (!window.naver) {
    await loadNaverMapAPI()
  }
  return window.naver.maps
}

// 캐싱
let mapInstance = null
const getMapInstance = () => {
  if (!mapInstance) {
    mapInstance = new naver.maps.Map('map')
  }
  return mapInstance
}
```

### 2. API 호출 최적화

```javascript
// 디바운싱으로 API 호출 줄이기
const debouncedGeocode = debounce(async (address) => {
  const result = await naverGeocoding(address)
  return result
}, 300)

// 캐싱으로 중복 호출 방지
const geocodeCache = new Map()
const cachedGeocode = async (address) => {
  if (geocodeCache.has(address)) {
    return geocodeCache.get(address)
  }
  
  const result = await naverGeocoding(address)
  geocodeCache.set(address, result)
  return result
}
```

### 3. 에러 처리

```javascript
// API 로드 실패 처리
const loadNaverMapAPI = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`
    
    script.onload = () => resolve(window.naver)
    script.onerror = () => reject(new Error('네이버 지도 API 로드 실패'))
    
    // 타임아웃 설정
    setTimeout(() => {
      reject(new Error('네이버 지도 API 로드 타임아웃'))
    }, 10000)
    
    document.head.appendChild(script)
  })
}

// API 호출 실패 처리
const safeApiCall = async (apiFunction, fallback = null) => {
  try {
    return await apiFunction()
  } catch (error) {
    console.error('API 호출 실패:', error)
    return fallback
  }
}
```

## 🧪 테스트

### 1. API 키 테스트

```javascript
// 개발자 도구 콘솔에서 실행
const testNaverAPI = async () => {
  try {
    const script = document.createElement('script')
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${YOUR_CLIENT_ID}`
    document.head.appendChild(script)
    
    script.onload = () => {
      console.log('✅ 네이버 지도 API 로드 성공')
      console.log('naver.maps 버전:', naver.maps.version)
    }
    
    script.onerror = () => {
      console.error('❌ 네이버 지도 API 로드 실패')
    }
  } catch (error) {
    console.error('테스트 실패:', error)
  }
}

testNaverAPI()
```

### 2. 지도 표시 테스트

```html
<!-- 간단한 테스트 페이지 -->
<!DOCTYPE html>
<html>
<head>
    <title>네이버 지도 테스트</title>
</head>
<body>
    <div id="map" style="width:100%;height:400px;"></div>
    
    <script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_CLIENT_ID"></script>
    <script>
        const map = new naver.maps.Map('map', {
            center: new naver.maps.LatLng(37.5665, 126.9780),
            zoom: 10
        })
        console.log('지도 생성 완료')
    </script>
</body>
</html>
```

## 🔍 문제 해결

### 일반적인 오류

1. **"Invalid Client ID"**
   - 클라이언트 ID 확인
   - 도메인 등록 확인

2. **"Quota Exceeded"**
   - 사용량 한도 초과
   - 유료 플랜 고려

3. **"Referer Denied"**
   - Referer 설정 확인
   - 도메인 등록 확인

4. **지도가 표시되지 않음**
   - 컨테이너 크기 확인
   - CSS 스타일 확인
   - 콘솔 오류 확인

### 디버깅 도구

```javascript
// 네이버 지도 디버그 모드
window.naver.maps.debug = true

// API 호출 로깅
const originalFetch = window.fetch
window.fetch = function(...args) {
  console.log('API 호출:', args[0])
  return originalFetch.apply(this, args)
}
```

## 📞 지원

네이버 API 관련 문제가 발생하면:

1. [네이버 개발자 센터 FAQ](https://developers.naver.com/docs/common/faq/)
2. [네이버 개발자 포럼](https://developers.naver.com/forum/)
3. 네이버 개발자 센터 1:1 문의
4. 프로젝트 이슈 생성

## 📚 참고 자료

- [네이버 지도 API 가이드](https://navermaps.github.io/maps.js.ncp/)
- [네이버 지도 API 레퍼런스](https://navermaps.github.io/maps.js.ncp/docs/)
- [네이버 클라우드 플랫폼](https://www.ncloud.com/)
- [지오코딩 API 가이드](https://developers.naver.com/docs/serviceapi/search/geocoding/)
