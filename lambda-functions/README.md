# 침수 정보 표시 앱 백엔드

AWS Lambda와 Serverless Framework를 사용한 침수 정보 API 서버

## 프로젝트 구조

```
lambda-functions/
├── src/
│   ├── handlers/          # Lambda 함수 핸들러
│   │   ├── floodHandler.js
│   │   ├── locationHandler.js
│   │   ├── multiSourceHandler.js
│   │   ├── naverHandler.js
│   │   ├── proximityHandler.js
│   │   ├── refreshHandler.js
│   │   └── healthHandler.js
│   ├── services/          # 비즈니스 로직 서비스
│   │   ├── FloodDataService.js
│   │   ├── HanRiverAPIService.js
│   │   ├── DataNormalizationService.js
│   │   ├── MultiSourceDataService.js
│   │   ├── ProximityCheckService.js
│   │   ├── NaverGeocodingService.js
│   │   └── NaverDirectionsService.js
│   ├── models/            # 데이터 모델
│   │   ├── FloodInfo.js
│   │   └── APISource.js
│   ├── utils/             # 유틸리티 함수
│   │   ├── response.js
│   │   └── logger.js
│   └── config/            # 설정 파일
│       ├── aws.js
│       └── environment.js
├── tests/                 # 테스트 파일
│   ├── unit/
│   ├── integration/
│   └── setup.js
├── package.json
├── serverless.yml
├── jest.config.js
└── .eslintrc.js
```

## 설치 및 실행

### 1. 의존성 설치

```bash
cd lambda-functions
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
```

### 3. 로컬 개발 서버 실행

```bash
npm run offline
```

### 4. 테스트 실행

```bash
# 전체 테스트 실행
npm test

# 테스트 감시 모드
npm run test:watch

# 커버리지 포함 테스트
npm run test:coverage
```

### 5. 배포

```bash
# 개발 환경 배포
npm run deploy:dev

# 프로덕션 환경 배포
npm run deploy:prod
```

## API 엔드포인트

### 침수 데이터 API

- `GET /api/flood-data` - 전체 침수 데이터 조회
- `GET /api/flood-data/location` - 위치 기반 침수 데이터 조회
- `GET /api/flood-data/multi-source/{locationId}` - 다중 소스 데이터 조회
- `GET /api/flood-data/hanriver` - 한강홍수통제소 원본 데이터 조회
- `POST /api/flood-data/refresh` - 데이터 수동 갱신

### 경로 안내 API

- `GET /api/directions/safe-route` - 안전 경로 안내
- `POST /api/directions/check-proximity` - 경로 근접성 검사
- `POST /api/directions/alternative-route` - 대체 경로 계산

### 기타 API

- `POST /api/geocoding/address` - 주소-좌표 변환
- `GET /api/health` - 헬스 체크

## 개발 가이드

### 코드 스타일

이 프로젝트는 Airbnb JavaScript 스타일 가이드를 따릅니다.

```bash
# 린트 검사
npm run lint

# 린트 자동 수정
npm run lint:fix
```

### 테스트 작성

- 단위 테스트: `tests/unit/` 디렉토리
- 통합 테스트: `tests/integration/` 디렉토리
- 테스트 파일명: `*.test.js`

### 환경별 설정

- `dev`: 개발 환경
- `prod`: 프로덕션 환경

## 외부 API 연동

### 한강홍수통제소 API

- 수위 관측소: `/waterlevelinfo/info.json`
- 실시간 수위: `/getWaterLevel1D/list/1D/1018683/20230701/20230930.json`
- 홍수예보발령: `/fldfct/list/20230715.json`

### 네이버 클라우드 플랫폼 API

- Web Dynamic Map
- Directions 5
- Geocoding

## AWS 리소스

- **Lambda**: 서버리스 함수 실행
- **API Gateway**: REST API 엔드포인트
- **DynamoDB**: NoSQL 데이터베이스
- **CloudWatch**: 로그 및 모니터링

## 라이선스

MIT License