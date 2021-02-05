const { BrowserWindowProxy } = require("electron");
const { Octokit } = require("@octokit/core");

function reportIssueMenu() {
    var menu;
    if(!document.getElementsByClassName("menu")[0]) {
        menu = fullPageMenu("user");
        document.body.appendChild(menu);
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
        reportIssueMenu();
    }
    if(menu) {
        menu.style.padding = "3rem";
        menu.style.boxSizing = "border-box";
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


    var title = document.createElement("h1");
    title.innerHTML = "Report an Issue To Github";
    title.style = `
        color: var(--title-color);
        font-weight: lighter;
    `;
    menu.appendChild(title);

    var name = tabInputs.input("Issue title", "text");
    name.style.width = "20rem";
    name.querySelector("input").style.width = "100%";
    name.querySelector("input").style.height = "2.5rem";
    menu.appendChild(name);

    var body = document.createElement("textarea");
    body.style = `
        display: block;
        clear: left;
        height: 10rem;
        width: 40rem;
        background-color: var(--secondary-color);
        border: none;
        outline: none;
        color: var(--paragraph-color);
        padding: 0.5rem;
        box-sizing: border-box;
        border-radius: 0.25rem;
        font-family: bahnschrift;
        font-size: 1.2rem;
        font-weight: lighter;
    `
    body.classList.add("smooth-shadow");
    menu.appendChild(body);

    var issueType = tabInputs.select(["Bug", "Feature request"], 0, "Label");
    issueType.style = `
        margin-top: 1rem;
        width: 20rem;
    `
    menu.appendChild(issueType);


    var report = document.createElement("button");
    report.className = "fd-button important smooth-shadow";
    report.innerHTML = "Report issue";
    menu.appendChild(report)
    report.style = `
        margin-top: 2rem;
    `;
    infoOnHover(report, "Send this issue to Github");
    report.addEventListener("click", (e) => {
        //Get the values
        var title = name.querySelector("input").value;
        var meta = body.value;
        var label = issueType.getElementsByTagName("select")[0].value;
        //0 --> Bug
        //1 --> feature request 
        switch(label) {
            case "0":
                label = "Bug"
            break;
            case "1":
                label = "Feature request"
            break;
        }

        sendIssue({title: title, body: meta, label: label});
    })


    //How to report an issue
    var a = document.createElement("p");
    a.innerHTML = "How do I report a proper issue?";
    a.href = "";
    a.style = `
        color: var(--slider-color);
        opacity: 0.5;
        margin: 5rem 0 0;
        text-decoration: underline;
        cursor: pointer;
        cont-weight: lighter;
    `
    menu.appendChild(a);

    infoBox(a, `1. Keep it clear and concise. <br><br>
    2. <strong>Do not</strong> spam Github with requests.<br><br>
    3. Only report important or useful information.<br><br>
    4. Apply the correct label.`)
}

function sendIssue(data) {
    var title = data.title;
    var body = data.body;
    var label = data.label.toLowerCase();

    var data = {
        "title": title,
        "body": body,
        "labels": [
            label
        ]
    }


    const octokit = new Octokit({auth: "e5163bcdd3a362b3e9ee67d7386ea9e1dd370a4f"})
    var response = octokit.request("POST /repos/{owner}/{repo}/issues", {
        owner: 'MindChirp',
        repo: 'infoScreen',
        title: title,
        body: body,
        label: [label]
    }).then(response => {
        console.log(response);
    })
}