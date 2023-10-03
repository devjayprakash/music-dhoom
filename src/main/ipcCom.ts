import { BrowserWindow, dialog, ipcMain } from 'electron'
import fs from 'fs/promises'
import KeyValue from './KeyValue'
import SongIOHandler from './SongIOHandler'

const meta = new KeyValue()
const songIo = new SongIOHandler()

export default async function handleIPCCom(mainWindow: BrowserWindow | undefined) {
  ipcMain.handle('get_last_song_played', async () => {
    const path = await meta.getKey('last_song_played')
    if (path) {
      return await songIo.getAudioDataFromFile(path)
    }
    return ''
  })

  ipcMain.handle('save_last_song_played', async (_, path) => {
    await meta.setKey('last_song_played', path)
  })

  ipcMain.handle('get_data_frm_last_dir', async () => {
    const dir = await meta.getKey('last_dir')
    if (dir) {
      songIo.setDir(dir)
      const audio_data = await songIo.getAllMediaData()
      return audio_data
    }
    return []
  })

  //handling window title
  ipcMain.handle('set_title', (_, windowTitle) => {
    if (!windowTitle) {
      console.error('no args recieved')
    }
    mainWindow && mainWindow.setTitle(windowTitle)
  })

  //handling audio file data read
  ipcMain.handle('get-audio-file', async (_, path) => {
    try {
      const buffer = await fs.readFile(path)
      return buffer
    } catch (error) {
      throw error
    }
  })

  ipcMain.handle('open_folder_picker', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    if (result.canceled === false && result.filePaths.length > 0) {
      const dir = result.filePaths[0]
      meta.setKey('last_dir', dir)
      songIo.setDir(dir)
      const audio_data = await songIo.getAllMediaData()
      return audio_data
    }

    return []
  })
}
