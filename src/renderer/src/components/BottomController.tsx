import useSongStore from '@renderer/store/songStore'
import React, { useEffect, useState } from 'react'
import { HiPause, HiPlay } from 'react-icons/hi2'
import { RxTrackNext, RxTrackPrevious } from 'react-icons/rx'

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioManager.getIsPlaying()) {
        setTimeInfo({
          time_passed: Math.ceil(audioManager.getCurrentPlayingTime()),
          total_time: Math.ceil(audioManager.getSongDuration())
        })
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="w-full flex bg-white/40 fixed bottom-0 left-0 right-0 z-50">
      <div className="flex w-[400px] flex-shrink-0 bg-gray-100/30">
        <img src={current_song?.pic_url} width={100} alt="" />
        <div className="p-2">
          <div className="text-xl">{current_song?.tags.title}</div>
          <div className="text-sm">{current_song?.tags.artist}</div>
        </div>
      </div>
      <div className="flex-grow flex  p-4 gap-3">
        <div className="w-10/12 space-y-2">
          <div className="flex justify-between text-white">
            <div>{convertSecondsToTime(time_info.time_passed)}</div>
            <div>{convertSecondsToTime(time_info.total_time - time_info.time_passed)}</div>
          </div>
          <input
            type="range"
            className="w-full"
            min={0}
            max={time_info.total_time}
            //value={time_info.time_passed}
            onChange={(e) => {
              audioManager.seek(parseInt(e.target.value))
            }}
          />
        </div>
        <div className="flex items-center justify-center flex-grow gap-2">
          <div className="bg-black/20 text-white p-2 rounded-full ">
            <RxTrackPrevious size={32} />
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
            className="bg-black/20 text-white p-2 rounded-full "
          >
            {isPlaying ? <HiPause size={32} /> : <HiPlay size={32} />}
          </div>
          <div className="bg-black/20 text-white p-2 rounded-full ">
            <RxTrackNext size={32} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BottomController
