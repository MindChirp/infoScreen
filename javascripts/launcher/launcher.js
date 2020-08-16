const { createWriteStream } = require("fs");
const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require("constants");
const { profile } = require("console");
const env = process.env.NODE_ENV || 'development';
const ipc = require("electron").ipcRenderer



//--\\ DEVELOPER MODE //--\\

const developerMode = true;

//--\\ -------------- //--\\


if(env != "development") {
    var devButton = document.getElementById("developer-start");
    devButton.parentNode.removeChild(devButton);
}


if(developerMode) {
    console.log("%cDeveloper Mode", "color: red; font-weight: bold; font-size: 3rem;");
}

function launchProgram() {
    ipc.send("load-program");
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




var signedIn = null;
var firstTime = null;

window.onload = function() {

    //Set the correct profile photo path
    if(localStorage.getItem("signedIn")) {
        var signedIn = JSON.parse(localStorage.getItem("signedIn"));
    }
        if(signedIn == true) {
            var ext = localStorage.getItem("pfpExtension");
            var pos = JSON.parse(localStorage.getItem("pfpPos"));
            var Xpos = pos[0];
            var Ypos = pos[1];
            var size = pos[2];
            var img = document.getElementById("profile-photo-image");
            img.style.transform = "translateX(" + Xpos + "%) translateY(" + Ypos + "%) scale(" + size + ")";
            img.src = "../data/programData/profilePics/user"+ ext;
            
        }
    //If not already set up, set up the localStorage
    var storage = window.localStorage;
    if(!storage.signedIn) {
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
                if(butts[i].childNodes[2].innerHTML != "Developer start") {
                    butts[i].disabled = true;
                }
            }
        }

    } else if(signedIn == "true") {
        if(developerMode) {
            title.innerHTML = title.innerHTML + ", " + "Developer";
        } else {
            var name = JSON.parse(localStorage.getItem("userInfo"))[1][0].name.split(" ")[0];
            title.innerHTML = title.innerHTML + ", " + name;
        }
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
    }, 500)
})
}

function menu(type) {
    var el = document.createElement("div");
    el.setAttribute("class", "menu");
    document.body.appendChild(el);
    switch(type) {
        case "user":

            var header = document.createElement("div");
            header.setAttribute("class", "header");
            el.appendChild(header);

        break;
    }

    var back = document.createElement("button");
    back.setAttribute("class", "fd-button smooth-shadow");
    back.setAttribute("style", `
        position: absolute;
        bottom: 1rem;
        left: 1rem;
        height: 3rem;
        width: 3rem;
        z-index: 10;
    `);

    infoOnHover(back, "Go back");

    back.addEventListener("click", function() {
        el.parentNode.removeChild(el);
        if(document.getElementsByClassName("information-popup")) {
            document.getElementsByClassName("information-popup")[0].parentNode.removeChild(document.getElementsByClassName("information-popup")[0])
        }
    })

    var ico = document.createElement("i");
    ico.setAttribute("class", "material-icons");
    ico.innerHTML = "keyboard_backspace";
    back.appendChild(ico);
    ico.setAttribute("style", `
        color: white;
        line-height: 3rem;
        font-size: 1.4rem;
        text-align: center;
        transform: translateX(-0.15rem);
    `)

    el.appendChild(back);
    return el;
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
    
    if(signedIn == true) {

        img.setAttribute("src", "../data/programData/profilePics/user" + ext);
        img.setAttribute("style", `
        height: 5rem;
        width: auto;
        `);        
    } else {
        img.setAttribute("src","../data/programData/profilePics/default.png")
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
        color: white;
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
        //TEMPORARY
        usrName.value = "frikk44@gmail.com";
        setTimeout(function() {
            usrName.focus();

        }, 10);
        var pswrd = document.createElement("input");
        pswrd.setAttribute("type", "password");
        pswrd.setAttribute("placeholder", "Password");
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
        `);
        var ico = document.createElement("i");
        ico.setAttribute("class", "material-icons");
        ico.innerHTML = "login";
        ico.setAttribute("style", `
            line-height: 2.3rem;
            color: white;
        `);
        var p = pEl();
        p.innerHTML = "Sign in ";
        p.setAttribute("style", `
            line-height: 2.3rem;
            color: white;
            margin-left: 0.5rem;
        `);
        logIn.appendChild(ico);
        logIn.appendChild(p); 
        form.appendChild(logIn);
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
            if(developerMode) {

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
                                        localStorage.setItem("userInfo", JSON.stringify(null));

                                            userScreen(null, header, true);

                                    }, 300)

                                }, 500);
                    



                
            }
            var xhr = new XMLHttpRequest();
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
                                localStorage.setItem("userInfo", JSON.stringify(dat));
                                if(!developerMode) {
                                    userScreen(dat, header, true);
                                } else {
                                    userScreen(null, header, true);
                                }

                            }, 300)

                        }, 500);
                    }

                }
            }


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
        animation: pfp-slide-in 300ms ease-in-out 0.2s;
        animation-fill-mode: backwards;
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
    var ext = localStorage.getItem("pfpExtension");
    img.setAttribute("src", "../data/programData/profilePics/user"+ ext);
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
    var mail = document.createElement("p");

    var nameCont = document.createElement("div");
    nameCont.setAttribute("style", `
        height: fit-content;
        width: 100rem;
        display: inline-block;
        top: 50%;
        transform: translateY(-50%);
        margin-left: 1rem;
        position: absolute;
    `)
    if(signedIn == "false") {
        h1.innerHTML = "You're not signed in";
    } else {
        if(!developerMode) {
            if(info) {
                h1.innerHTML = info[1][0].name;  
                mail.innerHTML = info[1][0].email;
            }
        } else {
            //Keep me logged in all the time if developer mode is enabled!
            h1.innerHTML = "Frikk Ormestad Larsen";
            mail.innerHTML = "developer@infoScreen.com"
        }
    }
    h1.setAttribute("style", `
        display: inline-block;
        line-height: 2rem;
        color: white;
        vertical-align: top;
        margin: 0;
        font-weight: lighter;
        opacity: 0;
        animation: slide-right 700ms ease-in-out 0.2s;
        animation-fill-mode: forwards;
    `);

    mail.setAttribute("style", `
        color: rgb(150,150,150);
        display: block;
        height: 1rem;
        line-height: 1rem;
        font-size: 1.2em;
        animation: slide-right 700ms ease-in-out 0.3s;
        animation-fill-mode: backwards;
    `)
    user.appendChild(nameCont);

    nameCont.appendChild(h1);
    nameCont.appendChild(mail)

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
    })
    var privacy = createSettingsButton();
    privacy.innerHTML = "Privacy";

    var themes = createSettingsButton();
    themes.innerHTML = "Themes";

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
        color: white;
        margin-right: 1rem;
        margin-bottom: 1rem;
    `);
    
    return button;
}




function divider() {
    var el = document.createElement("div");
    el.setAttribute("id", "divider-line");
    el.setAttribute("style", `
        width: 40rem;
        height: 0.095rem;
        background-color: #1B2630;
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

    var signedIn = localStorage.getItem("signedIn");

    if(signedIn == true) {

    }

}