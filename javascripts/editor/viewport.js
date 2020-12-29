const renderer = new RenderingToolKit()

function viewportSettings() {
    var el = document.getElementById("viewport").querySelector(".settings-bar");
    el.style.display = "block";
}

function closeViewportSettings(el) {
    el.parentNode.parentNode.style.display = "none";
}

var settings = document.getElementById("viewport").querySelector(".settings-bar").querySelector(".content").getElementsByClassName("select");
settings[0].addEventListener("change", function() {
    var val = settings[0].childNodes[0].value;
    ratio = val.split(":")[0] / val.split(":")[1];
    calculateViewportSize();

})

settings[1].addEventListener("change", function() {
    var val = settings[1].childNodes[0].value;
    if(val != "Blue"){
        document.getElementById("viewport").querySelector("#content").style.backgroundColor = val;
    } else if(val == "Blue") {
        document.getElementById("viewport").querySelector("#content").style.backgroundColor = "#4da0ff";
    }
    if(val.toLowerCase() == "white") {
        document.getElementById("viewport").querySelector(".settings-button").childNodes[0].style.color = "black";
        document.getElementById("viewport").setAttribute("style", "background-color: var(--light-shade);")
    } else {
        document.getElementById("viewport").querySelector(".settings-button").childNodes[0].style.color = "white";
        document.getElementById("viewport").setAttribute("style", "background-color: var(--dark-shade);")

    }
});


//Handle the progress bar background colors etc. 
var bar = document.getElementById("viewport").querySelector(".fd-slider");
var mouseDownOnProgressBar;
bar.addEventListener("mousedown", function(e) {
    mouseDownOnProgressBar = true;

    //Update the progress bar if it is only clicked, and not dragged
    setTimeout(function() {
        e.target.style.backgroundImage = "-webkit-gradient(linear, left top, right top, color-stop(" + e.target.value + "%, var(--slider-color)), color-stop(" + e.target.value + "%, var(--slider-disabled-color)))";
    }, 10)
});
bar.addEventListener("change", function(e) {
    e.target.style.backgroundImage = "-webkit-gradient(linear, left top, right top, color-stop(" + e.target.value + "%, var(--slider-color)), color-stop(" + e.target.value + "%, var(--slider-disabled-color)))";
})
bar.addEventListener("mouseup", function(e) {
    mouseDownOnProgressBar = false;
})
bar.addEventListener("mousemove", function(e) {
    if(mouseDownOnProgressBar) {
        //Update the progress bar if it is only dragged, and not clicked
        e.target.style.backgroundImage = "-webkit-gradient(linear, left top, right top, color-stop(" + e.target.value + "%, var(--slider-color)), color-stop(" + e.target.value + "%, var(--slider-disabled-color)))";
    }
});


////////////////////////////////
// Render the selected column //
////////////////////////////////

//renderer --> RenderingToolKit()
function renderColumn(col) {
    console.log("RENDERING COLUMN " + parseInt(col + 1));
    //Get the rows

    var rows = document.getElementsByClassName("timeline-column")[col].childNodes;
    
    //Create indexation array
    var indexes = [];

    for(let i = 0; i < rows.length; i++) {
        if(rows[i].hasChildNodes()) {
            //Gather information about the element
            var x = rows[i].childNodes[0];
            var type = x.getAttribute("type");
            var name;
            if(type == "img" || type == "vid") {
                name = x.getAttribute("filename");
            }

            var zIndex = i+1;

            //Push each element in the column to the indexation array with all the nescessary information
            indexes.push([{type: type, name: name, zIndex: zIndex}])
        }
    }



    //Go through the indexes array, and handle each element correctly

    var viewport = document.getElementById("viewport").querySelector("#content").querySelector(".container");
    
    var x;
    for(x of indexes) {
        if(x[0].type == "img") {
            renderer.image(x[0]);
        } else if(x[0].type == "vid") {
            renderer.movie(x[0]);
        } else if(x[0].type == "widget") {
            renderer.widget(x[0]);
        }
    }

}

function RenderingToolKit() {
    this.image = function(data) {
        var viewport = document.getElementById("viewport").querySelector("#content").querySelector(".container");
        //Render image to the viewport
        var el = document.createElement("img");
        
        var zIndex = data.zIndex;
        var name = data.name;

        el.src = "./extraResources/data/files/" + name;

        el.style = `
            z-index: ` + zIndex + `;
            position: absolute;
            top: 0;
            left: 0;
            border-radius: 0.25rem;
            height: 15%;
            width: auto;
        `;

        viewport.appendChild(el);



    },
    this.widget = function(data) {

    },
    this.movie = function(data) {

    }
}