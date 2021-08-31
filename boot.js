const {app, BrowserWindow, ipcMain, dialog, Menu, globalShortcut, webContents, screen} = require('electron');
const { openDevTools } = require('electron-debug');
const { autoUpdater } = require("electron-updater");
const { isPackaged } = require("electron-is-packaged");
const fs = require("fs");
const ipc = require
const serverAddress = "https://shrouded-wave-54128.herokuapp.com";
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
var userIsDeveloper = false;

var windowIdTracker = []

const filesPath = app.getPath("userData");


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
    transparent: true,
    fullscreen: false,
    fullscreenable: false
  })
  launcherWin.webContents.on("did-finish-load", () => {
    autoUpdater.checkForUpdatesAndNotify();
    //Send a message to the renderer
    launcherWin.webContents.send("files-path", filesPath);
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

  windowIdTracker.push({name: "launcher-window", id: launcherWin.id});
}

var rendererAwareOfClosing = false;

ipcMain.on("close-intentionally", (e, data) => {
  rendererAwareOfClosing = JSON.parse(data);
})

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

      windowIdTracker.push({name:"main-window", id: programWin.id});
      programWin.on("close", (e)=>{
        if(!rendererAwareOfClosing) {
          console.log("RENDERER NOT AWARE OF CLOSING")
          e.preventDefault();
          //Clear the localstorage
          
          //Let the program know that something is being closed
          programWin.webContents.send("close-program-please", JSON.stringify(true));
        } else {
          //Willfully close the program
          //Close all related windows e.g. fullscreen windows

          //windowIdTracker

          var titlesClose = ["fullscreen-window"];

          var x;
          for(x of windowIdTracker) {
            var y;
            for(y of titlesClose) {
              if(x.name == y) {
                BrowserWindow.fromId(x.id).close();
              }
            }
          }
        }
      })

      programWin.on("closed", (e)=>{
        rendererAwareOfClosing = false;
      })


      var unzipped = [];
      if(fileName && !fileName.developerLaunch) {

        //Get the file
        fs.readFile(path.join(filesPath, "projects", fileName + ".proj"), "binary", (err, data) => {
          var zip = new require("node-zip")(data, {base64: false, checkCRC32: true});

          var files = ["meta.json"]

          unzipped.push(zip.files[files[0]]);  

          unzipped[0].clientDev = userIsDeveloper;

        })
      } else if(fileName.developerLaunch) {
        //Program is launched from the developer launch button. 
        unzipped[0] = {developerProject: true};
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

      var bindsPath;
      if(isPackaged) {
        bindsPath = path.join(path.dirname(__dirname), "extraResources", "data", "programData", "settings", "editableKeyBinds.json");
      } else {
        bindsPath = path.join(__dirname, "extraResources", "data", "programData", "settings", "editableKeyBinds.json");
      }
      fs.readFile(bindsPath, "utf8",(err, data) => {
        if(err) throw err;
        var dat = JSON.parse(data);
        appendAccelerators(dat);
      })

      var appendAccelerators = function(data) {
        var x;
        for(x of data) {
          //console.log(x);
          function sendIt(data) {
            console.log(windowIdTracker);
            var id;
            for(x of windowIdTracker) {
              if(x.name == "main-window") {
                id = x.id;
              }
            }
            console.log(id);
            if(id) {
              BrowserWindow.fromId(id).webContents.send("global-shortcuts", data);
            }
          }
          (function(){
            var info = x;
            globalShortcut.register(x.accelerator, ()=>{
                sendIt(info);
            });
          }());
        }
        //var ret = globalShortcut.register()
      }
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

function getObjFromAttribute(attribute = {title, id}) {
  if(attribute.title) {
    for(var i = 0; i < windowIdTracker.length; i++) {
      if(attribute.title == windowIdTracker[i].name) {
        return windowIdTracker[i];
      }
    }  
  } else if(attribute.id) {
    if(attribute.id == windowIdTracker[i].id) {
      return windowIdTracker[i];
    }
  }
}

var fullScreenWindow;
async function openFullscreenWindow(extDisplay) {
  return new Promise((resolve, reject) => {

    var { screen } = require("electron");
    var {width, height} = screen.getPrimaryDisplay().workAreaSize;
    
    
    var id = undefined;
    var x;
    for(x of windowIdTracker) {
      if(x.name == "fullscreen-window") {
        id = x.id;
      }
    }
    if(id) {
      
      if(BrowserWindow.fromId(id)) {
      var ind = windowIdTracker.findIndex(function(o) {
        return o.id === id;
      })

      if(ind !== -1) windowIdTracker.splice(ind, 1);

      console.log("CLOSING WINDOW WITH ID ", id);
      BrowserWindow.fromId(id).close();
      reject();
      return;
    }
    }
  
    if (extDisplay) {
      fullScreenWindow = new BrowserWindow({
        x: extDisplay.bounds.x,
        y: extDisplay.bounds.y,
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
        transparent: true,
        fullscreen: true,
        minimizable: false,
        
      });
    } else {
      
      fullScreenWindow = new BrowserWindow({
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
        transparent: true,
        fullscreen: true
      });
      
    }
    
    windowIdTracker.push({name: "fullscreen-window", id: fullScreenWindow.id})
    
    var htmlPath = path.join(__dirname, "fullscreen.html");
    fullScreenWindow.loadURL(url.format({
      pathname: htmlPath,
      slashes: true
    }))
    resolve();
  })
}


ipcMain.on("fullscreen-slideshow", (event) => {
    var displays = screen.getAllDisplays()
    var externalDisplay = displays.find((display) => {
      return display.bounds.x !== 0 || display.bounds.y !== 0
    })

    openFullscreenWindow(externalDisplay)
    .then(()=>{

      var id;
      //Get the browserWindow
      var x;
      for(x of windowIdTracker) {
        if(x.name == "fullscreen-window") {
          id = x.id;
        }
      }
      if(id) {
        
        var window = BrowserWindow.fromId(id);
        if(!window) return;
        window.webContents.on("did-finish-load", async () => {
          event.returnValue = "OK";
        });
        
      }
      
    })
    .catch((error) => {
      event.returnValue = "WINDOW CLOSED";
    })
}) 


ipcMain.on("user-is-developer", (ev, dat) => {
  if(JSON.parse(dat) == true) {
    userIsDeveloper = true;
  }
  console.log(dat);
  ev.returnValue = "OK";
})


ipcMain.on("apply-update", () => {
  autoUpdater.quitAndInstall();
})

ipcMain.on("start-downloading-update", async () => {
  autoUpdater.downloadUpdate()
  .then((result) => {
    console.log("RESULTS ARE READY")
    //Get the correct window
    var id = getObjFromAttribute({title: "launcher-window"}).id
    if(BrowserWindow.fromId(id)) {
      BrowserWindow.fromId(id).webContents.send("downloading-update", JSON.stringify(true));
    }
  })
  .catch((error) => {
    console.log("ENCOUNTERED ERROR!")

    var id = getObjFromAttribute({title: "launcher-window"}).id
    console.log(id)
    if(BrowserWindow.fromId(id)) {
      console.log("SENDING")
      BrowserWindow.fromId(id).webContents.send("downloading-update", JSON.stringify(false));
    }
  })
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
  var win = e.sender.getOwnerBrowserWindow();
  win.minimize();
})

  //programWidth
  //programHeight
  //programHeight1;
  //programWidth1;
  var state = 0;
ipcMain.on("restore", function(e) {
  var win = e.sender.getOwnerBrowserWindow();
  if(state == 0) {
    win.unmaximize();
    state = 1;
  } else {
    win.maximize();
    state = 0;
  }
})

ipcMain.on("close", function(e) {
  var win = e.sender.getOwnerBrowserWindow();
  win.close();
  
})
ipcMain.on("closeLauncher", function(e) {
  launcherWin.close();
})

ipcMain.on("show-changelog", function(e) {
  
  var releaseNotes = fs.readFileSync("./build/release-notes.md", "utf8");

  
  launcherWin.webContents.send("update-handler", [{newUpdate: true, installed: false, checking: false, error: false, noUpdate: false, info: {version: "0.0.39", releaseNotes: releaseNotes}}])
})

ipcMain.on("relaunch-launcher", () => {
  //Get the id of the main window
  rendererAwareOfClosing = true;
  //Start the launcher
  boot();

  var titlesClose = ["fullscreen-window", "main-window"];

  var x;
  for(x of windowIdTracker) {
    var y;
    for(y of titlesClose) {
      if(x.name == y) {
        if(BrowserWindow.fromId(x.id)) {
          BrowserWindow.fromId(x.id).close();
        }
      }
    }
  }
  //Get the correct window from the windowarray, and remove it
  var ind = windowIdTracker.findIndex(function(o) {
    return o.name === "main-window";
  })
  if(ind !== -1) windowIdTracker.splice(ind, 1);

    rendererAwareOfClosing = false;
})

ipcMain.on("inter-renderer-communication", (event, arg) => {
  var senderName = arg.routingInformation.forwardingName;
  if(fullScreenWindow) {
    try {
      if(fullScreenWindow.webContents) {
        fullScreenWindow.webContents.send(senderName, arg.forwardingInformation);
        event.returnValue = "OK"
      } else {
        event.returnValue = "Did not work";
      }
      
    } catch (error) {
      event.returnValue = "Could not forward information";
    }
  } else {
    event.returnValue = "Did not work";
  }

})


//Fyr av funksjon 'boot' når loading er ferdigstilt.
app.on('ready', () => {
//  launcherWin.webContents.send("update-handler", [{newUpdate: true, installed: false, checking: false, error: false}])
  boot();

});


var overlayId;

ipcMain.on("toggle-overlay", (event)=>{

  if(overlayId) {
    var window = BrowserWindow.fromId(overlayId);
    if(window) {
      window.close();
      return;
    }
  }



  var { screen } = require("electron");
  var {width, height} = screen.getPrimaryDisplay().workAreaSize;

  var overlay = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      webSecurity: true,
      enableRemoteModule: true
    },
    width: width,
    hasShadow: true,
    maxWidth: width,
    minWidth: width,
    height: height,
    maxHeight:height,
    minHeight:height,
    frame: false,
    transparent: true,
    title: "InfoScreen Overlay",
    fullscreen: true,
    minimizable: false,
    resizable: false,
    movable: false
  });


  var htmlPath = path.join(__dirname, "overlay.html");
  overlay.loadURL(url.format({
    pathname: htmlPath,
    slashes: true
  }))

  overlayId = overlay.id;

})