// naver-api.test.js
// Geocoding, Directions API 호출 로직 검증 단위 테스트

const NaverGeocodingService = require('../../src/services/NaverGeocodingService');
const NaverDirectionsService = require('../../src/services/NaverDirectionsService');

// Mock fetch
global.fetch = jest.fn();

describe('NaverGeocodingService', () => {
  let service;

  beforeEach(() => {
    service = new NaverGeocodingService();
    fetch.mockClear();
  });

  describe('geocodeAddress', () => {
    it('should geocode address successfully', async () => {
      const mockResponse = {
        status: 'OK',
        meta: { totalCount: 1, page: 1, count: 1 },
        addresses: [
          {
            roadAddress: '서울특별시 중구 세종대로 110',
            jibunAddress: '서울특별시 중구 태평로1가 31',
            englishAddress: '110, Sejong-daero, Jung-gu, Seoul, Republic of Korea',
            x: '126.9779692',
            y: '37.5662952',
            distance: 0,
          },
        ],
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.geocodeAddress('서울시청');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'X-NCP-APIGW-API-KEY-ID': expect.any(String),
            'X-NCP-APIGW-API-KEY': expect.any(String),
          }),
        })
      );

      expect(result.success).toBe(true);
      expect(result.data.addresses).toHaveLength(1);
      expect(result.data.addresses[0].coordinates).toEqual({
        latitude: 37.5662952,
        longitude: 126.9779692,
      });
    });

    it('should handle geocoding API errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      const result = await service.geocodeAddress('잘못된 주소');

      expect(result.success).toBe(false);
      expect(result.error).toContain('HTTP 400');
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await service.geocodeAddress('서울시청');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });

    it('should validate input address', async () => {
      const result = await service.geocodeAddress('');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Address is required');
    });

    it('should handle empty results', async () => {
      const mockResponse = {
        status: 'OK',
        meta: { totalCount: 0, page: 1, count: 0 },
        addresses: [],
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.geocodeAddress('존재하지않는주소');

      expect(result.success).toBe(true);
      expect(result.data.addresses).toHaveLength(0);
    });
  });

  describe('reverseGeocode', () => {
    it('should reverse geocode coordinates successfully', async () => {
      const mockResponse = {
        status: { code: 0, name: 'ok', message: 'done' },
        results: [
          {
            name: 'legalcode',
            code: { id: '1168064000', type: 'L', mappingId: '09140103' },
            region: {
              area0: { name: 'kr', coords: { center: { crs: '', x: 0, y: 0 } } },
              area1: { name: '서울특별시', coords: { center: { crs: '', x: 0, y: 0 } } },
              area2: { name: '중구', coords: { center: { crs: '', x: 0, y: 0 } } },
              area3: { name: '태평로1가', coords: { center: { crs: '', x: 0, y: 0 } } },
              area4: { name: '', coords: { center: { crs: '', x: 0, y: 0 } } },
            },
          },
        ],
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.reverseGeocode(37.5662952, 126.9779692);

      expect(result.success).toBe(true);
      expect(result.data.address).toContain('서울특별시 중구');
    });

    it('should validate coordinates', async () => {
      const result = await service.reverseGeocode(null, null);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Valid coordinates are required');
    });

    it('should handle coordinates outside Korea', async () => {
      const result = await service.reverseGeocode(40.7128, -74.0060); // New York

      expect(result.success).toBe(false);
      expect(result.error).toContain('outside Korean bounds');
    });
  });

  describe('batchGeocode', () => {
    it('should handle batch geocoding', async () => {
      const addresses = ['서울시청', '부산시청'];
      
      const mockResponse1 = {
        status: 'OK',
        addresses: [{ roadAddress: '서울특별시 중구 세종대로 110', x: '126.9779692', y: '37.5662952' }],
      };
      
      const mockResponse2 = {
        status: 'OK',
        addresses: [{ roadAddress: '부산광역시 연제구 중앙대로 1001', x: '129.0756416', y: '35.1795543' }],
      };

      fetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockResponse1 })
        .mockResolvedValueOnce({ ok: true, json: async () => mockResponse2 });

      const result = await service.batchGeocode(addresses);

      expect(result.success).toBe(true);
      expect(result.data.results).toHaveLength(2);
      expect(result.data.results[0].success).toBe(true);
      expect(result.data.results[1].success).toBe(true);
    });

    it('should handle partial failures in batch geocoding', async () => {
      const addresses = ['서울시청', '잘못된주소'];
      
      const mockResponse1 = {
        status: 'OK',
        addresses: [{ roadAddress: '서울특별시 중구 세종대로 110', x: '126.9779692', y: '37.5662952' }],
      };

      fetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockResponse1 })
        .mockResolvedValueOnce({ ok: false, status: 400 });

      const result = await service.batchGeocode(addresses);

      expect(result.success).toBe(true);
      expect(result.data.results).toHaveLength(2);
      expect(result.data.results[0].success).toBe(true);
      expect(result.data.results[1].success).toBe(false);
      expect(result.data.summary.successful).toBe(1);
      expect(result.data.summary.failed).toBe(1);
    });
  });
});

describe('NaverDirectionsService', () => {
  let service;

  beforeEach(() => {
    service = new NaverDirectionsService();
    fetch.mockClear();
  });

  describe('getDirections', () => {
    it('should get directions successfully', async () => {
      const mockResponse = {
        code: 0,
        message: 'ok',
        currentDateTime: '2023-07-15T10:00:00.000+0900',
        route: {
          trafast: [
            {
              summary: {
                start: { location: [126.9779692, 37.5662952] },
                goal: { location: [129.0756416, 35.1795543] },
                distance: 325000,
                duration: 14400000,
                bbox: [[126.9779692, 35.1795543], [129.0756416, 37.5662952]],
                tollFare: 5000,
                taxiFare: 325000,
                fuelPrice: 35000,
              },
              path: [
                [126.9779692, 37.5662952],
                [127.0000000, 37.5000000],
                [129.0756416, 35.1795543],
              ],
              section: [],
              guide: [],
            },
          ],
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const start = { latitude: 37.5662952, longitude: 126.9779692 };
      const goal = { latitude: 35.1795543, longitude: 129.0756416 };

      const result = await service.getDirections(start, goal);

      expect(result.success).toBe(true);
      expect(result.data.routes).toHaveLength(1);
      expect(result.data.routes[0].summary.distance).toBe(325000);
      expect(result.data.routes[0].summary.duration).toBe(14400000);
    });

    it('should validate start and goal coordinates', async () => {
      const result = await service.getDirections(null, null);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Start and goal coordinates are required');
    });

    it('should handle directions API errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      const start = { latitude: 37.5662952, longitude: 126.9779692 };
      const goal = { latitude: 35.1795543, longitude: 129.0756416 };

      const result = await service.getDirections(start, goal);

      expect(result.success).toBe(false);
      expect(result.error).toContain('HTTP 400');
    });
  });

  describe('getSafeRoute', () => {
    it('should get safe route avoiding flood areas', async () => {
      const mockDirectionsResponse = {
        code: 0,
        route: {
          trafast: [
            {
              summary: { distance: 10000, duration: 1200000 },
              path: [
                [126.9779692, 37.5662952],
                [127.0000000, 37.5000000],
                [127.0200000, 37.4800000],
              ],
            },
          ],
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDirectionsResponse,
      });

      const start = { latitude: 37.5662952, longitude: 126.9779692 };
      const goal = { latitude: 37.4800000, longitude: 127.0200000 };
      const floodAreas = [
        { latitude: 37.5500000, longitude: 127.0000000, radius: 1000 },
      ];

      const result = await service.getSafeRoute(start, goal, floodAreas);

      expect(result.success).toBe(true);
      expect(result.data.route).toBeDefined();
      expect(result.data.safetyAnalysis).toBeDefined();
    });

    it('should handle no safe route available', async () => {
      // Mock API to return route that passes through flood areas
      const mockDirectionsResponse = {
        code: 0,
        route: {
          trafast: [
            {
              summary: { distance: 5000, duration: 600000 },
              path: [
                [126.9779692, 37.5662952],
                [127.0000000, 37.5500000], // 홍수 지역 통과
                [127.0200000, 37.4800000],
              ],
            },
          ],
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDirectionsResponse,
      });

      const start = { latitude: 37.5662952, longitude: 126.9779692 };
      const goal = { latitude: 37.4800000, longitude: 127.0200000 };
      const floodAreas = [
        { latitude: 37.5500000, longitude: 127.0000000, radius: 500 },
      ];

      const result = await service.getSafeRoute(start, goal, floodAreas);

      expect(result.success).toBe(true);
      expect(result.data.safetyAnalysis.isSafe).toBe(false);
      expect(result.data.safetyAnalysis.riskPoints).toHaveLength(1);
    });
  });

  describe('getAlternativeRoutes', () => {
    it('should get multiple alternative routes', async () => {
      const mockResponse = {
        code: 0,
        route: {
          trafast: [{ summary: { distance: 10000 }, path: [] }],
          tracomfort: [{ summary: { distance: 12000 }, path: [] }],
          traoptimal: [{ summary: { distance: 11000 }, path: [] }],
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const start = { latitude: 37.5662952, longitude: 126.9779692 };
      const goal = { latitude: 37.4800000, longitude: 127.0200000 };

      const result = await service.getAlternativeRoutes(start, goal);

      expect(result.success).toBe(true);
      expect(result.data.routes).toHaveLength(3);
      expect(result.data.routes[0].option).toBe('trafast');
      expect(result.data.routes[1].option).toBe('tracomfort');
      expect(result.data.routes[2].option).toBe('traoptimal');
    });
  });

  describe('calculateRouteDistance', () => {
    it('should calculate route distance correctly', () => {
      const path = [
        [126.9779692, 37.5662952],
        [127.0000000, 37.5000000],
        [127.0200000, 37.4800000],
      ];

      const distance = service.calculateRouteDistance(path);

      expect(distance).toBeGreaterThan(0);
      expect(typeof distance).toBe('number');
    });

    it('should handle empty path', () => {
      const distance = service.calculateRouteDistance([]);
      expect(distance).toBe(0);
    });

    it('should handle single point path', () => {
      const path = [[126.9779692, 37.5662952]];
      const distance = service.calculateRouteDistance(path);
      expect(distance).toBe(0);
    });
  });

  describe('isRoutePassingThroughFloodArea', () => {
    it('should detect route passing through flood area', () => {
      const path = [
        [126.9779692, 37.5662952],
        [127.0000000, 37.5500000], // 홍수 지역 근처
        [127.0200000, 37.4800000],
      ];

      const floodAreas = [
        { latitude: 37.5500000, longitude: 127.0000000, radius: 500 },
      ];

      const result = service.isRoutePassingThroughFloodArea(path, floodAreas);

      expect(result.isPassingThrough).toBe(true);
      expect(result.riskPoints).toHaveLength(1);
    });

    it('should detect safe route not passing through flood areas', () => {
      const path = [
        [126.9779692, 37.5662952],
        [126.9800000, 37.5600000],
        [126.9900000, 37.5500000],
      ];

      const floodAreas = [
        { latitude: 37.4000000, longitude: 127.1000000, radius: 500 },
      ];

      const result = service.isRoutePassingThroughFloodArea(path, floodAreas);

      expect(result.isPassingThrough).toBe(false);
      expect(result.riskPoints).toHaveLength(0);
    });
  });
});