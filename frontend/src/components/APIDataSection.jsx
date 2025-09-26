// APIDataSection.jsx
// 개별 API(수위관측소/실시간수위/홍수예보발령) 정보 표시 컴포넌트

import PropTypes from 'prop-types'
import './APIDataSection.css'

/**
 * API 데이터 섹션 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.apiType - API 타입 ('waterlevel', 'realtime', 'forecast')
 * @param {Object} props.data - API 데이터
 * @param {boolean} props.isExpanded - 확장 상태
 * @param {Function} props.onToggle - 확장/축소 토글 핸들러
 * @param {boolean} props.showHeader - 헤더 표시 여부
 */
const APIDataSection = ({ 
  apiType, 
  data, 
  isExpanded = true, 
  onToggle, 
  showHeader = true 
}) => {
  if (!data) {
    return (
      <div className="api-data-section no-data" data-testid={`${apiType}-section`}>
        <div className="api-header">
          <div className="api-title">
            <span className="api-icon">{getAPIIcon(apiType)}</span>
            <span className="api-name">{getAPIName(apiType)}</span>
          </div>
          <span className="no-data-badge">데이터 없음</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`api-data-section ${apiType}`} data-testid={`${apiType}-section`}>
      {showHeader && (
        <div className="api-header" onClick={onToggle}>
          <div className="api-title">
            <span className="api-icon">{getAPIIcon(apiType)}</span>
            <span className="api-name">{getAPIName(apiType)}</span>
            <span className="data-timestamp">{formatTimestamp(data.timestamp)}</span>
          </div>
          <div className="api-controls">
            <span className="status-indicator active">활성</span>
            {onToggle && (
              <button className="toggle-button">
                {isExpanded ? '▼' : '▶'}
              </button>
            )}
          </div>
        </div>
      )}
      
      {isExpanded && (
        <div className="api-content">
          {renderAPIContent(apiType, data)}
        </div>
      )}
    </div>
  )
}

/**
 * API 타입별 콘텐츠 렌더링
 */
const renderAPIContent = (apiType, data) => {
  switch (apiType) {
    case 'waterlevel':
      return <WaterLevelContent data={data} />
    case 'realtime':
      return <RealtimeContent data={data} />
    case 'forecast':
      return <ForecastContent data={data} />
    default:
      return <div className="unknown-api">알 수 없는 API 타입</div>
  }
}

/**
 * 수위관측소 데이터 콘텐츠
 */
const WaterLevelContent = ({ data }) => (
  <div className="waterlevel-content" data-testid="waterlevel-content">
    <div className="content-section">
      <h5>관측소 정보</h5>
      <div className="info-row">
        <span className="label">관측소 ID</span>
        <span className="value">{data.stationId || 'N/A'}</span>
      </div>
      <div className="info-row">
        <span className="label">관측소명</span>
        <span className="value">{data.stationName || 'N/A'}</span>
      </div>
    </div>

    <div className="content-section">
      <h5>수위 정보</h5>
      <div className="water-levels">
        <div className="level-card current">
          <div className="level-label">현재 수위</div>
          <div className="level-value">
            {data.waterLevel ? `${data.waterLevel}m` : 'N/A'}
          </div>
        </div>
        <div className="level-card alert">
          <div className="level-label">주의 수위</div>
          <div className="level-value">
            {data.alertLevel ? `${data.alertLevel}m` : 'N/A'}
          </div>
        </div>
        <div className="level-card danger">
          <div className="level-label">위험 수위</div>
          <div className="level-value">
            {data.dangerLevel ? `${data.dangerLevel}m` : 'N/A'}
          </div>
        </div>
      </div>
      
      {data.waterLevel && data.alertLevel && (
        <div className="level-status">
          <div className="status-bar">
            <div 
              className="status-fill"
              style={{ 
                width: `${Math.min((data.waterLevel / data.alertLevel) * 100, 100)}%`,
                backgroundColor: getWaterLevelColor(data.waterLevel, data.alertLevel, data.dangerLevel)
              }}
            />
          </div>
          <div className="status-text">
            {getWaterLevelStatus(data.waterLevel, data.alertLevel, data.dangerLevel)}
          </div>
        </div>
      )}
    </div>
  </div>
)

/**
 * 실시간수위 데이터 콘텐츠
 */
const RealtimeContent = ({ data }) => (
  <div className="realtime-content" data-testid="realtime-content">
    <div className="content-section">
      <h5>관측 정보</h5>
      <div className="info-row">
        <span className="label">관측소 ID</span>
        <span className="value">{data.stationId || 'N/A'}</span>
      </div>
    </div>

    <div className="content-section">
      <h5>실시간 측정값</h5>
      <div className="measurements">
        <div className="measurement-card">
          <div className="measurement-icon">📏</div>
          <div className="measurement-info">
            <div className="measurement-label">수위</div>
            <div className="measurement-value">
              {data.waterLevel ? `${data.waterLevel}m` : 'N/A'}
            </div>
          </div>
        </div>
        
        <div className="measurement-card">
          <div className="measurement-icon">🌊</div>
          <div className="measurement-info">
            <div className="measurement-label">유량</div>
            <div className="measurement-value">
              {data.flowRate ? `${data.flowRate}㎥/s` : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>

    {data.waterLevel && (
      <div className="content-section">
        <h5>수위 트렌드</h5>
        <div className="trend-indicator">
          <div className="trend-icon">{getTrendIcon(data.waterLevel)}</div>
          <div className="trend-text">{getTrendText(data.waterLevel)}</div>
        </div>
      </div>
    )}
  </div>
)

/**
 * 홍수예보발령 데이터 콘텐츠
 */
const ForecastContent = ({ data }) => (
  <div className="forecast-content" data-testid="forecast-content">
    <div className="content-section">
      <h5>예보 정보</h5>
      <div className="info-row">
        <span className="label">예보 ID</span>
        <span className="value">{data.forecastId || 'N/A'}</span>
      </div>
      <div className="info-row">
        <span className="label">대상 지역</span>
        <span className="value">{data.region || 'N/A'}</span>
      </div>
      <div className="info-row">
        <span className="label">경보 유형</span>
        <span className="value alert-type">{data.alertType || 'N/A'}</span>
      </div>
    </div>

    <div className="content-section">
      <h5>발령 시간</h5>
      <div className="time-info">
        <div className="time-row">
          <span className="time-label">발령 시간</span>
          <span className="time-value">
            {data.issueTime ? formatTimestamp(data.issueTime) : 'N/A'}
          </span>
        </div>
        <div className="time-row">
          <span className="time-label">유효 시간</span>
          <span className="time-value">
            {data.validUntil ? formatTimestamp(data.validUntil) : 'N/A'}
          </span>
        </div>
      </div>
    </div>

    {data.description && (
      <div className="content-section">
        <h5>상세 내용</h5>
        <div className="description">
          {data.description}
        </div>
      </div>
    )}

    {data.validUntil && (
      <div className="content-section">
        <h5>유효성</h5>
        <div className="validity-status">
          <div className={`validity-indicator ${getValidityStatus(data.validUntil)}`}>
            {getValidityText(data.validUntil)}
          </div>
        </div>
      </div>
    )}
  </div>
)

// 유틸리티 함수들
const getAPIIcon = (apiType) => {
  const iconMap = {
    'waterlevel': '📏',
    'realtime': '⏱️',
    'forecast': '🌊',
  }
  return iconMap[apiType] || '📊'
}

const getAPIName = (apiType) => {
  const nameMap = {
    'waterlevel': '수위관측소',
    'realtime': '실시간수위',
    'forecast': '홍수예보발령',
  }
  return nameMap[apiType] || apiType
}

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A'
  
  try {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffMins < 1) {
      return '방금 전'
    } else if (diffMins < 60) {
      return `${diffMins}분 전`
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`
    } else {
      return date.toLocaleString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    }
  } catch (error) {
    return timestamp
  }
}

const getWaterLevelColor = (current, alert, danger) => {
  if (danger && current >= danger) return '#f44336'
  if (alert && current >= alert) return '#ff9800'
  return '#4caf50'
}

const getWaterLevelStatus = (current, alert, danger) => {
  if (danger && current >= danger) return '위험 수위 초과'
  if (alert && current >= alert) return '주의 수위 초과'
  return '정상 수위'
}

const getTrendIcon = (waterLevel) => {
  // 실제 구현에서는 이전 값과 비교하여 트렌드 결정
  // 여기서는 예시로 수위에 따라 아이콘 반환
  if (waterLevel > 3) return '📈'
  if (waterLevel > 1) return '➡️'
  return '📉'
}

const getTrendText = (waterLevel) => {
  if (waterLevel > 3) return '상승 추세'
  if (waterLevel > 1) return '안정'
  return '하강 추세'
}

const getValidityStatus = (validUntil) => {
  try {
    const validDate = new Date(validUntil)
    const now = new Date()
    
    if (validDate > now) {
      return 'valid'
    } else {
      return 'expired'
    }
  } catch (error) {
    return 'unknown'
  }
}

const getValidityText = (validUntil) => {
  try {
    const validDate = new Date(validUntil)
    const now = new Date()
    
    if (validDate > now) {
      const diffMs = validDate - now
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      
      if (diffHours > 0) {
        return `${diffHours}시간 ${diffMins}분 남음`
      } else {
        return `${diffMins}분 남음`
      }
    } else {
      return '만료됨'
    }
  } catch (error) {
    return '알 수 없음'
  }
}

APIDataSection.propTypes = {
  apiType: PropTypes.oneOf(['waterlevel', 'realtime', 'forecast']).isRequired,
  data: PropTypes.object,
  isExpanded: PropTypes.bool,
  onToggle: PropTypes.func,
  showHeader: PropTypes.bool,
}

export default APIDataSection