import AudioManager from '@renderer/audio'
import { ShortcutTags } from 'jsmediatags/types'
import { create } from 'zustand'

export interface ISong {
  pic_url: string
  path: string
  binary: ArrayBuffer
  tags: ShortcutTags
}

interface ISongStore {
  current_song: ISong | undefined
  setCurrentSong: (song: ISong) => void
  total_time: number
  time_passed: number
  setTotalTime: (time: number) => void
  setTimePassed: (time: number) => void
  isPlaying: boolean
  setIsPlaying: (isPlaying: boolean) => void
  audioManager: AudioManager
  songs: ISong[]
  setSongs: (songs: ISong[]) => void
}

const useSongStore = create<ISongStore>((set) => ({
  audioManager: new AudioManager(),
  current_song: undefined,
  setCurrentSong: (song) =>
    set({
      current_song: song
    }),
  total_time: 0,
  time_passed: 0,
  setTotalTime: (time) =>
    set({
      total_time: time
    }),
  setTimePassed: (time) =>
    set({
      time_passed: time
    }),
  isPlaying: false,
  setIsPlaying: (isPlaying) =>
    set({
      isPlaying: isPlaying
    }),
  songs: [],
  setSongs: (songs) =>
    set({
      songs: songs
    })
}))

export default useSongStore
