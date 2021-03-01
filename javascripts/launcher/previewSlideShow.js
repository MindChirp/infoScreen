
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
    menu.style = `
        display: grid;
        grid-template-rows: 10rem auto;
    `
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

    var slideNo = document.createElement("p");
    slideNo.innerHTML = "0";
    slideNo.id = "slide-number";
    slideNo.style = `
        height: 1.8rem;
        line-height: 1.8rem;
        margin: 0;
        width: 2rem;
    `

    var prev = document.createElement("button");
    prev.onclick="goPrevSlide()";
    var ico = document.createElement("i");
    ico.className = "material-icons";
    ico.innerHTML = "skip_previous";
    prev.appendChild(ico);
    prev.addEventListener("click", goPrevSlide);

    var next = document.createElement("button");
    prev.onclick="goNextSlide()";
    var ico = document.createElement("i");
    ico.className = "material-icons";
    ico.innerHTML = "skip_next";
    next.appendChild(ico);
    next.addEventListener("click", goNextSlide);
    
    buttonsCont.appendChild(next)
    buttonsCont.appendChild(prev);
    buttonsCont.appendChild(slideNo);

    controls.appendChild(buttonsCont)

    //Load in the project data
    readProjectData(filename)

    //Load the first slide
    loadSlide(0);
}

//Load the project file
function readProjectData(filename) {
    console.clear();
    var dir;
    if(isPackaged) {
        dir = path.join(path.dirname(__dirname), "extraResources", "data", "programData", "projects")
    } else {
        dir = path.join(__dirname, "extraResources", "data", "programData", "projects")
    }
    var data = fs.readFileSync(dir + "/" + filename + ".proj", "binary");
    var zip = new require("node-zip")(data, {base64: false, checkCRC32: true});
    var files = ["meta.json"];

    var unzippedFiles = zip.files[files[0]];
    var decodedFiles = JSON.parse(unzippedFiles._data);
    //Check if there are any slides in the project
    if(decodedFiles.fileInfo.files.length == 0) {
        
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

        return;
    }

    
    var slides = [];

    projectData = {slides: decodedFiles.fileInfo.files, author: decodedFiles.meta.creator, edited: decodedFiles.meta.edited, title: decodedFiles.meta.title};
}

function loadSlide(slideNo) {
    //Read the project data
    var slide = projectData.slides[slideNo];

    renderColumn(slideNo, slide);
    document.getElementById("slide-number").innerHTML = crntSlide+1;
}


var crntSlide = 0;


function goPrevSlide() {
    var newSlide = crntSlide==0 ? 0 : crntSlide-1; 
    crntSlide = newSlide; 

    loadSlide(crntSlide);

}

function goNextSlide() {

    var newSlide = crntSlide+1;
    crntSlide = newSlide; 

    loadSlide(crntSlide);


}
