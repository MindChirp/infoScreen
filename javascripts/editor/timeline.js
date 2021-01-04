// Highlight a column

function highlightColumn(el, entered) {
    if(document.getElementsByClassName("file-ghost")[0]) {
        if(entered) {
            el.style.backgroundColor = "var(--dark-shade)";
        } else if(!entered) {
            if(el.getAttribute("displaying") == "true") {
                el.style.backgroundColor = "#23313D";
            } else {
                
                el.style.backgroundColor = "transparent";
            }
        }
    } else {
            if(document.getElementsByClassName("file-ghost")[0]) {
                el.style.backgroundColor = "transparent";
            }
    }
}

function activateColumnNo(no, direction) {
    //no        --> column number
    //direction --> 1: next
    //              2: prev
    var cols = document.getElementsByClassName("timeline-column");
    if(direction) {
        //Do something that i couldn't be bothered to code right now

    }

    if(cols[no]) {
        var x;
        for(x of cols) {
            if(x.getAttribute("displaying") == "true") {
                x.setAttribute("displaying", "false");
                x.style.backgroundColor = "transparent";

            }
        }

        cols[no].setAttribute("displaying", "true");
        cols[no].style.backgroundColor = "#23313D";
        renderColumn(no);
    }
}

function columnChangeCallBack(mutationList, observer) {
    mutationList.forEach( (mutation) => {
        if(mutation.type == "childList") {
            //An element has been added or removed to the column.
            //Handle the added nodes
            
            if(!mutation.addedNodes[0]) return;

            //Get the changed column index
            if(mutation.addedNodes[0].getAttribute("class") == "scrubber-element") {
                var addedNode = mutation.addedNodes[0];
                var column = mutation.addedNodes[0].closest(".timeline-column");

                //Get all the columns and compare
                var columns = document.getElementsByClassName("timeline-column");
                var y;
                for(let i = 0; i < columns.length; i++) {
                    if(columns[i] == column) {
                        var index = i;
                        //Update the viewport if the column is selected
                        if(column.getAttribute("displaying") == "true") {
                            renderColumn(index);
                        }
                    }
                }
            }
        }
    })
}