async function overlaySettings() {
    var menu;
    if(!document.getElementsByClassName("menu")[0]) {
        menu = fullPageMenu("user");
        document.body.appendChild(menu);
        menu.classList.add("overlay-settings-menu");
        menu.style = `
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            z-index: 101;
        `;
        //Delete the default header
        menu.childNodes[0].parentNode.removeChild(menu.childNodes[0]);
    } else {
        //Menu already exists. Delete it
        var menus = document.getElementsByClassName("menu");
        var x;

        for(x of menus) {
            x.parentNode.removeChild(x);
        }

        //Call the aboutMenu function again, to instantiate a new menu element
        overlaySettings();
    }
    if(menu) {
        menu.style.padding = "3rem";
        menu.style.boxSizing = "border-box";
        menu.style.overflow = "auto";
    }
    var tile = function(title, meta) {
        var el = document.createElement("div");
        el.style = `
            height: fit-content;
            width: fit-content;
            display: inline-block;
            margin-right: 2rem;
            margin-top: 1rem;
        `

        var h1 = document.createElement("p");
        h1.style = `
            line-height: 1.5rem;
            font-size: 1.5rem;
            margin: 0;
            font-weight: lighter;
            display: block;
            color: var(--title-color);
        `;
        h1.innerHTML = title;

        var p = document.createElement("p");
        p.style = `
            margin: 0;
            font-weight: lighter;
            line-height: 1.5rem;
            font-size: 1.5rem;
            display: block;
            color: var(--paragraph-color);
            opacity: 0.5;
        `;
        p.innerHTML = meta;

        el.appendChild(h1);
        el.appendChild(p);
        return el;
    }


//Transform this general settings script into an overlay settings script

    var settings = await moreOverlaySettings();
    if(menu) {
        menu.appendChild(settings);
        //Get the settings data
        var settings;
        var readFile = util.promisify(fs.readFile);

        function getSettings() {
            return readFile(settingsDirectory, "utf8")
        }

        try {
            settings = JSON.parse(await getSettings())
        } catch (error) {
            throw error;
        }

        var cats = Object.entries(settings);
        var x;
        for(x of cats) {
            var name = x[0];
            var el = menu.querySelector("." + name);

            var entries = Object.entries(x[1]);
            
            var y;
            for(y of entries) {
                //Set the settings
                setSettingsState(el, y[0], y[1]);
            }
        }


        //Update the keybinds page
        var bind;
        fs.readFile(keybindsDirectory, "utf8", async(err, data) =>{
            var dat = JSON.parse(data);
            var x;
            for(x of dat) {
                if(x.type == "overlay") {
                    bind = x.accelerator;
                    var binds = await returnKeyBindPieces(bind);
                    document.querySelector("body > div.menu.overlay-settings-menu > div > div > div > div > div.set-keybind > div").appendChild(binds);
                }
            }
        })

        function returnKeyBindPieces(bind) {
            return new Promise(resolve=>{

                var pieces = bind.split("+");
                var x;
                
                var wr = document.createElement("div");
                wr.className = "keybind-pieces-wrapper";
                for(x of pieces) {
                    var el = document.createElement("div");
                    el.className = "piece";
                    el.innerHTML = x;
                    wr.appendChild(el);
                }
                resolve(wr);
            })
        }
        
        var handleSettingsClose = (e) => {
            var menu = e.target.closest(".menu");
            var dropDowns = menu.getElementsByClassName("foldable-content");

            var settings = JSON.parse(fs.readFileSync(settingsDirectory, "utf8"));
            console.log(settings);

            
            var enable = dropDowns[0].querySelector(".enable-overlay").getElementsByTagName("input")[0].checked;
            var holderObj = {
                enableOverlay: enable
            };                

            settings.overlaySettings = holderObj;

            fs.writeFile(settingsDirectory, JSON.stringify(settings, null, 4),(err)=>{
                if(err) throw err;
                loadSettingsConfig();
            })


        }

        menu.querySelector(".back-button").addEventListener("click", handleSettingsClose);

    }



}




async function moreOverlaySettings() {
    var cont = document.createElement("div");
    
    var title = document.createElement("h1");
    title.innerHTML = "Overlay Settings";
    title.style = `
        font-size: 5rem;
        color: var(--title-color);
        font-family: bahnschrift;
        font-weight: lighter;
        margin-top: 1rem;
        margin-bottom: 0rem;
        `;



    cont.appendChild(title);
    
    var subTitle = document.createElement("p");
    subTitle.innerHTML = "Changes are only saved when pressing the back button";
    subTitle.style = `
        margin-top: 0;
        font-weight: lighter;
        opacity: 0.7;
        color: var(--paragraph-color);
        margin-bottom: 3rem;
    `
    cont.appendChild(subTitle);


    var general = overlayGeneral();
    cont.appendChild(general);
    setTimeout(()=>{
        extendDropDown(general);
    })



    return cont;

}


function overlayGeneral(values) {
    var collaps = dropdownMenu("General Settings");
    collaps.style.width = "90%";

    var menu = collaps.content;
    menu.classList.add("overlaySettings");


    var enable = tabInputs.checkBox("Enable overlay");
    enable.classList.add("enable-overlay");
    enable.getElementsByTagName("input")[0].setAttribute("name", "enableOverlay");
    menu.appendChild(enable);

    
    var keyBind = document.createElement("div");
    keyBind.className = "set-keybind";
    menu.appendChild(keyBind);

    var activeBind = document.createElement("div");
    activeBind.className = "active-bind";
    keyBind.appendChild(activeBind);

    var setBind = document.createElement("button");
    setBind.className = "fd-button smooth-shadow"
    setBind.innerHTML = "Set keybind";
    keyBind.appendChild(setBind);
    setBind.addEventListener("click", startAddingEventListener);
    return collaps;
 
}

var startAddingEventListener = (e) => {
    //Save the old keycombo, just incase nothing is inputed
    var oldCombo = document.querySelector("body > div.menu.overlay-settings-menu > div > div > div > div > div.set-keybind > div > div").cloneNode(true); 


    document.querySelector("body > div.menu.overlay-settings-menu > div > div > div > div > div.set-keybind > div > div").innerHTML = "";
    keys = [];


    e.target.innerHTML = "Accept"
    //Add a window event listener
    window.addEventListener("keydown", handleBindPress)

    var newButton = e.target.cloneNode(true);
    e.target.replaceWith(newButton);



    //Handle the accept button click (Done typing keybind)
    newButton.addEventListener("click", (e) => {
        e.target.innerHTML = "Set keybind";
        e.target.replaceWith(newButton);
        window.removeEventListener("keydown", handleBindPress);
        //Get the keys pressed, and save them

        newButton.addEventListener("click", startAddingEventListener);
        if(keys.length == 0) {
            document.querySelector("body > div.menu.overlay-settings-menu > div > div > div > div > div.set-keybind > div > div").replaceWith(oldCombo);
            return;
        }

        var x;
        var accString="";
        for(x of keys) {
            if(accString.trim().length>0) {
                accString = accString + "+" + x;
            } else {
                accString = x;
            }
        }

        
        var settings = JSON.parse(fs.readFileSync(keybindsDirectory, "utf8"));
        //Get the one labelled overlay
        var x;
        for(x of settings) {
            if(x.type == "overlay"){
                x.accelerator = accString;
            }
        }
        

        fs.writeFile(keybindsDirectory, JSON.stringify(settings, null, 4),(err)=>{
            if(err) throw err;
            console.log("OK");
        })
    })

}

var keys = [];
function handleBindPress(event) {
    var pieceCont = document.querySelector("body > div.menu.overlay-settings-menu > div > div > div > div > div.set-keybind > div > div");
    var maxBindLength = 3;

    var key = event.key.toUpperCase();
    if(keys.length == 3 || key.trim().length == 0) return;
    

    //Check if the key is already added
    var cancelContinue = false;
    var x;
    for(x of keys) {
        if(x == key) {
            cancelContinue = true;
        };
    }
    if(cancelContinue) return;

    var piece = document.createElement("div");
    piece.className = "piece";
    if(key == "Ctrl" || key == "Shift" || key == "CapsLock") {
        piece.classList.add("special");
    }
    pieceCont.appendChild(piece);
    piece.innerHTML = key.toUpperCase();

    keys.push(key);
}