const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const ipc = require
const url = require('url');
let win = null;
let bootWin = null;


try {
  require('electron-reloader')(module, {ignore: ['./data/programData']});
} catch (_) {}


function boot() {
  //lage et nytt vindu
  launcherWin = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 850,
    maxWidth: 850,
    minWidth: 850,
    height: 650,
    maxHeight:650,
    minHeight:650,
    frame: false,
    transparent: true
  })

  launcherWin.loadURL(url.format({
    pathname: 'launcher.html',
    slashes: true
  }))

    /*win = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true
      },
    backgroundColor: "#171F26",
    width: 1920,
    height: 1080,
    frame: false
  }
  )
  //Laste inn html koden til vinduet
  win.loadURL(url.format({
    pathname: 'home.html',
    slashes: true
  }))*/
}
ipcMain.on("open-pfp-selector", (event) => {
  var file = dialog.showOpenDialog(launcherWin,
    {
      filters: [
        {name: 'Images', extensions: ["jpg", "png", "gif"]}
      ],
      properties: ['openFile']
    })
      if(file != undefined) {
        console.log("yes")
        console.log(file)
        event.returnValue = file;
      } else {
        //The dialog was canceled
        event.returnValue = "cancelled";
        console.log(event.returnValue);
      }
})


//Fyr av funksjon 'boot' når loading er ferdigstilt.
app.on('ready', boot);
