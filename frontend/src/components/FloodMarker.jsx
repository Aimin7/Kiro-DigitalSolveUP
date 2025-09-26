// FloodMarker.jsx
// 침수 지점 마커 표시 및 심각도별 색상 구분 컴포넌트

import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

/**
 * 홍수 마커 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.floodInfo - 홍수 정보 객체
 * @param {Object} props.map - 네이버 지도 인스턴스
 * @param {Function} props.onClick - 마커 클릭 핸들러
 * @param {boolean} props.visible - 마커 표시 여부
 * @param {Object} props.customIcon - 커스텀 아이콘 설정
 */
const FloodMarker = ({ 
  floodInfo, 
  map, 
  onClick, 
  visible = true,
  customIcon = null,
}) => {
  const markerRef = useRef(null)

  useEffect(() => {
    if (!map || !floodInfo || !window.naver) return

    // 마커 생성
    createMarker()

    // 컴포넌트 언마운트 시 마커 제거
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
      }
    }
  }, [map, floodInfo])

  useEffect(() => {
    // 마커 표시/숨김 처리
    if (markerRef.current) {
      markerRef.current.setVisible(visible)
    }
  }, [visible])

  /**
   * 네이버 지도 마커 생성
   */
  const createMarker = () => {
    if (!floodInfo.latitude || !floodInfo.longitude) {
      console.warn('Invalid flood info coordinates:', floodInfo)
      return
    }

    const position = new window.naver.maps.LatLng(
      floodInfo.latitude,
      floodInfo.longitude
    )

    const markerOptions = {
      position,
      map,
      title: getMarkerTitle(floodInfo),
      icon: customIcon || createMarkerIcon(floodInfo),
      zIndex: getMarkerZIndex(floodInfo.severity),
      clickable: true,
    }

    const marker = new window.naver.maps.Marker(markerOptions)

    // 클릭 이벤트 리스너 추가
    if (onClick) {
      window.naver.maps.Event.addListener(marker, 'click', () => {
        onClick(floodInfo, marker)
      })
    }

    // 마우스 오버 이벤트 (호버 효과)
    window.naver.maps.Event.addListener(marker, 'mouseover', () => {
      marker.setIcon(createHoverMarkerIcon(floodInfo))
    })

    window.naver.maps.Event.addListener(marker, 'mouseout', () => {
      marker.setIcon(customIcon || createMarkerIcon(floodInfo))
    })

    markerRef.current = marker
  }

  /**
   * 마커 제목 생성
   */
  const getMarkerTitle = (floodInfo) => {
    const alertTypeText = getAlertTypeText(floodInfo.alertType)
    const severityText = getSeverityText(floodInfo.severity)
    
    return `${alertTypeText} (${severityText})`
  }

  /**
   * 경보 유형 텍스트 변환
   */
  const getAlertTypeText = (alertType) => {
    const alertTypeMap = {
      '특보': '홍수특보',
      '경보': '홍수경보',
      '주의보': '홍수주의보',
    }
    return alertTypeMap[alertType] || alertType
  }

  /**
   * 심각도 텍스트 변환
   */
  const getSeverityText = (severity) => {
    const severityMap = {
      'high': '높음',
      'medium': '보통',
      'low': '낮음',
    }
    return severityMap[severity] || severity
  }

  /**
   * 마커 아이콘 생성
   */
  const createMarkerIcon = (floodInfo) => {
    const { severity, alertType } = floodInfo
    const color = getSeverityColor(severity)
    const icon = getAlertIcon(alertType)
    const size = getMarkerSize(severity)

    return {
      content: `
        <div class="flood-marker-container" data-testid="flood-marker">
          <div class="flood-marker-icon" style="
            background-color: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 2px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            <span style="
              font-size: ${Math.floor(size * 0.5)}px;
              line-height: 1;
              filter: drop-shadow(0 1px 1px rgba(0,0,0,0.3));
            ">${icon}</span>
          </div>
          ${severity === 'high' ? `
            <div class="flood-marker-pulse" style="
              position: absolute;
              top: 50%;
              left: 50%;
              width: ${size + 10}px;
              height: ${size + 10}px;
              background-color: ${color}40;
              border-radius: 50%;
              transform: translate(-50%, -50%);
              animation: flood-pulse 2s infinite;
            "></div>
          ` : ''}
        </div>
        <style>
          @keyframes flood-pulse {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
          }
          .flood-marker-icon:hover {
            transform: scale(1.1);
          }
        </style>
      `,
      size: new window.naver.maps.Size(size + 4, size + 4),
      anchor: new window.naver.maps.Point((size + 4) / 2, (size + 4) / 2),
    }
  }

  /**
   * 호버 상태 마커 아이콘 생성
   */
  const createHoverMarkerIcon = (floodInfo) => {
    const { severity, alertType } = floodInfo
    const color = getSeverityColor(severity)
    const icon = getAlertIcon(alertType)
    const size = getMarkerSize(severity) + 4 // 호버 시 크기 증가

    return {
      content: `
        <div class="flood-marker-container flood-marker-hover" data-testid="flood-marker-hover">
          <div class="flood-marker-icon" style="
            background-color: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 3px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            cursor: pointer;
            transform: scale(1.1);
          ">
            <span style="
              font-size: ${Math.floor(size * 0.5)}px;
              line-height: 1;
              filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4));
            ">${icon}</span>
          </div>
        </div>
      `,
      size: new window.naver.maps.Size(size + 6, size + 6),
      anchor: new window.naver.maps.Point((size + 6) / 2, (size + 6) / 2),
    }
  }

  /**
   * 심각도별 색상 반환
   */
  const getSeverityColor = (severity) => {
    const colorMap = {
      'high': '#F44336',    // 빨간색 (위험)
      'medium': '#FF9800',  // 주황색 (주의)
      'low': '#4CAF50',     // 초록색 (안전)
    }
    return colorMap[severity] || '#9E9E9E' // 기본값: 회색
  }

  /**
   * 경보 유형별 아이콘 반환
   */
  const getAlertIcon = (alertType) => {
    const iconMap = {
      '특보': '⚠️',
      '경보': '🚨', 
      '주의보': '💧',
    }
    return iconMap[alertType] || '💧'
  }

  /**
   * 심각도별 마커 크기 반환
   */
  const getMarkerSize = (severity) => {
    const sizeMap = {
      'high': 32,
      'medium': 28,
      'low': 24,
    }
    return sizeMap[severity] || 24
  }

  /**
   * 심각도별 Z-Index 반환 (높은 심각도가 위에 표시)
   */
  const getMarkerZIndex = (severity) => {
    const zIndexMap = {
      'high': 300,
      'medium': 200,
      'low': 100,
    }
    return zIndexMap[severity] || 100
  }

  // 이 컴포넌트는 마커를 직접 렌더링하지 않고 네이버 지도에 마커를 추가함
  return null
}

FloodMarker.propTypes = {
  floodInfo: PropTypes.shape({
    id: PropTypes.string,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    alertType: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
    timestamp: PropTypes.string,
    sources: PropTypes.arrayOf(PropTypes.string),
    availableAPIs: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  map: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  visible: PropTypes.bool,
  customIcon: PropTypes.object,
}

export default FloodMarker