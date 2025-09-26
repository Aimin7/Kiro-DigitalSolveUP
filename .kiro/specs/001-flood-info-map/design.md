# Design Document

## Overview

침수 정보 표시 앱은 3개의 공공 데이터 API에서 침수 정보를 수집하고 통합하여 네이버 지도 위에 실시간으로 표시하는 웹 애플리케이션입니다. 사용자는 현재 위치 주변의 침수 상황을 직관적으로 파악하고 안전한 경로를 선택할 수 있습니다.

## Architecture

### 시스템 구조 (데모용 저비용 아키텍처)
```
AWS S3 (Frontend - React + Naver Maps API)
    ↓
AWS Lambda + API Gateway (Backend API Server - Node.js)
    ↓
AWS DynamoDB (침수 데이터 저장)
    ↓
Data Integration Service
    ↓
한강홍수통제소 공공 APIs (3개)
```

### AWS 배포 아키텍처 (저비용 최적화)
- **Frontend**: S3 정적 웹사이트 호스팅 (CloudFront 제외로 비용 절약)
- **Backend**: Lambda + API Gateway (서버리스로 사용량 기반 과금)
- **Database**: DynamoDB (NoSQL, 프리티어 포함, RDS보다 저렴)
- **SSL**: API Gateway 기본 SSL 사용
- **Monitoring**: CloudWatch 기본 로그만 사용

### 주요 컴포넌트
1. **Frontend**: 네이버 지도 기반 사용자 인터페이스
2. **Backend API**: 데이터 통합 및 제공 서버
3. **Data Integration Service**: 공공 API 데이터 수집 및 정규화
4. **Real-time Update Service**: 주기적 데이터 갱신

## Components and Interfaces

### Frontend Components
- **MapContainer**: 네이버 지도 렌더링 및 마커 관리
- **FloodMarker**: 침수 지점 마커 컴포넌트
- **MultiSourceInfoWindow**: 3개 API 정보를 각각 구분하여 표시하는 상세 정보 팝업
- **APIDataSection**: 개별 API(수위관측소/실시간수위/홍수예보발령) 정보 표시 컴포넌트
- **RouteProximityAlert**: 1.5km 반경 내 홍수주의보 지점 감지 시 대체 경로 제안 알림
- **LocationService**: 사용자 위치 권한 및 현재 위치 관리

### Backend Services
- **FloodDataService**: 침수 데이터 CRUD 작업
- **HanRiverAPIService**: 한강홍수통제소 3개 API 개별 호출 및 데이터 수집
- **DataNormalizationService**: 각 API 데이터의 좌표 표준화 (원본 정보 보존)
- **MultiSourceDataService**: 동일 지점의 여러 API 정보 개별 관리
- **ProximityCheckService**: 경로와 홍수주의보 지점 간 1.5km 반경 검사
- **NaverGeocodingService**: 네이버 Geocoding API 연동
- **NaverDirectionsService**: 네이버 Directions API 연동 및 우회 경로 계산

### 외부 API 연동
- **한강홍수통제소 수위 관측소**: `http://211.188.52.85:9191/waterlevelinfo/info.json`
- **한강홍수통제소 실시간 수위**: `http://211.188.52.85:9191/getWaterLevel1D/list/1D/1018683/20230701/20230930.json`
- **한강홍수통제소 홍수예보발령**: `http://211.188.52.85:9191/fldfct/list/20230715.json`
- **네이버 Web Dynamic Map**: 지도 표시 및 마커 관리
- **네이버 Directions 5**: 안전 경로 안내
- **네이버 Geocoding**: 주소-좌표 변환

### API Endpoints
- `GET /api/flood-data`: 홍수주의보 정보 조회
- `GET /api/flood-data/location`: 특정 위치 기준 홍수주의보 정보
- `GET /api/flood-data/detail/{id}`: 특정 지점의 3개 API 개별 상세 정보
- `GET /api/flood-data/multi-source/{locationId}`: 특정 지점의 모든 API 정보를 구분하여 조회
- `GET /api/flood-data/hanriver`: 한강홍수통제소 원본 데이터 조회
- `POST /api/flood-data/refresh`: 데이터 수동 갱신
- `GET /api/directions/safe-route`: 1.5km 반경 우회 경로 안내
- `POST /api/directions/check-proximity`: 경로와 홍수주의보 지점 1.5km 반경 근접성 실시간 검사
- `POST /api/directions/alternative-route`: 홍수주의보 지점 1.5km 우회 대체 경로 계산
- `POST /api/geocoding/address`: 주소-좌표 변환
- `GET /api/health`: 서비스 상태 확인

## Data Models

### FloodAlertInfo
- `id`: 고유 식별자
- `latitude`: 위도
- `longitude`: 경도
- `alertType`: 경보 유형 (주의보/경보/특보)
- `severity`: 심각도 레벨 (low/medium/high)
- `timestamp`: 발생 시간
- `address`: 주소 정보
- `status`: 상태 (active/resolved)
- `sources`: 관련 API 소스 목록 (배열)

### MultiSourceFloodData
- `locationId`: 위치 고유 식별자
- `latitude`: 위도
- `longitude`: 경도
- `waterLevelData`: 수위 관측소 정보 (HanRiverWaterLevel 또는 null)
- `realtimeData`: 실시간 수위 정보 (RealtimeWaterLevel 또는 null)
- `forecastData`: 홍수예보 정보 (FloodForecast 또는 null)
- `lastUpdated`: 마지막 업데이트 시간
- `availableAPIs`: 해당 지점에서 사용 가능한 API 목록 (배열)

### APISource
- `id`: API 식별자
- `name`: API 이름 (수위관측소/실시간수위/홍수예보발령)
- `endpoint`: API 엔드포인트 (한강홍수통제소 3개 URL)
- `lastUpdated`: 마지막 업데이트 시간
- `isActive`: 활성 상태
- `apiType`: API 유형 (waterlevel/realtime/forecast)

### HanRiverWaterLevel
- `stationId`: 관측소 ID
- `stationName`: 관측소 이름
- `waterLevel`: 수위 (m)
- `alertLevel`: 경보 수위
- `dangerLevel`: 위험 수위
- `timestamp`: 측정 시간
- `coordinates`: 관측소 좌표

### FloodForecast
- `forecastId`: 예보 ID
- `region`: 예보 지역
- `alertType`: 경보 유형 (주의보/경보/특보)
- `issueTime`: 발령 시간
- `validUntil`: 유효 시간
- `description`: 예보 내용

## Error Handling

### API 오류 처리
- **네트워크 오류**: 재시도 로직 (최대 3회)
- **API 응답 오류**: 로그 기록 및 사용자 알림
- **데이터 파싱 오류**: 기본값 설정 및 오류 로그

### 사용자 경험 오류 처리
- **위치 권한 거부**: 기본 위치(서울시청)로 설정sS
- **지도 로딩 실패**: 오류 메시지 및 새로고침 버튼 제공
- **데이터 로딩 지연**: 로딩 스피너 표시

## Testing Strategy

### 단위 테스트
- 한강홍수통제소 API 응답 파싱 테스트
- 네이버 API 연동 로직 테스트
- 데이터 정규화 및 좌표 변환 테스트

### 통합 테스트
- 한강홍수통제소 3개 API 연동 테스트
- 네이버 지도 API (Web Dynamic Map, Directions, Geocoding) 테스트
- AWS DynamoDB CRUD 테스트
- Lambda 함수 실행 테스트
- 전체 데이터 플로우 테스트

### E2E 테스트
- AWS 환경에서 지도 로딩 및 마커 표시 테스트
- 사용자 위치 기반 데이터 조회 테스트
- 실시간 업데이트 기능 테스트
- 안전 경로 안내 기능 테스트

### AWS 환경 테스트
- Lambda 함수 배포 및 실행 테스트
- API Gateway 엔드포인트 테스트
- S3 정적 웹사이트 호스팅 테스트
- DynamoDB 연결 및 성능 테스트

## AWS 배포 환경 설정

### 네이버 지도 API 설정
1. **네이버 클라우드 플랫폼 콘솔**에서 애플리케이션 등록
2. **서비스 URL 등록**:
   - 개발 환경: `http://localhost:3000`
   - 스테이징 환경: `https://staging.flood-info-app.com`
   - 프로덕션 환경: `https://flood-info-app.com`
3. **활용 서비스 선택**:
   - Web Dynamic Map: 지도 표시 및 마커 관리
   - Directions 5: 안전 경로 안내 기능
   - Geocoding: 주소-좌표 변환 기능

### AWS 리소스 구성 (저비용 데모용)
- **S3 버킷**: 정적 웹사이트 호스팅 (월 $1-3 예상)
- **Lambda 함수**: 서버리스 백엔드 API (프리티어 포함, 월 $0-5 예상)
- **API Gateway**: REST API 엔드포인트 (월 $1-3 예상)
- **DynamoDB**: NoSQL 데이터베이스 (프리티어 25GB, 월 $0-2 예상)
- **CloudWatch**: 기본 로그 및 메트릭 (프리티어 포함)
- **Lambda Environment Variables**: 환경 변수 관리 (무료)

**예상 월 비용**: $2-13 (프리티어 활용 시 $0-5)

### 비용 절약 포인트
- **CloudFront 제외**: CDN 없이 S3 직접 호스팅으로 월 $15-50 절약
- **ALB → API Gateway**: 로드밸런서 대신 API Gateway로 월 $16-25 절약
- **ECS Fargate → Lambda**: 컨테이너 대신 서버리스로 월 $30-100 절약
- **RDS → DynamoDB**: 관계형 DB 대신 NoSQL로 월 $15-50 절약
- **Route 53 제외**: 커스텀 도메인 없이 S3 기본 URL 사용으로 월 $0.5 절약

**총 절약 예상액**: 월 $76-225 → 데모용으로 충분한 성능 유지

### 환경 변수 설정 (Lambda 환경 변수)
```
# 네이버 API 키
NAVER_CLIENT_ID=nzitgym21s
NAVER_CLIENT_SECRET=NtB7HWEKYT66vIFdXwv2HcRoFulNQ8wwvLapaIHI

# 한강홍수통제소 API
HANRIVER_BASE_URL=http://211.188.52.85:9191
HANRIVER_WATERLEVEL_ENDPOINT=/waterlevelinfo/info.json
HANRIVER_REALTIME_ENDPOINT=/getWaterLevel1D/list/1D/1018683/20230701/20230930.json
HANRIVER_FORECAST_ENDPOINT=/fldfct/list/20230715.json

# AWS 설정
AWS_REGION=ap-northeast-2
DYNAMODB_TABLE_NAME=flood-info-table

# 애플리케이션 설정
NODE_ENV=production
CORS_ORIGIN=https://your-s3-bucket.s3-website.ap-northeast-2.amazonaws.com
```