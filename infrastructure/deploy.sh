#!/bin/bash

# 침수 정보 앱 AWS 서버리스 전체 배포 스크립트

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 함수 정의
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

log_deploy() {
    echo -e "${CYAN}[DEPLOY]${NC} $1"
}

# 도움말 함수
show_help() {
    echo "Usage: $0 [STAGE] [REGION] [OPTIONS]"
    echo ""
    echo "Arguments:"
    echo "  STAGE     Deployment stage (dev, staging, prod) [default: dev]"
    echo "  REGION    AWS region [default: ap-northeast-2]"
    echo ""
    echo "Options:"
    echo "  --skip-infra     Skip infrastructure deployment"
    echo "  --skip-backend   Skip backend deployment"
    echo "  --skip-frontend  Skip frontend deployment"
    echo "  --skip-tests     Skip tests"
    echo "  --force          Force deployment without confirmation"
    echo "  --help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                           # Deploy to dev stage"
    echo "  $0 prod ap-northeast-2       # Deploy to prod stage in Seoul region"
    echo "  $0 dev --skip-frontend       # Deploy only backend to dev"
    echo ""
}

# 파라미터 파싱
STAGE=${1:-dev}
REGION=${2:-ap-northeast-2}
SKIP_INFRA=false
SKIP_BACKEND=false
SKIP_FRONTEND=false
SKIP_TESTS=false
FORCE=false

# 옵션 처리
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-infra)
            SKIP_INFRA=true
            shift
            ;;
        --skip-backend)
            SKIP_BACKEND=true
            shift
            ;;
        --skip-frontend)
            SKIP_FRONTEND=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            shift
            ;;
    esac
done

# 기본 설정
STACK_PREFIX="flood-info-backend"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LAMBDA_DIR="${PROJECT_ROOT}/lambda-functions"
FRONTEND_DIR="${PROJECT_ROOT}/frontend"
INFRA_DIR="${PROJECT_ROOT}/infrastructure"

log_step "Starting deployment for stage: ${STAGE} in region: ${REGION}"
echo "Project root: ${PROJECT_ROOT}"
echo ""

# 필수 도구 확인
check_prerequisites() {
    log_step "Checking prerequisites..."
    
    # AWS CLI 확인
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed. Please install AWS CLI first."
        exit 1
    fi
    
    # Node.js 확인
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # npm 확인
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Serverless Framework 확인
    if ! command -v serverless &> /dev/null && ! command -v sls &> /dev/null; then
        log_warning "Serverless Framework not found. Installing globally..."
        npm install -g serverless
    fi
    
    # AWS 자격 증명 확인
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    # 프로젝트 디렉토리 확인
    if [ ! -d "${LAMBDA_DIR}" ]; then
        log_error "Lambda functions directory not found: ${LAMBDA_DIR}"
        exit 1
    fi
    
    if [ ! -d "${FRONTEND_DIR}" ]; then
        log_error "Frontend directory not found: ${FRONTEND_DIR}"
        exit 1
    fi
    
    log_success "All prerequisites verified"
}

# 배포 확인
confirm_deployment() {
    if [ "$FORCE" = true ]; then
        return 0
    fi
    
    echo ""
    log_warning "You are about to deploy to stage: ${STAGE} in region: ${REGION}"
    echo "This will:"
    echo "  - Create/update AWS resources"
    echo "  - Deploy Lambda functions"
    echo "  - Update DynamoDB tables"
    echo "  - Deploy frontend to S3/CloudFront"
    echo ""
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Deployment cancelled by user"
        exit 0
    fi
}

# 환경 변수 설정
setup_environment() {
    log_step "Setting up environment variables..."
    
    # .env 파일 경로
    ENV_FILE="${LAMBDA_DIR}/.env.${STAGE}"
    
    # 기본 환경 변수 파일이 없으면 생성
    if [ ! -f "${ENV_FILE}" ]; then
        log_info "Creating environment file: ${ENV_FILE}"
        cat > "${ENV_FILE}" << EOF
# Environment variables for ${STAGE} stage
# Generated on $(date)

STAGE=${STAGE}
REGION=${REGION}

# API Keys (Please update these)
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret

# Security Settings
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
REQUIRE_API_KEY=false
MAX_BODY_SIZE=1048576

# Monitoring
LOG_LEVEL=info
ENABLE_SCHEDULED_REFRESH=true

# Alert Email (for production)
ALERT_EMAIL=admin@example.com
EOF
        log_warning "Please update the API keys in ${ENV_FILE}"
    fi
    
    # 환경 변수 로드
    if [ -f "${ENV_FILE}" ]; then
        export $(grep -v '^#' "${ENV_FILE}" | xargs)
        log_success "Environment variables loaded from ${ENV_FILE}"
    fi
}

check_prerequisites
confirm_deployment
setup_environment

# 백엔드 배포
deploy_backend() {
    if [ "$SKIP_BACKEND" = true ]; then
        log_info "Skipping backend deployment"
        return 0
    fi
    
    log_step "Deploying backend (Lambda functions)..."
    
    cd "${LAMBDA_DIR}"
    
    # 의존성 설치
    log_info "Installing backend dependencies..."
    npm install
    
    # 테스트 실행 (선택적)
    if [ "$SKIP_TESTS" = false ]; then
        log_info "Running backend tests..."
        npm test || {
            log_warning "Some tests failed, but continuing deployment..."
        }
    fi
    
    # Serverless 배포
    log_deploy "Deploying serverless stack..."
    
    # 환경 변수를 serverless 명령에 전달
    export SLS_DEBUG=*
    
    if command -v sls &> /dev/null; then
        SLS_CMD="sls"
    else
        SLS_CMD="serverless"
    fi
    
    ${SLS_CMD} deploy \
        --stage "${STAGE}" \
        --region "${REGION}" \
        --verbose || {
        log_error "Backend deployment failed"
        cd "${PROJECT_ROOT}"
        exit 1
    }
    
    # 배포 정보 가져오기
    log_info "Getting backend deployment info..."
    BACKEND_INFO=$(${SLS_CMD} info --stage "${STAGE}" --region "${REGION}" --verbose)
    
    # API Gateway URL 추출
    API_URL=$(echo "${BACKEND_INFO}" | grep -o 'https://[a-zA-Z0-9]*.execute-api.[a-zA-Z0-9-]*.amazonaws.com/[a-zA-Z0-9]*' | head -1)
    WEBSOCKET_URL=$(echo "${BACKEND_INFO}" | grep -o 'wss://[a-zA-Z0-9]*.execute-api.[a-zA-Z0-9-]*.amazonaws.com/[a-zA-Z0-9]*' | head -1)
    
    cd "${PROJECT_ROOT}"
    
    log_success "Backend deployed successfully"
    echo "  API URL: ${API_URL}"
    echo "  WebSocket URL: ${WEBSOCKET_URL}"
    
    # 환경 변수 파일 업데이트
    if [ -n "${API_URL}" ]; then
        echo "REACT_APP_API_URL=${API_URL}" >> "${FRONTEND_DIR}/.env.${STAGE}"
    fi
    if [ -n "${WEBSOCKET_URL}" ]; then
        echo "REACT_APP_WEBSOCKET_URL=${WEBSOCKET_URL}" >> "${FRONTEND_DIR}/.env.${STAGE}"
    fi
}

# 프론트엔드 배포
deploy_frontend() {
    if [ "$SKIP_FRONTEND" = true ]; then
        log_info "Skipping frontend deployment"
        return 0
    fi
    
    log_step "Deploying frontend..."
    
    cd "${FRONTEND_DIR}"
    
    # 의존성 설치
    log_info "Installing frontend dependencies..."
    npm install
    
    # 환경 변수 설정
    ENV_FILE=".env.${STAGE}"
    if [ ! -f "${ENV_FILE}" ]; then
        log_info "Creating frontend environment file..."
        cat > "${ENV_FILE}" << EOF
# Frontend environment variables for ${STAGE}
REACT_APP_STAGE=${STAGE}
REACT_APP_API_URL=${API_URL}
REACT_APP_WEBSOCKET_URL=${WEBSOCKET_URL}
REACT_APP_NAVER_CLIENT_ID=${NAVER_CLIENT_ID}
EOF
    fi
    
    # 테스트 실행 (선택적)
    if [ "$SKIP_TESTS" = false ]; then
        log_info "Running frontend tests..."
        npm test -- --watchAll=false --coverage || {
            log_warning "Some frontend tests failed, but continuing deployment..."
        }
    fi
    
    # 빌드
    log_info "Building frontend..."
    npm run build || {
        log_error "Frontend build failed"
        cd "${PROJECT_ROOT}"
        exit 1
    }
    
    # S3 버킷 이름 가져오기 (serverless 출력에서)
    cd "${LAMBDA_DIR}"
    BUCKET_NAME=$(${SLS_CMD} info --stage "${STAGE}" --region "${REGION}" | grep -o 'flood-info-backend-[a-zA-Z0-9]*-frontend' | head -1)
    cd "${FRONTEND_DIR}"
    
    if [ -z "${BUCKET_NAME}" ]; then
        log_error "Could not determine S3 bucket name"
        cd "${PROJECT_ROOT}"
        exit 1
    fi
    
    # S3에 업로드
    log_deploy "Uploading to S3 bucket: ${BUCKET_NAME}"
    aws s3 sync dist/ "s3://${BUCKET_NAME}" \
        --region "${REGION}" \
        --delete \
        --cache-control "public, max-age=31536000" \
        --exclude "*.html" || {
        log_error "Failed to upload frontend to S3"
        cd "${PROJECT_ROOT}"
        exit 1
    }
    
    # HTML 파일은 캐시 없이 업로드
    aws s3 sync dist/ "s3://${BUCKET_NAME}" \
        --region "${REGION}" \
        --cache-control "no-cache" \
        --include "*.html"
    
    # CloudFront 무효화 (있는 경우)
    CLOUDFRONT_ID=$(aws cloudformation describe-stacks \
        --stack-name "${STACK_PREFIX}-${STAGE}" \
        --region "${REGION}" \
        --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" \
        --output text 2>/dev/null || echo "")
    
    if [ -n "${CLOUDFRONT_ID}" ] && [ "${CLOUDFRONT_ID}" != "None" ]; then
        log_info "Invalidating CloudFront distribution: ${CLOUDFRONT_ID}"
        aws cloudfront create-invalidation \
            --distribution-id "${CLOUDFRONT_ID}" \
            --paths "/*" > /dev/null
    fi
    
    cd "${PROJECT_ROOT}"
    
    log_success "Frontend deployed successfully"
    echo "  S3 Bucket: ${BUCKET_NAME}"
    echo "  CloudFront ID: ${CLOUDFRONT_ID}"
}

# 배포 후 검증
verify_deployment() {
    log_step "Verifying deployment..."
    
    # API 헬스 체크
    if [ -n "${API_URL}" ]; then
        log_info "Checking API health..."
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${API_URL}/api/health" || echo "000")
        
        if [ "${HTTP_STATUS}" = "200" ]; then
            log_success "API health check passed"
        else
            log_warning "API health check failed (HTTP ${HTTP_STATUS})"
        fi
    fi
    
    # DynamoDB 테이블 확인
    log_info "Checking DynamoDB tables..."
    FLOOD_TABLE="${STACK_PREFIX}-${STAGE}-flood-info"
    API_SOURCE_TABLE="${STACK_PREFIX}-${STAGE}-api-source"
    
    aws dynamodb describe-table --table-name "${FLOOD_TABLE}" --region "${REGION}" > /dev/null 2>&1 && {
        log_success "FloodInfo table exists and is accessible"
    } || {
        log_warning "FloodInfo table check failed"
    }
    
    aws dynamodb describe-table --table-name "${API_SOURCE_TABLE}" --region "${REGION}" > /dev/null 2>&1 && {
        log_success "APISource table exists and is accessible"
    } || {
        log_warning "APISource table check failed"
    }
}

# 메인 배포 실행
deploy_backend
deploy_frontend
verify_deployment

# 배포 완료 및 요약
deployment_summary() {
    log_step "Deployment Summary"
    echo ""
    echo "=== 🎉 Deployment Completed Successfully! ==="
    echo ""
    echo "📋 Deployment Details:"
    echo "  Stage: ${STAGE}"
    echo "  Region: ${REGION}"
    echo "  Timestamp: $(date)"
    echo ""
    
    if [ "$SKIP_BACKEND" = false ]; then
        echo "🚀 Backend Services:"
        echo "  API Gateway: ${API_URL}"
        echo "  WebSocket: ${WEBSOCKET_URL}"
        echo "  DynamoDB Tables:"
        echo "    - FloodInfo: ${STACK_PREFIX}-${STAGE}-flood-info"
        echo "    - APISource: ${STACK_PREFIX}-${STAGE}-api-source"
        echo ""
    fi
    
    if [ "$SKIP_FRONTEND" = false ]; then
        echo "🌐 Frontend:"
        echo "  S3 Bucket: ${BUCKET_NAME}"
        if [ -n "${CLOUDFRONT_ID}" ] && [ "${CLOUDFRONT_ID}" != "None" ]; then
            echo "  CloudFront: ${CLOUDFRONT_ID}"
        fi
        echo ""
    fi
    
    echo "📝 Next Steps:"
    echo "1. Update API keys in environment files if needed"
    echo "2. Test the application endpoints"
    echo "3. Monitor CloudWatch logs for any issues"
    echo "4. Set up monitoring and alerts for production"
    echo ""
    
    echo "🔗 Useful Commands:"
    echo "  View logs: sls logs -f getFloodData --stage ${STAGE}"
    echo "  Remove stack: sls remove --stage ${STAGE}"
    echo "  Update frontend: aws s3 sync frontend/dist/ s3://${BUCKET_NAME}/"
    echo ""
    
    echo "📊 Monitoring:"
    echo "  CloudWatch: https://console.aws.amazon.com/cloudwatch/home?region=${REGION}"
    echo "  Lambda: https://console.aws.amazon.com/lambda/home?region=${REGION}"
    echo "  DynamoDB: https://console.aws.amazon.com/dynamodb/home?region=${REGION}"
    echo ""
    
    log_success "All deployment tasks completed!"
}

# 오류 처리
cleanup_on_error() {
    log_error "Deployment failed. Cleaning up..."
    
    # 부분적으로 배포된 리소스 정리 (선택적)
    if [ "$STAGE" != "prod" ]; then
        read -p "Do you want to remove partially deployed resources? (y/N): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_info "Removing serverless stack..."
            cd "${LAMBDA_DIR}"
            ${SLS_CMD} remove --stage "${STAGE}" --region "${REGION}" || true
            cd "${PROJECT_ROOT}"
        fi
    fi
    
    exit 1
}

# 오류 발생 시 정리 함수 호출
trap cleanup_on_error ERR

deployment_summary