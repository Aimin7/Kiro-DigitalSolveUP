// Jest 테스트 환경 설정

// 환경 변수 설정
process.env.NODE_ENV = 'test';
process.env.STAGE = 'test';
process.env.REGION = 'ap-northeast-2';
process.env.DYNAMODB_TABLE_NAME = 'flood-info-backend-test-flood-data';
process.env.NAVER_CLIENT_ID = 'test-client-id';
process.env.NAVER_CLIENT_SECRET = 'test-client-secret';
process.env.HANRIVER_BASE_URL = 'http://211.188.52.85:9191';
process.env.HANRIVER_WATERLEVEL_ENDPOINT = '/waterlevelinfo/info.json';
process.env.HANRIVER_REALTIME_ENDPOINT = '/getWaterLevel1D/list/1D/1018683/20230701/20230930.json';
process.env.HANRIVER_FORECAST_ENDPOINT = '/fldfct/list/20230715.json';

// 전역 테스트 설정
global.console = {
  ...console,
  // 테스트 중 불필요한 로그 숨기기
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// 테스트 타임아웃 설정 (30초)
jest.setTimeout(30000);