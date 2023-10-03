import useSongStore from '@renderer/store/songStore'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const convertSecondsToTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const left_seconds = seconds % 60

  return `${minutes}:${left_seconds}`
}

const BottomController: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [time_info, setTimeInfo] = React.useState<{ time_passed: number; total_time: number }>({
    time_passed: 0,
    total_time: 0
  })

  const { audioManager, current_song } = useSongStore()
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioManager.getIsPlaying()) {
        setTimeInfo({
          time_passed: Math.ceil(audioManager.getCurrentPlayingTime()),
          total_time: Math.ceil(audioManager.getSongDuration())
        })
      }
    }, 1000)

    audioManager.addEventListener('songFinised', () => {
      setIsPlaying(false)
    })
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="w-full flex bg-white/40 fixed bottom-0 left-0 right-0 z-50 filter backdrop-blur-md">
      <div
        className="flex w-[320px] flex-shrink-0 hover:bg-gray-600/40 bg-white/10 cursor-pointer"
        onClick={() => {
          navigate('/current')
        }}
      >
        <img
          src={current_song ? current_song?.pic_url : '/album.png'}
          width={80}
          height={80}
          alt=""
        />
        <div className="p-3 w-full">
          <div className="text-sm font-bold truncate">
            {current_song?.tags.title || 'Play a song'}
          </div>
          <div className="text-xs">{current_song?.tags.artist || 'No song artist'}</div>
          <div className="text-xs">{current_song?.tags.genre || 'No song genre'}</div>
        </div>
      </div>
      <div className="flex-grow flex gap-3 px-3 py-2">
        <div className="w-10/12 space-y-2">
          <div className="flex justify-between text-black">
            <div>{convertSecondsToTime(time_info.time_passed)}</div>
            <div>{convertSecondsToTime(time_info.total_time - time_info.time_passed)}</div>
          </div>
          <input
            type="range"
            className="w-full slider"
            min={0}
            max={time_info.total_time}
            value={time_info.time_passed}
            onChange={(e) => {
              audioManager.seek(parseInt(e.target.value))
            }}
          />
        </div>
        <div className="flex items-center justify-center flex-grow gap-2">
          <div className="bg-white/20 text-black p-3 rounded-full ">
            <img src="/back.png" alt="back" width={20} height={20} />
          </div>
          <div
            onClick={() => {
              if (audioManager.getIsPlaying()) {
                audioManager.pause()
                setIsPlaying(false)
              } else {
                audioManager.resume()
                setIsPlaying(true)
              }
            }}
            className="text-black bg-white/20 p-3 rounded-full "
          >
            <img
              src={isPlaying ? '/pause.png' : '/play.png'}
              width={20}
              height={20}
              alt={'pause'}
            />
          </div>
          <div className="bg-white/20 p-3 rounded-full text-black">
            <img src="/next.png" alt="next" width={20} height={20} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BottomController
