// 환경 변수 설정 및 검증

const requiredEnvVars = [
  'STAGE',
  'REGION',
  'DYNAMODB_TABLE_NAME',
];

const optionalEnvVars = [
  'NAVER_CLIENT_ID',
  'NAVER_CLIENT_SECRET',
  'HANRIVER_BASE_URL',
  'HANRIVER_WATERLEVEL_ENDPOINT',
  'HANRIVER_REALTIME_ENDPOINT',
  'HANRIVER_FORECAST_ENDPOINT',
];

// 환경 변수 검증
function validateEnvironment() {
  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// 환경 변수 객체 생성
const environment = {
  // 기본 설정
  stage: process.env.STAGE,
  region: process.env.REGION,
  nodeEnv: process.env.NODE_ENV || 'production',
  
  // AWS 설정
  dynamodbTableName: process.env.DYNAMODB_TABLE_NAME,
  
  // 네이버 API 설정
  naver: {
    clientId: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
  },
  
  // 한강홍수통제소 API 설정
  hanriver: {
    baseUrl: process.env.HANRIVER_BASE_URL || 'http://211.188.52.85:9191',
    endpoints: {
      waterlevel: process.env.HANRIVER_WATERLEVEL_ENDPOINT || '/waterlevelinfo/info.json',
      realtime: process.env.HANRIVER_REALTIME_ENDPOINT || '/getWaterLevel1D/list/1D/1018683/20230701/20230930.json',
      forecast: process.env.HANRIVER_FORECAST_ENDPOINT || '/fldfct/list/20230715.json',
    },
  },
  
  // 개발 환경 여부
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
  isProduction: process.env.NODE_ENV === 'production',
  isOffline: process.env.IS_OFFLINE === 'true',
};

// 환경 변수 검증 실행 (테스트 환경 제외)
if (!environment.isTest) {
  validateEnvironment();
}

module.exports = environment;