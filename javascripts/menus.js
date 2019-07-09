//Code for the effects ribbon-menu

var effects = function () {
    this.files = function () {

        //Set the first item in the effects menu ribbon as acitve
        setEffectsMenuItem(0);
        var container = document.getElementById("effects").querySelector("#content").querySelector("#container");
        container.innerHTML = "File explorer";
    }

    this.edit = function () {
        //Set the first item in the effects menu ribbon as acitve
        setEffectsMenuItem(1);
        var container = document.getElementById("effects").querySelector("#content").querySelector("#container");
        container.innerHTML = "Effects editor";

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