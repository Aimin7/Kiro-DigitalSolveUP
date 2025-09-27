# 보안 설정 가이드

이 프로젝트를 실행하기 전에 다음 민감한 정보들을 실제 값으로 설정해야 합니다.

## 🔐 필수 설정 항목

### 1. 네이버 지도 API 키 설정

#### 네이버 개발자 센터에서 API 키 발급
1. [네이버 개발자 센터](https://developers.naver.com/) 접속
2. 애플리케이션 등록
3. Maps API 서비스 추가
4. Client ID와 Client Secret 발급

#### 환경 변수 파일 설정
다음 파일들에서 `YOUR_NAVER_CLIENT_ID_HERE`와 `YOUR_NAVER_CLIENT_SECRET_HERE`를 실제 값으로 변경:

```bash
# Lambda 함수 환경 변수
./lambda-functions/.env
./lambda-functions/.env.prod

# 프론트엔드 환경 변수
./frontend/.env.local (새로 생성)
```

#### 프론트엔드 환경 변수 설정
```bash
# frontend/.env.local 파일 생성
cp frontend/.env.local.template frontend/.env.local

# 실제 값으로 수정
VITE_NAVER_MAP_CLIENT_ID=실제_네이버_클라이언트_ID
VITE_API_BASE_URL=실제_API_게이트웨이_URL
```

### 2. AWS 리소스 이름 설정

#### S3 버킷 이름 변경
다음 파일들에서 `YOUR-S3-BUCKET-NAME`을 실제 버킷명으로 변경:
- `bucket-policy.json`
- `cloudfront-config.json`
- `cloudfront-template.json`

#### API Gateway URL 설정
Lambda 함수 배포 후 생성되는 API Gateway URL을 다음 파일들에 설정:
- `frontend/.env.local`
- `frontend/.env.local.template`

### 3. 테스트 파일 설정

다음 HTML 테스트 파일들에서 `YOUR_NAVER_CLIENT_ID_HERE`를 실제 값으로 변경:
- `test-naver-api.html`
- `test-naver-map.html`

## 🚀 배포 순서

1. **환경 변수 설정 완료 확인**
2. **Lambda 함수 배포**
   ```bash
   cd lambda-functions
   npm install
   serverless deploy
   ```
3. **API Gateway URL 확인 및 프론트엔드 환경 변수 업데이트**
4. **프론트엔드 빌드 및 S3 배포**
   ```bash
   cd frontend
   npm install
   npm run build
   aws s3 sync dist/ s3://your-bucket-name/
   ```

## ⚠️ 보안 주의사항

- **절대로 실제 API 키를 Git에 커밋하지 마세요**
- 환경 변수 파일들은 `.gitignore`에 포함되어 있습니다
- 프로덕션 환경에서는 AWS Secrets Manager 사용을 권장합니다
- API 키는 필요한 권한만 부여하고 정기적으로 갱신하세요

## 🔍 설정 확인 방법

### 네이버 지도 API 테스트
```bash
# 브라우저에서 테스트 파일 열기
open test-naver-map.html
```

### API 연결 테스트
```bash
# API 헬스 체크
curl https://your-api-gateway-url/dev/api/health
```

## 📞 문제 해결

설정 중 문제가 발생하면 다음을 확인하세요:

1. **API 키 형식 확인**: 네이버 개발자 센터에서 발급받은 정확한 키인지 확인
2. **도메인 등록**: 네이버 개발자 센터에서 사용할 도메인이 등록되어 있는지 확인
3. **AWS 권한**: Lambda 함수와 S3 버킷에 필요한 권한이 설정되어 있는지 확인
4. **CORS 설정**: API Gateway에서 CORS가 올바르게 설정되어 있는지 확인

---

**중요**: 이 가이드를 따라 설정을 완료한 후에만 애플리케이션이 정상적으로 작동합니다.
