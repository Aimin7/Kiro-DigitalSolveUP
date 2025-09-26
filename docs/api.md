# 침수 정보 표시 앱 API 문서

## 개요

침수 정보 표시 앱의 REST API 및 WebSocket API 문서입니다. 한강홍수통제소 API와 네이버 지도 API를 연동하여 실시간 홍수 정보를 제공합니다.

## 기본 정보

- **Base URL**: `https://api.flood-info.example.com`
- **WebSocket URL**: `wss://ws.flood-info.example.com`
- **API Version**: v1
- **Content-Type**: `application/json`
- **Authentication**: API Key (선택적)

## 인증

API 키가 필요한 경우 헤더에 포함:

```http
X-API-Key: your-api-key-here
```

## 공통 응답 형식

### 성공 응답
```json
{
  "success": true,
  "data": {},
  "timestamp": "2023-07-15T10:00:00Z"
}
```

### 오류 응답
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "type": "ERROR_TYPE",
    "requestId": "request-id",
    "timestamp": "2023-07-15T10:00:00Z",
    "retryable": true
  }
}
```

## 홍수 데이터 API

### 전체 홍수 데이터 조회

**GET** `/api/flood-data`

현재 활성화된 모든 홍수 정보를 조회합니다.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `severity` | string | No | 심각도 필터 (`low`, `medium`, `high`) |
| `alertType` | string | No | 경보 유형 필터 (`주의보`, `경보`, `특보`) |
| `limit` | number | No | 결과 개수 제한 (기본값: 100) |
| `offset` | number | No | 결과 시작 위치 (기본값: 0) |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "flood-001",
      "locationId": "loc_37.5665_126.9780",
      "latitude": 37.5665,
      "longitude": 126.9780,
      "alertType": "주의보",
      "severity": "low",
      "timestamp": "2023-07-15T10:00:00Z",
      "sources": ["waterlevel", "realtime"],
      "availableAPIs": ["waterlevel", "realtime"],
      "waterLevelData": {
        "stationId": "ST001",
        "stationName": "한강대교",
        "waterLevel": 2.5,
        "alertLevel": 3.0,
        "dangerLevel": 4.0,
        "timestamp": "2023-07-15T10:00:00Z"
      },
      "realtimeData": {
        "stationId": "RT001",
        "waterLevel": 2.3,
        "flowRate": 150.5,
        "timestamp": "2023-07-15T10:00:00Z"
      }
    }
  ],
  "metadata": {
    "total": 1,
    "limit": 100,
    "offset": 0,
    "hasMore": false
  },
  "timestamp": "2023-07-15T10:00:00Z"
}
```

### 위치 기반 홍수 데이터 조회

**GET** `/api/flood-data/location`

특정 위치 주변의 홍수 정보를 조회합니다.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `latitude` | number | Yes | 중심 위도 |
| `longitude` | number | Yes | 중심 경도 |
| `radius` | number | No | 검색 반경 (미터, 기본값: 5000) |
| `severity` | string | No | 심각도 필터 |
| `limit` | number | No | 결과 개수 제한 |

#### Example Request

```http
GET /api/flood-data/location?latitude=37.5665&longitude=126.9780&radius=3000
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "flood-001",
      "latitude": 37.5665,
      "longitude": 126.9780,
      "distance": 150,
      "alertType": "주의보",
      "severity": "low"
    }
  ],
  "searchParams": {
    "center": {
      "latitude": 37.5665,
      "longitude": 126.9780
    },
    "radius": 3000
  }
}
```

### 다중 소스 데이터 조회

**GET** `/api/flood-data/multi-source/{locationId}`

특정 위치의 모든 API 소스 데이터를 조회합니다.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locationId` | string | Yes | 위치 ID |

#### Response

```json
{
  "success": true,
  "data": {
    "locationId": "loc_37.5665_126.9780",
    "coordinates": {
      "latitude": 37.5665,
      "longitude": 126.9780
    },
    "alertType": "경보",
    "severity": "medium",
    "timestamp": "2023-07-15T10:00:00Z",
    "availableAPIs": ["waterlevel", "realtime", "forecast"],
    "apiData": {
      "waterlevel": {
        "stationId": "ST001",
        "stationName": "한강대교",
        "waterLevel": 3.2,
        "alertLevel": 3.0,
        "dangerLevel": 4.0
      },
      "realtime": {
        "stationId": "RT001",
        "waterLevel": 3.1,
        "flowRate": 200.5
      },
      "forecast": {
        "forecastId": "FC001",
        "region": "한강상류",
        "alertType": "홍수경보",
        "issueTime": "2023-07-15T09:00:00Z",
        "validUntil": "2023-07-15T18:00:00Z"
      }
    }
  }
}
```

### 한강홍수통제소 원본 데이터 조회

**GET** `/api/flood-data/hanriver`

한강홍수통제소 API의 원본 데이터를 조회합니다.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `apiType` | string | No | API 타입 (`waterlevel`, `realtime`, `forecast`) |
| `region` | string | No | 지역 필터 |

#### Response

```json
{
  "success": true,
  "data": {
    "waterlevel": [
      {
        "stationId": "ST001",
        "stationName": "한강대교",
        "waterLevel": 2.5,
        "alertLevel": 3.0,
        "dangerLevel": 4.0,
        "coordinates": {
          "latitude": 37.5665,
          "longitude": 126.9780
        },
        "timestamp": "2023-07-15T10:00:00Z",
        "originalData": {}
      }
    ],
    "realtime": [],
    "forecast": []
  },
  "metadata": {
    "lastUpdated": "2023-07-15T10:00:00Z",
    "apiStatus": {
      "waterlevel": "active",
      "realtime": "active",
      "forecast": "active"
    }
  }
}
```

## 데이터 관리 API

### 데이터 갱신

**POST** `/api/flood-data/refresh`

외부 API에서 최신 데이터를 가져와 갱신합니다.

#### Request Body

```json
{
  "apiTypes": ["waterlevel", "realtime", "forecast"],
  "forceRefresh": false,
  "region": null
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "requestId": "refresh-001",
    "timestamp": "2023-07-15T10:00:00Z",
    "apiTypes": ["waterlevel", "realtime", "forecast"],
    "results": {
      "waterlevel": {
        "success": true,
        "processed": 50,
        "stored": 45,
        "updated": 5,
        "errors": 0
      }
    },
    "summary": {
      "totalProcessed": 150,
      "totalStored": 135,
      "totalUpdated": 15,
      "totalErrors": 0,
      "processingTime": 2500
    }
  }
}
```

### 데이터 상태 조회

**GET** `/api/flood-data/status`

시스템의 데이터 상태와 통계를 조회합니다.

#### Response

```json
{
  "success": true,
  "data": {
    "timestamp": "2023-07-15T10:00:00Z",
    "apis": {
      "waterlevel": {
        "available": true,
        "count": 50,
        "error": null
      },
      "realtime": {
        "available": true,
        "count": 45,
        "error": null
      },
      "forecast": {
        "available": true,
        "count": 10,
        "error": null
      }
    },
    "overall": {
      "totalAPIs": 3,
      "availableAPIs": 3,
      "totalDataPoints": 105,
      "healthScore": 95
    }
  }
}
```

## 네이버 지도 API

### 안전 경로 조회

**GET** `/api/directions/safe-route`

홍수 지역을 피하는 안전한 경로를 조회합니다.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `start` | string | Yes | 출발지 좌표 (`longitude,latitude`) |
| `goal` | string | Yes | 도착지 좌표 (`longitude,latitude`) |
| `waypoints` | string | No | 경유지 좌표들 (`:` 구분) |
| `option` | string | No | 경로 옵션 (`trafast`, `tracomfort`, `traoptimal`) |

#### Example Request

```http
GET /api/directions/safe-route?start=126.9780,37.5665&goal=127.0276,37.4979&option=trafast
```

#### Response

```json
{
  "success": true,
  "data": {
    "route": {
      "summary": {
        "start": {
          "location": [126.9780, 37.5665]
        },
        "goal": {
          "location": [127.0276, 37.4979]
        },
        "distance": 8500,
        "duration": 1200000,
        "tollFare": 0,
        "fuelPrice": 1200
      },
      "path": [
        [126.9780, 37.5665],
        [126.9850, 37.5600],
        [127.0276, 37.4979]
      ]
    },
    "safetyAnalysis": {
      "isSafe": true,
      "avoidedFloodAreas": 2,
      "riskPoints": [],
      "safetyScore": 95
    },
    "alternatives": []
  }
}
```

### 경로 근접성 검사

**POST** `/api/directions/check-proximity`

경로가 홍수 지역과 근접한지 검사합니다.

#### Request Body

```json
{
  "routePath": [
    [126.9780, 37.5665],
    [126.9850, 37.5600],
    [127.0276, 37.4979]
  ],
  "proximityRadius": 1500
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "hasProximityAlert": true,
    "alertPoints": [
      {
        "id": "flood-001",
        "locationId": "loc_37.5600_126.9850",
        "coordinates": {
          "latitude": 37.5600,
          "longitude": 126.9850
        },
        "distance": 800,
        "alertType": "경보",
        "severity": "medium",
        "alertLevel": "medium"
      }
    ],
    "safeRoute": false,
    "minDistance": 800,
    "routeAnalysis": {
      "totalDistance": 8500,
      "checkedPoints": 3,
      "floodPointsInArea": 1,
      "alertPointsCount": 1,
      "severityDistribution": {
        "low": 0,
        "medium": 1,
        "high": 0
      }
    },
    "proximityRadius": 1500
  }
}
```

### 대체 경로 계산

**POST** `/api/directions/alternative-route`

홍수 지역을 피하는 대체 경로를 계산합니다.

#### Request Body

```json
{
  "originalRoute": {
    "path": [
      [126.9780, 37.5665],
      [127.0276, 37.4979]
    ]
  },
  "avoidPoints": [
    {
      "latitude": 37.5600,
      "longitude": 126.9850
    }
  ],
  "proximityRadius": 1500
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "routes": [
      {
        "id": "alt-route-1",
        "summary": {
          "distance": 9200,
          "duration": 1350000,
          "safetyScore": 98
        },
        "path": [
          [126.9780, 37.5665],
          [126.9700, 37.5500],
          [127.0276, 37.4979]
        ],
        "avoidedAreas": 1,
        "estimatedTime": "22분 30초",
        "estimatedDistance": "9.2km"
      }
    ],
    "comparison": {
      "originalDistance": 8500,
      "alternativeDistance": 9200,
      "additionalDistance": 700,
      "additionalTime": 150000,
      "safetyImprovement": 23
    }
  }
}
```

### 주소-좌표 변환

**POST** `/api/geocoding/address`

주소를 좌표로 변환합니다.

#### Request Body

```json
{
  "address": "서울특별시 중구 세종대로 110"
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "addresses": [
      {
        "roadAddress": "서울특별시 중구 세종대로 110",
        "jibunAddress": "서울특별시 중구 태평로1가 31",
        "englishAddress": "110, Sejong-daero, Jung-gu, Seoul, Republic of Korea",
        "coordinates": {
          "latitude": 37.5662952,
          "longitude": 126.9779692
        },
        "distance": 0
      }
    ],
    "meta": {
      "totalCount": 1,
      "page": 1,
      "count": 1
    }
  }
}
```

### 좌표-주소 변환

**POST** `/api/geocoding/reverse`

좌표를 주소로 변환합니다.

#### Request Body

```json
{
  "latitude": 37.5662952,
  "longitude": 126.9779692
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "address": "서울특별시 중구 태평로1가",
    "roadAddress": "서울특별시 중구 세종대로 110",
    "region": {
      "area1": "서울특별시",
      "area2": "중구",
      "area3": "태평로1가"
    }
  }
}
```

## WebSocket API

### 연결

WebSocket 연결을 통해 실시간 데이터 업데이트를 받을 수 있습니다.

```javascript
const ws = new WebSocket('wss://ws.flood-info.example.com');

ws.onopen = function() {
  console.log('WebSocket connected');
};

ws.onmessage = function(event) {
  const message = JSON.parse(event.data);
  console.log('Received:', message);
};
```

### 메시지 형식

#### 구독 요청

```json
{
  "type": "subscribe",
  "data": {
    "room": "flood_data",
    "filters": {
      "region": "한강상류",
      "severity": "medium",
      "location": {
        "latitude": 37.5665,
        "longitude": 126.9780
      },
      "radius": 5000
    }
  }
}
```

#### 구독 확인

```json
{
  "type": "subscription_confirmed",
  "room": "flood_data",
  "filters": {
    "region": "한강상류",
    "severity": "medium"
  },
  "timestamp": "2023-07-15T10:00:00Z"
}
```

#### 데이터 업데이트

```json
{
  "type": "flood_data_update",
  "data": [
    {
      "id": "flood-001",
      "latitude": 37.5665,
      "longitude": 126.9780,
      "alertType": "경보",
      "severity": "medium",
      "timestamp": "2023-07-15T10:00:00Z"
    }
  ],
  "timestamp": "2023-07-15T10:00:00Z"
}
```

#### 근접성 알림

```json
{
  "type": "proximity_alert",
  "data": {
    "hasProximityAlert": true,
    "alertPoints": [
      {
        "id": "flood-001",
        "distance": 800,
        "alertType": "경보",
        "severity": "medium"
      }
    ],
    "minDistance": 800
  },
  "timestamp": "2023-07-15T10:00:00Z"
}
```

## 시스템 API

### 헬스 체크

**GET** `/api/health`

시스템 상태를 확인합니다.

#### Response

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2023-07-15T10:00:00Z",
    "service": "flood-info-backend",
    "version": "1.0.0",
    "stage": "prod",
    "region": "ap-northeast-2",
    "uptime": 3600,
    "memory": {
      "used": 128,
      "total": 256,
      "limit": 512
    }
  }
}
```

### 시스템 상태

**GET** `/api/status`

상세한 시스템 상태를 조회합니다.

#### Response

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2023-07-15T10:00:00Z",
    "components": {
      "database": {
        "status": "healthy",
        "tables": {
          "total": 2,
          "healthy": 2,
          "unhealthy": 0
        }
      },
      "errorHandler": {
        "status": "healthy",
        "issues": []
      },
      "security": {
        "status": "healthy",
        "stats": {
          "totalRequests": 1000,
          "rateLimitedIPs": 2
        }
      }
    },
    "system": {
      "uptime": 3600,
      "memory": {
        "used": 128,
        "total": 256,
        "usage": 50
      }
    }
  }
}
```

## 오류 코드

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | 요청 데이터 검증 실패 |
| `UNAUTHORIZED` | 401 | 인증 실패 |
| `FORBIDDEN` | 403 | 권한 없음 |
| `NOT_FOUND` | 404 | 리소스를 찾을 수 없음 |
| `RATE_LIMIT_EXCEEDED` | 429 | 요청 한도 초과 |
| `INTERNAL_ERROR` | 500 | 내부 서버 오류 |
| `SERVICE_UNAVAILABLE` | 503 | 서비스 일시 중단 |
| `HANRIVER_API_ERROR` | 502 | 한강홍수통제소 API 오류 |
| `NAVER_API_ERROR` | 502 | 네이버 API 오류 |
| `DATABASE_ERROR` | 503 | 데이터베이스 오류 |

## 속도 제한

- 기본: 100 requests/minute per IP
- 인증된 사용자: 1000 requests/minute per API key
- WebSocket: 10 connections per IP

## 예제 코드

### JavaScript (Fetch API)

```javascript
// 홍수 데이터 조회
async function getFloodData() {
  try {
    const response = await fetch('/api/flood-data?severity=medium&limit=50');
    const data = await response.json();
    
    if (data.success) {
      console.log('Flood data:', data.data);
    } else {
      console.error('API Error:', data.error);
    }
  } catch (error) {
    console.error('Network Error:', error);
  }
}

// 경로 근접성 검사
async function checkRouteProximity(routePath) {
  try {
    const response = await fetch('/api/directions/check-proximity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        routePath,
        proximityRadius: 1500,
      }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Proximity check failed:', error);
    throw error;
  }
}
```

### Python (requests)

```python
import requests

# 홍수 데이터 조회
def get_flood_data(severity=None, limit=100):
    params = {'limit': limit}
    if severity:
        params['severity'] = severity
    
    response = requests.get('/api/flood-data', params=params)
    
    if response.status_code == 200:
        data = response.json()
        if data['success']:
            return data['data']
        else:
            raise Exception(f"API Error: {data['error']['message']}")
    else:
        response.raise_for_status()

# 안전 경로 조회
def get_safe_route(start_lat, start_lng, goal_lat, goal_lng):
    params = {
        'start': f"{start_lng},{start_lat}",
        'goal': f"{goal_lng},{goal_lat}",
        'option': 'trafast'
    }
    
    response = requests.get('/api/directions/safe-route', params=params)
    return response.json()
```

## 데이터 모델

### FloodInfo 모델

```json
{
  "id": "string",
  "locationId": "string",
  "latitude": "number",
  "longitude": "number",
  "alertType": "string",
  "severity": "string",
  "timestamp": "string (ISO 8601)",
  "sources": ["string"],
  "availableAPIs": ["string"],
  "waterLevelData": {
    "stationId": "string",
    "stationName": "string",
    "waterLevel": "number",
    "alertLevel": "number",
    "dangerLevel": "number",
    "timestamp": "string (ISO 8601)"
  },
  "realtimeData": {
    "stationId": "string",
    "waterLevel": "number",
    "flowRate": "number",
    "timestamp": "string (ISO 8601)"
  },
  "forecastData": {
    "forecastId": "string",
    "region": "string",
    "alertType": "string",
    "issueTime": "string (ISO 8601)",
    "validUntil": "string (ISO 8601)"
  }
}
```

### APISource 모델

```json
{
  "id": "string",
  "name": "string",
  "type": "string",
  "endpoint": "string",
  "status": "string",
  "lastUpdated": "string (ISO 8601)",
  "dataCount": "number",
  "errorCount": "number"
}
```

## SDK 및 클라이언트 라이브러리

### JavaScript SDK

```javascript
// 설치
npm install @flood-info/sdk

// 사용법
import FloodInfoSDK from '@flood-info/sdk';

const client = new FloodInfoSDK({
  baseURL: 'https://api.flood-info.example.com',
  apiKey: 'your-api-key'
});

// 홍수 데이터 조회
const floodData = await client.getFloodData({
  severity: 'medium',
  limit: 50
});

// 실시간 업데이트 구독
client.subscribe('flood_data', (data) => {
  console.log('Real-time update:', data);
});
```

### React Hook

```javascript
import { useFloodData, useProximityAlert } from '@flood-info/react-hooks';

function FloodMap() {
  const { data, loading, error } = useFloodData({
    severity: 'medium',
    autoRefresh: true
  });

  const { alerts } = useProximityAlert({
    userLocation: { lat: 37.5665, lng: 126.9780 },
    radius: 5000
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map(flood => (
        <FloodMarker key={flood.id} data={flood} />
      ))}
      {alerts.map(alert => (
        <ProximityAlert key={alert.id} alert={alert} />
      ))}
    </div>
  );
}
```

## 성능 최적화

### 캐싱 전략

- **API 응답 캐싱**: 5분간 캐시 (홍수 데이터)
- **경로 계산 캐싱**: 30분간 캐시 (동일 출발지-도착지)
- **지오코딩 캐싱**: 24시간 캐시 (주소-좌표 변환)

### 배치 요청

여러 위치의 데이터를 한 번에 조회:

```http
POST /api/flood-data/batch
Content-Type: application/json

{
  "locations": [
    {"latitude": 37.5665, "longitude": 126.9780},
    {"latitude": 37.4979, "longitude": 127.0276}
  ],
  "radius": 1000
}
```

### 압축 및 최적화

- **Gzip 압축**: 모든 응답에 적용
- **JSON 최적화**: 불필요한 필드 제거
- **이미지 최적화**: WebP 형식 지원

## 모니터링 및 분석

### 메트릭 API

**GET** `/api/metrics`

시스템 메트릭을 조회합니다.

```json
{
  "success": true,
  "data": {
    "requests": {
      "total": 10000,
      "success": 9800,
      "error": 200,
      "successRate": 98.0
    },
    "performance": {
      "averageResponseTime": 250,
      "p95ResponseTime": 800,
      "p99ResponseTime": 1500
    },
    "apis": {
      "hanriver": {
        "calls": 500,
        "successRate": 95.0,
        "averageResponseTime": 1200
      },
      "naver": {
        "calls": 300,
        "successRate": 99.0,
        "averageResponseTime": 400
      }
    }
  }
}
```

### 로그 분석

**GET** `/api/logs`

시스템 로그를 조회합니다.

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "timestamp": "2023-07-15T10:00:00Z",
        "level": "INFO",
        "message": "Flood data updated successfully",
        "requestId": "req-001",
        "duration": 250
      }
    ],
    "summary": {
      "total": 1000,
      "levels": {
        "ERROR": 10,
        "WARN": 50,
        "INFO": 940
      }
    }
  }
}
```

## 보안

### API 키 관리

```http
# 헤더에 API 키 포함
X-API-Key: your-api-key-here

# 또는 쿼리 파라미터로
GET /api/flood-data?api_key=your-api-key-here
```

### CORS 설정

```javascript
// 허용된 도메인
const allowedOrigins = [
  'https://flood-info.example.com',
  'https://app.flood-info.example.com',
  'http://localhost:3000' // 개발 환경
];
```

### 요청 검증

모든 요청은 다음 검증을 거칩니다:

- **입력 데이터 검증**: JSON 스키마 검증
- **SQL 인젝션 방지**: 파라미터화된 쿼리 사용
- **XSS 방지**: 입력 데이터 이스케이프
- **CSRF 방지**: CSRF 토큰 검증

## 테스트

### API 테스트

```bash
# 단위 테스트
npm test

# 통합 테스트
npm run test:integration

# 성능 테스트
npm run test:performance

# 계약 테스트
npm run test:contract
```

### 테스트 커버리지

- **단위 테스트**: 95% 이상
- **통합 테스트**: 주요 워크플로우 100%
- **성능 테스트**: 응답 시간 < 1000ms
- **계약 테스트**: API 스펙 100% 준수

## 배포 및 환경

### 환경별 설정

#### 개발 환경
- **Base URL**: `https://dev-api.flood-info.example.com`
- **WebSocket URL**: `wss://dev-ws.flood-info.example.com`
- **Rate Limit**: 1000 requests/minute

#### 스테이징 환경
- **Base URL**: `https://staging-api.flood-info.example.com`
- **WebSocket URL**: `wss://staging-ws.flood-info.example.com`
- **Rate Limit**: 500 requests/minute

#### 프로덕션 환경
- **Base URL**: `https://api.flood-info.example.com`
- **WebSocket URL**: `wss://ws.flood-info.example.com`
- **Rate Limit**: 100 requests/minute

### 배포 스크립트

```bash
# 개발 환경 배포
./deploy.sh dev

# 스테이징 환경 배포
./deploy.sh staging

# 프로덕션 환경 배포
./deploy.sh prod ap-northeast-2
```

## 문제 해결

### 일반적인 오류

#### 1. 429 Too Many Requests
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 60 seconds.",
    "retryAfter": 60
  }
}
```

**해결방법**: 요청 빈도를 줄이거나 API 키를 사용하여 한도를 늘리세요.

#### 2. 502 Bad Gateway
```json
{
  "success": false,
  "error": {
    "code": "HANRIVER_API_ERROR",
    "message": "External API temporarily unavailable",
    "retryable": true
  }
}
```

**해결방법**: 잠시 후 다시 시도하거나 캐시된 데이터를 사용하세요.

#### 3. WebSocket 연결 실패
```javascript
ws.onerror = function(error) {
  console.error('WebSocket error:', error);
  // 재연결 시도
  setTimeout(() => {
    connectWebSocket();
  }, 5000);
};
```

### 디버깅 도구

#### API 테스트 도구
```bash
# cURL 예제
curl -X GET "https://api.flood-info.example.com/api/flood-data?severity=medium" \
  -H "X-API-Key: your-api-key"

# HTTPie 예제
http GET api.flood-info.example.com/api/flood-data severity==medium \
  X-API-Key:your-api-key
```

#### WebSocket 테스트
```javascript
// 브라우저 콘솔에서 테스트
const ws = new WebSocket('wss://ws.flood-info.example.com');
ws.onopen = () => console.log('Connected');
ws.onmessage = (e) => console.log('Message:', JSON.parse(e.data));
ws.send(JSON.stringify({
  type: 'subscribe',
  data: { room: 'flood_data' }
}));
```

## 변경 이력

### v1.2.0 (2024-01-15)
- 배치 요청 API 추가
- 성능 최적화 (응답 시간 30% 개선)
- React Hook 라이브러리 추가
- 메트릭 및 로그 API 추가

### v1.1.0 (2023-10-15)
- WebSocket 필터링 기능 추가
- 대체 경로 계산 API 추가
- 보안 강화 (CSRF 방지)
- 테스트 커버리지 95% 달성

### v1.0.0 (2023-07-15)
- 초기 API 릴리스
- 홍수 데이터 조회 API
- 네이버 지도 연동 API
- WebSocket 실시간 업데이트
- 경로 근접성 검사 기능

## 지원

- **문서**: [https://docs.flood-info.example.com](https://docs.flood-info.example.com)
- **API 콘솔**: [https://console.flood-info.example.com](https://console.flood-info.example.com)
- **상태 페이지**: [https://status.flood-info.example.com](https://status.flood-info.example.com)
- **이슈 리포트**: [https://github.com/flood-info/issues](https://github.com/flood-info/issues)
- **이메일**: support@flood-info.example.com
- **Slack**: #flood-info-support