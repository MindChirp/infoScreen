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

    path.querySelector(".sub-container").querySelector(".scrubber").style.maxWidth = parseInt(w.split("px")[0]-64) + "px";
    path.querySelector(".sub-container").querySelector(".scrubber").style.maxHeight = parseInt(h.split("px")[0]-64) + "px";

    var el = path.querySelector(".sub-container").querySelector(".scrubber");
    if(el.scrollTop >= scrollH-400) {
        //Add rows

        var cols = path.querySelector(".sub-container").querySelector(".scrubber").getElementsByClassName("timeline-column");

        var x;
        for(x of cols) {
            for(var i = 0; i < 5; i++) {
                var r = document.createElement("div");
                r.setAttribute("class", "timeline-row");
                r.setAttribute("droppable", "");
                r.setAttribute("oncontextmenu", "contextMenu(event, this, 0)");
                r.setAttribute("onmouseenter", "highlightColumn(this, true)");
                r.setAttribute("onmouseleave", "highlightColumn(this, false)");
                x.appendChild(r);
            }
        }

    }
    if(el.scrollLeft >= scrollW-1576) {
        var columns = path.querySelector(".sub-container").querySelector(".scrubber");
        var rows = columns.childNodes;

        for(var i = 0; i < 5; i++) {
            var c = document.createElement("div");
            c.setAttribute("class", "timeline-column");
            c.setAttribute("time", "00:10");
            c.setAttribute("oncontextmenu", "contextMenu(event, this, 0)")
            for(var l = 0; l < parseInt(rows[0].childNodes.length-1); l++) {
                var r = document.createElement("div");
                r.setAttribute("class", "timeline-row");
                r.setAttribute("droppable", "");
                r.setAttribute("oncontextmenu", "contextMenu(event, this, 0)")
                r.setAttribute("onmouseenter", "highlightColumn(this, true)");
                r.setAttribute("onmouseleave", "highlightColumn(this, false)");
                c.appendChild(r);
            }

            columns.appendChild(c);

        }
    }
    
    
    setTimeout(bkgScript, 10);
}