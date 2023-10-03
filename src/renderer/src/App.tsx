import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainContainer from './components/MainContainter'
import MusicPlayer from './components/MusicPlayer'
import Current from './pages/current'
import Dasdhboard from './pages/dashboard'
import useSongStore from './store/songStore'
import { getDominantColorFromBase64URL } from './utils/common'

function App(): JSX.Element {
  const { setDominantColor, current_song } = useSongStore()

  useEffect(() => {
    ;(async () => {
      const color = await getDominantColorFromBase64URL(current_song?.pic_url || '')
      setDominantColor(color)
    })()
  }, [current_song])

  return (
    <MusicPlayer>
      <HashRouter>
        <Routes>
          <Route element={<MainContainer />}>
            <Route path="/" element={<Navigate to={'/all'} />} />
            <Route path="/all" element={<Dasdhboard />} />
            <Route path="/current" element={<Current />} />
          </Route>
        </Routes>
      </HashRouter>
    </MusicPlayer>
  )
}

export default App
