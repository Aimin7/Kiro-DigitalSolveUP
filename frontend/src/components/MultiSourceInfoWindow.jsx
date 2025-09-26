// MultiSourceInfoWindow.jsx
// 3개 API 정보를 각각 구분하여 표시하는 상세 정보 팝업 컴포넌트

import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './MultiSourceInfoWindow.css'

/**
 * 다중 소스 정보 창 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.floodInfo - 홍수 정보 객체
 * @param {boolean} props.isOpen - 정보 창 열림 상태
 * @param {Function} props.onClose - 정보 창 닫기 핸들러
 * @param {Function} props.onRefresh - 데이터 새로고침 핸들러
 */
const MultiSourceInfoWindow = ({ 
  floodInfo, 
  isOpen, 
  onClose, 
  onRefresh 
}) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (isOpen && floodInfo) {
      // 첫 번째 사용 가능한 API 탭으로 설정
      const availableAPIs = floodInfo.availableAPIs || []
      if (availableAPIs.length > 0) {
        setActiveTab(availableAPIs[0])
      } else {
        setActiveTab('overview')
      }
    }
  }, [isOpen, floodInfo])

  if (!isOpen || !floodInfo) {
    return null
  }

  /**
   * 데이터 새로고침 처리
   */
  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true)
      try {
        await onRefresh(floodInfo.locationId)
      } finally {
        setIsRefreshing(false)
      }
    }
  }

  /**
   * 탭 변경 처리
   */
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
  }

  /**
   * 사용 가능한 탭 목록 생성
   */
  const getAvailableTabs = () => {
    const tabs = [
      { id: 'overview', label: '개요', icon: '📊' }
    ]

    if (floodInfo.availableAPIs?.includes('waterlevel')) {
      tabs.push({ id: 'waterlevel', label: '수위관측소', icon: '📏' })
    }

    if (floodInfo.availableAPIs?.includes('realtime')) {
      tabs.push({ id: 'realtime', label: '실시간수위', icon: '⏱️' })
    }

    if (floodInfo.availableAPIs?.includes('forecast')) {
      tabs.push({ id: 'forecast', label: '홍수예보', icon: '🌊' })
    }

    return tabs
  }

  return (
    <div className="multi-source-info-overlay" data-testid="multi-source-info-window">
      <div className="multi-source-info-window">
        {/* 헤더 */}
        <div className="info-window-header">
          <div className="header-left">
            <h3 className="info-window-title">
              홍수 정보 상세
            </h3>
            <div className="location-info">
              <span className="coordinates">
                {floodInfo.latitude.toFixed(4)}, {floodInfo.longitude.toFixed(4)}
              </span>
            </div>
          </div>
          <div className="header-right">
            <button 
              className="refresh-button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="데이터 새로고침"
            >
              {isRefreshing ? '⏳' : '🔄'}
            </button>
            <button 
              className="close-button"
              onClick={onClose}
              title="닫기"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 상태 표시 */}
        <div className="status-bar">
          <div className={`alert-badge alert-${floodInfo.alertType}`}>
            {floodInfo.alertType}
          </div>
          <div className={`severity-badge severity-${floodInfo.severity}`}>
            {getSeverityText(floodInfo.severity)}
          </div>
          <div className="timestamp">
            {formatTimestamp(floodInfo.timestamp)}
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="tab-navigation">
          {getAvailableTabs().map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <OverviewTab floodInfo={floodInfo} />
          )}
          {activeTab === 'waterlevel' && (
            <WaterLevelTab data={floodInfo.waterLevelData} />
          )}
          {activeTab === 'realtime' && (
            <RealtimeTab data={floodInfo.realtimeData} />
          )}
          {activeTab === 'forecast' && (
            <ForecastTab data={floodInfo.forecastData} />
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * 개요 탭 컴포넌트
 */
const OverviewTab = ({ floodInfo }) => (
  <div className="overview-tab" data-testid="overview-tab">
    <div className="overview-section">
      <h4>기본 정보</h4>
      <div className="info-grid">
        <div className="info-item">
          <label>위치 ID</label>
          <span>{floodInfo.locationId || 'N/A'}</span>
        </div>
        <div className="info-item">
          <label>좌표</label>
          <span>{floodInfo.latitude.toFixed(6)}, {floodInfo.longitude.toFixed(6)}</span>
        </div>
        <div className="info-item">
          <label>경보 유형</label>
          <span>{floodInfo.alertType}</span>
        </div>
        <div className="info-item">
          <label>심각도</label>
          <span>{getSeverityText(floodInfo.severity)}</span>
        </div>
      </div>
    </div>

    <div className="overview-section">
      <h4>데이터 소스</h4>
      <div className="sources-list">
        {floodInfo.sources?.map(source => (
          <div key={source} className="source-item">
            <span className="source-icon">{getSourceIcon(source)}</span>
            <span className="source-name">{getSourceName(source)}</span>
          </div>
        )) || <span className="no-data">데이터 소스 정보 없음</span>}
      </div>
    </div>

    <div className="overview-section">
      <h4>이용 가능한 API</h4>
      <div className="apis-list">
        {floodInfo.availableAPIs?.map(api => (
          <div key={api} className="api-item">
            <span className="api-icon">{getAPIIcon(api)}</span>
            <span className="api-name">{getAPIName(api)}</span>
          </div>
        )) || <span className="no-data">API 정보 없음</span>}
      </div>
    </div>
  </div>
)

/**
 * 수위관측소 탭 컴포넌트
 */
const WaterLevelTab = ({ data }) => {
  if (!data) {
    return (
      <div className="no-data-message" data-testid="no-waterlevel-data">
        수위관측소 데이터가 없습니다.
      </div>
    )
  }

  return (
    <div className="waterlevel-tab" data-testid="waterlevel-tab">
      <div className="data-section">
        <h4>관측소 정보</h4>
        <div className="info-grid">
          <div className="info-item">
            <label>관측소 ID</label>
            <span>{data.stationId || 'N/A'}</span>
          </div>
          <div className="info-item">
            <label>관측소명</label>
            <span>{data.stationName || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="data-section">
        <h4>수위 정보</h4>
        <div className="water-level-display">
          <div className="level-item current">
            <label>현재 수위</label>
            <span className="level-value">
              {data.waterLevel ? `${data.waterLevel}m` : 'N/A'}
            </span>
          </div>
          <div className="level-item alert">
            <label>주의 수위</label>
            <span className="level-value">
              {data.alertLevel ? `${data.alertLevel}m` : 'N/A'}
            </span>
          </div>
          <div className="level-item danger">
            <label>위험 수위</label>
            <span className="level-value">
              {data.dangerLevel ? `${data.dangerLevel}m` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div className="data-section">
        <h4>관측 시간</h4>
        <div className="timestamp-info">
          {data.timestamp ? formatTimestamp(data.timestamp) : 'N/A'}
        </div>
      </div>
    </div>
  )
}

/**
 * 실시간수위 탭 컴포넌트
 */
const RealtimeTab = ({ data }) => {
  if (!data) {
    return (
      <div className="no-data-message" data-testid="no-realtime-data">
        실시간수위 데이터가 없습니다.
      </div>
    )
  }

  return (
    <div className="realtime-tab" data-testid="realtime-tab">
      <div className="data-section">
        <h4>실시간 정보</h4>
        <div className="info-grid">
          <div className="info-item">
            <label>관측소 ID</label>
            <span>{data.stationId || 'N/A'}</span>
          </div>
          <div className="info-item">
            <label>관측 시간</label>
            <span>{data.timestamp ? formatTimestamp(data.timestamp) : 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="data-section">
        <h4>측정값</h4>
        <div className="measurement-display">
          <div className="measurement-item">
            <label>수위</label>
            <span className="measurement-value">
              {data.waterLevel ? `${data.waterLevel}m` : 'N/A'}
            </span>
          </div>
          <div className="measurement-item">
            <label>유량</label>
            <span className="measurement-value">
              {data.flowRate ? `${data.flowRate}㎥/s` : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 홍수예보 탭 컴포넌트
 */
const ForecastTab = ({ data }) => {
  if (!data) {
    return (
      <div className="no-data-message" data-testid="no-forecast-data">
        홍수예보 데이터가 없습니다.
      </div>
    )
  }

  return (
    <div className="forecast-tab" data-testid="forecast-tab">
      <div className="data-section">
        <h4>예보 정보</h4>
        <div className="info-grid">
          <div className="info-item">
            <label>예보 ID</label>
            <span>{data.forecastId || 'N/A'}</span>
          </div>
          <div className="info-item">
            <label>대상 지역</label>
            <span>{data.region || 'N/A'}</span>
          </div>
          <div className="info-item">
            <label>경보 유형</label>
            <span>{data.alertType || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="data-section">
        <h4>발령 시간</h4>
        <div className="time-info">
          <div className="time-item">
            <label>발령 시간</label>
            <span>{data.issueTime ? formatTimestamp(data.issueTime) : 'N/A'}</span>
          </div>
          <div className="time-item">
            <label>유효 시간</label>
            <span>{data.validUntil ? formatTimestamp(data.validUntil) : 'N/A'}</span>
          </div>
        </div>
      </div>

      {data.description && (
        <div className="data-section">
          <h4>상세 내용</h4>
          <div className="description-text">
            {data.description}
          </div>
        </div>
      )}
    </div>
  )
}

// 유틸리티 함수들
const getSeverityText = (severity) => {
  const severityMap = {
    'high': '높음',
    'medium': '보통', 
    'low': '낮음',
  }
  return severityMap[severity] || severity
}

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A'
  
  try {
    const date = new Date(timestamp)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch (error) {
    return timestamp
  }
}

const getSourceIcon = (source) => {
  const iconMap = {
    'waterlevel': '📏',
    'realtime': '⏱️',
    'forecast': '🌊',
  }
  return iconMap[source] || '📊'
}

const getSourceName = (source) => {
  const nameMap = {
    'waterlevel': '수위관측소',
    'realtime': '실시간수위',
    'forecast': '홍수예보발령',
  }
  return nameMap[source] || source
}

const getAPIIcon = (api) => {
  return getSourceIcon(api)
}

const getAPIName = (api) => {
  return getSourceName(api)
}

MultiSourceInfoWindow.propTypes = {
  floodInfo: PropTypes.shape({
    id: PropTypes.string,
    locationId: PropTypes.string,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    alertType: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
    timestamp: PropTypes.string,
    sources: PropTypes.arrayOf(PropTypes.string),
    availableAPIs: PropTypes.arrayOf(PropTypes.string),
    waterLevelData: PropTypes.object,
    realtimeData: PropTypes.object,
    forecastData: PropTypes.object,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRefresh: PropTypes.func,
}

export default MultiSourceInfoWindow