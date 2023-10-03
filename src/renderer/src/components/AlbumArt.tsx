import useSongStore, { ISong } from '@renderer/store/songStore'
import React from 'react'
import { HiPlayCircle } from 'react-icons/hi2'

const AlbumArt: React.FC<ISong> = (song) => {
  const { setCurrentSong, current_song } = useSongStore()

  const isCurrentSong = song.path === current_song?.path

  const playAlbum = () => {
    window.electron.ipcRenderer.invoke('save_last_song_played', song.path)
    setCurrentSong(song)
  }

  return (
    <div className="w-[150px] relative bg-white/30 rounded-md overflow-hidden hover:scale-105 cursor-pointer transform duration-150">
      {isCurrentSong && (
        <img
          src="/playing.gif"
          alt="playing"
          width={30}
          height={30}
          className="rounded-md absolute top-2 left-2 z-50 opacity-80"
        />
      )}
      <div className="relative group">
        <img width={150} src={song.pic_url} alt="album art" />
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
        <div className="text-md truncate text-white">{song.tags.title}</div>
        <div className="text-xs truncate text-gray-300">{song.tags.artist}</div>
      </div>
    </div>
  )
}

export default AlbumArt
