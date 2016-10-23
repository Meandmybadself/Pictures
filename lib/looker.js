'use strict'

const {dialog} = require('electron')
const glob = require('glob-promise')
const {BrowserWindow} = require('electron')
const {ipcMain} = require('electron')
const fs = require('fs-promise')
const shuffle = require('shuffle-array')

class Looker {
  constructor () {
    this.openPrompt()
  }

  openPrompt () {
    let dir = dialog.showOpenDialog({properties: ['openDirectory', 'showHiddenFiles']})
    if (dir) {
      this._currentDir = dir
      glob(this._currentDir + '**/*.{jpg,jpeg,png,gif}')
        .then((contents) => {
          if (contents.length) {
            this._win = new BrowserWindow({backgroundColor: '#111111'})
            this._win.loadURL(`file://${__dirname}/../index.html`)

            ipcMain.on('message', (e, msg) => {
              this._handleMessage(e, msg)
            })

            this._originalImages = contents
            this._images = contents
            this._imageCursor = -1
            this._win.once('ready-to-show', () => {
              win.show()
              this._showNextImage()
            })
          }
        })
    }
  }

  _handleMessage (e, msg) {
    switch (msg) {
      case 'next-image':
        this._showNextImage()
        break
      case 'prev-image':
        this._showPreviousImage()
        break
      case 'randomize':

        if (!this._isRandomized) {
          this._isRandomized = true;
          shuffle(this._images)
        } else {
          this._isRandomized = false;
          this._images = this._originalImages
        }
      break;
    }
  }

  _showNextImage () {
    if (++this._imageCursor >= this._images.length) {
      this._imageCursor = 0
    }
    let filename = this._images[this._imageCursor]
    this._loadImage(filename)
  }

  _showPreviousImage () {
    if (--this._imageCursor < 0) {
      this._imageCursor = this._images.length - 1
    }
    let filename = this._images[this._imageCursor]
    this._loadImage(filename)
  }

  _loadImage (filename) {
    fs.readFile(filename)
      .then((data) => {
        var imgStr = data.toString('base64')
        this._win.webContents.send('image', imgStr)
      })
      .catch((e) => {
        console.log('e', e)
      })
  }
}

module.exports = Looker
