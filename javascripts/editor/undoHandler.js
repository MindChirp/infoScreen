//Store the undo clipboard in a file when the program closes.
//When changes are made, the code in this file should be triggered to save the actions
//made by the user in a list, which can be iterated through on-demand

//The ctrl-z combination is defined in /javascripts/editor/shortcuts.js

var undoClipboard = [];
var redoClipboard = [];

//UNDO FUNCTION

function undo() {
    console.log("UNDOING");
}

//REDO FUNCTION

function redo() {
    console.log("REDOING");
}