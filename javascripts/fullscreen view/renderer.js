/////////////////////////////////////////////////////////
// ADAPTED VERSION OF THE RENDERER IN THE MAIN PROGRAM //
/////////////////////////////////////////////////////////
const renderer = new RenderingToolKit();
const { isPackaged } = require("electron-is-packaged")
const path = require("path")
////////////////////////////////
// Render the selected column //
////////////////////////////////

//renderer --> RenderingToolKit()
function renderColumn(indexes) {

    //Go through the indexes array, and handle each element correctly
    
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
        var viewport = document.getElementById("viewport");
        //Render image to the viewport
        var el = document.createElement("div");

        var img = document.createElement("img");
        el.appendChild(img);
        el.connectedElement = data.element;
        var zIndex = data.zIndex;
        var name = data.src;
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
        console.log(Awidth, Aheight);

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
            var viewport = document.querySelector("#viewport");
            var height = parseInt(window.getComputedStyle(viewport).height.split("px")[0]);
            
            //Get the correct height value
            var corrHeight = height*parseInt(data.config.size.height.split("%")[0])/100;
            asp.height = corrHeight;
            var Awidth = asp.height*aspectRatio;
            //Convert the value to percent
            var converted = convertPxToPercent([Awidth,0])
            widths = converted[0] + "%";
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
        el.addEventListener("dragstart", function(e) {
            e.preventDefault();
        });

    },
    this.widget = function(data) {
        var viewport = document.getElementById("viewport");

        var widget = createWidget(data.src.split(" ")[0].toLowerCase(), data.config, data.element);
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
            font-family: ` + fontFamily + `;
            font-size: ` + downScale + `;
            /*font-size: ` + fontSize + `px;*/
            display: ` + display + `;

            /*Positioning*/
            left: ` + position[0] + `;
            top: ` + position[1] + `;
        `;

        viewport.appendChild(widget);


    },
    this.movie = function(data) {
        var viewport = document.getElementById("viewport");
        var name = data.src;
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
                var imgs = document.getElementById("viewport").childNodes;
                var x;
                for(x of imgs) {
                    if(x.connectedElement == timeLineFile) {
                        x.parentNode.removeChild(x);
                    }
                }
            }
        }
    },
    this.renderedColumn = function() {
        return document.body.meta.slideNumber;
    },
    this.numberOfColumns = function() {
        return document.body.meta.numberOfColumns;
    }
}




function convertPxToPercent([x,y]) {
    //Get the viewport size
    var viewport = document.querySelector('#viewport');
    var xWidth = parseInt(window.getComputedStyle(viewport).width.split("px")[0]);
    var yHeight = parseInt(window.getComputedStyle(viewport).height.split("px")[0]);

    var xP = (parseInt(x)/xWidth)*100;
    var yP = (parseInt(y)/yHeight)*100;

    return [xP.toFixed(2), yP.toFixed(2)]; //Return only numbers rounded to two decimal places

}

function convertPercentToPx([x,y]) {
    var viewport = document.querySelector('#viewport');
    var xWidth = parseInt(window.getComputedStyle(viewport).width.split("px")[0]);
    var yHeight = parseInt(window.getComputedStyle(viewport).height.split("px")[0]);
    return [(x*xWidth/100).toFixed(5), (y*yHeight/100).toFixed(5)];
}