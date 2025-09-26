// 침수 데이터 API 계약 테스트
// GET /api/flood-data 엔드포인트 테스트

const request = require('supertest');
const { floodHandler } = require('../../src/handlers/floodHandler');

describe('Flood Data API Contract Tests', () => {
  describe('GET /api/flood-data', () => {
    test('should return flood data with correct structure', async () => {
      // Arrange
      const event = {
        httpMethod: 'GET',
        path: '/api/flood-data',
        queryStringParameters: null,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const context = {};

      // Act
      const response = await floodHandler.getFloodData(event, context);

      // Assert
      expect(response).toBeDefined();
      expect(response.statusCode).toBe(200);
      
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('timestamp');
      
      // 데이터 구조 검증
      if (body.data && body.data.length > 0) {
        const floodData = body.data[0];
        expect(floodData).toHaveProperty('id');
        expect(floodData).toHaveProperty('latitude');
        expect(floodData).toHaveProperty('longitude');
        expect(floodData).toHaveProperty('alertType');
        expect(floodData).toHaveProperty('severity');
        expect(floodData).toHaveProperty('timestamp');
        expect(floodData).toHaveProperty('status');
        expect(floodData).toHaveProperty('sources');
        
        // 데이터 타입 검증
        expect(typeof floodData.id).toBe('string');
        expect(typeof floodData.latitude).toBe('number');
        expect(typeof floodData.longitude).toBe('number');
        expect(['주의보', '경보', '특보']).toContain(floodData.alertType);
        expect(['low', 'medium', 'high']).toContain(floodData.severity);
        expect(['active', 'resolved']).toContain(floodData.status);
        expect(Array.isArray(floodData.sources)).toBe(true);
      }
    });

    test('should handle query parameters for location filtering', async () => {
      // Arrange
      const event = {
        httpMethod: 'GET',
        path: '/api/flood-data',
        queryStringParameters: {
          latitude: '37.5665',
          longitude: '126.9780',
          radius: '10000', // 10km
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const context = {};

      // Act
      const response = await floodHandler.getFloodData(event, context);

      // Assert
      expect(response.statusCode).toBe(200);
      
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toBeDefined();
      
      // 위치 필터링이 적용된 데이터 검증
      if (body.data && body.data.length > 0) {
        body.data.forEach(item => {
          expect(item.latitude).toBeDefined();
          expect(item.longitude).toBeDefined();
          // 반경 내 데이터인지 검증 (대략적)
          const distance = Math.sqrt(
            Math.pow(item.latitude - 37.5665, 2) + 
            Math.pow(item.longitude - 126.9780, 2)
          ) * 111000; // 대략적인 거리 계산
          expect(distance).toBeLessThanOrEqual(10000);
        });
      }
    });

    test('should handle invalid query parameters gracefully', async () => {
      // Arrange
      const event = {
        httpMethod: 'GET',
        path: '/api/flood-data',
        queryStringParameters: {
          latitude: 'invalid',
          longitude: 'invalid',
          radius: 'invalid',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const context = {};

      // Act
      const response = await floodHandler.getFloodData(event, context);

      // Assert
      expect(response.statusCode).toBe(400);
      
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error).toBeDefined();
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });

    test('should return empty array when no flood data exists', async () => {
      // Arrange
      const event = {
        httpMethod: 'GET',
        path: '/api/flood-data',
        queryStringParameters: {
          latitude: '0',
          longitude: '0',
          radius: '1000',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const context = {};

      // Act
      const response = await floodHandler.getFloodData(event, context);

      // Assert
      expect(response.statusCode).toBe(200);
      
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toEqual([]);
    });

    test('should handle server errors gracefully', async () => {
      // Arrange - DynamoDB 연결 실패 시뮬레이션
      const event = {
        httpMethod: 'GET',
        path: '/api/flood-data',
        queryStringParameters: null,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const context = {};

      // Mock DynamoDB error
      const originalEnv = process.env.DYNAMODB_TABLE_NAME;
      process.env.DYNAMODB_TABLE_NAME = 'non-existent-table';

      // Act
      const response = await floodHandler.getFloodData(event, context);

      // Assert
      expect(response.statusCode).toBe(500);
      
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error).toBeDefined();
      expect(body.error.code).toBe('INTERNAL_ERROR');

      // Cleanup
      process.env.DYNAMODB_TABLE_NAME = originalEnv;
    });

    test('should include CORS headers in response', async () => {
      // Arrange
      const event = {
        httpMethod: 'GET',
        path: '/api/flood-data',
        queryStringParameters: null,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const context = {};

      // Act
      const response = await floodHandler.getFloodData(event, context);

      // Assert
      expect(response.headers).toBeDefined();
      expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
      expect(response.headers['Access-Control-Allow-Headers']).toContain('Content-Type');
      expect(response.headers['Access-Control-Allow-Methods']).toContain('GET');
    });

    test('should return data within reasonable response time', async () => {
      // Arrange
      const event = {
        httpMethod: 'GET',
        path: '/api/flood-data',
        queryStringParameters: null,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const context = {};

      // Act
      const startTime = Date.now();
      const response = await floodHandler.getFloodData(event, context);
      const endTime = Date.now();

      // Assert
      expect(response.statusCode).toBe(200);
      expect(endTime - startTime).toBeLessThan(5000); // 5초 이내
    });
  });

  describe('GET /api/flood-data/hanriver', () => {
    test('should return Han River API raw data with correct structure', async () => {
      // Arrange
      const event = {
        httpMethod: 'GET',
        path: '/api/flood-data/hanriver',
        queryStringParameters: null,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const context = {};

      // Act
      const response = await floodHandler.getHanRiverData(event, context);

      // Assert
      expect(response.statusCode).toBe(200);
      
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toBeDefined();
      
      // 한강홍수통제소 3개 API 데이터 구조 검증
      expect(body.data).toHaveProperty('waterlevel');
      expect(body.data).toHaveProperty('realtime');
      expect(body.data).toHaveProperty('forecast');
      
      // 각 API 데이터가 배열인지 확인
      expect(Array.isArray(body.data.waterlevel)).toBe(true);
      expect(Array.isArray(body.data.realtime)).toBe(true);
      expect(Array.isArray(body.data.forecast)).toBe(true);
    });

    test('should handle Han River API failures gracefully', async () => {
      // Arrange
      const event = {
        httpMethod: 'GET',
        path: '/api/flood-data/hanriver',
        queryStringParameters: null,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const context = {};

      // Mock network failure
      const originalUrl = process.env.HANRIVER_BASE_URL;
      process.env.HANRIVER_BASE_URL = 'http://invalid-url';

      // Act
      const response = await floodHandler.getHanRiverData(event, context);

      // Assert
      expect([200, 500]).toContain(response.statusCode);
      
      const body = JSON.parse(response.body);
      if (response.statusCode === 500) {
        expect(body.success).toBe(false);
        expect(body.error).toBeDefined();
      }

      // Cleanup
      process.env.HANRIVER_BASE_URL = originalUrl;
    });
  });
});