function dragFileHandler(el) {
    var ghost = document.createElement("div");
    ghost.setAttribute("class", "file-ghost");
    document.body.appendChild(ghost);

    var h1 = document.createElement("h3");
    h1.innerHTML = "THIS IS A FILE HEHE"

    ghost.appendChild(h1);


    document.addEventListener("mousemove", handleMouseMove);

    document.body.addEventListener("mouseup", function(e) {
        //The file has been let go.
        document.removeEventListener("mousemove", handleMouseMove);
    }, {once:true});
}

function handleMouseMove(e) {
    console.log(e);
    document.getElementsByClassName("file-ghost")[0].style.top = e.screenY-70 + "px";
    document.getElementsByClassName("file-ghost")[0].style.left = e.screenX-80 + "px";

}