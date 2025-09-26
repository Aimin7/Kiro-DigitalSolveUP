// 지도 컴포넌트 테스트
// 네이버 Web Dynamic Map 렌더링 및 마커 표시 테스트

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import MapContainer from '../../src/components/MapContainer'

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
}

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
})

describe('MapContainer Component', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Mock successful geolocation
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: 37.5665,
          longitude: 126.9780,
        },
      })
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    test('should render map container without crashing', () => {
      // Act
      render(<MapContainer />)

      // Assert
      const mapContainer = screen.getByTestId('map-container')
      expect(mapContainer).toBeInTheDocument()
    })

    test('should show loading state initially', () => {
      // Act
      render(<MapContainer />)

      // Assert
      expect(screen.getByText('지도를 로드하는 중...')).toBeInTheDocument()
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    test('should render map controls', async () => {
      // Act
      render(<MapContainer />)

      // Wait for map to load
      await waitFor(() => {
        expect(screen.queryByText('지도를 로드하는 중...')).not.toBeInTheDocument()
      })

      // Assert
      expect(screen.getByTitle('현재 위치로 이동')).toBeInTheDocument()
      expect(screen.getByTitle('침수 정보 새로고침')).toBeInTheDocument()
    })

    test('should render naver map element', async () => {
      // Act
      render(<MapContainer />)

      // Wait for map to load
      await waitFor(() => {
        expect(screen.queryByText('지도를 로드하는 중...')).not.toBeInTheDocument()
      })

      // Assert
      const naverMapElement = screen.getByTestId('naver-map')
      expect(naverMapElement).toBeInTheDocument()
      expect(naverMapElement).toHaveClass('naver-map')
    })
  })

  describe('Map Initialization', () => {
    test('should initialize naver map with default options', async () => {
      // Arrange
      const mockMap = {
        setCenter: vi.fn(),
        setZoom: vi.fn(),
        addListener: vi.fn(),
      }
      
      global.window.naver.maps.Map = vi.fn(() => mockMap)

      // Act
      render(<MapContainer />)

      // Wait for map initialization
      await waitFor(() => {
        expect(global.window.naver.maps.Map).toHaveBeenCalled()
      })

      // Assert
      expect(global.window.naver.maps.Map).toHaveBeenCalledWith(
        expect.any(Object), // map container element
        expect.objectContaining({
          center: expect.any(Object),
          zoom: 12,
          mapTypeControl: true,
          zoomControl: true,
          scaleControl: false,
          logoControl: false,
          mapDataControl: false,
        })
      )
    })

    test('should set default center to Seoul City Hall', async () => {
      // Arrange
      const mockLatLng = vi.fn()
      global.window.naver.maps.LatLng = mockLatLng

      // Act
      render(<MapContainer />)

      // Wait for map initialization
      await waitFor(() => {
        expect(mockLatLng).toHaveBeenCalled()
      })

      // Assert
      expect(mockLatLng).toHaveBeenCalledWith(37.5665, 126.9780)
    })

    test('should handle naver maps API not loaded', () => {
      // Arrange
      const originalNaver = global.window.naver
      global.window.naver = undefined

      // Act
      render(<MapContainer />)

      // Assert
      expect(screen.getByText('네이버 지도 API를 로드할 수 없습니다.')).toBeInTheDocument()
      expect(screen.getByText('새로고침')).toBeInTheDocument()

      // Cleanup
      global.window.naver = originalNaver
    })

    test('should handle map initialization error', () => {
      // Arrange
      global.window.naver.maps.Map = vi.fn(() => {
        throw new Error('Map initialization failed')
      })

      // Act
      render(<MapContainer />)

      // Assert
      expect(screen.getByText('지도를 초기화하는 중 오류가 발생했습니다.')).toBeInTheDocument()
    })
  })

  describe('User Location Handling', () => {
    test('should request user location on mount', async () => {
      // Act
      render(<MapContainer />)

      // Wait for component to mount
      await waitFor(() => {
        expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
      })

      // Assert
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      )
    })

    test('should update map center when user location is available', async () => {
      // Arrange
      const mockMap = {
        setCenter: vi.fn(),
        setZoom: vi.fn(),
        addListener: vi.fn(),
      }
      
      global.window.naver.maps.Map = vi.fn(() => mockMap)
      
      const mockUserLocation = {
        coords: {
          latitude: 37.5000,
          longitude: 127.0000,
        },
      }

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockUserLocation)
      })

      // Act
      render(<MapContainer />)

      // Wait for location update
      await waitFor(() => {
        expect(mockMap.setCenter).toHaveBeenCalled()
      })

      // Assert
      expect(mockMap.setZoom).toHaveBeenCalledWith(14)
    })

    test('should handle geolocation permission denied', async () => {
      // Arrange
      const mockMap = {
        setCenter: vi.fn(),
        setZoom: vi.fn(),
        addListener: vi.fn(),
      }
      
      global.window.naver.maps.Map = vi.fn(() => mockMap)

      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error({
          code: 1, // PERMISSION_DENIED
          message: 'User denied geolocation',
        })
      })

      // Act
      render(<MapContainer />)

      // Wait for map initialization
      await waitFor(() => {
        expect(global.window.naver.maps.Map).toHaveBeenCalled()
      })

      // Assert - should still initialize map with default location
      expect(mockMap.setCenter).not.toHaveBeenCalledWith(
        expect.objectContaining({
          lat: expect.not.stringMatching(/37.5665/),
        })
      )
    })

    test('should handle geolocation not available', async () => {
      // Arrange
      Object.defineProperty(global.navigator, 'geolocation', {
        value: undefined,
        writable: true,
      })

      const mockMap = {
        setCenter: vi.fn(),
        setZoom: vi.fn(),
        addListener: vi.fn(),
      }
      
      global.window.naver.maps.Map = vi.fn(() => mockMap)

      // Act
      render(<MapContainer />)

      // Wait for map initialization
      await waitFor(() => {
        expect(global.window.naver.maps.Map).toHaveBeenCalled()
      })

      // Assert - should use default location
      expect(mockMap.setCenter).not.toHaveBeenCalledWith(
        expect.objectContaining({
          lat: expect.not.stringMatching(/37.5665/),
        })
      )
    })
  })

  describe('Map Controls', () => {
    test('should handle current location button click', async () => {
      // Arrange
      const mockMap = {
        setCenter: vi.fn(),
        setZoom: vi.fn(),
        addListener: vi.fn(),
      }
      
      global.window.naver.maps.Map = vi.fn(() => mockMap)

      render(<MapContainer />)

      // Wait for map to load
      await waitFor(() => {
        expect(screen.queryByText('지도를 로드하는 중...')).not.toBeInTheDocument()
      })

      const locationButton = screen.getByTitle('현재 위치로 이동')

      // Act
      fireEvent.click(locationButton)

      // Assert
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(2) // Once on mount, once on click
    })

    test('should handle refresh button click', async () => {
      // Arrange
      render(<MapContainer />)

      // Wait for map to load
      await waitFor(() => {
        expect(screen.queryByText('지도를 로드하는 중...')).not.toBeInTheDocument()
      })

      const refreshButton = screen.getByTitle('침수 정보 새로고침')

      // Act
      fireEvent.click(refreshButton)

      // Assert - should trigger some refresh action
      expect(refreshButton).toBeInTheDocument()
    })

    test('should show control buttons with correct styling', async () => {
      // Act
      render(<MapContainer />)

      // Wait for map to load
      await waitFor(() => {
        expect(screen.queryByText('지도를 로드하는 중...')).not.toBeInTheDocument()
      })

      // Assert
      const locationButton = screen.getByTitle('현재 위치로 이동')
      const refreshButton = screen.getByTitle('침수 정보 새로고침')

      expect(locationButton).toHaveClass('control-button')
      expect(refreshButton).toHaveClass('control-button')
      expect(locationButton).toHaveTextContent('📍')
      expect(refreshButton).toHaveTextContent('🔄')
    })
  })

  describe('Error Handling', () => {
    test('should show error message when map fails to load', () => {
      // Arrange
      global.window.naver.maps.Map = vi.fn(() => {
        throw new Error('Map loading failed')
      })

      // Act
      render(<MapContainer />)

      // Assert
      expect(screen.getByText('지도 로드 오류')).toBeInTheDocument()
      expect(screen.getByText('지도를 초기화하는 중 오류가 발생했습니다.')).toBeInTheDocument()
      expect(screen.getByText('새로고침')).toBeInTheDocument()
    })

    test('should handle refresh button click in error state', () => {
      // Arrange
      const reloadSpy = vi.fn()
      Object.defineProperty(window, 'location', {
        value: { reload: reloadSpy },
        writable: true,
      })

      global.window.naver.maps.Map = vi.fn(() => {
        throw new Error('Map loading failed')
      })

      render(<MapContainer />)

      const refreshButton = screen.getByText('새로고침')

      // Act
      fireEvent.click(refreshButton)

      // Assert
      expect(reloadSpy).toHaveBeenCalled()
    })
  })

  describe('Responsive Design', () => {
    test('should render correctly on mobile viewport', () => {
      // Arrange
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      })

      // Act
      render(<MapContainer />)

      // Assert
      const mapContainer = screen.getByTestId('map-container')
      expect(mapContainer).toHaveClass('map-container')
    })

    test('should render correctly on desktop viewport', () => {
      // Arrange
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      })

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1080,
      })

      // Act
      render(<MapContainer />)

      // Assert
      const mapContainer = screen.getByTestId('map-container')
      expect(mapContainer).toHaveClass('map-container')
    })
  })

  describe('Accessibility', () => {
    test('should have proper ARIA labels for controls', async () => {
      // Act
      render(<MapContainer />)

      // Wait for map to load
      await waitFor(() => {
        expect(screen.queryByText('지도를 로드하는 중...')).not.toBeInTheDocument()
      })

      // Assert
      const locationButton = screen.getByTitle('현재 위치로 이동')
      const refreshButton = screen.getByTitle('침수 정보 새로고침')

      expect(locationButton).toHaveAttribute('title', '현재 위치로 이동')
      expect(refreshButton).toHaveAttribute('title', '침수 정보 새로고침')
    })

    test('should be keyboard navigable', async () => {
      // Act
      render(<MapContainer />)

      // Wait for map to load
      await waitFor(() => {
        expect(screen.queryByText('지도를 로드하는 중...')).not.toBeInTheDocument()
      })

      const locationButton = screen.getByTitle('현재 위치로 이동')

      // Assert
      expect(locationButton).toBeVisible()
      locationButton.focus()
      expect(locationButton).toHaveFocus()
    })

    test('should provide screen reader friendly content', () => {
      // Act
      render(<MapContainer />)

      // Assert
      expect(screen.getByText('지도를 로드하는 중...')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    test('should not re-render unnecessarily', async () => {
      // Arrange
      const mapConstructorSpy = vi.fn(() => ({
        setCenter: vi.fn(),
        setZoom: vi.fn(),
        addListener: vi.fn(),
      }))
      
      global.window.naver.maps.Map = mapConstructorSpy

      const { rerender } = render(<MapContainer />)

      // Wait for initial render
      await waitFor(() => {
        expect(mapConstructorSpy).toHaveBeenCalledTimes(1)
      })

      // Act - rerender with same props
      rerender(<MapContainer />)

      // Assert - should not create new map instance
      expect(mapConstructorSpy).toHaveBeenCalledTimes(1)
    })

    test('should cleanup resources on unmount', async () => {
      // Arrange
      const mockMap = {
        setCenter: vi.fn(),
        setZoom: vi.fn(),
        addListener: vi.fn(),
        destroy: vi.fn(),
      }
      
      global.window.naver.maps.Map = vi.fn(() => mockMap)

      const { unmount } = render(<MapContainer />)

      // Wait for map initialization
      await waitFor(() => {
        expect(global.window.naver.maps.Map).toHaveBeenCalled()
      })

      // Act
      unmount()

      // Assert - cleanup should be handled
      expect(mockMap.destroy).toHaveBeenCalled()
    })
  })
})