import useSongStore from '@renderer/store/songStore'
import { useEffect, useState } from 'react'

const SongFrequency: React.FC = () => {
  const { audioManager, current_song } = useSongStore()
  const [freqdata, setFreqData] = useState<number[]>([])
  const [dominantColor, setDominantColor] = useState<string>('rgb(0,0,0)')

  const getDominantColorFromBase64URL = (url: string) => {
    return new Promise<string>((resolve, reject) => {
      const img = new Image()
      img.src = url
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          const imageData = ctx.getImageData(0, 0, img.width, img.height)
          const data = imageData.data
          const rgb = [0, 0, 0]
          let count = 0
          for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 125) {
              rgb[0] += data[i]
              rgb[1] += data[i + 1]
              rgb[2] += data[i + 2]
              ++count
            }
          }
          rgb[0] = Math.floor(rgb[0] / count)
          rgb[1] = Math.floor(rgb[1] / count)
          rgb[2] = Math.floor(rgb[2] / count)
          resolve(`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`)
        } else {
          reject('Error')
        }
      }
    })
  }

  useEffect(() => {
    ;(async () => {
      const color = await getDominantColorFromBase64URL(current_song?.pic_url || '')
      setDominantColor(color)
    })()

    let iter = setInterval(() => {
      const freq = audioManager.getFrequency()
      if (freq) {
        setFreqData(Array.from(freq.slice(0, 365)))
      }
    }, 50)
    return () => {
      clearInterval(iter)
    }
  }, [])

  return (
    <div className="absolute bottom-0 right-0 w-full">
      <div className="flex w-full h-[200px] items-end overflow-hidden">
        {freqdata.map((d) => (
          <div
            className={`w-[5px] rounded-full`}
            style={{
              height: d,
              backgroundColor: dominantColor,
              opacity: 0.5
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default SongFrequency
