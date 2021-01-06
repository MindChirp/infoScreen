        const { EALREADY } = require("constants");
const fs = require("fs");


//Code for the effects ribbon-menu

var effects = function () {
    this.files = function () {

        //Set the first item in the effects menu ribbon as acitve
        setEffectsMenuItem(0);
        var container = document.getElementById("effects").querySelector("#content").querySelector("#container");
            container.innerHTML = "";
        //Read all the files from directory
        const fileFolder = "./data/files";

        fs.readdir(fileFolder, (err, files) => {
            files.forEach(function(e) {
                //Create a tile for each element
                var card = document.createElement("div");
                card.setAttribute("style", `
                    height: fit-content;
                    min-height: 75px;
                    vertical-align: top;
                    margin-left: 20px;
                    margin-top: 10px;
                    width: fit-content;
                    max-width: 100px;
                    display: inline-block;
                    color: white;
                    padding-left: 20px;
                    padding-right: 20px;
                    background-color: black;
                `);

                var p = document.createElement("p");
                p.setAttribute("style", `
                    margin: 0;
                    margin-bottom: 10px;
                `)

                if(e.length > 10) {
                    var holder = e;
                    var j = holder.substring(0, 10);
                    p.innerHTML = j + "...";
                } else {
                    p.innerHTML = e;
                }


                var img = document.createElement("img");
                img.setAttribute("style", `
                    height: 50px;
                    width: auto;
                    margin-left: 50%;
                    transform: translateX(-50%);
                `)
                img.setAttribute("src", "./data/files/" + e);
                card.appendChild(img);
                card.appendChild(p);
                container.appendChild(card);
            })
        })

    }

    this.edit = function () {
        //Set the first item in the effects menu ribbon as acitve
        setEffectsMenuItem(1);
        var container = document.getElementById("effects").querySelector("#content").querySelector("#container");

    container.innerHTML = "";
            var render = document.createElement("button");
            render.setAttribute("style", `
                height: 50px;
                width: 150px;
                background-color: rgb(9, 11, 14);
                border-style: none;
                color: white;
                font-size: 20px;
                border-radius: 5px;
                margin-left: 50%;
                transform: translateX(-50%);
                margin-top: 15%;
                outline: none;
            `);

            render.innerHTML = "Save";

container.appendChild(render);

    }

    this.widgets = function () {
        //Set the first item in the effects menu ribbon as acitve
        setEffectsMenuItem(2);
        var container = document.getElementById("effects").querySelector("#content").querySelector("#container");
        container.innerHTML = "Widget editor";

    }
}

//Function to set an element of choice as active in the effects ribbon menu
function setEffectsMenuItem(index) {
    var menuButtons = document.getElementsByClassName("menu-option");
    for (var i = 0; i < menuButtons.length; i++) {
        menuButtons[i].style.backgroundColor = "transparent";
    }

    menuButtons[index].style.backgroundColor = "rgba(0,0,0,0.5)";
}


//Notifications menu

function toggleNotificationMenu() {
    var pane = document.getElementById("notification-pane");
    if (pane.style.display == "none") {
        pane.style.display = "block";
        
        //Temporary
        pane.innerHTML = "";
        var p = document.createElement("p");
        p.innerHTML = "Nothing New";
        p.setAttribute("style", `
            color: rgba(100,100,100,1);
            font-size: 20px;
            margin: 0;
            line-height: 57.19px;
            height: 57.19px;
            font-weight: lighter;
        `)

        pane.appendChild(p);
    } else {
        pane.style.display = "none";
    }
}







//App bar menu handler
function Appmenu() {
    this.appbar = function(template) {

        var menu = document.createElement("ul");

        var x;
        for(x of template) {
            var b = document.createElement("li");    
            b.style.position = "relative";
            b.innerHTML = x.label;
            menu.appendChild(b);

            if(x.submenu) {

                var sub = document.createElement("div");
                sub.setAttribute("style", `
                    height: fit-content;
                    min-height: 2rem;
                    width: 15rem;
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    z-index: 100;
                    background-color: var(--secondary-color);
                    opacity: 1;
                    border-radius: 0.25rem;
                `);
                sub.className = "sub-menu smooth-shadow"

                var y;
                for(y of x.submenu) {
                    if(y.label == "divider") {

                        var div = document.createElement("div");
                        div.style = `
                            height: 1px;
                            background-color: var(--main-bg-color);
                            width: 95%;
                            margin: 0rem auto;
                        `
                        sub.appendChild(div);
                    } else {

                    

                        var el = document.createElement("div");
                        el.className = "button";
                        el.style = `
                            height: 2rem;
                            width: 100%;
                            position: relative; 
                        `;
                        if(x.click) {
                            el.addEventListener("click", x.click);
                        }
                        var label = document.createElement("p");
                        label.style = `
                            height: 100%;
                            line-height: 2rem;
                            width: fit-content;
                            max-width: 7rem;
                            color: var(--paragraph-color);
                            display: inline-block;
                            float: left;
                            margin: 0;
                            margin-left: 0.5rem;

                        `;
                        label.innerHTML = y.label;
                        var acc;
                        if(y.accelerator) {
                            acc = document.createElement("p");
                            acc.innerHTML = y.accelerator;
                            acc.style = `
                                height: 100%;
                                line-height: 2rem;
                                width: fit-content;
                                margin: 0;
                                display: inline-block;
                                float: right;
                                margin-right: 0.5rem;
                                color: var(--paragraph-color);
                                opacity: 0.6;
                            `;
                            el.appendChild(acc);
                        }
                        
                        el.addEventListener("mouseenter", function(e) {
                            if(e.target.closest(".button").querySelector(".sub-menu")) {
                                e.target.closest(".button").querySelector(".sub-menu").style.display = "block";
                            }
                        })

                        el.addEventListener("mouseleave", function(e) {
                            if(e.target.closest(".button").querySelector(".sub-menu")) {
                                e.target.closest(".button").querySelector(".sub-menu").style.display = "none";
                            }
                        })
                        //Check for submenu
                        if(y.submenu) {
                            var subMenu = appendSubMenu(y.submenu);
                            el.appendChild(subMenu);
                        }

                        el.appendChild(label);
                        sub.appendChild(el);
                    }
                }
                b.appendChild(sub);


            }

            b.onclick = function(e) {
                setTimeout(function() {
                    //Open the menu after the global onclick script has run
                    e.target.closest("li").querySelector(".sub-menu").style.display = "block";
                }, 1)
            }

        }


        return menu;
    }
}

function appendSubMenu(submenu) {
    var sub = document.createElement("div");
    sub.setAttribute("class", "sub-menu smooth-shadow");
    sub.style = `
        height: fit-content;
        min-height: 2rem;
        width: 15rem;
        display: block;
        position: absolute;
        right: 0;
        transform: translate(97%);
        z-index: 100;
        background-color: var(--secondary-color);
        opacity: 1;
        border-radius: 0.25rem;
    `;
    var x;
    for(x of submenu) {
        if(x.label == "divider") {

            var div = document.createElement("div");
            div.style = `
                height: 1px;
                background-color: var(--main-bg-color);
                width: 95%;
                margin: 0rem auto;
            `
            sub.appendChild(div);
        } else {

            var el = document.createElement("div");
            el.className = "button";
            el.style = `
                height: 2rem;
                width: 100%;
                position: relative; 
            `;
            if(x.click) {
                el.addEventListener("click", x.click);
            }
            var label = document.createElement("p");
            label.style = `
                height: 100%;
                line-height: 2rem;
                width: fit-content;
                max-width: 7rem;
                color: var(--paragraph-color);
                display: inline-block;
                float: left;
                margin: 0;
                margin-left: 0.5rem;
        
            `;
            label.innerHTML = x.label;

            var acc;
            if(x.accelerator) {
                acc = document.createElement("p");
                acc.innerHTML = x.accelerator;
                acc.style = `
                    height: 100%;
                    line-height: 2rem;
                    width: fit-content;
                    margin: 0;
                    display: inline-block;
                    float: right;
                    margin-right: 0.5rem;
                    color: var(--paragraph-color);
                    opacity: 0.6;
                `;
                el.appendChild(acc);
            }

            el.appendChild(label);
            sub.appendChild(el);

            if(x.submenu) {
                var menuThing = appendSubMenu(x.submenu);
                el.appendChild(menuThing);
                
                el.addEventListener("mouseenter", function(e) {
                    if(e.target.closest(".button").querySelector(".sub-menu")) {
                        e.target.closest(".button").querySelector(".sub-menu").style.display = "block";
                    }
                })

                el.addEventListener("mouseleave", function(e) {
                    if(e.target.closest(".button").querySelector(".sub-menu")) {
                        e.target.closest(".button").querySelector(".sub-menu").style.display = "none";
                    }
                })
            }
        }
    }

    return sub;
}











function fullPageMenu(type) {     
    var el = document.createElement("div");
    el.setAttribute("class", "menu");
    document.body.appendChild(el);
    switch(type) {
        case "user":

            var header = document.createElement("div");
            header.setAttribute("class", "header");
            el.appendChild(header);

        break;
    }

    var back = document.createElement("button");
    back.setAttribute("class", "fd-button smooth-shadow back-button");
    back.setAttribute("style", `
        position: absolute;
        bottom: 1rem;
        left: 1rem;
        height: 3rem;
        width: 3rem;
        z-index: 10;
    `);

    infoOnHover(back, "Go back");

    back.addEventListener("click", function() {
        el.parentNode.removeChild(el);
        if(document.getElementsByClassName("information-popup")) {
            document.getElementsByClassName("information-popup")[0].parentNode.removeChild(document.getElementsByClassName("information-popup")[0])
        }
    })

    var ico = document.createElement("i");
    ico.setAttribute("class", "material-icons");
    ico.innerHTML = "keyboard_backspace";
    back.appendChild(ico);
    ico.setAttribute("style", `
        line-height: 3rem;
        font-size: 1.4rem;
        text-align: center;
        transform: translateX(-0.15rem);
    `)

    el.appendChild(back);
    return el;
}