function loadConfigToBrowser(config, timelineElement) {
    var browser = document.querySelector("#timeline > div > div.browser");
    browser.innerHTML = "";
    console.log(config)
    //Get the name of the element
    var name = timelineElement.getAttribute("filename");
    
    var h1 = document.createElement("h1");
    h1.innerHTML = name;
    h1.className = "title";
    browser.appendChild(h1);

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
    browser.appendChild(des);
    //extendDropDown(des);
    var wr = des.querySelector(".foldable-content").childNodes[0];
    var bRad = tabInputs.input("Border radius", "text", "rem");
    bRad.childNodes[1].value = config.borderRadius;
    bRad.childNodes[1].placeholder = 0;
    wr.appendChild(bRad);
    var opac = tabInputs.slider("Opacity", true);
    opac.childNodes[1].value = config.opacity;
    opac.childNodes[1].max = 1;
    opac.childNodes[1].step = 0.01;
    opac.childNodes[1].min = 0;
    wr.appendChild(opac);
    var blur = tabInputs.slider("Blur", false);
    opac.childNodes[1].value = config.blur;
    blur.childNodes[1].max = 1;
    blur.childNodes[1].step = 0.01;
    blur.childNodes[1].min = 0;
    wr.appendChild(blur);
    var shadow = tabInputs.slider("Shadow size", false);
    opac.childNodes[1].value = config.shadowMultiplier;
    shadow.childNodes[1].max = 1;
    shadow.childNodes[1].step = 0.01;
    shadow.childNodes[1].min = 0;
    wr.appendChild(shadow);
    var display = tabInputs.checkBox("Display");
    wr.appendChild(display);

    var siz = dropdownMenu("Sizing");
    browser.appendChild(siz);
    var wr = siz.querySelector(".foldable-content").childNodes[0];
    //extendDropDown(siz);
    var height = tabInputs.input("Height", "number");
    height.children[1].value = fileDat.height.value;
    wr.appendChild(height);
    var width = tabInputs.input("Width", "number");
    width.children[1].value = fileDat.width.value;
    wr.appendChild(width);

    var pos = dropdownMenu("Positioning");
    browser.appendChild(pos);
    //extendDropDown(pos);

    var fon = dropdownMenu("Text & Fonts");
    browser.appendChild(fon);
    //extendDropDown(fon);
    
    var adv = dropdownMenu("Advanced");
    browser.appendChild(adv);
    //extendDropDown(adv);
    var wr = adv.querySelector(".foldable-content").childNodes[0];
    var ident = tabInputs.input("Identification", "text");
    ident.children[1].style.width = "10rem";
    ident.children[1].placeholder = "...";
    wr.appendChild(ident);
    var lockAsp = tabInputs.checkBox("Lock aspect ratio");
    wr.appendChild(lockAsp);
}

function clearConfigFromBrowser() {
    var browser = document.querySelector("#timeline > div > div.browser");
    browser.innerHTML = "";
    var p = document.createElement("p");
    p.className = "no-content";
    p.innerHTML = "Nothing to show";
    browser.appendChild(p);
}