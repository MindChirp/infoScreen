//Background-script
const bkgInterval = 100;

function activateBkgScript() {
    setInterval(function() {

        //Get the window width
        var w = window.innerWidth;

        var h = (w / 2) /16*9;

        var topCont = document.getElementById("top-portion");
        topCont.style.height = h + "px";
        


    }, bkgInterval)
}