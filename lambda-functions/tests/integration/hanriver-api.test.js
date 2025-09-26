// 한강홍수통제소 API 통합 테스트
// 수위관측소, 실시간수위, 홍수예보발령 3개 API 개별 데이터 수집 테스트

const { HanRiverAPIService } = require('../../src/services/HanRiverAPIService');
const { DataNormalizationService } = require('../../src/services/DataNormalizationService');

describe('Han River API Integration Tests', () => {
  let hanRiverService;
  let normalizationService;

  beforeEach(() => {
    hanRiverService = new HanRiverAPIService();
    normalizationService = new DataNormalizationService();
  });

  describe('Water Level Station API', () => {
    test('should fetch water level station data successfully', async () => {
      // Act
      const result = await hanRiverService.fetchWaterLevelData();

      // Assert
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      
      if (result.data.length > 0) {
        const station = result.data[0];
        expect(station).toHaveProperty('stationId');
        expect(station).toHaveProperty('stationName');
        expect(station).toHaveProperty('waterLevel');
        expect(station).toHaveProperty('alertLevel');
        expect(station).toHaveProperty('dangerLevel');
        expect(station).toHaveProperty('timestamp');
        expect(station).toHaveProperty('coordinates');
        
        // 데이터 타입 검증
        expect(typeof station.stationId).toBe('string');
        expect(typeof station.stationName).toBe('string');
        expect(typeof station.waterLevel).toBe('number');
        expect(typeof station.alertLevel).toBe('number');
        expect(typeof station.dangerLevel).toBe('number');
        expect(station.coordinates).toHaveProperty('latitude');
        expect(station.coordinates).toHaveProperty('longitude');
      }
    }, 10000); // 10초 타임아웃

    test('should handle water level API errors gracefully', async () => {
      // Arrange - 잘못된 엔드포인트로 설정
      const originalEndpoint = process.env.HANRIVER_WATERLEVEL_ENDPOINT;
      process.env.HANRIVER_WATERLEVEL_ENDPOINT = '/invalid-endpoint';

      // Act
      const result = await hanRiverService.fetchWaterLevelData();

      // Assert
      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error.code).toBe('API_ERROR');

      // Cleanup
      process.env.HANRIVER_WATERLEVEL_ENDPOINT = originalEndpoint;
    });

    test('should normalize water level data correctly', async () => {
      // Arrange
      const rawData = await hanRiverService.fetchWaterLevelData();
      
      if (rawData.success && rawData.data.length > 0) {
        // Act
        const normalizedData = normalizationService.normalizeWaterLevelData(rawData.data);

        // Assert
        expect(normalizedData).toBeDefined();
        expect(Array.isArray(normalizedData)).toBe(true);
        
        normalizedData.forEach(item => {
          expect(item).toHaveProperty('id');
          expect(item).toHaveProperty('locationId');
          expect(item).toHaveProperty('apiType', 'waterlevel');
          expect(item).toHaveProperty('latitude');
          expect(item).toHaveProperty('longitude');
          expect(item).toHaveProperty('originalData');
          
          // 좌표 정규화 검증
          expect(item.latitude).toBeGreaterThanOrEqual(-90);
          expect(item.latitude).toBeLessThanOrEqual(90);
          expect(item.longitude).toBeGreaterThanOrEqual(-180);
          expect(item.longitude).toBeLessThanOrEqual(180);
        });
      }
    });
  });

  describe('Real-time Water Level API', () => {
    test('should fetch real-time water level data successfully', async () => {
      // Act
      const result = await hanRiverService.fetchRealtimeData();

      // Assert
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      
      if (result.data.length > 0) {
        const realtimeData = result.data[0];
        expect(realtimeData).toHaveProperty('stationId');
        expect(realtimeData).toHaveProperty('timestamp');
        expect(realtimeData).toHaveProperty('waterLevel');
        expect(realtimeData).toHaveProperty('flowRate');
        expect(realtimeData).toHaveProperty('coordinates');
        
        // 데이터 타입 검증
        expect(typeof realtimeData.stationId).toBe('string');
        expect(typeof realtimeData.waterLevel).toBe('number');
        expect(typeof realtimeData.flowRate).toBe('number');
        expect(realtimeData.coordinates).toHaveProperty('latitude');
        expect(realtimeData.coordinates).toHaveProperty('longitude');
      }
    }, 10000);

    test('should handle real-time API errors gracefully', async () => {
      // Arrange
      const originalEndpoint = process.env.HANRIVER_REALTIME_ENDPOINT;
      process.env.HANRIVER_REALTIME_ENDPOINT = '/invalid-endpoint';

      // Act
      const result = await hanRiverService.fetchRealtimeData();

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();

      // Cleanup
      process.env.HANRIVER_REALTIME_ENDPOINT = originalEndpoint;
    });

    test('should normalize real-time data correctly', async () => {
      // Arrange
      const rawData = await hanRiverService.fetchRealtimeData();
      
      if (rawData.success && rawData.data.length > 0) {
        // Act
        const normalizedData = normalizationService.normalizeRealtimeData(rawData.data);

        // Assert
        expect(normalizedData).toBeDefined();
        expect(Array.isArray(normalizedData)).toBe(true);
        
        normalizedData.forEach(item => {
          expect(item).toHaveProperty('apiType', 'realtime');
          expect(item).toHaveProperty('latitude');
          expect(item).toHaveProperty('longitude');
          expect(item).toHaveProperty('originalData');
        });
      }
    });
  });

  describe('Flood Forecast API', () => {
    test('should fetch flood forecast data successfully', async () => {
      // Act
      const result = await hanRiverService.fetchForecastData();

      // Assert
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      
      if (result.data.length > 0) {
        const forecast = result.data[0];
        expect(forecast).toHaveProperty('forecastId');
        expect(forecast).toHaveProperty('region');
        expect(forecast).toHaveProperty('alertType');
        expect(forecast).toHaveProperty('issueTime');
        expect(forecast).toHaveProperty('validUntil');
        expect(forecast).toHaveProperty('description');
        expect(forecast).toHaveProperty('coordinates');
        
        // 데이터 타입 검증
        expect(typeof forecast.forecastId).toBe('string');
        expect(typeof forecast.region).toBe('string');
        expect(['주의보', '경보', '특보']).toContain(forecast.alertType);
        expect(forecast.coordinates).toHaveProperty('latitude');
        expect(forecast.coordinates).toHaveProperty('longitude');
      }
    }, 10000);

    test('should handle forecast API errors gracefully', async () => {
      // Arrange
      const originalEndpoint = process.env.HANRIVER_FORECAST_ENDPOINT;
      process.env.HANRIVER_FORECAST_ENDPOINT = '/invalid-endpoint';

      // Act
      const result = await hanRiverService.fetchForecastData();

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();

      // Cleanup
      process.env.HANRIVER_FORECAST_ENDPOINT = originalEndpoint;
    });

    test('should normalize forecast data correctly', async () => {
      // Arrange
      const rawData = await hanRiverService.fetchForecastData();
      
      if (rawData.success && rawData.data.length > 0) {
        // Act
        const normalizedData = normalizationService.normalizeForecastData(rawData.data);

        // Assert
        expect(normalizedData).toBeDefined();
        expect(Array.isArray(normalizedData)).toBe(true);
        
        normalizedData.forEach(item => {
          expect(item).toHaveProperty('apiType', 'forecast');
          expect(item).toHaveProperty('latitude');
          expect(item).toHaveProperty('longitude');
          expect(item).toHaveProperty('originalData');
        });
      }
    });
  });

  describe('Combined API Data Collection', () => {
    test('should fetch all three APIs data simultaneously', async () => {
      // Act
      const results = await Promise.allSettled([
        hanRiverService.fetchWaterLevelData(),
        hanRiverService.fetchRealtimeData(),
        hanRiverService.fetchForecastData(),
      ]);

      // Assert
      expect(results).toHaveLength(3);
      
      results.forEach((result, index) => {
        const apiNames = ['waterlevel', 'realtime', 'forecast'];
        
        if (result.status === 'fulfilled') {
          expect(result.value).toBeDefined();
          expect(result.value).toHaveProperty('success');
          expect(result.value).toHaveProperty('data');
        } else {
          console.warn(`${apiNames[index]} API failed:`, result.reason);
        }
      });
    }, 15000);

    test('should collect and normalize all API data', async () => {
      // Act
      const allData = await hanRiverService.fetchAllData();

      // Assert
      expect(allData).toBeDefined();
      expect(allData).toHaveProperty('waterlevel');
      expect(allData).toHaveProperty('realtime');
      expect(allData).toHaveProperty('forecast');
      
      // 각 API 결과 검증
      Object.keys(allData).forEach(apiType => {
        const apiResult = allData[apiType];
        expect(apiResult).toHaveProperty('success');
        expect(apiResult).toHaveProperty('data');
        expect(apiResult).toHaveProperty('timestamp');
        
        if (apiResult.success) {
          expect(Array.isArray(apiResult.data)).toBe(true);
        }
      });
    }, 20000);

    test('should preserve original data structure', async () => {
      // Act
      const allData = await hanRiverService.fetchAllData();

      // Assert
      Object.keys(allData).forEach(apiType => {
        const apiResult = allData[apiType];
        
        if (apiResult.success && apiResult.data.length > 0) {
          const firstItem = apiResult.data[0];
          
          // 원본 데이터 구조가 보존되어야 함
          expect(firstItem).toBeDefined();
          expect(typeof firstItem).toBe('object');
          
          // API별 고유 필드 확인
          switch (apiType) {
            case 'waterlevel':
              expect(firstItem).toHaveProperty('stationName');
              break;
            case 'realtime':
              expect(firstItem).toHaveProperty('flowRate');
              break;
            case 'forecast':
              expect(firstItem).toHaveProperty('region');
              break;
          }
        }
      });
    });

    test('should handle partial API failures', async () => {
      // Arrange - 하나의 API만 실패하도록 설정
      const originalEndpoint = process.env.HANRIVER_WATERLEVEL_ENDPOINT;
      process.env.HANRIVER_WATERLEVEL_ENDPOINT = '/invalid-endpoint';

      // Act
      const allData = await hanRiverService.fetchAllData();

      // Assert
      expect(allData).toBeDefined();
      expect(allData.waterlevel.success).toBe(false);
      
      // 다른 API들은 성공할 수 있어야 함
      expect(allData.realtime).toHaveProperty('success');
      expect(allData.forecast).toHaveProperty('success');

      // Cleanup
      process.env.HANRIVER_WATERLEVEL_ENDPOINT = originalEndpoint;
    });

    test('should include API metadata', async () => {
      // Act
      const allData = await hanRiverService.fetchAllData();

      // Assert
      Object.keys(allData).forEach(apiType => {
        const apiResult = allData[apiType];
        expect(apiResult).toHaveProperty('apiType', apiType);
        expect(apiResult).toHaveProperty('timestamp');
        expect(apiResult).toHaveProperty('endpoint');
        
        if (apiResult.success) {
          expect(apiResult).toHaveProperty('dataCount');
          expect(typeof apiResult.dataCount).toBe('number');
        }
      });
    });
  });

  describe('Data Quality Validation', () => {
    test('should validate coordinate ranges', async () => {
      // Act
      const allData = await hanRiverService.fetchAllData();

      // Assert
      Object.keys(allData).forEach(apiType => {
        const apiResult = allData[apiType];
        
        if (apiResult.success && apiResult.data.length > 0) {
          apiResult.data.forEach(item => {
            if (item.coordinates) {
              expect(item.coordinates.latitude).toBeGreaterThanOrEqual(33); // 한국 최남단
              expect(item.coordinates.latitude).toBeLessThanOrEqual(39); // 한국 최북단
              expect(item.coordinates.longitude).toBeGreaterThanOrEqual(124); // 한국 최서단
              expect(item.coordinates.longitude).toBeLessThanOrEqual(132); // 한국 최동단
            }
          });
        }
      });
    });

    test('should validate timestamp formats', async () => {
      // Act
      const allData = await hanRiverService.fetchAllData();

      // Assert
      Object.keys(allData).forEach(apiType => {
        const apiResult = allData[apiType];
        
        if (apiResult.success && apiResult.data.length > 0) {
          apiResult.data.forEach(item => {
            if (item.timestamp) {
              const timestamp = new Date(item.timestamp);
              expect(timestamp).toBeInstanceOf(Date);
              expect(timestamp.getTime()).not.toBeNaN();
            }
          });
        }
      });
    });

    test('should validate required fields presence', async () => {
      // Act
      const allData = await hanRiverService.fetchAllData();

      // Assert
      const requiredFields = {
        waterlevel: ['stationId', 'stationName', 'waterLevel'],
        realtime: ['stationId', 'waterLevel', 'timestamp'],
        forecast: ['forecastId', 'region', 'alertType'],
      };

      Object.keys(allData).forEach(apiType => {
        const apiResult = allData[apiType];
        
        if (apiResult.success && apiResult.data.length > 0) {
          apiResult.data.forEach(item => {
            requiredFields[apiType].forEach(field => {
              expect(item).toHaveProperty(field);
              expect(item[field]).toBeDefined();
            });
          });
        }
      });
    });
  });
});