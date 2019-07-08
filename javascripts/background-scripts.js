function bkgScript() {
//All background processes


// --Keep track of viewport and resize to keep 16:9 aspect ratio

    var style = getComputedStyle(document.getElementById("player").querySelector("#viewport"));
    var width = parseInt(style.width.split("px")[0]);
    document.getElementById("player").querySelector("#viewport").style.height = width / (16/9) + "px";

    setTimeout(bkgScript, 10);
}

bkgScript();