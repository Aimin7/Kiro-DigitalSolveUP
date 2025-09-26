import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})

// Mock environment variables
global.process = {
  env: {
    NODE_ENV: 'test',
    VITE_API_BASE_URL: 'http://localhost:3001',
    VITE_NAVER_CLIENT_ID: 'test-client-id',
  }
}

// Mock window.naver for Naver Maps API
global.window = global.window || {}
global.window.naver = {
  maps: {
    Map: class MockMap {
      constructor() {
        this.markers = []
      }
      
      setCenter() {}
      setZoom() {}
      addListener() {}
    },
    
    Marker: class MockMarker {
      constructor() {
        this.map = null
        this.position = null
      }
      
      setMap() {}
      setPosition() {}
      addListener() {}
    },
    
    InfoWindow: class MockInfoWindow {
      constructor() {
        this.content = ''
        this.map = null
      }
      
      open() {}
      close() {}
      setContent() {}
    },
    
    LatLng: class MockLatLng {
      constructor(lat, lng) {
        this.lat = lat
        this.lng = lng
      }
    },
    
    Point: class MockPoint {
      constructor(x, y) {
        this.x = x
        this.y = y
      }
    },
    
    Size: class MockSize {
      constructor(width, height) {
        this.width = width
        this.height = height
      }
    },
    
    Event: {
      addListener: () => {},
      removeListener: () => {},
    },
  },
}

// Mock geolocation
global.navigator = {
  geolocation: {
    getCurrentPosition: (success) => {
      success({
        coords: {
          latitude: 37.5665,
          longitude: 126.9780,
        },
      })
    },
    watchPosition: () => {},
    clearWatch: () => {},
  },
}