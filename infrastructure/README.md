# 침수 정보 앱 AWS 인프라

AWS CloudFormation을 사용한 서버리스 인프라 구성

## 아키텍처 개요

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   사용자        │    │   AWS S3         │    │  AWS Lambda     │
│   (브라우저)    │◄──►│  (정적 호스팅)   │◄──►│  (API 서버)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │  AWS DynamoDB   │
                                               │  (데이터 저장)  │
                                               └─────────────────┘
```

## 구성 요소

### 1. DynamoDB 테이블
- **FloodDataTable**: 침수 정보 메인 테이블
- **APISourceTable**: API 소스 관리 테이블

### 2. S3 버킷
- **WebsiteBucket**: 정적 웹사이트 호스팅
- **LogsBucket**: 로그 저장 (선택사항)

### 3. Lambda 함수 (Serverless Framework로 관리)
- 침수 데이터 API
- 경로 안내 API
- 네이버 API 연동

## 배포 방법

### 사전 요구사항

1. **AWS CLI 설치 및 설정**
```bash
# AWS CLI 설치 (Windows)
winget install Amazon.AWSCLI

# 자격 증명 설정
aws configure
```

2. **필요한 권한**
- CloudFormation 스택 생성/수정/삭제
- DynamoDB 테이블 생성/관리
- S3 버킷 생성/관리
- IAM 역할 생성 (Lambda 실행용)

### 배포 실행

#### Linux/macOS
```bash
cd infrastructure
chmod +x deploy.sh
./deploy.sh [stage] [region]

# 예시
./deploy.sh dev ap-northeast-2
./deploy.sh prod ap-northeast-2
```

#### Windows PowerShell
```powershell
cd infrastructure
.\deploy.ps1 -Stage dev -Region ap-northeast-2

# 또는
.\deploy.ps1 -Stage prod -Region ap-northeast-2
```

### 배포 단계별 설명

1. **DynamoDB 스택 배포**
   - 침수 데이터 테이블 생성
   - API 소스 관리 테이블 생성
   - 필요한 인덱스 설정

2. **S3 스택 배포**
   - 정적 웹사이트 호스팅 버킷 생성
   - 퍼블릭 액세스 정책 설정
   - 로그 저장 버킷 생성

3. **환경 변수 파일 생성**
   - Lambda 함수용 환경 변수 파일 자동 생성
   - API 키는 수동으로 추가 필요

## 리소스 상세

### DynamoDB 테이블 구조

#### FloodDataTable
```
Primary Key: id (String)
Attributes:
- locationId (String) - 위치 식별자
- apiType (String) - API 타입 (waterlevel/realtime/forecast)
- latitude (Number) - 위도
- longitude (Number) - 경도
- timestamp (String) - 타임스탬프
- status (String) - 상태 (active/resolved)
- data (Map) - 실제 데이터

Global Secondary Indexes:
- LocationIndex: locationId + timestamp
- APITypeIndex: apiType + timestamp
- StatusIndex: status + timestamp
```

#### APISourceTable
```
Primary Key: id (String)
Attributes:
- apiType (String) - API 타입
- name (String) - API 이름
- endpoint (String) - API 엔드포인트
- lastUpdated (String) - 마지막 업데이트
- isActive (Boolean) - 활성 상태

Global Secondary Indexes:
- APITypeIndex: apiType + lastUpdated
```

### S3 버킷 설정

#### WebsiteBucket
- **정적 웹사이트 호스팅**: 활성화
- **인덱스 문서**: index.html
- **에러 문서**: error.html
- **퍼블릭 액세스**: 읽기 전용 허용
- **CORS**: 모든 오리진 허용

#### LogsBucket
- **라이프사이클 정책**: 30일 후 자동 삭제
- **퍼블릭 액세스**: 차단
- **버전 관리**: 비활성화

## 비용 최적화

### 예상 월 비용 (프리티어 활용)

| 서비스 | 사용량 | 예상 비용 |
|--------|--------|-----------|
| DynamoDB | 25GB, 200만 요청 | $0 (프리티어) |
| S3 | 5GB 저장, 2만 요청 | $0.12 |
| Lambda | 100만 요청, 1GB-초 | $0 (프리티어) |
| API Gateway | 100만 요청 | $3.50 |
| **총계** | | **$3.62/월** |

### 비용 절약 팁

1. **DynamoDB On-Demand**: 예측 불가능한 트래픽에 적합
2. **S3 Intelligent Tiering**: 자동 비용 최적화
3. **Lambda 메모리 최적화**: 128MB-256MB 권장
4. **CloudWatch 로그 보존 기간**: 7-14일 설정

## 모니터링 및 알림

### CloudWatch 메트릭
- DynamoDB 읽기/쓰기 용량
- Lambda 실행 시간 및 오류율
- S3 요청 수 및 데이터 전송량

### 알림 설정 (선택사항)
```bash
# SNS 토픽 생성
aws sns create-topic --name flood-info-alerts

# CloudWatch 알람 생성
aws cloudwatch put-metric-alarm \
  --alarm-name "Lambda-Error-Rate" \
  --alarm-description "Lambda error rate too high" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold
```

## 보안 고려사항

### IAM 정책
- 최소 권한 원칙 적용
- Lambda 실행 역할 분리
- API Gateway 인증 (필요시)

### 네트워크 보안
- S3 버킷 정책으로 액세스 제어
- DynamoDB VPC 엔드포인트 (선택사항)
- Lambda 환경 변수 암호화

### 데이터 보호
- DynamoDB 암호화 활성화
- S3 버킷 암호화 설정
- 백업 및 복구 계획

## 문제 해결

### 일반적인 오류

1. **권한 부족**
```bash
# IAM 정책 확인
aws iam get-user-policy --user-name your-username --policy-name your-policy
```

2. **스택 배포 실패**
```bash
# CloudFormation 이벤트 확인
aws cloudformation describe-stack-events --stack-name flood-info-app-dynamodb-dev
```

3. **리소스 한도 초과**
```bash
# 서비스 한도 확인
aws service-quotas get-service-quota --service-code dynamodb --quota-code L-F98FE922
```

### 로그 확인
```bash
# CloudFormation 스택 상태
aws cloudformation describe-stacks --stack-name your-stack-name

# DynamoDB 테이블 상태
aws dynamodb describe-table --table-name your-table-name

# S3 버킷 정책
aws s3api get-bucket-policy --bucket your-bucket-name
```

## 정리 (Clean Up)

### 리소스 삭제
```bash
# CloudFormation 스택 삭제
aws cloudformation delete-stack --stack-name flood-info-app-s3-dev
aws cloudformation delete-stack --stack-name flood-info-app-dynamodb-dev

# S3 버킷 내용 삭제 (필요시)
aws s3 rm s3://your-bucket-name --recursive
```

### 주의사항
- DynamoDB 테이블 삭제 시 데이터 손실
- S3 버킷 삭제 전 모든 객체 삭제 필요
- Lambda 함수는 Serverless Framework로 별도 관리

## 참고 자료

- [AWS CloudFormation 사용자 가이드](https://docs.aws.amazon.com/cloudformation/)
- [DynamoDB 개발자 가이드](https://docs.aws.amazon.com/dynamodb/)
- [S3 사용자 가이드](https://docs.aws.amazon.com/s3/)
- [AWS 프리티어](https://aws.amazon.com/free/)