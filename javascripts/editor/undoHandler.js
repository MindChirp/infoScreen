//Store the undo clipboard in a file when the program closes.
//When changes are made, the code in this file should be triggered to save the actions
//made by the user in a list, which can be iterated through on-demand

//Define the ctrl-z combination
document.addEventListener("keydown", function(e) {
    if(e.keyCode == 90) {
        undo();
    } else if(e.keyCode == 89) {
        redo();
    }
})

var undoClipboard = [];
var redoClipboard = [];


//UNDO FUNCTION

function undo() {
    console.log("UNDOING");
}

function redo() {
    console.log("REDOING");
}