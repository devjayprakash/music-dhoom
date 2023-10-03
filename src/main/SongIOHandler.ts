import fs from 'fs'
import jsmedia from 'jsmediatags'
import KeyValue from './KeyValue'

interface AudioData {
  tags: any
  pic_url: string
  path: string
}

class SongIOHandler {
  dir?: string
  key_val: KeyValue

  constructor(dir?: string) {
    this.dir = dir
    this.key_val = new KeyValue()
  }

  setDir(dir: string) {
    this.dir = dir
  }

  getAudioDataFromFile(path: string): Promise<AudioData> {
    if (this.dir === undefined) {
      throw new Error('dir is undefined')
    }

    return new Promise((resolve, reject) => {
      jsmedia.read(path, {
        onSuccess: (tag) => {
          try {
            resolve({
              tags: tag.tags,
              pic_url: `data:${tag.tags.picture?.format};base64,${btoa(
                String.fromCharCode.apply(null, tag.tags.picture?.data || [])
              )}`,
              path: path
            })
          } catch (error) {
            reject(error)
          }
        },
        onError: (err) => {
          reject(err)
        }
      })
    })
  }

  getAllMediaData(): Promise<AudioData[]> {
    if (this.dir === undefined) throw new Error('dir is undefined')

    return new Promise((resolve, reject) => {
      fs.readdir(
        this.dir || '',
        {
          recursive: false
        },
        async (err, files) => {
          if (err) {
            reject(err)
          } else {
            const audio_file_paths = files
              .filter((fn) => typeof fn === 'string' && fn.endsWith('.mp3'))
              .map((name) => `${this.dir}/${name}`)

            const final_data: Array<AudioData> = []

            for (let i = 0; i < audio_file_paths.length; i++) {
              try {
                const audio_data = await this.getAudioDataFromFile(audio_file_paths[i])
                audio_data && final_data.push(audio_data)
              } catch (error) {
                console.error(error)
              }
            }
            resolve(final_data)
          }
        }
      )
    })
  }
}

export default SongIOHandler
