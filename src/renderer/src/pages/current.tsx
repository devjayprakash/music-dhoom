import SongFrequency from '@renderer/components/SongFrequency'
import useSongStore from '@renderer/store/songStore'

const Current: React.FC = () => {
  const { current_song } = useSongStore()

  return (
    <div className="w-full h-screen backdrop-blur-lg bg-black/40 backdrop-filter">
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
          </div>
        </div>
        <SongFrequency />
      </div>
    </div>
  )
}

export default Current
