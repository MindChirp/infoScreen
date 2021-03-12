var ratio = 16/9;
function bkgScript() {
//All background processes



    //Make more elegant and organized later. Fixes the size of the files browser so that the layout does not get f*cked up
    var innerBrowserHeight = parseInt(window.getComputedStyle(document.getElementById("browser").querySelector(".content-container")).height.split("px")[0]);
    var innerBrowserWidth = parseInt(window.getComputedStyle(document.getElementById("browser")).width.split("px")[0]);
    document.getElementById("files").style.maxHeight = innerBrowserHeight + "px";
    document.getElementById("widgets").style.maxHeight = innerBrowserHeight + "px";
    document.getElementById("edit").style.maxHeight = innerBrowserHeight + "px";
    document.getElementsByClassName("scroller")[0].style.maxWidth = innerBrowserWidth + "px";

   //#main-container #bottom-layer #timeline .sub-container .scrubber
    var path = document.getElementById("main-container").querySelector("#bottom-layer").querySelector("#timeline");
    var w = window.getComputedStyle(path).width;
    var h = window.getComputedStyle(path).height;
    var scrollH = path.querySelector(".sub-container").querySelector(".scrubber").scrollHeight;
    var scrollW = path.querySelector(".sub-container").querySelector(".scrubber").scrollWidth;




    var maxW = parseInt(w.split("px")[0]);
    var maxH = parseInt(h.split("px")[0]);
    path.querySelector(".sub-container").querySelector(".scrubber").style.width = maxW + "px";
    path.querySelector(".sub-container").querySelector(".scrubber").style.maxHeight = maxH + "px";

    var el = path.querySelector(".sub-container").querySelector(".scrubber");





    //Calculate the height of the timeline scroll bar in pixels
    var scrollThumbH = (maxH / scrollH)*scrollH;
    if(el.scrollTop+scrollThumbH >= scrollH) {
        //Add rows

        var cols = path.querySelector(".sub-container").querySelector(".scrubber").getElementsByClassName("timeline-column");

        var x;
        for(x of cols) {
            for(var i = 0; i < 5; i++) {
                var r = document.createElement("div");
                r.setAttribute("class", "timeline-row");
                r.setAttribute("droppable", "");
                r.setAttribute("oncontextmenu", "contextMenu(event, this, 0)");
                r.setAttribute("onmouseleave", "highlightColumn(this, false)");
                x.appendChild(r);
            }
        }
        calculateColumnHeights();

    }

    //Calculate the width of the timeline scroll bar in pixels
    var scrollThumbW = (maxW / scrollW)*scrollW;
    if(el.scrollLeft+scrollThumbW >= scrollW) {
        var columns = path.querySelector(".sub-container").querySelector(".scrubber");
        var rows = columns.childNodes;
        var c = addFieldsToScrubber(5);

        columns.appendChild(c);
    }    

/*
    /////////////////////////////////////////////////////////////////
    // Keep track of viewport and resize to keep 16:9 aspect ratio //
    /////////////////////////////////////////////////////////////////
    var style = getComputedStyle(document.getElementById("viewport").querySelector("#content"));
    var parentStyle = getComputedStyle(document.getElementById("viewport"));
    var width = parseInt(style.width.split("px")[0]);
    var parentHeight = parseInt(parentStyle.height.split("px")[0]);

    var neededHeight = width / (ratio);
    console.log(neededHeight + " " + parentHeight)
    if(neededHeight > parentHeight) {
        document.getElementById("viewport").querySelector("#content").style.width = parentHeight*ratio + "px";
        document.getElementById("viewport").querySelector("#content").style.height = "100%";
    } else {
        document.getElementById("viewport").querySelector("#content").style.height = width / (ratio) + "px";
        document.getElementById("viewport").querySelector("#content").style.width = "100%";
    }

*/
    setTimeout(bkgScript, 10);
}



function calculateLayout() {
    //Triggers every time the window is resized

    //Get window size, calculate 98% of its width
    /*
    var winWidth = window.innerWidth;
    var parentWidth = (winWidth*98)/100;
    var timeLineWidth = parentWidth-64; //64 == width of the side-bar of the timeline
    document.getElementById("timeline").style.gridTemplateColumns = parentWide;
    */

    ////////////////////////////////////////////////////////////////////////////////////////
    // Set the height of the #main-container, and thus keep the program properly dispayed //
    ////////////////////////////////////////////////////////////////////////////////////////
    var winHeight = window.innerHeight;
    var contHeight = winHeight - 22*2 // 22 == height of the app-bar
    document.getElementById("main-container").style.height = contHeight + "px";
    document.getElementById("main-container");


    ////////////////////////////////////////////////////////////
    // Calculate the height of the top layer and bottom layer //
    ////////////////////////////////////////////////////////////
    var topLayerHeight = contHeight/2; //Use contHeight from the previous lines
    var bottomLayerHeight = (contHeight-((contHeight/2)+15));
    document.getElementById("main-container").style.gridTemplateRows = topLayerHeight + "px " + bottomLayerHeight + "px";


    /////////////////////////////////////////////////////////////////
    // Keep track of viewport and resize to keep 16:9 aspect ratio //
    /////////////////////////////////////////////////////////////////
    calculateViewportSize();

    ////////////////////////////////////
    // Set the heights of the browser //
    ////////////////////////////////////
    var browser = document.querySelector("#top-layer > div.browser-container.smooth-shadow")
    browser.style.maxHeight = topLayerHeight + "px";
    document.querySelector("#browser > div:nth-child(1) > div.content-container").style.maxHeight = topLayerHeight-2.5*16 + "px";
}

function calculateLayoutOnStartup() {
    ///////////////////////////////////////////
    // Set the correct width of the timeline //
    ///////////////////////////////////////////
    /*
    var parentWidth = parseInt(window.getComputedStyle(document.getElementById("bottom-layer")).width.split("px")[0]);
    var timeLineWidth = parentWidth-64; //64 == width of the side-bar of the timeline
    document.getElementById("timeline").style.gridTemplateColumns = "4rem " + timeLineWidth + "px";
    */

    ////////////////////////////////////////////////////////////////////////////////////////
    // Set the height of the #main-container, and thus keep the program properly dispayed //
    ////////////////////////////////////////////////////////////////////////////////////////
    var winHeight = window.innerHeight;
    var contHeight = winHeight - 22*2; // 22*2 == height of the app-bar and the padding between it and the main container
    document.getElementById("main-container").style.height = contHeight + "px";

    ////////////////////////////////////////////////////////////
    // Calculate the height of the top layer and bottom layer //
    ////////////////////////////////////////////////////////////
    var topLayerHeight = contHeight/2; //Use contHeight from the previous lines
    var bottomLayerHeight = (contHeight-((contHeight/2)+15));
    document.getElementById("main-container").style.gridTemplateRows = topLayerHeight + "px " + bottomLayerHeight + "px";
        

    /////////////////////////////////////////////////////////////////
    // Keep track of viewport and resize to keep 16:9 aspect ratio //
    /////////////////////////////////////////////////////////////////
    calculateViewportSize();

    ////////////////////////////////////
    // Set the heights of the browser //
    ////////////////////////////////////
    var browser = document.querySelector("#top-layer > div.browser-container.smooth-shadow")
    browser.style.maxHeight = topLayerHeight + "px";
    document.querySelector("#browser > div:nth-child(1) > div.content-container").style.maxHeight = topLayerHeight-2.5*16 + "px";

}

function calculateViewportSize() {
    /////////////////////////////////////////////////////////////////
    // Keep track of viewport and resize to keep 16:9 aspect ratio //
    /////////////////////////////////////////////////////////////////
    var parentStyle = getComputedStyle(document.getElementById("viewport"));
    var parentWidth = parseInt(parentStyle.width.split("px")[0]);
    var parentHeight = parseInt(parentStyle.height.split("px")[0]);

    var neededHeight = parentWidth / (ratio);
    if(neededHeight > parentHeight) {
        document.getElementById("viewport").querySelector("#content").style.width = parentHeight*ratio + "px";
        document.getElementById("viewport").querySelector("#content").style.height = "100%";
    } else {
        document.getElementById("viewport").querySelector("#content").style.height = parentWidth / (ratio) + "px";
        document.getElementById("viewport").querySelector("#content").style.width = "100%";
    }
}