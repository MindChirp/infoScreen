function infoBox(el, title) {
    el.addEventListener("click", function(event) {
    
        var cont = document.createElement("div");
        cont.setAttribute("class", "smooth-shadow information-card");
        cont.setAttribute("style", `
            height: fit-content;
            width: fit-content;
            max-width: 15rem;
            background-color: #0a0d10;
            z-index: 101;
            padding: 0 1rem;
            color: white;
            font-weight: lighter;
            border-radius: 0.5rem;
            animation: slide-in 200ms ease-in-out;
        `);

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