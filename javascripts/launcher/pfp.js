const { fstat, fdatasync } = require("fs");
//const fs = require("fs");   
const { settings } = require("cluster");
const { isFunction } = require("util");
const path = require("path");
function profilePhoto(parent) {

    if(document.getElementById("settings-wrapper")) {
        var el = document.getElementById("settings-wrapper");
        if(el.getAttribute("name") == "profile-pic") {
            return;
        }
        el.parentNode.removeChild(el);
    }


    if(!document.getElementById("divider-line")) {
        var div = divider();
        parent.appendChild(div);
    }


    var wrapper = document.createElement("div");
    wrapper.setAttribute("id", "settings-wrapper");
    wrapper.setAttribute("name", "profile-pic");

    parent.appendChild(wrapper);



    var imgCont = document.createElement("div");
    imgCont.setAttribute("style", `
        height: 12rem;
        width: 12rem;
        display: inline-block;
        float: left;
        border-radius: 0.5rem;
        background-color: var(--main-button-color);
        transition: all 500ms ease-in-out;
        overflow: hidden;
    `);
    imgCont.setAttribute("class", "smooth-shadow");
    var img = document.createElement("img");
    img.setAttribute("id", "img-positioner-image")
    var ext = localStorage.getItem("pfpExtension");
    if(ext == null) {
        var imgPath = path.join(__dirname,"internalResources", "images", "default.png");
    } else {
        var imgPath = path.join(path.dirname(__dirname),"extraResources", "data", "programData", "profilePics", "user" + ext);
    }
    img.src = imgPath;
    img.style.height = "100%";
    img.style.width = "auto";
    img.style.marginLeft = "50%";   
    img.style.transform = "translateX(-50%)";
    imgCont.appendChild(img);

    wrapper.appendChild(imgCont);

    var div = document.createElement("div");
    div.setAttribute("style", `
        height: fit-content;
        width: fit-content;
        display: inline-block;
        margin-left: 1rem;
    `);

    wrapper.appendChild(div);

    var selImg = document.createElement("button");
    selImg.setAttribute("class", "fd-settings-button smooth-shadow");
    selImg.innerHTML = "Select image";
    selImg.style.display = "block";

    selImg.addEventListener("click", function() {
        var paths = ipcRenderer.sendSync("open-pfp-selector");
        if(paths != "cancelled") {


    var letters = ["A","B","C","D","E","F","G","H","I","J"];


        var extension = paths[0].split("\\")[paths[0].split("\\").length-1].split(".")[paths[0].split("\\")[paths[0].split("\\").length-1].split(".").length-1];
        localStorage.setItem("pfpExtension", letters[parseInt(Math.random()*10).toString().split(".")[0]]+ letters[parseInt(Math.random()*10).toString().split(".")[0]] + "." + extension.toString());
        var directory = path.join(path.dirname(__dirname),"extraResources",  "data", "programData", "profilePics");
        fs.readdir(directory, (err, files) => {
            if(err) throw err;
            for(const file of files) {
                if(file == "default.png" || file == "profilePicDat.json") {
                    
                } else {
                    fs.unlink(path.join(directory, file), (err) => {
                        if(err) throw err;
                    });
                }
            }
        })
        setTimeout(function() {
            /*fs.createReadStream(path[0]).pipe(fs.createWriteStream('./data/programData/profilePics/user' +localStorage.getItem("pfpExtension")), (err) => {
                if(err) throw err;
            });*/
            if(ext == null) {
                var imgPath = path.join(__dirname,"internalResources", "images", "default.png");
            } else {
                var imgPath = path.join(path.dirname(__dirname),"extraResources", "data", "programData", "profilePics", "user" + ext);
            }
            try {
                fs.copySync(paths[0], imgPath + localStorage.getItem("pfpExtension"));
            } catch (error) {
                console.log("Could not copy profile picture");
                console.error(error);
            }
            if(document.getElementById("img-positioner-image")) {
                var img = document.getElementById("img-positioner-image");
                img.parentNode.removeChild(img);
            }

                    var img = document.createElement("img");
                    img.setAttribute("id", "img-positioner-image")

//----------------------------asdasddas


                    var ext = localStorage.getItem("pfpExtension");
                    console.log(ext)
                    if(ext == null) {
                        var imgPath = path.join(__dirname,"internalResources", "images", "default.png");
                    } else {
                        var imgPath = path.join(path.dirname(__dirname),"extraResources", "data", "programData", "profilePics", "user" + ext);
                    }
                    img.src = imgPath;
                    changeState();
                    img.style.height = "100%";
                    img.style.width = "auto";
                    img.style.marginLeft = "50%";   
                    img.style.transform = "translateX(-50%)";
                    imgCont.appendChild(img);
        }, 100);
    }
        });
        

        //Hoist
        var size = 1;
        var Xpos = -50;
        var Ypos = 0;

        var data;
        try {
            var datPath = path.join(path.dirname(__dirname),"extraResources", "data","programData","profilePics","profilePicDat.json");
            var data = fs.readFileSync(datpath);
        } catch (error) {
            console.log("Could not find or read the profile picture metadata. Retrying..");
            try {
                var datPath = path.join(__dirname,"extraResources", "data","programData","profilePics","profilePicDat.json");
                var data = fs.readFileSync(datpath);
            } catch (error) {
                console.log("Could not find or read the profile picture metadata.");
                data = "Some unparsable gibberish";
            }
        }
        var dat;
        try{
            dat = JSON.parse(data);
            Xpos = dat.positioning[0];
            Ypos = dat.positioning[1];
            size = dat.positioning[2];
            img.style.transform = "translateX(" + Xpos + "%) translateY(" + Ypos + "%) scale(" + size + ")";
        } catch(err){
            
            //The JSON file must have been corrupted, repair it.
            var dat = `{
                "positioning": [` + Xpos + `,` + Ypos + `,` + size + `]
            }`;
            try {
                var datPath = path.join(path.dirname(__dirname),"extraResources", "data","programData","profilePics","profilePicDat.json");
                fs.writeFileSync(datPath, dat, (err) => {
                    if(err) throw err;
                })
            } catch (error) {
                var datPath = path.join(__dirname,"extraResources", "data","programData","profilePics","profilePicDat.json");
                fs.writeFileSync(datPath, dat, (err) => {
                    if(err) throw err;
                }) 
            }
        }


        


    div.appendChild(selImg);

    var adjust = document.createElement("button");
    adjust.setAttribute("class", "fd-settings-button smooth-shadow");
    adjust.innerHTML = "Position image";
    adjust.style.display = "block";
    adjust.style.marginTop = "0.5rem";
    adjust.classList.add("ripple-element");
    appendRipple(adjust);

    adjust.addEventListener("click", function() {
        imgCont.style.borderRadius = "100%";
        imgCont.style.marginTop = "1.5rem";


        if(!document.getElementById("controls")) {
            var cont = document.createElement("div");
            cont.setAttribute("id", "controls");
            cont.style.animation = "fade-in 300ms ease-in-out 0.2s";
            cont.style.animationFillMode = "backwards";
            var p = document.createElement("p");
            p.innerHTML = "Scale";      
            cont.appendChild(p);
            var scale = document.createElement("input");
            scale.type = "range";
            scale.min = 0.5;
            scale.max = 4;
            scale.step = 0.1;
            scale.value = size;
            scale.style.width = "15rem";

            cont.appendChild(scale);

            scale.addEventListener("change", function(event) {
                var start = 1;
                document.getElementById("img-positioner-image").style.transform = "translateX(" + Xpos + "%) translateY(" + Ypos + "%) scale(" + event.target.value + ")";
                size = event.target.value;
            });
            var p = document.createElement("p");
            p.innerHTML = "X-axis transform";      
            cont.appendChild(p);
            var scale = document.createElement("input");
            scale.type = "range";
            scale.min = -40;
            scale.max = 40;
            scale.value = Xpos+50;
            scale.style.width = "15rem";

            cont.appendChild(scale);


            scale.addEventListener("change", function(event) {
                var start = -50;
                document.getElementById("img-positioner-image").style.transform = "translateX(" + parseInt(parseInt(start) + parseInt(event.target.value)*2) + "%) translateY(" + Ypos + "%) scale(" + size + ")";
                Xpos = parseInt(start) + parseInt(event.target.value)*2;
            });



            var p = document.createElement("p");
            p.innerHTML = "Y-axis transform";      
            cont.appendChild(p);
            var scale = document.createElement("input");
            scale.type = "range";
            scale.min = -40;
            scale.max = 40;
            scale.value = Ypos;
            scale.style.width = "15rem";

            cont.appendChild(scale);

            scale.addEventListener("change", function(event) {
                var start = 0;
                document.getElementById("img-positioner-image").style.transform = "translateX(" + Xpos + "%) translateY(" + parseInt(parseInt(start) + parseInt(event.target.value)*2) + "%) scale(" + size + ")";
                Ypos = parseInt(start) + parseInt(event.target.value)*2;
            });

            var save = document.createElement("button");
            save.setAttribute("class", "fd-settings-button smooth-shadow");
            save.setAttribute("style", `
                background-color: var(--secondary-button-color);
                display: block;
                margin-top: 0.5rem;
            `);
            save.innerHTML = "Save changes";
            save.classList.add("ripple-element");
            appendRipple(save);

            cont.appendChild(save)

            save.addEventListener("click", function() {
                var dat = `{
                    "positioning": [` + Xpos + `,` + Ypos + `,` + size + `]
                }`;
            localStorage.setItem("pfpPos", JSON.stringify([Xpos,Ypos,size]));
                fs.writeFileSync("./data/programData/profilePics/profilePicDat.json", dat, (err) => {
                    if(err) throw err;
                })
                changeState();
            })


            div.appendChild(cont);
            
        }

    })

    div.appendChild(adjust);



}


/*
var zip = new require("node-zip")();
zip.file("test.txt", "hello there");
var data = zip.generate({base64:false,compression:'DEFLATE'});
fs.writeFileSync('./data/programData/projects/test.proj', data, 'binary');


var zip = new require("node-zip")();
zip.file("test.txt", "no there");
var data = zip.generate({base64:false,compression:'DEFLATE'});
fs.writeFileSync('./data/programData/projects/test1.proj', data, 'binary');'

*/
