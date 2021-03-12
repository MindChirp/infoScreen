const { createWriteStream } = require("fs");
const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require("constants");
const { profile, exception } = require("console");
const { ipcMain, ipcRenderer, remote } = require("electron");
const env = process.env.NODE_ENV || 'development';
const { isPackaged } = require("electron-is-packaged")
if(env != "development") {
    var devButton = document.getElementById("developer-start");
    devButton.parentNode.removeChild(devButton);
}

const ipc = require("electron").ipcRenderer;
const { format } = require("path");
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

window.onload = function() {
    //load all the projects to the plrojects list
    initializeProjectList()

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
            var ext = localStorage.getItem("pfpExtension");
            var pos = JSON.parse(localStorage.getItem("pfpPos"));
            var Xpos = pos[0];
            var Ypos = pos[1];
            var size = pos[2];
            var img = document.getElementById("profile-photo-image");
            img.style.transform = "translateX(" + Xpos + "%) translateY(" + Ypos + "%) scale(" + size + ")";
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
        title.innerHTML = title.innerHTML + ", " + name + ".";
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
            console.log(e);
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
    el.addEventListener("mouseenter", function(event) {
    var mouseover = true;

    el.addEventListener ("mouseleave", function(event1) {
        mouseover = false;
        if(document.getElementsByClassName("information-popup")) {
            var popups = document.getElementsByClassName("information-popup");

            for(let i = 0; i < popups.length; i++) {
                popups[i].parentNode.removeChild(popups[i]);
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
            var imgPath;
            console.log(ext);
            if(isPackaged) {
                imgPath = path.join(path.dirname(__dirname), "extraResources",  "data", "programData", "profilePics", "user" + ext);
            } else {
                imgPath = path.join(__dirname, "extraResources",  "data", "programData", "profilePics", "user" + ext);
            }
            img.setAttribute("src", imgPath);


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
        `)


        var form = document.createElement("form");
        form.setAttribute("class", "login-form");

        var usrName = document.createElement("input");
        usrName.setAttribute("type", "username");
        usrName.setAttribute("placeholder", "Email");
        usrName.style.backgroundColor = "var(--main-button-color)";
        usrName.style.color = "var(--title-color)";
        //TEMPORARY
        usrName.value = "frikk44@gmail.com";
        setTimeout(function() {
            usrName.focus();

        }, 10);
        var pswrd = document.createElement("input");
        pswrd.setAttribute("type", "password");
        pswrd.setAttribute("placeholder", "Password");
        pswrd.style.backgroundColor = "var(--main-button-color)";
        pswrd.style.color = "var(--paragraph-color)";
        //TEMPORARY
        pswrd.value = "frikkern123";
        form.appendChild(usrName);
        form.appendChild(pswrd);

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
        p.innerHTML = "Sign in ";
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

        logIn.addEventListener("click", function(event) {
            event.preventDefault(); 

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
            xhr.open("POST", "http://localhost:3000/auth");
            
            var pass = pswrd.value;
            var usrname = usrName.value;

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
                                

                                //Update the main launcher screen to reflect the localStorage values
                                localStorage.setItem("userInfo", JSON.stringify(dat));
                                console.log(JSON.stringify(dat));
                                userScreen(dat, header, true);
                                changeState();

                            }, 300)

                        }, 500);
                    } else {
                        var loginForm = document.getElementsByClassName("login-form")[0];
                        loginForm.style.animation = "wrong-shake 100ms 3";
                    }

                }
            }


        })


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

                if(pass.value == pass1.value) {
                    //Do some stuff with the server to create a new user...
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
            var parent = document.getElementsByClassName("login-form")[0].parentNode;
            document.getElementsByClassName("login-form")[0].parentNode.removeChild(document.getElementsByClassName("login-form")[0])





            parent.appendChild(form);
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
    img.setAttribute("src", imgPath);
    pfp.appendChild(img);
    img.setAttribute("style", `
        position: absolute;
        height: 80px;
        width: auto;
        margin-left: 50%;
        transform: translateX(-50%);
    `);

    var pos = JSON.parse(localStorage.getItem("pfpPos"));
    
    var Xpos = pos[0];
    var Ypos = pos[1];
    var size = pos[2];
    img.style.transform = "translateX(" + Xpos + "%) translateY(" + Ypos + "%) scale(" + size + ")";

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
    var h1 = h1El();
    if(signedIn == "false") {
        h1.innerHTML = "You're not signed in";
    } else {
        if(info) {
            h1.innerHTML = info[1][0].name
        }
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
    `);
    user.appendChild(h1);
    userWrapper.appendChild(user)
    header.appendChild(userWrapper);
    userWrapper.style.animation = "slide-in 300ms ease-in-out";


    
    var menu = header.parentNode;
    var content = document.createElement("div");
    content.style.animation = "slide-in 300ms ease-in-out 0.3s";
    content.style.animationFillMode = "backwards";
    content.setAttribute("class", "settings-content");
    menu.appendChild(content);
    
    
    
    var signOut = createSettingsButton();
    signOut.innerHTML = "Sign out";
    signOut.addEventListener("click", function() {
        localStorage.setItem("signedIn", "false");
        changeState();
        location.reload();
    });
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
    })
    content.appendChild(signOut);
    content.appendChild(changePfp);
    content.appendChild(subscription);
    content.appendChild(updates);
    content.appendChild(feedbackButt);
    content.appendChild(info);
    content.appendChild(privacy);
    content.appendChild(themes);
    content.appendChild(aboutButt);
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
    initializeProjectList();

    var signedIn = localStorage.getItem("signedIn");

    if(signedIn == "true") {


    firstTime = localStorage.getItem("firstTime");


    var title = document.getElementById("main-title");
    if(firstTime == "true") {
        title.innerHTML = "Welcome!";
    } else if(firstTime == "false") {
        title.innerHTML = "Welcome back";
    }
    

    var name = JSON.parse(localStorage.getItem("userInfo"))[1][0].name.split(" ")[0];
    title.innerHTML = title.innerHTML + ", " + name;


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
        notif.onclick = function() {
            startDownloading();
        }
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
    ipcRenderer.send("start-downloading-update");
}


var notificationTracker = [{severe: 0, medium: 0, mild: 0}]

function createNotification(data) {

    //Clear the "nothing to show" message
    if(document.getElementById("notifications-pane").querySelector(".nothingToShow")) {
        document.getElementById("notifications-pane").innerHTML="";
    }


    var el = document.createElement("div");
    el.className = "notification";
    


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
        removeNotification(e.target.closest('.notification'));
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
    ipcRenderer.send("closeLauncher", true);
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