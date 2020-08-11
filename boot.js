const {app, BrowserWindow} = require('electron');
const url = require('url');
let win = null;
let bootWin = null;

function boot() {
  //lage et nytt vindu
  launcherWin = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true
      },
    backgroundColor: "#171F26",
    width: 850,
    height: 650,
    frame: false
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
//Fyr av funksjon 'boot' når loading er ferdigstilt.
app.on('ready', boot);
