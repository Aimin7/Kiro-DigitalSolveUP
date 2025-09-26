// 위치 기반 침수 데이터 API 계약 테스트
// GET /api/flood-data/location 엔드포인트 테스트

const { locationHandler } = require('../../src/handlers/locationHandler');

describe('Location-based Flood Data API Contract Tests', () => {
  describe('GET /api/flood-data/location', () => {
    test('should return location-based flood data with required parameters', async () => {
      // Arrange
      const event = {
        httpMethod: 'GET',
        path: '/api/flood-data/location',
        queryStringParameters: {
          latitude: '37.5665',
          longitude: '126.9780',
          radius: '5000', // 5km
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const context = {};

      // Act
      const response = await locationHandler.getFloodDataByLocation(event, context);

      // Assert
      expect(response).toBeDefined();
      expect(response.statusCode).toBe(200);
      
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toBeDefined();
      expect(body.data).toHaveProperty('center');
      expect(body.data).toHaveProperty('radius');
      expect(body.data).toHaveProperty('floodPoints');
      expect(body.data).toHaveProperty('totalCount');
      
      // 중심점 검증
      expect(body.data.center).toHaveProperty('latitude', 37.5665);
      expect(body.data.center).toHaveProperty('longitude', 126.9780);
      expect(body.data.radius).toBe(5000);
      
      // 침수 지점 데이터 검증
      expect(Array.isArray(body.data.floodPoints)).toBe(true);
      expect(typeof body.data.totalCount).toBe('number');
      
      if (body.data.floodPoints.length > 0) {
        const floodPoint = body.data.floodPoints[0];
        expect(floodPoint).toHaveProperty('id');
        expect(floodPoint).toHaveProperty('latitude');
        expect(floodPoint).toHaveProperty('longitude');
        expect(floodPoint).toHaveProperty('distance');
        expect(floodPoint).toHaveProperty('alertType');
        expect(floodPoint).toHaveProperty('severity');
        
        // 거리 검증 (반경 내에 있어야 함)
        expect(floodPoint.distance).toBeLessThanOrEqual(5000);
        expect(typeof floodPoint.distance).toBe('number');
      }
    });

    test('should validate required parameters', async () => {
      // Arrange - latitude 누락
      const event = {
        httpMethod: 'GET',
        path: '/api/flood-data/location',
        queryStringParameters: {
          longitude: '126.9780',
          radius: '5000',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const context = {};

      // Act
      const response = await locationHandler.getFloodDataByLocation(event, context);

      // Assert
      expect(response.statusCode).toBe(400);
      
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error).toBeDefined();
      expect(body.error.code).toBe('VALIDATION_ERROR');
      expect(body.error.message).toContain('latitude');
    });

    test('should validate parameter ranges', async () => {
      // Arrange - 잘못된 위도 범위
      const event = {
        httpMethod: 'GET',
        path: '/api/flood-data/location',
        queryStringParameters: {
          latitude: '91', // 유효 범위: -90 ~ 90
          longitude: '126.9780',
          radius: '5000',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const context = {};

      // Act
      const response = await locationHandler.getFloodDataByLocation(event, context);

      // Assert
      expect(response.statusCode).toBe(400);
      
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });

    test('should handle different radius values', async () => {
      const testCases = [
        { radius: '1000', expected: 1000 },
        { radius: '10000', expected: 10000 },
        { radius: '50000', expected: 50000 },
      ];

      for (const testCase of testCases) {
        // Arrange
        const event = {
          httpMethod: 'GET',
          path: '/api/flood-data/location',
          queryStringParameters: {
            latitude: '37.5665',
            longitude: '126.9780',
            radius: testCase.radius,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const context = {};

        // Act
        const response = await locationHandler.getFloodDataByLocation(event, context);

        // Assert
        expect(response.statusCode).toBe(200);
        
        const body = JSON.parse(response.body);
        expect(body.data.radius).toBe(testCase.expected);
        
        // 반환된 모든 지점이 반경 내에 있는지 확인
        body.data.floodPoints.forEach(point => {
          expect(point.distance).toBeLessThanOrEqual(testCase.expected);
        });
      }
    });

    test('should return sorted results by distance', async () => {
      // Arrange
      const event = {
        httpMethod: 'GET',
        path: '/api/flood-data/location',
        queryStringParameters: {
          latitude: '37.5665',
          longitude: '126.9780',
          radius: '10000',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const context = {};

      // Act
      const response = await locationHandler.getFloodDataByLocation(event, context);

      // Assert
      expect(response.statusCode).toBe(200);
      
      const body = JSON.parse(response.body);
      const floodPoints = body.data.floodPoints;
      
      if (floodPoints.length > 1) {
        for (let i = 1; i < floodPoints.length; i++) {
          expect(floodPoints[i].distance).toBeGreaterThanOrEqual(floodPoints[i - 1].distance);
        }
      }
    });

    test('should support pagination', async () => {
      // Arrange
      const event = {
        httpMethod: 'GET',
        path: '/api/flood-data/location',
        queryStringParameters: {
          latitude: '37.5665',
          longitude: '126.9780',
          radius: '10000',
          limit: '5',
          offset: '0',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const context = {};

      // Act
      const response = await locationHandler.getFloodDataByLocation(event, context);

      // Assert
      expect(response.statusCode).toBe(200);
      
      const body = JSON.parse(response.body);
      expect(body.data.floodPoints.length).toBeLessThanOrEqual(5);
      expect(body.data).toHaveProperty('pagination');
      expect(body.data.pagination).toHaveProperty('limit', 5);
      expect(body.data.pagination).toHaveProperty('offset', 0);
      expect(body.data.pagination).toHaveProperty('total');
    });

    test('should filter by severity level', async () => {
      // Arrange
      const event = {
        httpMethod: 'GET',
        path: '/api/flood-data/location',
        queryStringParameters: {
          latitude: '37.5665',
          longitude: '126.9780',
          radius: '10000',
          severity: 'high',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const context = {};

      // Act
      const response = await locationHandler.getFloodDataByLocation(event, context);

      // Assert
      expect(response.statusCode).toBe(200);
      
      const body = JSON.parse(response.body);
      body.data.floodPoints.forEach(point => {
        expect(point.severity).toBe('high');
      });
    });

    test('should filter by alert type', async () => {
      // Arrange
      const event = {
        httpMethod: 'GET',
        path: '/api/flood-data/location',
        queryStringParameters: {
          latitude: '37.5665',
          longitude: '126.9780',
          radius: '10000',
          alertType: '경보',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const context = {};

      // Act
      const response = await locationHandler.getFloodDataByLocation(event, context);

      // Assert
      expect(response.statusCode).toBe(200);
      
      const body = JSON.parse(response.body);
      body.data.floodPoints.forEach(point => {
        expect(point.alertType).toBe('경보');
      });
    });

    test('should return empty results for remote locations', async () => {
      // Arrange - 제주도 좌표 (서울에서 멀리 떨어진 곳)
      const event = {
        httpMethod: 'GET',
        path: '/api/flood-data/location',
        queryStringParameters: {
          latitude: '33.3617',
          longitude: '126.5292',
          radius: '1000',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const context = {};

      // Act
      const response = await locationHandler.getFloodDataByLocation(event, context);

      // Assert
      expect(response.statusCode).toBe(200);
      
      const body = JSON.parse(response.body);
      expect(body.data.floodPoints).toEqual([]);
      expect(body.data.totalCount).toBe(0);
    });

    test('should handle maximum radius limit', async () => {
      // Arrange - 너무 큰 반경
      const event = {
        httpMethod: 'GET',
        path: '/api/flood-data/location',
        queryStringParameters: {
          latitude: '37.5665',
          longitude: '126.9780',
          radius: '100000', // 100km (제한: 50km)
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const context = {};

      // Act
      const response = await locationHandler.getFloodDataByLocation(event, context);

      // Assert
      expect(response.statusCode).toBe(400);
      
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('VALIDATION_ERROR');
      expect(body.error.message).toContain('radius');
    });

    test('should include response metadata', async () => {
      // Arrange
      const event = {
        httpMethod: 'GET',
        path: '/api/flood-data/location',
        queryStringParameters: {
          latitude: '37.5665',
          longitude: '126.9780',
          radius: '5000',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const context = {};

      // Act
      const response = await locationHandler.getFloodDataByLocation(event, context);

      // Assert
      expect(response.statusCode).toBe(200);
      
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('timestamp');
      expect(body).toHaveProperty('success', true);
      
      // 메타데이터 검증
      expect(body.data).toHaveProperty('searchArea');
      expect(body.data.searchArea).toHaveProperty('center');
      expect(body.data.searchArea).toHaveProperty('radius');
      expect(body.data.searchArea).toHaveProperty('unit', 'meters');
    });
  });
});