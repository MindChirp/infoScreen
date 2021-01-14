const { openDevTools } = require("electron-debug");

document.addEventListener("keydown", function(e) {
    //Check for all of the combinations defined with the ctrl-key
    //Handle app-bar shortcuts
    if(e.altKey || e.ctrlKey || e.shiftKey || e.code) {
        var keyCombos = document.body.keyCombinations;
        var x;

        for(x of keyCombos) {
            var local = {ctrlKey: false, altKey: false, shiftKey: false, letters: [], connectedElement: x.connectedElement}
            var lCtrl = false;
            var lShift = false;
            var lAlt = false;
            var lLetters = [];

            if(e.altKey) {
                lAlt = true;
            }

            if(e.ctrlKey) {
                lCtrl = true;
            }

            if(e.shiftKey) {
                lShift = true;
            }
            
            if(e.code != "CapsLock" && e.code != "ControlLeft" && e.code != "ShiftLeft" && e.code != "AltLeft") {
                
                lLetters.push(e.code);
            }

            if(lCtrl = x.ctrlKey && lShift == x.shiftKey && lAlt == x.altKey && lLetters[0] == x.letters[0]) {
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

})