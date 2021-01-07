function createWidget(type, config) {
    var el = document.createElement("div");
    el.className = "viewport-image widget";
    console.log(type)
    switch(type) {
        case "weather":
            var widgetContent = weather();
            el.appendChild(widgetContent);
        break;
        case "time":
            var widgetContent = time();
            el.appendChild(widgetContent);
        break;
    }
    
    return el;
}

function weather() {
    //Create the weather widget
    var cont = document.createElement("div");
    cont.style = `
        height: 100%;
        width: 100%;
        background-color: var(--main-bg-color);
        border-radius: 0.25rem;
        position: relative;
        overflow: hidden;
    `;
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
            background-color: var(--main-bg-color);
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