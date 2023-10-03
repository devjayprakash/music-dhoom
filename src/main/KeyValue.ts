import { app } from 'electron'
import fs from 'fs/promises'

class KeyValue {
  app_path: string

  constructor() {
    this.app_path = app.getPath('appData') + '/meta.json'
    this.createMetaIfNotExits()
  }

  keyExists(key: string) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.app_path)
        .then((data) => {
          const meta = JSON.parse(data.toString())
          const val = meta[key]
          if (!val) {
            resolve(false)
          }
          resolve(true)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  createMetaIfNotExits() {
    fs.access(this.app_path)
      .then(() => {
        console.log('meta.json exists')
      })
      .catch(async () => {
        await fs.writeFile(this.app_path, JSON.stringify({}))
      })
  }

  setKey(key: string, value: any) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.app_path)
        .then((data) => {
          const meta = JSON.parse(data.toString())

          const val = meta[key]

          if (val) {
            console.error(`The key ${key} already exists`)
            resolve(false)
          }

          meta[key] = value
          fs.writeFile(this.app_path, JSON.stringify(meta))
            .then(() => {
              resolve(true)
            })
            .catch((err) => {
              reject(err)
            })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  getKey(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.app_path)
        .then((data) => {
          const meta = JSON.parse(data.toString())
          const val = meta[key]
          if (!val) {
            resolve(undefined)
          }
          resolve(val)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  updateValue(key: string, value: any) {
    return new Promise((resolve, reject) => {
      const app_path = app.getPath('appData') + '/meta.json'
      fs.readFile(app_path)
        .then((data) => {
          const meta = JSON.parse(data.toString())
          const val = meta[key]
          if (!val) {
            reject(new Error('key not found'))
          }
          meta[key] = value
          fs.writeFile(app_path, JSON.stringify(meta))
            .then(() => {
              resolve(true)
            })
            .catch((err) => {
              reject(err)
            })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

export default KeyValue
