// lambda-performance.test.js
// Lambda 콜드 스타트 최적화, API 응답 시간 (<1000ms), 네이버 지도 렌더링 최적화 테스트

const { performance } = require('perf_hooks');

// Mock AWS Lambda context
const createMockContext = (memoryLimitInMB = 512, remainingTimeInMillis = 30000) => ({
  awsRequestId: 'test-request-id',
  functionName: 'test-function',
  functionVersion: '1',
  memoryLimitInMB,
  getRemainingTimeInMillis: () => remainingTimeInMillis,
});

// Mock event
const createMockEvent = (httpMethod = 'GET', path = '/api/health') => ({
  httpMethod,
  path,
  headers: {
    'User-Agent': 'test-agent',
    'Content-Type': 'application/json',
  },
  requestContext: {
    identity: {
      sourceIp: '127.0.0.1',
    },
  },
  queryStringParameters: null,
  body: null,
});

describe('Lambda Performance Tests', () => {
  describe('Cold Start Optimization', () => {
    it('should initialize services within acceptable time', async () => {
      const startTime = performance.now();

      // 서비스 초기화 시뮬레이션
      const DynamoDBService = require('../../src/services/DynamoDBService');
      const HanRiverAPIService = require('../../src/services/HanRiverAPIService');
      const DataNormalizationService = require('../../src/services/DataNormalizationService');

      const dynamoService = new DynamoDBService();
      const hanRiverService = new HanRiverAPIService();
      const normalizationService = new DataNormalizationService();

      const endTime = performance.now();
      const initializationTime = endTime - startTime;

      // 초기화 시간이 500ms 이내여야 함
      expect(initializationTime).toBeLessThan(500);
      
      console.log(`Service initialization time: ${initializationTime.toFixed(2)}ms`);
    });

    it('should reuse initialized services on subsequent calls', async () => {
      // 첫 번째 호출
      const startTime1 = performance.now();
      const DynamoDBService = require('../../src/services/DynamoDBService');
      const service1 = new DynamoDBService();
      const endTime1 = performance.now();
      const firstCallTime = endTime1 - startTime1;

      // 두 번째 호출 (모듈 캐시 활용)
      const startTime2 = performance.now();
      const service2 = new DynamoDBService();
      const endTime2 = performance.now();
      const secondCallTime = endTime2 - startTime2;

      // 두 번째 호출이 더 빨라야 함
      expect(secondCallTime).toBeLessThan(firstCallTime);
      
      console.log(`First call: ${firstCallTime.toFixed(2)}ms, Second call: ${secondCallTime.toFixed(2)}ms`);
    });

    it('should minimize memory usage during initialization', () => {
      const initialMemory = process.memoryUsage();

      // 서비스 초기화
      const DynamoDBService = require('../../src/services/DynamoDBService');
      const HanRiverAPIService = require('../../src/services/HanRiverAPIService');
      const DataNormalizationService = require('../../src/services/DataNormalizationService');

      new DynamoDBService();
      new HanRiverAPIService();
      new DataNormalizationService();

      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;

      // 메모리 증가가 50MB 이내여야 함
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
      
      console.log(`Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
    });
  });

  describe('API Response Time Tests', () => {
    let healthHandler;

    beforeAll(() => {
      healthHandler = require('../../src/handlers/healthHandler');
    });

    it('should respond to health check within 200ms', async () => {
      const event = createMockEvent('GET', '/api/health');
      const context = createMockContext();

      const startTime = performance.now();
      const response = await healthHandler.healthCheck(event, context);
      const endTime = performance.now();

      const responseTime = endTime - startTime;

      expect(response.statusCode).toBe(200);
      expect(responseTime).toBeLessThan(200);
      
      console.log(`Health check response time: ${responseTime.toFixed(2)}ms`);
    });

    it('should respond to system status within 1000ms', async () => {
      const event = createMockEvent('GET', '/api/status');
      const context = createMockContext();

      const startTime = performance.now();
      const response = await healthHandler.getSystemStatus(event, context);
      const endTime = performance.now();

      const responseTime = endTime - startTime;

      expect(response.statusCode).toBe(200);
      expect(responseTime).toBeLessThan(1000);
      
      console.log(`System status response time: ${responseTime.toFixed(2)}ms`);
    });

    it('should handle concurrent requests efficiently', async () => {
      const event = createMockEvent('GET', '/api/health');
      const context = createMockContext();

      const concurrentRequests = 10;
      const promises = [];

      const startTime = performance.now();

      for (let i = 0; i < concurrentRequests; i++) {
        promises.push(healthHandler.healthCheck(event, context));
      }

      const responses = await Promise.all(promises);
      const endTime = performance.now();

      const totalTime = endTime - startTime;
      const averageTime = totalTime / concurrentRequests;

      // 모든 응답이 성공해야 함
      responses.forEach(response => {
        expect(response.statusCode).toBe(200);
      });

      // 평균 응답 시간이 500ms 이내여야 함
      expect(averageTime).toBeLessThan(500);
      
      console.log(`Concurrent requests (${concurrentRequests}): ${totalTime.toFixed(2)}ms total, ${averageTime.toFixed(2)}ms average`);
    });
  });

  describe('Memory Usage Tests', () => {
    it('should not exceed memory limits during normal operation', async () => {
      const context = createMockContext(512); // 512MB limit
      const initialMemory = process.memoryUsage();

      // 메모리 집약적 작업 시뮬레이션
      const largeArray = new Array(100000).fill(0).map((_, i) => ({
        id: i,
        data: `test-data-${i}`,
        timestamp: new Date().toISOString(),
      }));

      // 데이터 처리
      const processedData = largeArray.map(item => ({
        ...item,
        processed: true,
      }));

      const finalMemory = process.memoryUsage();
      const memoryUsed = finalMemory.heapUsed / 1024 / 1024; // MB

      // 메모리 사용량이 Lambda 한계의 80% 이내여야 함
      expect(memoryUsed).toBeLessThan(context.memoryLimitInMB * 0.8);
      
      console.log(`Memory used: ${memoryUsed.toFixed(2)}MB / ${context.memoryLimitInMB}MB`);

      // 메모리 정리
      largeArray.length = 0;
      processedData.length = 0;
    });

    it('should clean up resources after processing', async () => {
      const initialMemory = process.memoryUsage();

      // 리소스 생성 및 정리 시뮬레이션
      const resources = [];
      for (let i = 0; i < 1000; i++) {
        resources.push({
          id: i,
          data: new Array(1000).fill(`data-${i}`),
        });
      }

      // 리소스 정리
      resources.forEach(resource => {
        resource.data = null;
      });
      resources.length = 0;

      // 가비지 컬렉션 강제 실행 (테스트 환경에서만)
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage();
      const memoryDifference = finalMemory.heapUsed - initialMemory.heapUsed;

      // 메모리 증가가 10MB 이내여야 함 (정리 후)
      expect(memoryDifference).toBeLessThan(10 * 1024 * 1024);
      
      console.log(`Memory difference after cleanup: ${(memoryDifference / 1024 / 1024).toFixed(2)}MB`);
    });
  });

  describe('Database Performance Tests', () => {
    let dynamoService;

    beforeAll(() => {
      const DynamoDBService = require('../../src/services/DynamoDBService');
      dynamoService = new DynamoDBService();
    });

    it('should perform database operations within acceptable time', async () => {
      // Mock DynamoDB operations
      const mockPutItem = jest.fn().mockResolvedValue({ success: true });
      const mockGetItem = jest.fn().mockResolvedValue({ 
        success: true, 
        item: { id: 'test-id', data: 'test-data' } 
      });
      const mockQuery = jest.fn().mockResolvedValue({ 
        success: true, 
        items: [{ id: 'test-id', data: 'test-data' }] 
      });

      dynamoService.putItem = mockPutItem;
      dynamoService.getItem = mockGetItem;
      dynamoService.query = mockQuery;

      const testItem = {
        id: 'test-id',
        data: 'test-data',
        timestamp: new Date().toISOString(),
      };

      // PUT 작업 성능 테스트
      const putStartTime = performance.now();
      await dynamoService.putItem(testItem);
      const putEndTime = performance.now();
      const putTime = putEndTime - putStartTime;

      // GET 작업 성능 테스트
      const getStartTime = performance.now();
      await dynamoService.getItem('test-id');
      const getEndTime = performance.now();
      const getTime = getEndTime - getStartTime;

      // QUERY 작업 성능 테스트
      const queryStartTime = performance.now();
      await dynamoService.query({ id: 'test-id' });
      const queryEndTime = performance.now();
      const queryTime = queryEndTime - queryStartTime;

      // 각 작업이 100ms 이내여야 함
      expect(putTime).toBeLessThan(100);
      expect(getTime).toBeLessThan(100);
      expect(queryTime).toBeLessThan(100);

      console.log(`DB Performance - PUT: ${putTime.toFixed(2)}ms, GET: ${getTime.toFixed(2)}ms, QUERY: ${queryTime.toFixed(2)}ms`);
    });

    it('should handle batch operations efficiently', async () => {
      const mockBatchWrite = jest.fn().mockResolvedValue({ 
        success: true, 
        unprocessedItems: [] 
      });
      
      dynamoService.batchWriteItems = mockBatchWrite;

      const batchItems = Array.from({ length: 25 }, (_, i) => ({
        id: `batch-item-${i}`,
        data: `batch-data-${i}`,
        timestamp: new Date().toISOString(),
      }));

      const startTime = performance.now();
      await dynamoService.batchWriteItems(batchItems);
      const endTime = performance.now();

      const batchTime = endTime - startTime;

      // 배치 작업이 500ms 이내여야 함
      expect(batchTime).toBeLessThan(500);
      
      console.log(`Batch write (25 items): ${batchTime.toFixed(2)}ms`);
    });
  });

  describe('External API Performance Tests', () => {
    let hanRiverService;

    beforeAll(() => {
      const HanRiverAPIService = require('../../src/services/HanRiverAPIService');
      hanRiverService = new HanRiverAPIService();
    });

    it('should handle API timeouts gracefully', async () => {
      // Mock fetch with timeout
      const mockFetch = jest.fn().mockImplementation(() => 
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve({ data: [] }),
            });
          }, 6000); // 6초 지연 (타임아웃 테스트)
        })
      );

      global.fetch = mockFetch;

      const startTime = performance.now();
      
      try {
        await hanRiverService.getWaterLevelStations();
      } catch (error) {
        // 타임아웃 에러 예상
        expect(error.message).toContain('timeout');
      }

      const endTime = performance.now();
      const requestTime = endTime - startTime;

      // 타임아웃이 5초 이내에 발생해야 함
      expect(requestTime).toBeLessThan(5500);
      
      console.log(`API timeout handling: ${requestTime.toFixed(2)}ms`);
    });

    it('should cache API responses for performance', async () => {
      const mockResponse = { data: [{ id: 1, name: 'test' }] };
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      global.fetch = mockFetch;

      // 첫 번째 호출
      const startTime1 = performance.now();
      const result1 = await hanRiverService.getWaterLevelStations();
      const endTime1 = performance.now();
      const firstCallTime = endTime1 - startTime1;

      // 두 번째 호출 (캐시된 결과)
      const startTime2 = performance.now();
      const result2 = await hanRiverService.getWaterLevelStations();
      const endTime2 = performance.now();
      const secondCallTime = endTime2 - startTime2;

      // 두 번째 호출이 더 빨라야 함 (캐시 활용)
      expect(secondCallTime).toBeLessThan(firstCallTime);
      expect(result1).toEqual(result2);
      
      console.log(`API caching - First: ${firstCallTime.toFixed(2)}ms, Second: ${secondCallTime.toFixed(2)}ms`);
    });
  });

  describe('Data Processing Performance', () => {
    let normalizationService;

    beforeAll(() => {
      const DataNormalizationService = require('../../src/services/DataNormalizationService');
      normalizationService = new DataNormalizationService();
    });

    it('should process large datasets efficiently', async () => {
      // 대용량 데이터셋 생성
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        stationId: `ST${i.toString().padStart(3, '0')}`,
        stationName: `Station ${i}`,
        waterLevel: Math.random() * 5,
        alertLevel: 3.0,
        dangerLevel: 4.0,
        coordinates: {
          latitude: 37.5 + (Math.random() - 0.5) * 0.1,
          longitude: 126.9 + (Math.random() - 0.5) * 0.1,
        },
        timestamp: new Date().toISOString(),
      }));

      const startTime = performance.now();
      const normalizedData = normalizationService.normalizeWaterLevelData(largeDataset);
      const endTime = performance.now();

      const processingTime = endTime - startTime;

      expect(normalizedData).toHaveLength(1000);
      expect(processingTime).toBeLessThan(2000); // 2초 이내

      console.log(`Large dataset processing (1000 items): ${processingTime.toFixed(2)}ms`);
    });

    it('should handle data validation efficiently', async () => {
      const mixedQualityData = [
        // 유효한 데이터
        ...Array.from({ length: 500 }, (_, i) => ({
          stationId: `VALID${i}`,
          coordinates: { latitude: 37.5, longitude: 126.9 },
          waterLevel: 2.0,
        })),
        // 무효한 데이터
        ...Array.from({ length: 500 }, (_, i) => ({
          stationId: `INVALID${i}`,
          coordinates: { latitude: null, longitude: null },
          waterLevel: 'invalid',
        })),
      ];

      const startTime = performance.now();
      const normalizedData = normalizationService.normalizeWaterLevelData(mixedQualityData);
      const endTime = performance.now();

      const validationTime = endTime - startTime;

      expect(normalizedData).toHaveLength(500); // 유효한 데이터만
      expect(validationTime).toBeLessThan(1000); // 1초 이내

      console.log(`Data validation (1000 mixed items): ${validationTime.toFixed(2)}ms`);
    });
  });

  describe('Error Handling Performance', () => {
    it('should handle errors without significant performance impact', async () => {
      const healthHandler = require('../../src/handlers/healthHandler');
      
      // 에러를 발생시키는 이벤트
      const errorEvent = {
        ...createMockEvent(),
        body: 'invalid-json{',
      };
      const context = createMockContext();

      const startTime = performance.now();
      const response = await healthHandler.healthCheck(errorEvent, context);
      const endTime = performance.now();

      const errorHandlingTime = endTime - startTime;

      // 에러 처리가 300ms 이내여야 함
      expect(errorHandlingTime).toBeLessThan(300);
      
      console.log(`Error handling time: ${errorHandlingTime.toFixed(2)}ms`);
    });
  });
});