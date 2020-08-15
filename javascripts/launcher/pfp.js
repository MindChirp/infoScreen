const { fstat, fdatasync } = require("fs");
const fs = require("fs");
const { settings } = require("cluster");
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
        background-color: #1B2630;
        transition: all 500ms ease-in-out;
        overflow: hidden;
    `);
    imgCont.setAttribute("class", "smooth-shadow");
    var img = document.createElement("img");
    img.setAttribute("id", "img-positioner-image")
    var ext = localStorage.getItem("pfpExtension");
    img.src = "../data/programData/profilePics/user" + ext;
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
        ipc.send("open-pfp-selector");
    })

    var letters = ["A","B","C","D","E","F","G","H","I","J"];

    ipc.on("selected-image", function(event, path) {
        var path = JSON.parse(path).filePaths[0];
        console.log(path)



        var extension = path.split("\\")[path.split("\\").length-1].split(".")[path.split("\\")[path.split("\\").length-1].split(".").length-1];
        localStorage.setItem("pfpExtension", letters[parseInt(Math.random()*10).toString().split(".")[0]]+ letters[parseInt(Math.random()*10).toString().split(".")[0]] + "." + extension.toString());
        console.log(localStorage.getItem("pfpExtension"));
        var directory = "./data/programData/profilePics/"
        fs.readdir(directory, (err, files) => {
            if(err) throw err;
            for(const file of files) {
                if(file == "default.png") {
                    
                } else {
                    fs.unlink("./data/programData/profilePics/" + file, (err) => {
                        if(err) throw err;
                    })
                }
            }
        })
        setTimeout(function() {
            fs.createReadStream(path).pipe(fs.createWriteStream('./data/programData/profilePics/user' +localStorage.getItem("pfpExtension")), (err) => {
                if(err) throw err;
            });
            if(document.getElementById("img-positioner-image")) {
                var img = document.getElementById("img-positioner-image");
                img.parentNode.removeChild(img);
            }
                setTimeout(function() {

                    var img = document.createElement("img");
                    img.setAttribute("id", "img-positioner-image")
                    var ext = localStorage.getItem("pfpExtension");
                    console.log(ext);
                    img.src = "../data/programData/profilePics/user" + ext;
                    img.style.height = "100%";
                    img.style.width = "auto";
                    img.style.marginLeft = "50%";   
                    img.style.transform = "translateX(-50%)";
                    imgCont.appendChild(img);
                }, 100)
        }, 100);
        });
        

        //Hoist
        var size = 1;
        var Xpos = -50;
        var Ypos = 0;

        fs.readFile("./data/programData/profilePics/profilePicDat.json", (err, data) => {
            if(err) throw err;
            var dat = JSON.parse(data);
            Xpos = dat.positioning[0];
            console.log(Xpos);
            Ypos = dat.positioning[1];
            size = dat.positioning[2];
            img.style.transform = "translateX(" + Xpos + "%) translateY(" + Ypos + "%) scale(" + size + ")";
        });
        


    div.appendChild(selImg);

    var adjust = document.createElement("button");
    adjust.setAttribute("class", "fd-settings-button smooth-shadow");
    adjust.innerHTML = "Position image";
    adjust.style.display = "block";
    adjust.style.marginTop = "0.5rem";

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
                console.log(parseInt(start) + parseInt(event.target.value)*2)
                img.style.transform = "translateX(" + Xpos + "%) translateY(" + Ypos + "%) scale(" + event.target.value + ")";
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
                console.log(parseInt(start) + parseInt(event.target.value)*2)
                img.style.transform = "translateX(" + parseInt(parseInt(start) + parseInt(event.target.value)*2) + "%) translateY(" + Ypos + "%) scale(" + size + ")";
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
                console.log(parseInt(start) + parseInt(event.target.value)*2)
                img.style.transform = "translateX(" + Xpos + "%) translateY(" + parseInt(parseInt(start) + parseInt(event.target.value)*2) + "%) scale(" + size + ")";
                Ypos = parseInt(start) + parseInt(event.target.value)*2;
            });

            var save = document.createElement("button");
            save.setAttribute("class", "fd-settings-button smooth-shadow");
            save.setAttribute("style", `
                background-color: #121a21;
                display: block;
                margin-top: 0.5rem;
            `);
            save.innerHTML = "Save changes";
            cont.appendChild(save)

            save.addEventListener("click", function() {
                var dat = `{
                    "positioning": [` + Xpos + `,` + Ypos + `,` + size + `]
                }`;
            localStorage.setItem("pfpPos", JSON.stringify([Xpos,Ypos,size]));
                fs.writeFile("./data/programData/profilePics/profilePicDat.json", dat, (err) => {
                    if(err) throw err;
                })
            })


            div.appendChild(cont);
            
        }

    })

    div.appendChild(adjust);



}