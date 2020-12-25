function infoBox(el, title) {
    el.addEventListener("click", function(event) {
    
        var cont = document.createElement("div");
        cont.setAttribute("class", "smooth-shadow information-card");
        cont.setAttribute("style", `
            height: fit-content;
            width: fit-content;
            max-width: 15rem;
            background-color: var(--secondary-color);
            z-index: 101;
            padding: 0 1rem;
            font-weight: lighter;
            border-radius: 0.5rem;
            animation: fade-in 100ms ease-in-out;
        `);
        
        //background-color: #0a0d10;

        var text = document.createElement("p");
        text.style.lineHeight = "1rem";
        text.style.marginTop ="1em";
        text.style.marginBottom ="1em";
        text.innerHTML = title;
        cont.appendChild(text);


        var x = event.clientX;
        var y = event.clientY;
    
        cont.style.position = "absolute";
    
        cont.style.top = y + "px";
        cont.style.left = x + "px";
    
    setTimeout(function() {
        document.body.appendChild(cont);
    }, 100);
    
    });
}


document.addEventListener("click", function() {
    if(document.getElementsByClassName("information-card")[0]) {

        var element = document.getElementsByClassName("information-card")[0] 
        var inside = element.contains(event.target);
    }

    if(!inside) {
        if(element) {
            element.parentNode.removeChild(element);

        }
    }
    
})




function menu(type) {     
    console.log(type)  
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


//Notifications handler
function toggleNotificationsPane() {
    var pane = document.getElementById("notifications-pane");

    if(pane.style.display == "none") {
        pane.style.display = "block";
    } else {
        pane.style.display = "none";
    }
}
