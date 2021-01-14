var appB = require("app-buttons");
const { ipcMain, ipcRenderer } = require("electron");
const { aboutMenuItem } = require("electron-util");
const menuHandler = new Appmenu();

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
                click: () => {}
            },
            {
                label: "Open...",
                accelerator: "Ctrl+O",
                submenu: [
                    {
                        label: "...From server",
                        accelerator: "Ctrl+O+S"
                    },
                    {
                        label: "...From PC",
                        accelerator: "Ctrl+O"
                    },
                    {
                        label:"...From chip in brein",
                        accelerator:"Ctrl+B",
                        click:()=>{
                            alert("Opening ur brein...") 
                        }

                    }
                ]
            }
        ]
    },
    {
        label: "Help",
        submenu: [
            {
                label: "Check for Updates"
            },
            {label: "divider"},          
            {
                label: "Report Issue"
            },
            {
                label: "divider"
            },
            {
                label: "About",
                click: () => {
                    console.log("asd")
                    aboutMenu();
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
                        label: "Server Connection"
                    },
                    {
                        label: "Screen Setup"
                    },
                    {label: "divider"},
                    {
                        label: "Advanced",
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
