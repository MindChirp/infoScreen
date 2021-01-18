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
    `
}