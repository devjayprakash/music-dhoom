import useSongStore from '@renderer/store/songStore'
import { useEffect, useState } from 'react'

const SongFrequency: React.FC = () => {
  const { audioManager, dominant_color } = useSongStore()
  const [freqdata, setFreqData] = useState<number[]>([])

  useEffect(() => {
    let iter = setInterval(() => {
      const freq = audioManager.getFrequency()
      if (freq) {
        setFreqData(Array.from(freq.slice(0, 160)))
      }
    }, 50)
    return () => {
      clearInterval(iter)
    }
  }, [])

  return (
    <div className="w-full">
      <div className="flex w-full h-[200px] items-end overflow-hidden mr-3">
        {freqdata.map((d, i) => (
          <div
            className={`w-[5px] rounded-full`}
            style={{
              height: d,
              backgroundColor: dominant_color,
              opacity: 0.8
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default SongFrequency
