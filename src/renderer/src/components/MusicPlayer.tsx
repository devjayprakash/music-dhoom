import useSongStore from '@renderer/store/songStore'
import React, { useEffect, useState } from 'react'

const MusicPlayer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioContext, setAudioContext] = useState(() => new AudioContext())
  const { current_song } = useSongStore()

  useEffect(() => {
    const audio = new Audio(current_song?.path)
    audio.play()
  }, [current_song])

  return <>{children}</>
}

export default MusicPlayer
