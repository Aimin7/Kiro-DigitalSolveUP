# Tasks: 침수 정보 표시 앱

**Input**: Design documents from `.kiro/specs/001-flood-info-map/`
**Prerequisites**: requirements.md, design.md

## 프로젝트 구조 (서버리스 아키텍처)
```
lambda-functions/
├── src/
│   ├── handlers/          # Lambda 함수 핸들러
│   ├── services/
│   ├── models/
│   └── utils/
├── tests/
│   ├── unit/
│   └── integration/
└── serverless.yml         # Serverless Framework 설정

frontend/
├── src/
│   ├── components/
│   ├── services/
│   └── utils/
└── tests/
    ├── components/
    └── integration/

infrastructure/
├── dynamodb-table.yml     # DynamoDB 테이블 정의
└── s3-bucket.yml          # S3 버킷 설정
```

## Phase 1: 프로젝트 설정
- [ ] 1.1 서버리스 백엔드 프로젝트 구조 생성 (Lambda + Node.js)
  - Serverless Framework 설정, Lambda 함수 구조, AWS SDK 설정
  - _Requirements: FR-001, FR-002_

- [ ] 1.2 프론트엔드 프로젝트 구조 생성 (React + Vite)
  - React 프로젝트 초기화, 네이버 지도 API SDK 설정
  - _Requirements: FR-001_

- [ ] 1.3 [P] AWS 서버리스 배포 환경 설정
  - Serverless Framework 설정, DynamoDB 테이블 정의, S3 버킷 설정
  - _Requirements: 모든 요구사항_

- [ ] 1.4 [P] 네이버 클라우드 플랫폼 애플리케이션 등록
  - Web Dynamic Map, Directions 5, Geocoding 서비스 활성화
  - localhost 및 배포 URL 등록
  - _Requirements: FR-001, FR-005_

- [ ] 1.5 [P] 개발 환경 설정
  - ESLint, Prettier, Jest 설정, 환경 변수 관리
  - _Requirements: 모든 요구사항_

## Phase 2: 테스트 우선 작성 ⚠️ 구현 전 필수 완료
**중요: 이 테스트들은 반드시 작성되고 실패해야 구현을 시작할 수 있습니다**

- [ ] 2.1 [P] 침수 데이터 API 계약 테스트 작성 (backend/tests/contract/flood-api.test.js)
  - GET /api/flood-data 엔드포인트 테스트
  - _Requirements: FR-001, FR-003_

- [ ] 2.2 [P] 위치 기반 침수 데이터 API 계약 테스트 작성 (backend/tests/contract/location-api.test.js)
  - GET /api/flood-data/location 엔드포인트 테스트
  - _Requirements: FR-001_

- [ ] 2.3 [P] 한강홍수통제소 API 통합 테스트 작성 (backend/tests/integration/hanriver-api.test.js)
  - 수위관측소, 실시간수위, 홍수예보발령 3개 API 개별 데이터 수집 테스트
  - _Requirements: FR-002_

- [ ] 2.4 [P] 네이버 API 통합 테스트 작성 (backend/tests/integration/naver-api.test.js)
  - Web Dynamic Map, Directions 5, Geocoding API 연동 테스트
  - _Requirements: FR-001, FR-003_

- [ ] 2.5 [P] 지도 컴포넌트 테스트 작성 (frontend/tests/components/MapContainer.test.jsx)
  - 네이버 Web Dynamic Map 렌더링 및 마커 표시 테스트
  - _Requirements: FR-001, FR-005_

- [ ] 2.6 [P] 다중 소스 정보창 컴포넌트 테스트 작성 (frontend/tests/components/MultiSourceInfoWindow.test.jsx)
  - 3개 API 정보 구분 표시 테스트
  - _Requirements: FR-003_

- [ ] 2.7 [P] 경로 근접성 알림 컴포넌트 테스트 작성 (frontend/tests/components/RouteProximityAlert.test.jsx)
  - 1.5km 반경 감지 및 대체 경로 제안 알림 테스트
  - _Requirements: FR-006_

- [ ] 2.8 [P] 실시간 업데이트 통합 테스트 작성 (backend/tests/integration/realtime-update.test.js)
  - 한강홍수통제소 데이터 자동 갱신 및 클라이언트 알림 테스트
  - _Requirements: FR-004_

## Phase 3: 핵심 구현 (테스트 실패 확인 후에만 진행)

- [ ] 3.1 [P] FloodInfo 데이터 모델 구현 (lambda-functions/src/models/FloodInfo.js)
  - DynamoDB용 침수 정보 데이터 구조 및 검증 로직, availableAPIs 필드 포함
  - _Requirements: FR-002, FR-003, FR-005_

- [ ] 3.2 [P] APISource 데이터 모델 구현 (lambda-functions/src/models/APISource.js)
  - DynamoDB용 공공 API 정보 관리 모델
  - _Requirements: FR-002_

- [ ] 3.3 [P] DynamoDBService 구현 (lambda-functions/src/services/DynamoDBService.js)
  - DynamoDB CRUD 작업 서비스
  - _Requirements: FR-001, FR-003_

- [ ] 3.4 [P] HanRiverAPIService 구현 (lambda-functions/src/services/HanRiverAPIService.js)
  - 한강홍수통제소 3개 API 개별 호출 및 데이터 수집 서비스
  - 수위관측소, 실시간수위, 홍수예보발령 API 각각의 원본 정보 보존
  - _Requirements: FR-002_

- [ ] 3.5 [P] DataNormalizationService 구현 (lambda-functions/src/services/DataNormalizationService.js)
  - 한강홍수통제소 3개 API 데이터의 좌표 표준화 서비스 (원본 정보 보존)
  - _Requirements: FR-002_

- [ ] 3.6 [P] MultiSourceDataService 구현 (lambda-functions/src/services/MultiSourceDataService.js)
  - 동일 지점의 여러 API 정보를 개별적으로 관리하는 서비스
  - _Requirements: FR-002, FR-003_

- [ ] 3.7 [P] ProximityCheckService 구현 (lambda-functions/src/services/ProximityCheckService.js)
  - 경로와 홍수주의보 지점 간 1.5km 반경 검사 서비스
  - _Requirements: FR-006_

- [ ] 3.8 [P] NaverGeocodingService 구현 (lambda-functions/src/services/NaverGeocodingService.js)
  - 네이버 Geocoding API 연동 서비스
  - _Requirements: FR-001, FR-003_

- [ ] 3.9 [P] NaverDirectionsService 구현 (lambda-functions/src/services/NaverDirectionsService.js)
  - 네이버 Directions 5 API 연동 및 1.5km 우회 경로 계산 서비스
  - _Requirements: FR-001, FR-006_

- [ ] 3.10 침수 데이터 Lambda 함수 구현 (lambda-functions/src/handlers/floodHandler.js)
  - GET /api/flood-data, GET /api/flood-data/hanriver Lambda 함수
  - _Requirements: FR-001, FR-003_

- [ ] 3.11 다중 소스 데이터 Lambda 함수 구현 (lambda-functions/src/handlers/multiSourceHandler.js)
  - GET /api/flood-data/multi-source/{locationId} Lambda 함수 (3개 API 정보 구분 조회)
  - _Requirements: FR-003_

- [ ] 3.12 위치 기반 침수 데이터 Lambda 함수 구현 (lambda-functions/src/handlers/locationHandler.js)
  - GET /api/flood-data/location Lambda 함수
  - _Requirements: FR-001_

- [ ] 3.13 네이버 API Lambda 함수 구현 (lambda-functions/src/handlers/naverHandler.js)
  - GET /api/directions/safe-route, POST /api/geocoding/address Lambda 함수
  - _Requirements: FR-001, FR-003_

- [ ] 3.14 경로 근접성 검사 Lambda 함수 구현 (lambda-functions/src/handlers/proximityHandler.js)
  - POST /api/directions/check-proximity, POST /api/directions/alternative-route Lambda 함수
  - _Requirements: FR-006_

- [ ] 3.15 데이터 갱신 Lambda 함수 구현 (lambda-functions/src/handlers/refreshHandler.js)
  - POST /api/flood-data/refresh Lambda 함수
  - _Requirements: FR-004_

## Phase 4: 프론트엔드 구현

- [ ] 4.1 [P] MapContainer 컴포넌트 구현 (frontend/src/components/MapContainer.jsx)
  - 네이버 지도 렌더링 및 기본 설정
  - _Requirements: FR-001_

- [ ] 4.2 [P] FloodMarker 컴포넌트 구현 (frontend/src/components/FloodMarker.jsx)
  - 침수 지점 마커 표시 및 심각도별 색상 구분
  - _Requirements: FR-005_

- [ ] 4.3 [P] MultiSourceInfoWindow 컴포넌트 구현 (frontend/src/components/MultiSourceInfoWindow.jsx)
  - 3개 API 정보를 각각 구분하여 표시하는 상세 정보 팝업
  - _Requirements: FR-003_

- [ ] 4.4 [P] APIDataSection 컴포넌트 구현 (frontend/src/components/APIDataSection.jsx)
  - 개별 API(수위관측소/실시간수위/홍수예보발령) 정보 표시 컴포넌트
  - _Requirements: FR-003_

- [ ] 4.5 [P] RouteProximityAlert 컴포넌트 구현 (frontend/src/components/RouteProximityAlert.jsx)
  - 1.5km 반경 내 홍수주의보 지점 감지 시 대체 경로 제안 알림
  - _Requirements: FR-006_

- [ ] 4.6 [P] LocationService 구현 (frontend/src/services/LocationService.js)
  - 사용자 위치 권한 관리 및 현재 위치 획득
  - _Requirements: FR-001_

- [ ] 4.7 [P] FloodDataAPI 서비스 구현 (frontend/src/services/FloodDataAPI.js)
  - 백엔드 API 호출 서비스 (침수 데이터, 한강홍수통제소 데이터, 다중 소스 데이터)
  - _Requirements: FR-001, FR-003, FR-004_

- [ ] 4.8 [P] NaverMapService 구현 (frontend/src/services/NaverMapService.js)
  - 네이버 Web Dynamic Map, Directions, Geocoding API 클라이언트
  - _Requirements: FR-001, FR-003_

- [ ] 4.9 [P] ProximityCheckService 구현 (frontend/src/services/ProximityCheckService.js)
  - 경로와 홍수주의보 지점 1.5km 반경 검사 클라이언트 서비스
  - _Requirements: FR-006_

## Phase 5: 통합 및 실시간 기능

- [ ] 5.1 실시간 업데이트 서비스 구현 (backend/src/services/RealtimeUpdateService.js)
  - 한강홍수통제소 API 주기적 데이터 갱신 및 WebSocket 연결
  - _Requirements: FR-004_

- [ ] 5.2 WebSocket 연결 설정 (backend/src/utils/websocket.js)
  - 클라이언트-서버 실시간 통신 설정
  - _Requirements: FR-004_

- [ ] 5.3 프론트엔드 실시간 업데이트 연동 (frontend/src/services/RealtimeService.js)
  - WebSocket 클라이언트 및 네이버 지도 자동 갱신
  - _Requirements: FR-004_

- [ ] 5.4 AWS DynamoDB 연동 (lambda-functions/src/config/dynamodb.js)
  - DynamoDB 클라이언트 설정 및 테이블 스키마 정의
  - _Requirements: FR-002, FR-003_

- [ ] 5.5 오류 처리 미들웨어 구현 (backend/src/middleware/errorHandler.js)
  - 한강홍수통제소 및 네이버 API 오류 처리 및 로깅
  - _Requirements: FR-004_

- [ ] 5.6 CORS 및 보안 헤더 설정 (backend/src/middleware/security.js)
  - 크로스 오리진 요청 처리 및 AWS 환경 보안 설정
  - _Requirements: 모든 요구사항_

## Phase 6: AWS 서버리스 배포 및 테스트

- [ ] 6.1 [P] AWS 서버리스 인프라 구성 (serverless.yml)
  - Lambda, API Gateway, DynamoDB, S3 리소스 생성
  - _Requirements: 모든 요구사항_

- [ ] 6.2 [P] DynamoDB 테이블 설정 (infrastructure/dynamodb-table.yml)
  - 침수 정보 및 API 소스 테이블 정의
  - _Requirements: 모든 요구사항_

- [ ] 6.3 [P] CI/CD 파이프라인 구성 (.github/workflows/deploy.yml)
  - GitHub Actions를 통한 Serverless Framework 자동 배포
  - _Requirements: 모든 요구사항_

- [ ] 6.4 [P] 데이터 정규화 단위 테스트 (backend/tests/unit/data-normalization.test.js)
  - 한강홍수통제소 데이터 변환 로직 검증
  - _Requirements: FR-002_

- [ ] 6.5 [P] 네이버 API 단위 테스트 (backend/tests/unit/naver-api.test.js)
  - Geocoding, Directions API 호출 로직 검증
  - _Requirements: FR-001, FR-003_

- [ ] 6.6 [P] 컴포넌트 단위 테스트 (frontend/tests/components/)
  - React 컴포넌트 개별 기능 테스트
  - _Requirements: FR-001, FR-003, FR-005_

- [ ] 6.7 AWS Lambda 성능 테스트
  - Lambda 콜드 스타트 최적화, API 응답 시간 (<1000ms), 네이버 지도 렌더링 최적화
  - _Requirements: 모든 요구사항_

- [ ] 6.8 [P] API 문서 작성 (docs/api.md)
  - OpenAPI 스펙 및 한강홍수통제소, 네이버 API 연동 가이드
  - _Requirements: 모든 요구사항_

- [ ] 6.9 AWS 서버리스 환경 E2E 테스트
  - S3 + Lambda + DynamoDB 환경에서 전체 사용자 플로우 검증
  - _Requirements: 모든 요구사항_

## 의존성 관계
- 프로젝트 설정 (1.1-1.5) → 테스트 작성 (2.1-2.6) → 구현 (3.1-3.11, 4.1-4.6)
- 백엔드 모델 (3.1-3.2) → 서비스 (3.3-3.7) → 컨트롤러 (3.8-3.11)
- 프론트엔드 서비스 (4.4-4.6) → 컴포넌트 (4.1-4.3)
- 핵심 구현 → 통합 기능 (5.1-5.6) → AWS 서버리스 배포 및 테스트 (6.1-6.9)
- 네이버 클라우드 플랫폼 등록 (1.4) → 네이버 API 서비스 구현 (3.6-3.7, 4.6)

## 병렬 실행 예시
```
# Phase 1 프로젝트 설정 (동시 실행 가능):
Task: "AWS 서버리스 배포 환경 설정 (Serverless Framework, DynamoDB 설정)"
Task: "네이버 클라우드 플랫폼 애플리케이션 등록"
Task: "개발 환경 설정 (ESLint, Prettier, Jest)"

# Phase 2 테스트 작성 (동시 실행 가능):
Task: "침수 데이터 API 계약 테스트 작성 (backend/tests/contract/flood-api.test.js)"
Task: "한강홍수통제소 API 통합 테스트 작성 (backend/tests/integration/hanriver-api.test.js)"
Task: "네이버 API 통합 테스트 작성 (backend/tests/integration/naver-api.test.js)"
Task: "지도 컴포넌트 테스트 작성 (frontend/tests/components/MapContainer.test.jsx)"

# Phase 3 백엔드 서비스 구현 (동시 실행 가능):
Task: "HanRiverAPIService 구현 (한강홍수통제소 3개 API 연동)"
Task: "NaverGeocodingService 구현 (네이버 Geocoding API)"
Task: "NaverDirectionsService 구현 (네이버 Directions 5 API)"
```

## 주의사항
- [P] 표시 작업 = 서로 다른 파일, 의존성 없음
- 테스트가 실패하는지 확인 후 구현 시작
- 각 작업 완료 후 커밋
- 모호한 작업이나 같은 파일 충돌 방지