const {app, BrowserWindow, ipcMain, dialog, Menu, globalShortcut, webContents} = require('electron');
const { openDevTools } = require('electron-debug');
const { autoUpdater } = require("electron-updater");
const ipc = require
const url = require('url');
let win = null;
let launcherWin = null;
let programWin = null;
const path = require("path");
const isDev = require("electron-is-dev");

if(isDev) {
  //Do some stuff if the app is in developement mode
  const log = require('electron-log');
  
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';
  
  log.info('App starting...');
}







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
  launcherWin.webContents.on("did-finish-load", () => {
    //launcherWin.webContents.send("message", "Your mom is gay");
    autoUpdater.checkForUpdatesAndNotify();
    autoUpdater.on("checking-for-update", () => {})
    autoUpdater.on("update-available", () => {
      launcherWin.webContents.send("update-handler", [{newUpdate: true, installed: false}])
    })
    autoUpdater.on("update-downloaded", () => {
      //Quit the program and install the changes
      autoUpdater.quitAndInstall();
    })
    autoUpdater.on("error", () => {})
  });
  var htmlPath = path.join(__dirname, "launcher.html");
  launcherWin.loadURL(url.format({
    pathname: htmlPath,
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
      });
      
      /*const template = [
        {
          label: 'View',
          submenu: [
            {
              label: "Settings",
              click: () => {
                //Open the settings or something blah blah blah
              }
            },
            {
              label: "Help",
              click: () => {
                //Show some help or something
              }
            },
            

          ]
        },
        {
          label: "Application",
          submenu: [
            {
              label: "Quit",
              click: () => {
                app.quit();
              }
            },
            {
              label: "Force reload",
              accelerator: "CmdOrCtrl+R",
              click: () => { programWin.reload() }
            }
          ]
        }
      ]

      const menu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(menu);*/
      /*programWin.setMenu(null); //INCLUDE THIS IN PRODUCTION!!
      */ //openDevTools(); //Exclude in production
      var htmlPath = path.join(__dirname, "home.html");
      programWin.loadURL(url.format({
        pathname: htmlPath,
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
