import AlbumArt from '@renderer/components/AlbumArt'
import SongFrequency from '@renderer/components/SongFrequency'
import useSongStore from '@renderer/store/songStore'
import { useCallback } from 'react'

const Current: React.FC = () => {
  const { current_song, songs } = useSongStore()

  const getSimilarSongs = useCallback(() => {
    try {
      return songs.filter((song) => {
        if (song.path === current_song?.path) {
          return false
        }
        if (song.tags.artist === current_song?.tags.artist) {
          return true
        }
        if (song.tags.genre === current_song?.tags.genre) {
          return true
        }
        if (song.tags.year === current_song?.tags.year) {
          return true
        }
        return false
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  }, [current_song, songs])

  return (
    <div className="w-full h-screen backdrop-blur-lg bg-[#36454F]/80 flex flex-col">
      <div className="bg-white/30 relative">
        <div className="flex gap-4">
          <div className="relative w-[350px] h-[350px] flex-shrink-0">
            <img
              className="absolute blur-md top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              height={330}
              width={330}
              src={current_song?.pic_url}
            />
            <img
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              height={300}
              width={300}
              src={current_song?.pic_url}
            />
          </div>
          <div className="p-4">
            <div className="text-3xl">{current_song?.tags.title}</div>
            <div>{current_song?.tags.artist}</div>
            <div>{current_song?.tags.genre}</div>
            <div>{current_song?.tags.year}</div>
            <SongFrequency />
          </div>
        </div>
      </div>
      <div className="p-3 flex-grow overflow-auto">
        <div className="text-2xl text-white">Similar songs</div>
        <div className="flex flex-wrap gap-3">
          {getSimilarSongs().map((song) => (
            <AlbumArt
              binary={song.binary}
              path={song.path}
              pic_url={song.pic_url}
              tags={song.tags}
              key={song.path}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Current
