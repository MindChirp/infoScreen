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
        el.appendChild(txt);
    }
}

}