// FloodMarker.test.jsx
// 침수 지점 마커 표시 및 심각도별 색상 구분 컴포넌트 테스트

import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import FloodMarker from '../../src/components/FloodMarker'

// Mock 네이버 지도 API
const mockMarker = {
  setMap: vi.fn(),
  setVisible: vi.fn(),
  setIcon: vi.fn(),
}

const mockNaverMaps = {
  LatLng: vi.fn((lat, lng) => ({ lat, lng })),
  Marker: vi.fn(() => mockMarker),
  Size: vi.fn((width, height) => ({ width, height })),
  Point: vi.fn((x, y) => ({ x, y })),
  Event: {
    addListener: vi.fn(),
    removeListener: vi.fn(),
  },
}

// 전역 window.naver 모킹
Object.defineProperty(window, 'naver', {
  value: {
    maps: mockNaverMaps,
  },
  writable: true,
})

describe('FloodMarker', () => {
  const mockMap = { id: 'test-map' }
  const mockOnClick = vi.fn()

  const defaultFloodInfo = {
    id: 'flood-001',
    latitude: 37.5665,
    longitude: 126.9780,
    alertType: '주의보',
    severity: 'low',
    timestamp: '2023-07-15T10:00:00Z',
    sources: ['waterlevel'],
    availableAPIs: ['waterlevel'],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Marker Creation', () => {
    it('should create marker with correct position', () => {
      render(
        <FloodMarker
          floodInfo={defaultFloodInfo}
          map={mockMap}
          onClick={mockOnClick}
        />
      )

      expect(mockNaverMaps.LatLng).toHaveBeenCalledWith(37.5665, 126.9780)
      expect(mockNaverMaps.Marker).toHaveBeenCalledWith(
        expect.objectContaining({
          position: expect.objectContaining({
            lat: 37.5665,
            lng: 126.9780,
          }),
          map: mockMap,
        })
      )
    })

    it('should create marker with correct title', () => {
      render(
        <FloodMarker
          floodInfo={defaultFloodInfo}
          map={mockMap}
          onClick={mockOnClick}
        />
      )

      expect(mockNaverMaps.Marker).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '홍수주의보 (낮음)',
        })
      )
    })

    it('should not create marker with invalid coordinates', () => {
      const invalidFloodInfo = {
        ...defaultFloodInfo,
        latitude: null,
        longitude: null,
      }

      render(
        <FloodMarker
          floodInfo={invalidFloodInfo}
          map={mockMap}
          onClick={mockOnClick}
        />
      )

      expect(mockNaverMaps.Marker).not.toHaveBeenCalled()
    })
  })

  describe('Marker Icon', () => {
    it('should create correct icon for low severity', () => {
      render(
        <FloodMarker
          floodInfo={{ ...defaultFloodInfo, severity: 'low' }}
          map={mockMap}
        />
      )

      const markerCall = mockNaverMaps.Marker.mock.calls[0][0]
      expect(markerCall.icon.content).toContain('background-color: #4CAF50') // 초록색
      expect(markerCall.icon.content).toContain('💧') // 주의보 아이콘
    })

    it('should create correct icon for medium severity', () => {
      render(
        <FloodMarker
          floodInfo={{ ...defaultFloodInfo, severity: 'medium', alertType: '경보' }}
          map={mockMap}
        />
      )

      const markerCall = mockNaverMaps.Marker.mock.calls[0][0]
      expect(markerCall.icon.content).toContain('background-color: #FF9800') // 주황색
      expect(markerCall.icon.content).toContain('🚨') // 경보 아이콘
    })

    it('should create correct icon for high severity', () => {
      render(
        <FloodMarker
          floodInfo={{ ...defaultFloodInfo, severity: 'high', alertType: '특보' }}
          map={mockMap}
        />
      )

      const markerCall = mockNaverMaps.Marker.mock.calls[0][0]
      expect(markerCall.icon.content).toContain('background-color: #F44336') // 빨간색
      expect(markerCall.icon.content).toContain('⚠️') // 특보 아이콘
    })

    it('should create larger icon for higher severity', () => {
      render(
        <FloodMarker
          floodInfo={{ ...defaultFloodInfo, severity: 'high' }}
          map={mockMap}
        />
      )

      const markerCall = mockNaverMaps.Marker.mock.calls[0][0]
      expect(markerCall.icon.content).toContain('width: 32px')
      expect(markerCall.icon.content).toContain('height: 32px')
    })

    it('should create smaller icon for lower severity', () => {
      render(
        <FloodMarker
          floodInfo={{ ...defaultFloodInfo, severity: 'low' }}
          map={mockMap}
        />
      )

      const markerCall = mockNaverMaps.Marker.mock.calls[0][0]
      expect(markerCall.icon.content).toContain('width: 24px')
      expect(markerCall.icon.content).toContain('height: 24px')
    })
  })

  describe('Marker Z-Index', () => {
    it('should set higher z-index for higher severity', () => {
      render(
        <FloodMarker
          floodInfo={{ ...defaultFloodInfo, severity: 'high' }}
          map={mockMap}
        />
      )

      expect(mockNaverMaps.Marker).toHaveBeenCalledWith(
        expect.objectContaining({
          zIndex: 300,
        })
      )
    })

    it('should set lower z-index for lower severity', () => {
      render(
        <FloodMarker
          floodInfo={{ ...defaultFloodInfo, severity: 'low' }}
          map={mockMap}
        />
      )

      expect(mockNaverMaps.Marker).toHaveBeenCalledWith(
        expect.objectContaining({
          zIndex: 100,
        })
      )
    })
  })

  describe('Event Handling', () => {
    it('should add click event listener when onClick is provided', () => {
      render(
        <FloodMarker
          floodInfo={defaultFloodInfo}
          map={mockMap}
          onClick={mockOnClick}
        />
      )

      expect(mockNaverMaps.Event.addListener).toHaveBeenCalledWith(
        mockMarker,
        'click',
        expect.any(Function)
      )
    })

    it('should call onClick handler when marker is clicked', () => {
      render(
        <FloodMarker
          floodInfo={defaultFloodInfo}
          map={mockMap}
          onClick={mockOnClick}
        />
      )

      // 클릭 이벤트 리스너 호출
      const clickHandler = mockNaverMaps.Event.addListener.mock.calls.find(
        call => call[1] === 'click'
      )[2]
      
      clickHandler()

      expect(mockOnClick).toHaveBeenCalledWith(defaultFloodInfo, mockMarker)
    })

    it('should add hover event listeners', () => {
      render(
        <FloodMarker
          floodInfo={defaultFloodInfo}
          map={mockMap}
          onClick={mockOnClick}
        />
      )

      expect(mockNaverMaps.Event.addListener).toHaveBeenCalledWith(
        mockMarker,
        'mouseover',
        expect.any(Function)
      )

      expect(mockNaverMaps.Event.addListener).toHaveBeenCalledWith(
        mockMarker,
        'mouseout',
        expect.any(Function)
      )
    })

    it('should change icon on hover', () => {
      render(
        <FloodMarker
          floodInfo={defaultFloodInfo}
          map={mockMap}
          onClick={mockOnClick}
        />
      )

      // 마우스 오버 이벤트 리스너 호출
      const mouseOverHandler = mockNaverMaps.Event.addListener.mock.calls.find(
        call => call[1] === 'mouseover'
      )[2]
      
      mouseOverHandler()

      expect(mockMarker.setIcon).toHaveBeenCalled()
    })
  })

  describe('Visibility Control', () => {
    it('should show marker by default', () => {
      render(
        <FloodMarker
          floodInfo={defaultFloodInfo}
          map={mockMap}
        />
      )

      expect(mockNaverMaps.Marker).toHaveBeenCalledWith(
        expect.objectContaining({
          clickable: true,
        })
      )
    })

    it('should hide marker when visible is false', () => {
      const { rerender } = render(
        <FloodMarker
          floodInfo={defaultFloodInfo}
          map={mockMap}
          visible={true}
        />
      )

      rerender(
        <FloodMarker
          floodInfo={defaultFloodInfo}
          map={mockMap}
          visible={false}
        />
      )

      expect(mockMarker.setVisible).toHaveBeenCalledWith(false)
    })

    it('should show marker when visible changes to true', () => {
      const { rerender } = render(
        <FloodMarker
          floodInfo={defaultFloodInfo}
          map={mockMap}
          visible={false}
        />
      )

      rerender(
        <FloodMarker
          floodInfo={defaultFloodInfo}
          map={mockMap}
          visible={true}
        />
      )

      expect(mockMarker.setVisible).toHaveBeenCalledWith(true)
    })
  })

  describe('Custom Icon', () => {
    it('should use custom icon when provided', () => {
      const customIcon = {
        content: '<div>Custom Icon</div>',
        size: { width: 40, height: 40 },
      }

      render(
        <FloodMarker
          floodInfo={defaultFloodInfo}
          map={mockMap}
          customIcon={customIcon}
        />
      )

      expect(mockNaverMaps.Marker).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: customIcon,
        })
      )
    })
  })

  describe('Cleanup', () => {
    it('should remove marker from map on unmount', () => {
      const { unmount } = render(
        <FloodMarker
          floodInfo={defaultFloodInfo}
          map={mockMap}
        />
      )

      unmount()

      expect(mockMarker.setMap).toHaveBeenCalledWith(null)
    })
  })

  describe('Alert Type Mapping', () => {
    it('should map alert types correctly', () => {
      const testCases = [
        { alertType: '특보', expected: '홍수특보' },
        { alertType: '경보', expected: '홍수경보' },
        { alertType: '주의보', expected: '홍수주의보' },
      ]

      testCases.forEach(({ alertType, expected }) => {
        render(
          <FloodMarker
            floodInfo={{ ...defaultFloodInfo, alertType }}
            map={mockMap}
          />
        )

        expect(mockNaverMaps.Marker).toHaveBeenCalledWith(
          expect.objectContaining({
            title: expect.stringContaining(expected),
          })
        )

        vi.clearAllMocks()
      })
    })
  })

  describe('Severity Mapping', () => {
    it('should map severity levels correctly', () => {
      const testCases = [
        { severity: 'high', expected: '높음' },
        { severity: 'medium', expected: '보통' },
        { severity: 'low', expected: '낮음' },
      ]

      testCases.forEach(({ severity, expected }) => {
        render(
          <FloodMarker
            floodInfo={{ ...defaultFloodInfo, severity }}
            map={mockMap}
          />
        )

        expect(mockNaverMaps.Marker).toHaveBeenCalledWith(
          expect.objectContaining({
            title: expect.stringContaining(expected),
          })
        )

        vi.clearAllMocks()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle missing map gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      render(
        <FloodMarker
          floodInfo={defaultFloodInfo}
          map={null}
        />
      )

      expect(mockNaverMaps.Marker).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should handle missing naver maps API gracefully', () => {
      const originalNaver = window.naver
      delete window.naver

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      render(
        <FloodMarker
          floodInfo={defaultFloodInfo}
          map={mockMap}
        />
      )

      expect(consoleSpy).toHaveBeenCalled()

      window.naver = originalNaver
      consoleSpy.mockRestore()
    })
  })
})