function infoOnHover(el, txt) {
    el.addEventListener("mouseenter", function(event) {
    var mouseover = true;

    el.addEventListener ("mouseleave", function(event1) {
        mouseover = false;
        if(document.getElementsByClassName("information-popup")) {
            var popups = document.getElementsByClassName("information-popup");

            for(let i = 0; i < popups.length; i++) {
                popups[i].parentNode.removeChild(popups[i]);
            }
        }
    })

    setTimeout(function() {
        if(mouseover == true) {
            //The mouse has hovered over the element for long enough
            var info = document.createElement("div");
            info.setAttribute("class", "information-popup smooth-shadow");
            info.innerHTML = txt;
            var element = event.target;
            var triggerElementWidth = element.offsetWidth;
            var x = element.getBoundingClientRect().left;
            var y = element.getBoundingClientRect().top;

            info.setAttribute("style", `
                height: fit-content; 
                width: fit-content;
                background-color: #0a0d10;
                border-radius: 0.5rem;
                padding: 1rem;
                color: white;
                position: absolute;
                z-index: 110;
                left: ` + Math.round(x + triggerElementWidth/2) + `px;
                top: ` + y + `px;
                transform: translateX(-50%) translateY(-110%);
                animation: fade-in 200ms ease-in-out;
                opacity: 0.95;
            `);
            document.body.appendChild(info);
            
            var elWidth = info.offsetWidth;
            if(x-elWidth/2 < 0 || x+elWidth/2 > window.innerWidth) {
                if(x-elWidth/2 < 0) {
                    var offset = x-elWidth/2
                    info.style.left = 10 + elWidth/2 + "px";
                } else if(x+elWidth/2 > window.innerWidth) {
                    var offset = x+elWidth/2 - window.innerWidth;
                    info.style.right = "0"

                }
            }

        }
    }, 200)
})
}