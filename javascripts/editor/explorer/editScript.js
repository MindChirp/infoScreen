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
        save.addEventListener("click", (e) => {
            //Get the script, and save it to the element
            try {
                var ta = document.querySelector("#bottom-layer > div.script-container > div > div.edit-field > table > tr > td:nth-child(2) > textarea")
                el.config.widgetAttributes.script.scriptContents = ta.value; 
                if(ta.value.trim().length > 0) {
                    el.config.widgetAttributes.script.hasScript = true;
                } else {
                    el.config.widgetAttributes.script.hasScript = false;
                }
            } catch (error) {
                alert("Could not save the script");
            }
        })


        
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

        var field = TextAreaLineNumbersWithCanvas();
        //field.classList.add("edit-field")
        if(!el.config.widgetAttributes.script.hasScript && el.config.widgetAttributes.script.scriptContents.length == 0) {
            //If there is no scripts attached to the element, show a boilerplate
            field.value = `<html>
    <!--Start scripting something!-->
</html>
            
<style>
    /*Start styling something!*/
            
</style>
            
<script>
    //Start coding something!
</script>


    Disclaimer: The script widget is not working yet. Typing scripts into this field won't make the widget do anything.
            `;
        } else {
            field.value = el.config.widgetAttributes.script.scriptContents;
        }

    }
}









//CREDIT: nikola bozovic <nigerija@gmail>
var TextAreaLineNumbersWithCanvas = function()
{
var div = document.createElement('div');
var cssTable = 'padding:0px 0px 0px 0px!important; margin:0px 0px 0px 0px!important; font-size:1px;line-height:0px; width:100%;';
      var cssTd1 = 'border:1px #345 solid; border-right:0px; vertical-align:top; width:1px;';
      var cssTd2 = 'border:1px #345 solid; border-left:0px; vertical-align:top;';
      var cssButton = 'width:120px; height:40px; border:1px solid #333 !important; border-bottom-color: #484!important; color:#ffe; background-color:#222;';
      var cssCanvas = 'border:0px; background-color:#1c1c20; margin-top:0px; padding-top:0px;';
      var cssTextArea =  'width:100%;'
                       + 'font-size:11px;'
                       + 'font-family:monospace;'
                       + 'line-height:15px;'
                       + 'font-weight:500;'
                       + 'margin: 0px 0px 0px 0px;'
                       + 'padding: 0px 0px 0px 0px;'
                       + 'resize: both;'
                       + 'color:#ffa;'
                       + 'border:0px;'
                       + 'background-color:#222;'
                       + 'white-space:nowrap; overflow:auto;'                    
                       // supported only in opera 12.x
                       + 'scrollbar-arrow-color: #ee8;'
                       + 'scrollbar-base-color: #444;'
                       + 'scrollbar-track-color: #666;'
                       + 'scrollbar-face-color: #444;'
                       + 'scrollbar-3dlight-color: #444;' /* outer light */
                       + 'scrollbar-highlight-color: #666;' /* inner light */
                       + 'scrollbar-darkshadow-color: #444;' /* outer dark */
                       + 'scrollbar-shadow-color: #222;' /* inner dark */
                       ;

      // LAYOUT (table 2 panels)
      var table = document.createElement('table');
          table.setAttribute('cellspacing','0');
          table.setAttribute('cellpadding','0');
          table.setAttribute('style', cssTable);
      var tr = document.createElement('tr');
      var td1 = document.createElement('td');
          td1.setAttribute('style', cssTd1);
      var td2 = document.createElement('td');
          td2.setAttribute('style', cssTd2);
          tr.appendChild(td1);
          tr.appendChild(td2);
          table.appendChild(tr);

      // TEXTAREA
      var ta = this.evalnode = document.createElement('textarea');
          ta.setAttribute('cols','60');
          ta.setAttribute('style', cssTextArea);
          //ta.value = this.S.get('eval') || '';  // get previous executed value ;)

      // TEXTAREA NUMBERS (Canvas)
      var canvas = document.createElement('canvas');
          canvas.width = 48;    // must not set width & height in css !!!
          canvas.height = 500;  // must not set width & height in css !!!
          canvas.setAttribute('style', cssCanvas);
          ta.canvasLines = canvas;
          td1.appendChild(canvas);
          td2.appendChild(ta);
          div.appendChild(table);

      // PAINT LINE NUMBERS
      ta.paintLineNumbers = function()
      {
        try
        {
        var canvas = this.canvasLines;
        if (canvas.height != this.clientHeight) canvas.height = this.clientHeight; // on resize
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#303030";
        ctx.fillRect(0, 0, 42, this.scrollHeight+1);
        ctx.fillStyle = "#808080";
        ctx.font = "11px monospace"; // NOTICE: must match TextArea font-size(11px) and lineheight(15) !!!
        var startIndex = Math.floor(this.scrollTop / 15,0);
        var endIndex = startIndex + Math.ceil(this.clientHeight / 15,0);
        for (var i = startIndex; i < endIndex; i++)
        {
          var ph = 10 - this.scrollTop + (i*15);
          var text = ''+(1+i);  // line number
          ctx.fillText(text,40-(text.length*6),ph);
        }
        }
        catch(e){ alert(e); }
      };
      ta.onscroll     = function(ev){ this.paintLineNumbers(); };
      ta.onmousedown  = function(ev){ this.mouseisdown = true; }
      ta.onmouseup    = function(ev){ this.mouseisdown=false; this.paintLineNumbers(); };
      ta.onmousemove  = function(ev){ if (this.mouseisdown) this.paintLineNumbers(); };
      
/////.script-container .script-editor
    document.querySelector("#bottom-layer > div.script-container > div").appendChild(div);
    div.classList.add("edit-field");
    // make sure it's painted
	ta.paintLineNumbers();
    return ta;
};