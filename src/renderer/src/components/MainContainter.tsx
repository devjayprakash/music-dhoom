import useSongStore from '@renderer/store/songStore'
import React from 'react'
import { Outlet } from 'react-router-dom'
import BottomController from './BottomController'
import Sidebar from './Sidebar'

const MainContainer: React.FC = () => {
  const { current_song } = useSongStore()

  return (
    <div
      className="flex w-full h-full overflow-auto bg-cover bg-center"
      style={{
        backgroundImage: `url('${current_song?.pic_url}')`
      }}
    >
      <Sidebar />
      <Outlet />
      <BottomController />
    </div>
  )
}

export default MainContainer
