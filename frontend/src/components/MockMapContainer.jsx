import { useEffect, useRef, useState, useCallback } from 'react'
import { FloodDataAPI } from '../services/FloodDataAPI'
import './MapContainer.css'

const MockMapContainer = ({
  onFloodDataLoad,
  onLocationChange,
  initialCenter = { lat: 37.5665, lng: 126.9780 },
  initialZoom = 12,
  showControls = true,
  enableUserLocation = true,
}) => {
  const mapRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(initialCenter)
  const [zoom, setZoom] = useState(initialZoom)
  const [floodData, setFloodData] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  // FloodDataAPI 인스턴스 생성
  const floodAPI = new FloodDataAPI(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000')

  // 목업 홍수 데이터
  const mockFloodData = [
    {
      id: 'mock-1',
      latitude: 37.5665,
      longitude: 126.9780,
      alertType: '특보',
      severity: 'high',
      timestamp: new Date().toISOString(),
      sources: ['한강홍수통제소'],
      availableAPIs: ['HanRiver API']
    },
    {
      id: 'mock-2',
      latitude: 37.5565,
      longitude: 126.9680,
      alertType: '경보',
      severity: 'medium',
      timestamp: new Date().toISOString(),
      sources: ['기상청'],
      availableAPIs: ['Weather API']
    }
  ]

  useEffect(() => {
    // 지도 초기화 시뮬레이션
    const initializeMap = async () => {
      setLoading(true)
      setError(null)

      try {
        console.log('🗺️ 목업 지도 초기화 시작')
        
        // 로딩 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setLoading(false)
        console.log('✅ 목업 지도 초기화 완료')

        // 홍수 데이터 로드
        loadFloodData()
        
      } catch (err) {
        console.error('❌ 목업 지도 초기화 실패:', err)
        setError('지도를 초기화할 수 없습니다.')
        setLoading(false)
      }
    }

    initializeMap()
  }, [])

  /**
   * 홍수 데이터 로드
   */
  const loadFloodData = async () => {
    try {
      setIsRefreshing(true)
      console.log('🌊 홍수 데이터 로드 시작')

      // 실제 API 호출 시도
      try {
        const bounds = {
          north: currentLocation.lat + 0.01,
          south: currentLocation.lat - 0.01,
          east: currentLocation.lng + 0.01,
          west: currentLocation.lng - 0.01,
        }

        const response = await floodAPI.getFloodDataByBounds(bounds)
        setFloodData(response.data || mockFloodData)
        
        if (onFloodDataLoad) {
          onFloodDataLoad(response.data || mockFloodData)
        }
      } catch (error) {
        console.warn('실제 API 호출 실패, 목업 데이터 사용:', error.message)
        setFloodData(mockFloodData)
        
        if (onFloodDataLoad) {
          onFloodDataLoad(mockFloodData)
        }
      }

      console.log('✅ 홍수 데이터 로드 완료')
    } catch (error) {
      console.error('❌ 홍수 데이터 로드 실패:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  /**
   * 지도 클릭 핸들러
   */
  const handleMapClick = (event) => {
    const rect = mapRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    // 클릭 위치를 대략적인 좌표로 변환
    const lat = currentLocation.lat + (rect.height / 2 - y) * 0.0001
    const lng = currentLocation.lng + (x - rect.width / 2) * 0.0001
    
    console.log('지도 클릭:', lat, lng)
  }

  /**
   * 줌 인
   */
  const zoomIn = () => {
    const newZoom = Math.min(zoom + 1, 18)
    setZoom(newZoom)
    console.log('줌 인:', newZoom)
  }

  /**
   * 줌 아웃
   */
  const zoomOut = () => {
    const newZoom = Math.max(zoom - 1, 8)
    setZoom(newZoom)
    console.log('줌 아웃:', newZoom)
  }

  /**
   * 현재 위치로 이동
   */
  const moveToCurrentLocation = useCallback(() => {
    if (!enableUserLocation) return

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setCurrentLocation(newLocation)
          
          if (onLocationChange) {
            onLocationChange({ ...newLocation, zoom })
          }
          
          console.log('사용자 위치로 이동:', newLocation)
        },
        (error) => {
          console.warn('위치 정보를 가져올 수 없습니다:', error.message)
        }
      )
    }
  }, [enableUserLocation, zoom, onLocationChange])

  /**
   * 홍수 데이터 새로고침
   */
  const refreshFloodData = useCallback(() => {
    loadFloodData()
  }, [currentLocation])

  if (loading) {
    return (
      <div className="map-container" data-testid="map-container">
        <div className="map-loading">
          <div className="loading-spinner" data-testid="loading-spinner"></div>
          <p>지도를 로드하는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="map-container">
        <div className="map-error">
          <h3>지도 로드 오류</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            새로고침
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="map-container" data-testid="map-container">
      {/* 목업 지도 영역 */}
      <div 
        ref={mapRef}
        className="naver-map mock-map" 
        data-testid="mock-map"
        onClick={handleMapClick}
        style={{
          background: 'linear-gradient(45deg, #e8f5e8 25%, transparent 25%), linear-gradient(-45deg, #e8f5e8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e8f5e8 75%), linear-gradient(-45deg, transparent 75%, #e8f5e8 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          position: 'relative',
          cursor: 'crosshair'
        }}
      >
        {/* 중심점 표시 */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '20px',
          background: '#007bff',
          borderRadius: '50%',
          border: '3px solid white',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          zIndex: 1000
        }} />

        {/* 홍수 데이터 마커들 */}
        {floodData.map((flood, index) => (
          <div
            key={flood.id}
            style={{
              position: 'absolute',
              top: `${45 + index * 5}%`,
              left: `${45 + index * 10}%`,
              width: '30px',
              height: '30px',
              background: flood.severity === 'high' ? '#F44336' : 
                         flood.severity === 'medium' ? '#FF9800' : '#4CAF50',
              borderRadius: '50%',
              border: '2px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              fontSize: '14px',
              zIndex: 100
            }}
            title={`${flood.alertType} - ${flood.severity}`}
            onClick={(e) => {
              e.stopPropagation()
              alert(`홍수 정보\n유형: ${flood.alertType}\n심각도: ${flood.severity}\n시간: ${new Date(flood.timestamp).toLocaleString()}`)
            }}
          >
            {flood.alertType === '특보' ? '⚠️' : 
             flood.alertType === '경보' ? '🚨' : '💧'}
          </div>
        ))}

        {/* 지도 정보 오버레이 */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(255,255,255,0.9)',
          padding: '10px',
          borderRadius: '4px',
          fontSize: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div><strong>목업 지도</strong></div>
          <div>중심: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}</div>
          <div>줌: {zoom}</div>
          <div>홍수 데이터: {floodData.length}개</div>
        </div>
      </div>

      {/* 지도 컨트롤 패널 */}
      {showControls && (
        <div className="map-controls">
          <button
            className="control-button"
            title="줌 인"
            onClick={zoomIn}
          >
            ➕
          </button>
          <button
            className="control-button"
            title="줌 아웃"
            onClick={zoomOut}
          >
            ➖
          </button>
          <button
            className="control-button"
            title="현재 위치로 이동"
            onClick={moveToCurrentLocation}
            disabled={!enableUserLocation}
          >
            📍
          </button>
          <button
            className="control-button"
            title="침수 정보 새로고침"
            onClick={refreshFloodData}
            disabled={isRefreshing}
          >
            {isRefreshing ? '⏳' : '🔄'}
          </button>
        </div>
      )}

      {/* 로딩 오버레이 */}
      {isRefreshing && (
        <div className="map-refresh-overlay">
          <div className="refresh-spinner"></div>
          <span>데이터 새로고침 중...</span>
        </div>
      )}

      {/* 네이버 지도 API 안내 */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(255, 193, 7, 0.9)',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#856404'
      }}>
        ⚠️ 네이버 지도 API 서비스 변경으로 인한 임시 목업 지도
      </div>
    </div>
  )
}

export default MockMapContainer