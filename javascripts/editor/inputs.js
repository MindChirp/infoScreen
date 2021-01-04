const fsinputs = {
    dropdown: function(arr) {
        var el = document.createElement("div");
        el.setAttribute("class", "select");

        var list = document.createElement("select");
        list.style.color = "var(--paragraph-color)"

        el.appendChild(list);
        var x;
        for(x of arr) {
            var opt = document.createElement("option");
            opt.innerHTML = x;
            list.appendChild(opt);
            opt.style.color = "var(--paragraph-color)"
        }


        var arr = document.createElement("div");
        arr.setAttribute("class", "select_arrow");

        el.appendChild(arr);

        return el;
    }
}



////////////////////////////////////
// Input types for the tab system //
////////////////////////////////////

function TabSystem() {
    this.input = function(title, type, unit) {
        var el = document.createElement("div");
        el.style = `
            width: fit-content;
            height: fit-content;
            float: left;
        `;

        var p = document.createElement("p");
        p.innerHTML = title;
        p.style = `
            margin: 0;
            line-height: 1rem;
            font-weight: lighter;
        `
        el.appendChild(p);

        var input = document.createElement("input");
        input.style = `
            height: 2rem;
            width: 5rem;
            border-radius: 0.25rem 0.25rem 0 0;
            background-color: 
            margin: 0;
            background-color: var(--main-bg-color);
            border: solid 2px var(--slider-color);
            outline: none;
            padding: 0.25rem;
            box-sizing: border-box;
            font-size: 1.2em;
            color: var(--paragraph-color);
            font-family: bahnschrift;
            font-weight: lighter;
        `
        switch(type) {
            case "number": 
                input.type = "number"
            break;
            case "search":
                input.type = "search"
            break;
        }
        el.appendChild(input);

        if(unit) {
            var p = document.createElement("p");
            p.innerHTML = unit;
            p.style = `
                display: inline-block;
                margin-left: 0.5rem;
                color: var(--paragraph-color);
                opacity: 0.6;
            `;
            input.style.display = "inline-block";
            el.appendChild(p);
        }

        return el;
    }

}