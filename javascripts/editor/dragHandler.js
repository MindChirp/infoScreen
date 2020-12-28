function dragFileHandler(el) {
    var ghost = document.createElement("div");
    ghost.setAttribute("class", "file-ghost");
    document.body.appendChild(ghost);

    if(el.getAttribute("type") == "widget") {
        var widgetType = el.getAttribute("name");
        var type = el.getAttribute("type");
        localStorage.setItem("dragCache", JSON.stringify([widgetType, name, type]));
        var p = document.createElement("p");
        switch(widgetType) {
            case "time":
                p.innerHTML = "Time";
            break;
            case "weather":
                p.innerHTML = "Weather"
            break;
        }
        ghost.appendChild(p);
        p.setAttribute("style", `
            height: 100%;
            width: 100%;
            text-align: center;
            line-height: 5rem;
            margin: 0;
            font-weight: lighter;
        `);
    } else {
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
    }



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
        file.setAttribute("onclick", "clickScrubberElement(this)");
        file.setAttribute("hasTab", "false");
        file.setAttribute("style", "opacity: 1");
        el.appendChild(file);

        var settings = document.createElement("div");
        settings.setAttribute("class", "settings-button smooth-shadow");
        settings.setAttribute("onclick", "fileDropdownMenu(this)")

        var i = document.createElement("i");
        i.setAttribute("class", "material-icons");
        i.innerHTML = "more_vert";
        settings.appendChild(i);    
        file.appendChild(settings);
        //Get the path, name
        var fileInfo = JSON.parse(localStorage.getItem("dragCache"));
        if(fileInfo[2] == "img" || fileInfo[2] == "vid") {
            var path = fileInfo[0]
            var img = document.createElement("img");
            img.setAttribute("oncontextmenu", "contextMenu(event, this, 1)")
            img.setAttribute("src", path);
            file.path = path;
            file.appendChild(img);
            file.setAttribute("type", fileInfo[2]);
            file.setAttribute("oncontextmenu", "contextMenu(event, this, 1)")
            img.setAttribute("hasTab", "false");
            file.setAttribute("fileName", fileInfo[1]);
            infoOnHover(file, fileInfo[1]);
        } else if(fileInfo[2] == "widget") {
            var p = document.createElement("p");
            p.setAttribute("oncontextmenu", "contextMenu(event, this, 2)")
            //Only append event listener to p element because it covers all of
            //of the div
            file.appendChild(p);
            p.setAttribute("style", `
            height: 100%;
            width: 100%;
            text-align: center;
            line-height: 4rem;
            margin: 0;
            font-weight: lighter;
            `);
            p.setAttribute("hasTab", "false");

            infoOnHover(file, "Widget");
            switch(fileInfo[0]) {
                case "time":
                    p.innerHTML = "Time";
                    file.setAttribute("fileName", "Time Widget");

                break;
                case "weather":
                    p.innerHTML = "Weather";
                    file.setAttribute("fileName", "Weather Widget");

                break;
            }
        }
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
            if(document.getElementsByClassName("file-ghost")[0]) {
                el.style.backgroundColor = "initial";
            }
    }
}