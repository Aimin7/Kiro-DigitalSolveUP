import { useEffect, useRef, useState, useCallback } from 'react'
import { FloodDataAPI } from '../services/FloodDataAPI'
import './MapContainer.css'

const MapContainer = ({
  onFloodDataLoad,
  onLocationChange,
  initialCenter = { lat: 37.5665, lng: 126.9780 },
  initialZoom = 12,
  showControls = true,
  enableUserLocation = true,
}) => {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [mapLoading, setMapLoading] = useState(true)
  const [error, setError] = useState(null)
  const [floodMarkers, setFloodMarkers] = useState([])
  const [userLocationMarker, setUserLocationMarker] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [floodDataMap, setFloodDataMap] = useState(new Map())

  // FloodDataAPI 인스턴스 생성
  const floodAPI = new FloodDataAPI(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000')

  // 전역 참조 설정
  useEffect(() => {
    window.mapContainer = { showDetailedInfo }
    return () => {
      delete window.mapContainer
    }
  }, [floodDataMap])

  // 지도 초기화 (SimpleMapContainer와 동일한 로직)
  useEffect(() => {
    const initMap = async () => {
      try {
        console.log('🔍 환경변수 확인')
        const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID
        console.log(`클라이언트 ID: ${clientId ? clientId.substring(0, 5) + '...' : '없음'}`)

        if (!clientId) {
          throw new Error('VITE_NAVER_MAP_CLIENT_ID가 설정되지 않았습니다')
        }

        console.log('📍 DOM 요소 확인')
        if (!mapRef.current) {
          throw new Error('지도 컨테이너 DOM 요소를 찾을 수 없습니다')
        }
        console.log('✅ DOM 요소 확인 완료')

        console.log('📡 네이버 지도 API 로드 중...')
        setMapLoading(true)
        setError(null)

        // 기존 스크립트 제거
        const existingScript = document.querySelector('script[src*="oapi.map.naver.com"]')
        if (existingScript) {
          existingScript.remove()
          console.log('기존 스크립트 제거됨')
        }

        // 새 스크립트 로드
        const script = document.createElement('script')
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`
        script.async = true

        const loadPromise = new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            console.log('⏰ 스크립트 로드 타임아웃')
            reject(new Error('타임아웃'))
          }, 15000)

          script.onload = () => {
            clearTimeout(timeout)
            console.log('✅ 스크립트 로드 완료')

            // API 객체 확인
            const checkAPI = () => {
              if (window.naver && window.naver.maps) {
                console.log('✅ 네이버 지도 API 객체 확인됨')
                resolve()
              } else {
                console.log('⏳ API 객체 대기 중...')
                setTimeout(checkAPI, 100)
              }
            }
            checkAPI()
          }

          script.onerror = (error) => {
            clearTimeout(timeout)
            console.log(`❌ 스크립트 로드 실패: ${error}`)
            reject(error)
          }
        })

        document.head.appendChild(script)
        await loadPromise

        console.log('🗺️ 지도 생성 중...')

        const naverMap = new window.naver.maps.Map(mapRef.current, {
          center: new window.naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
          zoom: initialZoom,
          mapTypeControl: showControls,
          zoomControl: showControls,
          scaleControl: false,
          logoControl: false,
          mapDataControl: false,
          minZoom: 8,
          maxZoom: 18,
        })

        console.log('✅ 지도 생성 완료!')
        setMap(naverMap)
        setMapLoading(false)

      } catch (error) {
        console.log(`❌ 오류 발생: ${error.message}`)
        setError(error.message)
        setMapLoading(false)
      }
    }

    // DOM이 준비된 후 초기화
    const timer = setTimeout(initMap, 100)
    return () => clearTimeout(timer)
  }, [])

  // 지도 이벤트 리스너 설정
  useEffect(() => {
    if (map) {
      console.log('🎯 지도 이벤트 리스너 설정')

      // 지도 이동/줌 이벤트
      if (onLocationChange) {
        const handleLocationChange = () => {
          const center = map.getCenter()
          const newLocation = {
            lat: center.lat(),
            lng: center.lng(),
            zoom: map.getZoom(),
          }
          onLocationChange(newLocation)
        }

        window.naver.maps.Event.addListener(map, 'center_changed', handleLocationChange)
        window.naver.maps.Event.addListener(map, 'zoom_changed', handleLocationChange)
      }

      // 사용자 위치 가져오기
      if (enableUserLocation) {
        getUserLocation()
      }

      // 홍수 데이터 로드
      loadFloodData()
    }
  }, [map])

  /**
   * 사용자 현재 위치 가져오기
   */
  const getUserLocation = () => {
    console.log('🔍 위치 정보 요청 시작')
    
    // Geolocation API 지원 확인
    if (!navigator.geolocation) {
      console.warn('❌ Geolocation이 지원되지 않는 브라우저입니다.')
      alert('이 브라우저는 위치 서비스를 지원하지 않습니다.')
      return
    }

    // HTTPS 여부 확인
    const isSecureContext = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost'
    if (!isSecureContext) {
      console.warn('⚠️ 보안 컨텍스트가 아닙니다. HTTPS 또는 localhost에서만 위치 서비스가 정상 작동합니다.')
      
      // HTTP 환경에서의 대안 제공
      const useDefaultLocation = confirm(
        '현재 HTTP 환경에서는 위치 서비스가 제한됩니다.\n' +
        '서울 시청을 기본 위치로 설정하시겠습니까?\n\n' +
        '정확한 위치 서비스를 원하시면 HTTPS 사이트를 이용해주세요.'
      )
      
      if (useDefaultLocation) {
        const defaultLocation = new window.naver.maps.LatLng(37.5665, 126.9780) // 서울시청
        map.setCenter(defaultLocation)
        map.setZoom(14)
        createUserLocationMarker(defaultLocation, true) // 기본 위치임을 표시
        console.log('🏢 기본 위치(서울시청)로 설정됨')
      }
      return
    }

    console.log('📍 위치 권한 요청 중...')
    
    // 위치 정보 요청
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ 위치 정보 획득 성공')
        const userLocation = new window.naver.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        )

        // 지도 중심을 사용자 위치로 이동
        map.setCenter(userLocation)
        map.setZoom(14)

        // 사용자 위치 마커 생성
        createUserLocationMarker(userLocation, false)

        console.log('📍 사용자 위치:', position.coords.latitude, position.coords.longitude)
        console.log('🎯 정확도:', position.coords.accuracy, '미터')
      },
      (error) => {
        console.error('❌ 위치 정보 획득 실패:', error)
        
        let errorMessage = '위치 정보를 가져올 수 없습니다.'
        let suggestion = ''
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 접근 권한이 거부되었습니다.'
            suggestion = '브라우저 설정에서 위치 권한을 허용해주세요.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.'
            suggestion = 'GPS가 활성화되어 있는지 확인해주세요.'
            break
          case error.TIMEOUT:
            errorMessage = '위치 정보 요청이 시간 초과되었습니다.'
            suggestion = '다시 시도해주세요.'
            break
          default:
            errorMessage = '알 수 없는 오류가 발생했습니다.'
            suggestion = '잠시 후 다시 시도해주세요.'
            break
        }
        
        console.warn(`⚠️ ${errorMessage} (${suggestion})`)
        
        // 사용자에게 오류 알림 및 대안 제공
        const useDefaultLocation = confirm(
          `${errorMessage}\n${suggestion}\n\n` +
          '서울 시청을 기본 위치로 설정하시겠습니까?'
        )
        
        if (useDefaultLocation) {
          const defaultLocation = new window.naver.maps.LatLng(37.5665, 126.9780)
          map.setCenter(defaultLocation)
          map.setZoom(14)
          createUserLocationMarker(defaultLocation, true)
          console.log('🏢 기본 위치로 설정됨')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // 15초로 증가
        maximumAge: 300000, // 5분
      }
    )
  }

  /**
   * 사용자 위치 마커 생성
   */
  const createUserLocationMarker = (location, isDefault = false) => {
    if (userLocationMarker) {
      userLocationMarker.setMap(null)
    }

    const markerTitle = isDefault ? '기본 위치 (서울시청)' : '현재 위치'
    const markerColor = isDefault ? '#FF9800' : '#2196F3'
    const markerIcon = isDefault ? '🏢' : '📍'

    const marker = new window.naver.maps.Marker({
      position: location,
      map: map,
      title: markerTitle,
      icon: {
        content: `
          <div class="user-location-marker" style="--marker-color: ${markerColor}">
            <div class="user-location-dot">${markerIcon}</div>
            <div class="user-location-pulse"></div>
          </div>
        `,
        size: new window.naver.maps.Size(24, 24),
        anchor: new window.naver.maps.Point(12, 12),
      },
      zIndex: 1000,
    })

    // 마커 클릭 시 정보 표시
    window.naver.maps.Event.addListener(marker, 'click', () => {
      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div style="padding: 10px; min-width: 150px; text-align: center;">
            <h4 style="margin: 0 0 8px 0; color: #333;">${markerTitle}</h4>
            <p style="margin: 0; color: #666; font-size: 12px;">
              ${location.lat().toFixed(6)}, ${location.lng().toFixed(6)}
            </p>
            ${isDefault ? 
              '<p style="margin: 4px 0 0 0; color: #FF9800; font-size: 11px;">HTTPS 환경에서 정확한 위치를 확인하세요</p>' : 
              '<p style="margin: 4px 0 0 0; color: #2196F3; font-size: 11px;">GPS로 확인된 위치입니다</p>'
            }
          </div>
        `,
        maxWidth: 200,
        backgroundColor: '#fff',
        borderColor: markerColor,
        borderWidth: 2,
        anchorSize: new window.naver.maps.Size(10, 10),
        anchorColor: '#fff',
      })
      
      infoWindow.open(map, marker)
      
      // 3초 후 자동으로 닫기
      setTimeout(() => {
        infoWindow.close()
      }, 3000)
    })

    setUserLocationMarker(marker)
    
    console.log(`📍 ${markerTitle} 마커 생성 완료`)
  }

  /**
   * 홍수 데이터 로드
   */
  const loadFloodData = async () => {
    if (!map || isRefreshing) return

    try {
      console.log('🌊 홍수 데이터 로드 시작')
      setIsRefreshing(true)

      // 개발 환경에서는 목업 데이터만 사용
      if (import.meta.env.MODE === 'development') {
        console.log('🔧 개발 환경: 목업 데이터 사용')

        // 목업 데이터
        const mockData = [
          {
            id: 'mock-001',
            latitude: 37.5665,
            longitude: 126.9780,
            alertType: '특보',
            severity: 'medium',
            timestamp: new Date().toISOString(),
            sources: ['한강홍수통제소'],
            availableAPIs: ['HanRiver API']
          }
        ]

        displayFloodMarkers(mockData)

        if (onFloodDataLoad) {
          onFloodDataLoad(mockData)
        }

        return
      }

      // 프로덕션 환경에서만 실제 API 호출
      const bounds = map.getBounds()
      const ne = bounds.getNE()
      const sw = bounds.getSW()

      console.log('📡 API 호출:', {
        north: ne.lat(),
        south: sw.lat(),
        east: ne.lng(),
        west: sw.lng(),
        apiBaseUrl: import.meta.env.VITE_API_BASE_URL
      })

      const floodData = await floodAPI.getFloodDataByBounds({
        north: ne.lat(),
        south: sw.lat(),
        east: ne.lng(),
        west: sw.lng(),
      })

      console.log('✅ 홍수 데이터 로드 완료:', floodData)
      displayFloodMarkers(floodData.data || [])

      if (onFloodDataLoad) {
        onFloodDataLoad(floodData.data || [])
      }
    } catch (error) {
      console.error('❌ 홍수 데이터 로드 실패:', error)
      displayFloodMarkers([])
    } finally {
      setIsRefreshing(false)
    }
  }

  /**
   * 홍수 마커 표시
   */
  const displayFloodMarkers = (floodData) => {
    // 기존 마커 제거
    floodMarkers.forEach(marker => marker.setMap(null))

    // floodDataMap 업데이트
    const newFloodDataMap = new Map()
    floodData.forEach(floodInfo => {
      newFloodDataMap.set(floodInfo.id, floodInfo)
    })
    setFloodDataMap(newFloodDataMap)

    const newMarkers = floodData.map(floodInfo => {
      const position = new window.naver.maps.LatLng(
        floodInfo.latitude,
        floodInfo.longitude
      )

      const marker = new window.naver.maps.Marker({
        position,
        map,
        title: `${floodInfo.alertType} - ${floodInfo.severity}`,
        icon: {
          content: createFloodMarkerIcon(floodInfo),
          size: new window.naver.maps.Size(30, 30),
          anchor: new window.naver.maps.Point(15, 15),
        },
        zIndex: 100,
      })

      // 마커에 floodData 저장
      marker.floodData = floodInfo

      // 마커 클릭 이벤트
      window.naver.maps.Event.addListener(marker, 'click', () => {
        showFloodInfoWindow(floodInfo, marker)
      })

      return marker
    })

    setFloodMarkers(newMarkers)
  }

  /**
   * 홍수 마커 아이콘 생성
   */
  const createFloodMarkerIcon = (floodInfo) => {
    const severityColors = {
      low: '#4CAF50',
      medium: '#FF9800',
      high: '#F44336',
    }

    const color = severityColors[floodInfo.severity] || '#9E9E9E'

    return `
      <div class="flood-marker" style="background-color: ${color}">
        <div class="flood-marker-inner">
          ${floodInfo.alertType === '특보' ? '⚠️' :
        floodInfo.alertType === '경보' ? '🚨' : '💧'}
        </div>
      </div>
    `
  }

  /**
   * 홍수 정보 창 표시
   */
  const showFloodInfoWindow = (floodInfo, marker) => {
    const infoWindow = new window.naver.maps.InfoWindow({
      content: createInfoWindowContent(floodInfo),
      maxWidth: 300,
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderWidth: 1,
      anchorSize: new window.naver.maps.Size(10, 10),
      anchorSkew: true,
      anchorColor: '#fff',
      pixelOffset: new window.naver.maps.Point(0, -10),
    })

    infoWindow.open(map, marker)
  }

  /**
   * 상세 정보 표시
   */
  const showDetailedInfo = (floodId) => {
    console.log('상세 정보 요청:', floodId)
    console.log('현재 floodDataMap:', floodDataMap)
    
    // 해당 침수 정보 찾기
    const floodInfo = floodDataMap.get(floodId)

    if (!floodInfo) {
      console.error('상세 정보를 찾을 수 없습니다. ID:', floodId)
      alert('상세 정보를 찾을 수 없습니다.')
      return
    }

    // 상세 정보 모달 내용 생성
    const detailContent = `
      <div style="max-width: 500px; padding: 20px; color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <h2 style="margin-top: 0; color: #212529; font-weight: 600;">🌊 침수 정보 상세</h2>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #e9ecef;">
          <h3 style="margin: 0 0 10px 0; color: #343a40; font-weight: 600;">기본 정보</h3>
          <p style="color: #495057; margin: 8px 0;"><strong style="color: #212529;">경보 유형:</strong> ${floodInfo.alertType}</p>
          <p style="color: #495057; margin: 8px 0;"><strong style="color: #212529;">심각도:</strong> <span style="color: ${floodInfo.severity === 'high' ? '#dc3545' : floodInfo.severity === 'medium' ? '#fd7e14' : '#28a745'}; font-weight: 600;">${floodInfo.severity.toUpperCase()}</span></p>
          <p style="color: #495057; margin: 8px 0;"><strong style="color: #212529;">발생 시간:</strong> ${new Date(floodInfo.timestamp).toLocaleString('ko-KR')}</p>
          <p style="color: #495057; margin: 8px 0;"><strong style="color: #212529;">위치:</strong> ${floodInfo.latitude.toFixed(6)}, ${floodInfo.longitude.toFixed(6)}</p>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #bbdefb;">
          <h3 style="margin: 0 0 10px 0; color: #1565c0; font-weight: 600;">데이터 소스</h3>
          <p style="color: #424242; margin: 8px 0;"><strong style="color: #1565c0;">제공 기관:</strong> ${floodInfo.sources?.join(', ') || '정보 없음'}</p>
          ${floodInfo.availableAPIs?.length > 0 ?
        `<p style="color: #424242; margin: 8px 0;"><strong style="color: #1565c0;">연동 API:</strong> ${floodInfo.availableAPIs.join(', ')}</p>` :
        ''
      }
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #ffcc02;">
          <h3 style="margin: 0 0 10px 0; color: #e65100; font-weight: 600;">⚠️ 안전 수칙</h3>
          <ul style="margin: 0; padding-left: 20px; color: #424242;">
            <li style="margin: 6px 0; color: #424242;">침수 지역 접근을 피하세요</li>
            <li style="margin: 6px 0; color: #424242;">지하 공간 이용을 자제하세요</li>
            <li style="margin: 6px 0; color: #424242;">대중교통 이용 시 우회 경로를 확인하세요</li>
            <li style="margin: 6px 0; color: #424242;">응급상황 시 119에 신고하세요</li>
          </ul>
        </div>

        <div style="text-align: center;">
          <button onclick="this.closest('.flood-detail-modal').remove()" 
                  style="background: #007bff; color: #ffffff; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background-color 0.2s; box-shadow: 0 2px 4px rgba(0,123,255,0.3);"
                  onmouseover="this.style.background='#0056b3'"
                  onmouseout="this.style.background='#007bff'">
            닫기
          </button>
        </div>
      </div>
    `

    // 모달 생성
    const modal = document.createElement('div')
    modal.className = 'flood-detail-modal'
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `

    const modalContent = document.createElement('div')
    modalContent.style.cssText = `
      background: white;
      border-radius: 10px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `
    modalContent.innerHTML = detailContent

    modal.appendChild(modalContent)
    document.body.appendChild(modal)

    // 모달 외부 클릭 시 닫기
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove()
      }
    })
  }

  /**
   * 정보 창 내용 생성
   */
  const createInfoWindowContent = (floodInfo) => {
    return `
      <div class="flood-info-window">
        <div class="flood-info-header">
          <h4>${floodInfo.alertType}</h4>
          <span class="severity-badge severity-${floodInfo.severity}">
            ${floodInfo.severity.toUpperCase()}
          </span>
        </div>
        <div class="flood-info-body">
          <p><strong>위치:</strong> ${floodInfo.latitude.toFixed(4)}, ${floodInfo.longitude.toFixed(4)}</p>
          <p><strong>시간:</strong> ${new Date(floodInfo.timestamp).toLocaleString()}</p>
          <p><strong>데이터 소스:</strong> ${floodInfo.sources?.join(', ') || 'N/A'}</p>
          ${floodInfo.availableAPIs?.length > 0 ?
        `<p><strong>이용 가능한 API:</strong> ${floodInfo.availableAPIs.join(', ')}</p>` :
        ''
      }
        </div>
        <div class="flood-info-actions">
          <button onclick="window.mapContainer.showDetailedInfo('${floodInfo.id}')" class="info-button">
            상세 정보
          </button>
        </div>
      </div>
    `
  }

  /**
   * 현재 위치로 이동
   */
  const moveToCurrentLocation = useCallback(() => {
    if (enableUserLocation) {
      getUserLocation()
    }
  }, [enableUserLocation])

  /**
   * 홍수 데이터 새로고침
   */
  const refreshFloodData = useCallback(() => {
    loadFloodData()
  }, [map])

  return (
    <div className="map-container" data-testid="map-container">
      {/* 항상 DOM 요소를 렌더링하되, 로딩/에러 오버레이로 처리 */}
      <div ref={mapRef} className="naver-map" data-testid="naver-map" />

      {/* 로딩 오버레이 */}
      {mapLoading && (
        <div className="map-loading">
          <div className="loading-spinner" data-testid="loading-spinner"></div>
          <p>지도를 로드하는 중...</p>
        </div>
      )}

      {/* 에러 오버레이 */}
      {error && (
        <div className="map-error">
          <h3>지도 로드 오류</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            새로고침
          </button>
        </div>
      )}

      {/* 지도 컨트롤 패널 */}
      {showControls && (
        <div className="map-controls">
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
    </div>
  )
}

export default MapContainer