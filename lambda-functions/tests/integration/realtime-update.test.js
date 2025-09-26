// 실시간 업데이트 통합 테스트
// 한강홍수통제소 데이터 자동 갱신 및 클라이언트 알림 테스트

const { RealtimeUpdateService } = require('../../src/services/RealtimeUpdateService');
const { HanRiverAPIService } = require('../../src/services/HanRiverAPIService');
const { DynamoDBService } = require('../../src/services/DynamoDBService');

describe('Realtime Update Integration Tests', () => {
  let realtimeService;
  let hanRiverService;
  let dynamoService;

  beforeEach(() => {
    realtimeService = new RealtimeUpdateService();
    hanRiverService = new HanRiverAPIService();
    dynamoService = new DynamoDBService();
  });

  afterEach(async () => {
    // 테스트 후 정리
    if (realtimeService) {
      await realtimeService.stop();
    }
  });

  describe('Data Synchronization', () => {
    test('should fetch and update flood data periodically', async () => {
      // Arrange
      const updateInterval = 1000; // 1초 (테스트용)
      let updateCount = 0;
      
      const mockUpdateCallback = jest.fn(() => {
        updateCount++;
      });

      // Act
      await realtimeService.start({
        interval: updateInterval,
        onUpdate: mockUpdateCallback,
      });

      // Wait for multiple updates
      await new Promise(resolve => setTimeout(resolve, 3500));

      // Assert
      expect(updateCount).toBeGreaterThanOrEqual(3);
      expect(mockUpdateCallback).toHaveBeenCalled();
    }, 10000);

    test('should detect changes in Han River API data', async () => {
      // Arrange
      const initialData = await hanRiverService.fetchAllData();
      
      // Mock data change
      const changedData = {
        ...initialData,
        waterlevel: {
          ...initialData.waterlevel,
          data: initialData.waterlevel.data.map(item => ({
            ...item,
            waterLevel: item.waterLevel + 0.1, // 수위 증가
          })),
        },
      };

      // Act
      const changes = await realtimeService.detectChanges(initialData, changedData);

      // Assert
      expect(changes).toBeDefined();
      expect(changes.hasChanges).toBe(true);
      expect(changes.changedAPIs).toContain('waterlevel');
      expect(changes.changeDetails).toBeDefined();
      expect(changes.changeDetails.waterlevel).toHaveProperty('waterLevelChanges');
    });

    test('should update DynamoDB with new data', async () => {
      // Arrange
      const testData = {
        id: 'test-flood-001',
        locationId: 'test-loc-001',
        apiType: 'waterlevel',
        latitude: 37.5665,
        longitude: 126.9780,
        timestamp: new Date().toISOString(),
        status: 'active',
        data: {
          stationId: 'TEST001',
          stationName: '테스트관측소',
          waterLevel: 2.5,
          alertLevel: 3.0,
        },
      };

      // Act
      const result = await realtimeService.updateFloodData(testData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('id', testData.id);

      // Verify data was stored
      const storedData = await dynamoService.getFloodData(testData.id);
      expect(storedData).toBeDefined();
      expect(storedData.data.waterLevel).toBe(2.5);

      // Cleanup
      await dynamoService.deleteFloodData(testData.id);
    });

    test('should handle API failures gracefully during updates', async () => {
      // Arrange
      const originalFetch = hanRiverService.fetchAllData;
      hanRiverService.fetchAllData = jest.fn().mockRejectedValue(new Error('API Error'));

      let errorCount = 0;
      const errorCallback = jest.fn(() => {
        errorCount++;
      });

      // Act
      await realtimeService.start({
        interval: 1000,
        onError: errorCallback,
      });

      await new Promise(resolve => setTimeout(resolve, 2500));

      // Assert
      expect(errorCount).toBeGreaterThan(0);
      expect(errorCallback).toHaveBeenCalled();

      // Cleanup
      hanRiverService.fetchAllData = originalFetch;
    }, 5000);

    test('should batch multiple updates efficiently', async () => {
      // Arrange
      const updates = [
        {
          id: 'batch-001',
          locationId: 'batch-loc-001',
          apiType: 'waterlevel',
          data: { waterLevel: 2.1 },
        },
        {
          id: 'batch-002',
          locationId: 'batch-loc-002',
          apiType: 'realtime',
          data: { waterLevel: 2.3 },
        },
        {
          id: 'batch-003',
          locationId: 'batch-loc-003',
          apiType: 'forecast',
          data: { alertType: '주의보' },
        },
      ];

      // Act
      const startTime = Date.now();
      const results = await realtimeService.batchUpdateFloodData(updates);
      const endTime = Date.now();

      // Assert
      expect(results).toHaveLength(3);
      expect(results.every(r => r.success)).toBe(true);
      expect(endTime - startTime).toBeLessThan(2000); // 배치 처리로 2초 이내

      // Cleanup
      await Promise.all(updates.map(u => dynamoService.deleteFloodData(u.id)));
    });
  });

  describe('Change Detection', () => {
    test('should detect water level threshold breaches', async () => {
      // Arrange
      const previousData = {
        stationId: 'TEST001',
        waterLevel: 2.8,
        alertLevel: 3.0,
        dangerLevel: 4.0,
      };

      const currentData = {
        stationId: 'TEST001',
        waterLevel: 3.2, // 주의 수위 초과
        alertLevel: 3.0,
        dangerLevel: 4.0,
      };

      // Act
      const alerts = await realtimeService.detectThresholdBreaches(previousData, currentData);

      // Assert
      expect(alerts).toBeDefined();
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0]).toHaveProperty('type', 'ALERT_LEVEL_BREACH');
      expect(alerts[0]).toHaveProperty('severity', 'medium');
      expect(alerts[0]).toHaveProperty('message');
    });

    test('should detect new flood warnings', async () => {
      // Arrange
      const previousForecast = [];
      const currentForecast = [
        {
          forecastId: 'FC001',
          region: '한강 중류',
          alertType: '경보',
          issueTime: new Date().toISOString(),
        },
      ];

      // Act
      const newAlerts = await realtimeService.detectNewAlerts(previousForecast, currentForecast);

      // Assert
      expect(newAlerts).toBeDefined();
      expect(newAlerts.length).toBe(1);
      expect(newAlerts[0]).toHaveProperty('type', 'NEW_FORECAST_ALERT');
      expect(newAlerts[0]).toHaveProperty('alertType', '경보');
    });

    test('should detect resolved flood conditions', async () => {
      // Arrange
      const previousData = [
        {
          id: 'flood-001',
          status: 'active',
          alertType: '주의보',
        },
      ];

      const currentData = [
        {
          id: 'flood-001',
          status: 'resolved',
          alertType: '주의보',
        },
      ];

      // Act
      const resolved = await realtimeService.detectResolvedConditions(previousData, currentData);

      // Assert
      expect(resolved).toBeDefined();
      expect(resolved.length).toBe(1);
      expect(resolved[0]).toHaveProperty('id', 'flood-001');
      expect(resolved[0]).toHaveProperty('type', 'CONDITION_RESOLVED');
    });

    test('should calculate data freshness and quality metrics', async () => {
      // Arrange
      const apiData = {
        waterlevel: {
          success: true,
          data: [{ timestamp: new Date(Date.now() - 300000).toISOString() }], // 5분 전
          timestamp: new Date().toISOString(),
        },
        realtime: {
          success: true,
          data: [{ timestamp: new Date(Date.now() - 60000).toISOString() }], // 1분 전
          timestamp: new Date().toISOString(),
        },
        forecast: {
          success: false,
          error: 'API Error',
          timestamp: new Date().toISOString(),
        },
      };

      // Act
      const metrics = await realtimeService.calculateDataQualityMetrics(apiData);

      // Assert
      expect(metrics).toBeDefined();
      expect(metrics).toHaveProperty('overallFreshness');
      expect(metrics).toHaveProperty('apiAvailability');
      expect(metrics).toHaveProperty('dataCompleteness');
      
      expect(metrics.apiAvailability).toBe(2/3); // 2 out of 3 APIs successful
      expect(metrics.stalestDataAge).toBeGreaterThan(0);
    });
  });

  describe('WebSocket Integration', () => {
    test('should establish WebSocket connections for real-time updates', async () => {
      // Arrange
      const mockWebSocketServer = {
        clients: new Set(),
        broadcast: jest.fn(),
      };

      // Act
      await realtimeService.initializeWebSocket(mockWebSocketServer);
      const connectionResult = await realtimeService.connectWebSocket();

      // Assert
      expect(connectionResult.success).toBe(true);
      expect(connectionResult.connectionId).toBeDefined();
    });

    test('should broadcast updates to connected clients', async () => {
      // Arrange
      const mockClients = [
        { send: jest.fn(), readyState: 1 }, // OPEN
        { send: jest.fn(), readyState: 1 }, // OPEN
        { send: jest.fn(), readyState: 3 }, // CLOSED
      ];

      const updateData = {
        type: 'FLOOD_DATA_UPDATE',
        data: {
          id: 'flood-001',
          waterLevel: 3.2,
          alertType: '경보',
        },
        timestamp: new Date().toISOString(),
      };

      // Act
      await realtimeService.broadcastUpdate(mockClients, updateData);

      // Assert
      expect(mockClients[0].send).toHaveBeenCalledWith(JSON.stringify(updateData));
      expect(mockClients[1].send).toHaveBeenCalledWith(JSON.stringify(updateData));
      expect(mockClients[2].send).not.toHaveBeenCalled(); // Closed connection
    });

    test('should handle WebSocket connection errors', async () => {
      // Arrange
      const mockClient = {
        send: jest.fn().mockImplementation(() => {
          throw new Error('Connection lost');
        }),
        readyState: 1,
      };

      const updateData = { type: 'TEST_UPDATE' };

      // Act & Assert
      await expect(
        realtimeService.sendToClient(mockClient, updateData)
      ).resolves.not.toThrow();

      // Should log error but not crash
      expect(mockClient.send).toHaveBeenCalled();
    });

    test('should maintain client connection registry', async () => {
      // Arrange
      const clientId1 = 'client-001';
      const clientId2 = 'client-002';

      // Act
      await realtimeService.registerClient(clientId1, { userId: 'user1' });
      await realtimeService.registerClient(clientId2, { userId: 'user2' });

      const activeClients = await realtimeService.getActiveClients();

      // Assert
      expect(activeClients).toHaveLength(2);
      expect(activeClients.map(c => c.id)).toContain(clientId1);
      expect(activeClients.map(c => c.id)).toContain(clientId2);

      // Cleanup
      await realtimeService.unregisterClient(clientId1);
      await realtimeService.unregisterClient(clientId2);
    });
  });

  describe('Performance and Scalability', () => {
    test('should handle high-frequency updates efficiently', async () => {
      // Arrange
      const updateCount = 100;
      const updates = Array.from({ length: updateCount }, (_, i) => ({
        id: `perf-test-${i}`,
        locationId: `loc-${i}`,
        apiType: 'waterlevel',
        data: { waterLevel: 2.0 + (i * 0.01) },
      }));

      // Act
      const startTime = Date.now();
      const results = await Promise.all(
        updates.map(update => realtimeService.updateFloodData(update))
      );
      const endTime = Date.now();

      // Assert
      expect(results).toHaveLength(updateCount);
      expect(results.every(r => r.success)).toBe(true);
      expect(endTime - startTime).toBeLessThan(5000); // 5초 이내

      // Cleanup
      await Promise.all(updates.map(u => dynamoService.deleteFloodData(u.id)));
    }, 10000);

    test('should implement rate limiting for API calls', async () => {
      // Arrange
      const rapidCalls = Array.from({ length: 10 }, () => 
        hanRiverService.fetchWaterLevelData()
      );

      // Act
      const startTime = Date.now();
      const results = await Promise.allSettled(rapidCalls);
      const endTime = Date.now();

      // Assert
      const successfulCalls = results.filter(r => r.status === 'fulfilled').length;
      const failedCalls = results.filter(r => r.status === 'rejected').length;

      // Some calls should be rate limited
      expect(successfulCalls + failedCalls).toBe(10);
      expect(endTime - startTime).toBeGreaterThan(1000); // Rate limiting adds delay
    }, 15000);

    test('should optimize database queries for bulk operations', async () => {
      // Arrange
      const bulkData = Array.from({ length: 50 }, (_, i) => ({
        id: `bulk-${i}`,
        locationId: `bulk-loc-${i}`,
        apiType: 'waterlevel',
        latitude: 37.5 + (i * 0.001),
        longitude: 126.9 + (i * 0.001),
        data: { waterLevel: 2.0 + (i * 0.01) },
      }));

      // Act
      const startTime = Date.now();
      const result = await realtimeService.bulkInsertFloodData(bulkData);
      const endTime = Date.now();

      // Assert
      expect(result.success).toBe(true);
      expect(result.insertedCount).toBe(50);
      expect(endTime - startTime).toBeLessThan(3000); // Bulk operation should be fast

      // Cleanup
      await realtimeService.bulkDeleteFloodData(bulkData.map(d => d.id));
    }, 10000);
  });

  describe('Error Recovery and Resilience', () => {
    test('should recover from temporary API outages', async () => {
      // Arrange
      let failureCount = 0;
      const originalFetch = hanRiverService.fetchWaterLevelData;
      
      hanRiverService.fetchWaterLevelData = jest.fn().mockImplementation(() => {
        failureCount++;
        if (failureCount <= 2) {
          throw new Error('Temporary API failure');
        }
        return originalFetch.call(hanRiverService);
      });

      // Act
      const result = await realtimeService.fetchWithRetry(
        () => hanRiverService.fetchWaterLevelData(),
        { maxRetries: 3, retryDelay: 100 }
      );

      // Assert
      expect(result.success).toBe(true);
      expect(failureCount).toBe(3); // Failed twice, succeeded on third try

      // Cleanup
      hanRiverService.fetchWaterLevelData = originalFetch;
    });

    test('should maintain data consistency during partial failures', async () => {
      // Arrange
      const mixedUpdates = [
        { id: 'success-1', data: { waterLevel: 2.1 } },
        { id: 'fail-1', data: null }, // This will fail
        { id: 'success-2', data: { waterLevel: 2.3 } },
      ];

      // Act
      const results = await realtimeService.batchUpdateWithRollback(mixedUpdates);

      // Assert
      expect(results.successCount).toBe(2);
      expect(results.failureCount).toBe(1);
      expect(results.rolledBack).toBe(false); // Partial success allowed

      // Verify successful updates exist
      const successData1 = await dynamoService.getFloodData('success-1');
      const successData2 = await dynamoService.getFloodData('success-2');
      
      expect(successData1).toBeDefined();
      expect(successData2).toBeDefined();

      // Cleanup
      await dynamoService.deleteFloodData('success-1');
      await dynamoService.deleteFloodData('success-2');
    });

    test('should implement circuit breaker for failing APIs', async () => {
      // Arrange
      const failingAPI = jest.fn().mockRejectedValue(new Error('API Down'));
      
      // Act - trigger circuit breaker
      const results = [];
      for (let i = 0; i < 10; i++) {
        try {
          await realtimeService.callWithCircuitBreaker('test-api', failingAPI);
        } catch (error) {
          results.push({ attempt: i, error: error.message });
        }
      }

      // Assert
      expect(results.length).toBe(10);
      
      // After threshold, should get circuit breaker errors instead of API errors
      const circuitBreakerErrors = results.filter(r => 
        r.error.includes('Circuit breaker')
      );
      expect(circuitBreakerErrors.length).toBeGreaterThan(0);
    });

    test('should handle database connection failures gracefully', async () => {
      // Arrange
      const originalPut = dynamoService.putItem;
      dynamoService.putItem = jest.fn().mockRejectedValue(new Error('DB Connection Lost'));

      const testData = {
        id: 'db-fail-test',
        data: { waterLevel: 2.5 },
      };

      // Act
      const result = await realtimeService.updateFloodDataWithFallback(testData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.fallbackUsed).toBe(true);
      expect(result.error).toContain('DB Connection Lost');

      // Cleanup
      dynamoService.putItem = originalPut;
    });
  });

  describe('Monitoring and Alerting', () => {
    test('should track update performance metrics', async () => {
      // Arrange
      const testUpdates = Array.from({ length: 10 }, (_, i) => ({
        id: `metrics-${i}`,
        data: { waterLevel: 2.0 + i * 0.1 },
      }));

      // Act
      await Promise.all(testUpdates.map(u => realtimeService.updateFloodData(u)));
      const metrics = await realtimeService.getPerformanceMetrics();

      // Assert
      expect(metrics).toBeDefined();
      expect(metrics).toHaveProperty('totalUpdates');
      expect(metrics).toHaveProperty('averageUpdateTime');
      expect(metrics).toHaveProperty('successRate');
      expect(metrics).toHaveProperty('errorRate');
      
      expect(metrics.totalUpdates).toBeGreaterThanOrEqual(10);
      expect(metrics.successRate).toBeGreaterThan(0);

      // Cleanup
      await Promise.all(testUpdates.map(u => dynamoService.deleteFloodData(u.id)));
    });

    test('should generate health check reports', async () => {
      // Act
      const healthReport = await realtimeService.generateHealthReport();

      // Assert
      expect(healthReport).toBeDefined();
      expect(healthReport).toHaveProperty('status');
      expect(healthReport).toHaveProperty('services');
      expect(healthReport).toHaveProperty('lastUpdate');
      expect(healthReport).toHaveProperty('dataFreshness');
      
      expect(healthReport.services).toHaveProperty('hanRiverAPI');
      expect(healthReport.services).toHaveProperty('dynamoDB');
      expect(healthReport.services).toHaveProperty('webSocket');
    });

    test('should alert on data staleness', async () => {
      // Arrange
      const staleThreshold = 300000; // 5 minutes
      const staleData = {
        timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
      };

      // Act
      const alerts = await realtimeService.checkDataStaleness(staleData, staleThreshold);

      // Assert
      expect(alerts).toBeDefined();
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0]).toHaveProperty('type', 'DATA_STALENESS');
      expect(alerts[0]).toHaveProperty('severity', 'warning');
      expect(alerts[0]).toHaveProperty('age');
      expect(alerts[0].age).toBeGreaterThan(staleThreshold);
    });
  });
});