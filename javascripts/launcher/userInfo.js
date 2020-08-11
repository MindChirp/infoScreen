function userInfo(parent) {
    if(document.getElementById("settings-wrapper")) {
        var el = document.getElementById("settings-wrapper");
        if(el.getAttribute("name") == "user-information") {
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
    wrapper.setAttribute("name", "user-information");

    var userData = JSON.parse(localStorage.getItem("userInfo"))[1][0];
    var el = textCont("Name", userData.name);
    wrapper.appendChild(el)

    var el = textCont("Email", userData.email);
    wrapper.appendChild(el)

    var el = textCont("License", "Standard (Developer/Tester)");
    wrapper.appendChild(el)

    var el = textCont("Account age", userData.creationDate);
    wrapper.appendChild(el)

    var pass =  userData.password;
    var hidden = "";
    
    for(let i = 0; i < pass.length; i++) {
        hidden = hidden + "*";
    }
    var el = textCont("Password", hidden);
    wrapper.appendChild(el)

    parent.appendChild(wrapper);




}



function textCont(title,info) {
    var el = document.createElement("div");
    el.setAttribute("style", `
        height: fit-content;
        width: fit-content;
        display: inline-block;
        margin-right: 1rem;
    `);

    var p = document.createElement("p");
    p.innerHTML = title;
    p.setAttribute("style", `
        display: block; 
        height: 1rem;
        margin-top: 1rem;
        line-height: 1rem;
    `);
    
    el.appendChild(p);

    var p = document.createElement("p");
    p.innerHTML = info;
    p.setAttribute("style", `
        display: block; 
        color: rgb(150,150,150);
        height: 1rem;
        line-height: 1rem;
    `);

    el.appendChild(p);
    return el;

}