
function generalMenu() {
    var parent = menus.tools.setup("General");

    var openFiles = document.createElement("button");
    openFiles.setAttribute("style", `
        display: inline-block;
    `);
    openFiles.setAttribute("class", "smooth-shadow fd-button");
    openFiles.innerHTML = "Open file location"
    openFiles.addEventListener("click", function() {
        require('child_process').exec('start "" "' + __dirname +'"');
    })

    parent.appendChild(openFiles);

    var info = document.createElement("div");
    parent.appendChild(info)
    info.setAttribute("class", "info-circle");
    info.innerHTML = "?";

    menus.info(info, "Opens the file explorer in the program file path.")


    var holder = document.createElement("div");
    holder.setAttribute("style", `
        heihgt: fit-content;
        width: fit-content;
        display: block;
    `)

    var p = document.createElement("p");
    p.setAttribute("style", `
        color: white;
        margin-top: 2rem;
        margin-bottom: 0.5rem;
        font-weight: lighter;
        display: inline-block;
    `);
    p.innerHTML = "Wait time for information popup";

    var info = document.createElement("div");
    info.setAttribute("class", "info-circle");
    info.innerHTML = "?";

    menus.info(info, "An information popup is the box that appears with additional information when you hover over an element for a given amount of time. Here, you can adjust the time it takes for the box to appear. Try hovering your mouse over 'Seconds' to the right of the input box below to see what one looks like.");

    holder.appendChild(p)
    holder.appendChild(info);
    parent.appendChild(holder);


    //Load the time value from the cfg file

    fs.readFile("./data/programData/userPreferences.json", (err, data) => {
        if(err) throw err;
        var dat = JSON.parse(data);
        var time = dat.infoHoverTime / 1000;
        var cols = dat.newProjCols;
        var layers = dat.newProjLayers;


//-------------------------------



        var input = document.createElement("input");
        input.setAttribute("class", "fd-button");
        input.setAttribute("type", "number");
        input.value = time;
        input.setAttribute("style", `
            width: 5rem;
            cursor: default;
            font-size: 1.2rem;
            display: inline-block;
        `);

        input.addEventListener("change", function() {
            fs.readFile("./data/programData/userPreferences.json", (err, data) => {
                if(err) throw err;

                var dat = JSON.parse(data);
                dat.infoHoverTime = input.value*1000;

                fs.writeFile("./data/programData/userPreferences.json", JSON.stringify(dat, null, 2), (err) => {
                    if(err) throw err;
                    loadConfig();
                });
            });
        });
        
        parent.appendChild(input);
        
        var p = document.   createElement("p");
        p.innerHTML = "Seconds";
        p.setAttribute("style", `
            color: white;
            font-weight: lighter;
            display: inline-block;
            margin: 0;
            margin-left: 1rem;
        `);
        infoOnHover(p, "This is an information popup");


        parent.appendChild(p);
        





        //Reminder: parent is the container element






//---------------------------




        //Set the startup column amount when creating a new project
        var holder = document.createElement("div");
        holder.setAttribute("style", `
            heihgt: fit-content;
            width: fit-content;
            display: block;
        `)
    
        var p = document.createElement("p");
        p.setAttribute("style", `
            color: white;
            margin-top: 2rem;
            margin-bottom: 0.5rem;
            font-weight: lighter;
            display: inline-block;
        `);
        p.innerHTML = "Amount of columns in new projects";
    
        var info = document.createElement("div");
        info.setAttribute("class", "info-circle");
        info.innerHTML = "?";
    
        menus.info(info, "Here, you can choose how many columns there should be in the timeline at the bottom of the screen by default when creating a new project");
    
        holder.appendChild(p)
        holder.appendChild(info);
        parent.appendChild(holder);


        var input = document.createElement("input");
        input.setAttribute("class", "fd-button");
        input.setAttribute("type", "number");
        input.value = cols;
        input.setAttribute("style", `
            width: 5rem;
            cursor: default;
            font-size: 1.2rem;
            display: inline-block;
        `);

        input.addEventListener("change", function() {
            fs.readFile("./data/programData/userPreferences.json", (err, data) => {
                if(err) throw err;

                var dat = JSON.parse(data);
                dat.newProjCols = input.value;

                fs.writeFile("./data/programData/userPreferences.json", JSON.stringify(dat, null, 2), (err) => {
                    if(err) throw err;
                    loadConfig();
                });
            });
        });
        
        parent.appendChild(input);




//-------------------------





//Set the startup layer amount when creating a new project
var holder = document.createElement("div");
holder.setAttribute("style", `
    heihgt: fit-content;
    width: fit-content;
    display: block;
`)

var p = document.createElement("p");
p.setAttribute("style", `
    color: white;
    margin-top: 2rem;
    margin-bottom: 0.5rem;
    font-weight: lighter;
    display: inline-block;
`);
p.innerHTML = "Amount of layers in new projects";

var info = document.createElement("div");
info.setAttribute("class", "info-circle");
info.innerHTML = "?";

menus.info(info, "Here, you can choose how many layers there should be in the timeline at the bottom of the screen by default when creating a new project");

holder.appendChild(p)
holder.appendChild(info);
parent.appendChild(holder);


var input1 = document.createElement("input");
input1.setAttribute("class", "fd-button");
input1.setAttribute("type", "number");
input1.value = layers-1;
input1.setAttribute("style", `
    width: 5rem;
    cursor: default;
    font-size: 1.2rem;
    display: inline-block;
`);

input1.addEventListener("change", function() {
    fs.readFile("./data/programData/userPreferences.json", (err, data) => {
        if(err) throw err;

        var dat = JSON.parse(data);
        dat.newProjLayers = parseInt(input1.value)+1;

        fs.writeFile("./data/programData/userPreferences.json", JSON.stringify(dat, null, 2), (err) => {
            if(err) throw err;
            loadConfig();
        });
    });
});

parent.appendChild(input1);






    })
    }














    function ticTacToegame() {
        var parent = menus.tools.setup("Tic Tac Toe");


        var p = document.createElement("p");
        p.innerHTML = "So you've found the secret easter egg! :) <br><br><br>Coming soon!"
        p.setAttribute("style", `
            color: white;
            margin: 0;
        `)
        parent.appendChild(p);
    
        
    }