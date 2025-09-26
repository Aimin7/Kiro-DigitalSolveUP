# 🔒 보안 체크리스트

GitHub에 코드를 공개하기 전에 반드시 확인해야 할 보안 사항들입니다.

## ✅ 완료된 보안 조치

### 1. 환경 변수 보호
- [x] `.env.local` 파일 삭제
- [x] `.env.local.template` 파일로 대체
- [x] `.gitignore`에 환경 변수 파일들 추가
- [x] 모든 API 키를 대체 문구로 변경

### 2. API 키 대체
- [x] 네이버 지도 API 클라이언트 ID → `YOUR_NAVER_MAP_CLIENT_ID_HERE`
- [x] AWS API Gateway URL → `YOUR_API_GATEWAY_URL`
- [x] 공공 데이터 API 키들 → `YOUR_*_API_KEY_HERE`

### 3. 문서화
- [x] README.md 작성 (설치 및 설정 가이드)
- [x] AWS_SETUP_GUIDE.md 작성
- [x] NAVER_API_SETUP.md 작성
- [x] PUBLIC_DATA_API_SETUP.md 작성
- [x] 보안 체크리스트 작성

## 🔍 추가 확인 필요 사항

### 1. 코드 내 하드코딩된 값 확인

다음 명령어로 민감한 정보가 하드코딩되어 있는지 확인하세요:

```bash
# API 키 패턴 검색
grep -r -i "key.*=" --include="*.js" --include="*.ts" --exclude-dir=node_modules .

# 시크릿 패턴 검색  
grep -r -i "secret.*=" --include="*.js" --include="*.ts" --exclude-dir=node_modules .

# 토큰 패턴 검색
grep -r -i "token.*=" --include="*.js" --include="*.ts" --exclude-dir=node_modules .

# 패스워드 패턴 검색
grep -r -i "password.*=" --include="*.js" --include="*.ts" --exclude-dir=node_modules .
```

### 2. AWS 관련 정보 확인

```bash
# AWS 계정 ID 검색
grep -r "aws.*account" --include="*.yml" --include="*.yaml" --include="*.json" .

# AWS 리전 하드코딩 확인
grep -r "ap-northeast" --include="*.yml" --include="*.yaml" --include="*.json" .

# S3 버킷명 확인
grep -r "s3://" --include="*.yml" --include="*.yaml" --include="*.sh" .
```

### 3. 데이터베이스 연결 정보

```bash
# 데이터베이스 URL 검색
grep -r -i "database.*url" --include="*.js" --include="*.json" .

# 연결 문자열 검색
grep -r -i "connection.*string" --include="*.js" --include="*.json" .
```

## 🛡️ 보안 모범 사례

### 1. 환경 변수 관리

```javascript
// ✅ 올바른 방법
const apiKey = process.env.NAVER_API_KEY || import.meta.env.VITE_NAVER_MAP_CLIENT_ID
if (!apiKey) {
  throw new Error('API 키가 설정되지 않았습니다.')
}

// ❌ 잘못된 방법
const apiKey = "your_actual_api_key_here"
```

### 2. 민감한 정보 검증

```javascript
// API 키 형식 검증
const validateApiKey = (key, keyName) => {
  if (!key || key.includes('YOUR_') || key.includes('EXAMPLE')) {
    console.error(`${keyName} API 키가 올바르게 설정되지 않았습니다.`)
    return false
  }
  return true
}
```

### 3. 에러 메시지에서 정보 노출 방지

```javascript
// ✅ 올바른 방법
try {
  const response = await fetch(apiUrl)
  // ...
} catch (error) {
  console.error('API 호출 실패')
  // 상세 오류는 개발 환경에서만 표시
  if (process.env.NODE_ENV === 'development') {
    console.error(error)
  }
}

// ❌ 잘못된 방법
try {
  const response = await fetch(apiUrl)
  // ...
} catch (error) {
  alert(`API 호출 실패: ${error.message}`) // API URL이나 키 정보 노출 위험
}
```

## 📋 GitHub 공개 전 최종 체크리스트

### 파일 확인
- [ ] `.env*` 파일들이 `.gitignore`에 포함되어 있는가?
- [ ] 실제 API 키가 포함된 파일이 없는가?
- [ ] AWS 자격 증명이 하드코딩되어 있지 않은가?
- [ ] 데이터베이스 연결 정보가 노출되어 있지 않은가?

### 코드 확인
- [ ] 모든 민감한 정보가 환경 변수로 처리되는가?
- [ ] API 키 검증 로직이 있는가?
- [ ] 에러 처리에서 민감한 정보가 노출되지 않는가?
- [ ] 개발용 주석이나 TODO에 민감한 정보가 없는가?

### 문서 확인
- [ ] README.md에 설치 및 설정 가이드가 있는가?
- [ ] API 키 발급 방법이 문서화되어 있는가?
- [ ] 보안 주의사항이 명시되어 있는가?
- [ ] 라이선스 정보가 포함되어 있는가?

### 설정 파일 확인
- [ ] `.gitignore`가 적절히 설정되어 있는가?
- [ ] `package.json`에 민감한 정보가 없는가?
- [ ] 빌드 스크립트에 민감한 정보가 없는가?

## 🚨 긴급 상황 대응

### API 키가 실수로 노출된 경우

1. **즉시 조치**
   ```bash
   # 해당 커밋 되돌리기
   git reset --hard HEAD~1
   
   # 강제 푸시 (주의: 협업 시 팀원과 협의 필요)
   git push --force-with-lease
   ```

2. **API 키 재발급**
   - 네이버 개발자 센터에서 기존 키 삭제 후 새 키 발급
   - AWS에서 액세스 키 비활성화 후 새 키 생성
   - 민관협력지원플랫폼에서 키 재발급 신청

3. **Git 히스토리 정리**
   ```bash
   # BFG Repo-Cleaner 사용 (권장)
   java -jar bfg.jar --replace-text passwords.txt
   git reflog expire --expire=now --all && git gc --prune=now --aggressive
   ```

### 보안 취약점 발견 시

1. **이슈 생성** (보안 관련은 비공개로)
2. **패치 개발 및 테스트**
3. **보안 업데이트 배포**
4. **사용자 공지**

## 📞 보안 문의

보안 관련 문제나 취약점을 발견하신 경우:

1. **GitHub Issues** (일반적인 보안 질문)
2. **Security Advisory** (심각한 보안 취약점)
3. **이메일 문의** (비공개 보안 이슈)

## 📚 추가 자료

- [GitHub 보안 가이드](https://docs.github.com/en/code-security)
- [OWASP 보안 체크리스트](https://owasp.org/www-project-web-security-testing-guide/)
- [Node.js 보안 모범 사례](https://nodejs.org/en/docs/guides/security/)
- [AWS 보안 모범 사례](https://aws.amazon.com/security/security-resources/)

---

**⚠️ 중요**: 이 체크리스트의 모든 항목을 확인한 후에만 GitHub에 코드를 공개하세요.
