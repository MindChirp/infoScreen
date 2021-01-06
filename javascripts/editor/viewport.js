const { isPackaged } = require("electron-is-packaged");

const renderer = new RenderingToolKit()

function viewportSettings() {
    var el = document.getElementById("viewport").querySelector(".settings-bar");
    el.style.display = "block";
}

function closeViewportSettings(el) {
    el.parentNode.parentNode.style.display = "none";
}

var settings = document.getElementById("viewport").querySelector(".settings-bar").querySelector(".content").getElementsByClassName("select");
settings[0].addEventListener("change", function() {
    var val = settings[0].childNodes[0].value;
    ratio = val.split(":")[0] / val.split(":")[1];
    calculateViewportSize();

})

settings[1].addEventListener("change", function() {
    var val = settings[1].childNodes[0].value;
    if(val != "Blue"){
        document.getElementById("viewport").querySelector("#content").style.backgroundColor = val;
    } else if(val == "Blue") {
        document.getElementById("viewport").querySelector("#content").style.backgroundColor = "#4da0ff";
    }
    if(val.toLowerCase() == "white") {
        document.getElementById("viewport").querySelector(".settings-button").childNodes[0].style.color = "black";
        document.getElementById("viewport").setAttribute("style", "background-color: var(--light-shade);")
    } else {
        document.getElementById("viewport").querySelector(".settings-button").childNodes[0].style.color = "white";
        document.getElementById("viewport").setAttribute("style", "background-color: var(--dark-shade);")

    }
});


//Handle the progress bar background colors etc. 
var bar = document.getElementById("viewport").querySelector(".fd-slider");
var mouseDownOnProgressBar;
bar.addEventListener("mousedown", function(e) {
    mouseDownOnProgressBar = true;

    //Update the progress bar if it is only clicked, and not dragged
    setTimeout(function() {
        e.target.style.backgroundImage = "-webkit-gradient(linear, left top, right top, color-stop(" + e.target.value + "%, var(--slider-color)), color-stop(" + e.target.value + "%, var(--slider-disabled-color)))";
    }, 10)
});
bar.addEventListener("change", function(e) {
    e.target.style.backgroundImage = "-webkit-gradient(linear, left top, right top, color-stop(" + e.target.value + "%, var(--slider-color)), color-stop(" + e.target.value + "%, var(--slider-disabled-color)))";
})
bar.addEventListener("mouseup", function(e) {
    mouseDownOnProgressBar = false;
})
bar.addEventListener("mousemove", function(e) {
    if(mouseDownOnProgressBar) {
        //Update the progress bar if it is only dragged, and not clicked
        e.target.style.backgroundImage = "-webkit-gradient(linear, left top, right top, color-stop(" + e.target.value + "%, var(--slider-color)), color-stop(" + e.target.value + "%, var(--slider-disabled-color)))";
    }
});


////////////////////////////////
// Render the selected column //
////////////////////////////////

//renderer --> RenderingToolKit()
function renderColumn(col) {
    //console.log("RENDERING COLUMN " + parseInt(col + 1));
    //Get the rows
    var viewport = document.getElementById("viewport").querySelector("#content").querySelector(".container");
    viewport.innerHTML = "";
    var rows = document.getElementsByClassName("timeline-column")[col].childNodes;
    
    //Create indexation array
    var indexes = [];

    for(let i = 0; i < rows.length; i++) {
        if(rows[i].hasChildNodes()) {
            //Gather information about the element
            var x = rows[i].querySelector(".scrubber-element");
            var type = x.getAttribute("type");
            var name;
            if(type == "img" || type == "vid") {
                name = x.getAttribute("filename");
            }

            var zIndex = i+1;

            //Push each element in the column to the indexation array with all the nescessary information
            indexes.push([{type: type, name: name, zIndex: zIndex, element: x, config: x.config[0]}])
        }
    }



    //Go through the indexes array, and handle each element correctly

    var viewport = document.getElementById("viewport").querySelector("#content").querySelector(".container");
    
    var x;
    for(x of indexes) {
        if(x[0].type == "img") {
            renderer.image(x[0], isPackaged);
        } else if(x[0].type == "vid") {
            renderer.movie(x[0], isPackaged);
        } else if(x[0].type == "widget") {
            renderer.widget(x[0], isPackaged);
        }
    }

}

function RenderingToolKit() {
    this.image = function(data, packaged) {
        var viewport = document.getElementById("viewport").querySelector("#content").querySelector(".container");
        //Render image to the viewport
        var el = document.createElement("img");
        el.connectedElement = data.element;
        var zIndex = data.zIndex;
        var name = data.name;
        el.className = "viewport-image";
        if(!packaged) {
            el.src = "./extraResources/data/files/" + name;
        } else {
            el.src=path.join(path.dirname(__dirname), "extraResources", "data", "files", name);
        }

        var borderRadius = data.config.borderRadius;
        var opacity = data.config.opacity;
        var shadowMultiplier = data.config.shadowMultiplier;
        var blur = data.config.blur;
        var position = data.config.position;
        el.style = `
            z-index: ` + zIndex + `;
            position: absolute;
            top: 0;
            left: 0;
            border-radius: ` + borderRadius + `rem;
            box-shadow: ` + shadowMultiplier + `px ` + shadowMultiplier + `px ` + 1.3*shadowMultiplier + `px 0px rgba(0,0,0,0.75);
            opacity: ` + opacity + `;
            filter: blur(` + blur + `px);
            height: 30%;
            width: auto;
            /*Positioning*/
            left: ` + position[0] + `px;
            top: ` + position[1] + `px;
        `;

        viewport.appendChild(el);
        addResizingBorders(el);
        el.addEventListener("dragstart", function(e) {
            e.preventDefault();
        });

    },
    this.widget = function(data) {

    },
    this.movie = function(data) {

    },
    this.unrender = function(timeLineFile) {
        //Unrender a passed element from the viewport, if the parent column is
        //being displayed

        //Get the parent column
        var timeLineFile = timeLineFile.closest(".scrubber-element");
        var column = timeLineFile.closest(".timeline-column");
        if(column) {
            if(column.getAttribute("displaying") == "true") {
                //Get all the images in the viewport
                var imgs = document.getElementById("viewport").querySelector("#content").querySelector(".container").getElementsByTagName("img");
                var x;
                for(x of imgs) {
                    if(x.connectedElement == timeLineFile) {
                        x.parentNode.removeChild(x);
                    }
                }
            }
        }
    },
    this.isRendered = function(timeLineFile) {
        if(timeLineFile.closest(".timeline-column")) {
            if(timeLineFile.closest(".timeline-column").getAttribute("displaying") == "true") {
                return true;
            } 
            return false;
        }
    },
    this.renderedColumn = function() {
        var cols = document.getElementsByClassName("timeline-column");
        for(var i = 0; i < cols.length; i++) {
            if(cols[i].getAttribute("displaying") == "true") {
                return i;
            }
        }
        return undefined;
    }
}

var clickPos = [];
var draggingElement;
var viewportDragFileHandler = function(e) {
    console.log(e.offsetX);
    draggingElement.style.left = e.offsetX-clickPos[0] + "px";
    draggingElement.style.top = e.offsetY-clickPos[1] + "px";
}

//Adds resizing borders and move abilities
function addResizingBorders(el) {
    var resizeMargin = 20; //px
    //var topEdge, rightEdge, bottomEdge, leftEdge;

    var grabbing = false;
    var cursorPos = {top: false, right: false, bottom: false, left: false}
    var states = {left: false, topLeft: false, top: false, topRight: false, right: false, bottomRight: false, bottom: false, bottomLeft: false, canMove: false, moving: false}

    el.addEventListener("mousedown", function(e) {
        clickPos = [e.offsetX, e.offsetY];

        if(states.canMove) {
            //Can grab element
            draggingElement = el;
            el.style.pointerEvents = "none";
            document.getElementById("viewport").querySelector("#content").querySelector(".container").addEventListener("mousemove", viewportDragFileHandler);
            states.moving = true;
        }

    });

    document.body.addEventListener("mouseup", function(e) {
        document.getElementById("viewport").querySelector("#content").querySelector(".container").removeEventListener("mousemove", viewportDragFileHandler);
        states.moving = false;
        el.style.pointerEvents = "";

        var left = parseInt(el.style.left.split("px")[0]);
        var top = parseInt(el.style.top.split("px")[0]);
        el.connectedElement.config.position = [left, top];
        console.log(el.connectedElement.config);

    })

    el.addEventListener("mouseleave", function(e) {
        states.canMove = false;
    })


    el.addEventListener("mousemove", function(e) {
        if(e.target.className == "viewport-image" && !states.moving) {
            var x = e.offsetX;
            var y = e.offsetY;
            var h = e.target.height;
            var w = e.target.width;
            


            if(x < resizeMargin) {
                //Left side
                cursorPos.left = true;
                states.canMove = false;
            } else {
                cursorPos.left = false;
            } 
            
            if((w-x) < resizeMargin) {
                //Right side
                cursorPos.right = true;
                states.canMove = false;
            } else {
                cursorPos.right = false;
            }

            if(y < resizeMargin) {
                //Top side
                cursorPos.top = true;
                states.canMove = false;
            } else {
                cursorPos.top = false;
            } 
            
            if((h-y) < resizeMargin) {
                //Bottom side
                cursorPos.bottom = true;
                states.canMove = false;
            } else {
                cursorPos.bottom = false;
            }


            if(cursorPos.left && cursorPos.top && !cursorPos.right && !cursorPos.bottom) {
                e.target.style.cursor = "nw-resize";
            } else if(!cursorPos.left && cursorPos.top && !cursorPos.right && !cursorPos.bottom) {
                e.target.style.cursor = "n-resize";
            } else if(!cursorPos.left && cursorPos.top && cursorPos.right && !cursorPos.bottom) {
                e.target.style.cursor = "ne-resize";
            } else if(!cursorPos.left && !cursorPos.top && cursorPos.right && !cursorPos.bottom) {
                e.target.style.cursor = "e-resize";
            } else if(!cursorPos.left && !cursorPos.top && cursorPos.right && cursorPos.bottom) {
                e.target.style.cursor = "nw-resize";
            } else if(!cursorPos.left && !cursorPos.top && !cursorPos.right && cursorPos.bottom) {
                e.target.style.cursor = "n-resize";
            } else if(cursorPos.left && !cursorPos.top && !cursorPos.right && cursorPos.bottom) {
                e.target.style.cursor = "ne-resize";
            } else if(cursorPos.left && !cursorPos.top && !cursorPos.right && !cursorPos.bottom) {
                e.target.style.cursor = "e-resize";
            } else {
                //Move cursor
                e.target.style.cursor = "grab";
                states.canMove = true;
            }



            //e.target.style.cursor = "e-resize";
            //e.target.style.cursor = "n-resize";
            //e.target.style.cursor = "move"
        }
    })
}




