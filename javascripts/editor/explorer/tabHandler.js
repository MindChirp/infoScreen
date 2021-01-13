
//var path = require("path");
const tabInputs = new TabSystem();

function createTab(el, name) {
    if(document.getElementsByClassName("browser-tab-container")[0].querySelector("#empty")) {
        document.getElementsByClassName("browser-tab-container")[0].innerHTML = "";
    }

    var tab = document.createElement("button");
    tab.setAttribute("class", "tab smooth-shadow");
    tab.connectedElement = el.closest(".scrubber-element");
    tab.selected = false;
    tab.addEventListener("click", function(e) {
        openTab(e.target);
    });

    tab.addEventListener("mousedown", function(e) {
        e.preventDefault();
        if(e.button == 1) {
            removeTab(e.target.closest(".tab").connectedElement);
        }
    })


    //tab.setAttribute("connectedElement", el);
    var txt = document.createElement("p");
    txt.innerHTML = name;

    tab.appendChild(txt);
    
    var cross = document.createElement("div");
    cross.setAttribute("class", "cross");
    tab.appendChild(cross);

    var ico = document.createElement("i");
    ico.setAttribute("class", "material-icons");
    ico.innerHTML = "cancel";

    cross.appendChild(ico);
    cross.addEventListener("click", function(e) {
        removeTab(e.target.closest(".tab").connectedElement);
    });

    infoOnHover(cross, "Close tab");

    document.getElementsByClassName("browser-tab-container")[0].appendChild(tab);
    openTab(tab);
    return tab;
}

function removeTab(el) {
    console.log(el)
    var tabs = document.getElementsByClassName("tab");
    var x;
    for(x of tabs) {
        if(el == x.connectedElement) {

            if(x.selected) {
                var pane = document.getElementsByClassName("properties-pane")[0];
                pane.parentNode.removeChild(pane);
            }
            
            el.setAttribute("hasTab", "false")    

            /////////////////////////////////////////////////////////////////////////////////
            //                                                                             //
            //   THIS IS A SERIOUSLY BAD PRACTICE and should be fixed as soon as possible  //
            //      I just want it to work right now..                                     //
            //                                                                             //
            // GOOD FIX:                                                                   //
            // --> Remove the role of the p element as a tab manager element               //
            /////////////////////////////////////////////////////////////////////////////////
            if(el.getAttribute("type") == "widget") {
                el.childNodes[0].setAttribute("hasTab", "false")
            }

            
            x.parentNode.removeChild(x);
            
        }
    }
    var container = document.getElementsByClassName("browser-tab-container")[0];
    if(container.innerHTML.length == 0) {
        var p = document.createElement("p");
        p.setAttribute("id", "empty");
        p.innerHTML = "Click on an element's properties to create a tab";
        container.appendChild(p);
    }

}

function openPropertiesTab(el) {
    el.setAttribute("hasTab", "true");
    
    var fileName = el.closest(".scrubber-element").getAttribute("fileName");
    var tab = createTab(el, fileName);

}

function openTab(el) {
    //Deselect tab if a tab is clicked, and it turns out it is already selected
    if(el.closest(".tab").selected) {
        var pane = document.getElementsByClassName("properties-pane")[0];
        pane.parentNode.removeChild(pane);
        el.closest(".tab").selected = false;
        el.closest(".tab").style.backgroundColor = "var(--secondary-color)";
        return;
    }

    //Cancel if the cross button is clicked **Might not be needed, I'll check on that later
    if(el.closest(".cross")) return;

    //Deselect all active tabs before selecting a new one
    var tabs = document.getElementsByClassName("tab");
    var x;
    for(x of tabs) {
        if(x.selected) {
            x.style.backgroundColor = "var(--secondary-color)";
            x.selected = false;
        }
    }

    var tab = el.closest(".tab");
    tab.style.backgroundColor = "var(--main-button-color)";
    tab.selected = true;


    //Create the pane if there is none
    var els;
    if(!document.getElementsByClassName("properties-pane")[0]) {
        els = document.createElement("div");
        els.setAttribute("class", "properties-pane smooth-shadow");
        document.getElementsByClassName("browser-container")[0].appendChild(els);
        
    }

    if(document.getElementsByClassName("properties-pane")[0]) {
        els = document.getElementsByClassName("properties-pane")[0];
    }

    //Load the contents
    
    //Get the timeline element
    var timelineEl = el.closest(".tab").connectedElement.closest(".scrubber-element");
    //Clear contents of the properties pane
    els.innerHTML = "";

    var cont = document.createElement("div");
    cont.setAttribute("class", "container");
    els.appendChild(cont);
    

    var elPath = timelineEl.getAttribute("fileName");
    var h1 = document.createElement("h1");
    h1.setAttribute("class", "title");
    h1.innerHTML = elPath;
    cont.appendChild(h1);

    //Create right side wrapper for the tab
    var wrapper = document.createElement("div");
    cont.appendChild(wrapper);
    wrapper.className = "right"



    //Create keyframe timeline (or not?)
    /*var timeline = document.createElement("div");
    timeline.className = "timeline";*/


    //Create a file preview
    var preview = document.createElement("div");
    preview.className = "preview-window";

    wrapper.appendChild(preview);
    //wrapper.appendChild(timeline)

    var dirName; 
    if(isPackaged) {
        dirName = path.join(path.dirname(__dirname), "extraResources", "data", "files");
    } else {
        dirName = path.join(__dirname, "extraResources", "data", "files");
    }
    var previewElement = document.createElement("div");
    var type = timelineEl.getAttribute("type");
    var media;

    var customisation = function(config) {
        var el = document.createElement("div");
        el.style = `
            height: fit-content;
            width: 100%;
            padding-left: 0.5rem;
        `;

        var wr = document.createElement("div");
        wr.style = `
            display: inline-block;
            vertical-align: top;
        `;
        var col = document.createElement("input");
        col.type = "color";
        col.style = `
            border: none;
            background-color: transparent;
            padding: 0;
            cursor: pointer;
        `;
        var value = config.backgroundColor;
        col.value = value;
        
        col.onchange = function(e) {
            timelineEl.config[0].backgroundColor = e.target.value; 
            refreshViewport(true);
        }

        var p = document.createElement("p");
        p.innerHTML = "Background Color";
        p.style = "margin: 0; font-weight: lighter;";
        wr.appendChild(p);
        wr.appendChild(col);
        el.appendChild(wr);


        var wr = document.createElement("div");
        wr.style = `
            display: inline-block;
            margin: 0 0.5rem;
            vertical-align: top;
        `;
        var txtCol = document.createElement("input");
        txtCol.type = "color";
        txtCol.style = `
            border: none;
            background-color: transparent;
            padding: 0;
            cursor: pointer;
        `;
        var value = config.textColor;
        txtCol.value = value;

        txtCol.onchange = function(e) {
            timelineEl.config[0].textColor = e.target.value; 
            refreshViewport(true);
        }

        var p = document.createElement("p");
        p.innerHTML = "Text Color";
        p.style = "margin: 0; font-weight: lighter;";

        wr.appendChild(p);
        wr.appendChild(txtCol);
        el.appendChild(wr);

        var fontSize = tabInputs.input("Font Size", "number", "vh");
        fontSize.style.display = "block";
        fontSize.style.float = "";
        fontSize.childNodes[1].value = config.fontSize;
        fontSize.childNodes[1].placeholder = "0"; 
        fontSize.onchange = function(e) {
            timelineEl.config[0].fontSize = e.target.value; 
            refreshViewport(true);
        }

        el.appendChild(fontSize);


        return el;
    }




    var refreshViewport = function(refreshPreview) {
        if(renderer.isRendered(timelineEl)) {
            var colNo = renderer.renderedColumn();
            renderColumn(colNo);
        }

        if(refreshPreview) {
            var widget = createWidget(type,timelineEl.config[0], timelineEl);
            widget.style.width = "100%";
            widget.style.height = "100%";
            media.innerHTML = "";
            media.appendChild(widget);
        }
    }







    //Get the timeline element config
    var data = timelineEl.config[0];





    var inputCont = document.createElement("div");
    cont.appendChild(inputCont);
    inputCont.style = `
        width: 50%;
        height: fit-content;
        /*max-height: 16rem;*/
        overflow-y: auto;
        display: inline-block;
        float: left;
        white-space: normal;
    `;
    //Border radius input
    var radius = tabInputs.input("Border radius", "number", "rem");
    //radius.childNodes[1] is the input field
    radius.childNodes[1].value = data.borderRadius;
    radius.childNodes[1].placeholder = "0";
    radius.childNodes[1].addEventListener("change", function(e) {
        var value = e.target.value;
        if(e.target.value == "") {
            value = 0;
        }
        media.style.borderRadius = value + "rem";
        //Update the timeline element
        timelineEl.config[0].borderRadius = value;

        refreshViewport(false);
    }); 
    radius.style.marginTop = "0.5rem";
    inputCont.appendChild(radius);

    var info = createInfoCircle(`
        '<b>rem</b>' is a unit which is adjusted relative 
        to the standard font size. Therefore, rounded borders
        will look good on many screen sizes.
    `);
    infoOnHover(info, "Why use rem?");
    radius.appendChild(info);

    var opacity = tabInputs.slider("Opacity", true);
    opacity.childNodes[1].value = data.opacity;
    opacity.childNodes[1].max = 1;
    opacity.childNodes[1].step = 0.01;
    opacity.childNodes[1].min = 0;
    opacity.childNodes[1].addEventListener("change", function(e) {
        var value = e.target.value;
        if(e.target.value == "") {
            value = 1;
        }
        media.style.opacity = value;
        //Update the timeline element
        timelineEl.config[0].opacity = value;

        refreshViewport(false);
    }); 


    inputCont.appendChild(opacity);

    var shadowSize = tabInputs.slider("Shadow size");
    shadowSize.childNodes[1].max = 20;
    shadowSize.childNodes[1].min = 0;
    shadowSize.childNodes[1].value = data.shadowMultiplier;
    
    shadowSize.childNodes[1].addEventListener("change", function(e) {
        var value = e.target.value;
        media.style.boxShadow = value + "px " + value + "px " + 1.3*value + "px 0px rgba(0,0,0,0.75)";
        //Update the timeline element
        timelineEl.config[0].shadowMultiplier = value;

        refreshViewport(false);
    }); 


    inputCont.appendChild(shadowSize);

    var blur = tabInputs.slider("Blur");
    blur.childNodes[1].max = 20;
    blur.childNodes[1].min = 0;
    blur.childNodes[1].step = 0.5;
    blur.childNodes[1].value = data.blur;
    
    blur.childNodes[1].addEventListener("change", function(e) {
        var value = e.target.value;
        media.style.filter = "blur(" + value+"px)";
        //Update the timeline element
        timelineEl.config[0].blur = value;

        refreshViewport(false);
    }); 


    inputCont.appendChild(blur);



    var hide = tabInputs.checkBox("Hide");
    hide.style.display = "block";
    hide.childNodes[0].childNodes[1].checked = !data.display;
    hide.childNodes[0].childNodes[1].addEventListener("change", function(e) {
        var value = e.target.checked;      
        timelineEl.config[0].display = !value;
        
        //Update the timeline element
        refreshViewport(false);
    }); 


    inputCont.appendChild(hide);




    switch(type) {
        case "img": 
            media = document.createElement("img");
            media.src = dirName + "/" + elPath;
            /*timeline.style.backgroundImage = "url('./extraResources/data/files/" + elPath +"')";
            timeline.style.backgroundRepeat = "repeat";
            timeline.style.backgroundSize = "auto 100%";*/
        
        break;
        case "widget":
            previewElement.style.width = "70%";
            media = document.createElement("div");
            media.style.overflow = "hidden";
            media.style.height = "100%";
            media.style.width = "100%";
            
            //Get widget type
            var type = elPath.split(" ")[0].toLowerCase();
            //Create widget of that type
            var widget = createWidget(type, timelineEl.config[0], timelineEl);

            //widget.style.backgroundColor = "var(--main-bg-color)";
            widget.style.width = "100%";
            widget.style.height = "100%";
            //Append widget to the preview wrapper
            media.appendChild(widget);
            switch(type) {
                case "text":
                    var custom = customisation(timelineEl.config[0]);
                    wrapper.appendChild(custom);
                break;
                case "time": {
                    var custom = customisation(timelineEl.config[0]);
                    wrapper.appendChild(custom);

                    var extra = document.createElement("div");
                    extra.style = `
                        width: 100%;
                        height: fit-content;
                    `;
                    extra.className = "time-meta"


                    var handleTimeOptionsChange = function(e) {
                        var value = e.target.checked;

                        var name = e.target.parentNode.getAttribute("name");
                        
                        switch(name) {
                            case "Hours":
                                data.widgetAttributes.time.showHours = value;
                            break;
                            case "Minutes":
                                data.widgetAttributes.time.showMinutes = value;
                            break;
                            case "Seconds":
                                data.widgetAttributes.time.showSeconds = value;
                            break;
                        }

                        //Update the viewport and preview element
                        // true: refresh the preview as well
                        refreshViewport(true);

                    }

                    var generateDateOptions = function() {
                        var el = document.createElement("div");
                        el.className = "date-options";
                        el.style = `
                            height: fit-content;
                            width: 100%;
                        `
                        var format = tabInputs.checkBox("European format");
                        el.appendChild(format);

                        return el;
                    }


                    var hours = tabInputs.checkBox("Hours")
                    hours.childNodes[0].childNodes[1].checked = data.widgetAttributes.time.showHours;
                    extra.appendChild(hours);
                    hours.childNodes[0].childNodes[1].addEventListener("change", handleTimeOptionsChange); 
                    hours.style.marginTop = "1rem";

                    var minutes = tabInputs.checkBox("Minutes");
                    minutes.childNodes[0].childNodes[1].checked = data.widgetAttributes.time.showMinutes;
                    extra.appendChild(minutes);
                    minutes.childNodes[0].childNodes[1].addEventListener("change", handleTimeOptionsChange); 
                    
                    var seconds = tabInputs.checkBox("Seconds");
                    seconds.childNodes[0].childNodes[1].checked = data.widgetAttributes.time.showSeconds;
                    extra.appendChild(seconds);
                    seconds.childNodes[0].childNodes[1].addEventListener("change", handleTimeOptionsChange); 


                    var date = tabInputs.checkBox("Show date");
                    extra.appendChild(date);
                    date.style.marginTop = "1rem";
                    date.childNodes[0].childNodes[1].addEventListener("change", function(e) {
                        var value = e.target.checked;
                        data.widgetAttributes.time.showDate = e.target.checked;
                        var options;
                        if(value) {
                            options = generateDateOptions();
                            extra.appendChild(options);
                            console.log(options.childNodes[0].childNodes[0].childNodes[1])
                            options.childNodes[0].childNodes[0].childNodes[1].checked = true;
                            options.childNodes[0].childNodes[0].childNodes[1].disabled = true;

                        } else {
                            var el = extra.querySelector(".date-options");
                            el.parentNode.removeChild(el);
                        }
                        // true --> refresh preview as well
                        refreshViewport(true);
                    });

                    inputCont.appendChild(extra)


                }
            }

        break;
    }


    previewElement.appendChild(media);
    preview.appendChild(previewElement);


        //Initialize the preview image with the timeline element config
    media.style.opacity = data.opacity;
    media.style.borderRadius = data.borderRadius+"rem";
    media.style.boxShadow = data.shadowMultiplier + "px " + data.shadowMultiplier + "px " + 1.3*data.shadowMultiplier + "px 0px rgba(0,0,0,0.75)";
    media.style.filter = "blur(" + data.blur + "px)";

}






function closeOpenTab() {
    //The function is called from the shortcut "Ctrl+W", and it closes the
    //currently active tab.

    //Get the active tab and its corresponding timeline element
    var tabs = document.getElementsByClassName("tab");
    var x;
    if(!tabs[0]) return;
    for(x of tabs) {
        if(x.selected) {
            removeTab(x.connectedElement);
        }
    }
}