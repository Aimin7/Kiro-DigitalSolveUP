# AWS 설정 가이드

이 문서는 KIRO 홍수 정보 시스템을 AWS에 배포하기 위한 설정 가이드입니다.

## 🔐 AWS 자격 증명 설정

### 1. AWS CLI 설치

```bash
# macOS
brew install awscli

# Ubuntu/Debian
sudo apt-get install awscli

# Windows
# AWS CLI 설치 프로그램 다운로드 및 실행
```

### 2. AWS 자격 증명 설정

```bash
aws configure
```

다음 정보를 입력하세요:
- **AWS Access Key ID**: `YOUR_AWS_ACCESS_KEY_ID`
- **AWS Secret Access Key**: `YOUR_AWS_SECRET_ACCESS_KEY`
- **Default region name**: `ap-northeast-2` (서울 리전 권장)
- **Default output format**: `json`

### 3. 프로파일 설정 (선택사항)

여러 AWS 계정을 사용하는 경우:

```bash
aws configure --profile kiro-project
```

## 🏗️ 인프라 배포

### 1. S3 버킷 생성

```bash
aws cloudformation deploy \
  --template-file infrastructure/s3-bucket.yml \
  --stack-name kiro-flood-info-s3 \
  --parameter-overrides \
    Stage=prod \
    BucketName=kiro-flood-info-app \
  --region ap-northeast-2
```

### 2. DynamoDB 테이블 생성

```bash
aws cloudformation deploy \
  --template-file infrastructure/dynamodb-table.yml \
  --stack-name kiro-flood-info-db \
  --parameter-overrides \
    Stage=prod \
    TableName=kiro-flood-info-table \
  --region ap-northeast-2
```

### 3. Lambda 함수 배포 (선택사항)

```bash
# Lambda 함수가 있는 경우
cd lambda-functions
npm install
zip -r function.zip .
aws lambda create-function \
  --function-name kiro-flood-data-processor \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
  --handler index.handler \
  --zip-file fileb://function.zip
```

## 🌐 도메인 및 SSL 설정

### 1. Route 53 도메인 설정

```bash
# 호스팅 영역 생성
aws route53 create-hosted-zone \
  --name your-domain.com \
  --caller-reference $(date +%s)
```

### 2. CloudFront 배포

```bash
# CloudFront 배포 생성 (별도 템플릿 필요)
aws cloudformation deploy \
  --template-file infrastructure/cloudfront.yml \
  --stack-name kiro-cloudfront \
  --parameter-overrides \
    DomainName=your-domain.com \
    S3BucketName=kiro-flood-info-app-prod-YOUR_ACCOUNT_ID
```

## 🔑 IAM 권한 설정

### 필요한 IAM 정책

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::kiro-flood-info-app-*",
        "arn:aws:s3:::kiro-flood-info-app-*/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/kiro-flood-info-table-*",
        "arn:aws:dynamodb:*:*:table/kiro-flood-info-table-*/index/*"
      ]
    }
  ]
}
```

## 📊 모니터링 설정

### CloudWatch 알람 설정

```bash
# S3 버킷 모니터링
aws cloudwatch put-metric-alarm \
  --alarm-name "S3-HighRequestCount" \
  --alarm-description "S3 bucket high request count" \
  --metric-name NumberOfObjects \
  --namespace AWS/S3 \
  --statistic Average \
  --period 300 \
  --threshold 1000 \
  --comparison-operator GreaterThanThreshold

# DynamoDB 모니터링
aws cloudwatch put-metric-alarm \
  --alarm-name "DynamoDB-HighReadCapacity" \
  --alarm-description "DynamoDB high read capacity" \
  --metric-name ConsumedReadCapacityUnits \
  --namespace AWS/DynamoDB \
  --statistic Sum \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

## 🔒 보안 설정

### 1. S3 버킷 정책

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*",
      "Condition": {
        "StringEquals": {
          "aws:Referer": "https://your-domain.com/*"
        }
      }
    }
  ]
}
```

### 2. CloudFront 보안 헤더

```yaml
# CloudFormation 템플릿에 추가
ResponseHeadersPolicy:
  Type: AWS::CloudFront::ResponseHeadersPolicy
  Properties:
    ResponseHeadersPolicyConfig:
      Name: SecurityHeaders
      SecurityHeadersConfig:
        StrictTransportSecurity:
          AccessControlMaxAgeSec: 31536000
          IncludeSubdomains: true
        ContentTypeOptions:
          Override: true
        FrameOptions:
          FrameOption: DENY
          Override: true
        ReferrerPolicy:
          ReferrerPolicy: strict-origin-when-cross-origin
          Override: true
```

## 🚀 배포 자동화

### GitHub Actions 워크플로우

`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd frontend
          npm install
          
      - name: Build
        run: |
          cd frontend
          npm run build
          
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2
          
      - name: Deploy to S3
        run: |
          aws s3 sync frontend/dist/ s3://${{ secrets.S3_BUCKET_NAME }} --delete
          
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

## 💰 비용 최적화

### 1. S3 라이프사이클 정책

```json
{
  "Rules": [
    {
      "ID": "LogsLifecycle",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "logs/"
      },
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {
        "Days": 365
      }
    }
  ]
}
```

### 2. DynamoDB 자동 스케일링

```bash
aws application-autoscaling register-scalable-target \
  --service-namespace dynamodb \
  --resource-id "table/kiro-flood-info-table-prod" \
  --scalable-dimension "dynamodb:table:ReadCapacityUnits" \
  --min-capacity 1 \
  --max-capacity 10
```

## 🔍 문제 해결

### 일반적인 오류

1. **권한 오류**: IAM 정책 확인
2. **리전 불일치**: 모든 리소스가 같은 리전에 있는지 확인
3. **버킷 이름 중복**: 전역적으로 고유한 버킷 이름 사용
4. **CloudFormation 스택 오류**: 스택 이벤트 로그 확인

### 로그 확인

```bash
# CloudFormation 스택 이벤트
aws cloudformation describe-stack-events --stack-name kiro-flood-info-s3

# S3 액세스 로그
aws s3 ls s3://your-logs-bucket/access-logs/

# CloudWatch 로그
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/kiro"
```

## 📞 지원

AWS 관련 문제가 발생하면:
1. AWS 문서 확인
2. AWS 지원 센터 문의
3. 프로젝트 이슈 생성
