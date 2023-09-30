import AlbumArt from '@renderer/components/AlbumArt'
import useSongStore from '@renderer/store/songStore'
import { HiMusicalNote } from 'react-icons/hi2'

function Dasdhboard(): JSX.Element {
  const { songs, setSongs } = useSongStore()

  const hanldePickAudioFolder = () => {
    window.electron.ipcRenderer.invoke('open_folder_picker').then((result) => {
      console.log(result)

      setSongs(result)
    })
  }

  return (
    <div className="w-full h-screen backdrop-blur-lg bg-black/40 backdrop-filter flex flex-col">
      <div className="flex items-centerw text-white bg-white/20 p-3">
        <HiMusicalNote size={36} />
        <div className="text-2xl">All Music</div>
      </div>
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
          {songs.map((song) => (
            <AlbumArt key={song.path} {...song} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Dasdhboard
