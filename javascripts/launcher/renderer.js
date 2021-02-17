
var slideshowPlaying = false;


const renderer = new RenderingToolKit()

////////////////////////////////
// Render the selected column //
////////////////////////////////

//renderer --> RenderingToolKit()
function renderColumn(col, data) {
    //Get the rows
    var viewport = document.getElementById("viewport").querySelector(".content");
    viewport.innerHTML = "";
    
    //Create indexation array
    var indexes = []; 
    if(!data) return; //No data to display, cancel the rendering process
    for(let i = 0; i < data.content.length; i++) {
            //Gather information about the element
            console.log(data.content[i])
            var fileTypeOrPath = data.content[i].fileName;
            var name = data.content[i].type;
            //Push each element in the column to the indexation array with all the nescessary information
            indexes.push([{type: name, name: fileTypeOrPath, zIndex: zIndex, config: data.content[i].config, data: data.content[i].data}])
            
            var zIndex = i+1;
    }



    //Go through the indexes array, and handle each element correctly

    var viewport = document.getElementById("viewport").querySelector(".content");
    
    var x;
    for(x of indexes) {
        console.log(x[0].type)
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
        var viewport = document.getElementById("viewport").querySelector(".content");
        //Render image to the viewport
        var el = document.createElement("img");
        var zIndex = data.zIndex;
        var name = data.name;
        var src;

        el.className = "viewport-image";
        el.src = "data:image/png;base64," + data.data;   



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
        el.addEventListener("dragstart", function(e) {
            e.preventDefault();
        });

    },
    this.widget = function(data) {
        var viewport = document.getElementById("viewport").querySelector(".content");

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
            /*font-size: ` + fontSize + `px;*/
            display: ` + display + `;

            /*Positioning*/
            left: ` + position[0] + `;
            top: ` + position[1] + `;
        `;

        viewport.appendChild(widget);


    },
    this.movie = function(data) {
        var viewport = document.getElementById("viewport").querySelector(".content");
        var el = document.createElement("div");
        var vid = document.createElement("video");
        vid.style = `
            height: 100%;
            width: auto;
        `;
        var srcEl = document.createElement("source");

        srcEl.src = "data:video/mp4;base64," + data.data;
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
            overflow: hidden;
        `;

        ////////////////////////////////////////////////////////////////////////////
        // THIS IS A VIDEO ELEMENT, BUT THEY WILL NOT BE DISPLAYED IN THE PREVIEW //
        // THEREFORE, SHOW A VIDEO ICON INSTEAD.                                  //
        ////////////////////////////////////////////////////////////////////////////

        var icon = document.createElement("div");
        icon.style = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            height: fit-content;
            width: fit-content;
        `;

        var ico = document.createElement("i");
        ico.innerHTML = "movie";
        ico.className = "material-icons";
        ico.style = `
            font-size: 3rem;
            color: var(--title-color);
            text-shadow: 2px 2px 2px rgba(50, 50, 50, 1)
        `;  
        icon.appendChild(ico);

        el.appendChild(icon);

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


////////////////////
// Handle widgets //
////////////////////

function createWidget(type, config, rootEl) {
    var el = document.createElement("div");
    el.className = "viewport-image widget";
    el.style = `
        background-color: ` + config.backgroundColor + `;
        font-family: ` + config.fontFamily + `;
    `;
    switch(type) {
        case "weather":
            var widgetContent = weather(config);
            el.appendChild(widgetContent);
        break;
        case "time":
            var widgetContent = time(config);
            el.appendChild(widgetContent);
        break;
        case "news":
            var widgetContent = news(config);
            el.appendChild(widgetContent)
        break;
        case "text":
            var widgetContent = text(config, rootEl);
            el.appendChild(widgetContent);
        break;
        case "script":
            var widgetContent = Script(config);
            el.appendChild(widgetContent);
        break;
    }
    
    return el;
}

function weather(config) {
    //Create the weather widget
    var cont = document.createElement("div");
    cont.setAttribute("style", `
        height: 100%;
        width: 100%;
        position: relative;
        overflow: hidden;
        pointer-events: none;
        overflow: hidden;
    `);
    var placeholder = document.createElement("h1");
    placeholder.innerHTML = "weather placeholder";
    placeholder.style = `
        height: fit-content;
        width: fit-content;
        margin: 0;
        position: absolute;
        font-weight: lighter;
        color: ` + config.textColor + `; 
        text-align: center;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        pointer-events: none;   
        font-size: ` + config.fontSize + `vh;

    `
    cont.appendChild(placeholder);

    return cont;
    
}


function news(config) {
        //Create the time widget
        //Create the weather widget
        var cont = document.createElement("div");
        cont.style = `
            height: 100%;
            width: 100%;
            border-radius: 0.25rem;
            position: relative;
            overflow: hidden;
        `;
        var placeholder = document.createElement("h1");
        placeholder.innerHTML = "news placeholder";
        placeholder.style = `
            height: fit-content;
            width: fit-content;
            margin: 0;
            position: absolute;
            font-weight: lighter;
            color: var(--paragraph-color);
            text-align: center;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            color: ` + config.textColor + `; 
        `
        cont.appendChild(placeholder);
    
        return cont;
}


function time(config) {
    //Create the time widget
    var cont = document.createElement("div");
    cont.style = `
        height: 100%;
        width: 100%;
        border-radius: 0.25rem;
        position: relative;
        overflow: hidden;
    `;

    var time;
    var date = new Date();

    if(config.widgetAttributes.time.showDate) {
        var month = date.getMonth()+1;
        var day = date.getDate();
        var year = date.getFullYear();

        time = day + "/" + month + "/" + year;

    } else {
        
        var format = config.widgetAttributes.time.timeFormat;

        var showHours = config.widgetAttributes.time.showHours;
        var showMinutes = config.widgetAttributes.time.showMinutes;
        var showSeconds = config.widgetAttributes.time.showSeconds;

        var hours;
        var minutes;
        var seconds;

        switch(format) {
            case "0":
                //AMPM
                hours = date.getHours();
                minutes = date.getMinutes();
                seconds = date.getSeconds();
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? '0'+minutes : minutes;
                seconds = seconds < 10 ? '0'+seconds : seconds;
            break;
            case "1":
                //24HR clock
                
                hours = (date.getHours() > 9) ? date.getHours() : "0" + date.getHours();
                minutes = (date.getMinutes() > 9) ? date.getMinutes() : "0" + date.getMinutes();
                seconds = (date.getSeconds() > 9) ? date.getSeconds() : "0" + date.getSeconds();
            break;
        }

        if(showHours && !showMinutes && !showSeconds) {
            time = hours;
        } else if(showHours && showMinutes && !showSeconds) {
            time = hours + ":" + minutes;
        } else if(showHours && showMinutes && showSeconds) {
            time = hours + ":" + minutes + ":" + seconds;
        } else if(showHours && !showMinutes && showSeconds) {
            time = hours + ":" + seconds;  
        } else if(!showHours && showMinutes && !showSeconds) {
            time = minutes;
        } else if(!showHours && showMinutes && showSeconds) {
            time = minutes + ":" + seconds;
        } else if(showHours && showMinutes && showSeconds) {
            time = hours + ":" + minutes + ":" + seconds;
        } else if(!showHours && !showMinutes && showSeconds) {
            time = seconds;
        } else if(showHours && showMinutes && showSeconds) {
            time = hours + ":" + minutes + ":" + seconds;
        } else {
            time = ""
        }

        if(format == "0") {
            var ampm = hours >= 12 ? 'PM' : 'AM';
            time = time + " " + ampm;
        }

    }
    var placeholder = document.createElement("h1");
    placeholder.innerHTML = time;
    placeholder.style = `
        height: fit-content;
        width: fit-content;
        margin: 0;
        position: absolute;
        font-weight: lighter;
        color: var(--paragraph-color);
        text-align: center;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        color: ` + config.textColor + `;
        font-size: ` + config.fontSize + `vh; 
    `
    cont.appendChild(placeholder);
    
    return cont;
}




function text(config, rootEl) {
    //Create the time widget
    //Create the weather widget
    var cont = document.createElement("div");
    cont.style = `
        height: 100%;
        width: 100%;
        border-radius: 0.25rem;
        position: relative;
        overflow: hidden;
    `;

    cont.addEventListener("resize", function(e) {
    })
    var box = document.createElement("textarea");
    if(config.value) {
        box.value = config.value;
    } else {
        box.value = "text placeholder";
    }

    box.style = `
        height: fit-content;
        width: fit-content;
        margin: 0;
        position: absolute;
        font-weight: lighter;
        color: var(--paragraph-color);
        text-align: center;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        color: ` + config.textColor + `; 
        font-family: ` + config.fontFamily + `;
        background-color: transparent;
        border: none;
        height: 100%;
        width: 100%;
        resize: none;
        text-align: center;
        font-size: ` + config.fontSize + `vh;
    `;
    box.style.pointerEvents = "none";
    cont.appendChild(box);
    return cont;
}

function Script(config) {
    //Create the weather widget
    var cont = document.createElement("div");
    cont.setAttribute("style", `
        height: 100%;
        width: 100%;
        position: relative;
        overflow: hidden;
        pointer-events: none;
        overflow: hidden;
    `);


    if(config.widgetAttributes.script.htmlContents) {
        cont.innerHTML = config.widgetAttributes.script.htmlContents;
        if(config.widgetAttributes.script.styleContents) {
            cont.innerHTML = cont.innerHTML + `
                <style>` + config.widgetAttributes.script.styleContents + `</style>
            `
        }
        return cont;
    }


    var ascii = require("ascii-faces")
    var placeholder = document.createElement("h1");
    placeholder.innerHTML = "Edit this element's script to display something <br>" + ascii();
    placeholder.style = `
        height: fit-content;
        width: fit-content;
        margin: 0;
        position: absolute;
        font-weight: lighter;
        color: var(--paragraph-color);
        text-align: center;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        color: ` + config.textColor + `;
        font-size: 2rem; 
    `
    cont.appendChild(placeholder);
    

    return cont;

}