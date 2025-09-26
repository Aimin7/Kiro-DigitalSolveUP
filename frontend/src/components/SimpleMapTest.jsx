import { useEffect, useRef, useState } from 'react'

const SimpleMapTest = () => {
  const mapRef = useRef(null)
  const [status, setStatus] = useState('초기화 중...')
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadMap = async () => {
      try {
        setStatus('환경 변수 확인 중...')
        
        // 환경 변수 확인
        const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID
        console.log('Client ID:', clientId)
        console.log('All env vars:', import.meta.env)
        
        if (!clientId) {
          throw new Error('VITE_NAVER_MAP_CLIENT_ID가 설정되지 않았습니다.')
        }

        setStatus('네이버 지도 API 스크립트 로드 중...')
        
        // 기존 스크립트 제거
        const existingScript = document.querySelector('script[src*="oapi.map.naver.com"]')
        if (existingScript) {
          existingScript.remove()
        }

        // 새 스크립트 로드
        const script = document.createElement('script')
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`
        script.async = true

        const loadPromise = new Promise((resolve, reject) => {
          script.onload = () => {
            console.log('스크립트 로드 완료')
            setStatus('네이버 지도 API 객체 확인 중...')
            
            // API 객체 확인
            const checkAPI = () => {
              if (window.naver && window.naver.maps) {
                console.log('네이버 지도 API 사용 가능')
                resolve()
              } else {
                console.log('API 객체 대기 중...')
                setTimeout(checkAPI, 100)
              }
            }
            checkAPI()
          }

          script.onerror = (err) => {
            console.error('스크립트 로드 실패:', err)
            reject(new Error('네이버 지도 API 스크립트 로드 실패'))
          }
        })

        document.head.appendChild(script)
        await loadPromise

        setStatus('지도 생성 중...')
        
        // 지도 생성
        if (!mapRef.current) {
          throw new Error('지도 컨테이너가 준비되지 않았습니다.')
        }

        const map = new window.naver.maps.Map(mapRef.current, {
          center: new window.naver.maps.LatLng(37.5665, 126.9780),
          zoom: 12
        })

        console.log('지도 생성 완료:', map)
        setStatus('지도 로드 완료!')

      } catch (err) {
        console.error('지도 로드 오류:', err)
        setError(err.message)
        setStatus('오류 발생')
      }
    }

    loadMap()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h2>네이버 지도 테스트</h2>
      <div style={{ marginBottom: '10px' }}>
        <strong>상태:</strong> {status}
      </div>
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          <strong>오류:</strong> {error}
        </div>
      )}
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '400px', 
          border: '1px solid #ccc',
          backgroundColor: '#f0f0f0'
        }}
      />
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <div>Client ID: {import.meta.env.VITE_NAVER_MAP_CLIENT_ID}</div>
        <div>Mode: {import.meta.env.MODE}</div>
      </div>
    </div>
  )
}

export default SimpleMapTest