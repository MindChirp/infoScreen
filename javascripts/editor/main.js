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

    function deactivateOtherPages() {
        var pages = document.getElementById("browser").querySelector(".content-container").getElementsByTagName("div");
        var y;
        for(y of pages) {
            if(y.getAttribute("class") != "file-item" && y.getAttribute("class") != "content" && y.getAttribute("class") != "explorer-widget") {
                y.style.display = "none";
            }
        }
    }

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
        col.setAttribute("onmouseenter", "highlightColumn(this, true)");
        col.setAttribute("onmouseleave", "highlightColumn(this, false)");

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

            col.appendChild(row);
        }

    }

}