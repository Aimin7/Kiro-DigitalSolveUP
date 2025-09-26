const AWS = require('aws-sdk');

// AWS 설정
const awsConfig = {
  region: process.env.REGION || 'ap-northeast-2',
};

// 로컬 개발 환경에서는 DynamoDB Local 사용
if (process.env.NODE_ENV === 'development' || process.env.IS_OFFLINE) {
  awsConfig.endpoint = 'http://localhost:8000';
  awsConfig.accessKeyId = 'local';
  awsConfig.secretAccessKey = 'local';
}

AWS.config.update(awsConfig);

// DynamoDB 클라이언트 생성
const dynamodb = new AWS.DynamoDB.DocumentClient();

// S3 클라이언트 생성 (필요시)
const s3 = new AWS.S3();

// Lambda 클라이언트 생성 (필요시)
const lambda = new AWS.Lambda();

module.exports = {
  AWS,
  dynamodb,
  s3,
  lambda,
  awsConfig,
};