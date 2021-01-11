function createWidget(type, config, rootEl) {
    var el = document.createElement("div");
    el.className = "viewport-image widget";
    switch(type) {
        case "weather":
            var widgetContent = weather();
            el.appendChild(widgetContent);
        break;
        case "time":
            var widgetContent = time();
            el.appendChild(widgetContent);
        break;
        case "news":
            var widgetContent = news();
            el.appendChild(widgetContent)
        break;
        case "text":
            var widgetContent = text(config, rootEl);
            el.appendChild(widgetContent);
    }
    
    return el;
}

function weather() {
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
        color: var(--paragraph-color);
        text-align: center;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        color: white;     
        pointer-events: none;   
    `
    cont.appendChild(placeholder);

    return cont;
    
}

function time() {
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
        placeholder.innerHTML = "time placeholder";
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
            color: white; 
        `
        cont.appendChild(placeholder);
    
        return cont;
}

function news() {
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
            color: white; 
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
        color: white; 
        background-color: transparent;
        border: none;
        height: 100%;
        width: 100%;
        resize: none;
        text-align: center;
        font-family: bahnschrift;
    `;
    box.style.pointerEvents = "none";
    box.addEventListener("change", function(e) {
        var value = e.target.value;
        rootEl.config[0].value = value;

        
    })
    cont.appendChild(box);
    cont.addEventListener("click", function(e) {
        e.target.childNodes[0].focus();   
    })
    return cont;
}