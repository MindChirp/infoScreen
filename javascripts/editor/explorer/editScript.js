function editScript(el) {
    if(!el.isEditing) {
        el.isEditing = true;
        var editorCont = document.createElement("div");
        editorCont.className = "script-container"
        editorCont.connectedElement = el;
        var editor = document.createElement("div");
        editorCont.appendChild(editor);
        //Append the editor over the timeline
        var cont = document.getElementById("bottom-layer");
        editor.className = "script-editor";
        cont.appendChild(editorCont);

        var topBar = document.createElement("div");
        topBar.className = "top-bar";
        editor.appendChild(topBar);


        var h1 = document.createElement("h1");
        h1.innerHTML = "Script Editor";
        topBar.appendChild(h1);


        //Need to create a close button and stuff
        var close = document.createElement("button");
        close.className = "fd-button important close-button";
        var ico = document.createElement("i");
        ico.className = "material-icons";
        ico.innerHTML = "close";
        close.appendChild(ico);

        var docs = document.createElement("button");
        var ico = document.createElement("i");
        ico.className = "material-icons";
        ico.innerHTML = "menu_book";
        docs.appendChild(ico);
        docs.className = "top-bar-button fd-button important";
        topBar.appendChild(docs);
        infoOnHover(docs, "Documentation");

        var save = document.createElement("button");
        var ico = document.createElement("i");
        ico.className = "material-icons";
        ico.innerHTML = "save";
        save.appendChild(ico);
        save.className = "top-bar-button fd-button important";
        topBar.appendChild(save);
        infoOnHover(save, "Save");

        
        var del = document.createElement("button");
        var ico = document.createElement("i");
        ico.className = "material-icons";
        ico.innerHTML = "delete";
        del.appendChild(ico);
        del.className = "top-bar-button fd-button important";
        topBar.appendChild(del);
        infoOnHover(del, "Delete");

        del.addEventListener("click", (e) => {
            //Create a confirmation message

            if(topBar.querySelector(".delete-message-container")) {
                var el = topBar.querySelector(".delete-message-container");
                el.parentNode.removeChild(el);
                return;
            }
            
            var wr = document.createElement("div");
            wr.className = "delete-message-container";
            wr.style = `
                height: 100%;
                width: fit-content;
                display: inline-block;
                vertical-align: top;
                margin-left: 1rem;
                animation: fade-in 150ms ease-in-out;

            `
            var div = document.createElement("div");
            div.style = `
                display: inline-block;
                background-color: var(--light-shade);
                width: 1px;
                height: 100%;
                vertical-align: top;
            `;
            wr.appendChild(div);

            var p = document.createElement("p");
            p.innerHTML = "Are you sure you want to delete all your code?";
            wr.appendChild(p);
            p.style = `
                display: inline-block;
                height: 2rem;
                line-height: 2rem;
                color: var(--paragraph-color);
                margin: 0;
                vertical-align: top;
                margin-left: 1rem;
                font-weight: lighter;
                animation-fill-mode: both;
            `;

            var yes = document.createElement("button");
            yes.innerHTML = "DELETE";
            yes.className = "fd-button";
            yes.style = `
                height: 2rem;
                background-color: #c63939;
                display: inline-block;
                line-height: 2rem;
                padding: 0 0.5rem;
                vertical-align: top;
                margin-left: 1rem; 
                letter-spacing: 0.15em;
            `;
            wr.appendChild(yes);

            var no = document.createElement("button");
            no.innerHTML = "CANCEL";
            no.className = "fd-button";
            no.style = `
                height: 2rem;
                background-color: transparent;
                display: inline-block;
                line-height: 2rem;
                padding: 0 0.5rem;
                vertical-align: top;
                margin-left: 0.5rem; 
                letter-spacing: 0.15em;
            `;
            wr.appendChild(no);

            no.addEventListener("click", (e) => {
                var cont = e.target.closest(".delete-message-container");
                cont.parentNode.removeChild(cont);
            })


            yes.addEventListener("click", (e) => {
                var cont = e.target.closest(".delete-message-container");
                
                var textArea = cont.closest(".script-editor").getElementsByTagName("textarea")[0];
                textArea.value = "";
                cont.parentNode.removeChild(cont);
            })

            topBar.appendChild(wr);
        })


        close.addEventListener("click", (e) => {
            var cont = e.target.closest(".script-container");
            cont.parentNode.removeChild(cont);
            cont.connectedElement.isEditing = false;
        })

        topBar.appendChild(close);

        infoOnHover(close, "Close");


        //Create the text editing field

        var field = document.createElement("textarea");
        editor.appendChild(field);
    }
}