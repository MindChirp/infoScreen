function openProject(el) {
    var cont = menu("user");
    cont.closest(".menu").classList.add("open-project");

    var h1 = h1El();
    h1.setAttribute("style", `
        height: 10rem;
        line-height: 10rem;
        font-size: 3.5rem;
        margin: 0;
        margin-left: 3rem;
        color: var(--title-color);
    `)
    cont.childNodes[0].appendChild(h1);
    h1.innerHTML = "Open Project";

    var wr = document.createElement("div");
    wr.className = "wrapper";
    cont.appendChild(wr);

    var p = document.createElement("p");
    p.innerText = "Select a project stored on your computer";
    p.style = `
        margin: 0;
        height: fit-content;
        line-height: initial;
    `;
    wr.appendChild(p);

    var list = document.createElement("div");
    list.className = "projects-list smooth-shadow"
    wr.appendChild(list);

    //Create a loading indicator
    var loading = document.createElement("p");
    loading.innerText = "Fetching updated project list...";
    list.appendChild(loading);
    loading.style = `
        width: 100%;
        text-align: center;
        margin: 0.2rem 0;
        height: fit-content !important;
        line-height: initial !important;
        opacity: 0.5;
        animation: breathe-opacity 4s ease-in-out infinite;
    `;


    var getType = (file) => {
        var len = file.split(".").length;
        var ext = file.split(".")[len-1];

        return ext;
    }

    var appendFilesToList = (data) => {
        list.innerHTML = "";
        var x;
        for(x of data) {

            var ext = getType(x);
            if(ext == "proj") {   
                var el = document.createElement("div");
                el.className = "entry";
                list.appendChild(el);
                
                var title = document.createElement("p");
                title.innerHTML = x;
                el.appendChild(title);
            }

        }
    }


    //Read the folder
    var dirPath = localStorage.getItem("filesPath");
    fse.readdir(path.join(dirPath, "projects"))
    .then((data)=>{
        //Append these files to the list
        appendFilesToList(data);
    })
    .catch((error)=>{
        console.log(error);
    })
    
}

