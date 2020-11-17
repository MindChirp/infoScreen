document.addEventListener("click", function() {

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
function initScrubber(rows,cols) {
    //Create columns
    var cont = document.getElementById("timeline").querySelector(".sub-container").querySelector(".scrubber");
    for(let i = 0; i < cols; i++) {
        var col = document.createElement("div");
        col.setAttribute("class", "timeline-column");
        cont.appendChild(col);
<<<<<<< HEAD

=======
        col.setAttribute("onmouseenter", "highlightColumn(this, true)");
        col.setAttribute("onmouseleave", "highlightColumn(this, false)");
>>>>>>> 7df2ec49fa6884deb211f7644840dbc1d43e5eba
        //Setup the column
        col.setAttribute("time", "00:10");
        var pos = document.createElement("div");
        if(i == 0) {
            pos.setAttribute("active", "true");
        }
        document.getElementById("timeline").querySelector(".sub-container").querySelector(".top-bar").appendChild(pos);
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
<<<<<<< HEAD
            row.setAttribute("onmouseenter", "highlightColumn(this, true)");
            row.setAttribute("onmouseleave", "highlightColumn(this, false)");
=======

>>>>>>> 7df2ec49fa6884deb211f7644840dbc1d43e5eba
            col.appendChild(row);
        }

    }

}




function infoBox(el, title) {
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
    console.log(type)  
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
    
        switch(type) {
            case 0:
                menu = createCtxMenu([["Undo", "Ctrl+Z", "undo()"], ["Redo", "Ctrl+Y", "redo()"], ["Delete", ""]]);
            break;
            case 1:
                menu = createCtxMenu([["Delete", "Del"]])
            break;
<<<<<<< HEAD
            case 2:
                menu = createCtxMenu([["Delete", "Del"], ["Properties", "Ctrl+P"]])
            break;    
=======
>>>>>>> 7df2ec49fa6884deb211f7644840dbc1d43e5eba
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
        if(e.target != document.getElementsByClassName("context-menu")[0] && !isDescendant(document.getElementsByClassName("context-menu")[0], e.target)) {
            var el = document.getElementsByClassName("context-menu")[0];
            el.parentNode.removeChild(el);
            document.removeEventListener("click", removeCtxMenu);
            document.removeEventListener("contextmenu", removeCtxMenu);
        }
    }
}
<<<<<<< HEAD

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
    console.log(ran);
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
=======
>>>>>>> 7df2ec49fa6884deb211f7644840dbc1d43e5eba
