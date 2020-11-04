const { fstat } = require("fs");
const path = require("path");

var dir = path.join(__dirname, "/data/files");
function loadFilesIntoExplorer() {
    var explorer = document.getElementById("browser").querySelector(".content-container").querySelector("#files");
    //Read the folder
    var imgTypes = ["png", "jpg", "gif", "bmp"];
    var vidTypes = ["mp4"];

    fs.readdir(dir, (err,dat) => {

        var x;
        for(x of dat) {


            //Check if dir is folder or file
            if(!fs.lstatSync(dir + "/" + x).isDirectory()) {


                var ext = x.split(".")[x.split(".").length-1]
                var n;
                var isVid = false;
                var isImg = false;
                for(n of imgTypes) {
                    if(n == ext) {
                        isImg = true;
                    }
                }

                var n;
                for(n of vidTypes) {
                    if(n == ext) {
                        isVid = true;
                    }
                }
                
                if(isVid || isImg) {

                var el = document.createElement("div");
                el.setAttribute("class", "file-item");
                el.setAttribute("onmousedown", "dragFileHandler(this)")
                el.setAttribute("draggable", "false")
                explorer.appendChild(el);
                
                var cont = document.createElement("div");
                cont.setAttribute("class", "content");
                cont.style.display = "grid";
                el.appendChild(cont);
                
                var img;
                if(isImg) {
                    img = document.createElement("img");
                    cont.appendChild(img);
                    img.setAttribute("src", dir + "/" + x);
                    //Set the type of the file to image
                    el.setAttribute("type", "img");
                } else {
                    img = document.createElement("video");
                    img.setAttribute("width", "auto");
                    img.setAttribute("height", "100%");
                    var src = document.createElement("source");
                    src.setAttribute("src", dir + "/" + x);
                    src.setAttribute("type", "video/mp4");
                    img.appendChild(src);
                    cont.appendChild(img);
                    img.setAttribute("draggable", "true");
                    //Set the type of the file to video
                    el.setAttribute("type", "vid");

                }
                var p = document.createElement("p");
                p.innerHTML = x;
                
                cont.appendChild(p);
            }
            }
        }

    })
}