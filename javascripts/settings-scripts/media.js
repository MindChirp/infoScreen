const { contentTracing } = require("electron");
const { fstat } = require("fs");

const ipc = require("electron").ipcRenderer


function mediaMenu() {
var parent = menus.tools.setup("Media");

//Select media folders
var cont = document.createElement("div");
    cont.setAttribute("class", "holder");
var subcont = document.createElement("div");
var span = document.createElement("span");
subcont.appendChild(span);
span.innerHTML = "Manage external media folders"
span.setAttribute("style", `
    margin: 0 0 0.5rem;
    font-weight: lighter;
    color: white;
`)

var info = document.createElement("div");
info.setAttribute("class", "info-circle");
info.innerHTML = "?";

menus.info(info, "The folders that are selected will be searched for any compatible media, and then have that media copied to an internal folder within the program. If you choose to delete something from one of these media folders, it won't delete it from the program itself. That has to be done through the internal file explorer found next to the viewport.")



subcont.setAttribute("style", `
    display: block;
    width: fit-content;
    height: fit-content;
    margin: 0 0 0.5rem;
`)
span.appendChild(info);
var input = document.createElement("button");
input.addEventListener("click", function(event) {
    ipc.send("open-folder-dialog");
});


ipc.on("selected-folder", function(event, path) {
    var list = document.getElementById("media-source-list");

    fs.readFile("./data/programData/userPreferences.json", (err, data) => {
        if(err) throw err;

        var file = JSON.parse(data);

        file.mediaPaths = path;

        var toWrite = JSON.stringify(file, null, 2);

        fs.writeFile("./data/programData/userPreferences.json", toWrite, (err) => {
            if(err) throw err;
        })


         //Generate snapshot reports to put into the "mediafolderSnapshots.json" file.
        var holderArray = [];
         //file.mediaPaths is the path array
        for(let i = 0; i < file.mediaPaths.length; i++) {
            fs.readdir(file.mediaPaths[i], (err, data) => {
            if(err) throw err;

            var unfilteredDat = data;
            //Start filtering away all the unnescessary data
            var arr = [file.mediaPaths[i]]
            for(let m = 0; m < data.length; m++) {
                var formatAmnt = data[m].split(".").length;
                var t = data[m].split(".")[formatAmnt-1];
                var isValid = checkFormatValidity(t)
                if(isValid[0] == true) {
                    //The format of the currently read file is valid, let's store it in the snapshot file
                    //Together with its parent folder
                    arr.push(data[m]);

                }
            }

            holderArray.push(arr);
            
    })
}

    fs.readFile("./data/programData/mediafolderSnapshots.json", (err, data) => {
        if(err) throw err;

        var dat = JSON.parse(data);

        dat.snapshots = holderArray;


        //Save the snapshots to the file
        fs.writeFile("./data/programData/mediafolderSnapshots.json", JSON.stringify(dat, null, 2), (err) => {
            if(err) throw err;
        })
        var files = [];
        for(let l = 0; l < dat.snapshots.length; l++) {
            for(let k = 0; k < dat.snapshots[l].length - 1; k++) {
                files.push(dat.snapshots[l][0] + "\\" + dat.snapshots[l][k+1]);
            }
        }
            for(let x = 0; x < files.length; x++) {

                var fileName = files[x];
                fs.createReadStream(fileName).pipe(fs.createWriteStream('./data/files/' + fileName.split("\\")[fileName.split("\\").length - 1]), (err) => {
                    if(err) throw err;
                });
            }

    })


    })

    for(let i = 0; i < path.length; i++) {
        if(i == 0) {
            list.innerHTML = path[0];
        } else {
            list.innerHTML = list.innerHTML + "<br>" + path[i];
        }
    }
});




input.setAttribute("class", "smooth-shadow fd-button");
input.innerHTML = "Select folders"

cont.appendChild(subcont);
cont.appendChild(input);



var list = document.createElement("div");
list.setAttribute("id", "media-source-list");
list.setAttribute("style", `
    height: fit-content;
    max-height: 10rem;
    overflow-y: auto;
    width: 20rem;
    background-color: #1B2630;
    border-radius: 0.5rem;
    margin-top: 1rem;
    padding: 1rem;
`);
list.innerHTML = "There are no media sources";

fs.readFile("./data/programData/userPreferences.json", (err, data) => {
    if(err) {
        list.innerHTML = "Could not load the paths.";
        throw err;
    }
    var dat = JSON.parse(data);
    
    var paths = dat.mediaPaths;
    setTimeout(function() {
        copyToInternalExplorer();
    }, 1000);
    for(let z = 0; z < paths.length; z++) {
        if(z == 0) {
            list.innerHTML = paths[0] + "<br>";
        } else {
            list.innerHTML = list.innerHTML + paths[z] + "<br>";
        }
    }
})





cont.appendChild(list);

parent.appendChild(cont);
}