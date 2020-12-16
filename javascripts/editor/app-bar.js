var appB = require("app-buttons");

var appButtons = appB.appButtons(document.getElementById("app-bar"), true);
var children = appButtons.childNodes;

children.forEach(function(e) {
    e.childNodes[0].style.color = "rgba(255,255,255,0.4)";
    e.childNodes[0].style.filter = "invert(100%)";
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