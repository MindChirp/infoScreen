function Themes(parent) {
    if(document.getElementById("settings-wrapper")) {
        var el = document.getElementById("settings-wrapper");
        if(el.getAttribute("name") == "themes") {
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
    wrapper.setAttribute("name", "themes");

    parent.appendChild(wrapper);


    var cont = document.createElement("div");
    
    cont.setAttribute("style", `
        height: fit-conten;
        width: 90%;
        margin: auto;
    `);
    wrapper.appendChild(cont);


    var buttons = [];
    var light = themes.addCard("Light Theme", "./data/files/images/lighttheme.png");
    cont.appendChild(light);
    buttons.push(light);

    var dark = themes.addCard("Dark Theme", "./data/files/images/darktheme.png");
    cont.appendChild(dark);
    buttons.push(dark);


    //Future easter egg?
    /*var cancer = themes.addCard("Cancer Theme", "./data/files/images/cancertheme.png");
    cont.appendChild(cancer);*/

    var styles = [
        [`
            border: solid 2px coral;
            box-sizing: border-box;
            height: auto;
            width: 10rem;
            margin-left: auto;
            margin-right: auto;
            border-radius: 0.5rem;
        `],
        [`
            border: none;
            height: auto;
            width: 10rem;
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

    } /*else if(theme=="cancer"){
        cancer.childNodes[0].setAttribute("style", styles[0][0]);
    light.childNodes[0].setAttribute("style", styles[1][0]);
    dark.childNodes[0].setAttribute("style", styles[1][0]);
    }
*/

light.addEventListener("click", function() {
    setTheme(0);
    console.log(styles[0][0])
    light.childNodes[0].setAttribute("style", styles[0][0]);
    dark.childNodes[0].setAttribute("style", styles[1][0]);
    //cancer.childNodes[0].setAttribute("style", styles[1][0]);
})

    dark.addEventListener("click", function() {
        setTheme(1);
        dark.childNodes[0].setAttribute("style", styles[0][0]);
        light.childNodes[0].setAttribute("style",  styles[1][0]);
        //cancer.childNodes[0].setAttribute("style",  styles[1][0]);  
    })
/*
    cancer.addEventListener("click", function() {
        setTheme(2);
        cancer.childNodes[0].setAttribute("style", styles[0][0]);
    light.childNodes[0].setAttribute("style", styles[1][0]);
    dark.childNodes[0].setAttribute("style", styles[1][0]);
    })*/
}


function setTheme(theme) {
    if(theme == 0) {
        document.documentElement.style.setProperty("--main-bg-color", "rgb(235,235,235)");
        document.documentElement.style.setProperty("--title-color", "black");
        document.documentElement.style.setProperty("--paragraph-color", "rgb(50,50,50)");
        document.documentElement.style.setProperty("--secondary-color", "#E8E0D9");
        document.documentElement.style.setProperty("--main-button-color", "#E8E0D9");
        document.documentElement.style.setProperty("--secondary-button-color", "#d9cbbf");
        document.documentElement.style.setProperty("--slider-color", "#4da0ff");
        localStorage.setItem("theme", "light");
    } else if(theme == 1) {
        document.documentElement.style.setProperty("--main-bg-color", "#171F26");
        document.documentElement.style.setProperty("--title-color", "white");
        document.documentElement.style.setProperty("--paragraph-color", "rgb(220,220,220)");
        document.documentElement.style.setProperty("--secondary-button-color", "#121a21");
        document.documentElement.style.setProperty("--secondary-color", "rgb(15, 20, 25)");
        document.documentElement.style.setProperty("--main-button-color", "#1B2630");
        document.documentElement.style.setProperty("--slider-color", "#0075ff");
        localStorage.setItem("theme", "dark");
    } else if(theme == 2) {
        document.documentElement.style.setProperty("--main-bg-color", "linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)");
        document.documentElement.style.setProperty("--title-color", "red");
        document.documentElement.style.setProperty("--paragraph-color", "aqua");
        document.documentElement.style.setProperty("--secondary-button-color", "#B2AB92");
        document.documentElement.style.setProperty("--secondary-color", "purple");
        document.documentElement.style.setProperty("--main-button-color", "#FFBD00");
        document.documentElement.style.setProperty("--slider-color", "#CC99FF");
        localStorage.setItem("theme", "cancer");
    }
}

var themes = {
    addCard: function(name, path) {


        var el = document.createElement("button");
        el.setAttribute("style", `

        `);
        el.setAttribute("class", "theme-button");

        var img = document.createElement("img");
        img.setAttribute("style", `
            height: auto;
            width: 10rem;
            margin-left: auto;
            margin-right: auto;
            border-radius: 0.5rem;
        `)
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
        `)

        return el;


    }
}