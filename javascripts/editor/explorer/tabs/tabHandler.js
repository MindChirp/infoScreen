const { TouchBarScrubber } = require("electron");

//var path = require("path");
const tabInputs = new TabSystem();

function createTab(el, name) {
    if(document.getElementsByClassName("browser-tab-container")[0].querySelector("#empty")) {
        document.getElementsByClassName("browser-tab-container")[0].innerHTML = "";
    }

    var tab = document.createElement("button");
    tab.setAttribute("class", "tab smooth-shadow");
    tab.connectedElement = el.closest(".scrubber-element");
    tab.selected = false;
    tab.addEventListener("click", function(e) {
        openTab(e.target);
    });

    tab.addEventListener("mousedown", function(e) {
        e.preventDefault();
        if(e.button == 1) {
            removeTab(e.target.closest(".tab").connectedElement);
        }
    })


    //tab.setAttribute("connectedElement", el);
    var txt = document.createElement("p");
    txt.innerHTML = name;

    tab.appendChild(txt);
    
    var cross = document.createElement("div");
    cross.setAttribute("class", "cross");
    tab.appendChild(cross);

    var ico = document.createElement("i");
    ico.setAttribute("class", "material-icons");
    ico.innerHTML = "cancel";

    cross.appendChild(ico);
    cross.addEventListener("click", function(e) {
        removeTab(e.target.closest(".tab").connectedElement);
    });

    infoOnHover(cross, "Close tab");

    document.getElementsByClassName("browser-tab-container")[0].appendChild(tab);
    //openTab(tab);
    return tab;
}

function removeTab(el) {
    var tabs = document.getElementsByClassName("tab");
    var x;
    for(x of tabs) {
        if(el == x.connectedElement) {

            if(x.selected) {
                var pane = document.getElementsByClassName("properties-pane")[0];
                pane.parentNode.removeChild(pane);
            }
            
            el.childNodes[0].setAttribute("hasTab", "false");    

            /////////////////////////////////////////////////////////////////////////////////
            //                                                                             //
            //   THIS IS A SERIOUSLY BAD PRACTICE and should be fixed as soon as possible  //
            //      I just want it to work right now..                                     //
            //                                                                             //
            // GOOD FIX:                                                                   //
            // --> Remove the role of the p element as a tab manager element               //
            /////////////////////////////////////////////////////////////////////////////////
            if(el.getAttribute("type") == "widget") {
                el.childNodes[0].setAttribute("hasTab", "false")
            }

            
            x.parentNode.removeChild(x);
            
        }
    }
    var container = document.getElementsByClassName("browser-tab-container")[0];
    if(container.innerHTML.length == 0) {
        var p = document.createElement("p");
        p.setAttribute("id", "empty");
        p.innerHTML = "No open tabs";
        container.appendChild(p);
    }

}

function openPropertiesTab(el) {
    el.setAttribute("hasTab", "true");
    
    var fileName = el.closest(".scrubber-element").getAttribute("fileName");
    var tab = createTab(el, fileName);

}

function openTab(el) {
    //Deselect tab if a tab is clicked, and it turns out it is already selected
    if(el.closest(".tab").selected) {
        var pane = document.getElementsByClassName("properties-pane")[0];
        pane.parentNode.removeChild(pane);
        el.closest(".tab").selected = false;
        el.closest(".tab").style.backgroundColor = "var(--secondary-color)";
        return;
    }

    //Cancel if the cross button is clicked **Might not be needed, I'll check on that later
    if(el.closest(".cross")) return;

    //Deselect all active tabs before selecting a new one
    var tabs = document.getElementsByClassName("tab");
    var x;
    for(x of tabs) {
        if(x.selected) {
            x.style.backgroundColor = "var(--secondary-color)";
            x.selected = false;
        }
    }

    var tab = el.closest(".tab");
    tab.style.backgroundColor = "var(--main-button-color)";
    tab.selected = true;


    //Create the pane if there is none
    var els;
    if(!document.getElementsByClassName("properties-pane")[0]) {
        els = document.createElement("div");
        els.setAttribute("class", "properties-pane smooth-shadow");
        document.getElementsByClassName("browser-container")[0].appendChild(els);
        
    }

    if(document.getElementsByClassName("properties-pane")[0]) {
        els = document.getElementsByClassName("properties-pane")[0];
    }

    //Load the contents
    
    //Get the timeline element
    var timelineEl = el.closest(".tab").connectedElement.closest(".scrubber-element");
    //Clear contents of the properties pane
    els.innerHTML = "";

    var cont = document.createElement("div");
    cont.setAttribute("class", "container");
    els.appendChild(cont);
    

    var elPath = timelineEl.getAttribute("fileName");
    var h1 = document.createElement("h1");
    h1.setAttribute("class", "title");
    h1.innerHTML = elPath;
    cont.appendChild(h1);

    //Create right side wrapper for the tab
    var wrapper = document.createElement("div");
    cont.appendChild(wrapper);
    wrapper.className = "right"



    //Create keyframe timeline (or not?)
    /*var timeline = document.createElement("div");
    timeline.className = "timeline";*/


    //Create a file preview
    var preview = document.createElement("div");
    preview.className = "preview-window";

    wrapper.appendChild(preview);
    //wrapper.appendChild(timeline)

    var dirName; 
    if(isPackaged) {
        dirName = path.join(path.dirname(__dirname), "extraResources", "data", "files", "images");
    } else {
        dirName = path.join(__dirname, "extraResources", "data", "files", "images");
    }
    var previewElement = document.createElement("div");
    var type = timelineEl.getAttribute("type");
    var media;

    var customisation = function(config) {
        var el = document.createElement("div");
        el.style = `
            height: fit-content;
            width: 100%;
            margin-top: 0.5rem;
        `;

        var wr = document.createElement("div");
        wr.style = `
            display: inline-block;
            vertical-align: top;
        `;
        var col = document.createElement("input");
        col.type = "color";
        col.style = `
            border: none;
            background-color: transparent;
            padding: 0;
            cursor: pointer;
        `;
        var value = config.backgroundColor;
        col.value = value;
        
        col.onchange = function(e) {
            timelineEl.config.backgroundColor = e.target.value; 
            refreshViewport(true);
        }

        var p = document.createElement("p");
        p.innerHTML = "Background Color";
        p.style = "margin: 0; font-weight: lighter;";
        wr.appendChild(p);
        wr.appendChild(col);
        el.appendChild(wr);


        var wr = document.createElement("div");
        wr.style = `
            display: inline-block;
            margin: 0 0.5rem;
            vertical-align: top;
        `;
        var txtCol = document.createElement("input");
        txtCol.type = "color";
        txtCol.style = `
            border: none;
            background-color: transparent;
            padding: 0;
            cursor: pointer;
        `;
        var value = config.textColor;
        txtCol.value = value;

        txtCol.onchange = function(e) {
            timelineEl.config.textColor = e.target.value; 
            refreshViewport(true);
        }

        var p = document.createElement("p");
        p.innerHTML = "Text Color";
        p.style = "margin: 0; font-weight: lighter;";

        wr.appendChild(p);
        wr.appendChild(txtCol);
        el.appendChild(wr);

        var opacity = tabInputs.slider("Background opacity", true);
        var slider = opacity.getElementsByTagName("input")[0];
        slider.setAttribute("max", "1");
        slider.setAttribute("min", "0");
        slider.setAttribute("step", "0.05");
        slider.setAttribute("value", "1");
        
        var event = new Event("change");
        slider.dispatchEvent(event) //Update the slider value text

        slider.addEventListener("change", (e) => {
            var val = e.target.value*255;
            //Convert opacity to hex, but first multiply by 100 (because... hex opacity formatting..)
            var hexString = Math.round(val).toString(16);
            var something = Math.round(val);
            //Set the background color opacity attribute
            timelineEl.config.backgroundOpacity = hexString;
            refreshViewport(true);

        })

        el.appendChild(opacity);

        var fontSize = tabInputs.input("Font Size", "number", "%");
        fontSize.style.display = "block";
        fontSize.style.marginTop = "1rem";
        fontSize.style.float = "";
        fontSize.childNodes[1].value = config.fontSize;
        fontSize.childNodes[1].placeholder = "0"; 
        fontSize.onchange = function(e) {
            timelineEl.config.fontSize = e.target.value; 
            refreshViewport(true);
        }

        var info = createInfoCircle(`
            <b>%</b> is calculated by getting the height of a shown element, and making the font a set percentage of this height.
        `);
        infoOnHover(info, "How does % work?");
        fontSize.appendChild(info);

        el.appendChild(fontSize);


        var font = tabInputs.select(["Bahnschrift", "Arial", "Verdana", "Helvetica", "Tahoma", "Trebuchet MS", "Times New Roman", "Georgia", "Garamond", "Courier New", "Brush Script MT"], "Bahnschrift", "Font family", true);
        font.style.width = "10rem";
        font.style.height = "4rem";
        var select = font.getElementsByTagName("select")[0];
        select.value = timelineEl.config.fontFamily;
        el.appendChild(font);   
        select.addEventListener("change", (e) => {
            var value = font.getElementsByTagName("select")[0].value;
            timelineEl.config.fontFamily = value;
            refreshViewport(true);
        })


        return el;
    }




    var refreshViewport = function(refreshPreview) {
        if(renderer.isRendered(timelineEl)) {
            var colNo = renderer.renderedColumn();
            renderColumn(colNo);
        }

        if(refreshPreview) {
            var widget = createWidget(type,timelineEl.config, timelineEl);
            widget.style.width = "100%";
            widget.style.height = "100%";
            media.innerHTML = "";
            media.appendChild(widget);
        }
    }







    //Get the timeline element config
    var data = timelineEl.config;





    var inputCont = document.createElement("div");
    cont.appendChild(inputCont);
    inputCont.style = `
        width: 50%;
        height: fit-content;
        /*max-height: 16rem;*/
        display: inline-block;
        float: left;
        white-space: normal;
    `;

    var standardSettings = document.createElement("div");
    standardSettings.style = `
        height: fit-content;
        width: 100%;
        display: block;
        position: relative;
        overflow-y: none;
    `;
    standardSettings.className = "standard-tab-settings-container"

    inputCont.appendChild(standardSettings);
    //Border radius input
    var radius = tabInputs.input("Border radius", "number", "rem");
    //radius.childNodes[1] is the input field
    radius.childNodes[1].value = data.borderRadius;
    radius.childNodes[1].placeholder = "0";
    radius.childNodes[1].addEventListener("change", function(e) {
        var value = e.target.value;
        if(e.target.value == "") {
            value = 0;
        }
        media.style.borderRadius = value + "rem";
        //Update the timeline element
        timelineEl.config.borderRadius = value;

        refreshViewport(false);
    }); 
    radius.style.marginTop = "0.5rem";
    standardSettings.appendChild(radius);

    var info = createInfoCircle(`
        '<b>rem</b>' is a unit which is adjusted relative 
        to the standard font size. Therefore, rounded borders
        will look good on many screen sizes.
    `);
    infoOnHover(info, "Why use rem?");
    radius.appendChild(info);

    var opacity = tabInputs.slider("Opacity", true);
    opacity.childNodes[1].value = data.opacity;
    opacity.childNodes[1].max = 1;
    opacity.childNodes[1].step = 0.01;
    opacity.childNodes[1].min = 0;
    opacity.childNodes[1].addEventListener("change", function(e) {
        var value = e.target.value;
        if(e.target.value == "") {
            value = 1;
        }
        media.style.opacity = value;
        //Update the timeline element
        timelineEl.config.opacity = value;

        refreshViewport(false);
    }); 


    standardSettings.appendChild(opacity);

    var shadowSize = tabInputs.slider("Shadow size");
    shadowSize.childNodes[1].max = 20;
    shadowSize.childNodes[1].min = 0;
    shadowSize.childNodes[1].value = data.shadowMultiplier;
    
    shadowSize.childNodes[1].addEventListener("change", function(e) {
        var value = e.target.value;
        media.style.boxShadow = value + "px " + value + "px " + 1.3*value + "px 0px rgba(0,0,0,0.75)";
        //Update the timeline element
        timelineEl.config.shadowMultiplier = value;

        refreshViewport(false);
    }); 


    standardSettings.appendChild(shadowSize);

    var blur = tabInputs.slider("Blur");
    blur.childNodes[1].max = 20;
    blur.childNodes[1].min = 0;
    blur.childNodes[1].step = 0.5;
    blur.childNodes[1].value = data.blur;
    
    blur.childNodes[1].addEventListener("change", function(e) {
        var value = e.target.value;
        media.style.filter = "blur(" + value+"px)";
        //Update the timeline element
        timelineEl.config.blur = value;

        refreshViewport(false);
    }); 


    standardSettings.appendChild(blur);

    var id = tabInputs.input("Identification", "text");
    id.childNodes[1].value = "";
    id.style = `
        float: left;
    `
    id.childNodes[1].placeholder = "...";
    id.childNodes[1].style.width = "10rem";
    standardSettings.appendChild(id);
    id.childNodes[1].addEventListener("change", function(e) {
        var value = e.target.value;
        if(e.target.value == "") {
            value = null;
        }
        //Update the timeline element
        timelineEl.config.identification = value+""; //Transform it into a string
        refreshViewport(false);

    }); 
    id.childNodes[1].value = timelineEl.config.identification;

    var hide = tabInputs.checkBox("Hide");
    hide.style.display = "block";
    hide.childNodes[0].childNodes[1].checked = !data.display;
    hide.childNodes[0].childNodes[1].addEventListener("change", function(e) {
        var value = e.target.checked;      
        timelineEl.config.display = !value;
        
        //Update the timeline element
        refreshViewport(false);
    }); 


    standardSettings.appendChild(hide);


    var aspR = tabInputs.checkBox("Lock aspect ratio");
    aspR.style.display = "block";
    aspR.childNodes[0].childNodes[1].checked = data.keepAspectRatio;
    aspR.childNodes[0].childNodes[1].addEventListener("change", function(e) {
        var value = e.target.checked;      
        timelineEl.config.keepAspectRatio = value;
        
        //Update the timeline element
        refreshViewport(false);
    }); 


    standardSettings.appendChild(aspR);    


    var units = ["px", "%", "rem", "vh", "vw"];

    var returnCorrespondingNumber = (unit) => {
        for(let i = 0; i < units.length; i++) {
            if(units[i] == unit) {
                return i;
            }
        }

        switch(unit) {
            case "left":
                return 0;
            break;
            case "right":
                return 1;
            break;
            case "top":
                return 0;
            break;
            case "bottom":
                return 1;
            break;
        }
    }

    var createPositioningContainer = () => {
        if(document.getElementsByClassName("tab-position-container")[0]) {
            var el = document.getElementsByClassName("tab-position-container")[0];
            el.parentNode.removeChild(el);
        }

        //Get the sizing and transform properties of the element
        var regexN = /[0-9]/g;
        var regexC = /[^\d.-]/g;

        var config = timelineEl.config;
        var fileDat = {
            height: {value: config.size.height.replace(regexC,''), unit: config.size.height.replaceAll(regexN,'').replace(/\./g, "")},
            width: {value: config.size.width.replace(regexC,''), unit: config.size.width.replace(regexN,'').replace(/\./g, "")},
            x: {value: config.position[0].replace(regexC,''), unit: config.position[0].replace(regexN, '').replace(/\./g, ""), edge: config.edgeAnchors.x},
            y: {value: config.position[1].replace(regexC,''), unit: config.position[1].replace(regexN, '').replace(/\./g, ""),  edge: config.edgeAnchors.y}
        }


        var x = document.createElement("div");
        x.className = "tab-position-container";

        var pos = tabInputs.input("X", "number");
        pos.getElementsByTagName("input")[0].value = fileDat.x.value;
        pos.getElementsByTagName("input")[0].addEventListener("change", (e) => {
            var val = e.target.value;
            timelineEl.config.position[0] = val + units[e.target.parentNode.getElementsByClassName("unit")[1].getElementsByTagName("select")[0].value];
            refreshViewport();
        })
        pos.className = "value"
        x.appendChild(pos);
        var selUnit = returnCorrespondingNumber(fileDat.x.unit);
        var unit = tabInputs.select(units, selUnit);
        unit.getElementsByTagName("select")[0].addEventListener("change", (e) => {
            var val = e.target.value;
            timelineEl.config.position[0] = e.target.closest(".value").getElementsByTagName("input")[0].value + units[val];
            refreshViewport();
            
        })
        unit.className = "unit";
        unit.style.width = "4rem";
        unit.style.height = "2rem";
        var edge = tabInputs.select(["Left", "Right"], returnCorrespondingNumber(fileDat.x.edge));
        edge.getElementsByTagName("select")[0].addEventListener("change", (e) => {
            var val = e.target.value;
            var edges = ["left", "right"];
            timelineEl.config.edgeAnchors.x = edges[val];
            refreshViewport();
        })
        edge.className = "unit";
        edge.style.width = "6rem";
        edge.style.height = "2rem";
        pos.appendChild(edge);
        pos.appendChild(unit);


        standardSettings.appendChild(x);

        var pos = tabInputs.input("Y", "number");
        pos.getElementsByTagName("input")[0].value = fileDat.y.value;
        pos.getElementsByTagName("input")[0].addEventListener("change", (e) => {
            var val = e.target.value;
            timelineEl.config.position[1] = val + units[e.target.parentNode.getElementsByClassName("unit")[1].getElementsByTagName("select")[0].value];
            refreshViewport();
            
        });
        pos.className = "value"
        x.appendChild(pos);
        var selUnit = returnCorrespondingNumber(fileDat.y.unit);
        var unit = tabInputs.select(units, selUnit);
        unit.getElementsByTagName("select")[0].addEventListener("change", (e) => {
            var val = e.target.value;
            timelineEl.config.position[1] = e.target.closest(".value").getElementsByTagName("input")[0].value + units[val];
            refreshViewport();
            
        })
        unit.className = "unit";
        unit.style.width = "4rem";
        unit.style.height = "2rem";
        var edge = tabInputs.select(["Top", "Bottom"], returnCorrespondingNumber(fileDat.y.edge));
        edge.getElementsByTagName("select")[0].addEventListener("change", (e) => {
            var val = e.target.value;
            var edges = ["top", "bottom"];
            timelineEl.config.edgeAnchors.y = edges[val];
            refreshViewport();
        })
        edge.className = "unit";
        edge.style.width = "6rem";
        edge.style.height = "2rem";
        pos.appendChild(edge);
        pos.appendChild(unit);

        var height = tabInputs.input("Height", "number");
        height.getElementsByTagName("input")[0].value = fileDat.height.value;
        height.getElementsByTagName("input")[0].addEventListener("change", (e) => {
            var val = e.target.value;
            timelineEl.config.size.height = val + units[e.target.parentNode.getElementsByClassName("unit")[0].getElementsByTagName("select")[0].value];
            refreshViewport();
        });
        height.className = "value"
        x.appendChild(height);
        var selUnit = returnCorrespondingNumber(fileDat.height.unit);
        var unit = tabInputs.select(units, selUnit);
        unit.getElementsByTagName("select")[0].addEventListener("change", (e) => {
            var val = e.target.value;
            timelineEl.config.size.height = e.target.closest(".value").getElementsByTagName("input")[0].value + units[val];
            refreshViewport();
            
        })
        height.appendChild(unit);
        unit.className = "unit";
        unit.style.width = "4rem";
        unit.style.height = "2rem";

        var width = tabInputs.input("Width", "number");
        width.getElementsByTagName("input")[0].value = fileDat.width.value;
        width.getElementsByTagName("input")[0].addEventListener("change", (e) => {
            var val = e.target.value;
            timelineEl.config.size.width = val + units[e.target.parentNode.getElementsByClassName("unit")[0].getElementsByTagName("select")[0].value];
            refreshViewport();
        });
        width.className = "value"
        x.appendChild(width);
        var selUnit = returnCorrespondingNumber(fileDat.width.unit);
        var unit = tabInputs.select(units, selUnit);
        unit.getElementsByTagName("select")[0].addEventListener("change", (e) => {
            var val = e.target.value;
            timelineEl.config.size.width = e.target.closest(".value").getElementsByTagName("input")[0].value + units[val];
            refreshViewport();
        })
        unit.className = "unit";
        width.appendChild(unit);
        unit.className = "unit";
        unit.style.width = "4rem";
        unit.style.height = "2rem";

        var bStyle = `
            float: left;
            clear: left;
            display: block;
            background: none;
            border: 2px solid var(--slider-color);
            border-radius: 0.25rem;
            color: white;
            margin-bottom: 0.5rem;
            height: fit-content;
            padding: 0.5rem 1rem;
            font-size: 1rem;
            cursor: pointer;
            outline: none;
        `
        var copyPos = document.createElement("button");
        copyPos.innerHTML = "Copy position";
        copyPos.style = bStyle;
        copyPos.style.marginTop = "1rem";
        x.appendChild(copyPos)
        copyPos.onclick = (e) => {
            var regexN = /[0-9]./g;
            var regexC = /[^\d.-]/g;
            var config = timelineEl.config;
            fileAttributes.definedInSession = true;
            fileAttributes.x = {value: config.position[0].replace(regexC,''), unit: config.position[0].replace(regexN, '').replace(/\./g, ""), edge: config.edgeAnchors.x};
            fileAttributes.y = {value: config.position[1].replace(regexC,''), unit: config.position[1].replace(regexN, '').replace(/\./g, ""),  edge: config.edgeAnchors.y};
            /*fileDat = {
                height: {value: config.size.height.replace(regexC,''), unit: config.size.height.replace(regexN,'')},
                width: {value: config.size.width.replace(regexC,''), unit: config.size.width.replace(regexN,'')},
                x: {value: config.position[0].replace(regexC,''), unit: config.position[0].replace(regexN, ''), edge: config.edgeAnchors.x},
                y: {value: config.position[1].replace(regexC,''), unit: config.position[1].replace(regexN, ''),  edge: config.edgeAnchors.y}
            }*/
            tabMsg("Copied position");
        }

        var copySize = document.createElement("button");
        copySize.innerHTML = "Copy size";
        copySize.style = bStyle;
        x.appendChild(copySize)
        copySize.onclick = (e) => {
            var regexN = /[0-9]/g;
            var regexC = /[^\d.-]/g;
            var config = timelineEl.config;
            fileAttributes.height = {value: config.size.height.replace(regexC,''), unit: config.size.height.replace(regexN,'').replace(/\./g, "")};
            fileAttributes.width = {value: config.size.width.replace(regexC,''), unit: config.size.width.replace(regexN,'').replace(/\./g, "")};
            fileAttributes.definedInSession = true;
            tabMsg("Copied size");
            
        }

        var copyAll = document.createElement("button");
        copyAll.innerHTML = "Copy all";
        copyAll.style = bStyle;
        x.appendChild(copyAll)


        copyAll.onclick = (e) => {
            var regexN = /[0-9]/g;
            var regexC = /[^\d.-]/g;
            var config = timelineEl.config;
            fileAttributes = {
                definedInSession: true,
                height: {value: config.size.height.replace(regexC,''), unit: config.size.height.replace(regexN,'').replace(/\./g, "")},
                width: {value: config.size.width.replace(regexC,''), unit: config.size.width.replace(regexN,'').replace(/\./g, "")},
                x: {value: config.position[0].replace(regexC,''), unit: config.position[0].replace(regexN, '').replace(/\./g, ""), edge: config.edgeAnchors.x},
                y: {value: config.position[1].replace(regexC,''), unit: config.position[1].replace(regexN, '').replace(/\./g, ""),  edge: config.edgeAnchors.y}
            }
            tabMsg("Copied all properties");

        }

        var paste1 = document.createElement("button");
        paste1.innerHTML = "Paste all";
        paste1.style = bStyle;
        paste1.style.marginTop = "1rem";
        x.appendChild(paste1)
        paste1.onclick = (e) => {
            //Paste all the values from the fileAttributes clipboard
            var height = fileAttributes.height.value + fileAttributes.height.unit;
            var width = fileAttributes.width.value + fileAttributes.width.unit;

            var x = fileAttributes.x.value + fileAttributes.x.unit;
            var edg1 = fileAttributes.x.edge;
            var y = fileAttributes.y.value + fileAttributes.y.unit;
            var edg2 = fileAttributes.y.edge;

            timelineEl.config.position = [x, y];
            timelineEl.config.edgeAnchors = {x: edg1, y: edg2};

            timelineEl.config.size = {height: height, width: width};
            createPositioningContainer();
            refreshViewport();
        }

        var paste2 = document.createElement("button");
        paste2.innerHTML = "Paste position";
        paste2.style = bStyle;
        x.appendChild(paste2)
        paste2.onclick = (e) => {
            //Paste all the position values from the fileAttributes clipboard
            var x = fileAttributes.x.value + fileAttributes.x.unit;
            var edg1 = fileAttributes.x.edge;
            var y = fileAttributes.y.value + fileAttributes.y.unit;
            var edg2 = fileAttributes.y.edge;

            timelineEl.config.position = [x, y];
            timelineEl.config.edgeAnchors = {x: edg1, y: edg2};
            
            createPositioningContainer();
            refreshViewport();
        }

        var paste3 = document.createElement("button");
        paste3.innerHTML = "Paste size";
        paste3.style = bStyle;
        x.appendChild(paste3)
        paste3.onclick = (e) => {
            //Paste all the values from the fileAttributes clipboard
            var height = fileAttributes.height.value + fileAttributes.height.unit;
            var width = fileAttributes.width.value + fileAttributes.width.unit;

            timelineEl.config.size = {height: height, width: width};
            
            createPositioningContainer();
            refreshViewport();
        }

    }
    createPositioningContainer();
    

    switch(type) {
        case "img": 
            media = document.createElement("img");
            media.src = dirName + "/" + elPath;
            /*timeline.style.backgroundImage = "url('./extraResources/data/files/" + elPath +"')";
            timeline.style.backgroundRepeat = "repeat";
            timeline.style.backgroundSize = "auto 100%";*/
        
        break;
        case "widget":
            previewElement.style.width = "70%";
            media = document.createElement("div");
            media.style.overflow = "hidden";
            media.style.height = "100%";
            media.style.width = "100%";
            
            //Get widget type
            var type = elPath.split(" ")[0].toLowerCase();
            //Create widget of that type
            var widget = createWidget(type, timelineEl.config, timelineEl);

            //widget.style.backgroundColor = "var(--main-bg-color)";
            widget.style.width = "100%";
            widget.style.height = "100%";
            //Append widget to the preview wrapper
            media.appendChild(widget);
            switch(type) {
                case "text":
                    var custom = customisation(timelineEl.config);
                    wrapper.appendChild(custom);


                    var p = document.createElement("p");
                    p.innerHTML = "Text";
                    p.style = `
                        margin: 1rem 0 0 0;
                        line-height: 1rem;
                        font-weight: lighter;
                    `
                    wrapper.appendChild(p);
                    var input = document.createElement("textarea");
                    input.setAttribute("spellcheck", "false");
                    input.style = `
                        background-color: var(--secondary-color);
                        border-radius: 0.25rem;
                        width: 100%;
                        height: 10rem;
                        resize: none;
                        outline: none;
                        color: var(--title-color);
                        border-color: var(--main-button-color);
                    `;

                    input.addEventListener("change", (e)=>{
                        var val = e.target.value;
                        timelineEl.config.value = val;
                        refreshViewport(true);
                    })

                    wrapper.appendChild(input);

                    var wr = document.createElement("div");
                    wr.className = "alignment-wrapper";
                    wr.style = `
                        width: 100%;
                        height: fit-content;
                        display: flex;
                        align-items: center;
                    `

                    var title = document.createElement("p");
                    title.innerHTML = "Text alignment"
                    title.style = `
                        line-height: 1rem;
                        font-weight: lighter;
                        margin: 1rem 0 0.5rem 0;
                    `
                    wrapper.appendChild(title);

                    //Handle the press of either of the upcoming alignment
                    //buttons
                    var handleAlignmentClick = function(e) {
                        var els = e.target.closest(".alignment-wrapper").children;
                        var x;
                        
                        for(x of els) {
                            x.classList.remove("selected");
                        }

                        e.target.closest(".text-positioning").classList.add("selected");

                        //get the button type
                        var type = e.target.closest(".text-positioning").variant;
                        timelineEl.config.widgetAttributes.text.align = type;
                        
                        refreshViewport(true);
                    }



                    var left = document.createElement("button");
                    left.variant = "left";
                    left.className = "text-positioning";
                    var ico = document.createElement("i");
                    ico.className = "material-icons";
                    ico.innerHTML = "format_align_left";
                    left.appendChild(ico);
                    wr.appendChild(left);
                    left.addEventListener("click", handleAlignmentClick)

                    var center = document.createElement("button");
                    center.variant = "center";
                    center.className = "text-positioning";
                    var ico = document.createElement("i");
                    ico.className = "material-icons";
                    ico.innerHTML = "format_align_center";
                    center.appendChild(ico);
                    wr.appendChild(center);
                    center.addEventListener("click", handleAlignmentClick)

                    var right = document.createElement("button");
                    right.variant = "right";
                    right.className = "text-positioning";
                    var ico = document.createElement("i");
                    ico.className = "material-icons";
                    ico.innerHTML = "format_align_right";
                    right.appendChild(ico);
                    wr.appendChild(right);
                    right.addEventListener("click", handleAlignmentClick)

                    //Get the actual setting, and apply it to the buttons
                    var sett = timelineEl.config.widgetAttributes.text.align;
                    switch(sett) {
                        case "left":
                            right.classList.remove("selected");
                            center.classList.remove("selected");
                            left.classList.add("selected");
                        break;
                        case "center":
                            right.classList.remove("selected");
                            left.classList.remove("selected");
                            center.classList.add("selected");
                        break;
                        case "right":
                            left.classList.remove("selected");
                            center.classList.remove("selected");
                            right.classList.add("selected");
                        break;
                    }


                    wrapper.appendChild(wr);
                break;
                case "time": {


                    var extra = document.createElement("div");
                    extra.style = `
                        width: 100%;
                        display: block;
                        margin-top: 1rem;
                    `;
                    extra.className = "time-meta"


                    var handleTimeOptionsChange = function(e) {
                        var value = e.target.checked;

                        var name = e.target.parentNode.getAttribute("name");
                        switch(name) {
                            case "Hours":
                                data.widgetAttributes.time.showHours = value;
                            break;
                            case "Minutes":
                                data.widgetAttributes.time.showMinutes = value;
                            break;
                            case "Seconds":
                                data.widgetAttributes.time.showSeconds = value;
                            break;
                        }

                        //Update the viewport and preview element
                        // true: refresh the preview as well
                        refreshViewport(true);

                    }

                    var generateDateOptions = function() {
                        var el = document.createElement("div");
                        el.className = "date-options";
                        el.style = `
                            height: fit-content;
                            width: 100%;
                            padding: 0 0 0 2rem;
                            box-sizing: border-box;
                        `
                        var format1 = tabInputs.checkBox("DD/MM/YYYY");
                        el.appendChild(format1);

                        var format2 = tabInputs.checkBox("MM/DD/YYYY");
                        el.appendChild(format2)

                        return el;
                    }

                    //Time format selector
                    var timeFormat = tabInputs.select(["AM/PM", "24HRS"], false, "Time format");
                    timeFormat.style = `
                        margin: 0;
                        margin-top: 3.5rem;
                        width: 10rem;
                        height: 4rem;
                        display: block;
                    `;
                    var format = data.widgetAttributes.time.timeFormat;
                    console.log(format)
                    timeFormat.getElementsByTagName("select")[0].value = format;
                    timeFormat.getElementsByTagName("select")[0].addEventListener("change", (e) => {
                        data.widgetAttributes.time.timeFormat = timeFormat.getElementsByTagName("select")[0].value;
                        refreshViewport(true);
                    })


                    extra.appendChild(timeFormat);

                    var hours = tabInputs.checkBox("Hours");
                    hours.childNodes[0].childNodes[1].checked = data.widgetAttributes.time.showHours;
                    extra.appendChild(hours);
                    hours.childNodes[0].childNodes[1].addEventListener("change", handleTimeOptionsChange); 
                    hours.style.marginTop = "3rem";

                    var minutes = tabInputs.checkBox("Minutes");
                    minutes.childNodes[0].childNodes[1].checked = data.widgetAttributes.time.showMinutes;
                    extra.appendChild(minutes);
                    minutes.childNodes[0].childNodes[1].addEventListener("change", handleTimeOptionsChange); 
                    
                    var seconds = tabInputs.checkBox("Seconds");
                    seconds.childNodes[0].childNodes[1].checked = data.widgetAttributes.time.showSeconds;
                    extra.appendChild(seconds);
                    seconds.childNodes[0].childNodes[1].addEventListener("change", handleTimeOptionsChange); 


                    var date = tabInputs.checkBox("Show date");
                    extra.appendChild(date);
                    date.style.marginTop = "1rem";
                    date.childNodes[0].childNodes[1].addEventListener("change", function(e) {
                        var value = e.target.checked;
                        data.widgetAttributes.time.showDate = e.target.checked;
                        var options;
                        if(value) {
                            options = generateDateOptions();
                            extra.appendChild(options);
                            options.childNodes[0].childNodes[0].childNodes[1].checked = true;
                            options.childNodes[0].childNodes[0].childNodes[1].disabled = true;
                            options.childNodes[1].childNodes[0].childNodes[1].disabled = true;

                        } else {
                            var el = extra.querySelector(".date-options");
                            el.parentNode.removeChild(el);
                        }
                        // true --> refresh preview as well
                        refreshViewport(true);
                    });

                    inputCont.appendChild(extra)


                }
                case "weather": 
                    var custom = customisation(timelineEl.config);
                    wrapper.appendChild(custom);
                break;
                case "news":
                    var custom = customisation(timelineEl.config);
                    wrapper.appendChild(custom);
                break;
                case "script":
                    var custom = customisation(timelineEl.config);
                    wrapper.appendChild(custom);
                    //Create script edit button

                    var p = document.createElement("p");
                    p.innerHTML = "Script properties";
                    wrapper.appendChild(p);
                    p.style = `
                        margin: 1rem 0 0.5rem 0.5rem;
                        font-weight: lighter;
                        color: var(--paragraph-color);
                    `

                    var butt = document.createElement("button");
                    butt.innerHTML = "Edit Script";
                    butt.className = "fd-button important"
                    butt.style.marginLeft = "0.5rem";
                    infoOnHover(butt, "Edit the script of the selected element")
                    wrapper.appendChild(butt);

                    butt.onclick = function() {
                        editScript(timelineEl);
                    }

                    var rerun = document.createElement("button");
                    rerun.innerHTML = "Rerun script";
                    rerun.className = "fd-button important"
                    rerun.style.marginLeft = "0.5rem";
                    infoOnHover(rerun, "Reinitializes the script");
                    rerun.disabled = true;
                    wrapper.appendChild(rerun);

                    

                break;
                case "progress":
                    var custom = customisation(timelineEl.config);
                    wrapper.appendChild(custom);

                    var content = progContent(timelineEl.config);
                    wrapper.appendChild(content);
                    content.querySelector(".scale").getElementsByTagName("input")[0].addEventListener("change", (e) => {
                        var val = e.target.value;
                        timelineEl.config.widgetAttributes.progress.scale = val/100; //Because the value is <0,1>*100
                        refreshViewport(true);
                    });
                break;
            }

                break;

                case "vid": 
                    media = document.createElement("video");
                    var srcEl = document.createElement("source");
                    media.appendChild(srcEl);
                    srcEl.src = dirName + "/" + elPath;
                break;

    }


    previewElement.appendChild(media);
    preview.appendChild(previewElement);


        //Initialize the preview image with the timeline element config
    media.style.opacity = data.opacity;
    media.style.borderRadius = data.borderRadius+"rem";
    media.style.boxShadow = data.shadowMultiplier + "px " + data.shadowMultiplier + "px " + 1.3*data.shadowMultiplier + "px 0px rgba(0,0,0,0.75)";
    media.style.filter = "blur(" + data.blur + "px)";

}






function closeOpenTab() {
    //The function is called from the shortcut "Ctrl+W", and it closes the
    //currently active tab.

    //Get the active tab and its corresponding timeline element
    var tabs = document.getElementsByClassName("tab");
    var x;
    if(!tabs[0]) return;
    for(x of tabs) {
        if(x.selected) {
            removeTab(x.connectedElement);
        }
    }
}


function tabMsg(msg) {
    var el = document.createElement("div");
    el.className = "tab-notification smooth-shadow";
    var olds = document.getElementsByClassName("tab-notification");
    if(olds.length > 0) {
        var x;
        for(x of olds) {
            x.parentNode.removeChild(x);
        }
    }
    var text = document.createElement("p");
    text.innerHTML = msg;
    el.appendChild(text);
    var cont = document.getElementsByClassName("properties-pane")[0];
    cont.appendChild(el);
    setTimeout(() => {
        try {
            el.parentNode.removeChild(el);
        } catch (error) {
            //Oopsies, the element doesn't exist anymore.
            //TOO BAD!
        }
    }, 3000)
}