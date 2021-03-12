
ipcRenderer.on("fullscreen-view", (event, data) => {
    console.log(data);
});

function slideOutAppBar() {
    var el = document.getElementById("app-bar");
    el.style.transform = "translateY(-100%)";
}



function setUpWindow() {
    document.getElementById("app-bar-container").displaying = false;

    var oldTimeout;
    document.getElementById("app-bar-container").addEventListener("mousemove", () => {
        var el = document.getElementById("app-bar-container");
        
        if(!el.displaying) {
            el.children[0].style.transform = "";
            el.displaying = true;
        }
        clearTimeout(oldTimeout);
        oldTimeout = setTimeout(()=> {
            el.children[0].style.transform = "translateY(-100%)";
            el.displaying = false;
        }, 2000)
    })

    

}

ipcRenderer.on("slide-data", (event, data) => {
    //Update the slide number global variable
    document.body.meta.slideNumber = data.number;
    document.body.meta.numberOfColumns = data.slideshowLength;

    //Use the adapted rendering engine to display this data
    var indexes = [];
    var x;
    for(x of data.content) {
        var type = x.category;
        var name = x.name;
        var zIndex = x.index;
        var src = x.src;
        indexes.push([{type: type, name: name, zIndex: zIndex, src: src, config: x.config}]);
    }

    document.getElementById("viewport").innerHTML = "";

    //Remove loading content, if there is some
    if(document.getElementById("mid-positioner-text")) {
        var el = document.getElementById("mid-positioner-text");
        el.parentNode.removeChild(el);
    }

    renderColumn(indexes);
});

ipcRenderer.on("slide-active", (event, data) => {
    //Data contains the timestamp etc
    var timestamp = data.timestamp;
    document.body.meta.playing = true;
    event.returnValue = "OK"
    playContents();
})

ipcRenderer.on("slide-unactive", (event, data) => {
    //Data contains the timestamp etc
    var timestamp = data.timestamp;
    document.body.meta.playing = false;
    event.returnValue = "OK"
    pauseContents();
})


function playContents() {
    var vid = document.getElementsByTagName("video")[0];
    vid.play();
}

function pauseContents() {
    var vid = document.getElementsByTagName("video")[0];
    vid.pause();
}