import { useEffect, useRef, useState } from 'react'

const SimpleMapContainer = () => {
  const mapRef = useRef(null)
  const [status, setStatus] = useState('초기화 중...')
  const [logs, setLogs] = useState([])

  const addLog = (message) => {
    console.log(message)
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    const initMap = async () => {
      try {
        addLog('🔍 환경변수 확인')
        const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID
        addLog(`클라이언트 ID: ${clientId ? clientId.substring(0, 5) + '...' : '없음'}`)
        
        if (!clientId) {
          throw new Error('VITE_NAVER_MAP_CLIENT_ID가 설정되지 않았습니다')
        }

        addLog('📍 DOM 요소 확인')
        if (!mapRef.current) {
          throw new Error('지도 컨테이너 DOM 요소를 찾을 수 없습니다')
        }
        addLog('✅ DOM 요소 확인 완료')

        addLog('📡 네이버 지도 API 로드 중...')
        setStatus('네이버 지도 API 로드 중...')

        // 기존 스크립트 제거
        const existingScript = document.querySelector('script[src*="oapi.map.naver.com"]')
        if (existingScript) {
          existingScript.remove()
          addLog('기존 스크립트 제거됨')
        }

        // 새 스크립트 로드
        const script = document.createElement('script')
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`
        script.async = true

        const loadPromise = new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            addLog('⏰ 스크립트 로드 타임아웃')
            reject(new Error('타임아웃'))
          }, 15000)

          script.onload = () => {
            clearTimeout(timeout)
            addLog('✅ 스크립트 로드 완료')
            
            // API 객체 확인
            const checkAPI = () => {
              if (window.naver && window.naver.maps) {
                addLog('✅ 네이버 지도 API 객체 확인됨')
                resolve()
              } else {
                addLog('⏳ API 객체 대기 중...')
                setTimeout(checkAPI, 100)
              }
            }
            checkAPI()
          }

          script.onerror = (error) => {
            clearTimeout(timeout)
            addLog(`❌ 스크립트 로드 실패: ${error}`)
            reject(error)
          }
        })

        document.head.appendChild(script)
        await loadPromise

        addLog('🗺️ 지도 생성 중...')
        setStatus('지도 생성 중...')

        const map = new window.naver.maps.Map(mapRef.current, {
          center: new window.naver.maps.LatLng(37.5665, 126.9780),
          zoom: 12
        })

        addLog('✅ 지도 생성 완료!')
        setStatus('지도 로드 완료')

      } catch (error) {
        addLog(`❌ 오류 발생: ${error.message}`)
        setStatus(`오류: ${error.message}`)
      }
    }

    // DOM이 준비된 후 초기화
    const timer = setTimeout(initMap, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h2>간단한 지도 테스트</h2>
      <p><strong>상태:</strong> {status}</p>
      
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '400px', 
          border: '2px solid #007bff',
          marginBottom: '20px',
          backgroundColor: '#f8f9fa'
        }}
      />
      
      <div style={{ 
        flex: 1,
        maxHeight: '300px', 
        overflow: 'auto', 
        backgroundColor: '#f5f5f5', 
        padding: '10px',
        border: '1px solid #ddd'
      }}>
        <h3>로그:</h3>
        {logs.map((log, index) => (
          <div key={index} style={{ fontSize: '12px', marginBottom: '2px', fontFamily: 'monospace' }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SimpleMapContainer