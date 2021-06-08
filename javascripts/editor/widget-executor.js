
function createWidget(type, config, rootEl) {
    var el = document.createElement("div");
    el.className = "viewport-image widget";
    var bgColor = config.backgroundColor;
    var bgOpacity = config.backgroundOpacity;
    el.style = `
        background-color: ` + bgColor + bgOpacity + `;
        font-family: ` + config.fontFamily + `;
    `;
    switch(type) {
        case "weather":
            var widgetContent = weather(config);
            el.appendChild(widgetContent);
        break;
        case "time":
            var widgetContent = time(config);
            el.appendChild(widgetContent);
        break;
        case "news":
            var widgetContent = news(config);
            el.appendChild(widgetContent)
        break;
        case "text":
            var widgetContent = text(config, rootEl);
            el.appendChild(widgetContent);
        break;
        case "script":
            var widgetContent = Script(config);
            el.appendChild(widgetContent);
        break;
        case "progress": 
        var widgetContent = Progress(config);
        el.appendChild(widgetContent);
    }
    
    return el;
}

function weather(config) {
    //Create the weather widget
    var cont = document.createElement("div");
    cont.setAttribute("style", `
        height: 100%;
        width: 100%;
        position: relative;
        overflow: hidden;
        pointer-events: none;
        overflow: hidden;
    `);
    var placeholder = document.createElement("h1");
    placeholder.innerHTML = "weather placeholder";
    placeholder.style = `
        height: fit-content;
        width: fit-content;
        margin: 0;
        position: absolute;
        font-weight: lighter;
        color: ` + config.textColor + `; 
        text-align: center;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        pointer-events: none;   
        font-size: ` + config.fontSize + `vh;

    `
    cont.appendChild(placeholder);

    return cont;
    
}

function time(config) {
    //Create the time widget
    var cont = document.createElement("div");
    cont.style = `
        height: 100%;
        width: 100%;
        border-radius: 0.25rem;
        position: relative;
        overflow: hidden;
    `;

    var time;
    var date = new Date();

    if(config.widgetAttributes.time.showDate) {
        var month = date.getMonth()+1;
        var day = date.getDate();
        var year = date.getFullYear();

        time = day + "/" + month + "/" + year;

    } else {
        
        var format = config.widgetAttributes.time.timeFormat;

        var showHours = config.widgetAttributes.time.showHours;
        var showMinutes = config.widgetAttributes.time.showMinutes;
        var showSeconds = config.widgetAttributes.time.showSeconds;

        var hours;
        var minutes;
        var seconds;

        switch(format) {
            case "0":
                //AMPM
                hours = date.getHours();
                minutes = date.getMinutes();
                seconds = date.getSeconds();
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? '0'+minutes : minutes;
                seconds = seconds < 10 ? '0'+seconds : seconds;
            break;
            case "1":
                //24HR clock
                
                hours = (date.getHours() > 9) ? date.getHours() : "0" + date.getHours();
                minutes = (date.getMinutes() > 9) ? date.getMinutes() : "0" + date.getMinutes();
                seconds = (date.getSeconds() > 9) ? date.getSeconds() : "0" + date.getSeconds();
            break;
        }

        if(showHours && !showMinutes && !showSeconds) {
            time = hours;
        } else if(showHours && showMinutes && !showSeconds) {
            time = hours + ":" + minutes;
        } else if(showHours && showMinutes && showSeconds) {
            time = hours + ":" + minutes + ":" + seconds;
        } else if(showHours && !showMinutes && showSeconds) {
            time = hours + ":" + seconds;  
        } else if(!showHours && showMinutes && !showSeconds) {
            time = minutes;
        } else if(!showHours && showMinutes && showSeconds) {
            time = minutes + ":" + seconds;
        } else if(showHours && showMinutes && showSeconds) {
            time = hours + ":" + minutes + ":" + seconds;
        } else if(!showHours && !showMinutes && showSeconds) {
            time = seconds;
        } else if(showHours && showMinutes && showSeconds) {
            time = hours + ":" + minutes + ":" + seconds;
        } else {
            time = ""
        }

        if(format == "0") {
            var ampm = hours >= 12 ? 'PM' : 'AM';
            time = time + " " + ampm;
        }

    }
    var placeholder = document.createElement("h1");
    placeholder.innerHTML = time;
    placeholder.style = `
        height: fit-content;
        width: fit-content;
        margin: 0;
        position: absolute;
        font-weight: lighter;
        color: var(--paragraph-color);
        text-align: center;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        color: ` + config.textColor + `;
        font-size: ` + config.fontSize + `vh; 
    `
    cont.appendChild(placeholder);
    
    return cont;
}

function news(config) {
        //Create the time widget
        //Create the weather widget
        var cont = document.createElement("div");
        cont.style = `
            height: 100%;
            width: 100%;
            border-radius: 0.25rem;
            position: relative;
            overflow: hidden;
        `;
        
        var placeholder = document.createElement("h1");
        placeholder.innerHTML = "News placeholder";
        placeholder.style = `
            height: fit-content;
            width: fit-content;
            margin: 0;
            position: absolute;
            font-weight: lighter;
            color: var(--paragraph-color);
            text-align: center;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            color: ` + config.textColor + `; 
        `
        cont.appendChild(placeholder);
    
        return cont;
}

function text(config, rootEl) {
    //Create the time widget
    //Create the weather widget
    var cont = document.createElement("div");
    cont.style = `
        height: 100%;
        width: 100%;
        border-radius: 0.25rem;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        text-align: center;
    `;


    var box = document.createElement("p");
    if(config.value) {
        box.innerHTML = config.value;
    } else {
        box.innerHTML = "Text box";
    }


    var height = config.size.height;
    var width = config.size.width;
    
    //Get the size of the widget
    var fontSize = config.fontSize;
    var h = parseInt(height.split("%")[0]);
    var w = parseInt(width.split("%")[0]);
    var converted = convertPercentToPx([w,h]);
    var size = converted[1]*fontSize/100;

    var align = config.widgetAttributes.text.align;
    box.style = `
        height: fit-content;
        width: 100%;
        margin: 0;
        font-weight: lighter;
        color: var(--paragraph-color);
        text-align: center;
        color: ` + config.textColor + `; 
        font-family: ` + config.fontFamily + `;
        background-color: transparent;
        border: none;
        resize: none;
        text-align: ` + align + `;
        font-size: ` + size + `px;
        margin: auto;
    `;
    box.style.pointerEvents = "none";
    box.addEventListener("change", function(e) {
        var value = e.target.value;
        rootEl.config.value = value;

        if(renderer.isRendered(rootEl)) {
            renderColumn(renderer.renderedColumn());
        }
        
    })
    cont.appendChild(box);
    cont.addEventListener("click", function(e) {
        e.target.childNodes[0].focus();   
    })
    return cont;
}

function Script(config) {
    //Create the weather widget
    var cont = document.createElement("div");
    cont.setAttribute("style", `
        height: 100%;
        width: 100%;
        position: relative;
        overflow: hidden;
        pointer-events: none;
        overflow: hidden;
    `);

    if(config.widgetAttributes.script.htmlContents) {
        cont.innerHTML = config.widgetAttributes.script.htmlContents;
        if(config.widgetAttributes.script.styleContents) {
            cont.innerHTML = cont.innerHTML + `
                <style>` + config.widgetAttributes.script.styleContents + `</style>
            `
        }
        return cont;
    }


    //var ascii = require("ascii-faces")
    var placeholder = document.createElement("h1");
    placeholder.innerHTML = "This element is empty<br><span style='color: rgb(100,100,100); font-size: 1rem; line-height: 1rem; margin: 0;'>Edit its script to display something</span>"
    if(config.identification) {
        placeholder.innerHTML = placeholder.innerHTML + "<br><span style='font-size: 1rem;'>ID: " + config.identification + "</span>";
    }
    placeholder.style = `
        height: fit-content;
        width: fit-content;
        line-height: 1.5rem;
        margin: 0;
        position: absolute;
        font-weight: lighter;
        color: var(--paragraph-color);
        text-align: center;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        color: ` + config.textColor + `;
        font-size: 2rem; 
        opacity: 0.5;
    `
    cont.appendChild(placeholder);
    

    return cont;

}




function Progress(config) {
    //Create the progress widget
    var cont = document.createElement("div");
    cont.setAttribute("style", `
        height: 100%;
        width: 100%;
        position: relative;
        overflow: hidden;
        pointer-events: none;
        overflow: hidden;
    `);
    
    var dots = document.createElement("div");
    dots.style = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: fit-content;
        width: fit-content;
    `;
    cont.appendChild(dots)
    //Get all columns with content
    var length = renderer.numberOfColumns();

    var height = config.size.height;
    var dims = convertPercentToPx([0,height.split("%")[0]]);
    var scale = config.widgetAttributes.progress.scale/100;
    var dotStyle = `
        height: ` + dims[1]*scale + `rem;
        width: ` + dims[1]*scale + `rem;
        background-color: rgb(100,100,100);
        border-radius: 100%;
        display: inline-block;
        opacity: 0.5;
    `;
    //Get the rendered column
    var rendCol = renderer.renderedColumn();
    for(let i = 0; i < length; i++) {
        var dot = document.createElement("div");
        if(rendCol == i) {
            dot.classList.add("active");
        }
        dot.classList.add("progression-dot");
        dot.style = dotStyle;
        dots.appendChild(dot);
    }

    return cont;

}