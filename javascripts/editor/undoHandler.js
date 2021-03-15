//Store the undo clipboard in a file when the program closes.
//When changes are made, the code in this file should be triggered to save the actions
//made by the user in a list, which can be iterated through on-demand


//The ctrl-z combination is defined in /javascripts/editor/shortcuts.js

var undoClipboard = [];
var redoClipboard = [];

//UNDO FUNCTION

function undo() {
    //Get the last edited thing
    var clip = undoClipboard[undoClipboard.length-1];
    if(!clip) return;
    var action = clip.action;
    console.log(action)
    switch(action) {
        case "delete":
            action = "add";
        break;
        case "add":
            action = "delete";
        break;
    }
    revertAction(clip);
    clip.action = action;
    redoClipboard.push(clip);
    undoClipboard.splice(undoClipboard.length-1,1);
}

//REDO FUNCTION

function redo() {
    var clip = redoClipboard[redoClipboard.length-1];
    if(!clip) return;
    var action = clip.action;
    console.log(action)
    switch(action) {
        case "delete":
            action = "add";
        break;
        case "add":
            action = "delete";
        break;
    }
    revertAction(clip);
    clip.action = action;
    undoClipboard.push(clip);
    redoClipboard.splice(redoClipboard.length-1,1);
}



function revertAction(clip) {
    //Check if this is a file, or something
    if(clip.type == "file") {
        if(clip.action == "add") {

            if(clip.connectedElement instanceof Element) {
                //Remove the recently added element
                renderer.unrender(clip.connectedElement);
                clip.connectedElement.parentNode.removeChild(clip.connectedElement);
            }
        } else if(clip.action == "delete") {
            //Add a recently deleted element
            var parent = clip.parent;
            parent.appendChild(clip.connectedElement);
        }
    }
}