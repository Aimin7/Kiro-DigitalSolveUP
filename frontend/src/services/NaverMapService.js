// NaverMapService.js
// 네이버 Web Dynamic Map, Directions, Geocoding API 클라이언트 서비스

/**
 * 네이버 지도 서비스 클래스
 */
class NaverMapService {
  constructor() {
    this.map = null
    this.markers = new Map()
    this.infoWindows = new Map()
    this.polylines = new Map()
    this.isAPILoaded = false
    this.loadPromise = null
  }

  /**
   * 네이버 지도 API 로드 확인 및 대기
   * @returns {Promise<boolean>} API 로드 완료 여부
   */
  async ensureAPILoaded() {
    if (this.isAPILoaded && window.naver && window.naver.maps) {
      return true
    }

    if (this.loadPromise) {
      return this.loadPromise
    }

    this.loadPromise = new Promise((resolve, reject) => {
      const checkAPI = () => {
        if (window.naver && window.naver.maps) {
          this.isAPILoaded = true
          resolve(true)
        } else {
          setTimeout(checkAPI, 100)
        }
      }

      // 10초 타임아웃
      setTimeout(() => {
        if (!this.isAPILoaded) {
          reject(new Error('Naver Maps API load timeout'))
        }
      }, 10000)

      checkAPI()
    })

    return this.loadPromise
  }

  /**
   * 지도 초기화
   * @param {HTMLElement} container - 지도 컨테이너 엘리먼트
   * @param {Object} options - 지도 옵션
   * @returns {Promise<Object>} 네이버 지도 인스턴스
   */
  async initializeMap(container, options = {}) {
    await this.ensureAPILoaded()

    const defaultOptions = {
      center: new window.naver.maps.LatLng(37.5665, 126.9780), // 서울시청
      zoom: 12,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: window.naver.maps.MapTypeControlStyle.BUTTON,
        position: window.naver.maps.Position.TOP_RIGHT,
      },
      zoomControl: true,
      zoomControlOptions: {
        style: window.naver.maps.ZoomControlStyle.LARGE,
        position: window.naver.maps.Position.TOP_LEFT,
      },
      scaleControl: false,
      logoControl: false,
      mapDataControl: false,
      minZoom: 8,
      maxZoom: 18,
    }

    const mapOptions = { ...defaultOptions, ...options }
    this.map = new window.naver.maps.Map(container, mapOptions)

    // 기본 이벤트 리스너 설정
    this.setupDefaultEventListeners()

    return this.map
  }

  /**
   * 기본 이벤트 리스너 설정
   */
  setupDefaultEventListeners() {
    if (!this.map) return

    // 지도 클릭 이벤트
    window.naver.maps.Event.addListener(this.map, 'click', (e) => {
      console.log('Map clicked:', e.coord.lat(), e.coord.lng())
    })

    // 지도 이동 완료 이벤트
    window.naver.maps.Event.addListener(this.map, 'idle', () => {
      const center = this.map.getCenter()
      const zoom = this.map.getZoom()
      console.log('Map idle:', center.lat(), center.lng(), zoom)
    })
  }

  /**
   * 마커 생성
   * @param {Object} options - 마커 옵션
   * @returns {Object} 네이버 마커 인스턴스
   */
  async createMarker(options = {}) {
    await this.ensureAPILoaded()

    const {
      id,
      position,
      title,
      icon,
      zIndex = 100,
      clickable = true,
      visible = true,
    } = options

    const marker = new window.naver.maps.Marker({
      position: position instanceof window.naver.maps.LatLng 
        ? position 
        : new window.naver.maps.LatLng(position.lat, position.lng),
      map: this.map,
      title,
      icon,
      zIndex,
      clickable,
      visible,
    })

    if (id) {
      this.markers.set(id, marker)
    }

    return marker
  }

  /**
   * 마커 제거
   * @param {string|Object} markerOrId - 마커 ID 또는 마커 인스턴스
   */
  removeMarker(markerOrId) {
    let marker
    
    if (typeof markerOrId === 'string') {
      marker = this.markers.get(markerOrId)
      this.markers.delete(markerOrId)
    } else {
      marker = markerOrId
      // ID로 등록된 마커 찾아서 제거
      for (const [id, m] of this.markers.entries()) {
        if (m === marker) {
          this.markers.delete(id)
          break
        }
      }
    }

    if (marker) {
      marker.setMap(null)
    }
  }

  /**
   * 모든 마커 제거
   */
  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null))
    this.markers.clear()
  }

  /**
   * 정보창 생성
   * @param {Object} options - 정보창 옵션
   * @returns {Object} 네이버 정보창 인스턴스
   */
  async createInfoWindow(options = {}) {
    await this.ensureAPILoaded()

    const {
      id,
      content,
      maxWidth = 300,
      backgroundColor = '#fff',
      borderColor = '#ccc',
      borderWidth = 1,
      anchorSize = new window.naver.maps.Size(10, 10),
      anchorSkew = true,
      anchorColor = '#fff',
      pixelOffset = new window.naver.maps.Point(0, -10),
    } = options

    const infoWindow = new window.naver.maps.InfoWindow({
      content,
      maxWidth,
      backgroundColor,
      borderColor,
      borderWidth,
      anchorSize,
      anchorSkew,
      anchorColor,
      pixelOffset,
    })

    if (id) {
      this.infoWindows.set(id, infoWindow)
    }

    return infoWindow
  }

  /**
   * 정보창 열기
   * @param {Object} infoWindow - 정보창 인스턴스
   * @param {Object} marker - 마커 인스턴스
   */
  openInfoWindow(infoWindow, marker) {
    infoWindow.open(this.map, marker)
  }

  /**
   * 정보창 닫기
   * @param {string|Object} infoWindowOrId - 정보창 ID 또는 인스턴스
   */
  closeInfoWindow(infoWindowOrId) {
    let infoWindow
    
    if (typeof infoWindowOrId === 'string') {
      infoWindow = this.infoWindows.get(infoWindowOrId)
    } else {
      infoWindow = infoWindowOrId
    }

    if (infoWindow) {
      infoWindow.close()
    }
  }

  /**
   * 모든 정보창 닫기
   */
  closeAllInfoWindows() {
    this.infoWindows.forEach(infoWindow => infoWindow.close())
  }

  /**
   * 폴리라인 생성 (경로 표시)
   * @param {Object} options - 폴리라인 옵션
   * @returns {Object} 네이버 폴리라인 인스턴스
   */
  async createPolyline(options = {}) {
    await this.ensureAPILoaded()

    const {
      id,
      path,
      strokeColor = '#FF0000',
      strokeWeight = 3,
      strokeOpacity = 0.8,
      strokeStyle = 'solid',
    } = options

    const polylinePath = path.map(point => 
      point instanceof window.naver.maps.LatLng 
        ? point 
        : new window.naver.maps.LatLng(point.lat, point.lng)
    )

    const polyline = new window.naver.maps.Polyline({
      map: this.map,
      path: polylinePath,
      strokeColor,
      strokeWeight,
      strokeOpacity,
      strokeStyle,
    })

    if (id) {
      this.polylines.set(id, polyline)
    }

    return polyline
  }

  /**
   * 폴리라인 제거
   * @param {string|Object} polylineOrId - 폴리라인 ID 또는 인스턴스
   */
  removePolyline(polylineOrId) {
    let polyline
    
    if (typeof polylineOrId === 'string') {
      polyline = this.polylines.get(polylineOrId)
      this.polylines.delete(polylineOrId)
    } else {
      polyline = polylineOrId
      // ID로 등록된 폴리라인 찾아서 제거
      for (const [id, p] of this.polylines.entries()) {
        if (p === polyline) {
          this.polylines.delete(id)
          break
        }
      }
    }

    if (polyline) {
      polyline.setMap(null)
    }
  }

  /**
   * 모든 폴리라인 제거
   */
  clearPolylines() {
    this.polylines.forEach(polyline => polyline.setMap(null))
    this.polylines.clear()
  }

  /**
   * 지도 중심 이동
   * @param {Object} position - 이동할 위치
   * @param {number} zoom - 줌 레벨 (선택사항)
   */
  moveToPosition(position, zoom) {
    if (!this.map) return

    const latLng = position instanceof window.naver.maps.LatLng 
      ? position 
      : new window.naver.maps.LatLng(position.lat, position.lng)

    this.map.setCenter(latLng)
    
    if (zoom !== undefined) {
      this.map.setZoom(zoom)
    }
  }

  /**
   * 지도 영역을 특정 경계에 맞춤
   * @param {Array} positions - 위치 배열
   * @param {Object} options - 핏 옵션
   */
  fitBounds(positions, options = {}) {
    if (!this.map || !positions || positions.length === 0) return

    const bounds = new window.naver.maps.LatLngBounds()
    
    positions.forEach(position => {
      const latLng = position instanceof window.naver.maps.LatLng 
        ? position 
        : new window.naver.maps.LatLng(position.lat, position.lng)
      bounds.extend(latLng)
    })

    this.map.fitBounds(bounds, options)
  }

  /**
   * 현재 지도 영역 가져오기
   * @returns {Object} 지도 영역 정보
   */
  getBounds() {
    if (!this.map) return null

    const bounds = this.map.getBounds()
    const ne = bounds.getNE()
    const sw = bounds.getSW()

    return {
      north: ne.lat(),
      east: ne.lng(),
      south: sw.lat(),
      west: sw.lng(),
    }
  }

  /**
   * 현재 지도 중심과 줌 레벨 가져오기
   * @returns {Object} 지도 상태
   */
  getMapState() {
    if (!this.map) return null

    const center = this.map.getCenter()
    
    return {
      center: {
        lat: center.lat(),
        lng: center.lng(),
      },
      zoom: this.map.getZoom(),
    }
  }

  /**
   * 거리 계산 (두 지점 간)
   * @param {Object} pos1 - 첫 번째 위치
   * @param {Object} pos2 - 두 번째 위치
   * @returns {number} 거리 (미터)
   */
  static calculateDistance(pos1, pos2) {
    const R = 6371000 // 지구 반지름 (미터)
    const dLat = (pos2.lat - pos1.lat) * Math.PI / 180
    const dLng = (pos2.lng - pos1.lng) * Math.PI / 180
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  /**
   * 좌표 변환 (위경도 ↔ TM)
   * @param {Object} coord - 변환할 좌표
   * @param {string} from - 원본 좌표계
   * @param {string} to - 대상 좌표계
   * @returns {Object} 변환된 좌표
   */
  async convertCoordinate(coord, from, to) {
    await this.ensureAPILoaded()

    if (!window.naver.maps.TransCoord) {
      console.warn('TransCoord not available')
      return coord
    }

    try {
      const fromCoord = from.toUpperCase()
      const toCoord = to.toUpperCase()
      
      const point = new window.naver.maps.Point(coord.x || coord.lng, coord.y || coord.lat)
      const converted = window.naver.maps.TransCoord.fromCoordToCoord(point, fromCoord, toCoord)
      
      return {
        lat: converted.y,
        lng: converted.x,
      }
    } catch (error) {
      console.error('Coordinate conversion failed:', error)
      return coord
    }
  }

  /**
   * 지도 이벤트 리스너 추가
   * @param {string} eventName - 이벤트 이름
   * @param {Function} handler - 이벤트 핸들러
   * @returns {Object} 이벤트 리스너 객체
   */
  addEventListener(eventName, handler) {
    if (!this.map) return null

    return window.naver.maps.Event.addListener(this.map, eventName, handler)
  }

  /**
   * 지도 이벤트 리스너 제거
   * @param {Object} listener - 이벤트 리스너 객체
   */
  removeEventListener(listener) {
    if (listener) {
      window.naver.maps.Event.removeListener(listener)
    }
  }

  /**
   * 지도 스타일 변경
   * @param {string} mapTypeId - 지도 타입 ID
   */
  setMapType(mapTypeId) {
    if (!this.map) return

    const mapTypes = {
      'normal': window.naver.maps.MapTypeId.NORMAL,
      'terrain': window.naver.maps.MapTypeId.TERRAIN,
      'satellite': window.naver.maps.MapTypeId.SATELLITE,
      'hybrid': window.naver.maps.MapTypeId.HYBRID,
    }

    const mapType = mapTypes[mapTypeId] || window.naver.maps.MapTypeId.NORMAL
    this.map.setMapTypeId(mapType)
  }

  /**
   * 지도 컨트롤 표시/숨김
   * @param {string} controlName - 컨트롤 이름
   * @param {boolean} visible - 표시 여부
   */
  setControlVisible(controlName, visible) {
    if (!this.map) return

    const controls = {
      'zoom': 'zoomControl',
      'mapType': 'mapTypeControl',
      'scale': 'scaleControl',
      'logo': 'logoControl',
      'mapData': 'mapDataControl',
    }

    const controlProperty = controls[controlName]
    if (controlProperty) {
      this.map.setOptions({
        [controlProperty]: visible,
      })
    }
  }

  /**
   * 지도 상호작용 설정
   * @param {Object} options - 상호작용 옵션
   */
  setInteractionOptions(options) {
    if (!this.map) return

    const {
      draggable = true,
      pinchZoom = true,
      scrollWheel = true,
      keyboardShortcuts = true,
      disableDoubleTapZoom = false,
      disableDoubleClickZoom = false,
      disableTwoFingerTapZoom = false,
    } = options

    this.map.setOptions({
      draggable,
      pinchZoom,
      scrollWheel,
      keyboardShortcuts,
      disableDoubleTapZoom,
      disableDoubleClickZoom,
      disableTwoFingerTapZoom,
    })
  }

  /**
   * 지도 캡처 (스크린샷)
   * @param {Object} options - 캡처 옵션
   * @returns {Promise<string>} 이미지 데이터 URL
   */
  async captureMap(options = {}) {
    if (!this.map) return null

    const {
      format = 'png',
      quality = 0.8,
      width,
      height,
    } = options

    try {
      // 지도 컨테이너를 캔버스로 변환
      const mapContainer = this.map.getElement()
      const canvas = await html2canvas(mapContainer, {
        width,
        height,
        useCORS: true,
        allowTaint: true,
      })

      return canvas.toDataURL(`image/${format}`, quality)
    } catch (error) {
      console.error('Map capture failed:', error)
      return null
    }
  }

  /**
   * 서비스 정리
   */
  cleanup() {
    this.clearMarkers()
    this.closeAllInfoWindows()
    this.clearPolylines()
    
    if (this.map) {
      // 모든 이벤트 리스너 제거
      window.naver.maps.Event.clearInstanceListeners(this.map)
      this.map = null
    }

    this.isAPILoaded = false
    this.loadPromise = null
  }
}

// 싱글톤 인스턴스 생성
const naverMapService = new NaverMapService()

export default naverMapService
export { NaverMapService }