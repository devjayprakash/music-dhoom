import AudioDatabase from './database'

class DataProvider {
  private static db: AudioDatabase

  static getDbInstance() {
    if (this.db) {
      return this.db
    }
    this.db = new AudioDatabase()
    return this.db
  }
}

export default DataProvider
