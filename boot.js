const {app, BrowserWindow, ipcMain, dialog, Menu, globalShortcut, webContents} = require('electron');
const { openDevTools } = require('electron-debug');
const { autoUpdater } = require("electron-updater");
const { isPackaged } = require("electron-is-packaged");
const fs = require("fs");
const ipc = require
const url = require('url');
let win = null;
let launcherWin = null;
let programWin = null;
const path = require("path");
const isDev = require("electron-is-dev");
var programWidth;
var programHeight;
var programHeight1;
var programWidth1;
if(isDev) {
  //Do some stuff if the app is in developement mode
  const log = require('electron-log');
  
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';
  
  log.info('App starting...');
}

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;

autoUpdater.on("checking-for-update", () => {
  launcherWin.webContents.send("update-handler", [{newUpdate: false, installed: false, checking: true, error: false}])
  
})
autoUpdater.on("update-available", (updateInfo) => {
  launcherWin.webContents.send("update-handler", [{newUpdate: true, installed: false, checking: false, error: false, noUpdate: false, info: updateInfo}])
})
autoUpdater.on("update-downloaded", () => {
  //Quit the program and install the changes
  launcherWin.webContents.send("update-handler", [{newUpdate: false, installed: true, checking: false, error: false, noUpdate: false}])
})

autoUpdater.on("download-progress", (progressObj) => {
  //Quit the program and install the changes
  launcherWin.webContents.send("download-progress", progressObj);
})

autoUpdater.on("update-not-available", () => {
  launcherWin.webContents.send("update-handler", [{newUpdate: false, installed: false, checking: false, error: false, noUpdate: true}])
  
})
autoUpdater.on("error", () => {
  launcherWin.webContents.send("update-handler", [{newUpdate: false, installed: false, checking: false, error: true}])
})






function boot() {
  //lage et nytt vindu
  launcherWin = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      webSecurity: true,
      enableRemoteModule: true
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
    autoUpdater.checkForUpdatesAndNotify();

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


function openEditor(fileName) {
    //lage et nytt vindu
    try {
      var { screen } = require("electron");
      var {width, height} = screen.getPrimaryDisplay().workAreaSize;


      programWin = new BrowserWindow({
        webPreferences: {
          nodeIntegration: true,
          enableRemoteModule: true

        },
        width: width,
        height: height,
        hasShadow: true,
        minWidth: 1026,
        minHeight:963,
        frame: false,
        transparent: false,
        backgroundColor: "#171F26"
      });


      var unzipped = [];
      if(fileName) {

        //Get the file
        var projectFilePath;
        if(isPackaged) {
          projectFilePath = path.join(path.dirname(__dirname), "extraResources", "data", "programData", "projects");
        } else {
          projectFilePath = path.join(__dirname, "extraResources", "data", "programData", "projects");
        }
        fs.readFile(projectFilePath + "/" + fileName + ".proj", "binary", (err, data) => {
          var zip = new require("node-zip")(data, {base64: false, checkCRC32: true});

          var files = ["meta.json"]

          unzipped.push(zip.files[files[0]]);  



        })
      }
      
      programWin.webContents.on("did-finish-load", () => {

      const screen = require("electron").screen;
      var { width, height } = screen.getPrimaryDisplay().workAreaSize; 
      programWidth = width;
      programHeight = height;

      programHeight1 = height - 100;
      programWidth1= width - 200;

      //Send the file information to the renderer process
      setTimeout(function() {
        programWin.webContents.send("opened-file-information", unzipped);
      }, 300)

    })
        
    
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


ipcMain.on("apply-update", () => {
  autoUpdater.quitAndInstall();
})

ipcMain.on("start-downloading-update", () => {
  autoUpdater.downloadUpdate();
})


ipcMain.on("open-main-window", (event, arg) => {
  var fileName = arg;
  var open = openEditor(fileName);
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
    }).then(result => {
      if(!result.canceled) {
        event.returnValue = JSON.stringify({fileName: result.filePaths});
      } else {
        event.returnValue = JSON.stringify({fileName: "canceled"})
      }
    })
})


ipcMain.on("open-file-selector", (event) => {
  var file = dialog.showOpenDialog(launcherWin,
    {
      filters: [
        {name: 'Images and videos', extensions: ["jpg", "png", "gif", "mp4"]}
      ],
      properties: ['openFile', 'multiSelections']
    }).then(result => {
      if(!result.canceled) {
        event.returnValue = JSON.stringify({filePaths: result.filePaths});
      } else {
        event.returnValue = JSON.stringify({filePaths: "canceled"});
      }
    })
})


ipcMain.on('get-file-data', function(event) {
  var data = null
  if (process.platform == 'win32' && process.argv.length >= 2) {
    var openFilePath = process.argv[1]
    data = openFilePath
  }
  event.returnValue = JSON.stringify({data: data});
})

//Check for app-bar button presses
ipcMain.on("minimize", function(e) {
  programWin.minimize();
})

  //programWidth
  //programHeight
  //programHeight1;
  //programWidth1;
  var state = 0;
ipcMain.on("restore", function(e) {
  if(state == 0) {
    programWin.unmaximize();
    state = 1;
  } else {
    programWin.maximize();
    state = 0;
  }
})

ipcMain.on("close", function(e) {
  programWin.close();
})
ipcMain.on("closeLauncher", function(e) {
  launcherWin.close();
})

ipcMain.on("show-changelog", function(e) {
  
  var releaseNotes = fs.readFileSync("./build/release-notes.md", "utf8");

  
  launcherWin.webContents.send("update-handler", [{newUpdate: true, installed: false, checking: false, error: false, noUpdate: false, info: {version: "0.0.39", releaseNotes: releaseNotes}}])
})

ipcMain.on("relaunch-launcher", () => {
  boot();
  programWin.close();
})


//Fyr av funksjon 'boot' når loading er ferdigstilt.
app.on('ready', () => {
//  launcherWin.webContents.send("update-handler", [{newUpdate: true, installed: false, checking: false, error: false}])
  boot();

});
