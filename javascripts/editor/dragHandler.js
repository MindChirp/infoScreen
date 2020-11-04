function dragFileHandler(el) {
    var ghost = document.createElement("div");
    ghost.setAttribute("class", "file-ghost");
    document.body.appendChild(ghost);

    var src = el.childNodes[0].childNodes[0].getAttribute("src");
    var name = el.childNodes[0].childNodes[1].innerHTML;
    var type = el.getAttribute("type");

    //Save the information of the dragged element to 
    //localStorage

    localStorage.setItem("dragCache", JSON.stringify([src, name, type]));
    var img = document.createElement("img");
    img.setAttribute("src", src);

    ghost.appendChild(img);

    var p = document.createElement("p");
    p.innerHTML = name;

    ghost.appendChild(p);


    document.addEventListener("mousemove", handleMouseMove);


    //Handle when the file is let go
    document.body.addEventListener("mouseup", function(e) {
        document.removeEventListener("mousemove", handleMouseMove);
        ghost.parentNode.removeChild(ghost);

        //Get the element which the mouse has been let go over
        var el = e.target;
        if(el.getAttribute("droppable") == null) return; 
        var file = document.createElement("div");
        file.setAttribute("class", "scrubber-element");
        el.appendChild(file);

        //Get the path, name
        var fileInfo = JSON.parse(localStorage.getItem("dragCache"));
        var path = fileInfo[0]
        var img = document.createElement("img");
        img.setAttribute("src", path);
        file.appendChild(img);
        file.setAttribute("type", fileInfo[2]);
        infoOnHover(file, fileInfo[1]);
    }, {once:true});
}

function handleMouseMove(e) {

    //Position the element relative to the mouse cursor
    var [offsetX, offsetY] = [72,70]

    document.getElementsByClassName("file-ghost")[0].style.top = e.clientY-offsetY + "px";
    document.getElementsByClassName("file-ghost")[0].style.left = e.clientX-offsetX + "px";

}

function highlightColumn(el, entered) {
    if(document.getElementsByClassName("file-ghost")[0]) {
        if(entered) {
            el.style.backgroundColor = "var(--dark-shade)";
        } else if(!entered) {
            el.style.backgroundColor = "transparent";
        }
    } else {
        el.style.backgroundColor = "transparent";
    }
}