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
        document.body.keyCombinations = [];
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
                        if(y.click) {
                            el.addEventListener("click", y.click);
                        }

                        if(y.disabled) {
                            el.classList.add("off");

                        }

                        if(y.accelerator) {
                            //Append accelerator (shortcut)
                            var components = y.accelerator.split("+");
                            var criteriaList = {ctrlKey: false, altKey: false, shiftKey: false, letters: [], connectedElement: y};
                            var x;

                            for(x of components) {
                                if(x.toLowerCase() == "ctrl") {
                                    criteriaList.ctrlKey = true;
                                }

                                else if(x.toLowerCase() == "alt") {
                                    criteriaList.altKey = true;
                                }

                                else if(x.toLowerCase() == "shift") {
                                    criteriaList.shiftKey = true;
                                }

                                else {
                                    criteriaList.letters.push("Key" + x.toUpperCase());
                                }
                                
                            }

                            document.body.keyCombinations.push(criteriaList);
                            
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
            if(x.disabled) {
                el.classList.add("off");
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
                //Append accelerator (shortcut)
                var components = x.accelerator.split("+");
                var criteriaList = {ctrlKey: false, altKey: false, shiftKey: false, letters: [], connectedElement: x};
                var y;

                for(y of components) {
                    if(y.toLowerCase() == "ctrl") {
                        criteriaList.ctrlKey = true;
                    }

                    else if(y.toLowerCase() == "alt") {
                        criteriaList.altKey = true;
                    }

                    else if(y.toLowerCase() == "shift") {
                        criteriaList.shiftKey = true;
                    }

                    else {
                        criteriaList.letters.push("Key" + y.toUpperCase());
                    }
                    
                }

                document.body.keyCombinations.push(criteriaList);
                
            }



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



function themeMenu() {
    var menu;
    if(!document.getElementsByClassName("menu")[0]) {
        menu = fullPageMenu("user");
        document.body.appendChild(menu);
        menu.style = `
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            z-index: 101;
        `;
        //Delete the default header
        menu.childNodes[0].parentNode.removeChild(menu.childNodes[0]);
    } else {
        //Menu already exists. Delete it
        var menus = document.getElementsByClassName("menu");
        var x;

        for(x of menus) {
            x.parentNode.removeChild(x);
        }

        //Call the themeMenu function again, to instantiate a new menu element
        themeMenu();
    }


    var cont = document.createElement("div");
    cont.style = `
        height: fit-content;
        width: 40%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `;

    menu.appendChild(cont);

    
    //Code copied over from the launcher. Oops.
    var buttons = [];
    var paths = path.join(__dirname, "internalResources", "images");
    var light = themes.addCard("Light Theme", paths+"/lighttheme.png");
    light.deactivated = true;
    light.style.opacity = 0.2;
    light.style.cursor = "default";
    infoOnHover(light, "In the works");
    cont.appendChild(light);
    buttons.push(light);
    light.ondragstart = (e) => {e.preventDefault()}
    var dark = themes.addCard("Dark Theme", paths+"/darktheme.png");
    dark.style.float = "right";
    cont.appendChild(dark);
    buttons.push(dark);
    dark.ondragstart = (e) => {e.preventDefault()}


    //Future easter egg?
    /*var cancer = themes.addCard("Cancer Theme", "./internalResources/images/cancertheme.png");
    cont.appendChild(cancer);*/

    var styles = [
        [`
            border: solid 2px coral;
            box-sizing: border-box;
            height: auto;
            width: 100%;
            margin-left: auto;
            margin-right: auto;
            border-radius: 0.5rem;
        `],
        [`
            border: none;
            height: auto;
            width: 100%;
            margin-left: auto;
            margin-right: auto;
            border-radius: 0.5rem;
        `]
    ]



    var theme = localStorage.getItem("theme");
    if(theme == "light") {
        light.childNodes[0].setAttribute("style", styles[0][0]);
        dark.childNodes[0].setAttribute("style", styles[1][0]);
        //cancer.childNodes[0].setAttribute("style", styles[1][0]);
    } else if(theme=="dark"){
        dark.childNodes[0].setAttribute("style", styles[0][0]);
        light.childNodes[0].setAttribute("style", styles[1][0]);
        //cancer.childNodes[0].setAttribute("style", styles[1][0]);

    } else if(theme=="cancer"){
        cancer.childNodes[0].setAttribute("style", styles[0][0]);
    light.childNodes[0].setAttribute("style", styles[1][0]);
    dark.childNodes[0].setAttribute("style", styles[1][0]);
    }


    /////////////////////////////
    // DEACTIVATED LIGHT THEME //
    /////////////////////////////
/*
light.addEventListener("click", function() {
    setTheme(0);
    console.log(styles[0][0])
    light.childNodes[0].setAttribute("style", styles[0][0]);
    dark.childNodes[0].setAttribute("style", styles[1][0]);
    //cancer.childNodes[0].setAttribute("style", styles[1][0]);
})*/

    dark.addEventListener("click", function() {
        setTheme(1);
        dark.childNodes[0].setAttribute("style", styles[0][0]);
        light.childNodes[0].setAttribute("style",  styles[1][0]);
        //cancer.childNodes[0].setAttribute("style",  styles[1][0]);  
    })

    /*cancer.addEventListener("click", function() {
        setTheme(2);
        cancer.childNodes[0].setAttribute("style", styles[0][0]);
    light.childNodes[0].setAttribute("style", styles[1][0]);
    dark.childNodes[0].setAttribute("style", styles[1][0]);
    })*/

}


var themes = {
    addCard: function(name, path) {


        var el = document.createElement("button");
        el.setAttribute("style", `
            transform: scale(1);
            vertical-align: top;
            width: 40%;
            height: 15rem;      
        `);

        el.setAttribute("class", "theme-button");

        var img = document.createElement("img");
        img.setAttribute("style", `
            height: auto;
            width: 100%;
            margin-left: auto;
            margin-right: auto;
            border-radius: 0.5rem;
        `);
        img.setAttribute("class", "smooth-shadow");
        img.setAttribute("src", path);   
        el.appendChild(img);

        var p = document.createElement("p");
        p.innerHTML = name;
        el.appendChild(p);
        p.setAttribute("style", `
            width: 100%;
            text-align: center;
            height: 1rem;
            line-height: 1rem;
            font-size: 1.5rem;
        `)

        return el;


    }
}

function languageMenu() {
    var menu;
    if(!document.getElementsByClassName("menu")[0]) {
        menu = fullPageMenu("user");
        document.body.appendChild(menu);
        menu.style = `
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            z-index: 101;
        `;
        //Delete the default header
        menu.childNodes[0].parentNode.removeChild(menu.childNodes[0]);
    } else {
        //Menu already exists. Delete it
        var menus = document.getElementsByClassName("menu");
        var x;

        for(x of menus) {
            x.parentNode.removeChild(x);
        }

        //Call the aboutMenu function again, to instantiate a new menu element
        languageMenu();
    }


}






function aboutMenu() {
    var menu;
    if(!document.getElementsByClassName("menu")[0]) {
        menu = fullPageMenu("user");
        document.body.appendChild(menu);
        menu.style = `
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            z-index: 101;
        `;
        //Delete the default header
        menu.childNodes[0].parentNode.removeChild(menu.childNodes[0]);
    } else {
        //Menu already exists. Delete it
        var menus = document.getElementsByClassName("menu");
        var x;

        for(x of menus) {
            x.parentNode.removeChild(x);
        }

        //Call the aboutMenu function again, to instantiate a new menu element
        aboutMenu();
    }
    if(menu) {
        menu.style.padding = "3rem";
        menu.style.boxSizing = "border-box";
    }

    var tile = function(title, meta) {
        var el = document.createElement("div");
        el.style = `
            height: fit-content;
            width: fit-content;
            display: inline-block;
            margin-right: 2rem;
            margin-top: 1rem;
        `

        var h1 = document.createElement("p");
        h1.style = `
            line-height: 1.5rem;
            font-size: 1.5rem;
            margin: 0;
            font-weight: lighter;
            display: block;
            color: var(--title-color);
        `;
        h1.innerHTML = title;

        var p = document.createElement("p");
        p.style = `
            margin: 0;
            font-weight: lighter;
            line-height: 1.5rem;
            font-size: 1.5rem;
            display: block;
            color: var(--paragraph-color);
            opacity: 0.5;
        `;
        p.innerHTML = meta;

        el.appendChild(h1);
        el.appendChild(p);
        return el;
    }


    var ver = tile("Version", appVersion); //As declared on line 13 in main.js
    menu.appendChild(ver);

    var dev = tile("Developer", "Frikk O. Larsen");
    menu.appendChild(dev);

    var name = tile("Name", "Infoscreen development edition");
    menu.appendChild(name);

    var design = tile("Layout and design", "Frikk O. Larsen");
    menu.appendChild(design);
    
    var div = document.createElement("div");
    div.style.display = "block";
    menu.appendChild(div);
    
    var funFacts = document.createElement("h2");
    funFacts.style = `
        color: var(--title-color);
        margin: 3rem 0 1rem;
        font-weight: lighter;
    `
    funFacts.innerHTML = "Fun Facts";
    menu.appendChild(funFacts);

    var lines = tile("Lines of code", "11600+ (excluding libraries)");
    menu.appendChild(lines);

    var commit = tile("First github commit", "8th of July 2019");
    menu.appendChild(commit);

    var notFun = document.createElement("h2");
    notFun.style = `
        color: var(--title-color);
        margin: 4rem 0 1rem;
        font-weight: lighter;
    `
    notFun.innerHTML = "Questions and Answers";
    menu.appendChild(notFun);

    var stdrd = tile("How does this work?", `The program is built on Electron, which utilizes Chromium and Node.js to run a desktop application. <br> 
        Chromium is a technology used by Google in its Chrome web browser, and allows it to render web pages. <br> 
        This application uses the same technology to generate info screen slides that are compatible with many different devices. <br>
        
    `);
    menu.appendChild(stdrd)

    var qst1 = tile("Are the slides saved as video files?", `
        The slides are <em>not</em> saved as video files, in fact they are saved as web pages. <br>
        They are automatically generated based on what content the user wishes to display on their information screens. <br>
        To show up to date information on each of the slides, a video file wouldn't suffice, and therefore a live webpage is displayed instead. 
    `);
    menu.appendChild(qst1)



}