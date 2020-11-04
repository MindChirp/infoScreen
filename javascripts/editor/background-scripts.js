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
    setTimeout(bkgScript, 10);
}