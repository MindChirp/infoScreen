function liveEdit() {
    var cont = menu("user");

    var h1 = h1El();
    h1.setAttribute("style", `
        height: 10rem;
        line-height: 10rem;
        font-size: 3.5rem;
        margin: 0;
        margin-left: 3rem;
        color: var(--title-color);
    `)
    cont.childNodes[0].appendChild(h1);
    h1.innerHTML = "Live Edit";
    
    var wrapper = document.createElement("div");
    wrapper.setAttribute("id", "settings-wrapper");
    cont.appendChild(wrapper);

    var p = document.createElement("p");
    p.innerHTML = "Select a live slideshow to edit";
    p.style.color = "var(--paragraph-color)";
    wrapper.appendChild(p);

    var carousel = document.createElement("div");
    carousel.setAttribute("style", `
        height: 9rem;
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        scroll-snap-type: inline;
        scroll-padding: 0.5rem;
    `);
    wrapper.appendChild(carousel);

    for(let i = 0; i < 9; i++) {
        var el = document.createElement("div");
        el.setAttribute("class", "template-card no-shadow smooth-shadow disabled");
        el.style.margin = "0 0.5rem 0";
        el.style.height = "7rem";
        el.style.width = "14rem";
        el.style.scrollSnapAlign = "start";
        carousel.appendChild(el);
    }

}