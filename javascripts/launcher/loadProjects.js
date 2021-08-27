

//Check if the client has logged in:
function initializeProjectList() {
    if(localStorage.getItem("signedIn") == "true") {
        loadProjects();
    }
}



var projects = [];


function createList(arr) {
    //Create an item for each project
    var parent = document.getElementById("list");
    if(arr.length > 0) {
        console.log(parent);
        parent.innerHTML = "";
        parent.style.paddingTop = "0.5rem";
        parent.style.paddingBottom = "0.5rem";

    }

    
    var x;
    var holder;
    if(!document.getElementById("projects-container")) {
        holder = document.createElement("div");
        holder.setAttribute("id", "projects-container");
        parent.appendChild(holder);
    }
    


    for(x of arr) {
        var el = document.createElement("div");
        el.setAttribute("class", "project-item");
        holder.appendChild(el);
        el.fileName = x
        var txt = document.createElement("p");
        txt.innerHTML = x;
        txt.setAttribute("style", `
            display: inline-block;
        `);
        el.state = "closed";
        //el.setAttribute("onmouseenter", "fileList.hover(this)");
        el.setAttribute("onclick", "fileList.click(this)");
        //el.setAttribute("onmouseleave", "fileList.leave(this)");

        var desc = document.createElement("p");
        desc.className = "description";
        desc.innerHTML = "No description";

        var wr = document.createElement("div");
        wr.className = "wrapper";
        wr.appendChild(txt);
        wr.appendChild(desc);
        el.appendChild(wr);
    }

    /*
    var hasVerticalScrollbar = holder.scrollHeight > holder.clientHeight;
    if(hasVerticalScrollbar) {
        holder.style.paddingRight = "0";
        document.getElementById("list").style.width = "25rem"

    } else {
        holder.style.paddingRight = "0.33rem"
        document.getElementById("list").style.width = "25.33rem";

    }
*/
}

function loadInDevMode() {

    //Loading using the standard path has failed, resort to the dev path
    var projectFilePath = path.join(filesPath, "projects");
    projects = [];
    fs.readdir(projectFilePath, (err, dat) => {
        if (err) throw err;

        //Get all the projects, and list them out wihtout their extensions
        var x;
        for(x of dat) {
            if(x.split(".")[x.split(".").length-1] == "proj") {
                projects.push(x.split(".")[0])
            }
        }
        
        createList(projects);
    })
}

function loadProjects() {


var projectFilePath = path.join(path.dirname(__dirname),"extraResources", "data", "programData", "projects");
fs.readdir(projectFilePath, (err, dat) => {
    if (err) {
        loadInDevMode()
        return;
    }
    //Get all the projects, and list them out wihtout their extensions
    var x;
    for(x of dat) {
        if(x.split(".")[x.split(".").length-1] == "proj") {
            projects.push(x.split(".")[0])
        }
    }

    createList(projects);
})




}


var fileList = {
    hover: function(el) {
            var menu = document.createElement("div");
            menu.setAttribute("style", `
                height: 100%;
                width: fit-content;
                display: inline-block;
                float: right;
                padding-right: 1rem;
            `);

            var preview = document.createElement("button");
            preview.setAttribute("style", `
                height: 100%;
                width: fit-content;
                background-color: transparent;
                border: none;
                outline: none;
                cursor: pointer;
            `);
            infoOnHover(preview,"Preview");
            var ico = document.createElement("i");
            ico.setAttribute("class", "material-icons");
            ico.innerHTML = "remove_red_eye";
            ico.setAttribute("style", `
                height: 100%;
                line-height: 2.5rem;
                color: var(--paragraph-color);
            `)

            preview.appendChild(ico);

            preview.onclick = (e) => {
                var fileName = el.fileName.toString();
                previewSlideshow(fileName);
            }

            var open = document.createElement("button");
            open.setAttribute("style", `
                height: 100%;
                width: fit-content;
                background-color: transparent;
                border: none;
                outline: none;
                cursor: pointer;
            `);
            infoOnHover(open,"Open");
            var ico = document.createElement("i");
            ico.setAttribute("class", "material-icons");
            ico.innerHTML = "folder";
            ico.setAttribute("style", `
                height: 100%;
                line-height: 2.5rem;
                color: var(--paragraph-color);
            `)

            open.appendChild(ico);

            open.onclick = () => {
                var fileName = el.fileName.toString();
                try {
                    ipcRenderer.send("open-main-window", fileName);
                    ipcRenderer.send("closeLauncher")
                } catch (error) {
                    alert(error);
                }
            }


            var del = document.createElement("button");
            del.setAttribute("style", `
                height: 100%;
                width: fit-content;
                background-color: transparent;
                border: none;
                outline: none;
                cursor: pointer;
            `);
            del.setAttribute("onclick", "fileList.delete(this)")
            infoOnHover(del,"Delete");
            
            var ico = document.createElement("i");
            ico.setAttribute("class", "material-icons");
            ico.innerHTML = "delete";
            ico.setAttribute("style", `
                height: 100%;
                line-height: 2.5rem;
                color: var(--paragraph-color);
            `);

            del.appendChild(ico);

            menu.appendChild(preview);
            menu.appendChild(del);
            menu.appendChild(open);




            el.appendChild(menu); 

    },

    click: function(el) {
        var hasMenu = el.querySelector(".menu-box");
        if(!hasMenu) {
            setTimeout(()=>{
                el.style.transition = "all 200ms ease-out";
                var menu = document.createElement("div");
                menu.className = "menu-box smooth-shadow";
                menu.style = `
                    background-color: var(--dark-secondary-button-color);
                    width: 80%;
                    margin: auto;
                    overflow: hidden;
                    height: 0;
                    border-radius: 0.3rem;
                    animation: slide-in-more-settings 300ms ease-in-out both;
                    position: relative;
                `;
                el.state == "opened";
                
                el.appendChild(menu);
                
                var open = document.createElement("button");
                var ico = document.createElement("i");
                ico.className = "material-icons";
                ico.innerHTML = "folder";
                open.appendChild(ico);
                infoOnHover(open, "Open project");
                menu.appendChild(open);
                open.style = `
                display: inline-block;
                height: 2.5rem;
                width: 33%;
                float: left;
                padding: auto;
                background: transparent;
                border: none;
                outline: none;
                cursor: pointer;
                `
                ico.style = `
                    color: var(--paragraph-color);
                    font-size: 1.5rem;

                `;

                
                open.onclick = () => {
                    var fileName = el.fileName.toString();
                    try {
                        ipcRenderer.send("open-main-window", fileName);
                        ipcRenderer.send("closeLauncher")
                    } catch (error) {
                        alert(error);
                    }
                }

                var preview = document.createElement("button");
                var ico = document.createElement("i");
                ico.className = "material-icons";
                ico.innerHTML = "remove_red_eye";
                preview.appendChild(ico);
                infoOnHover(preview, "Preview project");
                menu.appendChild(preview);
                preview.style = `
                display: inline-block;
                height: 2.5rem;
                width: 33%;
                float: left;
                padding: auto;
                background: transparent;
                border: none;
                cursor: pointer;
                outline: none;
                `
                ico.style = `
                    color: var(--paragraph-color);
                    font-size: 1.5rem;

                `;
                preview.onclick = (e) => {
                    var fileName = el.fileName.toString();
                    previewSlideshow(fileName);
                }

                var deleteFile = document.createElement("button");
                var ico = document.createElement("i");
                ico.className = "material-icons";
                ico.innerHTML = "delete";
                deleteFile.appendChild(ico);
                infoOnHover(deleteFile, "Delete project");
                menu.appendChild(deleteFile);
                deleteFile.style = `
                display: inline-block;
                height: 2.5rem;
                width: 33%;
                float: left;
                padding: auto;
                background: transparent;
                border: none;
                cursor: pointer;
                outline: none;
                `
                ico.style = `
                    color: var(--paragraph-color);
                    font-size: 1.5rem;
                `;

                setTimeout(()=>{

                    var title = el.querySelector(".wrapper");
                    title.style.display = "none";
                    
                });

            }, 100)

        } else {
            var menu = el.querySelector(".menu-box");
            if(menu) {
                removeFileMenu(menu);
            }
        }
    },

    leave: function(el) {
        el.childNodes[1].parentNode.removeChild(el.childNodes[1]);
    },
     


    delete: function(el) {

    }
}

function removeFileMenu(el) {
    if(el) {
        el.style.animation = "slide-out-more-settings 200ms ease-out both";
        setTimeout(()=>{
            if(el.parentNode) {
                el.parentNode.childNodes[0].style.display = "initial";
                el.parentNode.removeChild(el);
            }
        }, 100)

    }
}