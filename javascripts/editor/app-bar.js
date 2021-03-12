var appB = require("app-buttons");
const { ipcMain } = require("electron");
const { aboutMenuItem } = require("electron-util");
const menuHandler = new Appmenu();
console.log(document.getElementById("app-bar"))
var appButtons = appB.appButtons(document.getElementById("app-bar"), true);
appButtons.style.opacity = "0.7";
var children = appButtons.childNodes;

children.forEach(function(e) {
    e.childNodes[0].style.color = "var(--title-color)";
})


//Define the different functions for closing etc

function programExit() {
    ipcRenderer.send("close", true);
}

function programMinimize() {
    ipcRenderer.send("minimize", true);
}

function programMaximize() {
    ipcRenderer.send("restore", true);
}


const template = [
    {
        label: "File",
        submenu: [
            {
                label: "New",
                accelerator: "Ctrl+N",
                click: () => {},
                disabled: true
            },
            {
                label: "Open...",
                submenu: [
                    {
                        label: "...From server",
                        accelerator: "Ctrl+H",
                        click: () => {alert("opening from server")},
                        disabled: true
                    },
                    {
                        label: "...From PC",
                        accelerator: "Ctrl+O",
                        click: () => {alert("Opening from PC")},
                        disabled: true
                    },
                    {
                        label:"...From chip in brein",
                        accelerator:"Ctrl+B",
                        click:()=>{
                            alert("Opening ur brein...") 
                        }

                    }
                ]
            },
            {
                label: "Save",
                accelerator: "Ctrl+S",
                click: () => {
                    saveFile();
                }
            },
            {label: "divider"},
            {
                label: "File info",
                click: ()=>{
                    showFileInfo();
                }
            }
        ]
    },
    {
        label: "Help",
        submenu: [   
            {
                label: "Report Issue",
                accelerator: "Ctrl+I",
                click: () => {
                    reportIssueMenu();
                }
            },
            {
                label: "divider"
            },
            {
                label: "About",
                click: () => {
                    aboutMenu();
                }
            },
            {label: "divider"},
            {
                label: "Keybinds",
                click: () => {
                    showKeybinds();
                }
            }
        ]
    },
    {
        label: "Settings",
        submenu: [
            {
                label: "Network...",
                submenu: [
                    {
                        label: "Server Connection",
                        disabled: true,
                        click: () => {
                            serverConnectionMenu();
                        }
                    },
                    {
                        label: "Screen Setup",
                        disabled: true
                    },
                    {label: "divider"},
                    {
                        label: "Advanced",
                        disabled: true
                    }
                ]
            },
            {
                label: "Appearance...",
                submenu: [
                    {
                        label: "Themes",
                        click: () => {
                            themeMenu();
                        }
                    },
                    {label: "divider"},
                    {
                        label: "Language",
                        click: () => {
                            languageMenu();
                        }
                    }
                ]
            },
            {
                label:"divider"
            },
            {
                label: "More",
                click: () => {generalSettings()},
                accelerator: "Ctrl+Alt+S",
                disabled: false
            }
        ]
    },
    {
        label: "Window",
        submenu: [
            {
                label: "Check for Updates",
                disabled: true
            },
            {label: "divider"},       
            {
                label: "Open launcher",
                accelerator: "Ctrl+L",
                click: () => {
                    relaunchLauncher();
                }
            },
            {
                label: "Exit",
                click: () => {ipcRenderer.send("close", true)}
            }
        ]
    }
]


function enableAppBarButtons() {
    var instantiate = menuHandler.appbar(template);
    var parent = document.getElementById("app-bar").querySelector(".app-bar-menu-container");

    instantiate.setAttribute("id", "menu");

    parent.appendChild(instantiate);
}



        // Get all file information on startup
ipcRenderer.on("opened-file-information", (e, args) => {

    //If there is no file information, enter developer mode
    //Program is launched with the developer button
    if(args[0] == undefined) {
        //File is possibly corrupt
        document.body.corruptFile = true;
        var title = document.getElementById("project-name");
        title.innerHTML = "Error - This file is unreadable. Do not edit this file.";
        return;
    }

    if(!args[0]) {document.body.devMode = true; return};


        var fileInfo = JSON.parse(args[0]._data);
        applyFileInfo(fileInfo);
   



    if(args[1] == true) {
        document.body.devMode = true;
    } else {
        document.body.devMode = false;
    }
})