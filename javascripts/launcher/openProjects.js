function openProject(el) {
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
    h1.innerHTML = "Open Project";
}