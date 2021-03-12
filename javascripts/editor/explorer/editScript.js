const { TouchBarSlider } = require("electron");

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
        docs.onclick = toggleDocs;

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
                var ta = document.querySelector("#bottom-layer > div.script-container > div").getElementsByClassName("edit-field");

                el.config.widgetAttributes.script.scriptContents = ta[2].getElementsByTagName("textarea")[0].value;
                el.config.widgetAttributes.script.htmlContents = ta[0].getElementsByTagName("textarea")[0].value; 
                el.config.widgetAttributes.script.styleContents = ta[1].getElementsByTagName("textarea")[0].value; 
                el.config.widgetAttributes.script.hasScript = true;
            } catch (error) {
                alert("Could not save the script");
            }
        })

        var run = document.createElement("button");
        var ico = document.createElement("i");
        ico.className = "material-icons";
        ico.innerHTML = "play_arrow";
        run.appendChild(ico);
        run.className = "top-bar-button fd-button important";
        topBar.appendChild(run);
        infoOnHover(run, "Run");
        run.addEventListener("click", () => {

            var texts = editor.getElementsByTagName("textarea");
            var script = texts[2].value;
            var html = texts[0].value;
            var style = texts[1].value;
            runScript(script, html, style, el);
        })

        var cons = document.createElement("button");
        var ico = document.createElement("i");
        ico.className = "material-icons";
        ico.innerHTML = "article";
        cons.appendChild(ico);
        cons.className = "top-bar-button fd-button important";
        topBar.appendChild(cons);
        infoOnHover(cons, "Console");
        cons.onclick = toggleConsole;

        
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
        var split = document.createElement("div");
        split.className = "editor-split";
        document.querySelector("#bottom-layer > div.script-container > div.script-editor").appendChild(split);
        var htmlfield = TextAreaLineNumbersWithCanvas();
        htmlfield.value = "<!--HTML-->";

        var stylefield = TextAreaLineNumbersWithCanvas();
        stylefield.value = "/*CSS*/";

        var jsfield = TextAreaLineNumbersWithCanvas();
        jsfield.value = `//JS
const t = new ApiTools();
t.localFetch("ss").shadowSize("10");`;
        //field.classList.add("edit-field")
        var contents = el.config.widgetAttributes.script;
        console.log(contents)
        if(contents.scriptContents.length == 0 && contents.htmlContents.length == 0 && contents.styleContents.length == 0) {
            //If there is no scripts attached to the element, show a boilerplate
            jsfield.value = `//JS
const t = new ApiTools();
t.localFetch("ss").shadowSize("10");`;
            htmlfield.value = "<!--HTML-->";
            stylefield.value = "/*CSS*/";
        } else {
            jsfield.value = contents.scriptContents;
            htmlfield.value = contents.htmlContents;
            stylefield.value = contents.styleContents;
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
    document.querySelector("#bottom-layer > div.script-container > div > div.editor-split").appendChild(div);
    div.classList.add("edit-field");
    // make sure it's painted
	ta.paintLineNumbers();
    return ta;
};


function toggleConsole() {

    if(document.getElementById("script-console")) {
        var el = document.getElementById("script-console");
        el.parentNode.removeChild(el);
        return; 
    }
    var el = floatingBox();
    el.id = "script-console";

    var view = el.querySelector(".view");
    
    pStyle = "margin: 0; line-height: 1rem; width: 100%; text-align: left; color: #41FF00; font-family: 'Courier New', monospace;"

    var p = document.createElement("p");
    p.innerHTML = "> CONSOLE READY.";
    p.style = pStyle;
    view.appendChild(p);

    var p = document.createElement("p");
    p.innerHTML = "> NOTE: alert() is disabled in a running slideshow.";
    p.style = pStyle;
    view.appendChild(p);

}


function toggleDocs() {
 
    if(document.getElementById("documentation-console")) {
        var el = document.getElementById("documentation-console");
        el.parentNode.removeChild(el);
        return; 
    }
    var el = floatingBox();
    el.id = "documentation-console";
    var p = document.createElement("h1");
    p.innerHTML = "Documentation";
    p.style = `
        margin: 0 0 0.5rem;
        font-weight: lighter;
        
    `

    var view = el.querySelector(".view");
    view.appendChild(p);

    view.style = `
        background-color: white;
        color: black;
        font-family: bahnschrift;
    `


    /*
    col.childNodes[1].childNodes[0].appendChild(createCollapsible("Changing slides programmatically", "const toolKit = new ApiTools()<br><br>toolKit.nextSlide() //(or: toolKit.prevSlide())"))
    col.childNodes[1].childNodes[0].appendChild(createCollapsible("Communicating with the infoScreen server", "The infoScreen server is usually hosted by the user itself. To gain access to the server, one must know its ip-address.<br><br>var xhr = new XMLHttpRequest()<br>xhr.open('POST', *ip-address*)<br>xhr.send(*authentication data*);<br><br>Continue by following the standard XMLHttpRequest procedures."))
    col.childNodes[1].childNodes[0].appendChild(createCollapsible("Slide manipulation", "You can edit other elements while they are being displayed with a script widget."))
    */

    //scrDocs
    var { scrDocs } = require(path.join(__dirname, "internalResources", "scriptDocs", "script-widget"));
    
    var addDropDown = (dat) => {
        var folder = createCollapsible(dat.label);
        
        if(dat.content) {
            var y;

            for(y of dat.content) {
                if(y.string) {
                    var p = document.createElement("p");
                    p.innerHTML = y.string;
                    p.style = `
                        color: black;
                    `
                    folder.childNodes[1].childNodes[0].appendChild(p);
                } else if(y.menu) {
                    var dropDown = addDropDown(y.menu);
                    folder.childNodes[1].childNodes[0].appendChild(dropDown);
                } else if(y.code) {
                    var code = document.createElement("div");
                    code.style = `
                        height: fit-content;
                        min-width: 20rem;
                        width: fit-content;
                        background-color: black;
                        color: white;
                        border-radius: 0.25rem;
                    `;
                    code.classList.add("smooth-shadow");

                    var p = document.createElement("p");
                    p.innerHTML = y.code;
                    p.style = `
                        margin: 0;
                        color: #41FF00; 
                        font-family: 'Courier New', monospace;
                    `;
                    code.appendChild(p);
                    folder.childNodes[1].childNodes[0].appendChild(code);
                }
            }
        }

        
        return folder;
    }

    var x;
    for(x of scrDocs.menus) {
        var folder = createCollapsible(x.label);
        view.appendChild(folder);

        if(x.content) {
            var y;
            for(y of x.content) {
                if(y.string) {
                    //If string
                    var p = document.createElement("div");
                    p.innerHTML = y.string;
                    folder.childNodes[1].childNodes[0].appendChild(p);
                } else if(y.menu) {
                    var dropDown = addDropDown(y.menu);
                    folder.childNodes[1].childNodes[0].appendChild(dropDown);
                } else if(y.code) {
                    var code = document.createElement("div");
                    code.style = `
                        height: fit-content;
                        min-width: 20rem;
                        width: fit-content;
                        background-color: black;
                        color: white;
                        border-radius: 0.25rem;
                    `;
                    code.classList.add("smooth-shadow");

                    var p = document.createElement("p");
                    p.innerHTML = y.code;
                    p.style = `
                        margin: 0;
                        color: #41FF00; 
                        font-family: 'Courier New', monospace;
                    `;
                    code.appendChild(p);
                    folder.childNodes[1].childNodes[0].appendChild(code);
                }
            }
        }
    }
}






var createCollapsible = function(title, contentText) {
    var cont = document.createElement("div");

    var el = document.createElement("button");
    el.className = "documentation-collapsible";
    if(title) {el.innerHTML = title};
    cont.appendChild(el);
    el.addEventListener("click", (e) => {
        var content = e.target.nextElementSibling;
        if(content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            //Get all the preceeding folding menus, and update their heights, as well
            var drops = document.getElementsByClassName("foldable-content");
            var x;
            for(x of drops) {
                if(x.contains(content)){
                    //check if the element is not itself
                    if(x != content) {
                            x.style.maxHeight = x.scrollHeight + content.scrollHeight + "px";
                    };
                }
            }


            content.style.maxHeight = content.scrollHeight + "px";
        }
      /*  if(content.style.display == "block") {content.style.display = "none"}
        else {content.style.display = "block"};*/


    })


    var fold = document.createElement("div");
    fold.className = "foldable-content";
    cont.appendChild(fold);

    var wr = document.createElement("div");

    if(contentText) {
        var content = document.createElement("span");
        content.innerHTML = contentText;
        wr.appendChild(content);

    };
    fold.appendChild(wr);
    return cont;
}






var ConsoleUtil = function() {
    this.log = function(string) {
        //Get the console
        if(!document.getElementById("script-console")) return

        var console = document.getElementById("script-console");
        var p = document.createElement("p");
        pStyle = "margin: 0; line-height: 1rem; width: 100%; text-align: left; color: #41FF00; font-family: 'Courier New', monospace;"
        p.style = pStyle;
        p.innerHTML = '> ' + strip(string);
        console.querySelector(".view").appendChild(p);
    },
    this.clear = function() {
        var console = document.getElementById("script-console");
        console.querySelector(".view").innerHTML = "";
    }
}


var localIndex = {slide: null, content: []};

var ApiTools = function() {
    this.selectSlide = function(no) {
        console.log("Rendering slide number " + no);
        activateColumnNo(no);
    },
    this.selectedSlide = function() {
        return renderer.renderedColumn();
    },
    this.nextSlide = function() {
        var slideNo = renderer.renderedColumn();
        activateColumnNo(slideNo+1);
    },
    this.prevSlide = function() {
        var slideNo = renderer.renderedColumn();
        if(slideNo == 0) throw new RangeError("Cannot render for values less than 0");
        activateColumnNo(slideNo-1);
    },
    this.localFetch = function(id) {
        var slideNo = renderer.renderedColumn();
        //Get the columns
        var cols = document.getElementsByClassName("timeline-column")[slideNo];
        var indexedSlide = localIndex.slide;
        if(indexedSlide == slideNo) {
            var content = localIndex.content;
            for(let m = 0; m < content.length; m++) {
                if(content[m].id == id) {
                    return content[m];        
                }
            }
            return undefined
        } else {
            localIndex = {slide: slideNo, content: []};

            for(x of cols.childNodes) {
                if(!x.querySelector(".scrubber-element")) return;
                localIndex.content.push({id: x.querySelector(".scrubber-element").config.identification, element: x.querySelector(".scrubber-element"), backgroundColor: function(col) {
                    console.log(this.element)
                    this.element.config.backgroundColor = col;
                    refreshSlide();
                },
                borderRadius: function(rad) {
                    console.log(this.element)
                    this.element.config.borderRadius = rad;
                    refreshSlide();
                },

                blur: function(blur) {
                    this.element.config.blur = blur;
                    refreshSlide();

                },

                opacity: function(opac) {
                    this.element.config.opacity = opac;
                    refreshSlide();

                },

                fontFamily: function(font) {
                    this.element.config.fontFamily = font;
                    refreshSlide();

                },

                color: function(col) {
                    this.element.config.textColor = col;
                    refreshSlide();

                },

                shadowSize: function(size) {
                    console.log(this.element);
                    this.element.config.shadowMultiplier = size;
                    refreshSlide();

                }
            });
            }

            var x;
            var content = localIndex.content;
            for(x of content) {
                if(x.id == id) {
                    return x;
                }
            }
                return undefined;
        }

        
    }
}


function refreshSlide() {
    //Refresh current slide
    var slide = renderer.renderedColumn();
    activateColumnNo(slide);
}


function runScript(scr, html, style, element) { //origin is the script widget origin slide
    
    var origin = element.config.slideNumber;
    var console = new ConsoleUtil();
    var alert = (string) => {
        console.log('ALERT: ' +string);
    }    

    var renderColumn;
    var activateColumnNo;
    var RenderingToolKit;
    var renderer;
    var localIndex;

    html.replace("<script>", "<!--");
    html.replace("</script>", "-->");
    element.config.widgetAttributes.script.htmlContents = html;
    element.config.widgetAttributes.script.styleContents = style;
    refreshSlide();


    //Run code
    try {
        eval(scr);
        /*var ex = new Function(scr);
        return(ex());*/
    } catch (error) {
        console.log(error);
    }

}