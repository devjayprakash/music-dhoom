import { create } from 'zustand'

export interface ISong {
  title: string
  artists: string
  pic_url: string
  path: string
  binary_str: string
}

interface ISongStore {
  current_song: ISong | undefined
  setCurrentSong: (song: ISong) => void
}

const useSongStore = create<ISongStore>((set) => ({
  current_song: undefined,
  setCurrentSong: (song) =>
    set({
      current_song: song
    })
}))

export default useSongStore
