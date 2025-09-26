// DataNormalizationService 구현
// 한강홍수통제소 3개 API 데이터의 좌표 표준화 서비스 (원본 정보 보존)

const { info, error, debug, warn } = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

/**
 * 데이터 정규화 서비스 클래스
 */
class DataNormalizationService {
  constructor() {
    this.coordinateSystem = 'WGS84';
    this.defaultPrecision = 6; // 소수점 6자리 (약 0.1m 정확도)
  }

  /**
   * 수위관측소 데이터 정규화
   * @param {Array} rawData - 원본 수위관측소 데이터
   * @returns {Array} 정규화된 데이터
   */
  normalizeWaterLevelData(rawData) {
    try {
      debug('Normalizing water level data', { count: rawData?.length });

      if (!Array.isArray(rawData)) {
        throw new Error('Water level data must be an array');
      }

      const normalizedData = rawData.map(item => {
        const coordinates = this.normalizeCoordinates(item.coordinates);
        
        return {
          id: uuidv4(),
          locationId: coordinates ? this.generateLocationId(coordinates.latitude, coordinates.longitude) : null,
          apiType: 'waterlevel',
          latitude: coordinates?.latitude || null,
          longitude: coordinates?.longitude || null,
          timestamp: item.timestamp || new Date().toISOString(),
          status: 'active',
          originalData: item,
          normalizedAt: new Date().toISOString(),
          dataSource: 'hanriver-waterlevel',
          metadata: {
            stationId: item.stationId,
            stationName: item.stationName,
            coordinateSystem: this.coordinateSystem,
            normalizationVersion: '1.0',
          },
        };
      }).filter(item => item.latitude && item.longitude); // 좌표가 있는 데이터만 포함

      info('Water level data normalized', { 
        originalCount: rawData.length,
        normalizedCount: normalizedData.length,
        filteredCount: rawData.length - normalizedData.length,
      });

      return normalizedData;
    } catch (err) {
      error('Failed to normalize water level data', err, { rawDataCount: rawData?.length });
      throw new Error(`Water level data normalization failed: ${err.message}`);
    }
  }

  /**
   * 실시간 수위 데이터 정규화
   * @param {Array} rawData - 원본 실시간 수위 데이터
   * @returns {Array} 정규화된 데이터
   */
  normalizeRealtimeData(rawData) {
    try {
      debug('Normalizing realtime data', { count: rawData?.length });

      if (!Array.isArray(rawData)) {
        throw new Error('Realtime data must be an array');
      }

      const normalizedData = rawData.map(item => {
        const coordinates = this.normalizeCoordinates(item.coordinates);
        
        return {
          id: uuidv4(),
          locationId: coordinates ? this.generateLocationId(coordinates.latitude, coordinates.longitude) : null,
          apiType: 'realtime',
          latitude: coordinates?.latitude || null,
          longitude: coordinates?.longitude || null,
          timestamp: item.timestamp || new Date().toISOString(),
          status: 'active',
          originalData: item,
          normalizedAt: new Date().toISOString(),
          dataSource: 'hanriver-realtime',
          metadata: {
            stationId: item.stationId,
            coordinateSystem: this.coordinateSystem,
            normalizationVersion: '1.0',
          },
        };
      }).filter(item => item.latitude && item.longitude);

      info('Realtime data normalized', { 
        originalCount: rawData.length,
        normalizedCount: normalizedData.length,
        filteredCount: rawData.length - normalizedData.length,
      });

      return normalizedData;
    } catch (err) {
      error('Failed to normalize realtime data', err, { rawDataCount: rawData?.length });
      throw new Error(`Realtime data normalization failed: ${err.message}`);
    }
  }

  /**
   * 홍수예보발령 데이터 정규화
   * @param {Array} rawData - 원본 홍수예보발령 데이터
   * @returns {Array} 정규화된 데이터
   */
  normalizeForecastData(rawData) {
    try {
      debug('Normalizing forecast data', { count: rawData?.length });

      if (!Array.isArray(rawData)) {
        throw new Error('Forecast data must be an array');
      }

      const normalizedData = rawData.map(item => {
        const coordinates = this.normalizeCoordinates(item.coordinates) || 
                           this.estimateCoordinatesFromRegion(item.region);
        
        return {
          id: uuidv4(),
          locationId: coordinates ? this.generateLocationId(coordinates.latitude, coordinates.longitude) : null,
          apiType: 'forecast',
          latitude: coordinates?.latitude || null,
          longitude: coordinates?.longitude || null,
          timestamp: item.issueTime || new Date().toISOString(),
          status: this.determineForecastStatus(item),
          originalData: item,
          normalizedAt: new Date().toISOString(),
          dataSource: 'hanriver-forecast',
          metadata: {
            forecastId: item.forecastId,
            region: item.region,
            alertType: item.alertType,
            coordinateSystem: this.coordinateSystem,
            normalizationVersion: '1.0',
            estimatedCoordinates: !item.coordinates && !!coordinates,
          },
        };
      }).filter(item => item.latitude && item.longitude);

      info('Forecast data normalized', { 
        originalCount: rawData.length,
        normalizedCount: normalizedData.length,
        filteredCount: rawData.length - normalizedData.length,
      });

      return normalizedData;
    } catch (err) {
      error('Failed to normalize forecast data', err, { rawDataCount: rawData?.length });
      throw new Error(`Forecast data normalization failed: ${err.message}`);
    }
  }

  /**
   * 좌표 정규화
   * @param {Object} coordinates - 원본 좌표
   * @returns {Object|null} 정규화된 좌표
   */
  normalizeCoordinates(coordinates) {
    if (!coordinates || typeof coordinates !== 'object') {
      return null;
    }

    const { latitude, longitude } = coordinates;

    // 좌표 유효성 검사
    if (!this.isValidCoordinate(latitude, longitude)) {
      return null;
    }

    // 좌표계 변환 (필요시)
    const converted = this.convertCoordinateSystem(latitude, longitude);

    // 정밀도 조정
    return {
      latitude: this.roundToPrecision(converted.latitude, this.defaultPrecision),
      longitude: this.roundToPrecision(converted.longitude, this.defaultPrecision),
      system: this.coordinateSystem,
      precision: this.defaultPrecision,
    };
  }

  /**
   * 좌표 유효성 검사
   * @param {number} latitude - 위도
   * @param {number} longitude - 경도
   * @returns {boolean} 유효성 여부
   */
  isValidCoordinate(latitude, longitude) {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return false;
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      return false;
    }

    // 전세계 좌표 범위
    if (latitude < -90 || latitude > 90) {
      return false;
    }

    if (longitude < -180 || longitude > 180) {
      return false;
    }

    // 한국 지역 좌표 범위 (선택적 검증)
    if (latitude < 33 || latitude > 39 || longitude < 124 || longitude > 132) {
      warn('Coordinates outside Korea region', { latitude, longitude });
    }

    return true;
  }

  /**
   * 좌표계 변환
   * @param {number} latitude - 위도
   * @param {number} longitude - 경도
   * @returns {Object} 변환된 좌표
   */
  convertCoordinateSystem(latitude, longitude) {
    // 현재는 WGS84만 지원
    // 필요시 다른 좌표계(예: EPSG:5179, EPSG:4326) 변환 로직 추가
    return { latitude, longitude };
  }

  /**
   * 정밀도 조정
   * @param {number} value - 값
   * @param {number} precision - 소수점 자릿수
   * @returns {number} 조정된 값
   */
  roundToPrecision(value, precision) {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  }

  /**
   * 위치 ID 생성
   * @param {number} latitude - 위도
   * @param {number} longitude - 경도
   * @returns {string} 위치 ID
   */
  generateLocationId(latitude, longitude) {
    // 소수점 4자리까지 반올림하여 약 11m 정확도로 그룹화
    const lat = this.roundToPrecision(latitude, 4);
    const lng = this.roundToPrecision(longitude, 4);
    
    return `loc_${lat}_${lng}`;
  }

  /**
   * 지역명으로부터 좌표 추정
   * @param {string} region - 지역명
   * @returns {Object|null} 추정 좌표
   */
  estimateCoordinatesFromRegion(region) {
    if (!region || typeof region !== 'string') {
      return null;
    }

    // 한강 유역 주요 지역 좌표 매핑
    const regionCoordinates = {
      '한강상류': { latitude: 37.2636, longitude: 127.9784 },
      '한강중류': { latitude: 37.5665, longitude: 126.9780 },
      '한강하류': { latitude: 37.7749, longitude: 126.6173 },
      '남한강': { latitude: 37.2636, longitude: 127.9784 },
      '북한강': { latitude: 37.7749, longitude: 127.4398 },
      '안양천': { latitude: 37.5172, longitude: 126.8955 },
      '중랑천': { latitude: 37.5985, longitude: 127.0473 },
      '탄천': { latitude: 37.4138, longitude: 127.1054 },
      '청계천': { latitude: 37.5693, longitude: 126.9784 },
      '서울': { latitude: 37.5665, longitude: 126.9780 },
      '인천': { latitude: 37.4563, longitude: 126.7052 },
      '경기': { latitude: 37.4138, longitude: 127.5183 },
      '강원': { latitude: 37.8228, longitude: 128.1555 },
      '충북': { latitude: 36.8, longitude: 127.7 },
    };

    // 지역명 매칭 (부분 문자열 포함)
    for (const [key, coords] of Object.entries(regionCoordinates)) {
      if (region.includes(key)) {
        debug('Estimated coordinates from region', { region, key, coords });
        return coords;
      }
    }

    // 기본값: 서울시청 좌표
    warn('Could not estimate coordinates from region, using default', { region });
    return { latitude: 37.5665, longitude: 126.9780 };
  }

  /**
   * 예보 상태 결정
   * @param {Object} forecastItem - 예보 아이템
   * @returns {string} 상태
   */
  determineForecastStatus(forecastItem) {
    if (!forecastItem.validUntil) {
      return 'active';
    }

    const validUntil = new Date(forecastItem.validUntil);
    const now = new Date();

    return validUntil > now ? 'active' : 'resolved';
  }

  /**
   * 배치 정규화
   * @param {Object} allApiData - 모든 API 데이터
   * @returns {Object} 정규화된 모든 데이터
   */
  normalizeAllData(allApiData) {
    try {
      debug('Starting batch normalization', { 
        apis: Object.keys(allApiData).filter(key => key !== 'metadata'),
      });

      const results = {
        waterlevel: [],
        realtime: [],
        forecast: [],
        metadata: {
          normalizedAt: new Date().toISOString(),
          totalOriginalItems: 0,
          totalNormalizedItems: 0,
          errors: [],
        },
      };

      // 수위관측소 데이터 정규화
      if (allApiData.waterlevel?.success && allApiData.waterlevel.data) {
        try {
          results.waterlevel = this.normalizeWaterLevelData(allApiData.waterlevel.data);
          results.metadata.totalOriginalItems += allApiData.waterlevel.data.length;
          results.metadata.totalNormalizedItems += results.waterlevel.length;
        } catch (err) {
          results.metadata.errors.push({
            apiType: 'waterlevel',
            error: err.message,
          });
        }
      }

      // 실시간 수위 데이터 정규화
      if (allApiData.realtime?.success && allApiData.realtime.data) {
        try {
          results.realtime = this.normalizeRealtimeData(allApiData.realtime.data);
          results.metadata.totalOriginalItems += allApiData.realtime.data.length;
          results.metadata.totalNormalizedItems += results.realtime.length;
        } catch (err) {
          results.metadata.errors.push({
            apiType: 'realtime',
            error: err.message,
          });
        }
      }

      // 홍수예보발령 데이터 정규화
      if (allApiData.forecast?.success && allApiData.forecast.data) {
        try {
          results.forecast = this.normalizeForecastData(allApiData.forecast.data);
          results.metadata.totalOriginalItems += allApiData.forecast.data.length;
          results.metadata.totalNormalizedItems += results.forecast.length;
        } catch (err) {
          results.metadata.errors.push({
            apiType: 'forecast',
            error: err.message,
          });
        }
      }

      info('Batch normalization completed', {
        totalOriginalItems: results.metadata.totalOriginalItems,
        totalNormalizedItems: results.metadata.totalNormalizedItems,
        errorCount: results.metadata.errors.length,
      });

      return results;
    } catch (err) {
      error('Failed to normalize all data', err);
      throw new Error(`Batch normalization failed: ${err.message}`);
    }
  }

  /**
   * 중복 데이터 제거
   * @param {Array} normalizedData - 정규화된 데이터 배열
   * @returns {Array} 중복 제거된 데이터
   */
  deduplicateData(normalizedData) {
    if (!Array.isArray(normalizedData)) {
      return [];
    }

    const seen = new Map();
    const deduplicated = [];

    normalizedData.forEach(item => {
      const key = `${item.locationId}_${item.apiType}`;
      
      if (!seen.has(key)) {
        seen.set(key, item);
        deduplicated.push(item);
      } else {
        // 더 최신 데이터로 교체
        const existing = seen.get(key);
        if (new Date(item.timestamp) > new Date(existing.timestamp)) {
          seen.set(key, item);
          const index = deduplicated.findIndex(d => d.id === existing.id);
          if (index !== -1) {
            deduplicated[index] = item;
          }
        }
      }
    });

    debug('Data deduplication completed', {
      originalCount: normalizedData.length,
      deduplicatedCount: deduplicated.length,
      removedCount: normalizedData.length - deduplicated.length,
    });

    return deduplicated;
  }

  /**
   * 데이터 품질 검증
   * @param {Array} normalizedData - 정규화된 데이터
   * @returns {Object} 품질 검증 결과
   */
  validateDataQuality(normalizedData) {
    const validation = {
      totalItems: normalizedData.length,
      validItems: 0,
      invalidItems: 0,
      issues: [],
      qualityScore: 0,
    };

    normalizedData.forEach((item, index) => {
      const itemIssues = [];

      // 필수 필드 검증
      if (!item.id) itemIssues.push('Missing ID');
      if (!item.locationId) itemIssues.push('Missing location ID');
      if (!item.latitude || !item.longitude) itemIssues.push('Missing coordinates');
      if (!item.timestamp) itemIssues.push('Missing timestamp');

      // 좌표 범위 검증
      if (item.latitude && (item.latitude < -90 || item.latitude > 90)) {
        itemIssues.push('Invalid latitude range');
      }
      if (item.longitude && (item.longitude < -180 || item.longitude > 180)) {
        itemIssues.push('Invalid longitude range');
      }

      // 타임스탬프 검증
      if (item.timestamp && isNaN(new Date(item.timestamp).getTime())) {
        itemIssues.push('Invalid timestamp format');
      }

      if (itemIssues.length === 0) {
        validation.validItems++;
      } else {
        validation.invalidItems++;
        validation.issues.push({
          index,
          itemId: item.id,
          issues: itemIssues,
        });
      }
    });

    validation.qualityScore = validation.totalItems > 0 ? 
      validation.validItems / validation.totalItems : 0;

    info('Data quality validation completed', {
      totalItems: validation.totalItems,
      validItems: validation.validItems,
      invalidItems: validation.invalidItems,
      qualityScore: validation.qualityScore,
    });

    return validation;
  }

  /**
   * 정규화 통계 생성
   * @param {Object} normalizedResults - 정규화 결과
   * @returns {Object} 통계 정보
   */
  generateNormalizationStats(normalizedResults) {
    const stats = {
      timestamp: new Date().toISOString(),
      apiStats: {},
      overall: {
        totalOriginalItems: 0,
        totalNormalizedItems: 0,
        successRate: 0,
        coordinateCompleteness: 0,
      },
    };

    Object.keys(normalizedResults).forEach(apiType => {
      if (apiType === 'metadata') return;

      const data = normalizedResults[apiType];
      const withCoordinates = data.filter(item => item.latitude && item.longitude).length;

      stats.apiStats[apiType] = {
        normalizedCount: data.length,
        coordinateCompleteness: data.length > 0 ? withCoordinates / data.length : 0,
        avgPrecision: this.calculateAveragePrecision(data),
      };

      stats.overall.totalNormalizedItems += data.length;
    });

    if (normalizedResults.metadata) {
      stats.overall.totalOriginalItems = normalizedResults.metadata.totalOriginalItems;
      stats.overall.successRate = stats.overall.totalOriginalItems > 0 ? 
        stats.overall.totalNormalizedItems / stats.overall.totalOriginalItems : 0;
    }

    // 전체 좌표 완성도
    const totalWithCoords = Object.values(stats.apiStats)
      .reduce((sum, api) => sum + (api.normalizedCount * api.coordinateCompleteness), 0);
    stats.overall.coordinateCompleteness = stats.overall.totalNormalizedItems > 0 ? 
      totalWithCoords / stats.overall.totalNormalizedItems : 0;

    return stats;
  }

  /**
   * 평균 정밀도 계산
   * @param {Array} data - 데이터 배열
   * @returns {number} 평균 정밀도
   */
  calculateAveragePrecision(data) {
    if (!data || data.length === 0) return 0;

    const precisions = data
      .filter(item => item.latitude && item.longitude)
      .map(item => {
        const latStr = item.latitude.toString();
        const lngStr = item.longitude.toString();
        const latPrecision = latStr.includes('.') ? latStr.split('.')[1].length : 0;
        const lngPrecision = lngStr.includes('.') ? lngStr.split('.')[1].length : 0;
        return Math.max(latPrecision, lngPrecision);
      });

    return precisions.length > 0 ? 
      precisions.reduce((sum, p) => sum + p, 0) / precisions.length : 0;
  }
}

module.exports = DataNormalizationService;