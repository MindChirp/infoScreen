var ratio = 16/9;
function bkgScript() {
//All background processes

// --Keep track of viewport and resize to keep 16:9 aspect ratio

   
    var style = getComputedStyle(document.getElementById("viewport").querySelector("#content"));
    var width = parseInt(style.width.split("px")[0]);
    document.getElementById("viewport").querySelector("#content").style.height = width / (ratio) + "px";
    /*document.getElementById("middle-layer-container").style.maxHeight = width / (16/9) + 25 + "px";
    document.getElementById("middle-layer-container").style.height = width / (16/9) + 25 + "px";
    document.getElementById("effects").style.height = width / (16/9) + 25 + "px";
    document.getElementById("content").style.height = width / (16/9) - 20 + "px";
    */

    //Make more elegant and organized later. Fixes the size of the files browser so that the layout does not get f*cked up
    var innerBrowserHeight = parseInt(window.getComputedStyle(document.getElementById("browser").querySelector(".content-container")).height.split("px")[0]);
    document.getElementById("files").style.maxHeight = innerBrowserHeight + "px";

   //#main-container #bottom-layer #timeline .sub-container .scrubber
    var path = document.getElementById("main-container").querySelector("#bottom-layer").querySelector("#timeline");
    var w = window.getComputedStyle(path).width;
    var h = window.getComputedStyle(path).height;
    var scrollH = path.querySelector(".sub-container").querySelector(".scrubber").scrollHeight;
    var scrollW = path.querySelector(".sub-container").querySelector(".scrubber").scrollWidth;

    var cols = document.getElementsByClassName("timeline-column");
    var h = window.getComputedStyle(path).height;
    var x;
    for(x of cols) {
        x.style.height = h; 
    }

    var maxW = parseInt(w.split("px")[0]-64);
    var maxH = parseInt(h.split("px")[0]-64);
    path.querySelector(".sub-container").querySelector(".scrubber").style.maxWidth = maxW + "px";
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

    }

    //Calculate the width of the timeline scroll bar in pixels
    var scrollThumbW = (maxW / scrollW)*scrollW;
    if(el.scrollLeft+scrollThumbW >= scrollW) {
        var columns = path.querySelector(".sub-container").querySelector(".scrubber");
        var rows = columns.childNodes;
        var c = addFieldsToScrubber(5);

        columns.appendChild(c);
    }
    
    
    setTimeout(bkgScript, 10);
}