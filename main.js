const electron = require('electron')
const app = electron.app
const Looker = require('./lib/looker')
const BrowserWindow = electron.BrowserWindow

let looker
let mainWindow

function onReady () {
  looker = new Looker()
}

app.on('ready', onReady)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    onReady()
  }
})
