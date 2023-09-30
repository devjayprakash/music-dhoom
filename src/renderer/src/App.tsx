import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainContainer from './components/MainContainter'
import MusicPlayer from './components/MusicPlayer'
import Current from './pages/current'
import Dasdhboard from './pages/dashboard'

function App(): JSX.Element {
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
