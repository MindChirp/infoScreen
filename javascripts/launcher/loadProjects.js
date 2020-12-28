

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
        console.log("øioajnsd")
    }
    


    for(x of arr) {
        var el = document.createElement("div");
        el.setAttribute("class", "project-item");
        holder.appendChild(el);

        var txt = document.createElement("p");
        txt.innerHTML = x;
        txt.setAttribute("style", `
            display: inline-block;
        `)
        el.appendChild(txt);

        el.setAttribute("onmouseenter", "fileList.hover(this)");

        el.setAttribute("onmouseleave", "fileList.leave(this)");

    }

    var hasVerticalScrollbar = holder.scrollHeight > holder.clientHeight;
    if(hasVerticalScrollbar) {
        holder.style.paddingRight = "0";
        document.getElementById("list").style.width = "25rem"

    } else {
        holder.style.paddingRight = "0.33rem"
        document.getElementById("list").style.width = "25.33rem";

        console.log("ouiahsd")
    }
}

function loadInDevMode() {

    //Loading using the standard path has failed, resort to the dev path
    var projectFilePath = path.join(__dirname,"extraResources", "data", "programData", "projects");
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

    leave: function(el) {
        el.childNodes[1].parentNode.removeChild(el.childNodes[1]);
    },

    delete: function(el) {

    }
}