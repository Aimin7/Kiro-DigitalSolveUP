const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// CORS 설정
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Flood Info API Server is running!' });
});

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Server is healthy'
  });
});

// 홍수 데이터 API (목업)
app.get('/api/flood-data', (req, res) => {
  const { north, south, east, west } = req.query;
  
  console.log('홍수 데이터 요청:', { north, south, east, west });
  
  // 목업 데이터
  const mockData = [
    {
      id: 'flood-001',
      latitude: 37.5665,
      longitude: 126.9780,
      alertType: '특보',
      severity: 'medium',
      timestamp: new Date().toISOString(),
      sources: ['한강홍수통제소'],
      availableAPIs: ['HanRiver API']
    },
    {
      id: 'flood-002',
      latitude: 37.5505,
      longitude: 126.9882,
      alertType: '경보',
      severity: 'high',
      timestamp: new Date().toISOString(),
      sources: ['기상청'],
      availableAPIs: ['Weather API']
    }
  ];
  
  res.json({
    success: true,
    data: mockData,
    count: mockData.length,
    bounds: { north, south, east, west }
  });
});

// 위치 기반 홍수 데이터
app.get('/api/flood-data/location', (req, res) => {
  const { lat, lng, radius, north, south, east, west } = req.query;
  
  console.log('위치 기반 홍수 데이터 요청:', { lat, lng, radius, north, south, east, west });
  
  // bounds 기반 요청인 경우
  if (north && south && east && west) {
    const mockData = [
      {
        id: 'flood-bounds-001',
        latitude: 37.5665,
        longitude: 126.9780,
        alertType: '특보',
        severity: 'medium',
        timestamp: new Date().toISOString(),
        sources: ['한강홍수통제소'],
        availableAPIs: ['HanRiver API']
      }
    ];
    
    res.json({
      success: true,
      data: mockData,
      count: mockData.length,
      bounds: { north, south, east, west }
    });
  } else {
    // 위치 기반 요청
    res.json({
      success: true,
      data: [],
      location: { lat, lng, radius }
    });
  }
});

// 한강 데이터
app.get('/api/flood-data/hanriver', (req, res) => {
  console.log('한강 데이터 요청');
  
  res.json({
    success: true,
    data: {
      waterLevel: 3.2,
      status: 'normal',
      timestamp: new Date().toISOString()
    }
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 API 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log(`📊 API 엔드포인트:`);
  console.log(`   - GET /api/health`);
  console.log(`   - GET /api/flood-data`);
  console.log(`   - GET /api/flood-data/location`);
  console.log(`   - GET /api/flood-data/hanriver`);
});

module.exports = app;