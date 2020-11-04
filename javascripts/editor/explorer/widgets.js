//Widgets


function loadWidgets() {
    var cont = document.getElementById("widgets");
    //clock widget
    var el = document.createElement("div");
    el.setAttribute("class", "explorer-widget");
    el.setAttribute("type", "widget");
    el.setAttribute("name", "time");
    cont.appendChild(el);
    var h1 = document.createElement("h1");
    h1.setAttribute("style", `
        height: 100%;
        width: 100%;
        margin: 0;
        text-align: center;
        line-height: 6rem;
        font-weight: lighter;
    `);
    el.appendChild(h1);
    setInterval(function() {
        updateClockWidgets()
    }, 500);

    //weather widget
    var el = document.createElement("div");
    el.setAttribute("class", "explorer-widget");
    var h1 = document.createElement("h1");
    h1.innerHTML = "Weather";
    h1.setAttribute("style", `
        height: 100%;
        width: 100%;
        margin: 0;
        text-align: center;
        line-height: 6rem;
        font-weight: lighter;
    `);
    el.setAttribute("type", "widget");
    el.appendChild(h1);
    cont.appendChild(el);

}


function updateClockWidgets() {
    //Update widgets in explorer
    //Firstly check if the widgets tab is opened (to save resources)
    var cont = document.getElementById("widgets");
    if(cont.style.display != "none") {
        var time = document.getElementsByName("time")[0].childNodes[0];
        var date = new Date();
        hours = (date.getHours() > 9) ? date.getHours() : "0" + date.getHours();
        minutes = (date.getMinutes() > 9) ? date.getMinutes() : "0" + date.getMinutes();
        seconds = (date.getSeconds() > 9) ? date.getSeconds() : "0" + date.getSeconds();
        time.innerHTML = hours + ":" + minutes + ":" + seconds;
    }
}