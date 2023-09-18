import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { BrowserWindow, app, dialog, ipcMain, shell } from 'electron'
import fs from 'fs/promises'
import jsmedia from 'jsmediatags'
import { join } from 'path'

import icon from '../../resources/icon.png?asset'

let mainWindow: BrowserWindow | undefined

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow && mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('set_title', (_, windowTitle) => {
  if (!windowTitle) {
    console.error('no args recieved')
  }
  mainWindow && mainWindow.setTitle(windowTitle)
})

ipcMain.handle('open_folder_picker', async () => {
  console.log('this is working')

  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })

  if (result.canceled === false && result.filePaths.length > 0) {
    const path = result.filePaths[0]
    const dir_res = await fs.readdir(path, {
      recursive: false
    })
    const only_mp3 = dir_res.filter((fn) => fn.endsWith('.mp3')).map((name) => `${path}/${name}`)

    const final_data = await new Promise((resolve) => {
      let final: any[] = []
      for (let i = 0; i < only_mp3.length; i++) {
        jsmedia.read(only_mp3[i], {
          onSuccess: async (tag) => {
            const audio_data = await fs.readFile(only_mp3[i], 'binary')

            const pic_data = tag.tags.picture?.data || []
            const format = tag.tags.picture?.format || ''

            let b_64_str = ''

            for (let i = 0; i < pic_data.length; i++) {
              b_64_str += String.fromCharCode(pic_data[i])
            }
            final.push({
              title: tag.tags.title,
              artists: tag.tags.artist,
              pic_url: `data:${format};base64,${btoa(b_64_str)}`,
              path: only_mp3[i],
              binary_str: audio_data
            })

            if (i === only_mp3.length - 1) {
              resolve(final)
            }
          },
          onError: (err) => {
            console.error(err)
          }
        })
      }
    })
    return final_data
  }

  return []
})
