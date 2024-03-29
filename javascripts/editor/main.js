const { remote, ipcRenderer } = require("electron");
const { fstat } = require("fs-extra");
const [yourBrowserWindow] = remote.BrowserWindow.getAllWindows();
const util = require("util");
var globalSettings;
var settingsDirectory;
var preventUndoOrRedo = false;
var overlaySettingsDirectory;
const serverAddress = "https://shrouded-wave-54128.herokuapp.com";
var { app } = require("electron");
var updateBrowser = false;
var fse = require("fs-extra");

var filesPath;
ipcRenderer.on("files-path", (e, data) => {
    localStorage.setItem("filesPath", data);
});

function genericStartupFunction() {
    
    filesPath = localStorage.getItem("filesPath");

    if(isPackaged) {
        settingsDirectory = path.join(path.dirname(__dirname), "extraResources", "data", "programData", "settings", "generalSettings.json");
        overlaySettingsDirectory = path.join(path.dirname(__dirname), "extraResources", "data", "programData", "settings", "overlaySettings.json");
        keybindsDirectory = path.join(path.dirname(__dirname), "extraResources", "data", "programData", "settings", "editableKeyBinds.json");
    } else {
        settingsDirectory = path.join(__dirname, "extraResources", "data", "programData", "settings", "generalSettings.json");
        overlaySettingsDirectory = path.join(__dirname, "extraResources", "data", "programData", "settings", "overlaySettings.json");
        keybindsDirectory = path.join(__dirname, "extraResources", "data", "programData", "settings", "editableKeyBinds.json");
    }
    loadSettingsConfig();
}


function loadSettingsConfig() {
    console.log(fs.readFileSync(settingsDirectory, "utf8"))
    globalSettings = JSON.parse(fs.readFileSync(settingsDirectory, "utf8"));
}


yourBrowserWindow.on("blur", (e) => {
    removeCtxMenu("unfocus");
    var appBar = document.getElementById("app-bar");
    appBar.style.opacity = 0.5;
    try {
        document.getElementById("project-name").style.opacity = 0.5;
    } catch (error) {
        //Could not dim the app bar
    }
})


const appVersion = require('electron').remote.app.getVersion();



yourBrowserWindow.on("focus", (e) => {
    var appBar = document.getElementById("app-bar");
    appBar.style.opacity = 1;

    document.getElementById("project-name").style.opacity = 1;

})


const elementsToRemove = ["menu-overlay"];

document.addEventListener("click", function(e) {
    if(document.getElementsByClassName("file-dropdown-menu")) {
        var els = document.getElementsByClassName("file-dropdown-menu");
        var x;
        for(x of els) {
            if(!e.target.closest(".file-dropdown-menu")) {
                x.parentNode.removeChild(x);
            }
        }
    }

    var x;
    for(x of elementsToRemove) {
        var els = document.getElementsByClassName(x);
        var y;
        for(y of els) {
            y.parentNode.removeChild(y);
        }
    }
    


});

document.addEventListener("mousedown", function(e) {
    //Check if any prompts are open
    if(!e.target.closest(".sub-menu")) {
        var prompts = document.getElementsByClassName("sub-menu");
        var x;
        for(x of prompts) {
            if(x.style.display != "none") {
                x.style.display = "none";
            }
        }
    }
})

document.addEventListener("wheel", function(e) {
    if(document.getElementsByClassName("file-dropdown-menu")) {
        var els = document.getElementsByClassName("file-dropdown-menu");
        var x;
        for(x of els) {
            if(!e.target.closest(".file-dropdown-menu")) {
                x.parentNode.removeChild(x);
            }
        }
    }

    if(document.getElementsByClassName("context-menu")) {
        var els = document.getElementsByClassName("context-menu");
        var x;
        for(x of els) {
            if(!e.target.closest(".context-menu")) {
                x.parentNode.removeChild(x);
            }
        }
    }
})


function explorerMsg(message) {
    var el = document.createElement("div");
    el.className = "explorer-notification smooth-shadow";
    var olds = document.getElementsByClassName("explorer-notification");
    if(olds.length > 0) {
        var x;
        for(x of olds) {
            x.parentNode.removeChild(x);
        }
    }
    var text = document.createElement("p");
    text.innerHTML = message;
    el.appendChild(text);
    var cont = document.getElementsByClassName("browser-container")[0];
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

function infoOnHover(el, txt) {
    el.addEventListener("mouseenter", function(event) {
    var mouseover = true;

    el.addEventListener ("mouseleave", function(event1) {
        mouseover = false;
        if(document.getElementsByClassName("information-popup")) {
            var popups = document.getElementsByClassName("information-popup");

            for(let i = 0; i < popups.length; i++) {
                popups[i].parentNode.removeChild(popups[i]);
            }
        }
    })

    setTimeout(function() {
        if(mouseover == true) {
            //The mouse has hovered over the element for long enough
            var info = document.createElement("div");
            info.setAttribute("class", "information-popup smooth-shadow");
            info.innerHTML = txt;
            var element = event.target;
            var triggerElementWidth = element.offsetWidth;
            var x = element.getBoundingClientRect().left;
            var y = element.getBoundingClientRect().top;

            info.setAttribute("style", `
                height: fit-content; 
                width: fit-content;
                background-color: #0a0d10;
                border-radius: 0.5rem;
                padding: 1rem;
                color: white;
                position: absolute;
                z-index: 110;
                left: ` + Math.round(x + triggerElementWidth/2) + `px;
                top: ` + y + `px;
                transform: translateX(-50%) translateY(-110%);
                animation: fade-in 200ms ease-in-out;
                opacity: 0.95;
            `);
            document.body.appendChild(info);
            
            var elWidth = info.offsetWidth;
            if(x-elWidth/2 < 0 || x+elWidth/2 > window.innerWidth) {
                if(x-elWidth/2 < 0) {
                    var offset = x-elWidth/2
                    info.style.left = 10 + elWidth/2 + "px";
                } else if(x+elWidth/2 > window.innerWidth) {
                    var offset = x+elWidth/2 - window.innerWidth;
                    info.style.right = "0"

                }
            }

        }
    }, 1000)
})
}



function activateBrowserItem(arg, el) {
    var butts = document.getElementById("browser").querySelector(".side-bar").querySelector(".buttons-container").getElementsByTagName("div");

    /*
    
    FEATURE ADDITION:

    Make a sliding animation between the clicked buttons
    */


    var index = 0;
    while(el != butts[index]) {
        index++
    }

    //Get index of already active item
    var active = document.getElementById("browser").querySelector(".side-bar").querySelector(".selected");
    var index1 = 0;
    if(active) {
        while(butts[index1] != active) {
            index1++;
        }
    } else {
        index1 = undefined;
    }

    var sideBar = document.querySelector("#browser > div:nth-child(1) > div.side-bar > div");
    //Create the sliding bar
        //Delete any possible bar
    if(sideBar.querySelector(".sliding-bar")) {
        sideBar.removeChild(sideBar.querySelector(".sliding-bar"));
    }
    var play = false;
    var bar = document.createElement("div");
    bar.className = "sliding-bar";
    document.querySelector("#browser > div:nth-child(1) > div.side-bar > div").appendChild(bar);
    //Calculate marginTop
    var mTop = index1*3;
    var targetmTop = index*3;
    if(!isNaN(mTop)) {bar.style.top = mTop + "rem"; play = true;}

    var calculateMovement = ()=>{
        //Get the amount needed to transform
        //mTop, targetmTop
        var rems = targetmTop - mTop;
        bar.style.transform = "translateY(" + rems + "rem)"
    }

    if(play) {
        bar.style.display = "block";
        setTimeout(()=>{
            calculateMovement();
        }, 10)
    } else {
        //Show the bar
        bar.style.top = targetmTop + "rem";
        bar.style.display = "block";
    }


    //Deactivate all other menu buttons, activate the one that was clicked
    
    var x;
    for(x of butts) {
        /*x.style.border = "none";        
        x.style.width= "4rem";*/
        x.classList.remove("selected");
    }
    el.classList.add("selected");
/*
    el.style.border = "solid white";
    el.style.borderWidth="0 0 0 0.2rem";
    el.style.width="3.6rem";*/


    //Activate the corresponding page in the browser
    switch(arg) {
        case "edit":
            deactivateOtherPages();
            document.getElementById(arg).style.display = "block";
            updateEditPage();
        break;
        case "widgets":
            deactivateOtherPages();
            document.getElementById(arg).style.display = "grid";
        break;
        case "files":
            deactivateOtherPages();
            document.getElementById(arg).style.display = "grid";
        break;
    }



//FIX THIS CODE PLSSSS
    function deactivateOtherPages() {
        var pages = [document.getElementById("edit"), document.getElementById("widgets"), document.getElementById("files")];
        var y;
        for(y of pages) {
                y.style.display = "none";
        }
    }

}

//Check if an element is a child of another.
//Thanks to Anna on stack overflow <3333
function isDescendant(parent, child) {
    var node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}



function getColorProperty(theme, attr) {
    return new Promise((resolve, reject)=> {

        //Load the config
        fse.readFile(path.join(filesPath, "configs", "themes.json"), "utf8")
        .then((data)=>{
            var res = JSON.parse(data);
            var themeString;
            switch(theme) {
                case 0:
                    themeString = "lightTheme";
                break;
                case 1:
                    themeString = "darkTheme";
                break;
            }
                    
            //Now, remove dashes from the attribute name
            var newAttr = attr.replace(/-/g, "");
            var vals = res[themeString][newAttr];
            resolve(vals);
        })
        .catch((error)=>{
            reject(error);
        })
    })
}


function mergeThemesFiles() {
    fse.copyFile(path.join(__dirname, "internalResources", "configs", "themes.json"), path.join(filesPath, "configs", "themes.json"))
    .then(()=>{
        console.log("%cMerged the theme files", "color: red; font-size: 2rem;")
    })
    .catch((error)=>{
        alert(error);
    })
}

var themeTypes = [
    "--main-bg-color",
    "--title-color", 
    "--paragraph-color", 
    "--secondary-color",
    "--main-button-color",
    "--secondary-button-color",
    "--slider-color",
    "--cell-selection-color",
    "--column-selection-color"
];

async function setTheme(theme) {
    if(theme == 0) {

        var x;
        for(x of themeTypes) {
            var property = await getColorProperty(theme, x);
            document.documentElement.style.setProperty(x, property);
        }
        localStorage.setItem("theme", "light");

    } else if(theme == 1) {
        var x;
        for(x of themeTypes) {
            var property = await getColorProperty(theme, x);
            document.documentElement.style.setProperty(x, property);
        }
        localStorage.setItem("theme", "dark");
        
    } else if(theme == 2) {
        document.documentElement.style.setProperty("--main-bg-color", "linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)");
        document.documentElement.style.setProperty("--title-color", "red");
        document.documentElement.style.setProperty("--paragraph-color", "aqua");
        document.documentElement.style.setProperty("--secondary-button-color", "#B2AB92");
        document.documentElement.style.setProperty("--secondary-color", "purple");
        document.documentElement.style.setProperty("--main-button-color", "#FFBD00");
        document.documentElement.style.setProperty("--slider-color", "#CC99FF");
        localStorage.setItem("theme", "cancer");
    }
}

    //Columns
/* x x x x x x x
   x 0 0 0 0 0 0
   x 0 0 0 0 0 0
   x 0 0 0 0 0 0
   x 0 0 0 0 0 0
   x 0 0 0 0 0 0
   */



function initScrubber(rows,cols,activeColumn) {
    //Create columns
    var cont = document.getElementById("timeline").querySelector(".sub-container").querySelector(".scrubber");
    for(let i = 0; i < cols; i++) {
        var col = document.createElement("div");
        col.setAttribute("class", "timeline-column");
        //Set up the column config
        cont.appendChild(col);
        col.setAttribute("onmouseenter", "highlightColumn(this, true)");
        col.setAttribute("onmouseleave", "highlightColumn(this, false)");

        //Create an observer for the timeline columns
        const observerOptions = {
            childList: true,
            attributes: false,
            subtree: true
        }
  
        const observer = new MutationObserver(columnChangeCallBack);

        observer.observe(col, observerOptions);
        //Setup the column
        col.config = {
            time: {minutes: 0, seconds: 10},
            transition: "none",
            customViewingTimes: {enabled: false, times: []}
        };
        
        /*
        //White line on top of timeline (disabled)
        var pos = document.createElement("div");
        if(i == activeColumn) {
            pos.setAttribute("active", "true");
        }
        document.getElementById("timeline").querySelector(".sub-container").querySelector(".top-bar").appendChild(pos);
        */
        
        //Create rows
        for(let k = 0; k < rows; k++) {
            var row = document.createElement("div");
            /*if(k % 2 != 0) {
                row.setAttribute("version", "B");
            } else {
                row.setAttribute("version", "A");
            }*/
            row.setAttribute("class", "timeline-row");
            row.setAttribute("droppable", "");
            row.onclick = (e) => {
                //Trigger the box selection code
                selectCell(e.target.closest(".timeline-row"));   
            }
            row.selected = false;
            row.setAttribute("oncontextmenu", "contextMenu(event, this, 0)")
            //row.setAttribute("onmouseenter", "highlightColumn(this, true)");
            //row.setAttribute("onmouseleave", "highlightColumn(this, false)");
            col.appendChild(row);
        }

    }
    
    calculateColumnHeights();
    cont.childNodes[activeColumn].setAttribute("displaying", "true");

}




function infoBox(el, title) {
    //Display an information box next to the desired element
    //when it is clicked
    el.addEventListener("click", function(event) {
    
        var cont = document.createElement("div");
        cont.setAttribute("class", "smooth-shadow information-card");
        cont.setAttribute("style", `
            height: fit-content;
            width: fit-content;
            max-width: 15rem;
            background-color: var(--secondary-color);
            z-index: 101;
            padding: 0 1rem;
            font-weight: lighter;
            border-radius: 0.5rem;
            animation: fade-in 100ms ease-in-out;
        `);
        
        //background-color: #0a0d10;

        var text = document.createElement("p");
        text.style.lineHeight = "1rem";
        text.style.marginTop ="1em";
        text.style.marginBottom ="1em";
        text.innerHTML = title;
        cont.appendChild(text);


        var x = event.clientX;
        var y = event.clientY;
    
        cont.style.position = "absolute";
    
        cont.style.top = y + "px";
        cont.style.left = x + "px";
    
    setTimeout(function() {
        document.body.appendChild(cont);
    }, 100);
    
    });
}

function createInfoCircle(content) {
    var info = document.createElement("div");
    info.setAttribute("class", "info-circle");
    info.innerHTML = "?";
    info.setAttribute("style", `
        margin-top: 0.5rem;
    `);
    infoBox(info, content);
    return info;
}


document.addEventListener("click", function() {
    if(document.getElementsByClassName("information-card")[0]) {

        var element = document.getElementsByClassName("information-card")[0] 
        var inside = element.contains(event.target);
    }

    if(!inside) {
        if(element) {
            element.parentNode.removeChild(element);

        }
    }
    
})




function menu(type) {     
    var el = document.createElement("div");
    el.setAttribute("class", "menu");
    document.body.appendChild(el);
    switch(type) {
        case "user":

            var header = document.createElement("div");
            header.setAttribute("class", "header");
            el.appendChild(header);

        break;
    }

    var back = document.createElement("button");
    back.setAttribute("class", "fd-button smooth-shadow back-button");
    back.setAttribute("style", `
        position: absolute;
        bottom: 1rem;
        left: 1rem;
        height: 3rem;
        width: 3rem;
        z-index: 10;
    `);

    infoOnHover(back, "Go back");

    back.addEventListener("click", function() {
        el.parentNode.removeChild(el);
        if(document.getElementsByClassName("information-popup")) {
            document.getElementsByClassName("information-popup")[0].parentNode.removeChild(document.getElementsByClassName("information-popup")[0])
        }
    })

    var ico = document.createElement("i");
    ico.setAttribute("class", "material-icons");
    ico.innerHTML = "keyboard_backspace";
    back.appendChild(ico);
    ico.setAttribute("style", `
        line-height: 3rem;
        font-size: 1.4rem;
        text-align: center;
        transform: translateX(-0.15rem);
    `)

    el.appendChild(back);
    return el;
}


function contextMenu(ev, el, type) {
    if(el == ev.target) {
        if(document.getElementsByClassName("context-menu")) {
            var els = document.getElementsByClassName("context-menu");
            var x;
            for(x of els) {
                x.parentNode.removeChild(x);
            }
        }
    
        var menu;
        
        
        var hasTab = el.getAttribute("hasTab");
        switch(type) {
            case 0:
                menu = createCtxMenu([["Undo", "Ctrl+Z", "undo()"], ["Redo", "Ctrl+Y", "redo()"]]);
                menu.childNodes[0].disabled = true;
                menu.childNodes[1].disabled = true;
            break;
            case 1:
                //Image
                menu = createCtxMenu([["Delete", "Del"], ["Properties", "Ctrl+P"]])
                menu.setAttribute("rootElement", el);
                menu.childNodes[0].addEventListener("click", function(e) {
                    renderer.unrender(el);
                    deleteFile(false, el, ev);

                    //Remove the associated tab (if there is one)
                    removeTab(el.closest(".scrubber-element"));
                });
                menu.childNodes[1].addEventListener("click", function(e) {
                    openPropertiesTab(el);
                    menu.childNodes[1].disabled = true;
                });

                if(hasTab == "true") {
                    //Disable elements if the file has a tab
                    menu.childNodes[1].disabled = true;
                } else {
                    menu.childNodes[1].disabled = false;

                }
            break;
            case 2:
                //Widget 
                menu = createCtxMenu([["Delete", "Del"], ["Properties", "Ctrl+P"]])
                
                menu.setAttribute("rootElement", el);

                menu.childNodes[1].addEventListener("click", function(e) {
                    menu.childNodes[1].disabled = true;
                    openPropertiesTab(el);
                });

                menu.childNodes[0].addEventListener("click", function(e) {
                    renderer.unrender(el);
                    deleteFile(false, el, ev);

                    //Remove the associated tab (if there is one)
                    removeTab(el.closest(".scrubber-element"));
                });


                if(hasTab == "true") {
                    //Disable elements if the file has a tab
                    menu.childNodes[1].disabled = true;
                } else {
                    menu.childNodes[1].disabled = false;

                }
            break;    
        }
        
        
    
        setTimeout(function() {
            document.body.appendChild(menu);
        }, 10)
        menu.style.top = ev.clientY + "px";
        menu.style.left = ev.clientX + "px";
    
        document.addEventListener("mousedown", removeCtxMenu);
        setTimeout(function() {
            document.addEventListener("contextmenu", removeCtxMenu);
        }, 10);
    }
}

function createCtxMenu(bts) {
    var el = document.createElement("div");
    el.setAttribute("class", "context-menu smooth-shadow");
    
    var x;
    for(x of bts) {
        var b = document.createElement("button");
        b.innerHTML = x[0];
        el.appendChild(b);

        var desc = document.createElement("div");
        desc.setAttribute("class", "key-bind");
        b.appendChild(desc);
        desc.innerHTML = x[1];
        b.setAttribute("onclick", x[2]);
    }

    return el;
}

function removeCtxMenu(e) {
    if(document.getElementsByClassName("context-menu")[0]) {
        if(e == "unfocus") {
            var el = document.getElementsByClassName("context-menu")[0];
            el.parentNode.removeChild(el);
            document.removeEventListener("click", removeCtxMenu);
            document.removeEventListener("contextmenu", removeCtxMenu);
            return;
        }
        if(e.target != document.getElementsByClassName("context-menu")[0] && !isDescendant(document.getElementsByClassName("context-menu")[0], e.target)) {
            var el = document.getElementsByClassName("context-menu")[0];
            el.parentNode.removeChild(el);
            document.removeEventListener("click", removeCtxMenu);
            document.removeEventListener("contextmenu", removeCtxMenu);
        }
    }
}

function generateIntroText() {
    var texts = [
        "Ye like dick n' balls?",
        "Hitler was right",
        "Holocaust didn't happen",
        "George Bush did 9/11",
        "MAGA 2020",
        "White lives matter",
        "Aryan race for the win!",
        "Blue lives matter",
        "Kalkulatoren til Nora, Sara, Leja og Frikk er mye bedre enn kalkulatorene til Ola, Jakob og Jesper",
        "Jews should be burned",
        "Look behind you",
        "5G causes cancer",
        "Vaccines causes autism",
        "Bill Gates is worse than satan",
        "Judas is worse than Hitler",
        "Stalin only wanted what was best for the USSR"
    ]

    var ran = Math.round(getRandomArbitrary(0,texts.length-1));
    return texts[ran];
}


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clickScrubberElement(el) {
    if(el.getAttribute("selected") != "true") {
        el.style.opacity = "1";
    } else {
        //Not selected, select the element
        el.style.opacity = "0.5";
    }
}


function deleteFile(fromShortcut, el, event) {
    if(fromShortcut) {
        //Get all the selected elements
        var els = document.getElementsByClassName("timeline-row selected");
        var x;
        for(x of els) {
            if(x.querySelector(".scrubber-element")) {
                var el = x.querySelector(".scrubber-element");
                renderer.unrender(el);
                removeTab(el);

                var clip = {type: "file", action: "delete", config: el.config, connectedElement: el, parent: el.parentNode};
                undoClipboard.push(clip);

                el.parentNode.removeChild(el);
                document.querySelector('#viewport > div.controls').style.opacity = "1";
                document.querySelector('#viewport > div.controls').style.pointerEvents = "";
            }
        }
        unselectAllCells();
    } else {
        var root = el.closest(".scrubber-element");
        //The viewport controls might be opaque because the deleted element
        //is selected. Fix it.
        document.querySelector('#viewport > div.controls').style.opacity = "1";
        document.querySelector('#viewport > div.controls').style.pointerEvents = "";

        var clip = {type: "file", action: "delete", config: root.config, connectedElement: root, parent: root.parentNode};
        undoClipboard.push(clip);

        root.parentNode.removeChild(root);
        setTimeout(function() {
            removeCtxMenu(event);
        //Should there be a timeout for the context menu to dissapear?
        });
        unselectAllCells();
    }
}


function fileDropdownMenu(el) {
    //Creates a dropdown menu for a file, for when the three vertival
    //dots are clicked.
    setTimeout(function() {
        
        var dropDown = document.createElement("div");
        dropDown.setAttribute("class","file-dropdown-menu smooth-shadow");
        dropDown.style.display = "block";
        dropDown.style.position = "absolute";

        var p = document.createElement("p");
        p.setAttribute("style", `
            width: 100%;
            text-align: center;
            margin-top: 0.5rem;
            color: var(--title-color);  
        `);
        p.innerHTML = "Quick Options";
        dropDown.appendChild(p);

        var b = document.createElement("button");
        b.setAttribute("style", "display: block; margin: auto;")
        b.setAttribute("class", "fd-button");
        b.innerHTML = "Set as default in current layer";
        dropDown.appendChild(b);

        var b = document.createElement("button");
        b.setAttribute("style", "display: block; margin: auto; margin-top: 0.2rem;")
        b.setAttribute("class", "fd-button");
        b.innerHTML = "Set as default to the right";
        dropDown.appendChild(b);

        var b = document.createElement("button");
        b.setAttribute("style", "display: block; margin: auto; margin-top: 0.2rem;")
        b.setAttribute("class", "fd-button");
        b.innerHTML = "Set as default to the left";
        dropDown.appendChild(b);

        var b = document.createElement("button");
        b.setAttribute("style", "display: block; margin: auto; margin-top: 0.2rem;")
        b.setAttribute("class", "fd-button");
        b.innerHTML = "Preview element";
        dropDown.appendChild(b);

        //Get the position of the parent element
        var file = el.closest(".scrubber-element");
        var pos = file.getBoundingClientRect();

        //Get the program dimensions
        var progH = window.innerHeight;
        var progW = window.innerWidth;

        document.body.appendChild(dropDown)
        
        //Get the size of the dropdown
        var dropdownH = window.getComputedStyle(dropDown).height.split("px")[0];
        var dropdownW = window.getComputedStyle(dropDown).width.split("px")[0];
        //Compensate for the width of the file element
        var w = window.getComputedStyle(file).width.split("px")[0]
        var h = window.getComputedStyle(file).height.split("px")[0]

        if(pos.left-parseInt(w) <= 10) {
            dropDown.style.left = parseInt(20 + parseInt(dropdownW)/2)+ "px";
        } else {
            dropDown.style.left = parseInt(pos.left + w/2)+ "px";
        }

        if(pos.top+parseInt(h) > parseInt(progH)-200) {
            dropDown.style.top = parseInt(parseInt(pos.top - dropdownH)) - 10 + "px";
        } else {
            dropDown.style.top = parseInt(pos.top + h) + 70 + "px";
        }
    }, 10)
}

function addFieldsToScrubber(amnt) {
    var path = document.getElementById("main-container").querySelector("#bottom-layer").querySelector("#timeline");
    var columns = path.querySelector(".sub-container").querySelector(".scrubber");
    var rows = columns.childNodes;
    for(var i = 0; i < amnt; i++) {
        var c = document.createElement("div");
        c.setAttribute("class", "timeline-column");
        c.setAttribute("time", "00:10");
        c.setAttribute("oncontextmenu", "contextMenu(event, this, 0)");
        c.setAttribute("onmouseenter", "highlightColumn(this, true)");
        c.setAttribute("onmouseleave", "highlightColumn(this, false)");

        for(var l = 0; l < parseInt(rows[0].childNodes.length-1); l++) {
            var r = document.createElement("div");
            r.setAttribute("class", "timeline-row");
            r.onclick = (e) => {
                //Trigger the box selection code
                selectCell(e.target.closest(".timeline-row"));   
            }
            r.selected = false;
            r.setAttribute("droppable", "");
            r.setAttribute("oncontextmenu", "contextMenu(event, this, 0)")
            c.appendChild(r);
        }
        calculateColumnHeights();
        return c

    }
}

function calculateColumnHeights() {
    //////////////////////////////////////////////
    // Set the height of each individual column //
    //////////////////////////////////////////////
    //Get the amount of rows in the first column, and the height of each row
    var path = document.getElementById("main-container").querySelector("#bottom-layer").querySelector("#timeline");
    var cols = document.getElementsByClassName("timeline-column");
    var amntRows = cols[0].childNodes.length;
    var rowHeight = parseInt(window.getComputedStyle(cols[0].childNodes[0]).height.split("px"));
    var h = amntRows*rowHeight;
    var x;
    for(x of cols) {
        x.style.height = h+"px"; 
    }
}


function appendRipple(el) {
    if(!el.hasRipple) {

        el.hasRipple = true;
        el.addEventListener("click", function(e) {
            var ripple = document.createElement("div");
            ripple.setAttribute("class", "ripple-effect-circle");
            el.appendChild(ripple);

            var elStyle = window.getComputedStyle(el);
            var elHeight = elStyle.height;
            var elWidth = elStyle.width;
            var x = e.layerX + "px";
            var y = e.layerY + "px";
            ripple.style = `
                left: ` + x + `;
                top: ` + y + `;
                height: ` + elHeight + `;
                width: ` + elWidth + `;
                position: absolute;
                transform: translate(-50%, -50%);
                background-color: rgb(20,20,20);
                animation: ripple-animation 500ms ease-in-out;
                animation-fill-mode: both;
                border-radius: 100%;
                opacity: 0.5;
                pointer-events: none;
            `;
            setTimeout(function() {
                ripple.parentNode.removeChild(ripple);
            }, 500);
        })
    }
}



//Loading wheel
function loaderWheel() {
    var el = document.createElement("div");
        el.setAttribute("class", "lds-roller");

    for(let i = 0; i < 7; i++) {
        var child = document.createElement("div");
            el.appendChild(child);
    }

        return el;
}




function relaunchLauncher() {
    ipcRenderer.sendSync("relaunch-launcher");
}



function sendConsoleWarn() {
    if(isPackaged) {
        setTimeout(function() {
            console.clear();
            console.log("%cStop!", "font-size: 3rem; color: red; text-stroke: 1px black;");
            console.log("%cThis is meant for developers only! Don't type anything stupid into the box below", "font-family: bahnschrift; font-size: 1rem;");
            console.log("%cIf you know what you are doing, consider contributing to the project @ https://github.com/MindChirp/infoScreen", "font-family: bahnschrift; font-size: 1rem;");
        }, 10000)
    } else {
            console.log("%cDeveloper Console", "font-size: 3rem; color: red;   text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;");
    }
}

function floatingBox() {
    var el = document.createElement("div");
    el.className = "floating-box smooth-shadow";
    document.body.appendChild(el);

    var top = document.createElement("div");
    top.className = "top-bar";

    var handle = document.createElement("div");
    handle.className = "drag-handle";
    top.appendChild(handle);

    el.appendChild(top);

    var settings = document.createElement("button");
    var ico = document.createElement("i");
    ico.style.fontSize = "1rem";
    ico.className = "material-icons";
    ico.innerHTML = "settings";
    settings.appendChild(ico);
    settings.className = "close-button";
    infoOnHover(settings, "Settings");
    settings.onmousedown = (e) => {
        e.stopPropagation();
    }

    var toggleSettings = (e) => {
        var pane = e.target.closest(".floating-box").querySelector(".settings-pane");
        if(!pane.displaying) {
            pane.style.display = "block";
            pane.displaying = true;
        } else {
            pane.style.display = "none";
            pane.displaying = false;
        }
    }



    settings.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleSettings(e);
    });
    
    var cross = document.createElement("button");
    var ico = document.createElement("i");
    ico.className = "material-icons";
    ico.innerHTML = "close";
    cross.className = "close-button";
    cross.appendChild(ico);
    infoOnHover(cross, "Close")
    cross.onmousedown = (e) => {
        e.stopPropagation();
    }
    cross.addEventListener("click", (e) => {
        var cons = e.target.closest(".floating-box");
        cons.parentNode.removeChild(cons);
    })
    
    top.appendChild(cross);
    top.appendChild(settings);

    var sPane = document.createElement("div");
    sPane.className = "settings-pane";
    el.appendChild(sPane);

    var opac = tabInputs.slider("Opacity", true);
    var sl = opac.getElementsByTagName("input")[0];
    sl.max = 1;
    sl.step = 0.05;
    sl.min = 0.5;

    sl.addEventListener("change", (e) => {
        //Update console opacity
        e.target.closest(".floating-box").style.opacity = e.target.value;
    })
    sPane.appendChild(opac);

    var pEv = tabInputs.checkBox("Disable interactivity");
    sPane.appendChild(pEv);
    
    pEv.querySelector("input").addEventListener("change", (e) => {
        var val = e.target.checked;
        var type = val ? "none" : "initial";
        e.target.closest(".floating-box").querySelector(".view").style.pointerEvents = type;
    })
    pEv.querySelector("input").checked = false;

    var view = document.createElement("div");
    view.className = "view";
    el.appendChild(view);

    //Enable box moving

    var offset = {x: 0, y: 0}
    var handleUp = function(e) {
        document.body.removeEventListener("mousemove", handleMove);
        document.body.removeEventListener("mouseup", handleUp);

        if(parseInt(el.style.top.split("px")[0]) < 40) {
            el.style.top = "2rem";
        }

    }

    var handleMove = function(e) {
            var pointerX = e.clientX;
            var pointerY = e.clientY;
            //var cons = document.getElementById("console");
            el.style.top = parseInt(pointerY-offset.y) + "px";
            el.style.left = parseInt(pointerX-offset.x) + "px";
            el.style.transform = "translate(0,0)";
    }
    
    var handleDown = function(e) {
        var x = e.offsetX;
        var y = e.offsetY;
        offset.x = x;
        offset.y = y;

        document.body.addEventListener("mousemove", handleMove);
        document.body.addEventListener("mouseup", handleUp);
    }

    top.addEventListener("mousedown", handleDown);
    return el;
}

function strip(string) {
    let doc = new DOMParser().parseFromString(string, 'text/html');
    return doc.body.textContent || "Denied: HTML content not allowed in the console.";
}
function signOutProgram() {
    return new Promise((resolve, reject)=>{

        //Let the server know
        fetch(serverAddress + "/signOut")
        .then((response)=>{
            if(response.ok) {

                localStorage.clear();
                resolve();
            } else {
                reject("Could not reach the server")
            }
        })
        .catch(error=>{
            reject(error);
        })
        
    })
}


ipcRenderer.on("close-program-please", (e, data) => {
    if(!alreadyClosing) {
        //The f4 is probably being pressed, exit gracefully
        programExit();
    }
})


function devNotification(values = {title, body}) {
    var el = document.createElement("div");
    el.className = "developer-notification smooth-shadow";

    document.body.appendChild(el);

    var t = document.createElement("p");
    t.innerHTML = values.title;

    var p = document.createElement("p");
    p.innerHTML = values.body;

    el.appendChild(t);
    el.appendChild(p);

    setTimeout(()=>{
        el.parentNode.removeChild(el);
    }, 5000);
}


/*

    THE FOLLOWING CODE DEFINES THE INTERVAL THAT UPDATES ALL
    INPUT FIELDS DYNAMICALLY

*/

var regexC = /[^\d.-]/g;

setInterval(updateFields, 100);

function updateFields() {
    updateTimelineBrowser();
}

function updateTimelineBrowser() {
    if(!updateBrowser) return;
    if(!document.querySelector("#timeline > div > div.browser > div")) return;

    //Get all input fields
    var parent = document.querySelector("#timeline > div > div.browser > div");
    var fields = parent.getElementsByClassName("fd-input");

    var x;
    for(x of fields) {
        var attr = x.getAttribute("connection");
        var el = document.body.activeTimelineElement;
        if((el instanceof HTMLElement) && attr) {
            var dat = el.config[attr];


            var val = dat[0].replace(regexC, '');

            x.childNodes[1].value = val;
        }
    }
}