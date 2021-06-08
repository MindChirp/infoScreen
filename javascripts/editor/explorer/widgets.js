//Widgets

function createWidgetInExplorer(type) {
    var el = document.createElement("div");
    el.className = "explorer-widget smooth-shadow";
    el.setAttribute("onmousedown", "dragFileHandler(this)");
    el.setAttribute("type", "widget");
    el.setAttribute("name", type);

    var h1 = document.createElement("h1");
    h1.setAttribute("style", `
        height: 100%;
        width: 100%;
        margin: 0;
        text-align: center;
        line-height: 6rem;
        font-weight: lighter;
        color: var(--title-color);
        text-transform: capitalize;
        /*animation: fade-in 300ms ease-in-out 0.5s;
        animation-fill-mode: backwards;*/
    `);
    h1.innerHTML = type;
    el.appendChild(h1);

    function sleep(int) {
        return new Promise(resolve=>{
            setTimeout(()=>{
                resolve();
            }, int)
        })
    }

    var addMenu = async(e)=>{
        if(e.target.closest(".explorer-widget").querySelector(".menu-overlay")) {
            return;
        }

        var name = e.target.closest(".explorer-widget").getAttribute("name");

        await sleep(10);
        var over = document.createElement("div");
        over.className = "menu-overlay"
        el.appendChild(over);

        var move = document.createElement("button");
        var ico = document.createElement("i");
        ico.innerHTML = "content_copy";
        ico.className = "material-icons";
        move.appendChild(ico);
        over.appendChild(move);


        move.addEventListener("click", (e)=>{
            //copy element to the timeline
            var els = document.getElementsByClassName("timeline-row selected");
            
            if(els.length == 0) {
                explorerMsg("No selected cell");
                return;
            }

            var template = {
                borderRadius: "0.25", 
                opacity: "1", 
                shadowMultiplier: 0, 
                blur: 0, 
                position: [1 + "%", 1 + "%"], 
                edgeAnchors: {x: "left", y: "top"},
                size: {height: "30%", width: "keepAspectRatio"}, 
                display: true, 
                backgroundColor: "#ffffff",
                backgroundOpacity: "FF",
                textColor: "#000000", 
                fontSize: 20, 
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
                        },
                    text: {
                        align: "center"
                    },
                    progress: {
                        scale: 1
                    },
                }, 
                sizeType: 0,
                keepAspectRatio: false
            };

            template.size.width = "30%";


            var filename;
            switch(name) {
                case "time":
                    filename = "Time Widget";
                break;
                case "weather":
                    filename = "Weather Widget";
                break;
                case "news":
                    filename = "News Widget";
                break;
                case "text":
                    filename = "Text Widget";
                break;
                case "script":
                    filename = "Script Widget";
                break;
                case "progress":
                    filename = "Progress Widget";
                break;
            }

            var x;
            for(x of els) {
                injectContentToTimeline(template, "widget", name, filename, false, x);
            }
        })

    }

    el.addEventListener("click",addMenu);

    return el;
}

var widgets = ["time", "weather", "news", "text", "script", "progress"];


//Creates all the widgets in the browser
function loadWidgets() {
    var cont = document.getElementById("widgets");
    var x;
    for(x of widgets) {
        var el = createWidgetInExplorer(x);
        cont.appendChild(el);
    }
}

function updateClockWidgets() {
    //Update widgets in explorer
    //Firstly check if the widgets tab is opened (to save resources)
    var cont = document.getElementById("widgets");
    if(cont.style.display != "none") {
        var time = document.getElementsByName("time")[0].childNodes[0];
        var date = new Date();
        hours = (date.getHours() > 9) ? date.getHours() : "0" + date.getHours();
        minutes = (date.getMinutes() > 9) ? date.getMinutes() : "0" + date.getMinutes();
        seconds = (date.getSeconds() > 9) ? date.getSeconds() : "0" + date.getSeconds();
        time.innerHTML = hours + ":" + minutes + ":" + seconds;
    }
}