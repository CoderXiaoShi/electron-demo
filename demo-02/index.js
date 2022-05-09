var { app, BrowserWindow, ipcMain, dialog }  = require('electron')
const path = require('path')

let win = null

async function handleFileOpen(e, val) {
  console.log('handleFileOpen', val)
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {
    return
  }
  return filePaths[0]
}

app.on('ready', () => {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, './preload.js')
    }
  })
  win.loadFile('./index.html');
  win.on('closed', () => {
    win = null;
  })
  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    console.log(title)
    win.setTitle(`--${title}--`)

  })
  ipcMain.handle('dialog:openFIle', handleFileOpen)
})

app.on('window-all-closed', () => {
  app.quit()
})
