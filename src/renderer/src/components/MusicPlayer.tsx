import useSongStore from '@renderer/store/songStore'
import React, { useEffect } from 'react'

const MusicPlayer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { current_song, audioManager } = useSongStore()

  useEffect(() => {
    ;(async () => {
      if (current_song?.path) {
        await audioManager.play(current_song.path)
      }
    })()
  }, [current_song])

  return <>{children}</>
}

export default MusicPlayer
