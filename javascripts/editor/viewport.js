
var slideshowPlaying = false;


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
            } else if(type == "widget") {
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
        if(!isPackaged) {
            el.src = "./extraResources/data/files/images/" + name;
            console.log(el.src);
        } else {
            el.src=path.join(path.dirname(__dirname), "extraResources", "data", "files", "images", name);
        }

        var borderRadius = data.config.borderRadius;
        var opacity = data.config.opacity;
        var shadowMultiplier = data.config.shadowMultiplier;
        var blur = data.config.blur;
        var position = data.config.position;
        var heights = data.config.size.height;
        var widths = data.config.size.width;
        var display = data.config.display ? "block" : "none";
        
        el.style = `
            z-index: ` + zIndex + `;
            position: absolute;
            top: 0;
            left: 0;
            border-radius: ` + borderRadius + `rem;
            box-shadow: ` + shadowMultiplier + `px ` + shadowMultiplier + `px ` + 1.3*shadowMultiplier + `px 0px rgba(0,0,0,0.75);
            opacity: ` + opacity + `;
            filter: blur(` + blur + `px);
            height: ` + heights + `;
            width: ` + widths + `;
            /*Positioning*/
            left: ` + position[0] + `px;
            top: ` + position[1] + `px;
            display: ` + display + `;
        `;

        viewport.appendChild(el);
        addResizingBorders(el);
        el.addEventListener("dragstart", function(e) {
            e.preventDefault();
        });

    },
    this.widget = function(data) {
        var viewport = document.getElementById("viewport").querySelector("#content").querySelector(".container");

        var widget = createWidget(data.name.split(" ")[0].toLowerCase(), data.config, data.element);
        widget.connectedElement = data.element;
        
        var zIndex = data.zIndex;
        var borderRadius = data.config.borderRadius;
        var opacity = data.config.opacity;
        var shadowMultiplier = data.config.shadowMultiplier;
        var blur = data.config.blur;
        var position = data.config.position;
        var height = data.config.size.height;
        var width = data.config.size.width;
        var display = data.config.display ? "block" : "none";
        var bgColor = data.config.backgroundColor;
        var txtColor = data.config.textColor;
        var fontSize = data.config.fontSize;
        var fontFamily = data.config.fontFamily;
        widget.style = ` 
            position: absolute;
            z-index: ` + zIndex + `;
            border-radius: ` + borderRadius + `rem;
            box-shadow: ` + shadowMultiplier + `px ` + shadowMultiplier + `px ` + 1.3*shadowMultiplier + `px 0px rgba(0,0,0,0.75);
            opacity: ` + opacity + `;
            filter: blur(` + blur + `px);
            height: ` + height + `;
            width: ` + width + `;
            background-color: ` + bgColor + `;
            color: ` + txtColor + `;
            font-family: ` + fontFamily + `;
            /*font-size: ` + fontSize + `px;*/
            display: ` + display + `;

            /*Positioning*/
            left: ` + position[0] + `px;
            top: ` + position[1] + `px;
        `;

        viewport.appendChild(widget);
        addResizingBorders(widget);


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
                var imgs = document.getElementById("viewport").querySelector("#content").querySelector(".container").childNodes;
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
    },
    this.playPauseSlideshow = function() {
        //Check if the slideshow is playing, or if it is paused
        var viewport = document.getElementById("viewport");
        var playing = viewport.isPlaying;

        if(playing) {
            //The program is playing, pause the slideshow
            slideshowPlaying = false;
            viewport.isPlaying = false;
            pauseViewportContent();
        } else {
            //The program is not playing, start the slideshow
            slideshowPlaying = true;
            viewport.isPlaying = true;
            playViewportContent();
        }
    }
}


var playViewportContent = function() {
    var viewport = document.getElementById("viewport");
    var controls = viewport.querySelector(".controls");
    
    controls.querySelector("#play").childNodes[0].innerHTML = "pause_arrow";
}

var pauseViewportContent = function() {
    var viewport = document.getElementById("viewport");
    var controls = viewport.querySelector(".controls");

    controls.querySelector("#play").childNodes[0].innerHTML = "play_arrow";
}






var clickPos = [];
var draggingElement;
var viewportDragFileHandler = function(e) {
    draggingElement.style.left = e.offsetX-clickPos[0] + "px";
    draggingElement.style.top = e.offsetY-clickPos[1] + "px";
}

//Adds resizing borders and move abilities
function addResizingBorders(el) {
    var resizeMargin = 20; //px
    //var topEdge, rightEdge, bottomEdge, leftEdge;

    var grabbing = false;
    var cursorPos = {top: false, right: false, bottom: false, left: false}
    var states = {left: false, topLeft: false, top: false, topRight: false, right: false, bottomRight: false, bottom: false, bottomLeft: false, canMove: false, moving: false, canResize: false, isResizing: false};

    el.addEventListener("mousedown", function(e) {
        clickPos = [e.offsetX, e.offsetY];
        if(states.canMove) {        
            
            //Can grab element (move, not resize)
            draggingElement = el;
            el.style.pointerEvents = "none";
            document.getElementById("viewport").querySelector("#content").querySelector(".container").addEventListener("mousemove", viewportDragFileHandler);
            states.moving = true;
            
            //Disable all pointer events of all viewport elements
            var els = document.getElementById("viewport").querySelector("#content").querySelector(".container").childNodes;
            var x;
            for(x of els) {
                x.style.pointerEvents = "none";
            }

            if(states.canResize) {
                states.isResizing = true;
            }
        }




        //Resize
        if(states.canResize) {
            states.isResizing = true;
            document.body.addEventListener("mousemove", resizeHandler);
        }

    });

    var resizeHandler = function(ev) {
        var height = parseInt(window.getComputedStyle(el).height.split("px"));
        var width = parseInt(window.getComputedStyle(el).width.split("px"));

        //If right edge resizing
        if(states.right) {
            el.style.width = width + ev.movementX + "px";
        } else if(states.bottomRight) {
            el.style.height = ev.movementY + height + "px";
            el.style.width = ev.movementX + width + "px";
        } else if(states.bottom) {
            el.style.width = width + "px";
            el.style.height = height + ev.movementY + "px";
        }

    }


    var mouseUpHandler = function(e) {
        if(states.moving) {
            document.getElementById("viewport").querySelector("#content").querySelector(".container").removeEventListener("mousemove", viewportDragFileHandler);
            states.moving = false;
            el.style.pointerEvents = "";
            
            var left = parseInt(el.style.left.split("px")[0]);
            var top = parseInt(el.style.top.split("px")[0]);
            el.connectedElement.config[0].position = [left, top];

            //Enable all viewport element pointer events 
            var els = document.getElementById("viewport").querySelector("#content").querySelector(".container").childNodes;
            var x;
            for(x of els) {
                x.style.pointerEvents = "";
            }
        } else if(states.canResize && states.isResizing) {
            //End of resizing action
            document.body.removeEventListener("mousemove", resizeHandler);
            states.isResizing = false;
            states.canResize = false;
            //Save new sizing data
            /*var height = parseInt(window.getComputedStyle(el).height.split("px")[0])
            var width = parseInt(window.getComputedStyle(el).width.split("px")[0])*/
            var height = window.getComputedStyle(el).height;
            var width = window.getComputedStyle(el).width;

            el.connectedElement.config[0].size.height = height;
            el.connectedElement.config[0].size.width = width; 
        }
    }


    document.body.addEventListener("mouseup", mouseUpHandler);


    el.addEventListener("mouseleave", function(e) {
        states.canMove = false;
        if(!states.isResizing && !states.moving) {
            document.body.style.cursor = "default";
        }
    })


    el.addEventListener("mousemove", function(e) {
        if(e.target.closest(".viewport-image") && !states.moving && !states.isResizing) {
            var root = e.target.closest(".viewport-image");
            var x = e.offsetX;
            var y = e.offsetY;
            var h = parseInt(window.getComputedStyle(root).height.split("px"));
            var w = parseInt(window.getComputedStyle(root).width.split("px"));
            
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


            var resetTemplate = {left: false, topLeft: false, top: false, topRight: false, right: false, bottomRight: false, bottom: false, bottomLeft: false, canMove: false, moving: false, canResize: false};

            if(cursorPos.left && cursorPos.top && !cursorPos.right && !cursorPos.bottom) {
                //Top left
                document.body.style.cursor = "nw-resize";
                states = resetTemplate;
                states.canResize = true;
                states.topLeft = true;
            } else if(!cursorPos.left && cursorPos.top && !cursorPos.right && !cursorPos.bottom) {
                //Top
                document.body.style.cursor = "n-resize";
                states = resetTemplate;
                states.canResize = true;
                states.top = true;
            } else if(!cursorPos.left && cursorPos.top && cursorPos.right && !cursorPos.bottom) {
                //Top right
                document.body.style.cursor = "ne-resize";
                states = resetTemplate;
                states.canResize = true;
                states.topRight = true;
            } else if(!cursorPos.left && !cursorPos.top && cursorPos.right && !cursorPos.bottom) {
                //Right
                document.body.style.cursor = "e-resize";
                states = resetTemplate;
                states.canResize = true;
                states.right = true;
            } else if(!cursorPos.left && !cursorPos.top && cursorPos.right && cursorPos.bottom) {
                //Bottom right
                document.body.style.cursor = "nw-resize";
                states = resetTemplate;
                states.canResize = true;
                states.bottomRight = true;
            } else if(!cursorPos.left && !cursorPos.top && !cursorPos.right && cursorPos.bottom) {
                //Bottom
                states = resetTemplate;
                document.body.style.cursor = "n-resize";
                states.canResize = true;
                states.bottom = true;
            } else if(cursorPos.left && !cursorPos.top && !cursorPos.right && cursorPos.bottom) {
                //Bottom left
                document.body.style.cursor = "ne-resize";
                states = resetTemplate;
                states.canResize = true;
                states.bottomLeft = true;
            } else if(cursorPos.left && !cursorPos.top && !cursorPos.right && !cursorPos.bottom) {
                //Left
                document.body.style.cursor = "e-resize";
                states = resetTemplate;
                states.canResize = true;
                states.left = true;
            } else {
                //Move cursor
                document.body.style.cursor = "grab";
                states = resetTemplate;
                states.canMove = true;
            }



            //e.target.style.cursor = "e-resize";
            //e.target.style.cursor = "n-resize";
            //e.target.style.cursor = "move"
        }
    })
}




