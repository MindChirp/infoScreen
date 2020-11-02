function dragFileHandler(el) {
    var ghost = document.createElement("div");
    ghost.setAttribute("class", "file-ghost");
    document.body.appendChild(ghost);

    var src = el.childNodes[0].childNodes[0].getAttribute("src");
    var name = el.childNodes[0].childNodes[1].innerHTML;

    var img = document.createElement("img");
    img.setAttribute("src", src);

    ghost.appendChild(img);

    var p = document.createElement("p");
    p.innerHTML = name;

    ghost.appendChild(p);


    document.addEventListener("mousemove", handleMouseMove);

    document.body.addEventListener("mouseup", function(e) {
        //The file has been let go.
        document.removeEventListener("mousemove", handleMouseMove);
        ghost.parentNode.removeChild(ghost);
    }, {once:true});
}

function handleMouseMove(e) {
    console.log(e);

    //Position the element relative to the mouse cursor
    var [offsetX, offsetY] = [72,70]
    
    document.getElementsByClassName("file-ghost")[0].style.top = e.screenY-offsetY + "px";
    document.getElementsByClassName("file-ghost")[0].style.left = e.screenX-offsetX + "px";

}