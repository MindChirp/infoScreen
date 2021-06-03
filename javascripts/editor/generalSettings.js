async function moreSettings() {
    var cont = document.createElement("div");
    
    var title = document.createElement("h1");
    title.innerHTML = "Settings";
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


    var dev = devSettings();
    cont.appendChild(dev);

    var update = updates();
    cont.appendChild(update);
    setTimeout(()=> {
        extendDropDown(update);
    }, 200)

    var file = fileSettings();
    cont.appendChild(file);
    setTimeout(()=> {
        extendDropDown(file);
    }, 200)
    var usrAndOrg = userAndOrg();
    cont.appendChild(usrAndOrg);
    setTimeout(()=> {
        extendDropDown(usrAndOrg);
    }, 200);




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
    collaps.style.width = "90%";

    var menu = collaps.querySelector(".foldable-content").childNodes[0];
    menu.classList.add("devSettings");
    var devFeatures = tabInputs.checkBox("Enable experimental features");
    devFeatures.getElementsByTagName("input")[0].setAttribute("name", "experimentalFeatures");
    menu.appendChild(devFeatures);

    var devMode = tabInputs.checkBox("Log extra information");
    devMode.getElementsByTagName("input")[0].setAttribute("name", "logExtraInformation");
    menu.appendChild(devMode);

    var viewport = tabInputs.checkBox("Enable alternative rendering engine");
    viewport.getElementsByTagName("label")[0].style.width = "fit-content";
    viewport.getElementsByTagName("label")[0].style.display = "inline-block";
    viewport.getElementsByTagName("input")[0].setAttribute("name", "enableAltRenderer");
    viewport.getElementsByTagName("input")[0].disabled = true;
    var cir = createInfoCircle(`Not ready for developer testing yet`);
    viewport.appendChild(cir);
    menu.appendChild(viewport);

    var alternativeSaving = tabInputs.checkBox("Enable alternate saving system");
    alternativeSaving.getElementsByTagName("input")[0].setAttribute("name", "enableAltSavingSystem");
    alternativeSaving.getElementsByTagName("input")[0].disabled = true;
    alternativeSaving.getElementsByTagName("label")[0].style.display = "inline-block";
    var cir = createInfoCircle(`Not ready for developer testing yet`);
    alternativeSaving.appendChild(cir);
    menu.appendChild(alternativeSaving);

    return collaps;
}


function setSettingsState(parent, name, value) {
    var el = document.getElementsByName(name)[0];
    var x;
    if(!el) return;
    var type = el.tagName;
    switch(type.toLowerCase()) {
        case "input":
            var cat = el.getAttribute("type");
            if(cat == "checkbox") {
                el.checked = value;
            }
        break;
    }
}



var updates = () => {
    var collaps = dropdownMenu("Updates");
    collaps.style.width = "90%";
    collaps.style.marginTop = "1rem";

    var menu = collaps.querySelector(".foldable-content").childNodes[0];
    menu.classList.add("updates");

    var autoupdate = tabInputs.checkBox("Enable auto-updates");
    autoupdate.getElementsByTagName("input")[0].setAttribute("name", "autoUpdates");
    menu.appendChild(autoupdate);

    var searchForUpdate = tabInputs.checkBox("Automatically search for updates");
    searchForUpdate.getElementsByTagName("input")[0].setAttribute("name", "autoUpdateSearch");
    menu.appendChild(searchForUpdate);

    var restartForUpdate = tabInputs.checkBox("Auto-restart after update");
    restartForUpdate.getElementsByTagName("input")[0].setAttribute("name", "autoRestartOnUpdate");
    menu.appendChild(restartForUpdate);

    return collaps;
    
}

var fileSettings = () => {
    var collaps = dropdownMenu("File");
    collaps.style.width = "90%";
    collaps.style.marginTop = "1rem";

    var menu = collaps.querySelector(".foldable-content").childNodes[0];
    menu.classList.add("file");

    var overwriteCorrupt = tabInputs.checkBox("Overwrite corrupt files");
    overwriteCorrupt.getElementsByTagName("input")[0].setAttribute("name", "overwriteCorruptFiles");
    menu.appendChild(overwriteCorrupt);

    var displayName = tabInputs.checkBox("Display file name in application bar");
    displayName.getElementsByTagName("input")[0].setAttribute("name", "displayNameInAppBar");
    menu.appendChild(displayName);

    return collaps;
}

var userAndOrg = () => {
    var collaps = dropdownMenu("User and Organisation");
    collaps.style.width = "90%";
    collaps.style.marginTop = "1rem";

    var menu = collaps.querySelector(".foldable-content").childNodes[0];
    menu.classList.add("usrAndOrg");

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
        overflow: hidden;
    `;
    user.appendChild(pfp);

    var img = document.createElement("img");

    var path = require("path");

    var path = path.join(__dirname, "extraResources",  "data", "programData", "profilePics", "pfpThumb.json");
    
    fs.readFile(path, (err, data) => {
        if(err) throw err;
        img.src = JSON.parse(data).data;
    })

    img.style = `
        height: 100%;
        width: 100%;
        transform: scale(1.05);
    `
    pfp.appendChild(img);

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
    signOut.addEventListener("click", async ()=>{
        var modal = await modalWindow("This will sign you out and open the launcher without saving.", "This action cannot be undone. Are you sure?", "error");
        var ok = document.createElement("button");
        ok.innerHTML = "Yes";
        modal.appendChild(ok);
        ok.addEventListener("click", async()=>{ 
            //Sign out of the program 
            modal.kill();
            signOutProgram()
            .then(()=>{
                alreadyClosing = true;
                relaunchLauncher();
            })
            .catch(async(error)=>{
                var modal = await modalWindow("Could not sign out", "Please try again later <br>(" + error + ")", "error");
                var ok = document.createElement("button");
                ok.innerHTML = "ok";
                ok.className = "important";
                modal.appendChild(ok);
                ok.addEventListener("click", ()=>{
                    modal.kill();
                })
            })
        });

        var no = document.createElement("button");
        no.innerHTML = "Cancel";
        no.className = "important";
        modal.appendChild(no);
        no.addEventListener("click", ()=>{
            modal.kill();
        })
    });




    var changeMail = document.createElement("button");
    changeMail.innerHTML = "Change email";
    changeMail.style.marginLeft = "1rem";
    changeMail.className = "fd-button important smooth-shadow";
    act.querySelector(".content").appendChild(changeMail);
    changeMail.addEventListener("click", async ()=>{
        var modal = await modalWindow("This is not enabled.", "As of now, the servers does not support changing email.", "error");
        var ok = document.createElement("button");
        ok.innerHTML = "ok";
        ok.className = "important";
        modal.appendChild(ok);
        ok.onclick = modal.kill;
    })

    var changePassword = document.createElement("button");
    changePassword.innerHTML = "Change password";
    changePassword.style.marginLeft = "1rem";
    changePassword.className = "fd-button important smooth-shadow";
    act.querySelector(".content").appendChild(changePassword);
    changePassword.addEventListener("click", async ()=>{
        var modal = await modalWindow("This is not enabled.", "As of now, the servers does not support changing password.", "error");
        var ok = document.createElement("button");
        ok.innerHTML = "ok";
        ok.className = "important";
        modal.appendChild(ok);
        ok.onclick = modal.kill;
    })

    var changeName = document.createElement("button");
    changeName.innerHTML = "Change name";
    changeName.style.marginLeft = "1rem";
    changeName.className = "fd-button important smooth-shadow";
    act.querySelector(".content").appendChild(changeName);
    changeName.addEventListener("click", async ()=>{
        var modal = await modalWindow("This is not enabled.", "As of now, the servers does not support changing name.", "error");
        var ok = document.createElement("button");
        ok.innerHTML = "ok";
        ok.className = "important";
        modal.appendChild(ok);
        ok.onclick = modal.kill;
    })

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