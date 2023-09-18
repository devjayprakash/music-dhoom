import useSongStore from '@renderer/store/songStore'
import React from 'react'
import { HiPlay } from 'react-icons/hi2'
import { RxTrackNext, RxTrackPrevious } from 'react-icons/rx'

const BottomController: React.FC = () => {
  const { current_song } = useSongStore()

  return (
    <div className="w-full flex bg-white/40 fixed bottom-0 left-0 right-0 z-50">
      <div className="flex w-[400px] flex-shrink-0 bg-gray-100/30">
        <img src={current_song?.pic_url} width={100} alt="" />
        <div className="p-2">
          <div className="text-xl">{current_song?.title}</div>
          <div className="text-sm">{current_song?.artists}</div>
        </div>
      </div>
      <div className="flex-grow flex  p-4 gap-3">
        <div className="w-10/12 space-y-2">
          <div className="flex justify-between text-white">
            <div>00:23</div>
            <div>01:30</div>
          </div>
          <div className="bg-black rounded-md overflow-hidden">
            <div className="bg-rose-600 h-2 w-[56%]"></div>
          </div>
        </div>
        <div className="flex items-center justify-center flex-grow gap-2">
          <div className="bg-black/20 text-white p-2 rounded-full ">
            <RxTrackPrevious size={32} />
          </div>
          <div className="bg-black/20 text-white p-2 rounded-full ">
            <HiPlay size={32} />
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
