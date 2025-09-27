# 🌊 침수 정보 표시 앱 사용 가이드

## 🚀 실행 방법

### 1. 로컬 개발 환경 실행

#### 프론트엔드 실행
```bash
# 1. 의존성 설치
cd frontend
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 브라우저에서 확인
# http://localhost:3000 접속
```

#### 백엔드 테스트
```bash
# 1. 의존성 설치
cd lambda-functions
npm install

# 2. 테스트 실행
npm test

# 3. 특정 테스트 실행
npm test -- --grep "flood data"
```

### 2. AWS 배포 (프로덕션)

#### 사전 준비
```bash
# 1. AWS CLI 설치 및 설정
aws configure

# 2. Serverless Framework 설치
npm install -g serverless

# 3. 환경 변수 설정
export NAVER_CLIENT_ID="your_client_id"
export NAVER_CLIENT_SECRET="YOUR_NAVER_CLIENT_SECRET_HERE"
export ALLOWED_ORIGINS="https://yourdomain.com"
```

#### 배포 실행
```bash
# 1. 개발 환경 배포
cd infrastructure
./deploy.sh dev

# 2. 프로덕션 배포
./deploy.sh prod ap-northeast-2

# 3. 배포 상태 확인
aws cloudformation describe-stacks --stack-name flood-info-prod
```

## 📱 앱 사용법

### 1. 기본 기능

#### 홍수 정보 확인
1. **지도 로드**: 앱 실행 시 자동으로 서울 지역 지도 표시
2. **홍수 마커**: 빨간색 마커로 홍수 위험 지역 표시
3. **정보 창**: 마커 클릭 시 상세 정보 확인
   - 경보 유형 (주의보/경보/특보)
   - 수위 정보
   - 실시간 데이터
   - 예보 정보

#### 위치 검색
1. **검색창 사용**: 상단 검색창에 주소 입력
2. **현재 위치**: GPS 버튼으로 현재 위치 이동
3. **즐겨찾기**: 자주 사용하는 위치 저장

### 2. 경로 안전성 검사

#### 경로 설정
1. **출발지 설정**: 지도에서 클릭 또는 검색으로 설정
2. **도착지 설정**: 목적지 선택
3. **경유지 추가**: 필요시 중간 경유지 추가

#### 안전성 확인
1. **경로 계산**: 자동으로 최적 경로 계산
2. **위험 지역 표시**: 경로 상 홍수 위험 지역 하이라이트
3. **대체 경로**: 위험 지역 회피 경로 제안
4. **실시간 알림**: 경로 변경 시 자동 재계산

### 3. 실시간 업데이트

#### 자동 갱신
- **데이터 갱신**: 5분마다 자동 업데이트
- **알림 표시**: 새로운 경보 발생 시 팝업 알림
- **상태 표시**: 연결 상태 및 마지막 업데이트 시간 표시

#### 수동 갱신
- **새로고침 버튼**: 수동으로 최신 데이터 요청
- **오류 시 재시도**: 네트워크 오류 시 자동 재시도

## 🔧 고급 기능

### 1. 설정 옵션

#### 알림 설정
```javascript
// 근접성 알림 반경 설정 (미터)
const proximityRadius = 1500;

// 알림 심각도 필터
const severityFilter = ['medium', 'high'];

// 자동 갱신 간격 (밀리초)
const updateInterval = 300000; // 5분
```

#### 지도 설정
```javascript
// 기본 줌 레벨
const defaultZoom = 12;

// 지도 스타일
const mapStyle = 'normal'; // normal, satellite, hybrid

// 마커 클러스터링
const enableClustering = true;
```

### 2. API 직접 사용

#### 홍수 데이터 조회
```javascript
// 전체 데이터 조회
const response = await fetch('/api/flood-data?severity=medium&limit=50');
const data = await response.json();

// 위치 기반 검색
const locationData = await fetch(
  `/api/flood-data/location?latitude=37.5665&longitude=126.9780&radius=5000`
);
```

#### 경로 안전성 검사
```javascript
// 경로 근접성 검사
const proximityCheck = await fetch('/api/directions/check-proximity', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    routePath: [[126.9780, 37.5665], [127.0276, 37.4979]],
    proximityRadius: 1500
  })
});
```

### 3. WebSocket 연결

#### 실시간 업데이트 구독
```javascript
const ws = new WebSocket('wss://ws.flood-info.example.com');

// 연결 설정
ws.onopen = function() {
  // 홍수 데이터 구독
  ws.send(JSON.stringify({
    type: 'subscribe',
    data: {
      room: 'flood_data',
      filters: {
        severity: 'medium',
        location: { latitude: 37.5665, longitude: 126.9780 },
        radius: 5000
      }
    }
  }));
};

// 메시지 수신
ws.onmessage = function(event) {
  const message = JSON.parse(event.data);
  if (message.type === 'flood_data_update') {
    updateFloodMarkers(message.data);
  }
};
```

## 🧪 테스트 및 디버깅

### 1. 브라우저 개발자 도구

#### 네트워크 탭
- API 요청/응답 확인
- 오류 상태 코드 분석
- 응답 시간 모니터링

#### 콘솔 탭
```javascript
// 디버그 모드 활성화
localStorage.setItem('debug', 'true');

// 로그 레벨 설정
localStorage.setItem('logLevel', 'debug');

// API 응답 로깅
window.floodApp.enableApiLogging();
```

### 2. 성능 모니터링

#### 응답 시간 측정
```javascript
// API 호출 시간 측정
const startTime = performance.now();
const response = await fetch('/api/flood-data');
const endTime = performance.now();
console.log(`API 응답 시간: ${endTime - startTime}ms`);
```

#### 메모리 사용량 확인
```javascript
// 메모리 사용량 확인
if (performance.memory) {
  console.log('사용 중인 메모리:', performance.memory.usedJSHeapSize);
  console.log('총 메모리:', performance.memory.totalJSHeapSize);
}
```

## 🔍 문제 해결

### 1. 일반적인 문제

#### 지도가 로드되지 않음
```javascript
// 네이버 지도 API 키 확인
console.log('Naver Map API Key:', window.naver?.maps?.version);

// 스크립트 로드 확인
if (!window.naver) {
  console.error('네이버 지도 API가 로드되지 않았습니다.');
}
```

#### API 요청 실패
```javascript
// 네트워크 상태 확인
if (!navigator.onLine) {
  console.warn('인터넷 연결을 확인하세요.');
}

// CORS 오류 확인
fetch('/api/health')
  .then(response => console.log('API 연결 성공'))
  .catch(error => console.error('API 연결 실패:', error));
```

#### WebSocket 연결 실패
```javascript
// WebSocket 상태 확인
ws.onclose = function(event) {
  console.log('WebSocket 연결 종료:', event.code, event.reason);
  
  // 재연결 시도
  setTimeout(() => {
    connectWebSocket();
  }, 5000);
};
```

### 2. 성능 최적화

#### 데이터 캐싱
```javascript
// 로컬 스토리지 캐싱
const cacheKey = `flood_data_${Date.now()}`;
localStorage.setItem(cacheKey, JSON.stringify(floodData));

// 캐시 만료 시간 설정 (5분)
const cacheExpiry = 5 * 60 * 1000;
```

#### 마커 최적화
```javascript
// 마커 클러스터링 활성화
const markerClusterer = new MarkerClusterer(map, markers, {
  imagePath: '/images/cluster/m',
  maxZoom: 15,
  gridSize: 60
});
```

## 📊 모니터링 및 분석

### 1. 사용자 분석

#### 페이지 뷰 추적
```javascript
// Google Analytics 연동
gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: '침수 정보 지도',
  page_location: window.location.href
});
```

#### 사용자 행동 추적
```javascript
// 마커 클릭 이벤트
map.addListener('marker_click', (marker) => {
  gtag('event', 'marker_click', {
    event_category: 'map_interaction',
    event_label: marker.id
  });
});
```

### 2. 오류 추적

#### 오류 리포팅
```javascript
// Sentry 연동
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production'
});

// 오류 캐치
window.addEventListener('error', (event) => {
  Sentry.captureException(event.error);
});
```

## 🚀 배포 및 운영

### 1. 환경별 설정

#### 개발 환경
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3001
VITE_NAVER_MAP_CLIENT_ID=dev_client_id
VITE_WEBSOCKET_URL=ws://localhost:3001
```

#### 프로덕션 환경
```bash
# .env.production
VITE_API_BASE_URL=https://api.flood-info.example.com
VITE_NAVER_MAP_CLIENT_ID=prod_client_id
VITE_WEBSOCKET_URL=wss://ws.flood-info.example.com
```

### 2. CI/CD 파이프라인

#### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to AWS
        run: |
          cd infrastructure
          ./deploy.sh prod
```

## 📞 지원 및 문의

### 문제 발생 시
1. **로그 확인**: 브라우저 콘솔에서 오류 메시지 확인
2. **네트워크 확인**: 개발자 도구 네트워크 탭에서 API 응답 확인
3. **문서 참조**: [API 문서](docs/api.md) 및 [README](docs/README.md) 확인
4. **이슈 리포트**: GitHub Issues에 문제 상황 상세히 기록

### 연락처
- **이메일**: support@cccr.or.kr
- **GitHub**: https://github.com/Aimin7/Kiro-DigitalSolveUP

---

**마지막 업데이트**: 2025년 9월 27일  
**앱 버전**: 1.0.0