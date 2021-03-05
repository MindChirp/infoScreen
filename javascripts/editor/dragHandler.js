  
  //This global variable is accessed by other files such as selectHandler.js
  //to check if a file is being dragged or not 
  var draggingState = {toTimeline: false, inTimeline: false};
  
  function dragFileHandler(el) {
    draggingState.toTimeline = true;
    var ghost = document.createElement("div");
    ghost.setAttribute("class", "file-ghost");
    document.body.appendChild(ghost);
    if(el.getAttribute("type") == "widget") {
        var widgetType = el.getAttribute("name");
        console.log(widgetType);
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
            case "script":
                p.innerHTML = "Script";
            break;
            case "progress":
                p.innerHTML = "Progress";
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

        switch(type) {
            case "vid":
                var vid = document.createElement("video");
                vid.setAttribute("width", "auto");
                vid.setAttribute("height", "100%");
                vid.setAttribute("src", src);

                var src = document.createElement("source");
                src.setAttribute("src", src);
                src.setAttribute("type", "video/mp4");
                vid.appendChild(src);
                ghost.appendChild(vid);
            break;
            case "img":
                var img = document.createElement("img");
                img.setAttribute("src", src);
                ghost.appendChild(img);
                break;
            }
        var p = document.createElement("p");
        p.innerHTML = name;
        ghost.appendChild(p);
    }


    document.addEventListener("mousemove", handleMouseMove);


    //Handle when the file is let go
    document.body.addEventListener("mouseup", function(e) {
        draggingState.toTimeline = false;
        document.removeEventListener("mousemove", handleMouseMove);
        ghost.parentNode.removeChild(ghost);

        //Get the element which the mouse has been let go over
        var el = e.target;
        if(!el.closest(".container") && !el.closest(".timeline-column")) return;
        if(!el.closest(".timeline-column") && el.closest(".container").getAttribute("name") != "viewport-content") return;

        //Remove the column highlight
        var col;
        var onViewport = false;
        if(el.closest(".timeline-column")) {
            var col = el.closest(".timeline-column");
            if(col != undefined && col.getAttribute("displaying") != "true") {
                col.style.backgroundColor = "transparent";
            }
            if(col.getAttribute("displaying") == "true") {
                col.style.backgroundColor = "#23313D";
            }
        } else if(el.closest(".container").getAttribute("name") == "viewport-content") {
            if(el.closest(".container").getAttribute("droppable") == null) return 

                if(el.closest(".container").getAttribute("name") == "viewport-content") {
                    //element has been dragged to the viewport
                    onViewport = true;
                }
        }
        


        var file = document.createElement("div");
        file.setAttribute("class", "scrubber-element");
        file.setAttribute("onclick", "clickScrubberElement(this)");
        file.setAttribute("hasTab", "true");
        file.setAttribute("style", "opacity: 1");
        file.setAttribute("onmousedown", "dragFileInTimeline(this)");

        if(!onViewport) {
            //If the file is dropped in the timeline, append the file there
            el.appendChild(file);
        } else {
            //If the file is dropped in the viewport, append the file to the timeline
            //Get an appropriate column
            var column = document.getElementsByClassName("timeline-column");
            var index = renderer.renderedColumn()
            
            //Get the appropriate row (the first empty)
            var rows = column[index].getElementsByClassName("timeline-row");
            var x;
            var foundRow = false;
            for(x of rows) {
                if(foundRow == false) {
                    if(!x.hasChildNodes()) {
                        x.appendChild(file);                        
                        foundRow = true;
                    }
                }
            }
            if(!foundRow) {
                //No empty rows found. Don't do anything, i guess..
                
            }
        }


        var template = 
        {
            borderRadius: "0.25", 
            opacity: "1", 
            shadowMultiplier: 0, 
            blur: 0, 
            position: [10 + "px",10 + "px"], 
            edgeAnchors: {x: "left", y: "top"},
            size: {height: "30%", width: "200px"}, 
            display: true, 
            backgroundColor: "#ffffff",
            backgroundOpacity: "FF",
            textColor: "#000000", 
            fontSize: 4, 
            fontFamily: "Bahnschrift", 
            identification: null,
            slideNumber: null,
            widgetAttributes: 
            {
                time: 
                    {
                        showHours: true, 
                        showMinutes: true, 
                        showSeconds: true, 
                        showDate: false, 
                        timeFormat: "1"
                    },
                script: 
                    {
                        hasScript: false,
                        scriptContents: "",
                        htmlContents: "",
                        styleContents: ""
                    }
            }, 
            sizeType: 0,
            keepAspectRatio: true
        };










        /*
        var path = require("path");
        var { fileDataTemplate } = require(path.resolve( __dirname, "./javascripts/editor/definitions.js"));
        
        var template = fileDataTemplate.template;
        */

        file.config = template; //As defined in definitions.js @ 1 <-- NO! It's defined above

        // FIGURE OUT A WAY TO USE MODULE IMPORTS TO GET A NEW TEMPLATE
        // WITHOUT INTERTWINING THE TEMPLATE VALUES FOR ALL ELEMENTS

        

        /*var settings = document.createElement("div");
        settings.setAttribute("class", "settings-button smooth-shadow");
        settings.setAttribute("onclick", "fileDropdownMenu(this)");

        var i = document.createElement("i");
        i.setAttribute("class", "material-icons");
        i.innerHTML = "more_vert";
        settings.appendChild(i);    
        file.appendChild(settings);*/
        //^^ this was an unnescessary menu appended to every timeline element.


        //Get the path, name
        var fileInfo = JSON.parse(localStorage.getItem("dragCache"));
        if(fileInfo[2] == "img") {
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
            img.setAttribute("hasTab", "true");
            file.setAttribute("fileName", fileInfo[1]);
            infoOnHover(file, fileInfo[1]);
        } else if(fileInfo[2] == "vid") {
            file.config = [{borderRadius: borderRadius, opacity: opacity, shadowMultiplier: shadowMultiplier, blur: blur, position: [10,10], size: {height: "30%", width: "50%"}, display: true, backgroundColor: "#ffffff", textColor: "#000000", fontSize: 4, fontFamily: "Bahnschrift", widgetAttributes: {time: {showHours: true, showMinutes: true, showSeconds: true, showDate: false, timeFormat: "1"}}}];
            var path = fileInfo[0];

            var vid = document.createElement("video");
            vid.setAttribute("width", "auto");
            vid.setAttribute("height", "100%");
            vid.setAttribute("src", path);

            var src = document.createElement("source");
            src.setAttribute("src", path);
            src.setAttribute("type", "video/mp4");
            vid.appendChild(src);
            
            file.path = path;
            file.appendChild(vid);
            file.setAttribute("type", fileInfo[2]);
            file.setAttribute("oncontextmenu", "contextMenu(event, this, 1)");
            vid.setAttribute("hasTab", "true");
            file.setAttribute("fileName", fileInfo[1]);
            infoOnHover(file, fileInfo[1]);
        } else if(fileInfo[2] == "widget") {

            //Set a widget width other than "auto"
            file.config.size.width = "50%"; 

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
            p.setAttribute("hasTab", "true");
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
                case "script":
                    p.innerHTML = "Script";
                    file.setAttribute("fileName", "Script Widget");
                break;
                case "progress": 
                    p.innerHTML = "Progress";
                    file.setAttribute("fileName", "Progress Widget");
                break;
            }
        }
        openPropertiesTab(file);

    }, {once:true});
}

function handleMouseMove(e) {

    //Position the element relative to the mouse cursor
    var [offsetX, offsetY] = [72,70]
    document.getElementsByClassName("file-ghost")[0].style.top = e.clientY-offsetY + "px";
    document.getElementsByClassName("file-ghost")[0].style.left = e.clientX-offsetX + "px";

}


function dragFileInTimeline(el) {
    draggingState.inTimeline = true;
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
                case "script":
                    p.innerHTML = "Script";
                break;
                case "progress":
                    p.innerHTML = "Progress";
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
        draggingState.inTimeline = false;

        document.body.removeEventListener("mouseup", mouseUpHandler);
        document.body.removeEventListener("mousemove", handleMouseMove)
        if(document.getElementsByClassName("timeline-file-ghost")[0]) {

            
            //Remove any dragging ghosts, if there is any (Should at most be only one)
            var ghosts = document.getElementsByClassName("timeline-file-ghost");
            var x;
            for(x of ghosts) {
                if(globalKeyPresses.shiftKey && !globalKeyPresses.altKey && !globalKeyPresses.ctrlKey) {
            
                } else {
                    if(e.target.closest(".timeline-row") && !e.target.closest(".timeline-row").hasChildNodes()) {
                        //Need to check for empty slot before deleting old file
                        x.connectedElement.parentNode.removeChild(x.connectedElement);
                    }
                }
                x.parentNode.removeChild(x);
            }

            //Important to add files AFTER deleting the old file (see above)
            injectFile(e);

        }


        

    }

    //Handle the event where the file dragging has ended (the mouse has been let go)

    var handleMouseMove = function(e) {
        //var ghost
        var x = e.clientX;
        var y = e.clientY;
        //ghost.classList.add("smooth-shadow");
        ghost.style.transform = "translate(-50%, -50%)";
        ghost.style.left = x + "px";
        ghost.style.top = y + "px";

        if(globalKeyPresses.shiftKey && !globalKeyPresses.altKey && !globalKeyPresses.ctrlKey) {
            //Trigger the fill shortcut
            var target = e.target.closest(".timeline-row");
            if(!target.hasChildNodes()) {
                injectFile(e);
            }
        }
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

            //Get the column number
            var m;
            var cols = document.getElementsByClassName("timeline-column");
            for(let i = 0; i < cols.length; i++) {
                if(m == e.target.closest(".timeline-column")) {
                    newFile.config.slideNumber = i;
                    console.log(i);
                }
            }

            /////////////////////////////////////////////////////////////////////////////////
            //                                                                             //
            //   THIS IS A SERIOUSLY BAD PRACTICE and should be fixed as soon as possible  //
            //      I just want it to work right now..                                     //
            //                                                                             //
            // GOOD FIX:                                                                   //
            // --> Remove the role of the p element as a tab manager element               //
            /////////////////////////////////////////////////////////////////////////////////


            
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
