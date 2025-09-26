// FloodInfo 데이터 모델
// DynamoDB용 침수 정보 데이터 구조 및 검증 로직, availableAPIs 필드 포함

const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

/**
 * FloodInfo 데이터 모델 클래스
 */
class FloodInfo {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.locationId = data.locationId || this.generateLocationId(data.latitude, data.longitude);
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.alertType = data.alertType;
    this.severity = data.severity;
    this.timestamp = data.timestamp || new Date().toISOString();
    this.address = data.address;
    this.status = data.status || 'active';
    this.sources = data.sources || [];
    this.availableAPIs = data.availableAPIs || [];
    this.waterLevelData = data.waterLevelData || null;
    this.realtimeData = data.realtimeData || null;
    this.forecastData = data.forecastData || null;
    this.metadata = data.metadata || {};
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * 위치 기반 고유 ID 생성
   * @param {number} latitude - 위도
   * @param {number} longitude - 경도
   * @returns {string} 위치 ID
   */
  generateLocationId(latitude, longitude) {
    if (!latitude || !longitude) return null;
    
    // 소수점 4자리까지 반올림하여 약 11m 정확도로 위치 그룹화
    const lat = Math.round(latitude * 10000) / 10000;
    const lng = Math.round(longitude * 10000) / 10000;
    
    return `loc_${lat}_${lng}`;
  }

  /**
   * 심각도 레벨 계산
   * @param {Object} data - 침수 데이터
   * @returns {string} 심각도 (low, medium, high)
   */
  static calculateSeverity(data) {
    if (!data) return 'low';

    // 수위 데이터 기반 심각도 계산
    if (data.waterLevel && data.alertLevel && data.dangerLevel) {
      if (data.waterLevel >= data.dangerLevel) return 'high';
      if (data.waterLevel >= data.alertLevel) return 'medium';
      return 'low';
    }

    // 예보 데이터 기반 심각도 계산
    if (data.alertType) {
      switch (data.alertType) {
        case '특보': return 'high';
        case '경보': return 'medium';
        case '주의보': return 'low';
        default: return 'low';
      }
    }

    return 'low';
  }

  /**
   * 사용 가능한 API 목록 업데이트
   */
  updateAvailableAPIs() {
    const apis = [];
    
    if (this.waterLevelData) apis.push('waterlevel');
    if (this.realtimeData) apis.push('realtime');
    if (this.forecastData) apis.push('forecast');
    
    this.availableAPIs = apis;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * 데이터 유효성 검증
   * @returns {Object} 검증 결과
   */
  validate() {
    const schema = Joi.object({
      id: Joi.string().required(),
      locationId: Joi.string().required(),
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
      alertType: Joi.string().valid('주의보', '경보', '특보').required(),
      severity: Joi.string().valid('low', 'medium', 'high').required(),
      timestamp: Joi.string().isoDate().required(),
      address: Joi.string().allow(null),
      status: Joi.string().valid('active', 'resolved').default('active'),
      sources: Joi.array().items(Joi.string()),
      availableAPIs: Joi.array().items(Joi.string().valid('waterlevel', 'realtime', 'forecast')),
      waterLevelData: Joi.object().allow(null),
      realtimeData: Joi.object().allow(null),
      forecastData: Joi.object().allow(null),
      metadata: Joi.object().default({}),
      createdAt: Joi.string().isoDate().required(),
      updatedAt: Joi.string().isoDate().required(),
    });

    return schema.validate(this.toObject());
  }

  /**
   * DynamoDB 저장용 객체로 변환
   * @returns {Object} DynamoDB 아이템
   */
  toDynamoDBItem() {
    const item = {
      id: this.id,
      locationId: this.locationId,
      latitude: this.latitude,
      longitude: this.longitude,
      alertType: this.alertType,
      severity: this.severity,
      timestamp: this.timestamp,
      status: this.status,
      sources: this.sources,
      availableAPIs: this.availableAPIs,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };

    // null이 아닌 값만 포함
    if (this.address) item.address = this.address;
    if (this.waterLevelData) item.waterLevelData = this.waterLevelData;
    if (this.realtimeData) item.realtimeData = this.realtimeData;
    if (this.forecastData) item.forecastData = this.forecastData;

    return item;
  }

  /**
   * 일반 객체로 변환
   * @returns {Object} 일반 객체
   */
  toObject() {
    return {
      id: this.id,
      locationId: this.locationId,
      latitude: this.latitude,
      longitude: this.longitude,
      alertType: this.alertType,
      severity: this.severity,
      timestamp: this.timestamp,
      address: this.address,
      status: this.status,
      sources: this.sources,
      availableAPIs: this.availableAPIs,
      waterLevelData: this.waterLevelData,
      realtimeData: this.realtimeData,
      forecastData: this.forecastData,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * JSON 직렬화
   * @returns {Object} JSON 객체
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * DynamoDB 아이템에서 FloodInfo 인스턴스 생성
   * @param {Object} item - DynamoDB 아이템
   * @returns {FloodInfo} FloodInfo 인스턴스
   */
  static fromDynamoDBItem(item) {
    return new FloodInfo(item);
  }

  /**
   * 여러 API 데이터를 통합하여 FloodInfo 생성
   * @param {Object} options - 생성 옵션
   * @param {Object} options.location - 위치 정보 { latitude, longitude }
   * @param {Object} options.waterLevelData - 수위 관측소 데이터
   * @param {Object} options.realtimeData - 실시간 수위 데이터
   * @param {Object} options.forecastData - 홍수 예보 데이터
   * @returns {FloodInfo} FloodInfo 인스턴스
   */
  static createFromMultiSource(options) {
    const { location, waterLevelData, realtimeData, forecastData } = options;
    
    if (!location || !location.latitude || !location.longitude) {
      throw new Error('Location information is required');
    }

    // 가장 심각한 경보 유형 결정
    const alertTypes = [];
    if (waterLevelData?.alertType) alertTypes.push(waterLevelData.alertType);
    if (realtimeData?.alertType) alertTypes.push(realtimeData.alertType);
    if (forecastData?.alertType) alertTypes.push(forecastData.alertType);
    
    const alertType = FloodInfo.getMostSevereAlertType(alertTypes) || '주의보';
    
    // 심각도 계산
    const severityData = waterLevelData || realtimeData || forecastData || {};
    const severity = FloodInfo.calculateSeverity(severityData);

    // 소스 목록 생성
    const sources = [];
    if (waterLevelData) sources.push('waterlevel');
    if (realtimeData) sources.push('realtime');
    if (forecastData) sources.push('forecast');

    const floodInfo = new FloodInfo({
      latitude: location.latitude,
      longitude: location.longitude,
      alertType,
      severity,
      waterLevelData,
      realtimeData,
      forecastData,
      sources,
    });

    floodInfo.updateAvailableAPIs();
    
    return floodInfo;
  }

  /**
   * 가장 심각한 경보 유형 반환
   * @param {Array<string>} alertTypes - 경보 유형 배열
   * @returns {string} 가장 심각한 경보 유형
   */
  static getMostSevereAlertType(alertTypes) {
    if (!alertTypes || alertTypes.length === 0) return null;
    
    const severityOrder = { '특보': 3, '경보': 2, '주의보': 1 };
    
    return alertTypes.reduce((most, current) => {
      if (!most) return current;
      return severityOrder[current] > severityOrder[most] ? current : most;
    }, null);
  }

  /**
   * 두 FloodInfo 인스턴스 병합
   * @param {FloodInfo} other - 병합할 다른 FloodInfo
   * @returns {FloodInfo} 병합된 FloodInfo
   */
  merge(other) {
    if (!other || this.locationId !== other.locationId) {
      throw new Error('Cannot merge FloodInfo with different locations');
    }

    // 더 최신 데이터로 업데이트
    const merged = new FloodInfo({
      ...this.toObject(),
      ...other.toObject(),
      updatedAt: new Date().toISOString(),
    });

    // API 데이터 병합
    if (other.waterLevelData) merged.waterLevelData = other.waterLevelData;
    if (other.realtimeData) merged.realtimeData = other.realtimeData;
    if (other.forecastData) merged.forecastData = other.forecastData;

    // 소스 목록 병합
    merged.sources = [...new Set([...this.sources, ...other.sources])];
    
    merged.updateAvailableAPIs();
    
    return merged;
  }

  /**
   * 거리 계산 (Haversine 공식)
   * @param {number} lat1 - 첫 번째 위도
   * @param {number} lon1 - 첫 번째 경도
   * @param {number} lat2 - 두 번째 위도
   * @param {number} lon2 - 두 번째 경도
   * @returns {number} 거리 (미터)
   */
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // 지구 반지름 (미터)
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * 특정 위치로부터의 거리 계산
   * @param {number} latitude - 기준 위도
   * @param {number} longitude - 기준 경도
   * @returns {number} 거리 (미터)
   */
  getDistanceFrom(latitude, longitude) {
    return FloodInfo.calculateDistance(
      this.latitude,
      this.longitude,
      latitude,
      longitude
    );
  }

  /**
   * 데이터 신선도 확인
   * @param {number} maxAgeMs - 최대 허용 나이 (밀리초)
   * @returns {boolean} 신선한 데이터 여부
   */
  isFresh(maxAgeMs = 300000) { // 기본 5분
    const age = Date.now() - new Date(this.timestamp).getTime();
    return age <= maxAgeMs;
  }

  /**
   * 활성 상태 확인
   * @returns {boolean} 활성 상태 여부
   */
  isActive() {
    return this.status === 'active';
  }

  /**
   * 특정 API 데이터 존재 여부 확인
   * @param {string} apiType - API 타입 (waterlevel, realtime, forecast)
   * @returns {boolean} 데이터 존재 여부
   */
  hasAPIData(apiType) {
    return this.availableAPIs.includes(apiType);
  }
}

module.exports = FloodInfo;