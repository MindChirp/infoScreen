const { openDevTools } = require("electron-debug");

document.addEventListener("keydown", function(e) {
    //Check for all of the combinations defined with the ctrl-key
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