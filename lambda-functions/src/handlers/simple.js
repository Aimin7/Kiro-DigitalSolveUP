// 간단한 핸들러 - 최소 의존성
exports.health = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
    body: JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      message: 'Flood Info API is running'
    })
  };
};

exports.getFloodData = async (event) => {
  // 목업 데이터 반환
  const mockData = [
    {
      id: '1',
      locationId: 'seoul-gangnam',
      latitude: 37.5665,
      longitude: 126.9780,
      status: 'normal',
      waterLevel: 1.2,
      timestamp: new Date().toISOString()
    },
    {
      id: '2', 
      locationId: 'seoul-hongdae',
      latitude: 37.5563,
      longitude: 126.9236,
      status: 'warning',
      waterLevel: 2.1,
      timestamp: new Date().toISOString()
    }
  ];

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
    body: JSON.stringify({
      success: true,
      data: mockData,
      count: mockData.length
    })
  };
};