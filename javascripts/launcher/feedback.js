function feedback(parent) {
    if(document.getElementById("settings-wrapper")) {
        var el = document.getElementById("settings-wrapper");
        if(el.getAttribute("name") == "feedback") {
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
    wrapper.setAttribute("name", "feedback");
    var p = document.createElement("p");
    p.innerHTML = "Want to share your thoughts?";
    p.setAttribute("style", `
        display: block; 
    `)
    
    wrapper.appendChild(p);

    parent.appendChild(wrapper);

    var left = document.createElement("div");
    left.setAttribute("style", `
        min-height: 2rem;
        height: fit-content; 
        display: inline-block;
        float: left;
        width: 45%;
        background-color: var(--main-button-color);
        border-radius: 0.5rem;
        padding: 0.5rem;
        color: var(--paragraph-color);
    `);
    left.setAttribute("class", "smooth-shadow");

    wrapper.appendChild(left);


    var Femail = document.createElement("input");
    Femail.setAttribute("style", `
        height: 2rem;
        font-size: 1.3rem;
        color: var(--paragraph-color);
    `);
    var email = JSON.parse(localStorage.getItem("userInfo"))[1][0].email;
    Femail.setAttribute("type", "email");
    Femail.placeholder = "Your email";
    Femail.value = email;
    left.appendChild(Femail);


    var right = document.createElement("div");
    right.setAttribute("style", `
        min-height: 2rem;
        height: fit-content; 
        display: inline-block;
        float: right;
        width: 45%;
        background-color: var(--main-button-color);
        border-radius: 0.5rem;
        padding: 0.5rem;

    `);
    right.setAttribute("class", "smooth-shadow");

    wrapper.appendChild(right);

    var subject = document.createElement("input");
    subject.setAttribute("style", `
        height: 2rem;
        font-size: 1.3rem;
        color: var(--title-color);

        `);
    subject.setAttribute("type", "text");
    subject.placeholder = "Subject";
    right.appendChild(subject);

    var letter = document.createElement("textarea");
    wrapper.appendChild(letter);
    letter.setAttribute("style", `
        color: var(--paragraph-color);
        background-color: var(--main-button-color);
        border-radius: 0.5rem;
        width: 98%;
        height: 4rem;
        margin-top: 1rem;
        border: none;
        outline: none;
        padding: 0.5rem;
        resize: vertical;
        max-height: 7rem;
        min-height: 2rem;
    `);
    letter.placeholder = "Give your feedback here"
    letter.setAttribute("class", "smooth-shadow");

    //Send button
    var send = document.createElement("button");
    send.setAttribute("class", "fd-settings-button smooth-shadow");
    send.innerHTML = "Send";
    send.setAttribute("style", `
        margin-top: 0.5rem;
        position: relative;
        background-color: var(--secondary-button-color);
        float: right;
        width: 5.5rem;
        transition: all 300ms ease-in-out;
    `);

    var info = document.createElement("div");
    info.setAttribute("class", "info-circle");
    info.innerHTML = "?";
    info.setAttribute("style", `
        margin-top: 0.5rem;
    `);
    infoBox(info, "The information you disclose in this form will not be published anywhere exept from in references to it in a changelog or a bugfix patch.")

    wrapper.appendChild(info);
    wrapper.appendChild(send);

    //Handle the send request   

    send.addEventListener("click", function() {
        var email = Femail;
        if(email.value.trim().length == 0 || subject.value.trim().length == 0 || letter.value.trim().length == 0) {
            send.style.animation = "wrong-shake 100ms 3";
            setTimeout(function() {
                send.style.animation = "";
            }, 300)
        } else {
            //All fields are filled in

            var roller = loaderWheel();
            roller.setAttribute("style", "display: block; vertical-align: top; animation: fade-in 200ms ease-in-out; top: -0.9rem; left: -1rem; transform: scale(0.4);");
            send.innerHTML = "";
            send.appendChild(roller);
            send.style.width = "3rem";
            send.disabled = true;

            //Send the server request
            var xhr = new XMLHttpRequest();
            xhr.open("POST", serverAddress + "/postFeedBack");

            var formData = new FormData();
            formData.append("subject", subject.value);
            formData.append("email", email.value);
            formData.append("body", letter.value);

            xhr.send(formData);
            xhr.onreadystatechange = async function() {
                if(this.readyState == 4 && this.status == 200) {
                    var res = JSON.parse(this.responseText);
                    if(res[0] == "OK") {

                        console.log(res);

                        await sleep(1000);

                        send.style.width = "5rem";
                        send.style.overflow = "hidden";
                        send.style.opacity = "0.4";
                        send.innerHTML = "Sent";


                    } else if(res[0] == "ERROR") {
                        await sleep(1000);
                        send.style.width = "fit-content";
                        send.innerHTML = res[1];
                        send.disabled = false;
                    } else {
                        console.log(res);
                    }

                } else if(this.readyState == 4 && this.status != 200){
                    //Request failed

                    await sleep(1000);
                    send.style.width = "fit-content";
                    console.log(this.responseText);
                    send.innerHTML = "Could not send. Click to retry";
                    send.disabled = false;

                }
            }
        }
    });


}


