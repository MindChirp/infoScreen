
function clearIndicator() {
    setTimeout(() => {

        var title = document.getElementById("project-name");
        var el = title.querySelector("span");
        el.parentNode.removeChild(el);
    }, 5000);
}


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

        if(document.body.corruptFile && !globalSettings.file.overwriteCorruptFiles) {
            alert("inasd")
            saving = true;
            //The file has been marked as possibly corrupt..
            var original = pTitle.innerHTML;
            pTitle.innerHTML = "Error - <span style='opacity: 0.5;'>This file has been flagged as corrupt. It will not be saved as a precaution. </span>"
            setTimeout(() => {
                pTitle.innerHTML = original;
                saving = false;
            }, 5000);
            return;
        }


        if(document.body.devMode) {
            sIndicator.innerHTML = " - Cannot save, in developer mode";
            setTimeout(() => {
                sIndicator.parentNode.removeChild(sIndicator);
                saving = false;
            }, 4000)
        } else {
            sIndicator.innerHTML = " - Saving";
        }

        sIndicator.style = `
            color: var(--paragraph-color);
            opacity: 0.5;
        `;

        pTitle.appendChild(sIndicator);

        saving = true;

        if(document.body.devMode) return;

        //Create a template
        var date = new Date();
        var dateTime = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + ":" + date.getHours() + ":" + date.getMinutes();
        
    
        var meta;
        var creator;
        var created;
        var edited;
        var title;
        if(document.body.projectConfig) {
            created = document.body.projectConfig.created;
            edited = document.body.projectConfig.edited;
            title = document.body.projectConfig.title;
            creator = document.body.projectConfig.creator;
        } else {
            creator = "Unknown";
            edited = "Unknown";
            title = "Corrupt overwrite";
            created = "Unknown";
        }


        try {
            
            meta = {
                meta: {
                    creator: creator,
                    created: created,
                    edited: edited,
                    title: title
                },
                fileInfo: {
    
                    times: [],
                    files: []
                }
                    
            }

        } catch (error) {
            console.log(error);
        }

        if(meta == undefined) return;
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
            var iterator = 0;
            for(z of children) {
                if(z.hasChildNodes()) {
                    
                    var file = z.childNodes[0];
                    var fName = file.getAttribute("filename");

                    var dir;
                    if(isPackaged) {
                        dir = path.join(path.dirname(__dirname), "extraResources", "data", "files", "images");
                    } else {
                        dir = path.join(__dirname, "extraResources", "data", "files", "Images");
                    }
                    var type = file.getAttribute("type");                

                    if(type == "img" || type == "vid") {

                        var data = fs.readFileSync(dir + "/" + fName);
                        var zIndex = iterator;
                        var fileInfo;
                        try {
                            fileInfo = {fileName: fName, type: type, config: file.config, zIndex: zIndex, data: data.toString("base64")}
                        } catch (error) {
                            sIndicator.innerHTML = " - Could not save, a file is too big";
                            clearIndicator();
                            saving = false;
                            return;
                        }
                        columnData.content.push(fileInfo);
                        
                        
                    } else if(type="widget") {
                        var fileInfo = {fileName: fName, type: type, config: file.config}
                        columnData.content.push(fileInfo);
                        
                    }
                }
                iterator++
            }
            files.push(columnData);

        }

        meta.fileInfo.files = files;
        //Zip the meta file
        setTimeout(function() {

        var zip = new require("node-zip")();
        zip.file("meta.json", JSON.stringify(meta));
        var data = zip.generate({base64: false, compression: "DEFLATE"});


        var dirPath;
        if(!isPackaged) {
            dirPath = path.join(__dirname, "extraResources", "data", "programData", "projects");
        } else {
            dirPath = path.join(path.dirname(__dirname), "extraResources", "data", "programData", "projects");
        }

        fs.writeFile(path.join(dirPath, title + '.proj'), data, 'binary', (err) => {
            if(err) {
                return false;
            } else {
                var sIndicator = pTitle.getElementsByTagName("span")[0];
                sIndicator.parentNode.removeChild(sIndicator);
                saving = false;
                return true;

            }
        });
        }, 10);
 
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
        
        if(globalSettings) {

            //Globalsettings, as defined on the first few lines in main.js
            if(globalSettings.file.displayNameInAppBar) {
                document.getElementById("project-name").innerHTML = title;
            } else {
                document.getElementById("project-name").innerHTML = "InfoScreen - Editing";
            }
        } else {
            document.getElementById("project-name").innerHTML = title + " - Could not load settings";

        }
        
        //Apply the title to the app bar
        document.body.projectConfig = {title: title, creator: fileInfo.meta.creator, created: fileInfo.meta.created, edited: fileInfo.meta.edited}
}
