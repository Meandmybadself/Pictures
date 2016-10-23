const $ = require('jquery')
const {ipcRenderer} = require('electron')

function onKeyPress (e) {
  let img

  console.log(e.keyCode)
  switch (e.keyCode) {
    case 39: // right
      ipcRenderer.send('message', 'next-image')
      break
    case 37:
      ipcRenderer.send('message', 'prev-image')
      break
    case 82:
      ipcRenderer.send('message', 'randomize')
    break;
  }
}

$(() => {
  ipcRenderer.on('image', (event, r) => {
    $('#image').css('background-image', 'url(data:image/gif;base64,' + r + ')')
  })

  $(window).on('keydown', (e) => {
    onKeyPress(e)
  })
})
