import AlbumArt from '@renderer/components/AlbumArt'
import useSongStore, { ISong } from '@renderer/store/songStore'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function Dasdhboard(): JSX.Element {
  const [local_song, setLocalSong] = useState<ISong[]>([])
  const { songs, setSongs, setCurrentSong, searchQuery } = useSongStore()
  const location = useLocation()

  const hanldePickAudioFolder = () => {
    window.electron.ipcRenderer.invoke('open_folder_picker').then((result) => {
      setSongs(result)
    })
  }

  useEffect(() => {
    if (searchQuery) {
      setLocalSong(
        songs.filter((song) => {
          if (song.tags.title) {
            const title = song.tags.title.toLowerCase()
            return title.includes(searchQuery.toLowerCase())
          } else {
            return false
          }
        })
      )
    } else {
      setLocalSong(songs)
    }
  }, [searchQuery])

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get_last_song_played').then((result) => {
      if (result) {
        setCurrentSong(result)
      }
    })

    window.electron.ipcRenderer.invoke('get_data_frm_last_dir').then((result) => {
      setSongs(result)
      setLocalSong(result)
    })
  }, [])

  return (
    <>
      <div className="flex items-center gap-3 text-white bg-black/40  top-0 z-40 filter backdrop-blur-lg w-full h-fit fixed ml-[300px] p-4">
        <img src="/headphones.png" alt="album art" width={46} />
        <div className="text-2xl">Albums</div>
      </div>
      <div
        className={`w-full h-screen backdrop-blur-lg bg-black/40 backdrop-filter flex flex-col overflow-auto py-20`}
      >
        {songs.length === 0 ? (
          <div className="flex-grow flex justify-center items-center flex-col">
            <img width={100} src="/empty.png" alt="empty" />
            <div className="text-2xl text-white">No auto file was added</div>
            <button onClick={hanldePickAudioFolder} className="px-3 py-1 bg-white rounded-md my-3">
              Pick audio folder
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 p-4">
            {local_song.map((song) => (
              <AlbumArt key={song.path} {...song} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Dasdhboard
