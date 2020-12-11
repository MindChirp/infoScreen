function createTab(el, name) {
    if(document.getElementsByClassName("browser-tab-container")[0].querySelector("#empty")) {
        document.getElementsByClassName("browser-tab-container")[0].innerHTML = "";
    }
    var tab = document.createElement("button");
    tab.setAttribute("class", "tab smooth-shadow");

    var txt = document.createElement("p");
    txt.innerHTML = name;

    tab.appendChild(txt);

    var cross = document.createElement("div");
    cross.setAttribute("class", "cross");
    tab.appendChild(cross);

    var ico = document.createElement("i");
    ico.setAttribute("class", "material-icons");
    ico.innerHTML = "cancel";

    cross.appendChild(ico);

    document.getElementsByClassName("browser-tab-container")[0].appendChild(tab);
}