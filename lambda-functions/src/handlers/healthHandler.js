// healthHandler.js
// 헬스 체크 및 시스템 상태 조회 Lambda 함수

const { success, error: errorResponse } = require('../utils/response');
const { info, error, debug } = require('../utils/logger');
const { dynamoDBConfig } = require('../config/dynamodb');
const { errorHandler } = require('../middleware/errorHandler');
const { securityMiddleware } = require('../middleware/security');

/**
 * 기본 헬스 체크
 * @param {Object} event - Lambda 이벤트
 * @param {Object} context - Lambda 컨텍스트
 * @returns {Promise<Object>} HTTP 응답
 */
exports.healthCheck = async (event, context) => {
  try {
    debug('Health check requested', {
      requestId: context.awsRequestId,
      userAgent: event.headers?.['User-Agent'],
    });

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'flood-info-backend',
      version: process.env.npm_package_version || '1.0.0',
      stage: process.env.STAGE || 'dev',
      region: process.env.REGION || 'ap-northeast-2',
      requestId: context.awsRequestId,
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        limit: parseInt(context.memoryLimitInMB),
      },
      lambda: {
        functionName: context.functionName,
        functionVersion: context.functionVersion,
        remainingTime: context.getRemainingTimeInMillis(),
      },
    };

    info('Health check completed', {
      requestId: context.awsRequestId,
      status: healthStatus.status,
    });

    return success(healthStatus);
  } catch (err) {
    error('Health check failed', err, {
      requestId: context.awsRequestId,
    });

    return errorResponse('Health check failed');
  }
};

/**
 * 상세 시스템 상태 조회
 * @param {Object} event - Lambda 이벤트
 * @param {Object} context - Lambda 컨텍스트
 * @returns {Promise<Object>} HTTP 응답
 */
exports.getSystemStatus = async (event, context) => {
  try {
    debug('System status requested', {
      requestId: context.awsRequestId,
    });

    const startTime = Date.now();

    // 병렬로 각 컴포넌트 상태 확인
    const [
      databaseHealth,
      errorHandlerHealth,
      securityHealth,
      environmentHealth,
    ] = await Promise.allSettled([
      checkDatabaseHealth(),
      checkErrorHandlerHealth(),
      checkSecurityHealth(),
      checkEnvironmentHealth(),
    ]);

    const systemStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'flood-info-backend',
      version: process.env.npm_package_version || '1.0.0',
      stage: process.env.STAGE || 'dev',
      region: process.env.REGION || 'ap-northeast-2',
      requestId: context.awsRequestId,
      checkDuration: Date.now() - startTime,
      components: {
        database: getHealthResult(databaseHealth),
        errorHandler: getHealthResult(errorHandlerHealth),
        security: getHealthResult(securityHealth),
        environment: getHealthResult(environmentHealth),
      },
      system: {
        uptime: process.uptime(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          limit: parseInt(context.memoryLimitInMB),
          usage: Math.round((process.memoryUsage().heapUsed / (parseInt(context.memoryLimitInMB) * 1024 * 1024)) * 100),
        },
        lambda: {
          functionName: context.functionName,
          functionVersion: context.functionVersion,
          remainingTime: context.getRemainingTimeInMillis(),
          coldStart: !global.isWarm,
        },
        nodejs: {
          version: process.version,
          platform: process.platform,
          arch: process.arch,
        },
      },
    };

    // 전체 상태 결정
    const componentStatuses = Object.values(systemStatus.components).map(c => c.status);
    if (componentStatuses.includes('unhealthy')) {
      systemStatus.status = 'unhealthy';
    } else if (componentStatuses.includes('warning')) {
      systemStatus.status = 'warning';
    }

    // Lambda 웜업 표시
    global.isWarm = true;

    info('System status check completed', {
      requestId: context.awsRequestId,
      status: systemStatus.status,
      duration: systemStatus.checkDuration,
    });

    return success(systemStatus);
  } catch (err) {
    error('System status check failed', err, {
      requestId: context.awsRequestId,
    });

    return errorResponse('System status check failed');
  }
};

/**
 * 데이터베이스 상태 확인
 * @returns {Promise<Object>} 데이터베이스 상태
 */
async function checkDatabaseHealth() {
  try {
    // DynamoDB 초기화 확인
    if (!dynamoDBConfig.isInitialized) {
      dynamoDBConfig.initialize();
    }

    // 테이블 상태 확인
    const tableStatuses = await dynamoDBConfig.getAllTableStatus();
    
    const healthyTables = tableStatuses.filter(t => t.status === 'ACTIVE').length;
    const totalTables = tableStatuses.length;
    
    const health = {
      status: healthyTables === totalTables ? 'healthy' : 'unhealthy',
      tables: {
        total: totalTables,
        healthy: healthyTables,
        unhealthy: totalTables - healthyTables,
      },
      details: tableStatuses.map(t => ({
        name: t.tableName,
        status: t.status,
        itemCount: t.itemCount,
        size: t.tableSize,
      })),
    };

    return health;
  } catch (err) {
    return {
      status: 'unhealthy',
      error: err.message,
    };
  }
}

/**
 * 오류 처리기 상태 확인
 * @returns {Object} 오류 처리기 상태
 */
function checkErrorHandlerHealth() {
  try {
    const health = errorHandler.healthCheck();
    return health;
  } catch (err) {
    return {
      status: 'unhealthy',
      error: err.message,
    };
  }
}

/**
 * 보안 미들웨어 상태 확인
 * @returns {Object} 보안 상태
 */
function checkSecurityHealth() {
  try {
    const stats = securityMiddleware.getSecurityStats();
    
    const health = {
      status: 'healthy',
      stats,
      configuration: {
        allowedOrigins: stats.allowedOrigins,
        ipWhitelist: stats.ipWhitelist,
        ipBlacklist: stats.ipBlacklist,
      },
    };

    // 높은 속도 제한 IP가 많으면 경고
    if (stats.rateLimitedIPs > 10) {
      health.status = 'warning';
      health.warning = 'High number of rate-limited IPs';
    }

    return health;
  } catch (err) {
    return {
      status: 'unhealthy',
      error: err.message,
    };
  }
}

/**
 * 환경 설정 상태 확인
 * @returns {Object} 환경 상태
 */
function checkEnvironmentHealth() {
  const requiredEnvVars = [
    'STAGE',
    'REGION',
    'FLOOD_INFO_TABLE',
    'API_SOURCE_TABLE',
  ];

  const optionalEnvVars = [
    'NAVER_CLIENT_ID',
    'NAVER_CLIENT_SECRET',
    'HANRIVER_BASE_URL',
    'ALLOWED_ORIGINS',
  ];

  const health = {
    status: 'healthy',
    environment: {
      stage: process.env.STAGE,
      region: process.env.REGION,
      nodeVersion: process.version,
    },
    configuration: {
      required: {},
      optional: {},
    },
    issues: [],
  };

  // 필수 환경 변수 확인
  requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    health.configuration.required[envVar] = {
      configured: !!value,
      value: value ? '[CONFIGURED]' : '[MISSING]',
    };

    if (!value) {
      health.status = 'unhealthy';
      health.issues.push(`Missing required environment variable: ${envVar}`);
    }
  });

  // 선택적 환경 변수 확인
  optionalEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    health.configuration.optional[envVar] = {
      configured: !!value,
      value: value ? '[CONFIGURED]' : '[NOT_SET]',
    };

    if (!value) {
      health.issues.push(`Optional environment variable not set: ${envVar}`);
    }
  });

  // 경고 상태 결정
  if (health.status === 'healthy' && health.issues.length > 0) {
    health.status = 'warning';
  }

  return health;
}

/**
 * Promise.allSettled 결과를 헬스 체크 결과로 변환
 * @param {Object} settledResult - Promise.allSettled 결과
 * @returns {Object} 헬스 체크 결과
 */
function getHealthResult(settledResult) {
  if (settledResult.status === 'fulfilled') {
    return settledResult.value;
  } else {
    return {
      status: 'unhealthy',
      error: settledResult.reason?.message || 'Unknown error',
    };
  }
}

/**
 * 외부 API 상태 확인
 * @param {Object} event - Lambda 이벤트
 * @param {Object} context - Lambda 컨텍스트
 * @returns {Promise<Object>} HTTP 응답
 */
exports.checkExternalAPIs = async (event, context) => {
  try {
    debug('External API status check requested', {
      requestId: context.awsRequestId,
    });

    const startTime = Date.now();

    // 외부 API 상태 확인
    const [hanRiverHealth, naverHealth] = await Promise.allSettled([
      checkHanRiverAPIHealth(),
      checkNaverAPIHealth(),
    ]);

    const apiStatus = {
      timestamp: new Date().toISOString(),
      requestId: context.awsRequestId,
      checkDuration: Date.now() - startTime,
      apis: {
        hanRiver: getHealthResult(hanRiverHealth),
        naver: getHealthResult(naverHealth),
      },
    };

    // 전체 상태 결정
    const apiStatuses = Object.values(apiStatus.apis).map(api => api.status);
    apiStatus.overallStatus = apiStatuses.includes('unhealthy') ? 'unhealthy' :
                             apiStatuses.includes('warning') ? 'warning' : 'healthy';

    info('External API status check completed', {
      requestId: context.awsRequestId,
      overallStatus: apiStatus.overallStatus,
      duration: apiStatus.checkDuration,
    });

    return success(apiStatus);
  } catch (err) {
    error('External API status check failed', err, {
      requestId: context.awsRequestId,
    });

    return errorResponse('External API status check failed');
  }
};

/**
 * 한강홍수통제소 API 상태 확인
 * @returns {Promise<Object>} API 상태
 */
async function checkHanRiverAPIHealth() {
  try {
    const baseUrl = process.env.HANRIVER_BASE_URL;
    if (!baseUrl) {
      return {
        status: 'warning',
        message: 'Han River API URL not configured',
      };
    }

    // 간단한 연결 테스트 (실제 구현에서는 HanRiverAPIService 사용)
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      timeout: 5000,
    });

    return {
      status: response.ok ? 'healthy' : 'unhealthy',
      responseTime: Date.now() - startTime,
      statusCode: response.status,
    };
  } catch (err) {
    return {
      status: 'unhealthy',
      error: err.message,
    };
  }
}

/**
 * 네이버 API 상태 확인
 * @returns {Promise<Object>} API 상태
 */
async function checkNaverAPIHealth() {
  try {
    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return {
        status: 'warning',
        message: 'Naver API credentials not configured',
      };
    }

    // 네이버 API는 실제 요청 없이는 상태 확인이 어려우므로 설정 확인만
    return {
      status: 'healthy',
      message: 'Naver API credentials configured',
      configured: true,
    };
  } catch (err) {
    return {
      status: 'unhealthy',
      error: err.message,
    };
  }
}

/**
 * 성능 메트릭 조회
 * @param {Object} event - Lambda 이벤트
 * @param {Object} context - Lambda 컨텍스트
 * @returns {Promise<Object>} HTTP 응답
 */
exports.getPerformanceMetrics = async (event, context) => {
  try {
    debug('Performance metrics requested', {
      requestId: context.awsRequestId,
    });

    const metrics = {
      timestamp: new Date().toISOString(),
      requestId: context.awsRequestId,
      lambda: {
        functionName: context.functionName,
        functionVersion: context.functionVersion,
        memoryLimit: parseInt(context.memoryLimitInMB),
        remainingTime: context.getRemainingTimeInMillis(),
        coldStart: !global.isWarm,
      },
      process: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        version: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      errors: errorHandler.getErrorStats(),
      security: securityMiddleware.getSecurityStats(),
    };

    // 메모리 사용률 계산
    metrics.memoryUsagePercent = Math.round(
      (metrics.process.memory.heapUsed / (metrics.lambda.memoryLimit * 1024 * 1024)) * 100
    );

    // Lambda 웜업 표시
    global.isWarm = true;

    info('Performance metrics retrieved', {
      requestId: context.awsRequestId,
      memoryUsage: metrics.memoryUsagePercent,
      uptime: metrics.process.uptime,
    });

    return success(metrics);
  } catch (err) {
    error('Performance metrics retrieval failed', err, {
      requestId: context.awsRequestId,
    });

    return errorResponse('Performance metrics retrieval failed');
  }
};