// MultiSourceDataService 구현
// 동일 지점의 여러 API 정보를 개별적으로 관리하는 서비스

const { info, error, debug, warn } = require('../utils/logger');
const FloodInfo = require('../models/FloodInfo');

/**
 * 다중 소스 데이터 관리 서비스 클래스
 */
class MultiSourceDataService {
  constructor(dynamoDBService) {
    this.dynamoDBService = dynamoDBService;
    this.proximityThreshold = 100; // 100m 이내는 같은 지점으로 간주
  }

  /**
   * 다중 소스 데이터 통합
   * @param {Object} normalizedData - 정규화된 데이터 (waterlevel, realtime, forecast)
   * @returns {Promise<Array>} 통합된 FloodInfo 배열
   */
  async integrateMultiSourceData(normalizedData) {
    try {
      debug('Starting multi-source data integration', {
        waterlevelCount: normalizedData.waterlevel?.length || 0,
        realtimeCount: normalizedData.realtime?.length || 0,
        forecastCount: normalizedData.forecast?.length || 0,
      });

      // 위치별로 데이터 그룹화
      const locationGroups = this.groupDataByLocation(normalizedData);
      
      // 각 위치별로 FloodInfo 생성
      const integratedData = [];
      
      for (const [locationId, locationData] of locationGroups.entries()) {
        try {
          const floodInfo = await this.createFloodInfoFromLocationData(locationId, locationData);
          if (floodInfo) {
            integratedData.push(floodInfo);
          }
        } catch (err) {
          warn('Failed to create FloodInfo for location', { locationId, error: err.message });
        }
      }

      info('Multi-source data integration completed', {
        locationGroups: locationGroups.size,
        integratedItems: integratedData.length,
      });

      return integratedData;
    } catch (err) {
      error('Failed to integrate multi-source data', err);
      throw new Error(`Multi-source data integration failed: ${err.message}`);
    }
  }

  /**
   * 위치별 데이터 그룹화
   * @param {Object} normalizedData - 정규화된 데이터
   * @returns {Map} 위치별 그룹화된 데이터
   */
  groupDataByLocation(normalizedData) {
    const locationGroups = new Map();

    // 각 API 타입별로 처리
    ['waterlevel', 'realtime', 'forecast'].forEach(apiType => {
      const data = normalizedData[apiType] || [];
      
      data.forEach(item => {
        if (!item.locationId || !item.latitude || !item.longitude) {
          return;
        }

        // 기존 위치 그룹 찾기 또는 새로 생성
        let targetLocationId = item.locationId;
        let existingGroup = locationGroups.get(targetLocationId);

        // 근접한 위치가 있는지 확인
        if (!existingGroup) {
          targetLocationId = this.findNearbyLocation(item, locationGroups);
          existingGroup = locationGroups.get(targetLocationId);
        }

        if (!existingGroup) {
          existingGroup = {
            locationId: targetLocationId,
            latitude: item.latitude,
            longitude: item.longitude,
            waterlevel: [],
            realtime: [],
            forecast: [],
            sources: new Set(),
          };
          locationGroups.set(targetLocationId, existingGroup);
        }

        // 데이터 추가
        existingGroup[apiType].push(item);
        existingGroup.sources.add(apiType);

        // 좌표 업데이트 (더 정확한 좌표로)
        if (item.metadata?.coordinateSystem === 'WGS84') {
          existingGroup.latitude = item.latitude;
          existingGroup.longitude = item.longitude;
        }
      });
    });

    debug('Data grouped by location', {
      totalLocations: locationGroups.size,
      locationsWithMultipleSources: Array.from(locationGroups.values())
        .filter(group => group.sources.size > 1).length,
    });

    return locationGroups;
  }

  /**
   * 근접한 위치 찾기
   * @param {Object} item - 현재 아이템
   * @param {Map} locationGroups - 기존 위치 그룹들
   * @returns {string} 근접한 위치 ID 또는 현재 아이템의 위치 ID
   */
  findNearbyLocation(item, locationGroups) {
    for (const [locationId, group] of locationGroups.entries()) {
      const distance = FloodInfo.calculateDistance(
        item.latitude,
        item.longitude,
        group.latitude,
        group.longitude
      );

      if (distance <= this.proximityThreshold) {
        debug('Found nearby location', {
          itemLocationId: item.locationId,
          nearbyLocationId: locationId,
          distance,
        });
        return locationId;
      }
    }

    return item.locationId;
  }

  /**
   * 위치 데이터로부터 FloodInfo 생성
   * @param {string} locationId - 위치 ID
   * @param {Object} locationData - 위치별 데이터
   * @returns {Promise<FloodInfo>} FloodInfo 인스턴스
   */
  async createFloodInfoFromLocationData(locationId, locationData) {
    try {
      // 가장 최신 데이터 선택
      const waterLevelData = this.selectLatestData(locationData.waterlevel);
      const realtimeData = this.selectLatestData(locationData.realtime);
      const forecastData = this.selectLatestData(locationData.forecast);

      // FloodInfo 생성 옵션
      const options = {
        location: {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        },
        waterLevelData: waterLevelData?.originalData || null,
        realtimeData: realtimeData?.originalData || null,
        forecastData: forecastData?.originalData || null,
      };

      const floodInfo = FloodInfo.createFromMultiSource(options);

      // 추가 메타데이터 설정
      floodInfo.metadata = {
        ...floodInfo.metadata,
        dataSourceCount: locationData.sources.size,
        lastIntegration: new Date().toISOString(),
        sourceDetails: {
          waterlevel: locationData.waterlevel.length,
          realtime: locationData.realtime.length,
          forecast: locationData.forecast.length,
        },
      };

      // 주소 정보 추가 (가능한 경우)
      if (waterLevelData?.originalData?.stationName) {
        floodInfo.address = waterLevelData.originalData.stationName;
      } else if (forecastData?.originalData?.region) {
        floodInfo.address = forecastData.originalData.region;
      }

      debug('FloodInfo created from location data', {
        locationId,
        availableAPIs: floodInfo.availableAPIs,
        severity: floodInfo.severity,
        alertType: floodInfo.alertType,
      });

      return floodInfo;
    } catch (err) {
      error('Failed to create FloodInfo from location data', err, { locationId });
      throw err;
    }
  }

  /**
   * 최신 데이터 선택
   * @param {Array} dataArray - 데이터 배열
   * @returns {Object|null} 최신 데이터 또는 null
   */
  selectLatestData(dataArray) {
    if (!dataArray || dataArray.length === 0) {
      return null;
    }

    return dataArray.reduce((latest, current) => {
      if (!latest) return current;
      
      const latestTime = new Date(latest.timestamp).getTime();
      const currentTime = new Date(current.timestamp).getTime();
      
      return currentTime > latestTime ? current : latest;
    }, null);
  }

  /**
   * 특정 위치의 다중 소스 데이터 조회
   * @param {string} locationId - 위치 ID
   * @returns {Promise<Object>} 다중 소스 데이터
   */
  async getMultiSourceDataByLocation(locationId) {
    try {
      debug('Getting multi-source data by location', { locationId });

      // 위치별 모든 데이터 조회
      const locationData = await this.dynamoDBService.getItemsByLocation(locationId);
      
      if (!locationData.items || locationData.items.length === 0) {
        return {
          locationId,
          found: false,
          data: null,
        };
      }

      // API 타입별로 분류
      const multiSourceData = {
        locationId,
        latitude: null,
        longitude: null,
        waterLevelData: null,
        realtimeData: null,
        forecastData: null,
        availableAPIs: [],
        lastUpdated: null,
        dataCount: locationData.items.length,
      };

      locationData.items.forEach(item => {
        // 좌표 설정 (첫 번째 아이템에서)
        if (!multiSourceData.latitude && item.latitude) {
          multiSourceData.latitude = item.latitude;
          multiSourceData.longitude = item.longitude;
        }

        // API 타입별 데이터 설정
        if (item.apiType === 'waterlevel' && item.originalData) {
          if (!multiSourceData.waterLevelData || 
              new Date(item.timestamp) > new Date(multiSourceData.waterLevelData.timestamp)) {
            multiSourceData.waterLevelData = {
              ...item.originalData,
              timestamp: item.timestamp,
              normalizedAt: item.normalizedAt,
            };
          }
        } else if (item.apiType === 'realtime' && item.originalData) {
          if (!multiSourceData.realtimeData || 
              new Date(item.timestamp) > new Date(multiSourceData.realtimeData.timestamp)) {
            multiSourceData.realtimeData = {
              ...item.originalData,
              timestamp: item.timestamp,
              normalizedAt: item.normalizedAt,
            };
          }
        } else if (item.apiType === 'forecast' && item.originalData) {
          if (!multiSourceData.forecastData || 
              new Date(item.timestamp) > new Date(multiSourceData.forecastData.timestamp)) {
            multiSourceData.forecastData = {
              ...item.originalData,
              timestamp: item.timestamp,
              normalizedAt: item.normalizedAt,
            };
          }
        }

        // 사용 가능한 API 목록 업데이트
        if (!multiSourceData.availableAPIs.includes(item.apiType)) {
          multiSourceData.availableAPIs.push(item.apiType);
        }

        // 최신 업데이트 시간
        if (!multiSourceData.lastUpdated || 
            new Date(item.timestamp) > new Date(multiSourceData.lastUpdated)) {
          multiSourceData.lastUpdated = item.timestamp;
        }
      });

      info('Multi-source data retrieved', {
        locationId,
        availableAPIs: multiSourceData.availableAPIs,
        dataCount: multiSourceData.dataCount,
      });

      return {
        locationId,
        found: true,
        data: multiSourceData,
      };
    } catch (err) {
      error('Failed to get multi-source data by location', err, { locationId });
      throw new Error(`Failed to get multi-source data: ${err.message}`);
    }
  }

  /**
   * 위치 주변의 다중 소스 데이터 조회
   * @param {number} latitude - 위도
   * @param {number} longitude - 경도
   * @param {number} radiusMeters - 반경 (미터)
   * @returns {Promise<Array>} 주변 다중 소스 데이터 배열
   */
  async getMultiSourceDataNearby(latitude, longitude, radiusMeters = 5000) {
    try {
      debug('Getting nearby multi-source data', { latitude, longitude, radiusMeters });

      // 모든 활성 데이터 조회 (최적화 필요)
      const allData = await this.dynamoDBService.getItemsByStatus('active', {
        limit: 1000, // 제한 설정
      });

      if (!allData.items || allData.items.length === 0) {
        return [];
      }

      // 거리 기반 필터링
      const nearbyItems = allData.items.filter(item => {
        if (!item.latitude || !item.longitude) return false;

        const distance = FloodInfo.calculateDistance(
          latitude,
          longitude,
          item.latitude,
          item.longitude
        );

        return distance <= radiusMeters;
      });

      // 위치별로 그룹화
      const locationGroups = new Map();
      
      nearbyItems.forEach(item => {
        if (!locationGroups.has(item.locationId)) {
          locationGroups.set(item.locationId, []);
        }
        locationGroups.get(item.locationId).push(item);
      });

      // 각 위치별로 다중 소스 데이터 생성
      const nearbyMultiSourceData = [];
      
      for (const [locationId, items] of locationGroups.entries()) {
        try {
          const multiSourceResult = await this.getMultiSourceDataByLocation(locationId);
          if (multiSourceResult.found) {
            // 거리 정보 추가
            const distance = FloodInfo.calculateDistance(
              latitude,
              longitude,
              multiSourceResult.data.latitude,
              multiSourceResult.data.longitude
            );
            
            nearbyMultiSourceData.push({
              ...multiSourceResult.data,
              distance,
            });
          }
        } catch (err) {
          warn('Failed to get multi-source data for nearby location', { locationId, error: err.message });
        }
      }

      // 거리순 정렬
      nearbyMultiSourceData.sort((a, b) => a.distance - b.distance);

      info('Nearby multi-source data retrieved', {
        searchCenter: { latitude, longitude },
        radiusMeters,
        foundLocations: nearbyMultiSourceData.length,
      });

      return nearbyMultiSourceData;
    } catch (err) {
      error('Failed to get nearby multi-source data', err, { latitude, longitude, radiusMeters });
      throw new Error(`Failed to get nearby multi-source data: ${err.message}`);
    }
  }

  /**
   * 다중 소스 데이터 업데이트
   * @param {string} locationId - 위치 ID
   * @param {Object} newData - 새로운 데이터
   * @returns {Promise<Object>} 업데이트 결과
   */
  async updateMultiSourceData(locationId, newData) {
    try {
      debug('Updating multi-source data', { locationId, apiType: newData.apiType });

      // 기존 데이터 조회
      const existingData = await this.getMultiSourceDataByLocation(locationId);
      
      if (!existingData.found) {
        // 새로운 위치 데이터 생성
        const floodInfo = new FloodInfo({
          locationId,
          latitude: newData.latitude,
          longitude: newData.longitude,
          apiType: newData.apiType,
          timestamp: newData.timestamp,
          originalData: newData.originalData,
        });

        floodInfo.updateAvailableAPIs();
        
        const result = await this.dynamoDBService.putItem(floodInfo.toDynamoDBItem());
        
        info('New multi-source data created', { locationId, apiType: newData.apiType });
        
        return {
          success: true,
          action: 'created',
          data: floodInfo.toObject(),
        };
      }

      // 기존 데이터 업데이트
      const updateResult = await this.mergeNewDataWithExisting(existingData.data, newData);
      
      info('Multi-source data updated', { 
        locationId, 
        apiType: newData.apiType,
        action: updateResult.action,
      });
      
      return updateResult;
    } catch (err) {
      error('Failed to update multi-source data', err, { locationId });
      throw new Error(`Failed to update multi-source data: ${err.message}`);
    }
  }

  /**
   * 새 데이터와 기존 데이터 병합
   * @param {Object} existingData - 기존 데이터
   * @param {Object} newData - 새 데이터
   * @returns {Promise<Object>} 병합 결과
   */
  async mergeNewDataWithExisting(existingData, newData) {
    try {
      // 새 데이터가 더 최신인지 확인
      const existingApiData = existingData[`${newData.apiType}Data`];
      
      if (existingApiData && 
          new Date(existingApiData.timestamp) >= new Date(newData.timestamp)) {
        debug('New data is not newer than existing data', {
          locationId: existingData.locationId,
          apiType: newData.apiType,
          existingTimestamp: existingApiData.timestamp,
          newTimestamp: newData.timestamp,
        });
        
        return {
          success: true,
          action: 'skipped',
          reason: 'not_newer',
        };
      }

      // FloodInfo 객체 생성 및 업데이트
      const updatedOptions = {
        location: {
          latitude: existingData.latitude,
          longitude: existingData.longitude,
        },
        waterLevelData: existingData.waterLevelData,
        realtimeData: existingData.realtimeData,
        forecastData: existingData.forecastData,
      };

      // 새 데이터로 해당 API 데이터 교체
      updatedOptions[`${newData.apiType}Data`] = newData.originalData;

      const updatedFloodInfo = FloodInfo.createFromMultiSource(updatedOptions);
      updatedFloodInfo.locationId = existingData.locationId;

      // DynamoDB에 저장
      const saveResult = await this.dynamoDBService.putItem(updatedFloodInfo.toDynamoDBItem());

      return {
        success: true,
        action: 'updated',
        data: updatedFloodInfo.toObject(),
        isUpdate: saveResult.isUpdate,
      };
    } catch (err) {
      error('Failed to merge new data with existing', err);
      throw err;
    }
  }

  /**
   * 다중 소스 데이터 통계
   * @returns {Promise<Object>} 통계 정보
   */
  async getMultiSourceStatistics() {
    try {
      debug('Calculating multi-source statistics');

      // 전체 데이터 조회
      const allData = await this.dynamoDBService.scanItems({
        filterExpression: '#status = :status',
        expressionAttributeNames: { '#status': 'status' },
        expressionAttributeValues: { ':status': 'active' },
      });

      const stats = {
        timestamp: new Date().toISOString(),
        totalItems: allData.items.length,
        locationCount: 0,
        apiTypeDistribution: {
          waterlevel: 0,
          realtime: 0,
          forecast: 0,
        },
        multiSourceLocations: 0,
        averageSourcesPerLocation: 0,
        dataFreshness: {
          fresh: 0, // 1시간 이내
          stale: 0, // 1시간 초과
        },
      };

      if (allData.items.length === 0) {
        return stats;
      }

      // 위치별 그룹화
      const locationGroups = new Map();
      const now = Date.now();
      const freshnessThreshold = 3600000; // 1시간

      allData.items.forEach(item => {
        // API 타입별 분포
        if (stats.apiTypeDistribution[item.apiType] !== undefined) {
          stats.apiTypeDistribution[item.apiType]++;
        }

        // 위치별 그룹화
        if (!locationGroups.has(item.locationId)) {
          locationGroups.set(item.locationId, new Set());
        }
        locationGroups.get(item.locationId).add(item.apiType);

        // 데이터 신선도
        const age = now - new Date(item.timestamp).getTime();
        if (age <= freshnessThreshold) {
          stats.dataFreshness.fresh++;
        } else {
          stats.dataFreshness.stale++;
        }
      });

      stats.locationCount = locationGroups.size;

      // 다중 소스 위치 계산
      let totalSources = 0;
      locationGroups.forEach(sources => {
        totalSources += sources.size;
        if (sources.size > 1) {
          stats.multiSourceLocations++;
        }
      });

      stats.averageSourcesPerLocation = stats.locationCount > 0 ? 
        totalSources / stats.locationCount : 0;

      info('Multi-source statistics calculated', stats);

      return stats;
    } catch (err) {
      error('Failed to calculate multi-source statistics', err);
      throw new Error(`Failed to calculate statistics: ${err.message}`);
    }
  }

  /**
   * 오래된 데이터 정리
   * @param {number} maxAgeHours - 최대 보관 시간 (시간)
   * @returns {Promise<Object>} 정리 결과
   */
  async cleanupOldData(maxAgeHours = 24) {
    try {
      debug('Starting old data cleanup', { maxAgeHours });

      const cutoffTime = new Date(Date.now() - (maxAgeHours * 3600000)).toISOString();
      
      // 오래된 데이터 조회
      const oldData = await this.dynamoDBService.scanItems({
        filterExpression: '#timestamp < :cutoffTime',
        expressionAttributeNames: { '#timestamp': 'timestamp' },
        expressionAttributeValues: { ':cutoffTime': cutoffTime },
      });

      if (!oldData.items || oldData.items.length === 0) {
        info('No old data found for cleanup');
        return {
          success: true,
          deletedCount: 0,
          cutoffTime,
        };
      }

      // 배치 삭제
      const idsToDelete = oldData.items.map(item => item.id);
      const deleteResult = await this.dynamoDBService.batchDeleteItems(idsToDelete);

      info('Old data cleanup completed', {
        cutoffTime,
        foundItems: oldData.items.length,
        deletedItems: deleteResult.deletedItems,
        unprocessedItems: deleteResult.unprocessedItems.length,
      });

      return {
        success: true,
        deletedCount: deleteResult.deletedItems,
        unprocessedCount: deleteResult.unprocessedItems.length,
        cutoffTime,
      };
    } catch (err) {
      error('Failed to cleanup old data', err, { maxAgeHours });
      throw new Error(`Failed to cleanup old data: ${err.message}`);
    }
  }
}

module.exports = MultiSourceDataService;