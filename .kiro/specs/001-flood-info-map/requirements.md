# Requirements Document

## Introduction

침수 정보 표시 앱은 공공 데이터 API를 활용하여 실시간 침수 정보를 네이버 지도 위에 시각적으로 표시하는 웹 애플리케이션입니다. 시민들이 침수 위험 지역을 쉽게 파악하고 안전한 경로를 선택할 수 있도록 돕는 것이 주요 목적입니다.

## Requirements

### Requirement 1

**User Story:** 시민으로서, 현재 위치 주변의 침수 정보를 지도에서 확인하고 싶다.

#### Acceptance Criteria

1. WHEN 사용자가 앱에 접속하면 THEN 시스템은 네이버 Web Dynamic Map을 표시해야 한다
2. WHEN 사용자가 위치 권한을 허용하면 THEN 시스템은 현재 위치를 지도 중심으로 설정해야 한다
3. WHEN 한강홍수통제소 침수 데이터가 로드되면 THEN 시스템은 침수 지점을 지도에 마커로 표시해야 한다

### Requirement 2

**User Story:** 관리자로서, 한강홍수통제소의 여러 공공 데이터 API의 침수 정보를 각각 수집하여 개별적으로 제공하고 싶다.

#### Acceptance Criteria

1. WHEN 시스템이 시작되면 THEN 한강홍수통제소의 3개 API(수위관측소, 실시간수위, 홍수예보발령)에서 데이터를 각각 수집해야 한다
2. WHEN 데이터를 수집하면 THEN 시스템은 각 API의 원본 정보를 보존하면서 좌표만 정규화해야 한다
3. WHEN 데이터를 저장하면 THEN 시스템은 각 API별로 구분된 형식으로 AWS DynamoDB에 저장해야 한다
4. WHEN 여러 API에서 동일한 지점의 데이터가 있으면 THEN 시스템은 각 API 정보를 통합하지 않고 개별적으로 보관해야 한다

### Requirement 3

**User Story:** 사용자로서, 홍수주의보 지점의 마커를 클릭했을 때 해당 지점에 대한 3개 공공 API의 모든 관련 정보를 각각 구분하여 확인하고 싶다.

#### Acceptance Criteria

1. WHEN 사용자가 홍수주의보 마커를 클릭하면 THEN 시스템은 해당 지점의 상세 정보 팝업을 표시해야 한다
2. WHEN 상세 정보 팝업이 표시되면 THEN 3개 공공 API(수위관측소, 실시간수위, 홍수예보발령)에서 제공하는 정보가 각각 구분된 섹션으로 표시되어야 한다
3. WHEN 해당 지점에 특정 API의 정보가 없으면 THEN 시스템은 "해당 API 정보 없음" 메시지를 표시해야 한다
4. WHEN 각 API 섹션이 표시되면 THEN 수위관측소 정보, 실시간수위 정보, 홍수예보발령 정보가 각각의 제목과 함께 구분되어 표시되어야 한다

### Requirement 4

**User Story:** 사용자로서, 한강홍수통제소의 침수 정보를 실시간으로 업데이트 받고 싶다.

#### Acceptance Criteria

1. WHEN 한강홍수통제소 API에서 새로운 침수 정보가 제공되면 THEN 시스템은 자동으로 네이버 지도를 업데이트해야 한다
2. WHEN 침수 상황이 해제되면 THEN 시스템은 해당 마커를 지도에서 제거해야 한다
3. WHEN 한강홍수통제소 API 호출이 실패하면 THEN 시스템은 사용자에게 오류 메시지를 표시해야 한다

### Requirement 5

**User Story:** 사용자로서, 침수 심각도에 따라 다른 시각적 표시를 보고 싶다.

#### Acceptance Criteria

1. WHEN 침수 심도가 30cm 미만이면 THEN 시스템은 노란색 마커를 표시해야 한다
2. WHEN 침수 심도가 30cm 이상 60cm 미만이면 THEN 시스템은 주황색 마커를 표시해야 한다
3. WHEN 침수 심도가 60cm 이상이면 THEN 시스템은 빨간색 마커를 표시해야 한다

### Requirement 6

**User Story:** 사용자로서, 내가 설정한 경로가 홍수주의보 지점으로부터 1.5km 반경 내에 들어올 때 대체 경로 제안 알림을 받고 싶다.

#### Acceptance Criteria

1. WHEN 사용자가 목적지를 설정하면 THEN 시스템은 네이버 Directions 5 API를 사용하여 기본 경로를 계산해야 한다
2. WHEN 계산된 경로의 어느 지점이라도 홍수주의보 지점으로부터 1.5km 반경 내에 들어오면 THEN 시스템은 즉시 대체 경로 제안 알림을 표시해야 한다
3. WHEN 대체 경로 제안 알림이 표시되면 THEN 시스템은 "경로상에 홍수주의보 지역이 1.5km 내에 있습니다. 대체 경로를 확인하시겠습니까?" 메시지를 표시해야 한다
4. WHEN 사용자가 대체 경로를 요청하면 THEN 시스템은 모든 홍수주의보 지점을 1.5km 이상 우회하는 안전한 경로를 계산하여 제공해야 한다
5. WHEN 대체 경로가 제공되면 THEN 시스템은 기존 경로(빨간색)와 대체 경로(파란색)를 지도에 함께 표시해야 한다

### Requirement 7

**User Story:** 개발자로서, AWS 클라우드 환경에서 저비용으로 데모 서비스를 운영하고 싶다.

#### Acceptance Criteria

1. WHEN 애플리케이션이 배포되면 THEN AWS Lambda와 API Gateway에서 백엔드 API가 실행되어야 한다
2. WHEN 사용자가 접속하면 THEN AWS S3 정적 웹사이트 호스팅을 통해 프론트엔드가 제공되어야 한다
3. WHEN 데이터가 저장되면 THEN AWS DynamoDB에 안전하게 보관되어야 한다