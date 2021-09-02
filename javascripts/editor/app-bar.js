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
var alreadyClosing = false;
async function programExit() {

    //Inform the main process that we are closing the program intentionally
    ipcRenderer.send("close-intentionally", JSON.stringify(true));

    var stayAuthed = JSON.parse(localStorage.getItem("staySignedIn"));
    alreadyClosing = true;
    if(!stayAuthed) {
        var modal = await modalWindow("This will close the program and sign you out.", "Any unsaved changes will be lost. Are you sure?", "info")
        var ok = document.createElement("button");
        ok.innerHTML = "Yes";
        modal.appendChild(ok);

        var no = document.createElement("button");
        no.innerHTML = "Cancel";
        no.className = "important";
        modal.appendChild(no);
        no.addEventListener("click", ()=>{
            modal.kill();

            //Inform the main process we are no longer wishing to close the program
            ipcRenderer.send("close-intentionally", JSON.stringify(false));
            alreadyClosing = false;
        })

        ok.addEventListener("click", async()=>{
            modal.kill();
            signOut();
        })

        var signOut = function() {

            signOutProgram()
            .then(()=>{
                localStorage.clear();
                ipcRenderer.send("close", true);
            })
            .catch(()=>{
                localStorage.clear();
                ipcRenderer.send("close", true);
            })
        }
    } else {
        ipcRenderer.send("close", true);
    }
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
                label: "Overlay",
                click: ()=>{
                    overlaySettings();
                }
            },
            {label: "divider"}, 
            {
                label: "Experimental",
                submenu:[
                    {
                        label: "Update themes",
                        click: ()=>{
                            mergeThemesFiles();
                        },
                        accelerator: "Ctrl+Shift+T"
                    }
                ]
            },
            {label:"divider"},    
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

    console.log(args);

    if(!args[0]) {document.body.devMode = true; return};


        var fileInfo = JSON.parse(args[0]._data);
        applyFileInfo(fileInfo);
   



    if(args[0].developerProject) {
        document.body.devMode = true;
    } else {
        document.body.devMode = false;
    }
    console.log(args[0])
    if(args[0].clientDev == true) {
        //User is developer
        document.body.clientDev = true;
    } else {
        document.body.clientDev = false;
    }
})