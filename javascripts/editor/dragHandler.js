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
                p.innerHTML = "Weather";
            break;
            case "news":
                p.innerHTML = "News";
            break;
            case "text":
                p.innerHTML = "Text";
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

        //Remove the column highlight
        var col = el.closest(".timeline-column");
        if(col != undefined && col.getAttribute("displaying") != "true") {
            col.style.backgroundColor = "transparent";
        }
        if(col.getAttribute("displaying") == "true") {
            col.style.backgroundColor = "#23313D";
        }

        if(el.getAttribute("droppable") == null) return; 
        var file = document.createElement("div");
        file.setAttribute("class", "scrubber-element");
        file.setAttribute("onclick", "clickScrubberElement(this)");
        file.setAttribute("hasTab", "false");
        file.setAttribute("style", "opacity: 1");
        file.setAttribute("onmousedown", "dragFileInTimeline(this)");
        el.appendChild(file);
        
        //Define the default settings for the timeline element
        //This will be used later to load in the tab 
        var borderRadius = "0.25";
        var opacity = "1";
        var shadowMultiplier = 0;
        var blur = 0;
        file.config = [{borderRadius: borderRadius, opacity: opacity, shadowMultiplier: shadowMultiplier, blur: blur, position: [10,10], size: {height: "30%", width: "auto"}, display: true, backgroundColor: "#ffffff", textColor: "#000000", fontSize: 4, fontFamily: "Bahnschrift", widgetAttributes: {time: {showHours: true, showMinutes: true, showSeconds: true, showDate: false, timeFormat: "1"}}}];
        /*var settings = document.createElement("div");
        settings.setAttribute("class", "settings-button smooth-shadow");
        settings.setAttribute("onclick", "fileDropdownMenu(this)");

        var i = document.createElement("i");
        i.setAttribute("class", "material-icons");
        i.innerHTML = "more_vert";
        settings.appendChild(i);    
        file.appendChild(settings);*/
        //Get the path, name
        var fileInfo = JSON.parse(localStorage.getItem("dragCache"));
        if(fileInfo[2] == "img" || fileInfo[2] == "vid") {
            var path = fileInfo[0];
            var img = document.createElement("img");
            img.setAttribute("oncontextmenu", "contextMenu(event, this, 1)")
            img.setAttribute("src", path);
            //Prevent the user from dragging the image element itself
            //img.setAttribute("ondragstart", "preventDefault")
            img.addEventListener("dragstart", (e) => {e.preventDefault()})
            file.path = path;
            file.appendChild(img);
            file.setAttribute("type", fileInfo[2]);
            file.setAttribute("oncontextmenu", "contextMenu(event, this, 1)")
            img.setAttribute("hasTab", "false");
            file.setAttribute("fileName", fileInfo[1]);
            infoOnHover(file, fileInfo[1]);
        } else if(fileInfo[2] == "widget") {

            //Set a widget width other than "auto"
            file.config[0].size.width = "50%"; 

            var p = document.createElement("p");
            p.setAttribute("oncontextmenu", "contextMenu(event, this, 2)")
            //Only append event listener to p element because it covers all of
            //of the div
            file.setAttribute("type", fileInfo[2]);
            file.setAttribute("meta", fileInfo[0])
            p.setAttribute("style", `
                height: 100%;
                width: 100%;
                text-align: center;
                line-height: 4rem;
                margin: 0;
                font-weight: lighter;
            `);
            p.setAttribute("hasTab", "false");
            file.appendChild(p);
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
                case "news":
                    p.innerHTML = "News";
                    file.setAttribute("fileName", "News Widget");
                break;
                case "text":
                    p.innerHTML = "Text";
                    file.setAttribute("fileName", "Text Widget");
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


function dragFileInTimeline(el) {
    var dragStatus = {hasDragged: false};
    var ghost;

    var initDragging = function(e) {
        document.body.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseup", mouseUpHandler);
        dragStatus.hasDragged = true;
        document.body.removeEventListener("mousemove", initDragging);

        //Create the file ghost
        createGhost();
    }

    var checkIfDragging = function() {
        if(!dragStatus.hasDragged) {

            //Disable the dragging scripts
            document.body.removeEventListener("mousemove", initDragging);
            document.body.removeEventListener("mouseup", checkIfDragging);
        }
    }
    document.body.addEventListener("mousemove", initDragging);
    document.body.addEventListener("mouseup", checkIfDragging);


    var createGhost = function() {
        ghost = document.createElement("div");
        ghost.connectedElement = el;
        ghost.className = "timeline-file-ghost";
    
        document.body.appendChild(ghost);
        var type = el.getAttribute("meta");
        var meta = el.getAttribute("type");
        var name = el.getAttribute("fileName")
        localStorage.setItem("dragCache", JSON.stringify([type, meta, name]));
        //Get the type of timeline element
    
        if(el.getAttribute("type") == "widget") {
            var p = document.createElement("p");
            
            switch(type) {
                case "time":
                    p.innerHTML = "Time";
                break;
                case "weather":
                    p.innerHTML = "Weather";
                break;
                case "news":
                    p.innerHTML = "News";
                break;
                case "text":
                    p.innerHTML = "Text";
                break;
            }
    
            p.style = `
                height: 4rem;
                width: 6rem;
                text-align: center;
                line-height: 4rem;
                margin: 0;
                font-weight: lighter;
            `;
    
            ghost.appendChild(p);
        } else if(el.getAttribute("type") == "img") {
            var img = document.createElement("img");

            var fileInfo = localStorage.getItem("dragCache");
            var src = el.getElementsByTagName("img")[0].getAttribute("src");
            img.src = src;

            ghost.appendChild(img);

            img.style = `
                height: 4rem;
                width: auto;
                position: absolute;
                left: 50%;
                transform: translate(-50%);
            `
        }
    }



    //Check if the mouse has been let go
    var mouseUpHandler = function(e) {
        document.body.removeEventListener("mouseup", mouseUpHandler);
        document.body.removeEventListener("mousemove", handleMouseMove)
        if(document.getElementsByClassName("timeline-file-ghost")[0]) {

            injectFile(e);
            
            //Remove any dragging ghosts, if there is any (Should at most be only one)
            var ghosts = document.getElementsByClassName("timeline-file-ghost");
            var x;
            for(x of ghosts) {
                x.parentNode.removeChild(x);
            }

        }


        

    }

    //Handle the event where the file dragging has ended (the mouse has been let go)

    var handleMouseMove = function(e) {
        //var ghost
        var x = e.clientX;
        var y = e.clientY;
        ghost.classList.add("smooth-shadow");
        ghost.style.transform = "translate(-50%, -50%)";
        ghost.style.left = x + "px";
        ghost.style.top = y + "px";

    }




    var injectFile = function(e) {
        var timelineFile = ghost.connectedElement;
        if(e.target.closest(".scrubber-element") == timelineFile) return;




        //Get name info from the old timeline file
        //e.target is the timeline element that the mouse has been let go over
        if(e.target.closest(".timeline-row") && !e.target.closest(".timeline-row").hasChildNodes()) {

            
            //Check if the element to be removed is rendered, and if so, unrender it
            if(renderer.isRendered(timelineFile)) {
                renderer.unrender(timelineFile);
            }   
            removeTab(timelineFile);
            //Set the hasTab attribute to false on the p element of the .scrubber-element
            if(timelineFile.getElementsByTagName("p")[0]) {
                timelineFile.getElementsByTagName("p")[0].setAttribute("hasTab", "false");
            }

            var newFile = timelineFile.cloneNode(true);
            
            //Apend the cloned node to the timeline
            e.target.appendChild(newFile);
            /////////////////////////////////////////////////////////////////////////////////
            //                                                                             //
            //   THIS IS A SERIOUSLY BAD PRACTICE and should be fixed as soon as possible  //
            //      I just want it to work right now..                                     //
            //                                                                             //
            // GOOD FIX:                                                                   //
            // --> Remove the role of the p element as a tab manager element               //
            /////////////////////////////////////////////////////////////////////////////////


            timelineFile.parentNode.removeChild(timelineFile);
            
            //If there is an image, disable its default dragging properties
            if(newFile.getElementsByTagName("img")[0]) {
                newFile.getElementsByTagName("img")[0].addEventListener("dragstart", (e) => {e.preventDefault()});
            }
            
            //Add all old event listeners
            var fileName = newFile.getAttribute("fileName");
            infoOnHover(newFile, fileName);
            
            //Add config from previous element
            var tConfig = timelineFile.config;
            newFile.config = tConfig;

        }

    }


}
