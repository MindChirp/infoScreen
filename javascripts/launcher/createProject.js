const fs = require("fs-extra");

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

    var title = document.createElement("h1");
    title.className = "title";
    title.innerHTML = "Create a Project";
    title.style = `
        font-size: 3.5rem;
        color: var(--title-color);
        margin-left: 3rem;
    `
    
    cont.childNodes[0].style = `
        display: flex;
        align-items: center;
    `
    cont.childNodes[0].appendChild(title);
    //cont.childNodes[0].appendChild(name);
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


    var fileLoc = document.createElement("button");
    fileLoc.innerText = "open file location"
    fileLoc.className = "open-file-location";
    bottomRight.appendChild(fileLoc);
    fileLoc.onclick = ()=>{
        require('child_process').exec("start " + path.join(filesPath, "projects"));
    }

    var createB = document.createElement("button");
    createB.setAttribute("class", "smooth-shadow fd-settings-button create");
    createB.innerHTML = "Create project";
    createB.setAttribute("style", `
        height: 3rem;
        background-color: var(--secondary-button-color);
        display: inline-block;
        float: right;
    `);
    createB.classList.add("ripple-element");
    appendRipple(createB);

    
    bottomRight.appendChild(createB);

    

    var name = inputWithText("Project Name *");
    name.id = "project-title";
    name.childNodes[1].setAttribute("type", "text");
    left.appendChild(name);

    var creators = inputWithText("Author *");
    left.appendChild(creators);
    //Set the value of creator automatically
    var dat = localStorage.getItem("userInfo");
    creators.childNodes[1].value = JSON.parse(dat)[1][0].name;
    creators.childNodes[1].style.textTransform = "capitalize";

    /*
    var slides = inputWithText("Number of Slides *");
    slides.childNodes[1].setAttribute("type", "number");
    slides.childNodes[1].value = 10;
    slides.childNodes[1].min = 1;
    left.appendChild(slides);
*/
    
    var desc = inputWithText("Description");
    desc.childNodes[1].setAttribute("type", "text");
    desc.childNodes[1].placeholder = "No description";
    left.appendChild(desc);
    
    
    createB.addEventListener("click", function() {
        create(name.childNodes[1].value, creators.childNodes[1].value, 10, desc.childNodes[1].value, cont);
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

            /*var img = document.createElement("img");
            img.src = "./internalResources/images/template1.png";
            el.appendChild(img);*/
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

            el.classList.add("ripple-element");
            appendRipple(el);
        }
    }

}

function create(title,author,slides, desc, menu) {
    if(title.trim() == "") {
        showNotification("Specify a project name");
        return;
        //project.error("Specify a project name");
    } else if(author.trim() == "") {
        showNotification("Fill out all the required fields");
        return;
        //project.error("Fill out all the required fields");
    } else if(slides == 0) {
        showNotification("Project must have at least one slide");
        return;
        //project.error("Project must have at least one slide")
    }

    //Check for problematic names
    var conf;
    try {
        conf = JSON.parse(fs.readFileSync("./internalResources/configs/projects.json", "utf8"));
    } catch (error) {
        showNotification("Internal config not found, could not create the project");
        return;
    }

    var x
    for(x of conf.bannednames) {
        if(title.includes(x)) {
            showNotification("This title (" + title + ") is not valid");
            return;
        } else if(title.includes(".")) {
            showNotification("The title cannot contain periods");
            return;
        }
    }



        var create = new Promise((resolve, reject) => {
            var result = createFile()
            console.log(result)
            if(result) {
                resolve();
            } else {
                reject();
            }
        })
        .then(function(result) {
            //Close the menu modal
            menu.parentNode.removeChild(menu);
        })
        .catch(function() {
            showNotification("Could not create the project");
            //project.error("Could not create the project");
        })

        
    
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
    var slides = 10;
    var desc = inputs[2].value;

    var time = new Date();
    var day = time.getDay();
    var month = time.getMonth();
    var year = time.getFullYear();
    var hour = time.getHours();
    var minute = time.getMinutes();
    var meta = {
        meta: {
            slides: slides,
            creator: author,
            created: month + "/" + day + "/" + year + ":" + hour + ":" + minute + ":PM",
            edited: "null",
            title: title,
            description: desc
        },
        fileInfo: {

            times: [],
            files: []
        }
        };

    var zip = new require("node-zip")();
    zip.file("meta.json", JSON.stringify(meta));
    var data = zip.generate({base64:false,compression:'DEFLATE'});




        fs.writeFile(path.join(filesPath, "projects", title + '.proj'), data, 'binary', (err) => {
            if(err) {
                return false;
            } else {
                initializeProjectList();
                return true;
            }
        });

        return true;

        
    
}
