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
        }
    } 

})