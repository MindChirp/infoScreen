const { createWriteStream } = require("fs");
const { profile, exception, groupCollapsed } = require("console");
const { ipcMain, ipcRenderer, remote} = require("electron");
const env = process.env.NODE_ENV || 'development';
const { isPackaged } = require("electron-is-packaged");
const serverAddress = "https://shrouded-wave-54128.herokuapp.com";
const internetAvailable = require("internet-available");
const keytar = require("keytar");
const shell = require("electron").shell;
const fse = require("fs-extra");

var filesPath;
ipcRenderer.on("files-path", (e, data) => {
    localStorage.setItem("filesPath", data);
    checkProjFolder();
});

//shell.openItem(path.join(__dirname, ))


function checkProjFolder() {
    fs.access(path.join(filesPath, "projects"), (error)=>{
        if(error) {
            //Dir does not exist
            fs.mkdir(filesPath + "/projects");
        } else {
            //Dir does exist
        }
    })
}


if(env != "development") {
    var devButton = document.getElementById("developer-start");
    devButton.parentNode.removeChild(devButton);
}


var clientConnected = true;

//Check for internet connectivity
internetAvailable({
    timeout: 4000,
    retries: 10
}).then(()=>{
    //showNotification("Internet connected");
    clientConnected = true;
}).catch(()=>{
    clientConnected = false;
    showNotification("No internet")
})

const ipc = require("electron").ipcRenderer;
const { format } = require("path");
const { resolve } = require("path");
function launchProgram() {
    var val = ipc.sendSync("open-main-window", {developerLaunch: true});
    if(val) {
        var window = remote.getCurrentWindow();
        window.close();
    }
}

//Loading wheel
function loaderWheel() {
    var el = document.createElement("div");
        el.setAttribute("class", "lds-roller");

    for(let i = 0; i < 7; i++) {
        var child = document.createElement("div");
            el.appendChild(child);
    }

    return el;
}




var signedIn = false;
var firstTime = null;

function authClient() {
    return new Promise((resolve, reject)=>{

        //Fetch the password from the OS keychain
        //get the username
        if(!JSON.parse(localStorage.getItem("userInfo"))[1]) {reject("No user info on computer"); return;}
        var usr = JSON.parse(localStorage.getItem("userInfo"))[1][0].email;
        keytar.getPassword("infoscreen", usr)
        .then((pass)=>{
            var usr = JSON.parse(localStorage.getItem("userInfo"))[1][0].email;
            var formData = new FormData();
            formData.append("user", usr);
            formData.append("password", pass);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", serverAddress + "/auth");
            xhr.send(formData);

            xhr.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200) {
                    var dat = JSON.parse(this.responseText);
                    localStorage.setItem("userInfo", JSON.stringify(dat));
                    console.log("%cClient signed in and up to date", "font-size: 1.5rem; color: red; text-stroke: 1px black;");
                    
                    localStorage.setItem("signedIn", "true");
                    var state = {upToDate: true, errorType: null}
                    document.body.serverState.push(state);
                    
                    //Enable developer mode if the user is a dev
                    if(dat[1][0].dev == true) {
                        document.body.developerMode = true;
                        enableDevMode();
                    } else {
                        document.body.developerMode = false;
                    }
                    
                    changeState();
                    resolve();
                } else if(this.readyState == 4 && this.status != 200) {
                    reject(this.responseText);
                }
            }
        })  
        .catch((error)=>{
            reject(err);
        })
    })
}


window.onload = async function() {
    //Set the filespath from localStorage (To ensure that the information is kept even qwhen the program reloads)
    filesPath = localStorage.getItem("filesPath");


    //Check wether the client should be checked for authentification on page load
    var checkAuth = JSON.parse(localStorage.getItem("staySignedIn"));
    if(checkAuth) {

        authClient()
        .then(()=>{
            //Request went great!
        })
        .catch((err)=>{
            //Things didnt sort out as intended
            //(This does not mean it didn't go according to plan!)
            console.log("New user info has not been fetched ", err);
        })
    }
    document.body.serverState = [];
    //load all the projects to the plrojects list
    initializeProjectList();

    const htmlEl = document.getElementsByTagName('html')[0];

    /*const toggleTheme = (theme) => {
        htmlEl.dataset.theme = theme;
    }*/
    //Set the correct profile photo path
    if(localStorage.getItem("signedIn")) {
        signedIn = JSON.parse(localStorage.getItem("signedIn"));

        //Also, set the correct color theme, since we now know what preferences
        //The user has

        //Light theme is disabled, so if by any odd chance localStorage is
        //messed up, dark theme will be selected no matter what
        setTheme(1);

        //DISABLED
        /*
        if(localStorage.getItem("theme") == "light") {
            setTheme(0);
        } else if(localStorage.getItem("theme") == "dark") {
            setTheme(1);
        } else {
            setTheme(2);
        }
        */
    }
        if(signedIn == true) {

            //Set the three dots next to the pfp to a cogwheel
            var el = document.querySelector("#user-container > div > i");
            el.innerHTML = "settings";


            //Sign in the client on the server as well

            //Check for dev mode
            var ext = localStorage.getItem("pfpExtension");
            var dev;
            try {
                dev = JSON.parse(localStorage.getItem("userInfo"))[1][0].dev;
            } catch (error) {
                dev = false;
            }
            if(dev == true) {
                document.body.developerMode = true;
                enableDevMode();
            }

            var pos = JSON.parse(localStorage.getItem("pfpPos"));
            var Xpos = pos[0];
            var Ypos = pos[1];
            var size = pos[2];
            var img = document.getElementById("profile-photo-image");
            img.style.transform = "translateX(" + Xpos + "%) translateY(" + Ypos + "%) scale(" + size + ")";
            var parsed = JSON.parse(localStorage.getItem("userInfo"));
            if(parsed[1][0].imagedata) {
                img.src = parsed[1][0].imagedata;
            } else {

                
                if(ext == null) {
                    var imgPath = path.join(__dirname,"internalResources", "images", "default.png");
                } else {
                    var imgPath;
                    
                    if(isPackaged) {
                        imgPath = path.join(path.dirname(__dirname), "extraResources",  "data", "programData", "profilePics", "user" + ext);
                    } else {
                        imgPath = path.join(__dirname, "extraResources",  "data", "programData", "profilePics", "user" + ext);
                        
                    }
                    img.src = imgPath;
                }
                
            }
        } else if(signedIn == false) {
            //The client is not signed in
            //Set the three dots next to the pfp to a sign in icon
            var el = document.querySelector("#user-container > div > i");
            el.innerHTML = "login";
        }
    //If not already set up, set up the localStorage
    var storage = window.localStorage;
    if(!storage.signedIn) {
        localStorage.setItem("theme", "dark");
        localStorage.setItem("signedIn", false);
        localStorage.setItem("firstTime", true);
        signedIn = false;
        firstTime = true;
    } else {
        localStorage.setItem("firstTime", "false");
    }

    signedIn = storage.signedIn;
    firstTime = storage.firstTime;


    var title = document.getElementById("main-title");
    if(firstTime == "true") {
        title.innerHTML = "Welcome!";
    } else if(firstTime == "false") {
        title.innerHTML = "Welcome back"
    }
    
    if(signedIn == "false" && firstTime == "true") {
        title.innerHTML = title.innerHTML + " You're not signed in.";
    } else if(signedIn == "false" && firstTime != "true") {
        title.innerHTML = title.innerHTML + ". You're not signed in.";
    }

    if(signedIn == "false") {

        //Disable all the buttons
        var butts = document.getElementById("actions-container").childNodes;
        for(let i = 0; i < butts.length; i++) {
            if(i%2 != 0) {
                var tag = butts[i].childNodes[2].innerHTML;
                console.log(tag)
                if(tag != "Developer start" && tag != "Quit") {
                    butts[i].disabled = true;
                }
            }
        }

    } else if(signedIn == "true") {
        var name = JSON.parse(localStorage.getItem("userInfo"))[1][0].name.split(" ")[0];
        title.innerHTML = title.innerHTML + ", <span style='text-transform: capitalize'>" + name + ".</span>";
    }


    //Trigger code on window load
    /*var canv = document.getElementById("user-canvas");
    var ctx = canv.getContext("2d");
    ctx.beginPath();
    ctx.arc(28,28,28,0.35*Math.PI,2.1*Math.PI);
    ctx.lineWidth = 2;
    ctx.stroke();*/


    var el = document.getElementById("pfp");
    infoOnHover(el, "User settings");

    var el = document.getElementById("notifications-button");
    infoOnHover(el, "Notifications");

    var el = document.getElementById("new-project");
    infoOnHover(el, "Create a new slideshow");

    var el = document.getElementById("open-project");
    infoOnHover(el, "Open a local slideshow project");

    var el = document.getElementById("open-server");
    infoOnHover(el, "Open a remote slideshow project");

    var el = document.getElementById("live-edit");
    infoOnHover(el, "Edit a slideshow while it is being displayed");

    var el = document.getElementById("developer-start");
    infoOnHover(el, "Trump likes the big pp");



    //Add ripple on click effect to all the desired elements
    var buttons = document.getElementsByClassName("ripple-element");
    var x;
    for(x of buttons) {
        appendRipple(x);
    }
}


function appendRipple(el) {
    if(!el.hasRipple) {

        el.hasRipple = true;
        el.addEventListener("click", function(e) {
            var ripple = document.createElement("div");
            ripple.setAttribute("class", "ripple-effect-circle");
            el.appendChild(ripple);

            var elStyle = window.getComputedStyle(el);
            var elHeight = elStyle.height;
            var elWidth = elStyle.width;
            var x = e.layerX + "px";
            var y = e.layerY + "px";
            ripple.style = `
                left: ` + x + `;
                top: ` + y + `;
                height: ` + elHeight + `;
                width: ` + elWidth + `;
                position: absolute;
                transform: translate(-50%, -50%);
                background-color: rgb(20,20,20);
                animation: ripple-animation 500ms ease-in-out;
                animation-fill-mode: both;
                border-radius: 100%;
                opacity: 0.5;
                pointer-events: none;
            `;
            setTimeout(function() {
                ripple.parentNode.removeChild(ripple);
            }, 500);
        })
    }
}


function infoOnHover(el, txt) {

    var closeEl = (ev) => {

    }
    
    el.addEventListener("mouseenter", function(event) {
    var mouseover = true;

    el.addEventListener ("mouseleave", function(event1) {
        mouseover = false;
        if(document.getElementsByClassName("information-popup")) {
            var popups = document.getElementsByClassName("information-popup");

            while(popups.length > 0) {
                popups[0].parentNode.removeChild(popups[0]);
            }
        }
    })

    //Had to just copy the code, because for some reason it bugged out when i tried to
    //nest everything up into a single function..
    el.addEventListener ("click", function(event1) {
        mouseover = false;
        if(document.getElementsByClassName("information-popup")) {
            var popups = document.getElementsByClassName("information-popup");

            while(popups.length > 0) {
                popups[0].parentNode.removeChild(popups[0]);
            }
        }
    })
    setTimeout(function() {
        if(mouseover == true) {
            //The mouse has hovered over the element for long enough
            var info = document.createElement("div");
            info.setAttribute("class", "information-popup smooth-shadow");
            info.innerHTML = txt;
            var element = event.target;
            var triggerElementWidth = element.offsetWidth;
            var x = element.getBoundingClientRect().left;
            var y = element.getBoundingClientRect().top;

            info.setAttribute("style", `
                height: fit-content; 
                width: fit-content;
                background-color: #0a0d10;
                border-radius: 0.5rem;
                padding: 1rem;
                color: white;
                position: absolute;
                z-index: 110;
                left: ` + Math.round(x + triggerElementWidth/2) + `px;
                top: ` + y + `px;
                transform: translateX(-50%) translateY(-110%);
                animation: fade-in 200ms ease-in-out;
                opacity: 0.95;
            `);
            document.body.appendChild(info);
            
            var elWidth = info.offsetWidth;
            if(x-elWidth/2 < 0 || x+elWidth/2 > window.innerWidth) {
                if(x-elWidth/2 < 0) {
                    var offset = x-elWidth/2
                    info.style.left = 10 + elWidth/2 + "px";
                } else if(x+elWidth/2 > window.innerWidth) {
                    var offset = x+elWidth/2 - window.innerWidth;
                    info.style.right = "0"

                }
            }

        }
    }, 200)
})
}



function userSettings() {
    var page = menu("user");
    
    var header = page.childNodes[0];
    header.style.position = "relative";

    var userWrapper = document.createElement("div");    
    userWrapper.setAttribute("class", "user-header-wrapper");

    var user = document.createElement("div");
    user.setAttribute("class", "profile-header");
    user.setAttribute("style", `
        width: fit-content;
        height: fit-content;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 1rem;
        animation-fill-mode: forwards;
    `);

    var pfp = document.createElement("div");
    user.appendChild(pfp);
    pfp.setAttribute("id", "pfp");
    pfp.setAttribute("class", "smooth-shadow");
    pfp.setAttribute("style", `
        height: 5rem;
        width: 5rem;
        border-radius: 100%;
        display: inline-block;
    `);

    var img = document.createElement("img");


    var ext = localStorage.getItem("pfpExtension");

    var signedIn = localStorage.getItem("signedIn");

    
    
    if(signedIn == "true" && ext != null) {
        
            var parsed = JSON.parse(localStorage.getItem("userInfo"));
            if(parsed[1][0].imagedata) {

                img.setAttribute("src", parsed[1][0].imagedata);
            } else {

                
                
                var imgPath;
                console.log(ext);
                if(isPackaged) {
                    imgPath = path.join(path.dirname(__dirname), "extraResources",  "data", "programData", "profilePics", "user" + ext);
                } else {
                    imgPath = path.join(__dirname, "extraResources",  "data", "programData", "profilePics", "user" + ext);
                }
                img.setAttribute("src", imgPath);
                
            }

        img.setAttribute("style", `
        height: 5rem;
        width: auto;
        `);        
    } else {
        //User is either not signed in, or there is no profile picture data stored
        var imgPath = path.join(__dirname,"internalResources", "images", "default.png");
        img.setAttribute("src",imgPath)
        img.setAttribute("style", `
        height: 5rem;
        width: auto;
        `)
    }

        pfp.appendChild(img)


    header.appendChild(userWrapper);

    var h1 = h1El();
    if(signedIn == "false") {
        h1.innerHTML = "You're not signed in";
    } else {
        userWrapper.parentNode.removeChild(userWrapper);
        console.log(localStorage.getItem("userInfo"))
        userScreen(JSON.parse(localStorage.getItem("userInfo")), header, true);
        return;
    }
    h1.setAttribute("style", `
        display: inline-block;
        line-height: 5rem;
        color: var(--title-color);
        vertical-align: top;
        margin: 0;
        font-weight: lighter;
        margin-left: 1rem;
        opacity: 0;
        animation: slide-right 700ms ease-in-out 0.2s;
        animation-fill-mode: forwards;
    `)
    user.appendChild(h1);
    userWrapper.appendChild(user)

    var cont = document.createElement("div");
    cont.setAttribute("id", "login-container");
    cont.setAttribute("style", `
        padding: 0 0 1rem;
        position: relative;
        height: 75%;
        width: 100%;
    `);

    page.appendChild(cont);

    if(signedIn != "true") {

        var field = document.createElement("div");
        cont.appendChild(field);
        field.setAttribute("style", `
            height: fit-content; 
            width: fit-content;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
            animation: fade-in 300ms ease-out 0.2s both;
        `)


        var form = document.createElement("form");
        form.setAttribute("class", "login-form");

        var usrName = document.createElement("input");
        usrName.setAttribute("type", "username");
        usrName.setAttribute("placeholder", "Email");
        usrName.style.backgroundColor = "var(--main-button-color)";
        usrName.style.color = "var(--title-color)";


        setTimeout(function() {
            usrName.focus();

        }, 10);
        var pswrd = document.createElement("input");
        pswrd.setAttribute("type", "password");
        pswrd.setAttribute("placeholder", "Password");
        pswrd.style.backgroundColor = "var(--main-button-color)";
        pswrd.style.color = "var(--paragraph-color)";


        form.appendChild(usrName);
        form.appendChild(pswrd);

        var wr = document.createElement("div");
        wr.style = `
            display: block;
            margin-top: 0rem;
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;
        `
        var staySignedIn = document.createElement("input");
        staySignedIn.type = "checkbox";
        staySignedIn.id = "stay-signed-in"
        wr.appendChild(staySignedIn);
        form.appendChild(wr);
        staySignedIn.className = "launcher-checkbox";
        var lab = document.createElement("label");
        lab.setAttribute("for", "stay-signed-in");
        lab.innerHTML = "Stay signed in";
        lab.style = `
            color: var(--title-color);
            display: inline-block;
            margin: 0;
            vertical-align: top;
            margin-left: 0.5rem;
            font-weight: lighter;
            opacity: 0.6;
        `
        wr.appendChild(lab);

        var logIn = document.createElement("button");
        logIn.setAttribute("class", "smooth-shadow fd-button login-button");
        logIn.setAttribute("style", `
            width: 6.7rem;
            height: 2.3rem;
            transition: all 300ms ease-in-out;
            display: inline-block;
        `);
        var ico = document.createElement("i");
        ico.setAttribute("class", "material-icons");
        ico.innerHTML = "login";
        ico.setAttribute("style", `
            line-height: 2.3rem;
            color: var(--paragraph-color);
        `);
        var p = pEl();
        p.innerHTML = "Sign in";
        p.setAttribute("style", `
            line-height: 2.3rem;
            color: var(--paragraph-color);
            margin-left: 0.5rem;
        `);
        logIn.appendChild(ico);
        logIn.appendChild(p); 
        form.appendChild(logIn);

        var register = document.createElement("p");
        register.innerHTML = "Or register";
        register.style = `
            height: 2.3rem;
            line-height: 2.3rem;
            width: fit-content;
            display: inline-block;
            margin-left: 1rem;
            color: var(--paragraph-color);
            opacity: 0.8;
            cursor: pointer;
        `;
        register.className = "register-user-link"
        form.appendChild(register);

        var devSignIn = document.createElement("button");
        devSignIn.className = "fd-settings-button smooth-shadow";
        devSignIn.style = `
            position: absolute;
            bottom: 2rem;
            right: 1rem;
        `;
        devSignIn.innerHTML = "Dev Sign-In"
        cont.appendChild(devSignIn);
        devSignIn.setAttribute("onclick", "developerSignIn()");



        var signInClient = (e)=> {
            e.preventDefault(); 
            if(pswrd.value.trim().length == 0 || usrName.value.trim().length == 0) {
                logIn.style.animation = "wrong-shake 100ms 3";
                setTimeout(function() {
                    logIn.style.animation = "";
                }, 300)
                return;
            }

            logIn.setAttribute("style", `
                position: relative;
                width: 2.3rem;
                height: 2.3rem;
                transition: all 300ms ease-in-out;
                overflow: hidden;
                padding: 0;
            `);
            var wheel = loaderWheel();
            wheel.setAttribute("style", "position: absolute; display: block; animation: fade-in 200ms ease-in-out; top: 0.17rem; left: 0.17rem; transform: scale(0.4);");
            logIn.innerHTML = "";
            logIn.appendChild(wheel);
            logIn.disabled = true;

            //Make server request

            var xhr = new XMLHttpRequest();
            //xhr.open("POST", "http://80.213.230.181:3000/auth");
            xhr.open("POST", serverAddress + "/auth");
            
            //Should the client stay signed in?
            var stayAuthed = staySignedIn.checked;
            localStorage.setItem("staySignedIn", JSON.stringify(stayAuthed));

            var pass = pswrd.value;
            var usrname = usrName.value;
            localStorage.setItem("tempPass", pass);

            var formData = new FormData();
            formData.append("user", usrname);
            formData.append("password", pass);


            xhr.send(formData);
            xhr.onreadystatechange = function() {
                if(this.status == 200 && this.readyState == 4) {

                    var dat = JSON.parse(this.responseText);
                    if(dat[0] == "OK") {
                        setTimeout(function() {
                            //Transition everything

                            //Save the password into the OS keychain
                            if(JSON.parse(localStorage.getItem("staySignedIn"))) {

                                keytar.setPassword("infoscreen", usrname, localStorage.getItem("tempPass"))
                                .then(()=>{
                                    //OK
                                    //Clear the temp pass cookie for safety reasons
                                    localStorage.removeItem("tempPass");
                                })
                                .catch((error)=>{
                                    showNotification("Could not save authentication details.");
                                    localStorage.removeItem("tempPass");
                                })
                            } else {
                                //Clear the temp pass cookie for safety reasons
                                localStorage.removeItem("tempPass");
                            }


                            var subheader = document.getElementsByClassName("user-header-wrapper")[0];
                            var loginForm = document.getElementsByClassName("login-form")[0];
                            subheader.style.animation = "slide-out 300ms ease-in-out";
                            header.style.animationFillMode = "forwards";
                            loginForm.style.animation = "slide-out 300ms ease-in-out";
                            loginForm.style.animationFillMode = "forwards";
                            setTimeout(function() {
                                subheader.parentNode.removeChild(subheader);
                                loginForm.parentNode.removeChild(loginForm);
                                var loginCont = document.getElementById("login-container");
                                loginCont.parentNode.removeChild(loginCont);
                                localStorage.setItem("signedIn", "true");
                                localStorage.setItem("pfpPos", JSON.stringify([-50,0,1]));
                                
                                console.log(dat);
                                //Update the main launcher screen to reflect the localStorage values
                                localStorage.setItem("userInfo", JSON.stringify(dat));

                                var state = {upToDate: true, errorType: null};
                                document.body.serverState.push(state);

                                //If the user is a developer, enable the developer mode!
                                if(dat[1][0].dev == true) {
                                    document.body.developerMode = true;
                                    enableDevMode();
                                } else {
                                    document.body.developerMode = false;
                                }


                                userScreen(dat, header, true);
                                changeState();

                            }, 300)

                        }, 500);
                    } else if(dat[0] == "INCORRECT") {
                        var loginForm = document.getElementsByClassName("login-form")[0];
                        loginForm.style.animation = "wrong-shake 100ms 3";
                    } else if(dat[0] == "USER ALREADY SIGNED IN") {
                        alert("Whoah, slow down. The request has been cancelled.");
                        return;
                    }

                } else if(this.readyState == 4 && this.status != 200){
                    showNotification("Could not sign in.");
                    //The request didn't complete successfully.
                    logIn.style = `
                        width: 6.7rem;
                        height: 2.3rem;
                        transition: all 300ms ease-in-out;
                        display: inline-block;
                        padding: 0 1rem;
                        overflow: hidden;
                    `;
                    logIn.innerHTML = "";

                    var ico = document.createElement("i");
                    ico.className = "material-icons";
                    ico.innerHTML = "login";
                    logIn.appendChild(ico)
                    ico.style = `
                        line-height: 2.3rem;
                        color: var(--paragraph-color);
                    `


                    var p = document.createElement("p");
                    p.innerHTML = "Sign in";
                    logIn.appendChild(p);
                    p.style = `  
                        line-height: 2.3rem;
                        color: var(--paragraph-color);
                        margin-left: 0.5rem;
                    `;
                    logIn.disabled = false;
                }
            }


        }


        logIn.addEventListener("click", signInClient);

        register.addEventListener("click", function(e) {
            var form = document.createElement("form");
            form.className = "login-form";
            
            var p = document.createElement("p");
            p.innerHTML = "Full name";
            var name = document.createElement("input");
            name.type = "username";
            name.placeholder = "...";

            var p1 = document.createElement("p");
            p1.innerHTML = "Email";
            var email = document.createElement("input");
            email.type = "email";
            email.placeholder = "...";

            var p2 = document.createElement("p");
            p2.innerHTML = "Password";
            var pass = document.createElement("input");
            pass.type = "password";
            pass.placeholder = "...";

            var p3 = document.createElement("p");
            p3.innerHTML = "Repeat password";
            var pass1 = document.createElement("input");
            pass1.type = "password";
            pass1.placeholder = "...";

            var register = document.createElement("button");
            register.setAttribute("class", "smooth-shadow fd-button login-button");
            register.setAttribute("style", `
                width: 6.7rem;
                height: 2.3rem;
                transition: all 300ms ease-in-out;
                display: inline-block;
            `);
            var ico = document.createElement("i");
            ico.setAttribute("class", "material-icons");
            ico.innerHTML = "login";
            ico.setAttribute("style", `
                line-height: 2.3rem;
                color: var(--paragraph-color);
            `);


            var cross = document.createElement("button");
            cross.style = `
                background: none;
                border: none;
                height: 2.3rem;
                width: fit-content;
                line-height: 2.3rem;
                vertical-align: top;
                color: white;
                margin-left: 0.5rem;
                cursor: pointer;
                outline: none;
            `;

            //infoOnHover(cross, "Go back");
            var crossIcon = document.createElement("i");
            crossIcon.innerHTML = "close";
            crossIcon.className = "material-icons";
            cross.appendChild(crossIcon);
            crossIcon.style = `
                line-height: 2.3rem;
                font-size: 1.3rem;
                opacity: 0.5;
            `;

            cross.addEventListener("click", (e)=>{
                e.preventDefault();
                var parent = e.target.closest(".login-form");
                parent.parentNode.removeChild(parent);
                document.getElementsByClassName("login-form")[0].style.display = "initial";
                
            })

            var text = pEl();
            text.innerHTML = "Register ";
            text.setAttribute("style", `
                line-height: 2.3rem;
                color: var(--paragraph-color);
                margin-left: 0.5rem;
            `);
            register.appendChild(ico);
            register.appendChild(text); 
            
            register.addEventListener("click", function(e) {        
                e.preventDefault();

                if(pass.value == pass1.value && pass.value.trim().length > 6) {
                    //Do some stuff with the server to create a new user...


                    var usrName = name.value;
                    var mail = email.value;
                    var password = pass.value;
                    
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "https://shrouded-wave-54128.herokuapp.com/register");

                    var formData = new FormData();
                    formData.append("user", usrName);
                    formData.append("password", password);
                    formData.append("email", mail);
                    
                    xhr.send(formData);

                    xhr.onreadystatechange = function() {
                        if(this.status == 200 && this.readyState == 4) {
                            //Successful request
                            var dat = JSON.parse(this.responseText);
                            console.log(dat);
                            if(dat[0] == "OK") {
                                //All is good :)

                                //Make the user sign in
                                var parent = e.target.closest(".login-form");
                                parent.parentNode.removeChild(parent);
                                document.getElementsByClassName("login-form")[0].style.display = "initial";
                            } else {
                                console.log(dat);
                            }
                        }
                    }


                } else {
                    if(!document.getElementById("warning")) {

                        var t = document.createElement("p");
                        t.id ="warning";
                        t.innerHTML = "The passwords must be matching, and have a length of more than 6 characters.";
                        t.style = `
                            animation: fade-in 200ms ease-out both;
                            line-height: 1rem;
                            width: fit-content;
                            max-width: 30rem;
                            text-align: center;
                            position: absolute;
                            bottom: 50%;
                            left: 50%;
                            background: var(--secondary-color);
                            padding: 1rem;
                            border-radius: 0.25rem;
                            transform: translate(-50%, -50%);
                        `;
                        t.className = "smooth-shadow";
                        document.getElementById("login-container").appendChild(t);
                        setTimeout(()=>{
                            t.parentNode.removeChild(t);
                        }, 5000);
                    }
                }

            })


            form.appendChild(p);
            form.appendChild(name);
            form.appendChild(p1);
            form.appendChild(email);
            form.appendChild(p2);
            form.appendChild(pass);
            form.appendChild(p3);
            form.appendChild(pass1);
            form.appendChild(register);
            form.appendChild(cross);
            var parent = document.getElementsByClassName("login-form")[0].parentNode;
            
            document.getElementsByClassName("login-form")[0].style.display = "none";
            //document.getElementsByClassName("login-form")[0].parentNode.removeChild(document.getElementsByClassName("login-form")[0])





            parent.appendChild(form);
            form.style.animation = "fade-in 300ms ease-out 0.1s both";
        })

        field.appendChild(form);
        cont.appendChild(field);

    }

}


function pEl() {
    var el = document.createElement("p");
    return el;
}

function h1El() {
    var el = document.createElement("h1");
    return el;
}

function userScreen(info, header, signIn) {
    var signedIn = false;
    if(signIn) {
        localStorage.setItem("signedIn", "true");
        signedIn = true;
    }


    var userWrapper = document.createElement("div");
    userWrapper.setAttribute("class", "user-header-wrapper");

    var user = document.createElement("div");
    user.setAttribute("class", "profile-header");
    user.setAttribute("style", `
        width: fit-content;
        height: fit-content;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 1rem;
        animation-fill-mode: forwards;
    `);

    var pfp = document.createElement("div");





    user.appendChild(pfp);
    pfp.setAttribute("id", "pfp");
    pfp.setAttribute("class", "smooth-shadow");
    pfp.setAttribute("style", `
        height: 80px;
        width: 80px;
        border-radius: 100%;
        display: inline-block;
    `);

    var img = document.createElement("img");
    var imgPath
    var ext = localStorage.getItem("pfpExtension");
    if(ext == null) {
        imgPath = path.join(__dirname,"internalResources", "images", "default.png");
    } else {
        if(isPackaged) {
            imgPath = path.join(path.dirname(__dirname),"extraResources",  "data", "programData", "profilePics", "user" + ext);
        } else {
            imgPath = path.join(__dirname,"extraResources",  "data", "programData", "profilePics", "user" + ext);
        }
    }

    var parsed = JSON.parse(localStorage.getItem("userInfo"))[1][0]
    if(parsed.imagedata) {
        img.setAttribute("src", parsed.imagedata)
    } else {

        
        img.setAttribute("src", imgPath);

        
    }
    img.setAttribute("style", `
    position: absolute;
    height: 80px;
    width: auto;
    margin-left: 50%;
    transform: translateX(-50%);
    `);
    pfp.appendChild(img);
    /*
    var pos = JSON.parse(localStorage.getItem("pfpPos"));
    
    var Xpos = pos[0];
    var Ypos = pos[1];
    var size = pos[2];
    img.style.transform = "translateX(" + Xpos + "%) translateY(" + Ypos + "%) scale(" + size + ")";
*/
    /*var canv = document.createElement("canvas");
    canv.setAttribute("height", "81px");
    canv.setAttribute("width", "81px");
    canv.setAttribute("style", `
        z-index: 0;
    `)
    var ctx = canv.getContext("2d");

    ctx.arc(40,40,38,0.35*Math.PI,2.1*Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffffff"
    ctx.stroke();

    pfp.appendChild(canv);
    canv.style.animation = "full-rotate 30s linear infinite"
*/
    var side = document.createElement("div");
    side.className = "wrapper";

    var center = document.createElement("div");
    center.className = "center";

    var h1 = h1El();
    if(signedIn == "false") {
        h1.innerHTML = "You're not signed in";
    } else {
        if(info) {
            h1.innerHTML = info[1][0].name;
        }
    }
    h1.setAttribute("style", `

    `);
    user.appendChild(side);
    side.appendChild(center);
    center.appendChild(h1);
    userWrapper.appendChild(user)
    header.appendChild(userWrapper);
    userWrapper.style.animation = "slide-in 300ms ease-in-out";


    
    var menu = header.parentNode;
    var content = document.createElement("div");
    content.style.animation = "slide-in 300ms ease-in-out 0.3s";
    content.style.animationFillMode = "backwards";
    content.setAttribute("class", "settings-content");
    menu.appendChild(content);
    
    
    var header = document.getElementsByClassName("profile-header")[0];


    var signOut = document.createElement("button");
    signOut.className = "sign-out-button smooth-shadow";
    signOut.innerHTML = "Sign out";
    signOut.addEventListener("click", function(e) {
        //Update the button
        e.target.innerHTML = "Signing out";
        e.target.disabled = true;

        //Let the server know that we are signed out
        var xhr = new XMLHttpRequest();
        xhr.open("GET", serverAddress + "/signOut");
        xhr.send();
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200) {
                //OK
                localStorage.setItem("signedIn", "false");
                localStorage.setItem("userInfo", "");
                changeState();
                location.reload();
            } else if(this.readyState == 4 && this.status != 200) {
                showNotification("Could not perform a clean signout. Sign in to the user will be restricted in this client.");
                localStorage.clear();

                setTimeout(()=>{
                    location.reload();
                }, 5000)
                //localStorage.setItem("signedIn", "false");
            }
        }


    });//CHECKPOINT

    header.querySelector(".wrapper > .center").appendChild(signOut);
    infoOnHover(signOut, "Signs you out");


    var changePfp = createSettingsButton();
    changePfp.innerHTML = "Change profile picture";
    changePfp.addEventListener("click", function() {
        profilePhoto(content);
    })
    var subscription = createSettingsButton();
    subscription.innerHTML = "View your subscription";

    var updates = createSettingsButton();
    updates.innerHTML = "Check for updates";

    var feedbackButt = createSettingsButton();
    feedbackButt.innerHTML = "Send your feedback";
    feedbackButt.addEventListener("click", function() {
        feedback(content);

    })

    var info = createSettingsButton();
    info.innerHTML = "User information";
    info.addEventListener("click", function() {
        userInfo(content);
    });

    var privacy = createSettingsButton();
    privacy.innerHTML = "Privacy";
    privacy.addEventListener("click", function() {
        privacyMenu(content);
    });

    var themes = createSettingsButton();
    themes.innerHTML = "Themes";
    themes.addEventListener("click", function() {
        Themes(content);
    })

    var aboutButt = createSettingsButton();
    aboutButt.innerHTML = "About";
    aboutButt.addEventListener("click", function() {
        about(content);
    });

    var feedBackLog;
    if(document.body.developerMode) {
        feedBackLog = createSettingsButton();
        feedBackLog.innerHTML = "Feedback log";
        feedBackLog.addEventListener("click", ()=>{
            fetchFeedBackLog(content);
        });
    }
    content.appendChild(changePfp);
    content.appendChild(subscription);
    content.appendChild(updates);
    content.appendChild(feedbackButt);
    content.appendChild(info);
    content.appendChild(privacy);
    content.appendChild(themes);
    content.appendChild(aboutButt);
    if(feedBackLog) {
        content.appendChild(feedBackLog);
    }
}


function createSettingsButton() {
        
    var button = document.createElement("button");
    button.setAttribute("class", "fd-settings-button smooth-shadow");
    button.setAttribute("style", `
        width: fit-content;
        margin-right: 1rem;
        margin-bottom: 1rem;
    `);
    button.classList.add("ripple-element");
    appendRipple(button);
    
    return button;
}




function divider() {
    var el = document.createElement("div");
    el.setAttribute("id", "divider-line");
    el.setAttribute("style", `
        width: 40rem;
        height: 0.095rem;
        background-color: var(--main-button-color);
        margin-top: 1rem;
        margin-left: 50%;
        transform: translateX(-52%);
        animation: fade-in 300ms ease-in-out;
    `);
    //el.setAttribute("class", "smooth-shadow")
    return el;
}


//Update the main screen of the launcher to reflect the state of the localStorage values

function changeState() {
    //Update the project list if signed in
    var parent = document.getElementById("list");
    parent.innerHTML = "";
    initializeProjectList();

    var signedIn = localStorage.getItem("signedIn");

    if(signedIn == "true") {
    
    //Set the three dots next to the pfp to a cogwheel
    var el = document.querySelector("#user-container > div > i");
    el.innerHTML = "settings";

    firstTime = localStorage.getItem("firstTime");


    var title = document.getElementById("main-title");
    if(firstTime == "true") {
        title.innerHTML = "Welcome!";
    } else if(firstTime == "false") {
        title.innerHTML = "Welcome back";
    }
    
    var parsedData = JSON.parse(localStorage.getItem("userInfo"))[1][0];

    var name = JSON.parse(localStorage.getItem("userInfo"))[1][0].name.split(" ")[0];
    title.innerHTML = title.innerHTML + ", <span style='text-transform: capitalize'>" + name + "</span>";

        if(parsedData.imagedata) { 
            //If there is an image stored on the server, use that one
            var img = document.getElementById("profile-photo-image");
            img.src = parsedData.imagedata;

        } else {
            //If not, load a local image
            var ext = localStorage.getItem("pfpExtension");
    
            var img = document.getElementById("profile-photo-image");
    
            var pos = JSON.parse(localStorage.getItem("pfpPos"));
            var Xpos = pos[0];
            var Ypos = pos[1];
            var size = pos[2];
            img.style.transform = "translateX(" + Xpos + "%) translateY(" + Ypos + "%) scale(" + size + ")";
            var imgPath;
            if(isPackaged) {
                if(ext == null) {
                    imgPath = path.join(path.dirname(__dirname),"internalResources", "images", "default.png");
                } else {
                    imgPath = path.join(path.dirname(__dirname),"extraResources",  "data", "programData", "profilePics", "user" + ext);
                }
            } else {
                if(ext == null) {
                    imgPath = path.join(__dirname,"internalResources", "images", "default.png");
                } else {
                    imgPath = path.join(__dirname,"extraResources",  "data", "programData", "profilePics", "user" + ext);
                }
            }
            img.setAttribute("src", imgPath);

        }



        //Enable all buttons
        var butts = document.getElementById("actions-container").childNodes;
        for(let i = 0; i < butts.length; i++) {
            if(i%2 != 0) {
                if(butts[i].childNodes[2].innerHTML != "Developer start") {
                    butts[i].disabled = false;
                }
            }
        }


    } else {
        var title = document.getElementById("main-title");

        if(firstTime == "true") {
            title.innerHTML = "Welcome! You're not signed in.";
        } else if(firstTime != "true") {
            title.innerHTML = "Welcome back. You're not signed in.";
        }
    

        var img = document.getElementById("profile-photo-image");
        img.style.transform = "translateX(-50%) translateY(0) scale(1)";
        var imgPath = path.join(path.dirname(__dirname),"extraResources",  "data", "programData", "profilePics", "default.png");
        img.setAttribute("src", imgPath);

        //Disable all buttons
        var butts = document.getElementById("actions-container").childNodes;
        for(let i = 0; i < butts.length; i++) {
            if(i%2 != 0) {
                if(butts[i].childNodes[2].innerHTML != "Developer start") {
                    butts[i].disabled = true;
                }
            }
        }

        //Set the three dots next to the pfp to a sign in icon
        var el = document.querySelector("#user-container > div > i");
        el.innerHTML = "login";
    }

}


function inputWithText(text) {
    var el = document.createElement("div");
    el.setAttribute("class", "input-field");

    var p = document.createElement("p");
    p.innerHTML = text;
    p.setAttribute("style", `
        color: var(--paragraph-color);
        margin: 0;
        display: block;
        height: 2rem;
        font-size: 1rem;
    `)

    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("style", `
        border-style: solid;
        border-width: 0 0 2px;
        border-color: var(--secondary-button-color);
        outline: none;
        height: 2rem;
        font-size: 1.5rem;
        background-color: transparent;
    `);

    el.appendChild(p);
    el.appendChild(input);

    return el;
}




//This is supposed to be used to figure out whether the program has been opened via a file or not. 
//Need to package a version to test it out on. 
/*
var data = ipcRenderer.sendSync('get-file-data')
if (data ===  null) {
    console.log("There is no file")
} else {
    // Do something with the file.
    console.log(data)
}
*/


var checking; 
ipcRenderer.on("update-handler", function(e, data) {
    //Information sent by the autoupdater system
    var root = data[0];
    var version = "0.0.0";
    var releaseNotes;
    if(root.info) {
        version = root.info.version;
    }
    var messages = [
        {title: "Update available", meta: "Click to download", importance: 2, version: version},
        {title: "New update installed", meta: "Click to apply changes", importance: 2},
        {title: "Error", meta: "Could not connect to the file provider", importance: 1},
        {title: "Checking for updates", meta: "Hang tight!", importance: 3},
        {title: "Release notes", meta: "Click to view the release notes", importance: 3}
    ]

    var checkingForUpdate = root.checking;
    var installed = root.installed;
    var newUpdate;

    //root.info.releaseNotes

    if(root.newUpdate == true) {
        newUpdate = root.newUpdate;
    } else if(root.noUpdate) {
        newUpdate = "noUpdate";
    }
    var error = root.error;

    //If root.info is included, there must be a releaseNote attached.
    //Create a notification for the release note.
    if(root.info) {
        var notif = createNotification(messages[4]);
        document.getElementById("notifications-pane").appendChild(notif);
        notif.addEventListener("click", function() {
            var modal = menu("user");
            var releaseNotes = root.info.releaseNotes;
            appendReleaseNotes(releaseNotes, modal);
        })


        if(checking) {
            console.log(checking)
            removeNotification(checking);
        }

    }

    if(newUpdate == true) {
        var notif = createNotification(messages[0]);
        notif.classList.add("new-installation")
        document.getElementById("notifications-pane").appendChild(notif);
        notif.showsProgress = false;




        function download() {
            var downloading = createNotification({importance: 2, title: "Downloading new update", meta: "Please wait"})
            document.getElementById("notifications-pane").appendChild(downloading);

            //Remove the download button
            var notif = document.getElementsByClassName("new-installation")[0]
            notif.kill();
            //notif.parentNode.removeChild(notif);
            startDownloading()
            .then(()=>{
                downloading.parentNode.removeChild(downloading);
            })
            .catch(()=>{
                downloading.parentNode.removeChild(downloading);

                var error = createNotification({importance: 1, title: "Something went wrong", meta: "Could not install the update"})
                document.getElementById("notifications-pane").appendChild(error);
            
                var notif = createNotification(messages[0]);
                notif.classList.add("new-installation")
                document.getElementById("notifications-pane").appendChild(notif);
                notif.showsProgress = false;
                notif.onclick = download;
            
            })

            
            
        }
        
        notif.onclick = download;

        if(checking) {
            removeNotification(checking);
        }
    } else if(error) {
        var notif = createNotification(messages[2]);
        document.getElementById("notifications-pane").appendChild(notif);
        if(checking) {
            removeNotification(checking);
        }
    } else if(installed) {
        var notif = createNotification(messages[1]);
        document.getElementById("notifications-pane").appendChild(notif);
        notif.onclick = function() {
            applyUpdate();
        }
        if(checking) {
            removeNotification(checking);
        }
        notif.style.cursor = "pointer";
    } else if(checkingForUpdate) {      
        checking = createNotification(messages[3]);
        document.getElementById("notifications-pane").appendChild(checking);
    } else if(newUpdate == "noUpdate") { 
        if(checking) {
            removeNotification(checking);
        }
    }

    
})

function applyUpdate() {
    ipcRenderer.send("apply-update");
}

function startDownloading() {
    return new Promise((resolve, reject) => {
        ipcRenderer.send("start-downloading-update");

        ipcRenderer.on("downloading-update", (ev, data) => {
            //Update has started downloading
            var dat = JSON.parse(data);
            console.log(dat)
            if(dat == true) {
                resolve();
            } else {
                console.log("ouiasdio")
                reject();
            }
        })
    })
}


var notificationTracker = [{severe: 0, medium: 0, mild: 0}]

function createNotification(data = {importance, title, meta, version}) {

    //Clear the "nothing to show" message
    if(document.getElementById("notifications-pane").querySelector(".nothingToShow")) {
        document.getElementById("notifications-pane").innerHTML="";
    }


    var el = document.createElement("div");
    el.className = "notification";
    
    el.kill = function() {
        this.classList.add("removing");
        setTimeout(()=>{
            removeNotification(this);
        }, 300)
    }

    el.importance = data.importance;
    var title = document.createElement("p");
    title.innerHTML = data.title;
    title.className = "title";

    var sub = document.createElement("p");
    sub.innerHTML = data.meta;
    sub.className = "meta";

    el.appendChild(title);
    el.appendChild(sub);

    var cross = document.createElement("div");
    cross.style = `
        top: 0rem;
        right: 0rem;
        color: var(--paragraph-color);
        opacity: 0.5;
        height: 1.5rem;
        width: 1.5rem;
        cursor: pointer;
        border-radius: 100%;
        position: absolute;
        z-index: 2;
    `;

    var p = document.createElement("p");
    p.innerHTML = "×";
    p.style = `
        line-height: 1.5rem;
        font-size: 2rem;
        width: 1.5rem;
        height: 1.5rem;
        text-align: center;
        margin: 0;
        transform: translate(0, 1px);
    `;
    cross.appendChild(p);
    //removeNotification(this.closest('.notification'))
    cross.addEventListener("click", function(e) {
        e.stopPropagation(); //Prevent the event from propagating into the parent event listener
        
        e.target.closest(".notification").kill();
        //removeNotification(e.target.closest('.notification'));
    });

    el.appendChild(cross);


    var ver = null;
    if(data.version) {
        ver = document.createElement("p");
        ver.class = "version";
        ver.innerHTML = data.version;
        el.appendChild(ver);
    }

    var icon = document.getElementById("notifications-button").childNodes[0];
    var notifs = notificationTracker[0];
    if(data.importance == 1) {
        notificationTracker[0].severe = notificationTracker[0].severe+1
        icon.innerHTML = "notification_important";
        el.classList.add("important");
        el.classList.add("smooth-shadow");
    } else if(data.importance == 2) {
        notificationTracker[0].medium = notificationTracker[0].medium+1
        if(notifs.severe == 0) {
            icon.innerHTML = "notifications_active";
        }
    } else if(data.importance == 3) {
        notificationTracker[0].mild = notificationTracker[0].mild+1;
        if(notifs.severe == 0 && notifs.medium == 0) {
            icon.innerHTML = "notifications";
        }
    }

    return el;
}

function removeNotification(el) {
    var parent = el.parentNode;

    //Handle the importance values
    if(el.importance == 1) {
        notificationTracker[0].severe = notificationTracker[0].severe-1;
    } else if(el.importance == 2) {
        notificationTracker[0].medium = notificationTracker[0].medium-1;
    } else if(el.importance == 3) {
        notificationTracker[0].mild = notificationTracker[0].mild-1;
    }

    var icon = document.getElementById("notifications-button").childNodes[0];
    if(notificationTracker[0].severe > 0) {
        icon.innerHTML = "notification_important";
    } else if(notificationTracker[0].severe == 0 && notificationTracker[0].medium > 0) {
        icon.innerHTML = "notifications_active";
    } else if(notificationTracker[0].severe == 0 && notificationTracker[0].medium == 0 && notificationTracker[0].mild > 0) {
        icon.innerHTML = "notifications";
    } else {
        icon.innerHTML = "notifications_none";
    }
    el.parentNode.removeChild(el);

    if(parent.childNodes.length == 0) {
        var p = document.createElement("p");
        p.innerHTML = "Nothing to show";
        p.className = "nothingToShow"
        parent.appendChild(p);
    }
}
 


function exitProgram() {
    //This is for when the quit button is pressed in the bottom left corner of the launcher

    //Update the quit button
    var butt = document.querySelector("#quit-button");
    butt.getElementsByTagName("p")[0].innerHTML = "Quitting";

    if(!JSON.parse(localStorage.getItem("staySignedIn"))) {
        //The client should not be kept signed in on this user.
        signOutClient()
        .then(()=>{
            //Close the program gracefully
            ipcRenderer.send("closeLauncher", true);
        })
        .catch(()=>{
            //The sign out couldnt be performed as expected. Do something else
            ipcRenderer.send("closeLauncher", true);
        })
    } else {
        ipcRenderer.send("closeLauncher", true);
    }
}



function appendReleaseNotes(rN, menu) {

    var header = menu.querySelector(".header");
    var h1 = document.createElement("h1");
    h1.style = `
        margin: 0;
        height: 100%;
        width: fit-content;
        margin-left: 1rem;
        line-height: 10rem;
    `
    h1.innerHTML = "Release Notes";
    header.appendChild(h1);

    var cont = document.createElement("div");
    cont.style = `
        width: 100%;
        height: fit-content;
        max-height: 490px;
        overflow-y: auto;
    `
    var p = document.createElement("p");
    p.innerHTML = rN;
    p.style = `
        line-height: 1rem;
        margin: 1rem 0 0 1rem;
    `
    cont.appendChild(p);
    menu.appendChild(cont)

    menu.querySelector(".back-button").style.right = "1rem";
    menu.querySelector(".back-button").style.left = "auto";
    //menu.style.overflowY = "auto";

    //Find any interactive elements, and give them interactivity
    
    //Find info box elements
    var els = document.getElementsByClassName("info-circle");
    var x;

    for(x of els) {
        infoBox(x, x.getAttribute("metaMessage"));

        //NEW FEATURE IN THE RELEASE NOTE PARSER\\
        // <div class="info-circle" metaMessage="Message to be showed in a info box here :))">?</div>
    }
}



ipcRenderer.on("download-progress", function(progObj) {
    console.log(progObj);
/*
    if(document.getElementsByClassName("new-installation")[0]) {
        var parent = document.getElementsByClassName("new-installation")[0];
        if(!parent.showsProgress) {
            parent.showsProgress = true;

            var content = parent.getElementsByTagName("p");
            content[1].parentNode.removeChild(content[1]);
            content[2].parentNode.removeChild(content[2]);


            var progCont = document.createElement("div");
            progCont.className = "download-progress-bar-container";
            
            var progBar = document.createElement("div");
            progBar.className = "progress-bar";
            progCont.appendChild(progBar);

            var percent = document.createElement("p");
            percent.style = `
                display: block;
                color: var(--paragraph-color);
                margin: 0;
            `;
            percent.innerHTML = "Loading...";
            progCont.appendChild(percent);

            parent.appendChild(progCont);
        }
    }
*/
})

function debugDownloadBar() {
    
    if(document.getElementsByClassName("new-installation")[0]) {
        var parent = document.getElementsByClassName("new-installation")[0];
        if(!parent.showsProgress) {
            parent.showsProgress = true;

            var content = parent.getElementsByTagName("p");
            content[1].parentNode.removeChild(content[1]);
            content[2].parentNode.removeChild(content[2]);


            var progCont = document.createElement("div");
            progCont.className = "download-progress-bar-container";
            
            var progBar = document.createElement("div");
            progBar.className = "progress-bar";
            progCont.appendChild(progBar);

            var percent = document.createElement("p");
            percent.style = `
                display: block;
                color: var(--paragraph-color);
                margin: 0;
            `;
            percent.innerHTML = "Loading...";
            progCont.appendChild(percent);

            parent.appendChild(progCont);
        }
    }
}
/*
setTimeout(function() {
    debugDownloadBar();
}, 1000)*/

function showChangeLog() {
    ipcRenderer.send("show-changelog");
}

if(!isPackaged) {
    showChangeLog();
}

function executeCode(ev) {
    if(ev.key == "Enter") {
        var code = ev.target.value;
        eval(code);
    }
}

function toggleDevMenu(e) {
    var createDevMenu = () => {
        var menu = document.createElement("div");
        menu.id = "developer-menu";
        menu.className = "smooth-shadow";

        /*
        var butt = document.createElement("button");
        butt.innerText = "Create cusom notification"
        menu.appendChild(butt);
        */

        var runCode = document.createElement("button");
        runCode.innerText = "Run code"
        menu.appendChild(runCode);
        var inp = document.createElement("input");
        runCode.appendChild(inp);
        inp.addEventListener("keyup", executeCode)

       /* var yes = document.createElement("button");
        yes.innerText = "Do something"
        menu.appendChild(yes);
        */
        var menTools = new MenuTools();
        menTools.makeUnstable(menu, "hide");

        e.target.closest(".bottom-right-developer-container").querySelector(".dev-menu-button").appendChild(menu);
    }
    if(!document.getElementById("developer-menu")) {
        createDevMenu();
    }
    setTimeout(()=>{

        var menu = document.getElementById("developer-menu");
        if(!menu.classList.contains("show")) {
            menu.classList.add("show"); 
        }
    }, 50)


}


function enableDevMode() {

    var startDevving = () => {
        var bottomR = document.createElement("div");
        bottomR.className = "bottom-right-developer-container";
        document.body.appendChild(bottomR);

        var devMenu = document.createElement("button");
        devMenu.className = "dev-menu-button";
        var ico = document.createElement("i");
        ico.className = "material-icons";
        ico.innerText = "more_horiz";
        devMenu.appendChild(ico);
        bottomR.appendChild(devMenu);
        devMenu.addEventListener("click", toggleDevMenu);

        document.getElementById("developer-start").style.display = "initial";
        var p = document.createElement("p");
        p.innerText = "DEVELOPER MODE";
        bottomR.appendChild(p);


    }

    if(document.body.developerMode) {
        startDevving();
        ipcRenderer.send("user-is-developer", true);
    } else {
        var error = new Error("Cannot start developer mode when the user isn't a developer");
        console.log(error);
    }

}

function fetchFeedBackLog(parent){


    //Create the menu in the launcher
    if(document.getElementById("settings-wrapper")) {
        var el = document.getElementById("settings-wrapper");
        if(el.getAttribute("name") == "feedback-log") {
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
    wrapper.setAttribute("name", "feedback-log");
    
    parent.appendChild(wrapper);
    
    //Create the list
    var box = document.createElement("div");
    box.style = `
        height: fit-content;
        min-height: 7rem;
        width: 70%;
        margin: auto;
        background-color: var(--secondary-button-color);
        border-radius: 0.5rem;
        padding: 0.5rem;
        position: relative;
    `;
    box.className = "feedback-list"; //smooth-shadow ?

    var loaderCont = document.createElement("div");
    loaderCont.style = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0.7);
        height: 5rem;
        width: 5rem;
    `;

    var loader = loaderWheel();
    loader.style.verticalAlign = "top";
    loaderCont.appendChild(loader);
    box.appendChild(loaderCont);    

    wrapper.appendChild(box);

    //Reach out to the server
    var xhr = new XMLHttpRequest();
    xhr.open("GET", serverAddress + "/feedBackLogs");
    xhr.send();
    xhr.timeout = 10000;
    xhr.onreadystatechange = async function() {
        if(this.readyState == 4 && this.status == 200) {
            //Successful request
            console.log("OK")
            var res;
            try {
                res = JSON.parse(this.responseText);
            } catch (error) {

            }
            loaderCont.style.animation = "fade-out 200ms ease-in-out";
            setTimeout(()=>{
                try {
                    loaderCont.parentNode.removeChild(loaderCont);
                } catch (error) {
                    
                }
                
                if(res[0] == "OK") {

                    var entries = res[1];
                    var x;
                    console.log(entries);
                    for(x of entries) {
                        var el = createFeedbackEntry(x.subject, x.email, x.body);
                        box.appendChild(el);

                        //Make it clickable

                        el.addEventListener("click", (e)=>{
                            var tar = e.target.closest(".entry");
                            var title = tar.getElementsByTagName("p")[0].innerHTML;
                            var email = tar.getElementsByTagName("p")[1].innerHTML;
                            var body = tar.getElementsByTagName("p")[2].innerHTML;

                            var pops = document.getElementsByClassName("feedback-popup");
                            if(pops[0]) {
                                var x;
                                for(x of pops) {
                                    x.parentNode.removeChild(x);
                                }
                            }

                            var pop = document.createElement("div");
                            pop.className = "feedback-popup smooth-shadow";
                            
                            var close = document.createElement("button");
                            var ico = document.createElement("i");
                            ico.className = "material-icons";
                            ico.innerHTML = "close";
                            close.appendChild(ico);

                            close.addEventListener("click", (e)=>{
                                var el = e.target.closest(".feedback-popup");
                                el.parentNode.removeChild(el);
                            })

                            pop.appendChild(close);


                            var p = document.createElement("p");
                            p.innerHTML = title;
                            pop.appendChild(p);

                            var p = document.createElement("p");
                            p.innerHTML = email;
                            pop.appendChild(p);

                            var div = document.createElement("div");
                            div.style = `
                                width: 90%;
                                height: 1px;
                                background-color: rgba(200,200,200,0.5);
                                margin-bottom: 0.5rem;
                            `;
                            pop.appendChild(div);

                            var p = document.createElement("p");
                            p.innerHTML = body;
                            pop.appendChild(p);

                            document.body.appendChild(pop);

                        })

                    }
                } else if(res[0] == "ERROR") {
                    box.innerHTML = "";

                    //Display error message
                    console.log(JSON.parse(this.responseText));
                    var p = document.createElement("p");
                    p.style = `
                        position: absolute;
                        margin: 0;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        line-height: 1rem;
                        text-align: center;
                    `
                    p.innerHTML = res[0] + " <br><span style='opacity: 0.5; font-size: 0.8rem;'>" + res[1] + "</span>";
            
            
                    box.appendChild(p);
                }
                    

            }, 200);
        } else if (this.readyState == 4 && this.status != 200){
            
            loaderCont.style.animation = "fade-out 200ms ease-in-out";
            var x = await sleep(200)
            try {
                loaderCont.parentNode.removeChild(loaderCont);
            } catch (error) {
                
            }

            var p = document.createElement("p");
            var p = document.createElement("p");
            p.style = `
                position: absolute;
                margin: 0;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                line-height: 1rem;
                text-align: center;
            `
            p.innerHTML = "Could not load the content";

            box.appendChild(p);
        }
    }

    xhr.ontimeout = async()=>{
        loaderCont.style.animation = "fade-out 200ms ease-in-out";
        var x = await sleep(200)
        try {
            loaderCont.parentNode.removeChild(loaderCont);
        } catch (error) {
            
        }
        box.innerHTML = "";


        var p = document.createElement("p");
        p.style = `
            position: absolute;
            margin: 0;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            line-height: 1rem;
            text-align: center;
        `
        p.innerHTML = "Request timed out <br><span style='opacity: 0.5; font-size: 0.8rem;'>Error Code #0001</span>";


        box.appendChild(p);
    }
}

function createFeedbackEntry(title, email, body) {
    var el = document.createElement("div");
    el.className = "entry";
    var t = document.createElement("p");
    t.className = "title";
    t.innerHTML = title;

    var e = document.createElement("p");
    e.className = "email";
    e.innerHTML = email;

    var b = document.createElement("p");
    b.className = "body";
    b.innerHTML = body;

    el.appendChild(t);
    el.appendChild(e);
    el.appendChild(b);

    return el;
}

function sleep(interval) {
    return new Promise (resolve=> {
        setTimeout(()=>{
            resolve("yes");
        }, interval);
    });
}

function signOutClient() {
    return new Promise((resolve, reject)=>{

        //Let the server know that we are signed out
        var xhr = new XMLHttpRequest();
        xhr.open("GET", serverAddress + "/signOut");
        xhr.send();
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200) {
                //OK
                localStorage.setItem("signedIn", "false");
                localStorage.setItem("userInfo", "");
                changeState();
                resolve();
            } else if(this.readyState == 4 && this.status != 200) {
                showNotification("Could not perform a clean signout. Sign in to the user will be restricted in this client.");
                localStorage.clear();
                //localStorage.setItem("signedIn", "false");
                reject();
            }
        }
    })
}
    
    
    
    function authClient() {
        return new Promise((resolve, reject)=>{

        //Fetch the password from the OS keychain
        //get the username
        if(!JSON.parse(localStorage.getItem("userInfo"))[1]) {reject("No user info on computer"); return;}
        var usr = JSON.parse(localStorage.getItem("userInfo"))[1][0].email;
        keytar.getPassword("infoscreen", usr)
        .then((pass)=>{
            var usr = JSON.parse(localStorage.getItem("userInfo"))[1][0].email;
            var formData = new FormData();
            formData.append("user", usr);
            formData.append("password", pass);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", serverAddress + "/auth");
            xhr.send(formData);

            xhr.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200) {
                    var dat = JSON.parse(this.responseText);
                    localStorage.setItem("userInfo", JSON.stringify(dat));
                    console.log("%cClient signed in and up to date", "font-size: 1.5rem; color: red; text-stroke: 1px black;");
                    
                    localStorage.setItem("signedIn", "true");
                    var state = {upToDate: true, errorType: null}
                    document.body.serverState.push(state);
                    
                    //Enable developer mode if the user is a dev
                    if(dat[1][0].dev == true) {
                        document.body.developerMode = true;
                        enableDevMode();
                    } else {
                        document.body.developerMode = false;
                    }
                    
                    changeState();
                    resolve();
                } else if(this.readyState == 4 && this.status != 200) {
                    reject(this.responseText);
                }
            }
        })  
        .catch((error)=>{
            reject(err);
        })
    })
}

/*

THIS CODE IS DEPRECATED BECAUSE OF SECURITY ISSUES, AND GENERALLY BAD PERFORMANCE

function signInClient() {
    //Make server request
    return new Promise(resolve =>{

        var xhr = new XMLHttpRequest();
        //xhr.open("POST", "http://80.213.230.181:3000/auth");
        xhr.open("POST", serverAddress + "/auth");
        xhr.timeout = 20000;
        var storage = JSON.parse(localStorage.getItem("userInfo"));

        var pass = storage[1][0].password; 
        var usrname = storage[1][0].email;

        
        var formData = new FormData();
        formData.append("user", usrname);
        formData.append("password", pass);
        
        
        
        xhr.send(formData);
        xhr.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == 4) {
    
            var dat = JSON.parse(this.responseText);
            if(dat[0] == "USER ALREADY SIGNED IN") {

            } else {
                localStorage.setItem("userInfo", JSON.stringify(dat));
            }
            resolve(["OK", dat]);
        } else if(this.status != 200 && this.readyState == 4) {
            //AIAIAI we could not sign in!
            resolve(["ERROR", this.status]);
        }
    }

    xhr.ontimeout = ()=>{
        resolve(["ERROR", "TIMEOUT"]);
    }
    })
}
*/