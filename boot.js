const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const ipc = require
const url = require('url');
let win = null;
let launcherWin = null;
let programWin = null;


function boot() {
  //lage et nytt vindu
  launcherWin = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    width: 850,
    hasShadow: true,
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


function openEditor() {
  if(launcherWin) {
    
  }
    //lage et nytt vindu
    try {
      var { screen } = require("electron");
      var {width, height} = screen.getPrimaryDisplay().workAreaSize;


      programWin = new BrowserWindow({
        webPreferences: {
          nodeIntegration: true
        },
        width: width,
        height: height,
        hasShadow: true,
        minWidth: 1026,
        minHeight:963,
        frame: false,
        transparent: true
      })
    
      programWin.loadURL(url.format({
        pathname: 'home.html',
        slashes: true
      }))
      return true;
    } catch (error) {
      return error;
    }
}


ipcMain.on("open-main-window", (event) => {
  var open = openEditor();
  if(open) {
    event.returnValue = open;
  } else {
    event.returnValue = open;
  }
})

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

ipcMain.on('get-file-data', function(event) {
  var data = null
  if (process.platform == 'win32' && process.argv.length >= 2) {
    var openFilePath = process.argv[1]
    data = openFilePath
  }
  event.returnValue = data;
})

//Fyr av funksjon 'boot' når loading er ferdigstilt.
app.on('ready', boot);
