function privacyMenu(parent) {
    if(document.getElementById("settings-wrapper")) {
        var el = document.getElementById("settings-wrapper");
        if(el.getAttribute("name") == "profile-pic") {
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
    wrapper.setAttribute("name", "profile-pic");

    parent.appendChild(wrapper);

    var passwordInfo = `
        In the early stages of this development path, there won't be any focus on password encryption, or on data transaction safety.
    `;
    var el = textCont("Passwords", passwordInfo);
    wrapper.appendChild(el);

    var policy = `
        There is no privacy policy yet, so I only ask you kindly to not abuse the program in any way, and to play fair.
        I am also not liable for any damages that may occur from using this product. Any faults or bugs that leads to an unconvenient situation
        is on your shoulders.
    `;
    var el = textCont("Privacy Policy | Terms of Use", policy);
    wrapper.appendChild(el);
}