
var saving = false;
function saveFile() {
    //Save the current file

    /*
    Procedure:
        1. Get all viewport data from all columns, save in each object, and push to an array.
        2. Get all the images and videos, transform them to data that can be saved in a "text" file
        3. 





    */

    //If the program is not saving anymore
    if(!saving) {
        /*I removed the big saving indicator, it was ugly and stuff ugh*/
        //var indicator = saveIndicator();
        var pTitle = document.getElementById("project-name");
        var sIndicator = document.createElement("span");
        sIndicator.style.animation = "save-span-animation 500ms infinite"
        sIndicator.innerHTML = " - Saving";
        sIndicator.style = `
            color: var(--paragraph-color);
        `
        pTitle.appendChild(sIndicator);

        saving = true;
        setTimeout(function() {
            var sIndicator = pTitle.getElementsByTagName("span")[0];
            sIndicator.parentNode.removeChild(sIndicator);
                saving = false;
        }, 2000)
    
    //Create a template
    var date = new Date();
    var dateTime = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + ":" + date.getHours() + ":" + date.getMinutes();
    
    
    var meta = {
        meta: {
            creator: null,
            created: null,
            edited: dateTime
        },
        times: [],
        files: []
        
    }



    // Get the columns with any elements in it (i.e. the columns that are active slides)
    var cols = document.getElementsByClassName("timeline-column");

    var activeColumns = [];

    for(let i = 0; i < cols.length; i++) {
        var children = cols[i].childNodes;
        var y;
        var childFound = false;
        for(y of children) {
            if(!childFound) {

                if(y.hasChildNodes()) {
                    activeColumns.push(i);
                    childFound = true;
                }
            }
        }
    }



    //Get all the files in each column, and store them in objects
    var files = [];

    var n;

    for(n of activeColumns) {
        var children = document.getElementsByClassName("timeline-column")[n].childNodes;
        var time = document.getElementsByClassName("timeline-column")[n].getAttribute("time");
        var columnData = {columnNo: n, config: {time: time}, content: []};
        var z;
        for(z of children) {
            if(z.hasChildNodes()) {
                
                var file = z.childNodes[0];
                var fName = file.getAttribute("filename");

                var dir;
                if(isPackaged) {
                    dir = path.join(path.dirname(__dirname), "extraResources", "data", "files");
                } else {
                    dir = path.join(__dirname, "extraResources", "data", "files");
                }
                var data = fs.readFileSync(dir + "/" + fName);
                var fileInfo = {fileName: fName, config: file.config[0], data: data.toString("base64")}
                columnData.content.push(fileInfo);
                
            }
        }
        files.push(columnData);

    }

    meta.files = files;






    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    }
}



function saveIndicator() {
    var el = document.createElement("div");
    el.className = "save-progress-container smooth-shadow";

    var wheel = loaderWheel();
    el.appendChild(wheel);

    var title = document.createElement("h2");
    title.innerHTML = "Saving Project";

    el.appendChild(title);

    document.body.appendChild(el);

    return el;
}


/////////////////////////////////////////////////
// This function coordinates the file loading. //
/////////////////////////////////////////////////

function applyFileInfo(fileInfo) {
    var title = fileInfo.meta.title;
    //Apply the title to the app bar
    console.log("asdasd")
    console.log(title)
    console.log(document.getElementById("project-name"))
    document.getElementById("project-name").innerHTML = title;
}


