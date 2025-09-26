import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MapContainer from './components/MapContainer'
import MockMapContainer from './components/MockMapContainer'
import SimpleMapTest from './components/SimpleMapTest'
import SimpleMapDebug from './components/SimpleMapDebug'
import SimpleMapContainer from './components/SimpleMapContainer'
import './App.css'

function App() {
  // 환경 변수 확인 (개발용)
  console.log('🔧 Environment Variables:')
  console.log('NAVER_MAP_CLIENT_ID:', import.meta.env.VITE_NAVER_MAP_CLIENT_ID)
  console.log('API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
  console.log('NODE_ENV:', import.meta.env.MODE)
  console.log('All env vars:', import.meta.env)
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <header className="App-header">
          <h1>침수 정보 표시 앱</h1>
        </header>
        
        <main className="App-main">
          <Routes>
            <Route path="/" element={<MapContainer />} />
            <Route path="/simple" element={<SimpleMapContainer />} />
            <Route path="/mock" element={<MockMapContainer />} />
            <Route path="/test" element={<SimpleMapTest />} />
            <Route path="/debug" element={<SimpleMapDebug />} />
          </Routes>
          
          {/* 임시 디버깅용 - 환경변수가 없으면 테스트 컴포넌트 표시 */}
          {!import.meta.env.VITE_NAVER_MAP_CLIENT_ID && (
            <div style={{ padding: '20px', backgroundColor: '#ffebee', margin: '20px', borderRadius: '8px' }}>
              <h3>⚠️ 환경변수 누락</h3>
              <p>VITE_NAVER_MAP_CLIENT_ID가 설정되지 않았습니다.</p>
              <p>현재 환경변수: {JSON.stringify(import.meta.env, null, 2)}</p>
            </div>
          )}
        </main>
        
        <footer className="App-footer">
          <p>&copy; 2024 침수 정보 표시 앱. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App