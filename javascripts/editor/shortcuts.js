const { openDevTools } = require("electron-debug");
var globalKeyPresses = {ctrlKey: false, altKey: false, shiftKey: false, letters: []}
var globalKeyPressesTemplate = {ctrlKey: false, altKey: false, shiftKey: false, letters: []};
document.addEventListener("keydown", function(e) {
    //Check for all of the combinations defined with the ctrl-key
    //Handle app-bar shortcuts
    if(e.altKey || e.ctrlKey || e.shiftKey || e.code) {
        var keyCombos = document.body.keyCombinations;
        var x;
        if(!keyCombos) return;
        if(keyCombos.length == 0) return;
        for(x of keyCombos) {
            var local = {ctrlKey: false, altKey: false, shiftKey: false, letters: [], connectedElement: x.connectedElement}
            var lCtrl = false;
            var lShift = false;
            var lAlt = false;
            var lLetters = [];
            globalKeyPresses = globalKeyPressesTemplate; //Reset the keypress tracker for every button click

            globalKeyPresses = [];
            if(e.altKey) {
                lAlt = true;
                globalKeyPresses.altKey = true;
            }

            if(e.ctrlKey) {
                lCtrl = true;
                globalKeyPresses.ctrlKey = true;

            }

            if(e.shiftKey) {
                lShift = true;
                globalKeyPresses.shiftKey = true;
            }
            
            if(e.code != "CapsLock" && e.code != "ControlLeft" && e.code != "ShiftLeft" && e.code != "AltLeft") {
                lLetters.push(e.code);
                globalKeyPresses.push(e.code);
            }

            if(lCtrl == x.ctrlKey && lShift == x.shiftKey && lAlt == x.altKey && lLetters[0] == x.letters[0]) {
                //Trigger the corresponding function
                var funct = x.connectedElement.click;
                funct();
            }
        }
    }



    if(e.ctrlKey) {
        switch(e.code) {
            case "KeyZ":
                undo();
            break;
            case "KeyY":
                redo();
            break;
            case "KeyP":
                //Properties shortcut
                console.log("PROPERTIES");
            break;
            /*
            case "KeyW":
                closeOpenTab(); //THIS NEEDS TO BE INCLUDED IN PRODUCTION!!
            break;
            
            case "KeyR":
                location.reload();
            break;*/
            case "KeyD":
                openDevTools();
            break;
        }
    } 

    if(e.code == "Escape") {
        unselectAllCells();
        //Unselect viewport stuff
        var border = document.getElementsByClassName("resizing-border-container")
        if(border) {
            var x;
            for(x of border) {
                x.parentNode.removeChild(x);
            }
        }
    }

    if(e.code == "Delete") {
        //Delete files if there are any
        deleteFile(true, null, null);
    }

    if(e.code == "KeyL") {
        updateFullscreenView();
    }




});

document.addEventListener("keyup", () => {
    globalKeyPresses = globalKeyPressesTemplate;
})