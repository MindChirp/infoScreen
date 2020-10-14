//const projectFilePath = "./data/programData/projects";

//Check if the client has logged in:
function initializeProjectList() {
    if(localStorage.getItem("signedIn") == "true") {
        loadProjects();
    }
}

function loadProjects() {


var projects = [];
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


function createList(arr) {
    //Create an item for each project
    var x;
    var parent = document.getElementById("list");

    if(arr.length > 0) {
        parent.innerHTML = "";
        parent.style.paddingTop = "0.5rem";
        parent.style.paddingBottom = "0.5rem";
    }


    for(x of arr) {
        var el = document.createElement("div");
        el.setAttribute("class", "project-item");
        parent.appendChild(el);

        var txt = document.createElement("p");
        txt.innerHTML = x;
        txt.setAttribute("style", `
            display: inline-block;
        `)
        el.appendChild(txt);

        el.setAttribute("onmouseenter", "fileList.hover(this)");

        el.setAttribute("onmouseleave", "fileList.leave(this)");

    }
}

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
            `)

            del.appendChild(ico);

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