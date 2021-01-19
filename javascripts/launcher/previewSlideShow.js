
var projectData;

function menuPane(type) {     
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
    back.classList.add("ripple-element");
    appendRipple(back);

    infoOnHover(back, "Go back");

    back.addEventListener("click", function() {
            el.parentNode.removeChild(el);
            if(document.getElementsByClassName("information-popup")[0]) {
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


function previewSlideshow(filename) {
    //console.log(menu());
    var menu = menuPane("user");
    var header = menu.childNodes[0];
    header.style.position = "relative";

    var title = document.createElement("h1");
    title.innerHTML = filename;
    title.style = `
        position: absolute;
        margin: 0;
        left: 3rem;
        top: 50%;
        transform: translate(0, -50%);
        font-size: 3.5rem;
    `;

    header.appendChild(title);

    var viewport = document.createElement("div");
    viewport.id = "viewport";

    var content = document.createElement("div");
    content.className = "content";

    var controls = document.createElement("div");
    controls.className = "controls";
    controls.style = `
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        width: fit-content;
    `
    viewport.appendChild(content);
    viewport.appendChild(controls);

    menu.appendChild(viewport);


    //Create the controls
    var buttonsCont = document.createElement("div");
    buttonsCont.className = "button-container smooth-shadow";

    var prev = document.createElement("button");
    prev.onclick="goPrevSlide()";
    var ico = document.createElement("i");
    ico.className = "material-icons";
    ico.innerHTML = "skip_previous";
    prev.appendChild(ico);

    var next = document.createElement("button");
    prev.onclick="goNextSlide()";
    var ico = document.createElement("i");
    ico.className = "material-icons";
    ico.innerHTML = "skip_next";
    next.appendChild(ico);
    buttonsCont.appendChild(next)
    buttonsCont.appendChild(prev);

    controls.appendChild(buttonsCont)

    //Load in the project data
    readProjectData(filename)

    //Load the first slide
    loadSlide(0);
}

//Load the project file
function readProjectData(filename) {
    var dir;
    if(isPackaged) {
        dir = path.join(path.dirname(__dirname), "extraResources", "data", "programData", "projects")
    } else {
        dir = path.join(__dirname, "extraResources", "data", "programData", "projects")
    }
    var data = fs.readFileSync(dir + "/" + filename + ".proj", "binary");

    var zip = new require("node-zip")(data, {base64: false, checkCRC32: true});
    var files = ["meta.json"];

    var unzippedFiles = zip.files[files[0]]._data;
    var decodedFiles = JSON.parse(unzippedFiles);
    console.log(decodedFiles.meta.files)
    if(!decodedFiles.meta.files) {
        
        //Not edited, no information to show.
        var viewport = document.getElementById("viewport").querySelector(".content");
        viewport.innerHTML = "";
        
        var msg = document.createElement("h1");
        msg.innerHTML = "Nothing to show";
        viewport.appendChild(msg);
        msg.style = `
            position: absolute;
            top: 50%;
            left: 50%;
            margin: 0;
            transform: translate(-50%, -50%);
            opacity: 0.8;
        `;
    }

    
}

function loadSlide(slideNo) {
    //Read the project data
}





function goPrevSlide() {

}

function goNextSlide() {

}
