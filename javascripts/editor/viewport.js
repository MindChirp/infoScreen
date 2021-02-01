
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
        var el = document.createElement("div");
        var img = document.createElement("img");
        el.appendChild(img);
        el.connectedElement = data.element;
        var zIndex = data.zIndex;
        var name = data.name;
        el.className = "viewport-image";
        if(!isPackaged) {
            img.src = "./extraResources/data/files/images/" + name;
        } else {
            img.src=path.join(path.dirname(__dirname), "extraResources", "data", "files", "images", name);
        }

        var borderRadius = data.config.borderRadius;
        var opacity = data.config.opacity;
        var shadowMultiplier = data.config.shadowMultiplier;
        var blur = data.config.blur;
        var position = data.config.position;
        var heights = data.config.size.height;
        var widths = data.config.size.width;
        var display = data.config.display ? "block" : "none";
        
        img.style = `
            height: 100%;
            width: 100%;
            border-radius: ` + borderRadius + `rem;
            
        `;

        el.style = `
            z-index: ` + zIndex + `;
            position: absolute;
            /*overflow: hidden;*/
            top: 0;
            left: 0;
            border-radius: ` + borderRadius + `rem;
            box-shadow: ` + shadowMultiplier + `px ` + shadowMultiplier + `px ` + 1.3*shadowMultiplier + `px 0px rgba(0,0,0,0.75);
            opacity: ` + opacity + `;
            filter: blur(` + blur + `px);
            height: ` + heights + `;
            width: ` + widths + `;
            /*Positioning*/
            left: ` + position[0] + `;
            top: ` + position[1] + `;
            display: ` + display + `;
            cursor: grab;

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
            left: ` + position[0] + `;
            top: ` + position[1] + `;
        `;

        viewport.appendChild(widget);
        addResizingBorders(widget);


    },
    this.movie = function(data) {
        var viewport = document.getElementById("viewport").querySelector("#content").querySelector(".container");
        var name = data.name;
        var el = document.createElement("div");
        el.connectedElement = data.element;
        el.className = "viewport-image";
        var vid = document.createElement("video");
        vid.style = `
            height: 100%;
            width: 100%;
            object-fit: fill;
        `;
        var srcEl = document.createElement("source");

        if(!isPackaged) {
            srcEl.src = "./extraResources/data/files/images/" + name;
        } else {
            srcEl.src=path.join(path.dirname(__dirname), "extraResources", "data", "files", "images", name);
        }


        vid.appendChild(srcEl);
        el.appendChild(vid);
        var zIndex = data.zIndex;
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
            left: ` + position[0] + `;
            top: ` + position[1] + `;
            display: ` + display + `;
        `;


        addResizingBorders(el);

        viewport.appendChild(el);
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

        
    //Listen for mouse click



    var enableBorders = () => {
        setTimeout(() => {

        if(document.getElementsByClassName("resizing-border-container")[0]) return;
        var border = document.createElement("div");
        border.style = `
            height: 100%;
            width: 100%;
            background-color: transparent;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 100;
            border: 1px solid rgb(200,200,200);
            padding: 0;
        `;
        border.className ="resizing-border-container";

        var mTop = document.createElement("div");
        mTop.className = "positioner";

        var lTop = document.createElement("div");
        lTop.className = "positioner";

        var rTop = document.createElement("div");
        rTop.className = "positioner";

        var mLeft = document.createElement("div");
        mLeft.className = "positioner";

        var lBottom = document.createElement("div");
        lBottom.className = "positioner";
        
        var mBottom = document.createElement("div");
        mBottom.className = "positioner";

        var rBottom = document.createElement("div");
        rBottom.className = "positioner";

        var mRight = document.createElement("div");
        mRight.className = "positioner";
        
        border.appendChild(lTop);
        border.appendChild(mTop);
        border.appendChild(rTop);
        border.appendChild(mLeft);
        border.appendChild(lBottom);
        border.appendChild(mBottom);
        border.appendChild(rBottom);
        border.appendChild(mRight);

        el.appendChild(border);



        //Hide the viewport controls
        var controls = document.querySelector('#viewport > div.controls');
        controls.style.transition = "300ms all ease-in-out";
        controls.style.opacity = 0.1;
        controls.style.pointerEvents = "none";



        rBottom.addEventListener("mousedown", r1);
        mRight.addEventListener("mousedown", r2);
        mBottom.addEventListener("mousedown", r3);

        setTimeout(() => {
            document.body.addEventListener("click", disableBorder);
        }, 100)


    }, 10)
        
    }


    var disableBorder = (e) => {
        if(e.target.closest(".viewport-image") != el) {
            if(document.getElementsByClassName("resizing-border-container")[0]) {
                document.getElementsByClassName("resizing-border-container")[0].parentNode.removeChild(document.getElementsByClassName("resizing-border-container")[0])
            }
            document.body.removeEventListener("click", disableBorder);
            var controls = document.querySelector('#viewport > div.controls');
            controls.style.opacity = 1;
            controls.style.pointerEvents = "";

        }
    } 



    var move = function(e) {
        var cursorGrabbing = [e.offsetX, e.offsetY];

        var container = viewport.querySelector(".container");
        var el = e.target.closest(".viewport-image");

        var oldPos = [el.style.left, el.style.top];
        var newPos;


        //Disable all viewport elements
        var vEls = document.getElementsByClassName("viewport-image");
        var x;
        for(x of vEls) {
            x.style.pointerEvents = "none";
        }

        var mouseMove = (e) => {
            var x = e.offsetX;
            var y = e.offsetY;
            el.style.top = y-cursorGrabbing[1] + "px";
            el.style.left = x-cursorGrabbing[0] + "px";
        }

        var mouseUp = (e) => {
            document.body.removeEventListener("mouseup", mouseUp);
            container.removeEventListener("mousemove", mouseMove)

            //enable all viewport elements
            var vEls = document.getElementsByClassName("viewport-image");
            var x;
            for(x of vEls) {
                x.style.pointerEvents = "";
            }

            var xPos = el.style.left.split("px")[0];
            var yPos = el.style.top.split("px")[0];
            var percents = convertPxToPercent([xPos, yPos]);

            el.connectedElement.config[0].position[0] = percents[0] + "%";
            el.connectedElement.config[0].position[1] = percents[1] + "%";
            var newPos = [el.style.left, el.style.top];
            if(oldPos[0] == newPos[0] && oldPos[1] == newPos[1]) {
                //Element has not been moved, show the resize borders instead
                enableBorders();
            }
        }

        document.body.addEventListener("mouseup", mouseUp);
        container.addEventListener("mousemove", mouseMove);

    }


    var r1 = (e) => {
        e.stopPropagation();
        //rBottom
        var height = parseInt(window.getComputedStyle(e.target.closest(".viewport-image")).height.split("px")[0]);
        var width = parseInt(window.getComputedStyle(e.target.closest(".viewport-image")).width.split("px")[0]);
        var element = e.target.closest(".viewport-image");
        var border = document.getElementsByClassName("resizing-border-container")[0]
        var trackedHeight = height;
        var trackedWidth = width;

        var dot = e.target;
        document.body.style.cursor = "crosshair";
        dot.style.cursor = "crosshair";
        border.style.opacity = "0";

        var properties = {bottom: false, right: false}
        var handleMove = (e) => {
            //Figure out wether mouse is on bottom or right side of element
            var rightEdge = parseInt(element.style.left.split("px")[0]) + parseInt(window.getComputedStyle(element).width.split("px")[0]);        
            if(element.getElementsByTagName("img")[0]) {
                element.getElementsByTagName("img")[0].style.width = "100%";
            }
            trackedHeight = trackedHeight + e.movementY;
            trackedWidth = trackedWidth + e.movementX;

            element.style.height = trackedHeight + "px";
            element.style.width = trackedWidth + "px";
        }

        var handleUp = (e) => {
            document.body.removeEventListener("mouseup", handleUp);
            document.body.removeEventListener("mousemove", handleMove);
            document.body.style.cursor = "default";
            border.style.opacity = "1"
            dot.setAttribute("style", "cursor: nw-resize");



            el.connectedElement.config[0].size.height = element.style.height;
            el.connectedElement.config[0].size.width = element.style.width;
        }

        document.body.addEventListener("mousemove", handleMove);
        document.body.addEventListener("mouseup", handleUp);
    }


    var r2 = (e) => {
        e.stopPropagation();
        //mRight
        var height = parseInt(window.getComputedStyle(e.target.closest(".viewport-image")).height.split("px")[0]);
        var width = parseInt(window.getComputedStyle(e.target.closest(".viewport-image")).width.split("px")[0]);
        var element = e.target.closest(".viewport-image");
        var border = document.getElementsByClassName("resizing-border-container")[0]
        var trackedHeight = height;
        var trackedWidth = width;
        var dot = e.target;
        document.body.style.cursor = "crosshair";
        dot.style.cursor = "crosshair";
        border.style.opacity = "0"
        var handleMove = (e) => {
            //Figure out wether mouse is on bottom or right side of element
            if(element.getElementsByTagName("img")[0]) {
                element.getElementsByTagName("img")[0].style.width = "100%";
            }

            trackedWidth = trackedWidth + e.movementX;

            element.style.width = trackedWidth + "px";
        }

        var handleUp = (e) => {
            document.body.removeEventListener("mouseup", handleUp);
            document.body.removeEventListener("mousemove", handleMove);
            document.body.style.cursor = "default";
            border.style.opacity = "1"
            dot.setAttribute("style", "cursor: w-resize");
            el.connectedElement.config[0].size.height = element.style.height;
            el.connectedElement.config[0].size.width = element.style.width;
        }

        document.body.addEventListener("mousemove", handleMove);
        document.body.addEventListener("mouseup", handleUp);
    }


    var r3 = (e) => {
        e.stopPropagation();
        //mBottom
        var height = parseInt(window.getComputedStyle(e.target.closest(".viewport-image")).height.split("px")[0]);
        var width = parseInt(window.getComputedStyle(e.target.closest(".viewport-image")).width.split("px")[0]);
        var element = e.target.closest(".viewport-image");
        element.style.width = width + "px";
        var border = document.getElementsByClassName("resizing-border-container")[0]
        var trackedHeight = height;
        var dot = e.target;
        document.body.style.cursor = "crosshair";
        dot.style.cursor = "crosshair";
        border.style.opacity = "0"
        var handleMove = (e) => {
            //Figure out wether mouse is on bottom or right side of element
            if(element.getElementsByTagName("img")[0]) {
                element.getElementsByTagName("img")[0].style.width = "100%";
            }
            trackedHeight = trackedHeight + e.movementY;

            element.style.height = trackedHeight + "px";
        }

        var handleUp = (e) => {
            document.body.removeEventListener("mouseup", handleUp);
            document.body.removeEventListener("mousemove", handleMove);
            document.body.style.cursor = "default";
            border.style.opacity = "1"
            dot.setAttribute("style", "cursor: n-resize");
            el.connectedElement.config[0].size.height = element.style.height;
            el.connectedElement.config[0].size.width = element.style.width;

        }

        document.body.addEventListener("mousemove", handleMove);
        document.body.addEventListener("mouseup", handleUp);
    }

    //el.addEventListener("click", enableBorders);
    el.addEventListener("mousedown", move);

}


function convertPxToPercent([x,y]) {
    //Get the viewport size
    var viewport = document.querySelector('#content > div');
    var xWidth = parseInt(window.getComputedStyle(viewport).width.split("px")[0]);
    var yHeight = parseInt(window.getComputedStyle(viewport).height.split("px")[0]);

    var xP = (parseInt(x)/xWidth)*100;
    var yP = (parseInt(y)/yHeight)*100;

    return [xP.toFixed(2), yP.toFixed(2)]; //Return only numbers rounded to two decimal places

}




