// RouteProximityAlert.jsx
// 1.5km 반경 내 홍수주의보 지점 감지 시 대체 경로 제안 알림 컴포넌트

import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './RouteProximityAlert.css'

/**
 * 경로 근접성 알림 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.proximityResult - 근접성 검사 결과
 * @param {boolean} props.isVisible - 알림 표시 여부
 * @param {Function} props.onClose - 알림 닫기 핸들러
 * @param {Function} props.onRequestAlternative - 대체 경로 요청 핸들러
 * @param {Function} props.onViewDetails - 상세 정보 보기 핸들러
 * @param {Object} props.options - 알림 옵션
 */
const RouteProximityAlert = ({
  proximityResult,
  isVisible,
  onClose,
  onRequestAlternative,
  onViewDetails,
  options = {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [autoCloseTimer, setAutoCloseTimer] = useState(null)

  const {
    autoClose = false,
    autoCloseDelay = 10000,
    showSafetyScore = true,
    showAlternativeButton = true,
    position = 'top-right',
  } = options

  useEffect(() => {
    if (isVisible && autoClose && !isExpanded) {
      const timer = setTimeout(() => {
        handleClose()
      }, autoCloseDelay)
      
      setAutoCloseTimer(timer)
      
      return () => {
        if (timer) clearTimeout(timer)
      }
    }
  }, [isVisible, autoClose, autoCloseDelay, isExpanded])

  useEffect(() => {
    if (isExpanded && autoCloseTimer) {
      clearTimeout(autoCloseTimer)
      setAutoCloseTimer(null)
    }
  }, [isExpanded, autoCloseTimer])

  if (!isVisible || isDismissed || !proximityResult) {
    return null
  }

  const {
    hasProximityAlert,
    alertPoints = [],
    minDistance,
    safeRoute,
    routeAnalysis = {},
  } = proximityResult

  /**
   * 알림 닫기 처리
   */
  const handleClose = () => {
    setIsDismissed(true)
    if (onClose) {
      onClose()
    }
  }

  /**
   * 확장/축소 토글
   */
  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  /**
   * 대체 경로 요청
   */
  const handleRequestAlternative = () => {
    if (onRequestAlternative) {
      onRequestAlternative(proximityResult)
    }
  }

  /**
   * 상세 정보 보기
   */
  const handleViewDetails = (alertPoint) => {
    if (onViewDetails) {
      onViewDetails(alertPoint)
    }
  }

  /**
   * 안전도 점수 계산
   */
  const calculateSafetyScore = () => {
    if (safeRoute) return 100
    
    let score = 100
    score -= alertPoints.length * 15
    
    if (minDistance < 500) score -= 30
    else if (minDistance < 1000) score -= 20
    else score -= 10
    
    const highSeverityCount = alertPoints.filter(p => p.severity === 'high').length
    const mediumSeverityCount = alertPoints.filter(p => p.severity === 'medium').length
    
    score -= highSeverityCount * 20
    score -= mediumSeverityCount * 10
    
    return Math.max(0, score)
  }

  const safetyScore = showSafetyScore ? calculateSafetyScore() : null
  const alertLevel = getOverallAlertLevel(alertPoints)

  return (
    <div 
      className={`route-proximity-alert ${position} ${alertLevel} ${isExpanded ? 'expanded' : ''}`}
      data-testid="route-proximity-alert"
    >
      {/* 알림 헤더 */}
      <div className="alert-header" onClick={handleToggle}>
        <div className="alert-icon">
          {safeRoute ? '✅' : getAlertIcon(alertLevel)}
        </div>
        <div className="alert-title">
          <h4>{safeRoute ? '안전한 경로' : '경로 주의 필요'}</h4>
          <p className="alert-summary">
            {safeRoute 
              ? '홍수 위험 지역이 감지되지 않았습니다'
              : `${alertPoints.length}개 위험 지역 감지 (최단거리: ${Math.round(minDistance)}m)`
            }
          </p>
        </div>
        <div className="alert-controls">
          {showSafetyScore && safetyScore !== null && (
            <div className={`safety-score ${getSafetyScoreClass(safetyScore)}`}>
              {safetyScore}
            </div>
          )}
          <button className="toggle-button" title={isExpanded ? '축소' : '확장'}>
            {isExpanded ? '▼' : '▶'}
          </button>
          <button className="close-button" onClick={handleClose} title="닫기">
            ✕
          </button>
        </div>
      </div>

      {/* 확장된 콘텐츠 */}
      {isExpanded && (
        <div className="alert-content">
          {!safeRoute && (
            <>
              {/* 경로 분석 정보 */}
              <div className="route-analysis">
                <h5>경로 분석</h5>
                <div className="analysis-grid">
                  <div className="analysis-item">
                    <span className="label">총 거리</span>
                    <span className="value">
                      {routeAnalysis.totalDistance 
                        ? `${(routeAnalysis.totalDistance / 1000).toFixed(1)}km`
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="analysis-item">
                    <span className="label">위험 지점</span>
                    <span className="value">{alertPoints.length}개</span>
                  </div>
                  <div className="analysis-item">
                    <span className="label">최단 거리</span>
                    <span className="value">{Math.round(minDistance)}m</span>
                  </div>
                  {showSafetyScore && (
                    <div className="analysis-item">
                      <span className="label">안전도</span>
                      <span className={`value safety-${getSafetyScoreClass(safetyScore)}`}>
                        {safetyScore}점
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 위험 지점 목록 */}
              <div className="alert-points">
                <h5>위험 지점 ({alertPoints.length}개)</h5>
                <div className="points-list">
                  {alertPoints.slice(0, 3).map((point, index) => (
                    <div key={point.id || index} className="point-item">
                      <div className="point-info">
                        <div className="point-header">
                          <span className={`severity-badge severity-${point.severity}`}>
                            {getSeverityText(point.severity)}
                          </span>
                          <span className="alert-type">{point.alertType}</span>
                          <span className="distance">{Math.round(point.distance)}m</span>
                        </div>
                        <div className="point-location">
                          {point.coordinates.latitude.toFixed(4)}, {point.coordinates.longitude.toFixed(4)}
                        </div>
                        {point.availableAPIs && point.availableAPIs.length > 0 && (
                          <div className="point-apis">
                            데이터: {point.availableAPIs.join(', ')}
                          </div>
                        )}
                      </div>
                      <button 
                        className="view-details-button"
                        onClick={() => handleViewDetails(point)}
                        title="상세 정보"
                      >
                        📍
                      </button>
                    </div>
                  ))}
                  
                  {alertPoints.length > 3 && (
                    <div className="more-points">
                      +{alertPoints.length - 3}개 더 있음
                    </div>
                  )}
                </div>
              </div>

              {/* 권장 사항 */}
              <div className="recommendations">
                <h5>권장 사항</h5>
                <div className="recommendation-list">
                  {getRecommendations(alertLevel, minDistance, alertPoints).map((rec, index) => (
                    <div key={index} className="recommendation-item">
                      <span className="rec-icon">{rec.icon}</span>
                      <span className="rec-text">{rec.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 안전한 경로인 경우 */}
          {safeRoute && (
            <div className="safe-route-info">
              <div className="safe-message">
                <span className="safe-icon">🛡️</span>
                <div className="safe-text">
                  <p>현재 경로는 홍수 위험 지역을 피해 안전합니다.</p>
                  <p className="safe-detail">
                    총 거리: {routeAnalysis.totalDistance 
                      ? `${(routeAnalysis.totalDistance / 1000).toFixed(1)}km`
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="alert-actions">
            {!safeRoute && showAlternativeButton && (
              <button 
                className="alternative-button"
                onClick={handleRequestAlternative}
              >
                🔄 대체 경로 찾기
              </button>
            )}
            <button className="dismiss-button" onClick={handleClose}>
              확인
            </button>
          </div>
        </div>
      )}

      {/* 자동 닫기 진행 표시 */}
      {autoClose && !isExpanded && (
        <div className="auto-close-progress">
          <div 
            className="progress-bar"
            style={{ 
              animationDuration: `${autoCloseDelay}ms`,
              animationPlayState: isExpanded ? 'paused' : 'running'
            }}
          />
        </div>
      )}
    </div>
  )
}

// 유틸리티 함수들
const getOverallAlertLevel = (alertPoints) => {
  if (!alertPoints || alertPoints.length === 0) return 'safe'
  
  const hasHigh = alertPoints.some(p => p.severity === 'high')
  const hasMedium = alertPoints.some(p => p.severity === 'medium')
  
  if (hasHigh) return 'high'
  if (hasMedium) return 'medium'
  return 'low'
}

const getAlertIcon = (alertLevel) => {
  const iconMap = {
    'high': '🚨',
    'medium': '⚠️',
    'low': '💧',
    'safe': '✅',
  }
  return iconMap[alertLevel] || '⚠️'
}

const getSeverityText = (severity) => {
  const textMap = {
    'high': '높음',
    'medium': '보통',
    'low': '낮음',
  }
  return textMap[severity] || severity
}

const getSafetyScoreClass = (score) => {
  if (score >= 80) return 'high'
  if (score >= 60) return 'medium'
  return 'low'
}

const getRecommendations = (alertLevel, minDistance, alertPoints) => {
  const recommendations = []
  
  if (alertLevel === 'high') {
    recommendations.push({
      icon: '🚨',
      text: '즉시 대체 경로를 이용하세요'
    })
  }
  
  if (minDistance < 500) {
    recommendations.push({
      icon: '⚠️',
      text: '위험 지역과 매우 가깝습니다. 우회를 권장합니다'
    })
  }
  
  const hasSpecialAlert = alertPoints.some(p => p.alertType === '특보')
  if (hasSpecialAlert) {
    recommendations.push({
      icon: '📢',
      text: '홍수특보 발령 지역이 있습니다. 주의하세요'
    })
  }
  
  recommendations.push({
    icon: '📱',
    text: '실시간 교통 정보를 확인하세요'
  })
  
  recommendations.push({
    icon: '🔄',
    text: '정기적으로 경로를 재검토하세요'
  })
  
  return recommendations
}

RouteProximityAlert.propTypes = {
  proximityResult: PropTypes.shape({
    hasProximityAlert: PropTypes.bool.isRequired,
    alertPoints: PropTypes.arrayOf(PropTypes.object),
    minDistance: PropTypes.number,
    safeRoute: PropTypes.bool,
    routeAnalysis: PropTypes.object,
  }),
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRequestAlternative: PropTypes.func,
  onViewDetails: PropTypes.func,
  options: PropTypes.shape({
    autoClose: PropTypes.bool,
    autoCloseDelay: PropTypes.number,
    showSafetyScore: PropTypes.bool,
    showAlternativeButton: PropTypes.bool,
    position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  }),
}

export default RouteProximityAlert