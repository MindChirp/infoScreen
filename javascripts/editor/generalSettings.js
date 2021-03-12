function moreSettings() {
    var cont = document.createElement("div");
    
    var title = document.createElement("h1");
    title.innerHTML = "Settings";
    title.style = `
        font-size: 5rem;
        color: var(--title-color);
        font-family: bahnschrift;
        font-weight: lighter;
        margin-top: 1rem;
    `;

    cont.appendChild(title);
    
    var dev = devSettings();
    cont.appendChild(dev);

    var update = updates();
    cont.appendChild(update);
    setTimeout(()=> {
        extendDropDown(update);
    }, 100)

    var file = fileSettings();
    cont.appendChild(file);
    setTimeout(()=> {
        extendDropDown(file);
    }, 100)
    var usrAndOrg = userAndOrg();
    cont.appendChild(usrAndOrg);
    setTimeout(()=> {
        extendDropDown(usrAndOrg);
    }, 100)
    return cont;

}

function extendDropDown(el) {
    var ev = new Event("click");
    el.getElementsByTagName("button")[0].dispatchEvent(ev);
}


////////////////////////
// Developer settings //
////////////////////////

var devSettings = () => {
    var collaps = dropdownMenu("Developer Settings");
    collaps.style.width = "50%";

    var menu = collaps.querySelector(".foldable-content").childNodes[0];
    
    var devFeatures = tabInputs.checkBox("Enable experimental features");
    menu.appendChild(devFeatures);
    
    var devMode = tabInputs.checkBox("Log extra information");
    menu.appendChild(devMode);

    var viewport = tabInputs.checkBox("Enable alternative rendering engine");
    menu.appendChild(viewport);

    var alternativeSaving = tabInputs.checkBox("Enable alternate saving system");
    menu.appendChild(alternativeSaving);

    return collaps;
}

var updates = () => {
    var collaps = dropdownMenu("Updates");
    collaps.style.width = "50%";
    collaps.style.marginTop = "1rem";

    var menu = collaps.querySelector(".foldable-content").childNodes[0];

    var autoupdate = tabInputs.checkBox("Enable auto-updates");
    menu.appendChild(autoupdate);

    var searchForUpdate = tabInputs.checkBox("Automatically search for updates");
    menu.appendChild(searchForUpdate);

    var searchForUpdate = tabInputs.checkBox("Auto-restart after update");
    menu.appendChild(searchForUpdate);

    return collaps;
    
}

var fileSettings = () => {
    var collaps = dropdownMenu("File");
    collaps.style.width = "50%";
    collaps.style.marginTop = "1rem";

    var menu = collaps.querySelector(".foldable-content").childNodes[0];

    var overwriteCorrupt = tabInputs.checkBox("Overwrite corrupt files");
    menu.appendChild(overwriteCorrupt);

    var displayName = tabInputs.checkBox("Display file name in application bar");
    menu.appendChild(displayName);

    return collaps;
}

var userAndOrg = () => {
    var collaps = dropdownMenu("User and Organisation");
    collaps.style.width = "50%";
    collaps.style.marginTop = "1rem";

    var menu = collaps.querySelector(".foldable-content").childNodes[0];

    var user = document.createElement("div");
    user.style = `
        height: fit-content;
        padding-bottom: 1rem;
        width: 100%;
        padding-right: 2rem;
        box-sizing: border-box;
        overflow: hidden;
        display: block;
        white-space: nowrap;
    `;

    menu.appendChild(user);

    var pfp = document.createElement("div");
    pfp.className = "smooth-shadow";
    pfp.style = `
        height: 10rem;
        width: 10rem;
        border-radius: 100%;
        background-color: var(--main-bg-color);
        display: inline-block;
    `;
    user.appendChild(pfp);

    var ico = document.createElement("i");
    ico.className = "material-icons";
    ico.innerHTML = "person_outline";
    pfp.appendChild(ico);
    ico.style = `
        line-height: 10rem;
        width: 100%;
        text-align: center;
        color: var(--title-color);
        font-size: 7rem;
        opacity: 0.8;
        font-weight: lighter;
    `;

    var userDat = JSON.parse(localStorage.getItem("userInfo"))[1][0]
    var userName = userDat.name;
    var name = document.createElement("h1");
    name.innerHTML = userName;
    name.style = `
        display: inline-block;
        line-height: 10rem;
        margin: 0;
        height: 10rem;
        vertical-align: top;
        margin-left: 1rem;
        color: var(--paragraph-color);
    `
    user.appendChild(name);


    var section = (title) => {
        var el = document.createElement("div");
        el.style = `
            width: 100%;
            height: fit-content;
            margin-top: 1rem;
        `;
        var t = document.createElement("p");
        t.innerHTML = title;
        t.style = `
            margin: 0;
        `;

        var div = document.createElement("div");
        div.style = `
            width: 80%;
            height: 1px;
            background-color: white;
            opacity: 0.4;
        `;
        div.className = "smooth-shadow";

        el.appendChild(t);
        el.appendChild(div);

        var content = document.createElement("div");
        content.style = `
            width: 100%;
            height: fit-content;
            padding: 0.5rem;
            box-sizing: border-box;
        `
        content.className = "content";
        el.appendChild(content);

        return el;
    }



    var actions = document.createElement("div");
    actions.style = `
        margin-top: 1rem;
    `
    var act = section("Actions");

    menu.appendChild(act);

    var signOut = document.createElement("button");
    signOut.innerHTML = "Sign Out";
    signOut.className = "fd-button important smooth-shadow";
    act.querySelector(".content").appendChild(signOut);

    var org = section("Organisation")

    menu.appendChild(org);
    var none = document.createElement("p");
    none.style = `
        margin: 0;
        opacity: 0.5;
    `
    none.innerHTML = "You are not assigned to an organisation.";
    org.querySelector(".content").appendChild(none);

    return collaps;
}