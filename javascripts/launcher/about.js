function about(parent) {
    if(document.getElementById("settings-wrapper")) {
        var el = document.getElementById("settings-wrapper");
        if(el.getAttribute("name") == "about") {
            return;
        }
        el.parentNode.removeChild(el);
    }


    if(!document.getElementById("divider-line")) {
        var div = divider();
        parent.appendChild(div);
    }

    var wrapper = document.createElement("div");
    wrapper.setAttribute("id", "settings-wrapper");
    wrapper.setAttribute("name", "about");

    parent.appendChild(wrapper);

    //Read the package.json file to get the version
    var dat;
    try {
        var dir = path.join(path.dirname(__dirname), "package.json");
        dat = fs.readFileSync(dir);
    } catch (error) {
        try {
            var dir = path.join(__dirname, "package.json");
            dat = fs.readFileSync(dir);
        } catch (error) {
            
        }
    }

        data = JSON.parse(dat);
        console.log(data.version);
        
        var el = textCont("Version", data.version);
        wrapper.appendChild(el);

        var el = textCont("Coded by", "Frikk O. Larsen");
        wrapper.appendChild(el);

        var el = textCont("Design by", "Frikk O. Larsen");
        wrapper.appendChild(el);

};