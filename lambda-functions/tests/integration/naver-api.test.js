// 네이버 API 통합 테스트
// Web Dynamic Map, Directions 5, Geocoding API 연동 테스트

const { NaverGeocodingService } = require('../../src/services/NaverGeocodingService');
const { NaverDirectionsService } = require('../../src/services/NaverDirectionsService');

describe('Naver API Integration Tests', () => {
  let geocodingService;
  let directionsService;

  beforeEach(() => {
    geocodingService = new NaverGeocodingService();
    directionsService = new NaverDirectionsService();
  });

  describe('Geocoding API', () => {
    test('should convert address to coordinates successfully', async () => {
      // Arrange
      const address = '서울특별시 중구 세종대로 110';

      // Act
      const result = await geocodingService.addressToCoordinates(address);

      // Assert
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('latitude');
      expect(result.data).toHaveProperty('longitude');
      expect(result.data).toHaveProperty('address');
      expect(result.data).toHaveProperty('roadAddress');
      
      // 좌표 범위 검증 (서울 지역)
      expect(result.data.latitude).toBeGreaterThan(37.4);
      expect(result.data.latitude).toBeLessThan(37.7);
      expect(result.data.longitude).toBeGreaterThan(126.8);
      expect(result.data.longitude).toBeLessThan(127.2);
      
      // 데이터 타입 검증
      expect(typeof result.data.latitude).toBe('number');
      expect(typeof result.data.longitude).toBe('number');
      expect(typeof result.data.address).toBe('string');
    }, 10000);

    test('should convert coordinates to address successfully', async () => {
      // Arrange
      const latitude = 37.5665;
      const longitude = 126.9780;

      // Act
      const result = await geocodingService.coordinatesToAddress(latitude, longitude);

      // Assert
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('address');
      expect(result.data).toHaveProperty('roadAddress');
      expect(result.data).toHaveProperty('region');
      
      // 주소 형식 검증
      expect(result.data.address).toContain('서울');
      expect(typeof result.data.address).toBe('string');
      expect(result.data.address.length).toBeGreaterThan(0);
    }, 10000);

    test('should handle invalid address gracefully', async () => {
      // Arrange
      const invalidAddress = '존재하지않는주소12345';

      // Act
      const result = await geocodingService.addressToCoordinates(invalidAddress);

      // Assert
      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error.code).toBe('GEOCODING_ERROR');
    });

    test('should handle invalid coordinates gracefully', async () => {
      // Arrange
      const invalidLatitude = 999;
      const invalidLongitude = 999;

      // Act
      const result = await geocodingService.coordinatesToAddress(invalidLatitude, invalidLongitude);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should validate coordinate ranges', async () => {
      const testCases = [
        { lat: -91, lng: 126.9780, shouldFail: true },
        { lat: 91, lng: 126.9780, shouldFail: true },
        { lat: 37.5665, lng: -181, shouldFail: true },
        { lat: 37.5665, lng: 181, shouldFail: true },
        { lat: 37.5665, lng: 126.9780, shouldFail: false },
      ];

      for (const testCase of testCases) {
        // Act
        const result = await geocodingService.coordinatesToAddress(testCase.lat, testCase.lng);

        // Assert
        if (testCase.shouldFail) {
          expect(result.success).toBe(false);
        } else {
          expect(result.success).toBe(true);
        }
      }
    });

    test('should include API response metadata', async () => {
      // Arrange
      const address = '서울특별시 중구 세종대로 110';

      // Act
      const result = await geocodingService.addressToCoordinates(address);

      // Assert
      if (result.success) {
        expect(result).toHaveProperty('timestamp');
        expect(result).toHaveProperty('apiVersion');
        expect(result.data).toHaveProperty('accuracy');
        expect(result.data).toHaveProperty('matchLevel');
      }
    });
  });

  describe('Directions API', () => {
    test('should calculate route successfully', async () => {
      // Arrange
      const start = { latitude: 37.5665, longitude: 126.9780 }; // 서울시청
      const goal = { latitude: 37.5651, longitude: 126.9895 }; // 동대문

      // Act
      const result = await directionsService.calculateRoute(start, goal);

      // Assert
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('route');
      expect(result.data).toHaveProperty('summary');
      
      // 경로 정보 검증
      expect(result.data.route).toHaveProperty('traoptimal');
      expect(result.data.route.traoptimal).toHaveProperty('path');
      expect(result.data.route.traoptimal).toHaveProperty('summary');
      
      // 요약 정보 검증
      const summary = result.data.route.traoptimal.summary;
      expect(summary).toHaveProperty('distance');
      expect(summary).toHaveProperty('duration');
      expect(summary).toHaveProperty('tollFare');
      expect(summary).toHaveProperty('fuelPrice');
      
      // 데이터 타입 검증
      expect(typeof summary.distance).toBe('number');
      expect(typeof summary.duration).toBe('number');
      expect(summary.distance).toBeGreaterThan(0);
      expect(summary.duration).toBeGreaterThan(0);
    }, 15000);

    test('should calculate alternative routes', async () => {
      // Arrange
      const start = { latitude: 37.5665, longitude: 126.9780 };
      const goal = { latitude: 37.5651, longitude: 126.9895 };
      const options = {
        option: 'traoptimal',
        alternatives: true,
      };

      // Act
      const result = await directionsService.calculateRoute(start, goal, options);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.route).toBeDefined();
      
      // 대안 경로가 있는지 확인
      const routeKeys = Object.keys(result.data.route);
      expect(routeKeys.length).toBeGreaterThanOrEqual(1);
    }, 15000);

    test('should calculate route avoiding specific areas', async () => {
      // Arrange
      const start = { latitude: 37.5665, longitude: 126.9780 };
      const goal = { latitude: 37.5651, longitude: 126.9895 };
      const avoidAreas = [
        { latitude: 37.5658, longitude: 126.9838, radius: 500 }, // 중간 지점 회피
      ];

      // Act
      const result = await directionsService.calculateRouteWithAvoidance(start, goal, avoidAreas);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('route');
      expect(result.data).toHaveProperty('avoidedAreas');
      expect(result.data.avoidedAreas).toEqual(avoidAreas);
    }, 15000);

    test('should validate route coordinates', async () => {
      // Arrange
      const start = { latitude: 37.5665, longitude: 126.9780 };
      const goal = { latitude: 37.5651, longitude: 126.9895 };

      // Act
      const result = await directionsService.calculateRoute(start, goal);

      // Assert
      if (result.success) {
        const path = result.data.route.traoptimal.path;
        expect(Array.isArray(path)).toBe(true);
        expect(path.length).toBeGreaterThan(0);
        
        // 경로 좌표 검증
        path.forEach(point => {
          expect(Array.isArray(point)).toBe(true);
          expect(point).toHaveLength(2);
          expect(typeof point[0]).toBe('number'); // longitude
          expect(typeof point[1]).toBe('number'); // latitude
          
          // 한국 내 좌표인지 확인
          expect(point[1]).toBeGreaterThan(33); // latitude
          expect(point[1]).toBeLessThan(39);
          expect(point[0]).toBeGreaterThan(124); // longitude
          expect(point[0]).toBeLessThan(132);
        });
      }
    });

    test('should handle invalid coordinates for routing', async () => {
      // Arrange
      const invalidStart = { latitude: 999, longitude: 999 };
      const validGoal = { latitude: 37.5651, longitude: 126.9895 };

      // Act
      const result = await directionsService.calculateRoute(invalidStart, validGoal);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error.code).toBe('DIRECTIONS_ERROR');
    });

    test('should handle unreachable destinations', async () => {
      // Arrange - 제주도에서 서울로 (도로 연결 불가)
      const start = { latitude: 33.3617, longitude: 126.5292 }; // 제주도
      const goal = { latitude: 37.5665, longitude: 126.9780 }; // 서울

      // Act
      const result = await directionsService.calculateRoute(start, goal);

      // Assert
      expect(result).toBeDefined();
      // 경로를 찾을 수 없거나 페리 경로를 제안할 수 있음
      if (!result.success) {
        expect(result.error.code).toBe('NO_ROUTE_FOUND');
      }
    }, 15000);

    test('should calculate route with waypoints', async () => {
      // Arrange
      const start = { latitude: 37.5665, longitude: 126.9780 }; // 서울시청
      const goal = { latitude: 37.5651, longitude: 126.9895 }; // 동대문
      const waypoints = [
        { latitude: 37.5658, longitude: 126.9838 }, // 중간 지점
      ];

      // Act
      const result = await directionsService.calculateRouteWithWaypoints(start, goal, waypoints);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('route');
      expect(result.data).toHaveProperty('waypoints');
      expect(result.data.waypoints).toEqual(waypoints);
    }, 15000);
  });

  describe('Proximity Check Integration', () => {
    test('should check if route passes near flood points', async () => {
      // Arrange
      const start = { latitude: 37.5665, longitude: 126.9780 };
      const goal = { latitude: 37.5651, longitude: 126.9895 };
      const floodPoints = [
        { latitude: 37.5658, longitude: 126.9838, id: 'flood-1' },
      ];
      const proximityRadius = 1500; // 1.5km

      // Act
      const routeResult = await directionsService.calculateRoute(start, goal);
      
      if (routeResult.success) {
        const proximityResult = await directionsService.checkRouteProximity(
          routeResult.data.route.traoptimal.path,
          floodPoints,
          proximityRadius
        );

        // Assert
        expect(proximityResult).toBeDefined();
        expect(proximityResult).toHaveProperty('hasProximityAlert');
        expect(proximityResult).toHaveProperty('alertPoints');
        expect(proximityResult).toHaveProperty('minDistance');
        
        if (proximityResult.hasProximityAlert) {
          expect(Array.isArray(proximityResult.alertPoints)).toBe(true);
          expect(proximityResult.alertPoints.length).toBeGreaterThan(0);
          expect(proximityResult.minDistance).toBeLessThanOrEqual(proximityRadius);
        }
      }
    }, 20000);

    test('should calculate alternative route avoiding flood areas', async () => {
      // Arrange
      const start = { latitude: 37.5665, longitude: 126.9780 };
      const goal = { latitude: 37.5651, longitude: 126.9895 };
      const floodAreas = [
        { latitude: 37.5658, longitude: 126.9838, radius: 1500 },
      ];

      // Act
      const result = await directionsService.calculateSafeRoute(start, goal, floodAreas);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('originalRoute');
      expect(result.data).toHaveProperty('safeRoute');
      expect(result.data).toHaveProperty('avoidedAreas');
      
      // 안전 경로가 홍수 지역을 회피하는지 확인
      if (result.data.safeRoute) {
        const safePath = result.data.safeRoute.path;
        const avoidanceCheck = await directionsService.checkRouteProximity(
          safePath,
          floodAreas,
          1500
        );
        
        expect(avoidanceCheck.hasProximityAlert).toBe(false);
      }
    }, 25000);
  });

  describe('API Error Handling', () => {
    test('should handle API key authentication errors', async () => {
      // Arrange
      const originalClientId = process.env.NAVER_CLIENT_ID;
      const originalClientSecret = process.env.NAVER_CLIENT_SECRET;
      
      process.env.NAVER_CLIENT_ID = 'invalid-client-id';
      process.env.NAVER_CLIENT_SECRET = 'invalid-client-secret';

      // Act
      const result = await geocodingService.addressToCoordinates('서울특별시 중구 세종대로 110');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error.code).toBe('AUTHENTICATION_ERROR');

      // Cleanup
      process.env.NAVER_CLIENT_ID = originalClientId;
      process.env.NAVER_CLIENT_SECRET = originalClientSecret;
    });

    test('should handle rate limiting gracefully', async () => {
      // Arrange - 연속으로 많은 요청 보내기
      const requests = Array(10).fill().map(() => 
        geocodingService.addressToCoordinates('서울특별시 중구 세종대로 110')
      );

      // Act
      const results = await Promise.allSettled(requests);

      // Assert
      const failedResults = results.filter(r => 
        r.status === 'fulfilled' && !r.value.success
      );
      
      // 일부 요청이 rate limit으로 실패할 수 있음
      if (failedResults.length > 0) {
        failedResults.forEach(result => {
          expect(['RATE_LIMIT_ERROR', 'API_ERROR']).toContain(result.value.error.code);
        });
      }
    }, 30000);

    test('should handle network timeouts', async () => {
      // Arrange - 타임아웃 설정을 매우 짧게 설정
      const shortTimeoutService = new NaverGeocodingService({ timeout: 1 });

      // Act
      const result = await shortTimeoutService.addressToCoordinates('서울특별시 중구 세종대로 110');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(['TIMEOUT_ERROR', 'NETWORK_ERROR']).toContain(result.error.code);
    });
  });

  describe('Performance Tests', () => {
    test('should complete geocoding within acceptable time', async () => {
      // Arrange
      const address = '서울특별시 중구 세종대로 110';
      const startTime = Date.now();

      // Act
      const result = await geocodingService.addressToCoordinates(address);
      const endTime = Date.now();

      // Assert
      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(5000); // 5초 이내
    });

    test('should complete route calculation within acceptable time', async () => {
      // Arrange
      const start = { latitude: 37.5665, longitude: 126.9780 };
      const goal = { latitude: 37.5651, longitude: 126.9895 };
      const startTime = Date.now();

      // Act
      const result = await directionsService.calculateRoute(start, goal);
      const endTime = Date.now();

      // Assert
      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(10000); // 10초 이내
    });

    test('should handle concurrent requests efficiently', async () => {
      // Arrange
      const addresses = [
        '서울특별시 중구 세종대로 110',
        '서울특별시 강남구 테헤란로 152',
        '서울특별시 마포구 월드컵북로 396',
      ];
      const startTime = Date.now();

      // Act
      const results = await Promise.all(
        addresses.map(addr => geocodingService.addressToCoordinates(addr))
      );
      const endTime = Date.now();

      // Assert
      expect(results).toHaveLength(3);
      expect(endTime - startTime).toBeLessThan(15000); // 15초 이내
      
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result).toHaveProperty('success');
      });
    }, 20000);
  });
});