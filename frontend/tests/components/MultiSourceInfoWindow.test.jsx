// 다중 소스 정보창 컴포넌트 테스트
// 3개 API 정보 구분 표시 테스트

import { describe, test, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import MultiSourceInfoWindow from '../../src/components/MultiSourceInfoWindow'

describe('MultiSourceInfoWindow Component', () => {
  const mockFloodData = {
    id: 'flood-001',
    locationId: 'loc-001',
    latitude: 37.5665,
    longitude: 126.9780,
    address: '서울특별시 중구 세종대로 110',
    waterLevelData: {
      stationId: 'WL001',
      stationName: '한강대교',
      waterLevel: 2.5,
      alertLevel: 3.0,
      dangerLevel: 4.0,
      timestamp: '2024-01-15T10:30:00Z',
    },
    realtimeData: {
      stationId: 'RT001',
      waterLevel: 2.3,
      flowRate: 150.5,
      timestamp: '2024-01-15T10:35:00Z',
    },
    forecastData: {
      forecastId: 'FC001',
      region: '한강 중류',
      alertType: '주의보',
      issueTime: '2024-01-15T09:00:00Z',
      validUntil: '2024-01-15T18:00:00Z',
      description: '강수량 증가로 인한 수위 상승 예상',
    },
    availableAPIs: ['waterlevel', 'realtime', 'forecast'],
  }

  const mockProps = {
    isOpen: true,
    floodData: mockFloodData,
    position: { latitude: 37.5665, longitude: 126.9780 },
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    test('should render info window when open', () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      // Assert
      expect(screen.getByTestId('multi-source-info-window')).toBeInTheDocument()
      expect(screen.getByText('침수 정보 상세')).toBeInTheDocument()
    })

    test('should not render when closed', () => {
      // Arrange
      const closedProps = { ...mockProps, isOpen: false }

      // Act
      render(<MultiSourceInfoWindow {...closedProps} />)

      // Assert
      expect(screen.queryByTestId('multi-source-info-window')).not.toBeInTheDocument()
    })

    test('should render close button', () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      // Assert
      const closeButton = screen.getByTestId('close-button')
      expect(closeButton).toBeInTheDocument()
      expect(closeButton).toHaveAttribute('aria-label', '정보창 닫기')
    })

    test('should display location information', () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      // Assert
      expect(screen.getByText('위치 정보')).toBeInTheDocument()
      expect(screen.getByText('서울특별시 중구 세종대로 110')).toBeInTheDocument()
      expect(screen.getByText('37.5665, 126.9780')).toBeInTheDocument()
    })
  })

  describe('API Data Sections', () => {
    test('should render tabs for available APIs', () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      // Assert
      expect(screen.getByText('수위관측소')).toBeInTheDocument()
      expect(screen.getByText('실시간수위')).toBeInTheDocument()
      expect(screen.getByText('홍수예보발령')).toBeInTheDocument()
    })

    test('should show active tab content', () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      // Assert - 첫 번째 탭이 기본 활성화
      expect(screen.getByTestId('waterlevel-section')).toBeInTheDocument()
      expect(screen.getByText('한강대교')).toBeInTheDocument()
      expect(screen.getByText('2.5m')).toBeInTheDocument()
    })

    test('should switch tabs when clicked', async () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      const realtimeTab = screen.getByText('실시간수위')
      fireEvent.click(realtimeTab)

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('realtime-section')).toBeInTheDocument()
        expect(screen.getByText('150.5㎥/s')).toBeInTheDocument()
      })
    })

    test('should highlight active tab', () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      // Assert
      const waterlevelTab = screen.getByText('수위관측소')
      expect(waterlevelTab.closest('button')).toHaveClass('tab-active')
    })
  })

  describe('Water Level Data Section', () => {
    test('should display water level station information', () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      // Assert
      expect(screen.getByText('관측소명')).toBeInTheDocument()
      expect(screen.getByText('한강대교')).toBeInTheDocument()
      expect(screen.getByText('현재 수위')).toBeInTheDocument()
      expect(screen.getByText('2.5m')).toBeInTheDocument()
      expect(screen.getByText('주의 수위')).toBeInTheDocument()
      expect(screen.getByText('3.0m')).toBeInTheDocument()
      expect(screen.getByText('위험 수위')).toBeInTheDocument()
      expect(screen.getByText('4.0m')).toBeInTheDocument()
    })

    test('should show water level status indicator', () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      // Assert
      const statusIndicator = screen.getByTestId('water-level-status')
      expect(statusIndicator).toBeInTheDocument()
      expect(statusIndicator).toHaveClass('status-normal') // 2.5 < 3.0 (주의수위)
    })

    test('should format timestamp correctly', () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      // Assert
      expect(screen.getByText('측정시간')).toBeInTheDocument()
      expect(screen.getByText(/2024-01-15.*10:30/)).toBeInTheDocument()
    })
  })

  describe('Realtime Data Section', () => {
    test('should display realtime water information when tab is active', async () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      const realtimeTab = screen.getByText('실시간수위')
      fireEvent.click(realtimeTab)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('실시간 수위')).toBeInTheDocument()
        expect(screen.getByText('2.3m')).toBeInTheDocument()
        expect(screen.getByText('유량')).toBeInTheDocument()
        expect(screen.getByText('150.5㎥/s')).toBeInTheDocument()
      })
    })

    test('should show realtime data timestamp', async () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      const realtimeTab = screen.getByText('실시간수위')
      fireEvent.click(realtimeTab)

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/2024-01-15.*10:35/)).toBeInTheDocument()
      })
    })
  })

  describe('Forecast Data Section', () => {
    test('should display forecast information when tab is active', async () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      const forecastTab = screen.getByText('홍수예보발령')
      fireEvent.click(forecastTab)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('예보 지역')).toBeInTheDocument()
        expect(screen.getByText('한강 중류')).toBeInTheDocument()
        expect(screen.getByText('경보 유형')).toBeInTheDocument()
        expect(screen.getByText('주의보')).toBeInTheDocument()
        expect(screen.getByText('예보 내용')).toBeInTheDocument()
        expect(screen.getByText('강수량 증가로 인한 수위 상승 예상')).toBeInTheDocument()
      })
    })

    test('should show forecast validity period', async () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      const forecastTab = screen.getByText('홍수예보발령')
      fireEvent.click(forecastTab)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('유효기간')).toBeInTheDocument()
        expect(screen.getByText(/09:00.*18:00/)).toBeInTheDocument()
      })
    })

    test('should display alert type with appropriate styling', async () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      const forecastTab = screen.getByText('홍수예보발령')
      fireEvent.click(forecastTab)

      // Assert
      await waitFor(() => {
        const alertBadge = screen.getByTestId('alert-type-badge')
        expect(alertBadge).toBeInTheDocument()
        expect(alertBadge).toHaveClass('alert-warning') // 주의보
        expect(alertBadge).toHaveTextContent('주의보')
      })
    })
  })

  describe('Missing Data Handling', () => {
    test('should show "정보 없음" when API data is missing', () => {
      // Arrange
      const incompleteData = {
        ...mockFloodData,
        waterLevelData: null,
        availableAPIs: ['realtime', 'forecast'],
      }
      const incompleteProps = { ...mockProps, floodData: incompleteData }

      // Act
      render(<MultiSourceInfoWindow {...incompleteProps} />)

      // Assert
      expect(screen.getByText('수위관측소')).toBeInTheDocument()
      
      // 수위관측소 탭 클릭
      const waterlevelTab = screen.getByText('수위관측소')
      fireEvent.click(waterlevelTab)
      
      expect(screen.getByText('해당 API 정보 없음')).toBeInTheDocument()
    })

    test('should disable tabs for unavailable APIs', () => {
      // Arrange
      const partialData = {
        ...mockFloodData,
        realtimeData: null,
        availableAPIs: ['waterlevel', 'forecast'],
      }
      const partialProps = { ...mockProps, floodData: partialData }

      // Act
      render(<MultiSourceInfoWindow {...partialProps} />)

      // Assert
      const realtimeTab = screen.getByText('실시간수위').closest('button')
      expect(realtimeTab).toHaveClass('tab-disabled')
      expect(realtimeTab).toBeDisabled()
    })

    test('should show appropriate message for each missing API', async () => {
      // Arrange
      const noDataProps = {
        ...mockProps,
        floodData: {
          ...mockFloodData,
          waterLevelData: null,
          realtimeData: null,
          forecastData: null,
          availableAPIs: [],
        },
      }

      // Act
      render(<MultiSourceInfoWindow {...noDataProps} />)

      // Test each tab
      const tabs = ['수위관측소', '실시간수위', '홍수예보발령']
      
      for (const tabName of tabs) {
        const tab = screen.getByText(tabName)
        fireEvent.click(tab)
        
        await waitFor(() => {
          expect(screen.getByText('해당 API 정보 없음')).toBeInTheDocument()
        })
      }
    })
  })

  describe('User Interactions', () => {
    test('should call onClose when close button is clicked', () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      const closeButton = screen.getByTestId('close-button')
      fireEvent.click(closeButton)

      // Assert
      expect(mockProps.onClose).toHaveBeenCalledTimes(1)
    })

    test('should call onClose when overlay is clicked', () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      const overlay = screen.getByTestId('info-window-overlay')
      fireEvent.click(overlay)

      // Assert
      expect(mockProps.onClose).toHaveBeenCalledTimes(1)
    })

    test('should not close when content area is clicked', () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      const content = screen.getByTestId('info-window-content')
      fireEvent.click(content)

      // Assert
      expect(mockProps.onClose).not.toHaveBeenCalled()
    })

    test('should handle keyboard navigation', () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      const firstTab = screen.getByText('수위관측소')
      const secondTab = screen.getByText('실시간수위')

      // Test tab navigation
      firstTab.focus()
      expect(firstTab).toHaveFocus()

      fireEvent.keyDown(firstTab, { key: 'ArrowRight' })
      expect(secondTab).toHaveFocus()
    })

    test('should close on Escape key', () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      const infoWindow = screen.getByTestId('multi-source-info-window')
      fireEvent.keyDown(infoWindow, { key: 'Escape' })

      // Assert
      expect(mockProps.onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Responsive Design', () => {
    test('should adapt to mobile viewport', () => {
      // Arrange
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      // Assert
      const infoWindow = screen.getByTestId('multi-source-info-window')
      expect(infoWindow).toHaveClass('mobile-layout')
    })

    test('should show compact view on small screens', () => {
      // Arrange
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      })

      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      // Assert
      const tabContainer = screen.getByTestId('tab-container')
      expect(tabContainer).toHaveClass('compact-tabs')
    })
  })

  describe('Accessibility', () => {
    test('should have proper ARIA attributes', () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      // Assert
      const infoWindow = screen.getByTestId('multi-source-info-window')
      expect(infoWindow).toHaveAttribute('role', 'dialog')
      expect(infoWindow).toHaveAttribute('aria-labelledby', 'info-window-title')
      expect(infoWindow).toHaveAttribute('aria-modal', 'true')
    })

    test('should have proper tab accessibility', () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      // Assert
      const tabList = screen.getByRole('tablist')
      expect(tabList).toBeInTheDocument()

      const tabs = screen.getAllByRole('tab')
      expect(tabs).toHaveLength(3)

      tabs.forEach((tab, index) => {
        expect(tab).toHaveAttribute('aria-selected', index === 0 ? 'true' : 'false')
        expect(tab).toHaveAttribute('tabindex', index === 0 ? '0' : '-1')
      })
    })

    test('should have proper tabpanel accessibility', () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      // Assert
      const tabPanel = screen.getByRole('tabpanel')
      expect(tabPanel).toBeInTheDocument()
      expect(tabPanel).toHaveAttribute('aria-labelledby')
    })

    test('should support screen reader announcements', async () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      const realtimeTab = screen.getByText('실시간수위')
      fireEvent.click(realtimeTab)

      // Assert
      await waitFor(() => {
        const announcement = screen.getByTestId('sr-announcement')
        expect(announcement).toHaveTextContent('실시간수위 정보가 표시되었습니다')
      })
    })
  })

  describe('Data Formatting', () => {
    test('should format water level values correctly', () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      // Assert
      expect(screen.getByText('2.5m')).toBeInTheDocument()
      expect(screen.getByText('3.0m')).toBeInTheDocument()
      expect(screen.getByText('4.0m')).toBeInTheDocument()
    })

    test('should format flow rate values correctly', async () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      const realtimeTab = screen.getByText('실시간수위')
      fireEvent.click(realtimeTab)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('150.5㎥/s')).toBeInTheDocument()
      })
    })

    test('should format timestamps in Korean locale', () => {
      // Act
      render(<MultiSourceInfoWindow {...mockProps} />)

      // Assert
      const timestamp = screen.getByText(/2024년 1월 15일/)
      expect(timestamp).toBeInTheDocument()
    })

    test('should handle null or undefined values gracefully', () => {
      // Arrange
      const dataWithNulls = {
        ...mockFloodData,
        waterLevelData: {
          ...mockFloodData.waterLevelData,
          waterLevel: null,
          alertLevel: undefined,
        },
      }
      const nullProps = { ...mockProps, floodData: dataWithNulls }

      // Act
      render(<MultiSourceInfoWindow {...nullProps} />)

      // Assert
      expect(screen.getByText('측정 불가')).toBeInTheDocument()
    })
  })
})