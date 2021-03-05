//This file handles all the file selecting stuff etc

/*

OK HERE'S THE DEAL
I am too tired to finish this and iron out the bugs
the main concept works, and there is only one bug that I can find.
On selection start, when moving the cursor diagonally up to the right, the selection
will be inverted, but if you flip the box once, it will work again.
I will find a fix for this shit later i guess..

THIS IS FIXED ^^ 

*/
var selectProperties = {anchor: {x:0, y:0}, mirrored: {x: false, y: false}};



function enableSelecting() {
    //Temporarily disabled, might be deprecated and removed later who knows
    /*
    document.body.addEventListener("mousedown", function(e) {
    //Get the mousedown coordinates
    var x = e.x;
    var y = e.y;
        if(e.target.closest(".scrubber") && !draggingState.toTimeline && !draggingState.inTimeline) {
            selectProperties.anchor.x = x;
            selectProperties.anchor.y = y;
            activateTimelineSelection();
        }
    });
    */
}
var oldSelectorWidth = 1;
var oldSelectorHeight = 1;
function activateTimelineSelection() {
    document.body.addEventListener("mousemove", handleSelectionMove);
    document.body.addEventListener("mouseup", handleSelectionEnd);

    oldSelectorHeight = 1;
    oldSelectorWidth = 1;
    selectProperties.mirrored = {x: false, y: false};
}   



var handleSelectionMove = (e) => {
    if(!document.getElementById("selection-box")) {
        var selectionBox = document.createElement("div");
        selectionBox.id = "selection-box";
        selectionBox.style.left = selectProperties.anchor.x + "px";
        selectionBox.style.top = selectProperties.anchor.y + "px";
        selectionBox.style.height = "0px";
        selectionBox.style.width = "0px";
        document.body.appendChild(selectionBox);
    }
    var box = document.getElementById("selection-box");
    var h = parseInt(box.style.height.split("px")[0]);
    var w = parseInt(box.style.width.split("px")[0]);

    var mX = e.x;
    var mY = e.y;

    var wishedWidth = mX-selectProperties.anchor.x;
    var wishedHeight = mY-selectProperties.anchor.y;
    //console.log(wishedHeight/Math.abs(wishedHeight),oldSelectorHeight/Math.abs(oldSelectorHeight))
    if(wishedHeight != 0) {

        if(wishedHeight/Math.abs(wishedHeight) != oldSelectorHeight/Math.abs(oldSelectorHeight)) {
            var sH = window.innerHeight;
            if(!selectProperties.mirrored.y) {
                box.style.bottom = (sH-selectProperties.anchor.y) + "px";
                box.style.top = "";
            } else {
                box.style.top = selectProperties.anchor.y + "px";
                box.style.bottom = "";
            }
            selectProperties.mirrored.y = !selectProperties.mirrored.y;
        }
    }
    if(wishedWidth != 0) {

        if(wishedWidth/Math.abs(wishedWidth) != oldSelectorWidth/Math.abs(oldSelectorWidth)) {
            var sW = window.innerWidth;
            if(!selectProperties.mirrored.x) {

                box.style.right = (sW-selectProperties.anchor.x) + "px";
                box.style.left = ""
            } else {
                box.style.left = selectProperties.anchor.x + "px";
                box.style.right = "";
            }
            selectProperties.mirrored.x = !selectProperties.mirrored.x;
        }
    }

    if(wishedHeight != 0) {
        oldSelectorHeight = wishedHeight;
    }
    if(wishedWidth != 0) {
        oldSelectorWidth = wishedWidth;
    }


    box.style.height = Math.abs(wishedHeight) + "px";
    box.style.width = Math.abs(wishedWidth) + "px";
}

var handleSelectionEnd = (e) => {
    document.body.removeEventListener("mousemove", handleSelectionMove);
    document.body.removeEventListener("mouseup", handleSelectionEnd);
    if(document.getElementById("selection-box")) {
        var box = document.getElementById("selection-box");
        box.parentNode.removeChild(box)
    }
}