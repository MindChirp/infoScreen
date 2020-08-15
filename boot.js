const {app, BrowserWindow, dialog, ipcMain} = require('electron');
const url = require('url');
let win = null;
let bootWin = null;

try {
  require('electron-reloader')(module, {
    ignore: ["data"]
  });
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

ipcMain.on("load-program", function(event) {
  loadMainProgram();
})

function loadMainProgram() {
    win = new BrowserWindow({
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
  }))

}
}

ipcMain.on("open-pfp-selector", function(event) {
  dialog.showOpenDialog({
    properties: ["openFile"]
  }).then(result => {
    console.log(result)
    event.reply("selected-image", JSON.stringify(result));
  }).catch(err => {
    console.log(err);
  })
})


//Fyr av funksjon 'boot' når loading er ferdigstilt.
app.on('ready', boot);
