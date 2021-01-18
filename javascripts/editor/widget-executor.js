
function createWidget(type, config, rootEl) {
    var el = document.createElement("div");
    el.className = "viewport-image widget";
    el.style = `
        background-color: ` + config.backgroundColor + `;
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
        placeholder.innerHTML = "news placeholder";
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
    `;

    cont.addEventListener("resize", function(e) {
        console.log(e);
    })
    var box = document.createElement("textarea");
    if(config.value) {
        box.value = config.value;
    } else {
        box.value = "text placeholder";
    }

    box.style = `
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
        background-color: transparent;
        border: none;
        height: 100%;
        width: 100%;
        resize: none;
        text-align: center;
        font-family: bahnschrift;
        font-size: ` + config.fontSize + `vh;
    `;
    box.style.pointerEvents = "none";
    box.addEventListener("change", function(e) {
        var value = e.target.value;
        rootEl.config[0].value = value;

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