import useSongStore, { ISong } from '@renderer/store/songStore'
import React from 'react'
import { HiPlayCircle } from 'react-icons/hi2'

const AlbumArt: React.FC<ISong> = (song) => {
  const { setCurrentSong } = useSongStore()

  const { artists, pic_url, title } = song

  const playAlbum = () => {
    let audio = new Audio(
      `file:///Users/jayprakashpathak/Desktop/music/Squid-Game-Theme(PaglaSongs).mp3`
    )
    console.log(song.path)

    audio.play()
    setCurrentSong(song)
  }

  return (
    <div className="w-[150px] bg-white/30 rounded-md overflow-hidden hover:scale-105 cursor-pointer transform duration-150">
      <div className="relative group">
        <img width={150} src={pic_url} alt="album art" />
        <div
          onClick={() => {
            playAlbum()
          }}
          className="group-hover:opacity-100  opacity-0 duration-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <HiPlayCircle color="white" size={42} />
        </div>
      </div>
      <div className="p-2">
        <div className="text-md truncate text-white">{title}</div>
        <div className="text-xs truncate text-gray-300">{artists}</div>
      </div>
    </div>
  )
}

export default AlbumArt
