
const updateEditPage = function() {
    //Disable script is the pane isnt rendered
    if(document.getElementById("edit").style.display == "none") return;

    //All of the information about the slide is stored in the column element.
    //Load all the data from the attribute tags, and display it in the edit page
    var cont = document.getElementById("edit");
    cont.innerHTML = "";
    //Get the active column
    var i = renderer.renderedColumn();

    var cols = document.getElementsByClassName("timeline-column");
    var slide = cols[i];

    var time = slide.getAttribute("time");
    
    var tIn = tabInputs.input("Time", "text", "mm/ss");
    cont.appendChild(tIn);
    tIn.childNodes[1].value = time;
    tIn.addEventListener("change", (e) => {
        slide.setAttribute("time", e.target.value);
    });
    tIn.style = `
        position: block;
    `

    var timeBased = tabInputs.checkBox("Use custom viewing routines", "width: fit-content; margin-top: 1rem;");
    cont.appendChild(timeBased);
    timeBased.childNodes[0].childNodes[1].checked = slide.config.customViewingTimes.enabled;

    timeBased.childNodes[0].childNodes[1].addEventListener("change", (e) => {
        var value = e.target.checked;
        slide.config.customViewingTimes.enabled = value;
    });
    
    timeBased.childNodes[0].style.display = "inline-block";

    timeBased.childNodes[0].childNodes[1].disabled = true;

    var info = createInfoCircle(`
        Display this slide at certain times of day. 
        The slide will not be included in the normal play routine, 
        and will exclusively be displayed at the given times.
        (WIP)
    `);
    info.style.display = "inline-block";
    timeBased.appendChild(info);

    var placeholder = document.createElement("div");
    placeholder.style = `
        height: 4rem;
        width: 20rem;
        background-color: var(--main-bg-color);
        border-radius: 0.25rem;
    `;
    cont.appendChild(placeholder)
    var p = document.createElement("p");
    p.innerHTML = "Date and time picking placeholder";
    placeholder.appendChild(p);
    p.style = `
        line-height: 4rem;
        width: 100%;
        text-align: center;
        font-weight: lighter;
    `;

    var p = document.createElement("h2");
    p.innerHTML = "Transitions";
    p.style = h2Style;
    cont.appendChild(p);

    var wr = document.createElement("div");
    wr.style = wrapperStyle;
    wr.className = "transition-cards-container";
    cont.appendChild(wr);
    
    var none = createCard("None");
    none.classList.add("selected");
    wr.appendChild(none);
    var ico = document.createElement("i");
    ico.className = "material-icons";
    ico.innerHTML = "close";
    none.querySelector(".icon").appendChild(ico)
    ico.style = icoStyle;

    var fade = createCard("Fade in");
    wr.appendChild(fade);
    var ico = document.createElement("i");
    ico.className = "material-icons";
    ico.innerHTML = "help_outline";
    fade.querySelector(".icon").appendChild(ico)
    ico.style = icoStyle;

    var swipe = createCard("Swipe");
    wr.appendChild(swipe);
    var ico = document.createElement("i");
    ico.className = "material-icons";
    ico.innerHTML = "arrow_right_alt";
    swipe.querySelector(".icon").appendChild(ico)
    ico.style = icoStyle;

    var circle = createCard("Circle");
    wr.appendChild(circle);
    var ico = document.createElement("i");
    ico.className = "material-icons";
    ico.innerHTML = "stop_circle";
    circle.querySelector(".icon").appendChild(ico)
    ico.style = icoStyle;

    var rotate3d = createCard("3D Rotate");
    wr.appendChild(rotate3d);
    rotate3d.classList.add("disabled");
    var ico = document.createElement("i");
    ico.className = "material-icons";
    ico.innerHTML = "3d_rotation";
    rotate3d.querySelector(".icon").appendChild(ico)
    ico.style = icoStyle;
}

var h2Style = `
    color: white;
    font-weight: lighter;
    margin: 1rem 0 0.2rem;
`;

var wrapperStyle = `
    height: fit-content;
    width: fit-content;
    display: block;
`

var icoStyle = `
    line-height: 5.5rem;
    width: 100%;
    text-align: center;
    font-size: 2rem;
    opacity: 0.4;
    font-weight: lighter;
`


function createCard(title) {
    var icoContStyle = `
        height: 5.5rem;
        width: 100%;
        display: block;
    `

    var pStyle = `
        margin: 0;
        color: var(--paragraph-color);
    `
    var el = document.createElement("div");
    el.className = "smooth-shadow transition-card";

    var icoCont = document.createElement("div");
    icoCont.style = icoContStyle;
    icoCont.className = "icon";
    el.appendChild(icoCont);

    var p = document.createElement("p");
    p.innerHTML = title;
    p.style = pStyle;
    el.appendChild(p);

    //Handle card clicks
    el.addEventListener("click", (e) => {
        var parent = e.target.closest(".transition-cards-container");
        var x;
        for(x of parent.childNodes) {
            x.classList.remove("selected");
        }
        e.target.closest(".transition-card").classList.add("selected");

    })


    return el;
}