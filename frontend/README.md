# 침수 정보 표시 앱 프론트엔드

React + Vite를 사용한 침수 정보 표시 웹 애플리케이션

## 기술 스택

- **React 18**: UI 라이브러리
- **Vite**: 빌드 도구 및 개발 서버
- **React Router**: 클라이언트 사이드 라우팅
- **Axios**: HTTP 클라이언트
- **Vitest**: 테스트 프레임워크
- **네이버 지도 API**: 지도 표시 및 마커 관리

## 프로젝트 구조

```
frontend/
├── src/
│   ├── components/        # React 컴포넌트
│   │   ├── MapContainer.jsx
│   │   ├── FloodMarker.jsx
│   │   ├── MultiSourceInfoWindow.jsx
│   │   ├── APIDataSection.jsx
│   │   └── RouteProximityAlert.jsx
│   ├── services/          # API 서비스
│   │   ├── FloodDataAPI.js
│   │   ├── NaverMapService.js
│   │   ├── LocationService.js
│   │   └── ProximityCheckService.js
│   ├── utils/             # 유틸리티 함수
│   ├── App.jsx
│   ├── main.jsx
│   ├── App.css
│   └── index.css
├── tests/                 # 테스트 파일
│   ├── components/
│   ├── integration/
│   └── setup.js
├── public/                # 정적 파일
├── package.json
├── vite.config.js
└── .eslintrc.cjs
```

## 설치 및 실행

### 1. 의존성 설치

```bash
cd frontend
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
VITE_NAVER_CLIENT_ID=your_naver_client_id
VITE_API_BASE_URL=http://localhost:3001
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

### 4. 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

### 5. 테스트

```bash
# 테스트 실행
npm test

# 테스트 UI
npm run test:ui

# 커버리지 포함 테스트
npm run test:coverage
```

## 주요 기능

### 지도 표시
- 네이버 Web Dynamic Map을 사용한 지도 렌더링
- 사용자 현재 위치 자동 감지 및 표시
- 지도 컨트롤 (줌, 지도 타입 변경)

### 침수 정보 표시
- 실시간 침수 데이터 마커 표시
- 심각도별 색상 구분 (노란색/주황색/빨간색)
- 마커 클릭 시 상세 정보 팝업

### 다중 소스 정보 표시
- 한강홍수통제소 3개 API 정보 구분 표시
- 수위관측소, 실시간수위, 홍수예보발령 정보 각각 표시
- API별 섹션 구분 및 "정보 없음" 메시지 처리

### 경로 안내 및 알림
- 네이버 Directions API를 통한 경로 계산
- 홍수주의보 지점 1.5km 반경 감지
- 대체 경로 제안 알림 표시
- 안전 경로와 위험 경로 색상 구분

## 컴포넌트 설명

### MapContainer
- 네이버 지도 렌더링 및 기본 설정
- 사용자 위치 권한 관리
- 지도 컨트롤 버튼 제공

### FloodMarker
- 침수 지점 마커 표시
- 심각도별 아이콘 및 색상 설정
- 클릭 이벤트 처리

### MultiSourceInfoWindow
- 3개 API 정보를 구분하여 표시하는 팝업
- 탭 또는 섹션 형태로 정보 구성
- 반응형 디자인 적용

### APIDataSection
- 개별 API 정보 표시 컴포넌트
- 수위관측소/실시간수위/홍수예보발령 정보 렌더링
- 데이터 없음 상태 처리

### RouteProximityAlert
- 1.5km 반경 감지 알림 컴포넌트
- 대체 경로 제안 UI
- 사용자 선택 처리

## API 연동

### 백엔드 API
- 침수 데이터 조회
- 다중 소스 데이터 조회
- 경로 근접성 검사
- 대체 경로 계산

### 네이버 클라우드 플랫폼 API
- Web Dynamic Map: 지도 표시
- Directions 5: 경로 안내
- Geocoding: 주소-좌표 변환

## 개발 가이드

### 코드 스타일
ESLint 설정을 따라 일관된 코드 스타일을 유지합니다.

```bash
npm run lint
npm run lint:fix
```

### 테스트 작성
- 컴포넌트 테스트: `tests/components/`
- 통합 테스트: `tests/integration/`
- Vitest + React Testing Library 사용

### 환경별 빌드
- 개발: `npm run dev`
- 프로덕션: `npm run build`

## 배포

### AWS S3 정적 웹사이트 호스팅
1. 빌드 실행: `npm run build`
2. `dist/` 폴더를 S3 버킷에 업로드
3. 정적 웹사이트 호스팅 설정

### 환경 변수 설정
프로덕션 환경에서는 다음 환경 변수를 설정하세요:
- `VITE_NAVER_CLIENT_ID`: 네이버 클라우드 플랫폼 클라이언트 ID
- `VITE_API_BASE_URL`: 백엔드 API URL

## 라이선스

MIT License