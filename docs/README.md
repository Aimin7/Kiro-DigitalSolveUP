# 침수 정보 표시 앱 API 문서

이 디렉토리는 침수 정보 표시 앱의 완전한 API 문서를 포함합니다.

## 📋 문서 구조

### 📖 주요 문서

- **[api.md](./api.md)** - 완전한 API 문서 (한국어)
  - 모든 엔드포인트 상세 설명
  - 요청/응답 예제
  - 오류 코드 및 처리 방법
  - SDK 및 클라이언트 라이브러리 가이드
  - 성능 최적화 및 보안 정보

- **[openapi.yaml](./openapi.yaml)** - OpenAPI 3.0 스펙
  - 표준 API 스펙 형식
  - Swagger UI, Redoc 등과 호환
  - 자동 코드 생성 도구 지원
  - API 검증 및 테스트 도구 연동

- **[postman-collection.json](./postman-collection.json)** - Postman 컬렉션
  - 모든 API 엔드포인트 테스트 케이스
  - 환경 변수 및 인증 설정
  - 자동화된 테스트 스크립트
  - 오류 처리 및 성능 테스트 시나리오

## 🚀 빠른 시작

### 1. API 문서 읽기

가장 포괄적인 정보는 [api.md](./api.md)에서 확인할 수 있습니다:

```bash
# 브라우저에서 보기
open docs/api.md

# 또는 마크다운 뷰어 사용
code docs/api.md
```

### 2. OpenAPI 스펙 활용

OpenAPI 스펙을 사용하여 대화형 문서를 생성할 수 있습니다:

```bash
# Swagger UI로 보기
npx swagger-ui-serve docs/openapi.yaml

# Redoc으로 보기
npx redoc-cli serve docs/openapi.yaml
```

### 3. Postman으로 API 테스트

1. Postman에서 컬렉션 가져오기:
   - File → Import → `docs/postman-collection.json` 선택

2. 환경 변수 설정:
   ```
   base_url: https://api.flood-info.example.com
   api_key: your-api-key-here
   test_latitude: 37.5665
   test_longitude: 126.9780
   ```

3. 테스트 실행:
   - 개별 요청 실행
   - 컬렉션 전체 실행 (Collection Runner 사용)
   - 자동화된 테스트 스크립트 실행

## 🔧 도구 및 유틸리티

### API 문서 생성 도구

```bash
# OpenAPI에서 HTML 문서 생성
npx redoc-cli build docs/openapi.yaml --output docs/api.html

# Postman에서 문서 생성
# Postman → Collection → View Documentation → Publish
```

### 코드 생성 도구

OpenAPI 스펙을 사용하여 클라이언트 코드를 자동 생성할 수 있습니다:

```bash
# JavaScript/TypeScript 클라이언트 생성
npx @openapitools/openapi-generator-cli generate \
  -i docs/openapi.yaml \
  -g typescript-fetch \
  -o generated/typescript-client

# Python 클라이언트 생성
npx @openapitools/openapi-generator-cli generate \
  -i docs/openapi.yaml \
  -g python \
  -o generated/python-client

# Java 클라이언트 생성
npx @openapitools/openapi-generator-cli generate \
  -i docs/openapi.yaml \
  -g java \
  -o generated/java-client
```

### API 검증 도구

```bash
# OpenAPI 스펙 검증
npx swagger-parser validate docs/openapi.yaml

# API 응답 검증 (실제 서버 필요)
npx dredd docs/openapi.yaml https://api.flood-info.example.com
```

## 📊 API 개요

### 주요 기능

1. **홍수 데이터 조회**
   - 실시간 홍수 정보
   - 위치 기반 검색
   - 다중 소스 데이터 통합

2. **경로 안전성 검사**
   - 안전 경로 계산
   - 근접성 알림
   - 대체 경로 제안

3. **지오코딩 서비스**
   - 주소-좌표 변환
   - 역 지오코딩

4. **실시간 업데이트**
   - WebSocket 연결
   - 푸시 알림
   - 자동 갱신

### 기술 스택

- **Backend**: AWS Lambda (Node.js 18.x)
- **Database**: DynamoDB
- **API Gateway**: AWS API Gateway + WebSocket
- **External APIs**: 한강홍수통제소, 네이버 지도
- **Authentication**: API Key
- **Documentation**: OpenAPI 3.0

### 성능 지표

- **응답 시간**: < 1000ms (95th percentile)
- **가용성**: 99.9%
- **처리량**: 1000 requests/minute
- **오류율**: < 1%

## 🔐 보안 및 인증

### API 키 관리

```http
# 헤더에 API 키 포함
X-API-Key: your-api-key-here

# 또는 쿼리 파라미터로
GET /api/endpoint?api_key=your-api-key-here
```

### 보안 정책

- **HTTPS 필수**: 모든 통신은 TLS 1.2 이상
- **CORS 정책**: 허용된 도메인만 접근 가능
- **Rate Limiting**: IP별 요청 제한
- **Input Validation**: 모든 입력 데이터 검증
- **SQL Injection 방지**: 파라미터화된 쿼리 사용

## 🧪 테스트

### 단위 테스트

```bash
# API 핸들러 테스트
cd lambda-functions
npm test

# 특정 테스트 실행
npm test -- --grep "flood data"
```

### 통합 테스트

```bash
# 전체 워크플로우 테스트
npm run test:integration

# 외부 API 연동 테스트
npm run test:external-apis
```

### 성능 테스트

```bash
# 부하 테스트
npm run test:load

# 스트레스 테스트
npm run test:stress
```

### API 계약 테스트

```bash
# OpenAPI 스펙 준수 검증
npm run test:contract

# Postman 컬렉션 실행
newman run docs/postman-collection.json \
  --environment postman-environment.json
```

## 📈 모니터링 및 분석

### 메트릭 수집

- **응답 시간**: 평균, P95, P99
- **오류율**: HTTP 상태 코드별
- **처리량**: 초당 요청 수
- **가용성**: 업타임 비율

### 로그 분석

- **구조화된 로그**: JSON 형식
- **로그 레벨**: ERROR, WARN, INFO, DEBUG
- **추적 ID**: 요청별 고유 식별자
- **성능 로그**: 응답 시간, 메모리 사용량

### 알림 설정

- **오류율 증가**: > 5%
- **응답 시간 지연**: > 2000ms
- **외부 API 장애**: 연속 실패
- **시스템 리소스**: CPU, 메모리 임계치

## 🔄 버전 관리

### API 버전 정책

- **현재 버전**: v1.2.0
- **하위 호환성**: 마이너 버전 업데이트 시 유지
- **지원 기간**: 메이저 버전 2년 지원
- **마이그레이션**: 6개월 전 공지

### 변경 이력

- **v1.2.0**: 배치 요청, 성능 최적화, React Hook
- **v1.1.0**: WebSocket 필터링, 대체 경로, 보안 강화
- **v1.0.0**: 초기 릴리스

## 🆘 지원 및 문의

### 문서 및 리소스

- **API 문서**: [https://docs.flood-info.example.com](https://docs.flood-info.example.com)
- **API 콘솔**: [https://console.flood-info.example.com](https://console.flood-info.example.com)
- **상태 페이지**: [https://status.flood-info.example.com](https://status.flood-info.example.com)

### 커뮤니티 및 지원

- **GitHub Issues**: [https://github.com/flood-info/issues](https://github.com/flood-info/issues)
- **이메일 지원**: support@flood-info.example.com
- **Slack 채널**: #flood-info-support
- **개발자 포럼**: [https://forum.flood-info.example.com](https://forum.flood-info.example.com)

### SLA 및 지원 정책

- **응답 시간**: 
  - 긴급 (P0): 1시간 이내
  - 높음 (P1): 4시간 이내
  - 보통 (P2): 24시간 이내
  - 낮음 (P3): 72시간 이내

- **지원 채널**:
  - 이메일: 24/7 접수
  - Slack: 업무시간 (9-18시, KST)
  - 전화: 긴급 상황만

## 📝 라이선스

이 API 문서는 MIT 라이선스 하에 제공됩니다.

```
MIT License

Copyright (c) 2023 Flood Info Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

**마지막 업데이트**: 2024년 1월 15일  
**문서 버전**: 1.2.0  
**API 버전**: 1.2.0