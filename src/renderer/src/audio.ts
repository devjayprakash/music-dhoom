const MAX_VOLUME = 100
class AudioManager extends EventTarget {
  private context: AudioContext
  private source?: AudioBufferSourceNode
  private volume: number = 100
  private gainNode?: GainNode
  private analyser?: AnalyserNode
  private isPlaying: boolean = false
  private songDuration?: number
  private songStartingTime?: number
  private offsetTime = 0
  private pausePlaybackTime = 0
  private playbackTime = 0
  private savedGainValue?: number
  private buffer?: AudioBuffer

  constructor() {
    super()

    const volume = 40
    const fraction = Number(volume) / 100

    this.volume = fraction * fraction
    this.context = new AudioContext()
    this.isPlaying = false
    this.offsetTime = 0
  }

  play(path: string) {
    return new Promise((resolve) => {
      window.electron.ipcRenderer.invoke('get-audio-file', path).then((buffer: Buffer) => {
        this.context.decodeAudioData(this.toArrayBuffer(buffer), (audioBuffer) => {
          this.playFromBuffer(audioBuffer)
          resolve(true)
        })
      })
    })
  }

  playFromBuffer(buffer: AudioBuffer) {
    this.stop()
    this.buffer = buffer
    this.initSource()
    this.offsetTime = 0
    this.songDuration = this.buffer.duration
    this.songStartingTime = this.context.currentTime
    this.playbackTime = 0
    this.startPlaying()
  }

  stop() {
    if (this.source) {
      this.source.stop()
      this.gainNode = undefined
    }
  }

  pause() {
    this.isPlaying = false
    this.pausePlaybackTime = this.playbackTime
    this.context.suspend()
  }

  startPlaying() {
    this.isPlaying = true
    this.source?.start(0, this.playbackTime)
  }

  seek(playbackTime: number) {
    if (this.isPlaying) {
      this.stop()
      this.initSource()
      this.songStartingTime = this.context.currentTime - this.playbackTime
      this.playbackTime = playbackTime
      this.startPlaying()
    } else {
      this.songStartingTime = this.context.currentTime - this.playbackTime
      this.playbackTime = playbackTime
    }
  }

  resume() {
    this.isPlaying = true
    this.context.resume()
    if (this.pausePlaybackTime !== this.playbackTime) {
      this.seek(this.playbackTime)
    }
  }

  toArrayBuffer(buffer: Buffer) {
    const arrayBuffer = new ArrayBuffer(buffer.length)
    const uInt8Array = new Uint8Array(arrayBuffer)
    for (let i = 0; i < buffer.length; ++i) {
      uInt8Array[i] = buffer[i]
    }
    return arrayBuffer
  }

  initSource() {
    this.source = this.context.createBufferSource()
    this.gainNode = this.context.createGain()
    this.analyser = this.context.createAnalyser()
    this.buffer && (this.source.buffer = this.buffer)
    this.source.connect(this.gainNode)
    this.gainNode.connect(this.analyser)
    this.analyser.connect(this.context.destination)
    this.gainNode.gain.value = this.volume
    this.source.onended = this.onSongFinished
  }

  getCurrentPlayingTime() {
    if (this.songStartingTime !== undefined) {
      return this.context.currentTime - this.songStartingTime
    } else {
      console.error('no song start time found')
      return -1
    }
  }

  onEnded() {
    this.isPlaying = false
    this.songDuration = undefined
    this.songStartingTime = undefined
    this.dispatchEvent(new Event('song_ended'))
  }

  onSongFinished() {
    this.isPlaying = false
    this.songDuration = undefined
    this.songStartingTime = undefined
    this.dispatchEvent(new Event('songFinised'))
  }

  mute() {
    if (this.gainNode) {
      this.savedGainValue = this.gainNode.gain.value
    }
  }

  unmute(volume: number) {
    if (this.gainNode && this.savedGainValue) {
      this.gainNode.gain.value = volume || this.savedGainValue
    }
  }

  getOffsetTime() {
    return this.offsetTime
  }

  getSongDuration() {
    return this.songDuration || 0
  }

  getIsPlaying() {
    return this.isPlaying
  }

  getFrequency(frequencyData?: Uint8Array) {
    if (!this.analyser) {
      return
    }
    if (!frequencyData) {
      frequencyData = new Uint8Array(this.analyser.frequencyBinCount)
    }
    this.analyser.getByteFrequencyData(frequencyData)
    return frequencyData
  }

  frequencyToIndex(frequency, sampleRate, frequencyBinCount) {
    const nyquist = sampleRate / 2
    const index = Math.round((frequency / nyquist) * frequencyBinCount)
    return this.clamp(index, 0, frequencyBinCount)
  }

  analyserAverage(frequencies, minHz, maxHz) {
    if (!this.analyser) return

    const div = 255
    const sampleRate = this.analyser.context.sampleRate
    const binCount = this.analyser.frequencyBinCount
    let start = this.frequencyToIndex(minHz, sampleRate, binCount)
    const end = this.frequencyToIndex(maxHz, sampleRate, binCount)
    const count = end - start
    let sum = 0
    for (; start < end; start++) {
      sum += frequencies[start] / div
    }
    return count === 0 ? 0 : sum / count
  }

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }
}

export default AudioManager
