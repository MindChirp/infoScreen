
//var path = require("path");
const tabInputs = new TabSystem();

function createTab(el, name) {
    if(document.getElementsByClassName("browser-tab-container")[0].querySelector("#empty")) {
        document.getElementsByClassName("browser-tab-container")[0].innerHTML = "";
    }

    var tab = document.createElement("button");
    tab.setAttribute("class", "tab smooth-shadow");
    tab.connectedElement = el;
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
    openTab(tab);
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
            
            el.setAttribute("hasTab", "false")
            x.parentNode.removeChild(x);
            
        }
    }
    var container = document.getElementsByClassName("browser-tab-container")[0];
    if(container.innerHTML.length == 0) {
        var p = document.createElement("p");
        p.setAttribute("id", "empty");
        p.innerHTML = "Click on an element's properties to create a tab";
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
        dirName = path.join(path.dirname(__dirname), "extraResources", "data", "files");
    } else {
        dirName = path.join(__dirname, "extraResources", "data", "files");
    }
    var previewElement = document.createElement("div");
    var type = timelineEl.getAttribute("type");
    var media;
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
            var widget = createWidget(type, timelineEl.config[0], timelineEl);

            widget.style.backgroundColor = "var(--main-bg-color)";
            widget.style.width = "100%";
            widget.style.height = "100%";

            //Append widget to the preview wrapper
            media.appendChild(widget);
        break;
    }

    previewElement.appendChild(media);
    preview.appendChild(previewElement);




    //Get the timeline element config
    var data = timelineEl.config[0];

    //Initialize the preview image with the timeline element config
    media.style.opacity = data.opacity;
    media.style.borderRadius = data.borderRadius+"rem";
    media.style.boxShadow = data.shadowMultiplier + "px " + data.shadowMultiplier + "px " + 1.3*data.shadowMultiplier + "px 0px rgba(0,0,0,0.75)";
    media.style.filter = "blur(" + data.blur + "px)";



    var inputCont = document.createElement("div");
    cont.appendChild(inputCont);
    inputCont.style = `
        width: 10rem;
        height: fit-content;
        display: inline-block;
        float: left;
        white-space: normal;
    `
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
        timelineEl.config[0].borderRadius = value;
        if(renderer.isRendered(timelineEl)) {
            var colNo = renderer.renderedColumn();
            renderColumn(colNo);
        }
    }); 
    radius.style.marginTop = "0.5rem";
    inputCont.appendChild(radius);

    var info = createInfoCircle(`
        '<b>rem</b>' is a unit which is adjusted relative 
        to the standard font size. Therefore, rounded borders
        will look good on many screen sizes.
    `);
    infoOnHover(info, "Why use rem?");
    radius.appendChild(info);

    var opacity = tabInputs.input("Opacity", "number");
    opacity.childNodes[1].value = data.opacity;
    opacity.childNodes[1].placeholder = 1;
    opacity.childNodes[1].max = 1;
    opacity.childNodes[1].min = 0;
    opacity.childNodes[1].addEventListener("change", function(e) {
        var value = e.target.value;
        if(e.target.value == "") {
            value = 1;
        }
        media.style.opacity = value;
        //Update the timeline element
        timelineEl.config[0].opacity = value;
        if(renderer.isRendered(timelineEl)) {
            var colNo = renderer.renderedColumn();
            renderColumn(colNo);
        }
    }); 


    inputCont.appendChild(opacity);

    var shadowSize = tabInputs.slider("Shadow size");
    shadowSize.childNodes[1].max = 20;
    shadowSize.childNodes[1].min = 0;
    shadowSize.childNodes[1].value = data.shadowMultiplier;
    
    shadowSize.childNodes[1].addEventListener("change", function(e) {
        var value = e.target.value;
        media.style.boxShadow = value + "px " + value + "px " + 1.3*value + "px 0px rgba(0,0,0,0.75)";
        //Update the timeline element
        timelineEl.config[0].shadowMultiplier = value;
        if(renderer.isRendered(timelineEl)) {
            var colNo = renderer.renderedColumn();
            renderColumn(colNo);
        }
    }); 


    inputCont.appendChild(shadowSize);

    var blur = tabInputs.slider("Blur");
    blur.childNodes[1].max = 20;
    blur.childNodes[1].min = 0;
    blur.childNodes[1].step = 0.5;
    blur.childNodes[1].value = data.blur;
    
    blur.childNodes[1].addEventListener("change", function(e) {
        var value = e.target.value;
        media.style.filter = "blur(" + value+"px)";
        //Update the timeline element
        timelineEl.config[0].blur = value;
        if(renderer.isRendered(timelineEl)) {
            var colNo = renderer.renderedColumn();
            renderColumn(colNo);
        }
    }); 


    inputCont.appendChild(blur);



    var hide = tabInputs.checkBox("Hide");
    hide.childNodes[0].childNodes[1].value = true;
    hide.childNodes[0].childNodes[1].addEventListener("change", function(e) {
        if(e.target.isActive) {
            e.target.isActive = false;
        } else {
            e.target.isActive = true;
        }
        var value = e.target.isActive;      
        var setting;
        switch(value) {
            case true:
                setting = "none";
            break;
            case false:
                setting = "block";
            break;
        }
        //Update the timeline element
        timelineEl.config[0].display = setting;

        if(renderer.isRendered(timelineEl)) {
            var colNo = renderer.renderedColumn();
            renderColumn(colNo);
        }
    }); 


    inputCont.appendChild(hide);
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