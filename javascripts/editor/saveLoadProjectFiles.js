var saving = false;
function saveFile() {
    //Save the current file

    /*
    Procedure:
        1. Get all viewport data from all columns, save in each object, and push to an array.
        2. Get all the images and videos, transform them to data that can be saved in a "text" file
        3. 





    */
    if(!saving) {
        var indicator = saveIndicator();
        saving = true;
        setTimeout(function() {
            indicator.parentNode.removeChild(indicator);
            saving = false;
        }, 5000)
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    }
}



function saveIndicator() {
    var el = document.createElement("div");
    el.className = "save-progress-container smooth-shadow";

    var wheel = loaderWheel();
    el.appendChild(wheel);

    var title = document.createElement("h2");
    title.innerHTML = "Saving Project";

    el.appendChild(title);

    document.body.appendChild(el);

    return el;
}