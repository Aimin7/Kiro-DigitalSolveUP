# 네이버 지도 API 설정 가이드

## 🚨 중요 공지

네이버 AI NAVER API 상품에서 제공되던 지도 API 서비스는 점진적으로 종료될 예정입니다.
기존 클라이언트 ID는 더 이상 작동하지 않으므로 새로운 네이버 지도 Open API를 사용해야 합니다.

## 새로운 네이버 지도 Open API 설정

### 1. 네이버 개발자 센터에서 새 애플리케이션 등록

1. [네이버 개발자 센터](https://developers.naver.com/) 접속
2. "Application" → "애플리케이션 등록" 클릭
3. 애플리케이션 정보 입력:
   - 애플리케이션 이름: `침수 정보 지도 앱`
   - 사용 API: `지도` 선택
   - 서비스 환경: `WEB` 선택
   - 서비스 URL: `http://localhost:3000` (개발용)

### 2. 클라이언트 ID 발급 및 설정

1. 애플리케이션 등록 완료 후 클라이언트 ID 확인
2. `frontend/.env.local` 파일에 새 클라이언트 ID 설정:

```bash
# 새로운 네이버 지도 Open API 클라이언트 ID
VITE_NAVER_MAP_CLIENT_ID=your_new_client_id_here
VITE_API_BASE_URL=http://localhost:3000
```

### 3. API 유형별 스크립트 URL

새로운 네이버 지도 Open API는 사용 목적에 따라 다른 매개변수를 사용합니다:

```html
<!-- 일반 용도 -->
<script src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_CLIENT_ID"></script>

<!-- 공공 기관 -->
<script src="https://oapi.map.naver.com/openapi/v3/maps.js?govClientId=YOUR_CLIENT_ID"></script>

<!-- 금융 기관 -->
<script src="https://oapi.map.naver.com/openapi/v3/maps.js?finClientId=YOUR_CLIENT_ID"></script>
```

현재 코드는 일반 용도(`ncpClientId`)로 설정되어 있습니다.

## 임시 해결책

새로운 클라이언트 ID를 발급받기 전까지는 목업 지도 컴포넌트를 사용할 수 있습니다:

- 메인 페이지 (`/`): 목업 지도 사용
- 네이버 지도 테스트 (`/naver`): 실제 네이버 지도 API 사용
- API 테스트 (`/test`): 네이버 지도 API 로드 테스트

## 문제 해결

### 1. 클라이언트 ID 인증 실패
- 새로운 네이버 개발자 센터에서 클라이언트 ID 재발급
- 서비스 URL이 현재 도메인과 일치하는지 확인

### 2. CORS 오류
- 네이버 개발자 센터에서 서비스 URL에 현재 도메인 추가
- 개발 환경: `http://localhost:3000`
- 배포 환경: 실제 도메인 주소

### 3. API 로드 실패
- 네트워크 연결 상태 확인
- 브라우저 개발자 도구에서 네트워크 탭 확인
- 콘솔에서 오류 메시지 확인

## 참고 링크

- [네이버 개발자 센터](https://developers.naver.com/)
- [네이버 지도 API 문서](https://navermaps.github.io/maps.js.ncp/)
- [네이버 지도 API 가이드](https://navermaps.github.io/maps.js.ncp/docs/tutorial-1-Getting-Started.html)