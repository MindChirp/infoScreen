var appB = require("app-buttons");
const menuHandler = new Appmenu();

var appButtons = appB.appButtons(document.getElementById("app-bar"), true);
appButtons.style.opacity = "0.7";
var children = appButtons.childNodes;

children.forEach(function(e) {
    e.childNodes[0].style.color = "var(--title-color)";
})


//Define the different functions for closing etc

function programExit() {

    const remote = require('electron').remote
let w = remote.getCurrentWindow()
w.close()
}

function programMinimize() {

}

function programMaximize() {
    
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
            {
                label: "divider"
            },          
            {
                label: "Report Issue"
            },
            {
                label: "divider"
            },
            {
                label: "About"
            }
        ]
    },
    {
        label: "Settings",
        submenu: [
            {
                label: "Ur mom"
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
