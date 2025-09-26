// data-normalization.test.js
// 한강홍수통제소 데이터 변환 로직 검증 단위 테스트

const DataNormalizationService = require('../../src/services/DataNormalizationService');
const FloodInfo = require('../../src/models/FloodInfo');

describe('DataNormalizationService', () => {
  let service;

  beforeEach(() => {
    service = new DataNormalizationService();
  });

  describe('normalizeWaterLevelData', () => {
    it('should normalize valid water level data', () => {
      const rawData = [
        {
          stationId: 'ST001',
          stationName: '한강대교',
          waterLevel: 2.5,
          alertLevel: 3.0,
          dangerLevel: 4.0,
          coordinates: { latitude: 37.5665, longitude: 126.9780 },
          timestamp: '2023-07-15T10:00:00Z',
        },
        {
          stationId: 'ST002',
          stationName: '잠수교',
          waterLevel: 1.8,
          alertLevel: 2.5,
          dangerLevel: 3.5,
          coordinates: { latitude: 37.5200, longitude: 127.0100 },
          timestamp: '2023-07-15T10:00:00Z',
        },
      ];

      const result = service.normalizeWaterLevelData(rawData);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(FloodInfo);
      expect(result[0].waterLevelData.stationId).toBe('ST001');
      expect(result[0].waterLevelData.stationName).toBe('한강대교');
      expect(result[0].alertType).toBe('주의보'); // 현재 수위가 주의 수위 미만
      expect(result[0].severity).toBe('low');
    });

    it('should handle invalid coordinates', () => {
      const rawData = [
        {
          stationId: 'ST001',
          stationName: '테스트',
          waterLevel: 2.5,
          coordinates: { latitude: null, longitude: null },
        },
        {
          stationId: 'ST002',
          stationName: '테스트2',
          waterLevel: 1.8,
          coordinates: { latitude: 'invalid', longitude: 'invalid' },
        },
      ];

      const result = service.normalizeWaterLevelData(rawData);

      expect(result).toHaveLength(0); // 유효하지 않은 좌표로 인해 필터링됨
    });

    it('should determine correct alert type based on water levels', () => {
      const rawData = [
        {
          stationId: 'ST001',
          waterLevel: 4.5, // 위험 수위 초과
          alertLevel: 3.0,
          dangerLevel: 4.0,
          coordinates: { latitude: 37.5665, longitude: 126.9780 },
        },
        {
          stationId: 'ST002',
          waterLevel: 3.2, // 주의 수위 초과, 위험 수위 미만
          alertLevel: 3.0,
          dangerLevel: 4.0,
          coordinates: { latitude: 37.5200, longitude: 127.0100 },
        },
        {
          stationId: 'ST003',
          waterLevel: 2.5, // 정상 수위
          alertLevel: 3.0,
          dangerLevel: 4.0,
          coordinates: { latitude: 37.5100, longitude: 127.0200 },
        },
      ];

      const result = service.normalizeWaterLevelData(rawData);

      expect(result[0].alertType).toBe('특보'); // 위험 수위 초과
      expect(result[1].alertType).toBe('경보'); // 주의 수위 초과
      expect(result[2].alertType).toBe('주의보'); // 정상 수위
    });

    it('should handle empty or null input', () => {
      expect(service.normalizeWaterLevelData(null)).toEqual([]);
      expect(service.normalizeWaterLevelData(undefined)).toEqual([]);
      expect(service.normalizeWaterLevelData([])).toEqual([]);
    });
  });

  describe('normalizeRealtimeData', () => {
    it('should normalize valid realtime data', () => {
      const rawData = [
        {
          stationId: 'RT001',
          waterLevel: 2.3,
          flowRate: 150.5,
          coordinates: { latitude: 37.5665, longitude: 126.9780 },
          timestamp: '2023-07-15T10:00:00Z',
        },
      ];

      const result = service.normalizeRealtimeData(rawData);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(FloodInfo);
      expect(result[0].realtimeData.stationId).toBe('RT001');
      expect(result[0].realtimeData.waterLevel).toBe(2.3);
      expect(result[0].realtimeData.flowRate).toBe(150.5);
      expect(result[0].sources).toContain('realtime');
    });

    it('should determine alert type for realtime data', () => {
      const rawData = [
        {
          stationId: 'RT001',
          waterLevel: 6.0, // 높은 수위
          flowRate: 1200, // 높은 유량
          coordinates: { latitude: 37.5665, longitude: 126.9780 },
        },
        {
          stationId: 'RT002',
          waterLevel: 2.0, // 낮은 수위
          flowRate: 500, // 낮은 유량
          coordinates: { latitude: 37.5200, longitude: 127.0100 },
        },
      ];

      const result = service.normalizeRealtimeData(rawData);

      expect(result[0].alertType).toBe('경보'); // 높은 수위/유량
      expect(result[1].alertType).toBe('주의보'); // 낮은 수위/유량
    });
  });

  describe('normalizeForecastData', () => {
    it('should normalize valid forecast data', () => {
      const rawData = [
        {
          forecastId: 'FC001',
          region: '한강상류',
          alertType: '홍수경보',
          issueTime: '2023-07-15T09:00:00Z',
          validUntil: '2023-07-15T18:00:00Z',
          description: '한강 상류 지역에 홍수경보가 발령되었습니다.',
          coordinates: { latitude: 37.2636, longitude: 127.9784 },
        },
      ];

      const result = service.normalizeForecastData(rawData);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(FloodInfo);
      expect(result[0].forecastData.forecastId).toBe('FC001');
      expect(result[0].forecastData.region).toBe('한강상류');
      expect(result[0].alertType).toBe('경보');
      expect(result[0].sources).toContain('forecast');
    });

    it('should normalize alert types correctly', () => {
      const rawData = [
        {
          forecastId: 'FC001',
          alertType: '홍수특보',
          region: '한강상류',
          coordinates: { latitude: 37.2636, longitude: 127.9784 },
        },
        {
          forecastId: 'FC002',
          alertType: '홍수경보',
          region: '한강중류',
          coordinates: { latitude: 37.5665, longitude: 126.9780 },
        },
        {
          forecastId: 'FC003',
          alertType: '홍수주의보',
          region: '한강하류',
          coordinates: { latitude: 37.6358, longitude: 126.7794 },
        },
      ];

      const result = service.normalizeForecastData(rawData);

      expect(result[0].alertType).toBe('특보');
      expect(result[1].alertType).toBe('경보');
      expect(result[2].alertType).toBe('주의보');
    });

    it('should use region center coordinates when coordinates are missing', () => {
      const rawData = [
        {
          forecastId: 'FC001',
          region: '한강상류',
          alertType: '홍수주의보',
          // coordinates 없음
        },
      ];

      const result = service.normalizeForecastData(rawData);

      expect(result).toHaveLength(1);
      expect(result[0].latitude).toBeCloseTo(37.2636, 3); // 한강상류 중심 좌표
      expect(result[0].longitude).toBeCloseTo(127.9784, 3);
    });
  });

  describe('normalizeCoordinates', () => {
    it('should normalize valid WGS84 coordinates', () => {
      const coordinates = { latitude: 37.5665, longitude: 126.9780 };
      
      const result = service.normalizeCoordinates(coordinates);

      expect(result).not.toBeNull();
      expect(result.latitude).toBeCloseTo(37.5665, 6);
      expect(result.longitude).toBeCloseTo(126.9780, 6);
    });

    it('should handle TM coordinates conversion', () => {
      const coordinates = { latitude: 500000, longitude: 1200000 }; // TM 좌표
      
      const result = service.normalizeCoordinates(coordinates);

      expect(result).not.toBeNull();
      expect(result.latitude).toBeGreaterThan(30);
      expect(result.latitude).toBeLessThan(40);
      expect(result.longitude).toBeGreaterThan(120);
      expect(result.longitude).toBeLessThan(135);
    });

    it('should reject coordinates outside Korean bounds', () => {
      const coordinates = { latitude: 50.0, longitude: 150.0 }; // 한국 밖
      
      const result = service.normalizeCoordinates(coordinates);

      expect(result).toBeNull();
    });

    it('should handle invalid coordinates', () => {
      expect(service.normalizeCoordinates(null)).toBeNull();
      expect(service.normalizeCoordinates({})).toBeNull();
      expect(service.normalizeCoordinates({ latitude: 'invalid', longitude: 'invalid' })).toBeNull();
      expect(service.normalizeCoordinates({ latitude: NaN, longitude: NaN })).toBeNull();
    });
  });

  describe('mergeMultiSourceData', () => {
    it('should merge data from multiple sources', () => {
      const waterLevelData = [
        new FloodInfo({
          latitude: 37.5665,
          longitude: 126.9780,
          alertType: '주의보',
          severity: 'low',
          sources: ['waterlevel'],
          waterLevelData: { stationId: 'ST001' },
        }),
      ];

      const realtimeData = [
        new FloodInfo({
          latitude: 37.5665,
          longitude: 126.9780,
          alertType: '경보',
          severity: 'medium',
          sources: ['realtime'],
          realtimeData: { stationId: 'RT001' },
        }),
      ];

      const forecastData = [];

      const result = service.mergeMultiSourceData(waterLevelData, realtimeData, forecastData);

      expect(result).toHaveLength(1); // 같은 위치이므로 병합됨
      expect(result[0].sources).toContain('waterlevel');
      expect(result[0].sources).toContain('realtime');
      expect(result[0].alertType).toBe('경보'); // 더 심각한 경보 유형
      expect(result[0].severity).toBe('medium'); // 더 심각한 심각도
      expect(result[0].waterLevelData).toBeDefined();
      expect(result[0].realtimeData).toBeDefined();
    });

    it('should keep separate data for different locations', () => {
      const waterLevelData = [
        new FloodInfo({
          latitude: 37.5665,
          longitude: 126.9780,
          alertType: '주의보',
          severity: 'low',
          sources: ['waterlevel'],
        }),
      ];

      const realtimeData = [
        new FloodInfo({
          latitude: 37.5200, // 다른 위치
          longitude: 127.0100,
          alertType: '경보',
          severity: 'medium',
          sources: ['realtime'],
        }),
      ];

      const result = service.mergeMultiSourceData(waterLevelData, realtimeData, []);

      expect(result).toHaveLength(2); // 다른 위치이므로 별도 유지
    });
  });

  describe('validateDataQuality', () => {
    it('should validate data quality correctly', () => {
      const floodInfos = [
        new FloodInfo({
          latitude: 37.5665,
          longitude: 126.9780,
          alertType: '주의보',
          severity: 'low',
          timestamp: new Date().toISOString(),
        }),
        new FloodInfo({
          latitude: 37.5200,
          longitude: 127.0100,
          alertType: '경보',
          severity: 'medium',
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2일 전
        }),
      ];

      const quality = service.validateDataQuality(floodInfos);

      expect(quality.totalCount).toBe(2);
      expect(quality.validCount).toBe(2);
      expect(quality.invalidCount).toBe(0);
      expect(quality.statistics.timestampIssues).toBe(1); // 오래된 데이터 1개
      expect(quality.qualityScore).toBeGreaterThan(0);
    });

    it('should detect coordinate issues', () => {
      const floodInfos = [
        new FloodInfo({
          latitude: 50.0, // 한국 밖
          longitude: 150.0,
          alertType: '주의보',
          severity: 'low',
        }),
      ];

      const quality = service.validateDataQuality(floodInfos);

      expect(quality.statistics.coordinateIssues).toBe(1);
    });

    it('should detect duplicate locations', () => {
      const floodInfos = [
        new FloodInfo({
          latitude: 37.5665,
          longitude: 126.9780,
          alertType: '주의보',
          severity: 'low',
        }),
        new FloodInfo({
          latitude: 37.5665,
          longitude: 126.9780,
          alertType: '경보',
          severity: 'medium',
        }),
      ];

      const quality = service.validateDataQuality(floodInfos);

      expect(quality.statistics.duplicateIssues).toBe(1);
    });
  });
});