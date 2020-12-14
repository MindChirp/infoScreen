function createTab(el, name) {
    if(document.getElementsByClassName("browser-tab-container")[0].querySelector("#empty")) {
        document.getElementsByClassName("browser-tab-container")[0].innerHTML = "";
    }

    var tab = document.createElement("button");
    tab.setAttribute("class", "tab smooth-shadow");
    tab.connectedElement = el;
    tab.selected = false;
    tab.addEventListener("click", function(e) {
        openTab(e.target);
    })
    //tab.setAttribute("connectedElement", el);
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
    cross.addEventListener("click", function(e) {
        removeTab(e.target.closest(".tab").connectedElement);
    })

    document.getElementsByClassName("browser-tab-container")[0].appendChild(tab);
    openTab(tab);
}

function removeTab(el) {

    var tabs = document.getElementsByClassName("tab");
    var x;
    for(x of tabs) {
        if(el == x.connectedElement) {

            if(x.selected) {
                var pane = document.getElementsByClassName("properties-pane")[0];
                pane.parentNode.removeChild(pane);
            }
            
            el.setAttribute("hasTab", "false")
            x.parentNode.removeChild(x);
            
        }
    }
    var container = document.getElementsByClassName("browser-tab-container")[0];
    if(container.innerHTML.length == 0) {
        var p = document.createElement("p");
        p.setAttribute("id", "empty");
        p.innerHTML = "Click on an element's properties to create a tab";
        container.appendChild(p);
    }

}

function openPropertiesTab(el) {
    el.setAttribute("hasTab", "true");
    
    var fileName = el.closest(".scrubber-element").getAttribute("fileName");
    createTab(el, fileName);
}

function openTab(el) {
    if(el.closest(".tab").selected) {
        var pane = document.getElementsByClassName("properties-pane")[0];
        pane.parentNode.removeChild(pane);
        el.closest(".tab").selected = false;
        el.closest(".tab").style.backgroundColor = "var(--secondary-color)";
        return;
    }
    if(el.closest(".cross")) return;
    var tabs = document.getElementsByClassName("tab");
    var x;
    for(x of tabs) {
        if(x.selected) {
            x.style.backgroundColor = "var(--secondary-color)";
            x.selected = false;
        }
    }

    var tab = el.closest(".tab");
    tab.style.backgroundColor = "var(--main-button-color)";
    tab.selected = true;


    //Create the pane if there is none
    if(!document.getElementsByClassName("properties-pane")[0]) {
        var els = document.createElement("div");
        els.setAttribute("class", "properties-pane smooth-shadow");
        document.getElementsByClassName("browser-container")[0].appendChild(els);
        
    }
}