
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
    els.innerHTML = "";

    var cont = document.createElement("div");
    cont.setAttribute("class", "container");
    els.appendChild(cont);
    

    var elPath = timelineEl.getAttribute("fileName");
    var h1 = document.createElement("h1");
    h1.setAttribute("class", "title");
    h1.innerHTML = elPath;
    cont.appendChild(h1);

    //Create a file preview
    var preview = document.createElement("div");
    preview.className = "preview-window";

    cont.appendChild(preview);

    var dirName; 
    if(isPackaged) {
        dirName = path.join(path.dirname(__dirname), "extraResources", "data", "files");
    } else {
        dirName = path.join(__dirname, "extraResources", "data", "files");
    }
    var previewElement = document.createElement("div");
    var type = timelineEl.getAttribute("type");
    console.log(type);
    var media;
    switch(type) {
        case "img": 
            media = document.createElement("img");
            media.src = dirName + "/" + elPath;
        break;
    }

    previewElement.appendChild(media);
    preview.appendChild(previewElement);

    //Get the timeline element config
    var data = timelineEl.config[0];

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