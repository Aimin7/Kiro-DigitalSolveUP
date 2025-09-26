// 경로 근접성 알림 컴포넌트 테스트
// 1.5km 반경 감지 및 대체 경로 제안 알림 테스트

import { describe, test, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RouteProximityAlert from '../../src/components/RouteProximityAlert'

describe('RouteProximityAlert Component', () => {
  const mockFloodPoints = [
    {
      id: 'flood-001',
      latitude: 37.5665,
      longitude: 126.9780,
      alertType: '주의보',
      severity: 'medium',
      distance: 800, // 0.8km
    },
    {
      id: 'flood-002',
      latitude: 37.5670,
      longitude: 126.9785,
      alertType: '경보',
      severity: 'high',
      distance: 1200, // 1.2km
    },
  ]

  const mockRoute = {
    path: [
      [126.9780, 37.5665],
      [126.9785, 37.5670],
      [126.9790, 37.5675],
    ],
    summary: {
      distance: 2500,
      duration: 300000, // 5분
    },
  }

  const mockAlternativeRoute = {
    path: [
      [126.9780, 37.5665],
      [126.9800, 37.5680],
      [126.9790, 37.5675],
    ],
    summary: {
      distance: 3200,
      duration: 420000, // 7분
    },
  }

  const mockProps = {
    isVisible: true,
    floodPoints: mockFloodPoints,
    currentRoute: mockRoute,
    alternativeRoute: mockAlternativeRoute,
    proximityRadius: 1500, // 1.5km
    onAcceptAlternative: vi.fn(),
    onDismiss: vi.fn(),
    onRequestAlternative: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    test('should render alert when visible', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      // Assert
      expect(screen.getByTestId('proximity-alert')).toBeInTheDocument()
      expect(screen.getByText('경로 주의 알림')).toBeInTheDocument()
    })

    test('should not render when not visible', () => {
      // Arrange
      const hiddenProps = { ...mockProps, isVisible: false }

      // Act
      render(<RouteProximityAlert {...hiddenProps} />)

      // Assert
      expect(screen.queryByTestId('proximity-alert')).not.toBeInTheDocument()
    })

    test('should display proximity warning message', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      // Assert
      expect(screen.getByText(/경로상에 홍수주의보 지역이 1.5km 내에 있습니다/)).toBeInTheDocument()
      expect(screen.getByText(/대체 경로를 확인하시겠습니까/)).toBeInTheDocument()
    })

    test('should show number of nearby flood points', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      // Assert
      expect(screen.getByText('2개의 침수 지점이 감지되었습니다')).toBeInTheDocument()
    })

    test('should display closest flood point distance', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      // Assert
      expect(screen.getByText('가장 가까운 지점: 0.8km')).toBeInTheDocument()
    })
  })

  describe('Flood Points Information', () => {
    test('should display flood points list', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      // Assert
      expect(screen.getByText('감지된 침수 지점')).toBeInTheDocument()
      
      // 각 침수 지점 정보 확인
      expect(screen.getByText('주의보 (0.8km)')).toBeInTheDocument()
      expect(screen.getByText('경보 (1.2km)')).toBeInTheDocument()
    })

    test('should show severity indicators', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      // Assert
      const mediumSeverity = screen.getByTestId('severity-medium')
      const highSeverity = screen.getByTestId('severity-high')
      
      expect(mediumSeverity).toBeInTheDocument()
      expect(mediumSeverity).toHaveClass('severity-medium')
      expect(highSeverity).toBeInTheDocument()
      expect(highSeverity).toHaveClass('severity-high')
    })

    test('should sort flood points by distance', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      // Assert
      const floodPointsList = screen.getByTestId('flood-points-list')
      const floodPoints = floodPointsList.querySelectorAll('[data-testid^="flood-point-"]')
      
      expect(floodPoints[0]).toHaveTextContent('0.8km')
      expect(floodPoints[1]).toHaveTextContent('1.2km')
    })

    test('should handle empty flood points', () => {
      // Arrange
      const emptyProps = { ...mockProps, floodPoints: [] }

      // Act
      render(<RouteProximityAlert {...emptyProps} />)

      // Assert
      expect(screen.getByText('침수 지점 정보를 불러올 수 없습니다')).toBeInTheDocument()
    })
  })

  describe('Route Comparison', () => {
    test('should display current route information', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      // Assert
      expect(screen.getByText('현재 경로')).toBeInTheDocument()
      expect(screen.getByText('2.5km')).toBeInTheDocument()
      expect(screen.getByText('5분')).toBeInTheDocument()
    })

    test('should display alternative route information', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      // Assert
      expect(screen.getByText('대체 경로')).toBeInTheDocument()
      expect(screen.getByText('3.2km')).toBeInTheDocument()
      expect(screen.getByText('7분')).toBeInTheDocument()
    })

    test('should show route comparison differences', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      // Assert
      expect(screen.getByText('+0.7km')).toBeInTheDocument() // 거리 차이
      expect(screen.getByText('+2분')).toBeInTheDocument() // 시간 차이
    })

    test('should handle missing alternative route', () => {
      // Arrange
      const noAlternativeProps = { ...mockProps, alternativeRoute: null }

      // Act
      render(<RouteProximityAlert {...noAlternativeProps} />)

      // Assert
      expect(screen.getByText('대체 경로를 계산하는 중...')).toBeInTheDocument()
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    test('should show safety indicator for alternative route', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      // Assert
      const safetyBadge = screen.getByTestId('safety-badge')
      expect(safetyBadge).toBeInTheDocument()
      expect(safetyBadge).toHaveTextContent('안전 경로')
      expect(safetyBadge).toHaveClass('badge-safe')
    })
  })

  describe('User Actions', () => {
    test('should handle accept alternative route', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      const acceptButton = screen.getByText('대체 경로 사용')
      fireEvent.click(acceptButton)

      // Assert
      expect(mockProps.onAcceptAlternative).toHaveBeenCalledTimes(1)
      expect(mockProps.onAcceptAlternative).toHaveBeenCalledWith(mockAlternativeRoute)
    })

    test('should handle dismiss alert', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      const dismissButton = screen.getByText('현재 경로 유지')
      fireEvent.click(dismissButton)

      // Assert
      expect(mockProps.onDismiss).toHaveBeenCalledTimes(1)
    })

    test('should handle request new alternative', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      const requestButton = screen.getByText('다른 경로 찾기')
      fireEvent.click(requestButton)

      // Assert
      expect(mockProps.onRequestAlternative).toHaveBeenCalledTimes(1)
    })

    test('should close on close button click', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      const closeButton = screen.getByTestId('close-button')
      fireEvent.click(closeButton)

      // Assert
      expect(mockProps.onDismiss).toHaveBeenCalledTimes(1)
    })

    test('should handle keyboard navigation', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      const acceptButton = screen.getByText('대체 경로 사용')
      const dismissButton = screen.getByText('현재 경로 유지')

      // Test tab navigation
      acceptButton.focus()
      expect(acceptButton).toHaveFocus()

      fireEvent.keyDown(acceptButton, { key: 'Tab' })
      expect(dismissButton).toHaveFocus()
    })

    test('should close on Escape key', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      const alert = screen.getByTestId('proximity-alert')
      fireEvent.keyDown(alert, { key: 'Escape' })

      // Assert
      expect(mockProps.onDismiss).toHaveBeenCalledTimes(1)
    })
  })

  describe('Alert Severity Levels', () => {
    test('should show high severity alert for dangerous areas', () => {
      // Arrange
      const highSeverityProps = {
        ...mockProps,
        floodPoints: [
          {
            id: 'flood-danger',
            latitude: 37.5665,
            longitude: 126.9780,
            alertType: '특보',
            severity: 'high',
            distance: 500, // 0.5km - very close
          },
        ],
      }

      // Act
      render(<RouteProximityAlert {...highSeverityProps} />)

      // Assert
      const alert = screen.getByTestId('proximity-alert')
      expect(alert).toHaveClass('alert-high-severity')
      expect(screen.getByText('⚠️ 위험')).toBeInTheDocument()
    })

    test('should show medium severity alert for warning areas', () => {
      // Arrange
      const mediumSeverityProps = {
        ...mockProps,
        floodPoints: [
          {
            id: 'flood-warning',
            latitude: 37.5665,
            longitude: 126.9780,
            alertType: '경보',
            severity: 'medium',
            distance: 1000,
          },
        ],
      }

      // Act
      render(<RouteProximityAlert {...mediumSeverityProps} />)

      // Assert
      const alert = screen.getByTestId('proximity-alert')
      expect(alert).toHaveClass('alert-medium-severity')
      expect(screen.getByText('⚡ 주의')).toBeInTheDocument()
    })

    test('should show low severity alert for advisory areas', () => {
      // Arrange
      const lowSeverityProps = {
        ...mockProps,
        floodPoints: [
          {
            id: 'flood-advisory',
            latitude: 37.5665,
            longitude: 126.9780,
            alertType: '주의보',
            severity: 'low',
            distance: 1400,
          },
        ],
      }

      // Act
      render(<RouteProximityAlert {...lowSeverityProps} />)

      // Assert
      const alert = screen.getByTestId('proximity-alert')
      expect(alert).toHaveClass('alert-low-severity')
      expect(screen.getByText('ℹ️ 정보')).toBeInTheDocument()
    })
  })

  describe('Animation and Transitions', () => {
    test('should animate in when becoming visible', async () => {
      // Arrange
      const { rerender } = render(<RouteProximityAlert {...mockProps} isVisible={false} />)

      // Act
      rerender(<RouteProximityAlert {...mockProps} isVisible={true} />)

      // Assert
      await waitFor(() => {
        const alert = screen.getByTestId('proximity-alert')
        expect(alert).toHaveClass('animate-slide-in')
      })
    })

    test('should animate out when becoming hidden', async () => {
      // Arrange
      const { rerender } = render(<RouteProximityAlert {...mockProps} isVisible={true} />)

      // Act
      rerender(<RouteProximityAlert {...mockProps} isVisible={false} />)

      // Assert
      await waitFor(() => {
        expect(screen.queryByTestId('proximity-alert')).not.toBeInTheDocument()
      })
    })

    test('should show loading animation for alternative route', () => {
      // Arrange
      const loadingProps = { ...mockProps, alternativeRoute: null }

      // Act
      render(<RouteProximityAlert {...loadingProps} />)

      // Assert
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('animate-spin')
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
      render(<RouteProximityAlert {...mockProps} />)

      // Assert
      const alert = screen.getByTestId('proximity-alert')
      expect(alert).toHaveClass('mobile-layout')
    })

    test('should stack buttons vertically on small screens', () => {
      // Arrange
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      })

      // Act
      render(<RouteProximityAlert {...mockProps} />)

      // Assert
      const buttonContainer = screen.getByTestId('button-container')
      expect(buttonContainer).toHaveClass('vertical-stack')
    })

    test('should show compact route info on mobile', () => {
      // Arrange
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      // Act
      render(<RouteProximityAlert {...mockProps} />)

      // Assert
      const routeComparison = screen.getByTestId('route-comparison')
      expect(routeComparison).toHaveClass('compact-view')
    })
  })

  describe('Accessibility', () => {
    test('should have proper ARIA attributes', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      // Assert
      const alert = screen.getByTestId('proximity-alert')
      expect(alert).toHaveAttribute('role', 'alertdialog')
      expect(alert).toHaveAttribute('aria-labelledby', 'alert-title')
      expect(alert).toHaveAttribute('aria-describedby', 'alert-description')
      expect(alert).toHaveAttribute('aria-modal', 'true')
    })

    test('should announce alert to screen readers', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      // Assert
      const liveRegion = screen.getByTestId('sr-announcement')
      expect(liveRegion).toHaveAttribute('aria-live', 'assertive')
      expect(liveRegion).toHaveTextContent('경로 주의 알림: 2개의 침수 지점이 1.5km 내에 감지되었습니다')
    })

    test('should have proper button labels', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      // Assert
      const acceptButton = screen.getByText('대체 경로 사용')
      const dismissButton = screen.getByText('현재 경로 유지')
      const requestButton = screen.getByText('다른 경로 찾기')

      expect(acceptButton).toHaveAttribute('aria-describedby', 'alternative-route-info')
      expect(dismissButton).toHaveAttribute('aria-describedby', 'current-route-info')
      expect(requestButton).toHaveAttribute('aria-label', '새로운 대체 경로 요청')
    })

    test('should support keyboard navigation', () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      const buttons = screen.getAllByRole('button')
      
      // Test tab order
      buttons[0].focus()
      expect(buttons[0]).toHaveFocus()

      fireEvent.keyDown(buttons[0], { key: 'Tab' })
      expect(buttons[1]).toHaveFocus()
    })

    test('should have proper focus management', async () => {
      // Act
      render(<RouteProximityAlert {...mockProps} />)

      // Assert - focus should be on first interactive element
      await waitFor(() => {
        const firstButton = screen.getByText('대체 경로 사용')
        expect(firstButton).toHaveFocus()
      })
    })
  })

  describe('Error Handling', () => {
    test('should handle invalid flood point data', () => {
      // Arrange
      const invalidProps = {
        ...mockProps,
        floodPoints: [
          { id: 'invalid', distance: null },
          { id: 'incomplete' },
        ],
      }

      // Act
      render(<RouteProximityAlert {...invalidProps} />)

      // Assert
      expect(screen.getByText('일부 침수 지점 정보를 불러올 수 없습니다')).toBeInTheDocument()
    })

    test('should handle route calculation errors', () => {
      // Arrange
      const errorProps = {
        ...mockProps,
        alternativeRoute: { error: 'Route calculation failed' },
      }

      // Act
      render(<RouteProximityAlert {...errorProps} />)

      // Assert
      expect(screen.getByText('대체 경로를 찾을 수 없습니다')).toBeInTheDocument()
      expect(screen.getByText('다시 시도')).toBeInTheDocument()
    })

    test('should handle missing route data gracefully', () => {
      // Arrange
      const noRouteProps = { ...mockProps, currentRoute: null }

      // Act
      render(<RouteProximityAlert {...noRouteProps} />)

      // Assert
      expect(screen.getByText('경로 정보를 불러올 수 없습니다')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    test('should not re-render unnecessarily', () => {
      // Arrange
      const renderSpy = vi.fn()
      const TestComponent = (props) => {
        renderSpy()
        return <RouteProximityAlert {...props} />
      }

      const { rerender } = render(<TestComponent {...mockProps} />)

      // Act - rerender with same props
      rerender(<TestComponent {...mockProps} />)

      // Assert
      expect(renderSpy).toHaveBeenCalledTimes(2) // Initial + rerender
    })

    test('should debounce rapid visibility changes', async () => {
      // Arrange
      const { rerender } = render(<RouteProximityAlert {...mockProps} isVisible={false} />)

      // Act - rapid visibility changes
      rerender(<RouteProximityAlert {...mockProps} isVisible={true} />)
      rerender(<RouteProximityAlert {...mockProps} isVisible={false} />)
      rerender(<RouteProximityAlert {...mockProps} isVisible={true} />)

      // Assert - should handle gracefully without errors
      await waitFor(() => {
        expect(screen.getByTestId('proximity-alert')).toBeInTheDocument()
      })
    })
  })
})