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
    path.querySelector(".sub-container").querySelector(".scrubber").style.maxWidth = parseInt(w.split("px")[0]-64) + "px";
    path.querySelector(".sub-container").querySelector(".scrubber").style.maxHeight = parseInt(h.split("px")[0]-64) + "px";
    setTimeout(bkgScript, 10);
}