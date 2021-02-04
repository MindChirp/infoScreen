const { remote, ipcRenderer } = require("electron");
console.log(remote);
const [yourBrowserWindow] = remote.BrowserWindow.getAllWindows();
const { darkMode } = require("electron-util");
yourBrowserWindow.on("blur", (e) => {
    removeCtxMenu("unfocus");
    var appBar = document.getElementById("app-bar");
    appBar.style.opacity = 0.5;
    
    document.getElementById("project-name").style.opacity = 0.5;
})


const appVersion = require('electron').remote.app.getVersion();




yourBrowserWindow.on("focus", (e) => {
    var appBar = document.getElementById("app-bar");
    appBar.style.opacity = 1;

    document.getElementById("project-name").style.opacity = 1;

})


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



})

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


    //Deactivate all other menu buttons, activate the one that was clicked
    var x;
    for(x of butts) {
        x.style.border = "none";        
        x.style.width= "4rem";
    }

    el.style.border = "solid white";
    el.style.borderWidth="0 0 0 0.2rem";
    el.style.width="3.6rem";


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



function setTheme(theme) {
    if(theme == 0) {
        document.documentElement.style.setProperty("--main-bg-color", "rgb(235,235,235)");
        document.documentElement.style.setProperty("--title-color", "black");
        document.documentElement.style.setProperty("--paragraph-color", "rgb(50,50,50)");
        document.documentElement.style.setProperty("--secondary-color", "#E8E0D9");
        document.documentElement.style.setProperty("--main-button-color", "#E8E0D9");
        document.documentElement.style.setProperty("--secondary-button-color", "#d9cbbf");
        document.documentElement.style.setProperty("--slider-color", "#4da0ff");
        localStorage.setItem("theme", "light");
    } else if(theme == 1) {
        document.documentElement.style.setProperty("--main-bg-color", "#171F26");
        document.documentElement.style.setProperty("--title-color", "white");
        document.documentElement.style.setProperty("--paragraph-color", "rgb(220,220,220)");
        document.documentElement.style.setProperty("--secondary-button-color", "#121a21");
        document.documentElement.style.setProperty("--secondary-color", "rgb(15, 20, 25)");
        document.documentElement.style.setProperty("--main-button-color", "#1B2630");
        document.documentElement.style.setProperty("--slider-color", "#0075ff");
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
        col.config = {
            customViewingTimes: {enabled: false, times: []}
        }
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
        col.setAttribute("time", "00:10");
        
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
            if(k % 2 != 0) {
                row.setAttribute("version", "B");
            } else {
                row.setAttribute("version", "A");
            }   
            row.setAttribute("class", "timeline-row");
            row.setAttribute("droppable", "");
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

    } else {
        var root = el.closest(".scrubber-element");
        //The viewport controls might be opaque because the deleted element
        //is selected. Fix it.
        document.querySelector('#viewport > div.controls').style.opacity = "1";
        document.querySelector('#viewport > div.controls').style.pointerEvents = "";
        root.parentNode.removeChild(root);
        setTimeout(function() {
            removeCtxMenu(event);
        //Should there be a timeout for the context menu to dissapear?
        })
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
        }, 10000)
    } else {
            console.log("%cDeveloper Console", "font-size: 3rem; color: red;   text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;");
    }
}