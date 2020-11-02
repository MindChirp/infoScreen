function viewportSettings() {
    var el = document.getElementById("viewport").querySelector(".settings-bar");
    el.style.display = "block";
}

function closeViewportSettings(el) {
    el.parentNode.parentNode.style.display = "none";
}

var settings = document.getElementById("viewport").querySelector(".settings-bar").querySelector(".content").getElementsByClassName("select");
settings[0].addEventListener("change", function() {
    var val = settings[0].childNodes[0].value;
    ratio = val.split(":")[0] / val.split(":")[1];
})

settings[1].addEventListener("change", function() {
    var val = settings[1].childNodes[0].value;
    if(val != "Blue"){
        document.getElementById("viewport").querySelector("#content").style.backgroundColor = val;
    } else if(val == "Blue") {
        document.getElementById("viewport").querySelector("#content").style.backgroundColor = "#4da0ff";
    }
    if(val.toLowerCase() == "white") {
        document.getElementById("viewport").querySelector(".settings-button").childNodes[0].style.color = "black";
        document.getElementById("viewport").setAttribute("style", "background-color: var(--light-shade);")
    } else {
        document.getElementById("viewport").querySelector(".settings-button").childNodes[0].style.color = "white";
        document.getElementById("viewport").setAttribute("style", "background-color: var(--dark-shade);")

    }
})