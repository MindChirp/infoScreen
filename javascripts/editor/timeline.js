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



//This is the main way to display a slide
function activateColumnNo(no, direction) {
    //no        --> column number
    //direction --> 1: next
    //              0: prev
    var cols = document.getElementsByClassName("timeline-column");
    if(direction) {
        //Do something that i couldn't be bothered to code right now
        if(direction == 2) {
            var i = renderer.renderedColumn();
            if(i > 0) {
                activateColumnNo(i-1);
            }
            return;
        } else if(direction == 1) {
            var i = renderer.renderedColumn();
            var cols = document.getElementsByClassName("timeline-column");
            if(i < cols.length) {
                activateColumnNo(i+1);
            }
            return;
        }
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

    updateEditPage();
}
function columnChangeCallBack(mutationList, observer) {
    //asdhasd
    mutationList.forEach( (mutation) => {
        if(mutation.type == "childList") {
            //An element has been added or removed to the column.
            //Handle the added nodes
            //if(mutation.addedNodes[0].innerHTML == "Time" || mutation.addedNodes[0].innerHTML == "Weather" || mutation.addedNodes[0].innerHTML == "News") 
            
            if(!mutation.addedNodes[0] || mutation.addedNodes[0].innerHTML == undefined) {
                //No.
            } else {

            if(mutation.addedNodes[0].getAttribute("class") != "scrubber-element") return;
            //Get the changed column index
            if(mutation.addedNodes[0].getAttribute("class") == "scrubber-element") {

                var addedNode = mutation.addedNodes[0].closest(".scrubber-element");
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
        }
    })
}


function selectCell(el) {
    var unselect = (el) => {
        el.style.backgroundColor = "transparent";
        el.selected = false;
        el.classList.remove("selected");
    }
    var select = (el, options) => {
        el.style.backgroundColor = "rgba(18, 26, 33,1)";
        el.selected = true;
        el.classList.add("selected");
        el.style.boxShadow = "";
        if(options) {
            if(options.multiple) {
                //el.style.boxShadow = "none";
            }
        }
    }


        
    if(!el.selected) {
        select(el);
    } else {
        unselect(el)
    }

    //Shift select logic
    if(globalKeyPresses.shiftKey && !globalKeyPresses.ctrlKey & !globalKeyPresses.altKey) {
        if(!el.selected) {
            select(el);
        }
        
        //Get the first selected element
        var sels = document.getElementsByClassName("timeline-row selected");
        var firstAnchor = sels[0];
        var secondAnchor = sels[1];

        //Get the layer of each file
        var ind1;
        var ind2;


        var col1 = firstAnchor.closest(".timeline-column");
        var col2 = secondAnchor.closest(".timeline-column");


        if(col1 == col2) {
            unselect(secondAnchor);
            return;
        }

        for(let i = 0; i < col1.childNodes.length; i++) {
            if(col1.childNodes[i] == firstAnchor) {
                ind1 = i;
                break
            }
        }

        for(let i = 0; i < col2.childNodes.length; i++) {
            if(col2.childNodes[i] == secondAnchor) {
                ind2 = i;
                break
            }
        }

        if(ind1 != ind2) {
            unselect(el);
            return;
        }
        


        //Get all the columns in between
        var cols = document.getElementsByClassName("timeline-column");

        //Get the slide number of both columns
        var slide1;
        var slide2;

        for(let i = 0; i < cols.length; i++) {
            if(cols[i] == col1) {
                slide1 = i;
            }
        }

        for(let i = 0; i < cols.length; i++) {
            if(cols[i] == col2) {
                slide2 = i;
            }
        }

        //Iterate through the columns
        for(let i = slide1; i < slide2; i++) {
            select(cols[i].childNodes[ind1], {multiple: true});
        }

    } else {
        var sels = document.getElementsByClassName("timeline-row selected");
        var x;
        var arr = [];
        for(x of sels) {
            if(x != el) {
                arr.push(x);
            }
        }

        var x;
        for(x of arr) {
            unselect(x)
        } 

    }

}


function unselectAllCells() {
    var unselect = (el) => {
        el.style.backgroundColor = "transparent";
        el.selected = false;
        el.classList.remove("selected");
    }

    var sels = document.getElementsByClassName("timeline-row selected");
    var x;
    var arr = [];
    for(x of sels) {
        if(x != el) {
            arr.push(x);
        }
    }

    var x;
    for(x of arr) {
        unselect(x)
    } 
}