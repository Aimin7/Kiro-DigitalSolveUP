// RealtimeUpdateService.js
// 한강홍수통제소 API 주기적 데이터 갱신 및 WebSocket 연결 서비스

const { info, error, debug, warn } = require('../utils/logger');
const HanRiverAPIService = require('./HanRiverAPIService');
const DataNormalizationService = require('./DataNormalizationService');
const MultiSourceDataService = require('./MultiSourceDataService');

/**
 * 실시간 업데이트 서비스 클래스
 */
class RealtimeUpdateService {
  constructor() {
    this.hanRiverService = new HanRiverAPIService();
    this.normalizationService = new DataNormalizationService();
    this.multiSourceService = new MultiSourceDataService();
    
    this.updateIntervals = new Map();
    this.subscribers = new Set();
    this.lastUpdateTimes = new Map();
    this.updateStats = {
      totalUpdates: 0,
      successfulUpdates: 0,
      failedUpdates: 0,
      lastUpdateTime: null,
    };
  }

  /**
   * 실시간 업데이트 시작
   * @param {Object} options - 업데이트 옵션
   * @returns {string} 업데이트 작업 ID
   */
  startRealtimeUpdates(options = {}) {
    const {
      interval = 300000, // 5분 기본값
      apiTypes = ['waterlevel', 'realtime', 'forecast'],
      region = null,
      onUpdate = null,
      onError = null,
    } = options;

    const updateId = this.generateUpdateId();
    
    debug('Starting realtime updates', {
      updateId,
      interval,
      apiTypes,
      region,
    });

    // 초기 업데이트 실행
    this.performUpdate(apiTypes, region, onUpdate, onError);

    // 주기적 업데이트 설정
    const intervalId = setInterval(() => {
      this.performUpdate(apiTypes, region, onUpdate, onError);
    }, interval);

    this.updateIntervals.set(updateId, {
      intervalId,
      options,
      startTime: Date.now(),
    });

    info('Realtime updates started', { updateId, interval });
    return updateId;
  }

  /**
   * 실시간 업데이트 중지
   * @param {string} updateId - 업데이트 작업 ID
   */
  stopRealtimeUpdates(updateId) {
    const updateInfo = this.updateIntervals.get(updateId);
    
    if (updateInfo) {
      clearInterval(updateInfo.intervalId);
      this.updateIntervals.delete(updateId);
      
      info('Realtime updates stopped', {
        updateId,
        duration: Date.now() - updateInfo.startTime,
      });
    }
  }

  /**
   * 모든 실시간 업데이트 중지
   */
  stopAllRealtimeUpdates() {
    this.updateIntervals.forEach((updateInfo, updateId) => {
      clearInterval(updateInfo.intervalId);
    });
    
    this.updateIntervals.clear();
    info('All realtime updates stopped');
  }

  /**
   * 업데이트 수행
   * @param {Array} apiTypes - API 타입 목록
   * @param {string} region - 지역 (선택사항)
   * @param {Function} onUpdate - 업데이트 콜백
   * @param {Function} onError - 오류 콜백
   */
  async performUpdate(apiTypes, region, onUpdate, onError) {
    const updateStartTime = Date.now();
    
    try {
      debug('Performing scheduled update', { apiTypes, region });
      
      this.updateStats.totalUpdates++;
      
      const updateResults = {
        timestamp: new Date().toISOString(),
        apiTypes,
        region,
        results: {},
        summary: {
          totalProcessed: 0,
          totalStored: 0,
          totalUpdated: 0,
          totalErrors: 0,
        },
      };

      // 각 API 타입별로 데이터 업데이트
      for (const apiType of apiTypes) {
        try {
          const result = await this.updateAPIData(apiType, region);
          updateResults.results[apiType] = result;
          
          updateResults.summary.totalProcessed += result.processed;
          updateResults.summary.totalStored += result.stored;
          updateResults.summary.totalUpdated += result.updated;
          updateResults.summary.totalErrors += result.errors;
          
          this.lastUpdateTimes.set(apiType, Date.now());
        } catch (err) {
          error(`Failed to update ${apiType} data`, err);
          
          updateResults.results[apiType] = {
            success: false,
            error: err.message,
            processed: 0,
            stored: 0,
            updated: 0,
            errors: 1,
          };
          
          updateResults.summary.totalErrors++;
        }
      }

      // 업데이트 통계 갱신
      this.updateStats.successfulUpdates++;
      this.updateStats.lastUpdateTime = new Date().toISOString();

      // 구독자들에게 업데이트 알림
      this.notifySubscribers('data_updated', updateResults);

      // 콜백 호출
      if (onUpdate) {
        onUpdate(updateResults);
      }

      info('Scheduled update completed', {
        duration: Date.now() - updateStartTime,
        summary: updateResults.summary,
      });

    } catch (err) {
      error('Scheduled update failed', err);
      
      this.updateStats.failedUpdates++;
      
      const errorResult = {
        timestamp: new Date().toISOString(),
        error: err.message,
        apiTypes,
        region,
      };

      // 구독자들에게 오류 알림
      this.notifySubscribers('update_error', errorResult);

      // 오류 콜백 호출
      if (onError) {
        onError(err);
      }
    }
  }

  /**
   * 특정 API 데이터 업데이트
   * @param {string} apiType - API 타입
   * @param {string} region - 지역 (선택사항)
   * @returns {Promise<Object>} 업데이트 결과
   */
  async updateAPIData(apiType, region) {
    debug(`Updating ${apiType} data`, { region });

    let rawData = [];
    let normalizedData = [];

    // API 타입별 데이터 수집
    switch (apiType) {
      case 'waterlevel':
        rawData = await this.hanRiverService.getWaterLevelStations(region);
        normalizedData = this.normalizationService.normalizeWaterLevelData(rawData);
        break;
        
      case 'realtime':
        rawData = await this.hanRiverService.getRealtimeWaterLevel(region);
        normalizedData = this.normalizationService.normalizeRealtimeData(rawData);
        break;
        
      case 'forecast':
        rawData = await this.hanRiverService.getFloodForecast(region);
        normalizedData = this.normalizationService.normalizeForecastData(rawData);
        break;
        
      default:
        throw new Error(`Unsupported API type: ${apiType}`);
    }

    if (normalizedData.length === 0) {
      return {
        success: true,
        apiType,
        processed: rawData.length,
        stored: 0,
        updated: 0,
        errors: 0,
        message: 'No valid data to store',
      };
    }

    // 다중 소스 데이터 저장
    const storeResult = await this.storeAPIData(apiType, normalizedData);

    return {
      success: true,
      apiType,
      processed: rawData.length,
      stored: storeResult.stored,
      updated: storeResult.updated,
      errors: storeResult.errors,
      dataQuality: {
        rawCount: rawData.length,
        normalizedCount: normalizedData.length,
        validationRate: normalizedData.length / rawData.length,
      },
    };
  }

  /**
   * API 데이터 저장
   * @param {string} apiType - API 타입
   * @param {Array} normalizedData - 정규화된 데이터
   * @returns {Promise<Object>} 저장 결과
   */
  async storeAPIData(apiType, normalizedData) {
    let storeResult;

    // API 타입별 저장 방식
    switch (apiType) {
      case 'waterlevel':
        storeResult = await this.multiSourceService.storeMultiSourceData(
          normalizedData, [], [] // 수위관측소 데이터만
        );
        break;
        
      case 'realtime':
        storeResult = await this.multiSourceService.storeMultiSourceData(
          [], normalizedData, [] // 실시간 데이터만
        );
        break;
        
      case 'forecast':
        storeResult = await this.multiSourceService.storeMultiSourceData(
          [], [], normalizedData // 예보 데이터만
        );
        break;
        
      default:
        throw new Error(`Unsupported API type for storage: ${apiType}`);
    }

    if (!storeResult.success) {
      throw new Error('Failed to store data to multi-source service');
    }

    return {
      stored: storeResult.results.statistics.newItems,
      updated: storeResult.results.statistics.updatedItems,
      errors: storeResult.results.statistics.errorItems,
    };
  }

  /**
   * 구독자 추가
   * @param {Function} callback - 알림 콜백
   * @returns {Function} 구독 해제 함수
   */
  subscribe(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    this.subscribers.add(callback);
    
    debug('Subscriber added', { totalSubscribers: this.subscribers.size });

    // 구독 해제 함수 반환
    return () => {
      this.subscribers.delete(callback);
      debug('Subscriber removed', { totalSubscribers: this.subscribers.size });
    };
  }

  /**
   * 구독자들에게 알림
   * @param {string} eventType - 이벤트 타입
   * @param {Object} data - 이벤트 데이터
   */
  notifySubscribers(eventType, data) {
    const notification = {
      eventType,
      timestamp: new Date().toISOString(),
      data,
    };

    this.subscribers.forEach(callback => {
      try {
        callback(notification);
      } catch (err) {
        error('Subscriber notification failed', err);
      }
    });

    debug('Subscribers notified', {
      eventType,
      subscriberCount: this.subscribers.size,
    });
  }

  /**
   * 데이터 변경 감지 및 알림
   * @param {Array} newData - 새로운 데이터
   * @param {Array} oldData - 기존 데이터
   * @returns {Object} 변경 사항
   */
  detectChanges(newData, oldData) {
    const changes = {
      added: [],
      updated: [],
      removed: [],
      unchanged: [],
    };

    const oldDataMap = new Map(oldData.map(item => [item.id, item]));
    const newDataMap = new Map(newData.map(item => [item.id, item]));

    // 새로 추가되거나 업데이트된 항목 찾기
    newData.forEach(newItem => {
      const oldItem = oldDataMap.get(newItem.id);
      
      if (!oldItem) {
        changes.added.push(newItem);
      } else if (this.hasDataChanged(newItem, oldItem)) {
        changes.updated.push({
          old: oldItem,
          new: newItem,
          changes: this.getFieldChanges(newItem, oldItem),
        });
      } else {
        changes.unchanged.push(newItem);
      }
    });

    // 제거된 항목 찾기
    oldData.forEach(oldItem => {
      if (!newDataMap.has(oldItem.id)) {
        changes.removed.push(oldItem);
      }
    });

    return changes;
  }

  /**
   * 데이터 변경 여부 확인
   * @param {Object} newItem - 새로운 아이템
   * @param {Object} oldItem - 기존 아이템
   * @returns {boolean} 변경 여부
   */
  hasDataChanged(newItem, oldItem) {
    // 중요 필드들만 비교
    const importantFields = [
      'alertType', 'severity', 'waterLevel', 'flowRate', 
      'alertLevel', 'dangerLevel', 'validUntil'
    ];

    return importantFields.some(field => {
      return newItem[field] !== oldItem[field];
    });
  }

  /**
   * 필드별 변경 사항 추출
   * @param {Object} newItem - 새로운 아이템
   * @param {Object} oldItem - 기존 아이템
   * @returns {Object} 변경된 필드들
   */
  getFieldChanges(newItem, oldItem) {
    const changes = {};
    
    Object.keys(newItem).forEach(key => {
      if (newItem[key] !== oldItem[key]) {
        changes[key] = {
          old: oldItem[key],
          new: newItem[key],
        };
      }
    });

    return changes;
  }

  /**
   * 업데이트 통계 조회
   * @returns {Object} 업데이트 통계
   */
  getUpdateStats() {
    return {
      ...this.updateStats,
      activeUpdates: this.updateIntervals.size,
      subscribers: this.subscribers.size,
      lastUpdateTimes: Object.fromEntries(this.lastUpdateTimes),
    };
  }

  /**
   * 활성 업데이트 목록 조회
   * @returns {Array} 활성 업데이트 목록
   */
  getActiveUpdates() {
    const activeUpdates = [];
    
    this.updateIntervals.forEach((updateInfo, updateId) => {
      activeUpdates.push({
        updateId,
        startTime: updateInfo.startTime,
        duration: Date.now() - updateInfo.startTime,
        options: updateInfo.options,
      });
    });

    return activeUpdates;
  }

  /**
   * 수동 업데이트 트리거
   * @param {Object} options - 업데이트 옵션
   * @returns {Promise<Object>} 업데이트 결과
   */
  async triggerManualUpdate(options = {}) {
    const {
      apiTypes = ['waterlevel', 'realtime', 'forecast'],
      region = null,
    } = options;

    info('Manual update triggered', { apiTypes, region });

    return new Promise((resolve, reject) => {
      this.performUpdate(
        apiTypes,
        region,
        (result) => resolve(result),
        (error) => reject(error)
      );
    });
  }

  /**
   * 헬스 체크
   * @returns {Object} 서비스 상태
   */
  healthCheck() {
    const now = Date.now();
    const stats = this.getUpdateStats();
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: now - (this.startTime || now),
      stats,
      issues: [],
    };

    // 최근 업데이트 확인
    if (stats.lastUpdateTime) {
      const lastUpdateAge = now - new Date(stats.lastUpdateTime).getTime();
      if (lastUpdateAge > 600000) { // 10분 이상
        health.issues.push('Last update is too old');
        health.status = 'warning';
      }
    }

    // 실패율 확인
    const failureRate = stats.totalUpdates > 0 ? 
      stats.failedUpdates / stats.totalUpdates : 0;
    
    if (failureRate > 0.5) {
      health.issues.push('High failure rate');
      health.status = 'unhealthy';
    }

    return health;
  }

  /**
   * 업데이트 ID 생성
   * @returns {string} 업데이트 ID
   */
  generateUpdateId() {
    return `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 서비스 시작 시간 설정
   */
  initialize() {
    this.startTime = Date.now();
    info('RealtimeUpdateService initialized');
  }

  /**
   * 서비스 정리
   */
  cleanup() {
    this.stopAllRealtimeUpdates();
    this.subscribers.clear();
    this.lastUpdateTimes.clear();
    
    info('RealtimeUpdateService cleaned up');
  }
}

module.exports = RealtimeUpdateService;