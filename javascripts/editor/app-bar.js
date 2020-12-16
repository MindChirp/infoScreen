var appB = require("app-buttons");

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