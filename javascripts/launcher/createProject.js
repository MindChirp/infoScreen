const fs = require("fs");

function createProject() {
    var cont = menu("user");

    var wrapper = document.createElement("div");
    wrapper.setAttribute("style", `
        width: 100%,
        height: fit-content;
        padding: 1rem;
    `);
    cont.appendChild(wrapper);

    var left = document.createElement("div");
    wrapper.appendChild(left);
    left.setAttribute("style", `
        width: 50%;
        height: fit-content;
        display: inline-block;
    `);

    var name = document.createElement("input");
    name.setAttribute("id", "project-title");
    name.setAttribute("type", "text");
    name.placeholder = "Project name";
    name.setAttribute("style", `
        position: absolute;
        font-size: 3.5rem;
        outline: none;
        color: var(--title-color);
        top: 50%;
        transform: translateY(-50%);
        left: 3rem;
        background-color: transparent;
        border: none;
        height: 40%;
        width: 90%;
        /*border-color: var(--secondary-button-color);
        border-width: 0 0 2px 0;
        border-style: solid;*/
        border: none;
    `)
    cont.childNodes[0].appendChild(name);
    cont.childNodes[0].style.position = "relative";

    //Create project button
    var bottomRight = document.createElement("div");
    bottomRight.setAttribute("style", `
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        height: 3rem;
        width: fit-content;
    `);
    bottomRight.setAttribute("id", "bottom-right-create-container");
    wrapper.appendChild(bottomRight);

    var createB = document.createElement("button");
    createB.setAttribute("class", "smooth-shadow fd-settings-button");
    createB.innerHTML = "Create project";
    createB.setAttribute("style", `
        height: 3rem;
        background-color: var(--secondary-button-color);
        display: inline-block;
        float: right;
    `);

    
    bottomRight.appendChild(createB);


    var creators = inputWithText("Author *");
    left.appendChild(creators);
    //Set the value of creator automatically
    var dat = localStorage.getItem("userInfo");
    creators.childNodes[1].value = JSON.parse(dat)[1][0].name;


    var slides = inputWithText("Number of Slides *");
    slides.childNodes[1].setAttribute("type", "number");
    slides.childNodes[1].value = 10;
    slides.childNodes[1].min = 1;
    left.appendChild(slides);


    createB.addEventListener("click", function() {
        create(name.value, creators.childNodes[1].value, slides.childNodes[1].value)
    });


    //Templates

    var right = document.createElement("div");
    right.setAttribute("style", `
        width: 50%;
        display: inline-block;
        float: right;
        height: fit-content;
    `);
    wrapper.appendChild(right);

    var p = document.createElement("p");
    p.innerHTML = "Templates";
    p.style.marginLeft = "1rem";
    right.appendChild(p);

    //Add the template cards
    //TODO: Add a templates folder, create som templates
    //For now just add some blank cards

    var templateContainer = document.createElement("div");
    templateContainer.setAttribute("style", `
        height: fit-content;
        max-height: 17.42rem;
        width: 22rem;
        overflow-y: auto;
        padding-left: 1rem;
        padding-top: 0rem;
    `);
    right.appendChild(templateContainer);
    for(let i = 0; i < 5; i++) {
        var el = document.createElement("div");
        el.setAttribute("class", "template-card standard smooth-shadow disabled");
        templateContainer.appendChild(el);
        if(i == 0) {
            el.setAttribute("class", "template-card standard smooth-shadow");
            var p = document.createElement("p")
            p.innerHTML = "Test template";          
            el.appendChild(p);
            p.setAttribute("style", `
                margin: 0;
                height: 5rem;
                line-height: 5rem;
                width: 10rem;
                text-align: center;

            `);
        }
    }

}


function create(title,author,slides) {
    console.log("oansd");
    if(title.trim() == "") {
        project.error("Specify a project name");
    } else if(author.trim() == "" || slides.trim() == "") {
        project.error("Fill out all the required fields");
    } else if(slides == 0) {
        project.error("Project must have at least one slide")
    } else {
        createFile();
    }
}

var project = {
    error: function(text) {
        if(!document.getElementById("error-message-create")) {
            var el = document.createElement("div");
            el.setAttribute("id", "error-message-create");
            el.setAttribute("style", `
                height: 3rem;
                border-radius: 1.5rem;
                width: fit-content;
                padding: 0 1.5rem;
                margin-right: 1rem;
                display: inline-block;
                background-color: var(--main-button-color);
                vertical-align: top;
                animation: fade-in 300ms ease-in-out;
            `)
            var p = document.createElement("p");
            p.innerHTML = text;
            el.appendChild(p);
            p.setAttribute("style", `
                line-height: 3rem;
                height: 3rem;
                color: var(--paragraph-color);
            `);
    
            document.getElementById("bottom-right-create-container").appendChild(el);
    
            setTimeout(function() {
                el.parentNode.removeChild(el);
            }, 3000)
        }
    }
}






function createFile(template) {
    var inputs = document.getElementsByTagName("input");
    var title = inputs[0].value;
    var author = inputs[1].value;
    var slides = inputs[2].value;
    var time = new Date();
    var day = time.getDay();
    var month = time.getMonth();
    var year = time.getFullYear();
    var hour = time.getHours();
    var minute = time.getMinutes();
    var meta = `{
        "meta":  {
            "slides": ` + slides + `,
            "creator": ` + author + `,
            "created": "` + month + `/` + day + `/` + year + `:` + hour + `:` + minute + `:PM",
            "edited": "null",
        },
    
        "times": {
            []
        }
        "files:": {
            [
    
            ]
        }
    }`

    var zip = new require("node-zip")();
    zip.file("meta.json", meta);
    var data = zip.generate({base64:false,compression:'DEFLATE'});
    fs.writeFileSync('./data/programData/projects/' + title + '.proj', data, 'binary');
}
