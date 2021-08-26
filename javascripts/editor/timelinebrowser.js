var refreshViewport = function(element) {
    if(renderer.isRendered(element)) {
        var colNo = renderer.renderedColumn();
        renderColumn(colNo);
    }
}

var timelineBrowserState = {
    openedTabs: 
        {
            design: false, 
            sizing: false, 
            positioning: false, 
            text: false, 
            advanced: false
        }
}

var designTab = function(config, tLElement) {
    var wr = document.createElement("div");

    var bRad = tabInputs.input("Border radius", "text", "rem");
    bRad.childNodes[1].value = config.borderRadius;
    bRad.childNodes[1].placeholder = 0;
    wr.appendChild(bRad);
    var opac = tabInputs.slider("Opacity", true);
    setTimeout(()=>{
        opac.children[1].value = config.opacity;
    }, 10);

    opac.childNodes[1].addEventListener("change", function(e) {
        var value = e.target.value;
        if(e.target.value == "") {
            value = 1;
        }
        //Update the timeline element
        tLElement.config.opacity = value;

        refreshViewport(tLElement);
    }); 

    opac.childNodes[1].max = 1;
    opac.childNodes[1].step = 0.01;
    opac.childNodes[1].min = 0;
    wr.appendChild(opac);
    var blur = tabInputs.slider("Blur", false);
    setTimeout(()=>{
        blur.childNodes[1].value = config.blur;
    }, 10);
    blur.childNodes[1].max = 1;
    blur.childNodes[1].step = 0.01;
    blur.childNodes[1].min = 0;
    blur.childNodes[1].addEventListener("change", function(e) {
        var value = e.target.value;
        //Update the timeline element
        tLElement.config.blur = value;

        refreshViewport(tLElement);
    }); 
    wr.appendChild(blur);
    var shadow = tabInputs.slider("Shadow size", false);
    setTimeout(()=>{
        shadow.childNodes[1].value = config.shadowMultiplier;
    }, 10);
    shadow.childNodes[1].max = 1;
    shadow.childNodes[1].step = 0.01;
    shadow.childNodes[1].min = 0;
    shadow.childNodes[1].addEventListener("change", function(e) {
        var value = e.target.value;
        //Update the timeline element
        tLElement.config.shadowMultiplier = value;

        refreshViewport(tLElement);
    }); 
    wr.appendChild(shadow);

    var shouldDisp = config.display;
    var display = tabInputs.checkBox("Display");
    display.childNodes[0].childNodes[1].checked = shouldDisp;
    wr.appendChild(display);
    display.childNodes[0].childNodes[1].addEventListener("change", function(e) {
        var value = e.target.checked;      
        tLElement.config.display = value;
        
        //Update the timeline element
        refreshViewport(tLElement);
    }); 
    return wr;
}

var sizingTab = function(config) {

    //Get the sizing and transform properties of the element
    var regexN = /[0-9]/g;
    var regexC = /[^\d.-]/g;
    var fileDat = {
        height: {value: config.size.height.replace(regexC,''), unit: config.size.height.replaceAll(regexN,'').replace(/\./g, "")},
        width: {value: config.size.width.replace(regexC,''), unit: config.size.width.replace(regexN,'').replace(/\./g, "")},
        x: {value: config.position[0].replace(regexC,''), unit: config.position[0].replace(regexN, '').replace(/\./g, ""), edge: config.edgeAnchors.x},
        y: {value: config.position[1].replace(regexC,''), unit: config.position[1].replace(regexN, '').replace(/\./g, ""),  edge: config.edgeAnchors.y}
    }


    var wr = document.createElement("div");

    var s1 = `
        vertical-align: bottom;
        display: inline-block;
    `;
    var s2 = `
        display: inline-block;
        height: 2rem;
        vertical-align: top;
        margin: 0 0 0 0.2rem;
    `;
    var s3 = `
        height: 2rem;
    `;
    var s4 = `
        height: 2rem;
        padding: 0 1.6rem 0 0.2rem;
    `;

    var units = ["px", "%", "rem", "vh", "vw"];

    var div = document.createElement("div");
    div.style = `
        height: 3rem;
    `
    var height = tabInputs.input("Height", "number");
    height.children[1].value = fileDat.height.value;
    height.style = s1; 
    wr.appendChild(height);
    div.appendChild(height);


    var unit = tabInputs.select(units, 0);
    unit.style = s2;
    unit.children[0].style = s3;
    unit.children[0].children[0].style = s4;
    unit.style.verticalAlign = "bottom";
    div.appendChild(unit);
    wr.appendChild(div);

    var div = document.createElement("div");
    div.style = "height: 3rem; margin-top: 0.5rem; display: block;";
    var width = tabInputs.input("Width", "number");
    width.children[1].value = fileDat.width.value;
    width.style = s1;
    div.appendChild(width);

    var unit = tabInputs.select(units, 0);
    unit.style = s2;
    unit.children[0].style = s3;
    unit.children[0].children[0].style = s4;
    unit.style.verticalAlign = "bottom";
    div.appendChild(unit);
    wr.appendChild(div);

    var aspLock = tabInputs.checkBox("Lock aspect ratio");
    aspLock.style.marginTop = "0.5rem";
    wr.appendChild(aspLock);

    return wr;
}

var posTab = function(config) {
    var wr = document.createElement("div");

    return wr;
}

var fontTab = function(config) {
    var wr = document.createElement("div");

    return wr; 
}

var advTab = function(config) {
    var wr = document.createElement("div");
    var ident = tabInputs.input("Identification", "text");
    ident.children[1].style.width = "10rem";
    ident.children[1].placeholder = "...";
    wr.appendChild(ident);
    var lockAsp = tabInputs.checkBox("Lock aspect ratio");
    wr.appendChild(lockAsp);
    return wr; 
}


function loadConfigToBrowser(config, timelineElement) {
    var browser = document.querySelector("#timeline > div > div.browser");
    browser.innerHTML = "";

    var mainWr = document.createElement("div");
    mainWr.className = "main-wrapper";
    browser.appendChild(mainWr);
    //Get the name of the element
    var name = timelineElement.getAttribute("filename");
    
    var h1 = document.createElement("h1");
    h1.innerHTML = name;
    h1.className = "title";
    mainWr.appendChild(h1);

    //Get the sizing and transform properties of the element
    var regexN = /[0-9]/g;
    var regexC = /[^\d.-]/g;
    var fileDat = {
        height: {value: config.size.height.replace(regexC,''), unit: config.size.height.replaceAll(regexN,'').replace(/\./g, "")},
        width: {value: config.size.width.replace(regexC,''), unit: config.size.width.replace(regexN,'').replace(/\./g, "")},
        x: {value: config.position[0].replace(regexC,''), unit: config.position[0].replace(regexN, '').replace(/\./g, ""), edge: config.edgeAnchors.x},
        y: {value: config.position[1].replace(regexC,''), unit: config.position[1].replace(regexN, '').replace(/\./g, ""),  edge: config.edgeAnchors.y}
    } 

    var des = dropdownMenu("Design");
    des.addEventListener("click", (e)=>{
        //Check if the element is expanded or retracted
        var state = e.target.closest(".dropdown").classList.contains("opened");
        timelineBrowserState.openedTabs.design = state;
    });
    mainWr.appendChild(des);
    if(timelineBrowserState.openedTabs.design) {
        setTimeout(()=>{
            extendDropDown(des);
        }, 10)
    }
    var wr = des.querySelector(".foldable-content").childNodes[0];
    var content = designTab(config, timelineElement);
    wr.appendChild(content);

    var siz = dropdownMenu("Sizing");
    siz.addEventListener("click", (e)=>{
        var state = e.target.closest(".dropdown").classList.contains("opened");
        timelineBrowserState.openedTabs.sizing = state;
    });
    mainWr.appendChild(siz);
    if(timelineBrowserState.openedTabs.sizing) {
        setTimeout(()=>{
            extendDropDown(siz);
        }, 10)
    }
    var wr = siz.querySelector(".foldable-content").childNodes[0];
    //extendDropDown(siz);
    var content = sizingTab(config);
    wr.appendChild(content);

    var pos = dropdownMenu("Positioning");
    pos.addEventListener("click", (e)=>{
        //Check if the element is expanded or retracted
        var state = e.target.closest(".dropdown").classList.contains("opened");
        timelineBrowserState.openedTabs.positioning = state;
    });
    mainWr.appendChild(pos);
    if(timelineBrowserState.openedTabs.positioning) {
        setTimeout(()=>{
            extendDropDown(pos);
        }, 10)
    }
    var wr = siz.querySelector(".foldable-content").childNodes[0];
    //extendDropDown(pos);
    var content = posTab(config);
    wr.appendChild(content);

    var fon = dropdownMenu("Text & Fonts");
    fon.addEventListener("click", (e)=>{
        //Check if the element is expanded or retracted
        var state = e.target.closest(".dropdown").classList.contains("opened");
        timelineBrowserState.openedTabs.text = state;
    });
    mainWr.appendChild(fon);
    if(timelineBrowserState.openedTabs.text) {
        setTimeout(()=>{
            extendDropDown(fon);
        }, 10)
    }
    var wr = siz.querySelector(".foldable-content").childNodes[0];
    //extendDropDown(fon);
    var content = fontTab(config);
    wr.appendChild(content);

    var adv = dropdownMenu("Advanced");
    adv.addEventListener("click", (e)=>{
        //Check if the element is expanded or retracted
        var state = e.target.closest(".dropdown").classList.contains("opened");
        timelineBrowserState.openedTabs.advanced = state;
    });
    mainWr.appendChild(adv);
    if(timelineBrowserState.openedTabs.advanced) {
        setTimeout(()=>{
            extendDropDown(adv);
        }, 10)
    }
    //extendDropDown(adv);
    var wr = adv.querySelector(".foldable-content").childNodes[0];
    var content = advTab(config);
    wr.appendChild(content);

}

function clearConfigFromBrowser() {
    var browser = document.querySelector("#timeline > div > div.browser");
    browser.innerHTML = "";
    var p = document.createElement("p");
    p.className = "no-content";
    p.innerHTML = "Nothing to show";
    browser.appendChild(p);
}



