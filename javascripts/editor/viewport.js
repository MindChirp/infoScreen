const { ensureLink } = require("fs-extra");

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
        e.target.style.backgroundImage = "-webkit-gradient(linear, left top, right top, color-stop(" + e.target.value/10 + "%, var(--slider-color)), color-stop(" + e.target.value/10 + "%, var(--slider-disabled-color)))";
    }, 10)
});
bar.addEventListener("change", function(e) {
    e.target.style.backgroundImage = "-webkit-gradient(linear, left top, right top, color-stop(" + e.target.value/10 + "%, var(--slider-color)), color-stop(" + e.target.value/10 + "%, var(--slider-disabled-color)))";
})
bar.addEventListener("mouseup", function(e) {
    mouseDownOnProgressBar = false;
})
bar.addEventListener("mousemove", function(e) {
    if(mouseDownOnProgressBar) {
        //Update the progress bar if it is only dragged, and not clicked
        e.target.style.backgroundImage = "-webkit-gradient(linear, left top, right top, color-stop(" + e.target.value/10 + "%, var(--slider-color)), color-stop(" + e.target.value/10 + "%, var(--slider-disabled-color)))";
    }
});


////////////////////////////////
// Render the selected column //
////////////////////////////////

//renderer --> RenderingToolKit()
function renderColumn(col) {
    //console.log("RENDERING COLUMN " + parseInt(col + 1));
    //Get the rows

    //Update the second monitor as well
    updateFullscreenView()

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
            indexes.push([{type: type, name: name, zIndex: zIndex, element: x, config: x.config}])
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
    this.image = async function(data, packaged) {
        var viewport = document.getElementById("viewport").querySelector("#content").querySelector(".container");
        //Render image to the viewport
        var el = document.createElement("div");
        var metaCont = document.createElement("div");
        metaCont.style = `
            position: absolute;
            height: fit-content;
            width: fit-content;
            bottom: 0.5rem;
            left: 0.5rem;
        `;
        el.appendChild(metaCont);
        var id;
        var metaStyle = `
            height: fit-content;
            width: fit-content;
            opacity: 0.7;
            display: inline-block;
            font-weight: lighter;
            font-size: 0.6rem;
            margin: 0;
            z-index: 2;
            background-color: white;
            padding: 0 0.5rem;
            color: black;
            border-radius: 0.25rem;
        `
        if(data.config.identification != null) {
            id = document.createElement("p");
            id.style = metaStyle
            id.innerHTML = data.config.identification;
            metaCont.appendChild(id);
        }

        if(!data.config.keepAspectRatio) {
            aspMsg = document.createElement("p");
            aspMsg.style = metaStyle
            aspMsg.innerHTML = "Aspect ratio unlocked";
            metaCont.appendChild(aspMsg);
        }

        var img = document.createElement("img");
        el.appendChild(img);
        el.connectedElement = data.element;
        var zIndex = data.zIndex;
        var name = data.name;
        el.className = "viewport-image";


        //Create an element to get the proper aspect ratio from
        var asp;
        await async function() {
            return new Promise((resolve, reject)=>{
                asp = document.createElement("img");


                if(!isPackaged) {
                    img.src = "./extraResources/data/files/images/" + name;
                    asp.src = "./extraResources/data/files/images/" + name;
                } else {
                    img.src=path.join(path.dirname(__dirname), "extraResources", "data", "files", "images", name);
                    asp.src=path.join(path.dirname(__dirname), "extraResources", "data", "files", "images", name);
                }

                asp.onload = function() {
                    resolve();
                }

                asp.onerror = function(err) {
                    reject(err);
                }
            })
        }();


        var Awidth = asp.width;
        var Aheight = asp.height;
        
        var keepAsp = data.config.keepAspectRatio;
        var aspectRatio = Awidth/Aheight;

        var xEdge = data.config.edgeAnchors.x;
        var yEdge = data.config.edgeAnchors.y;
        
        var left;
        var right;
        var top;
        var bottom;
        if(xEdge == "left") {
            left = data.config.position[0];
            right = "auto";
        } else {
            left = "auto";
            right = data.config.position[0];
        }

        if(yEdge == "top") {
            top = data.config.position[1];
            bottom = "auto";
        } else {
            top = "auto";
            bottom = data.config.position[1];
        }

        var borderRadius = data.config.borderRadius;
        var opacity = data.config.opacity;
        var shadowMultiplier = data.config.shadowMultiplier;
        var blur = data.config.blur;
        var position = data.config.position;
        var widths;
        if(data.config.size.width == "keepAspectRatio") {
            //Alter the asp image element to have the correct height
            
            //Get the viewport height
            var viewport = document.querySelector("#content > div");
            var height = parseInt(window.getComputedStyle(viewport).height.split("px")[0]);
            
            //Get the correct height value
            var corrHeight = height*parseInt(data.config.size.height.split("%")[0])/100;
            asp.height = corrHeight;
            var Awidth = asp.height*aspectRatio;
            console.log(Awidth);
            
            //Convert the value to percent
            var converted = convertPxToPercent([Awidth,0])
            widths = converted[0] + "%";
            console.log(widths)
        } else {
            widths = data.config.size.width;
        }
        
        var heights;
        if(keepAsp) {
            heights = parseInt(widths.split("px")[0])/aspectRatio;
        } else {
            heights = data.config.size.height;
        }
        var display = data.config.display ? "block" : "none";
        
        img.style = `
            height: 100%;
            width: 100%;
            height: 100%;
            display: block;
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
            left: ` + left + `;
            top: ` + top + `;
            right: ` + right + `;
            bottom: ` + bottom + `;
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
        var bgOpacity = data.config.backgroundOpacity;
        var txtColor = data.config.textColor;
        var fontSize = data.config.fontSize;
        var fontFamily = data.config.fontFamily;

        //Get the area of the widget
        var area = parseInt(height.split("%")[0])*parseInt(width.split("%")[0]);
        var size = area*fontSize/100;
        var downScale = size/200 + "px";

        widget.style = ` 
            position: absolute;
            z-index: ` + zIndex + `;
            border-radius: ` + borderRadius + `rem;
            box-shadow: ` + shadowMultiplier + `px ` + shadowMultiplier + `px ` + 1.3*shadowMultiplier + `px 0px rgba(0,0,0,0.75);
            opacity: ` + opacity + `;
            filter: blur(` + blur + `px);
            height: ` + height + `;
            width: ` + width + `;
            background-color: ` + bgColor + bgOpacity + `;
            color: ` + txtColor + `;
            font-family: ` + downScale + `;
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
    },
    this.numberOfColumns = function() {
        var cols = document.getElementsByClassName("timeline-column");
        var x;
    
        var contentCols = [];
    
        for(x of cols) {
            if(x.getElementsByClassName("scrubber-element")[0]) {
                contentCols.push(x);
            }
        }
        return contentCols.length;
    }
}

var playInterval;

var playViewportContent = function() {
    var viewport = document.getElementById("viewport");
    var controls = viewport.querySelector(".controls");

    var seconds;
    var updateTimer = () => {
        //Get the column settings
        var cols = document.getElementsByClassName("timeline-column");
        var index = renderer.renderedColumn();
        var time = cols[index].getAttribute("time");
        var secs = time.split(":")[1];
        var mins = time.split(":")[0];

        //Translate everything into seconds
        var totalSecs = parseInt(secs) + parseInt(mins)*60;
        clearInterval(playInterval);
        seconds = totalSecs;
        activateInterval();
    }

    updateTimer();

    controls.querySelector("#play").childNodes[0].innerHTML = "pause_arrow";

    var event = new Event("change");
    var progBar = document.querySelector("#viewport > div.controls > input");
    var i = progBar.value;


    function activateInterval() {
        playInterval = setInterval(()=> {
            i = parseInt(progBar.value) + 1;
            progBar.value = i;
            progBar.dispatchEvent(event);
            if(i==1000) {
                //End of slide reached, go over to the next one
                activateColumnNo(null, 1);
                updateTimer();
                progBar.value = 0;
            }
        }, seconds);
    }

    var data = {routingInformation: {forwardingName: "slide-active"}, forwardingInformation: {timestamp: "00:00"}}
    var response = ipcRenderer.sendSync("inter-renderer-communication", data);

}

var pauseViewportContent = function() {
    var viewport = document.getElementById("viewport");
    var controls = viewport.querySelector(".controls");

    controls.querySelector("#play").childNodes[0].innerHTML = "play_arrow";
    clearInterval(playInterval);

    var data = {routingInformation: {forwardingName: "slide-unactive"}, forwardingInformation: {timestamp: "00:00"}}
    var response = ipcRenderer.sendSync("inter-renderer-communication", data);
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


    var pos;
    var leftT;
    var topT;

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


        //Convert different values over to px only
        var units = [
            "px",
            "%",
            "rem"
        ];

        console.log(el.connectedElement.config.position);

        var xInPx;
        var yInPx;
        for(let i = 0; i < units.length; i++) {
            var posX = el.connectedElement.config.position[0];
            var posY = el.connectedElement.config.position[1];
            if(posX.includes(units[i])) {
                var x = posX.split(units[i])[0];
                xInPx = convertToPixels([x, 0], units[i])[0];
            }
            if(posY.includes(units[i])) {
                var y = posY.split(units[i])[0];
                yInPx = convertToPixels([0, y], units[i])[1];
            }
        }

        pos = [xInPx, yInPx];
        console.log(pos)
        leftT = parseInt(pos[0]);
        topT = parseInt(pos[1]);


        document.body.addEventListener("keydown", handleArrowMove);
        document.body.addEventListener("keyup", handleArrowMoveRelease);


    }, 10)
        
    }
    var accTimeout;
    var accelerator = 1;
    var handleArrowMove = (e) => {
        accTimeout = setTimeout(()=>{
            accelerator = 3;
        }, 1000);
        var c = e.keyCode;
        if(c == 37) /*left*/ {
            el.style.left = leftT - 1*accelerator + "px";
            leftT = leftT-1*accelerator;
        } else if(c == 38) /*Up*/ {
            el.style.top = topT - 1*accelerator + "px";
            topT = topT-1*accelerator;
        } else if(c == 39) /*Right*/ {
            el.style.left = leftT + 1*accelerator + "px";
            leftT = leftT+1*accelerator;
        } else if(c == 40) /*Down*/ {
            el.style.top = topT + 1*accelerator + "px";
            topT = topT+1*accelerator;
        }
    }

    var handleArrowMoveRelease = (e) => {
        var regexN = /[0-9]/g;
        var regexC = /[^\d.-]/g;
        
        var xPos = el.style.left;
        var yPos = el.style.top; //These values can be of any type, really.
        
        var unitX = xPos.replaceAll(regexN,'').replace(/\./g, "");
        var unitY = yPos.replaceAll(regexN,'').replace(/\./g, "");
        
        var targetUnitX = el.connectedElement.config.position[0].replaceAll(regexN,'').replace(/\./g, "")
        var targetUnitY = el.connectedElement.config.position[1].replaceAll(regexN,'').replace(/\./g, "")

        var valX = xPos.replace(regexC,'');
        var valY = yPos.replace(regexC,'');

        //Treat each axis independently
        var corrPosX = convertToTargetUnit([valX, 0], unitX, targetUnitX)[0];
        var corrPosY = convertToTargetUnit([0, valY], unitY, targetUnitY)[1];
        

        el.connectedElement.config.position[0] = corrPosX + targetUnitX;
        el.connectedElement.config.position[1] = corrPosY + targetUnitY;

        clearTimeout(accTimeout);
        setTimeout(()=>{
            accelerator = 1;
        }, 1000)
        //Update the fullscreen view if it is displayed
        updateFullscreenView();

    }


    function convertToTargetUnit([x,y], unit, targetUnit) {
        var px = (values) => {
            switch(unit) {
                case "px":
                    return values;
                break;
                case "%":
                    return convertPercentToPx([values]);
                break;
                case "rem":
                    return [values[0]*16, values[1]*16];
                break;
                default:
                    return new Error("No target unit matches");
            }
        }
        var percent = (values) => {
            switch(unit) {
                case "px":
                    return convertPxToPercent(values);
                break;
                case "%":
                    return values;
                break;
                case "rem":
                    var pxs = convertPercentToPx(values);
                    return [pxs[0]*16, pxs[1]*16];
                break;
                default:
                    return new Error("No target unit matches");
            }
        }

        var rem = (values) => {
            switch(unit) {
                case "px":
                    return [values[0]/16, values[1]/16];
                break;
                case "%":
                    var pxs = convertPercentToPx(values);
                    return [pxs[0]*16, pxs[1]*16];
                break;
                case "rem":
                    return values;
                break;
                default:
                    return new Error("No target unit matches");
            }
        }

        switch(targetUnit) {
            case "px":
                return px([x,y]);
            break;
            case "%":
                return percent([x,y]);
            break;
            case "rem":
                return rem([x,y]);
            break;
            default:
                return new Error("No target unit matches");
        }
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
        document.body.removeEventListener("keydown", handleArrowMove);
        document.body.removeEventListener("keyup", handleArrowMoveRelease);
        
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
            

            //The target types for each axis
            var regexN = /[0-9]/g;
            var regexC = /[^\d.-]/g;

            var targetUnitX = el.connectedElement.config.position[0].replaceAll(regexN,'').replace(/\./g, "")
            var targetUnitY = el.connectedElement.config.position[1].replaceAll(regexN,'').replace(/\./g, "")

            var xPos = el.style.left;
            var yPos = el.style.top; //These values can be of any type, really.

            var valX = xPos.replace(regexC,'');
            var valY = yPos.replace(regexC,'');

            var unitX = xPos.replaceAll(regexN,'').replace(/\./g, "");
            var unitY = yPos.replaceAll(regexN,'').replace(/\./g, "");

            //Need to treat each axis seperately
            var corrPosX = convertToTargetUnit([valX, 0], unitX, targetUnitX)[0];
            var corrPosY = convertToTargetUnit([0, valY], unitY, targetUnitY)[1];

            var position = [corrPosX, corrPosY];            
            console.log(position)

            el.connectedElement.config.position[0] = position[0] + targetUnitX;
            el.connectedElement.config.position[1] = position[1] + targetUnitY;
            console.log(el.connectedElement.config.position);

            var newPos = [el.style.left, el.style.top];
            if(oldPos[0] == newPos[0] && oldPos[1] == newPos[1]) {
                //Element has not been moved, show the resize borders instead
                enableBorders();
            }

            updateFullscreenView();

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

        var aspR;
        var keepAsp = false;

        var handleKeyDown = function(e) {
            if(e.keyCode == 16) /*Shift*/ {
                keepAsp = true;
            }
        }

        var handleKeyUp = function(e) {
            if(e.keyCode == 16) /*Shift*/ {
                keepAsp = false;
            }
        }

        document.body.addEventListener("keydown", handleKeyDown);
        document.body.addEventListener("keyup", handleKeyUp);

        if(element.getElementsByTagName("img")[0]) {

            var img = element.getElementsByTagName("img")[0]

            var proxy = document.createElement("img");
            proxy.src = img.src;

            var height = proxy.height;
            var width = proxy.width;

            aspR = (width/height).toFixed(2); 
            
        } else {
            var stl = window.getComputedStyle(element);
            var height = parseInt(stl.height.split("px")[0]);
            var width = parseInt(stl.width.split("px")[0]);

            aspR = (width/height).toFixed(2);
        }



        var properties = {bottom: false, right: false}
        var handleMove = (e) => {
            //Figure out wether mouse is on bottom or right side of element
            var rightEdge = parseInt(element.style.left.split("px")[0]) + parseInt(window.getComputedStyle(element).width.split("px")[0]);        
            
            if(element.getElementsByTagName("img")[0]) {
                var img = element.getElementsByTagName("img")[0]
                img.style.width = "100%";
                
                
            }

            if(trackedHeight > 20 || e.movementY>0) {
                trackedHeight = trackedHeight + e.movementY;
            }
            
            if(trackedWidth > 20 || e.movementX>0) {
                if(keepAsp) {
                    trackedWidth = trackedHeight * aspR;
                } else {
                    trackedWidth = trackedWidth + e.movementX;
                }
            }
            
            element.style.height = trackedHeight + "px";
            element.style.width = trackedWidth + "px";
        }

        var handleUp = (e) => {
            document.body.removeEventListener("mouseup", handleUp);
            document.body.removeEventListener("mousemove", handleMove);
            document.body.style.cursor = "default";
            border.style.opacity = "1"
            dot.setAttribute("style", "cursor: nw-resize");

            document.body.removeEventListener("keydown", handleKeyDown);
            document.body.removeEventListener("keyup", handleKeyUp);
            
            var height = el.style.height.split("px")[0];
            var width = el.style.width.split("px")[0];
            var percents = convertPxToPercent([width, height]);

            el.connectedElement.config.size.width = percents[0] + "%";
            el.connectedElement.config.size.height = percents[1] + "%";

            updateFullscreenView();

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
            var height = el.style.height.split("px")[0];
            var width = el.style.width.split("px")[0];
            var percents = convertPxToPercent([width, height]);

            el.connectedElement.config.size.width = percents[0] + "%";
            el.connectedElement.config.size.height = percents[1] + "%";
            updateFullscreenView();

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

            var height = el.style.height.split("px")[0];
            var width = el.style.width.split("px")[0];
            var percents = convertPxToPercent([width, height]);

            el.connectedElement.config.size.width = percents[0] + "%";
            el.connectedElement.config.size.height = percents[1] + "%";
            updateFullscreenView();

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

function convertPercentToPx([x,y]) {
    var viewport = document.querySelector('#content > div');
    var xWidth = parseInt(window.getComputedStyle(viewport).width.split("px")[0]);
    var yHeight = parseInt(window.getComputedStyle(viewport).height.split("px")[0]);
    return [(x*xWidth/100).toFixed(5), (y*yHeight/100).toFixed(5)];
}


//Converts any compatible unit to px
function convertToPixels([x,y], unit) {
    switch(unit) {
        case "px":
            return [x,y];
        break;
        case "%":
            var perc = convertPercentToPx([x,y]);
            return perc;
        break;
        case "rem":
            var multiplier = 16; //px (as defined in :root (main.js:30))
            return [x*16, y*16];
        break;
    }
}



// AIAIAI Use some goddamn promises, mister!
//I need to fix this the day I learn to be a better programmer..
//I'm putting this up as an issue on github. The program freezes when the
//"fullscreen" button is pressed
function showFullscreenView() {
    //The name says it all, doesn't it?
    var result = ipcRenderer.sendSync("fullscreen-slideshow");
    console.log(result)
    if(result == "OK") {
        var data = {routingInformation: {forwardingName: "fullscreen-view"}, forwardingInformation: "aribasddiuujiads"};
        var res1 = ipcRenderer.sendSync("inter-renderer-communication", data);
        setTimeout(() => {
            updateFullscreenView();
        })
    } else {
        console.log("Could not open fullscreen view: " + result);
    }

    //Coomunicate the data from the slideshow to the window
}


function updateFullscreenView() {    
    var col = {number: null, slideshowLength: null, content: []};

    //Get the currently rendered column
    var colNo = renderer.renderedColumn();
    col.number = colNo;
    
    var length = renderer.numberOfColumns();
    col.slideshowLength = length;

    var column = document.getElementsByClassName("timeline-column")[colNo];

    for(let i = 0; i < column.childNodes.length; i++) {
        var child = column.childNodes[i];
        if(child.childNodes.length > 0) {
            //There is an element here
            var el = child.querySelector(".scrubber-element");
            var file = {
                config: null,
                category: null,
                name: null,
                src: null,
                index: null
            }
            file.index = i;
            file.config = el.config;
            file.category = el.getAttribute("type");
            file.name = el.getAttribute("name");
            file.src = el.getAttribute("filename");
            col.content.push(file);
        }

        
    }
    //The slide info has been gathered, time to send it away..
    var data = {routingInformation: {forwardingName: "slide-data"}, forwardingInformation: col};
    var res = ipcRenderer.sendSync("inter-renderer-communication", data);
}