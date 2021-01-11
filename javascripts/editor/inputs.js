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
            display: block;
            margin-bottom: 0.5rem;
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
                margin: 0 0 0 0.5rem;
                color: var(--paragraph-color);
                opacity: 0.6;
            `;
            input.style.display = "inline-block";
            el.appendChild(p);
        }

        return el;
    },
    this.slider = function(title) {
        var el = document.createElement("div");
        el.style = `
            width: 100%;
            height: fit-content;
            float: left;
            display: block;
        `;

        var p = document.createElement("p");
        p.innerHTML = title;
        p.style = `
            margin: 0;
            line-height: 1rem;
            font-weight: lighter;
        `
        el.appendChild(p);

        var slider = document.createElement("input");
        slider.style = `
            margin: 0;  
            width: 100%;
        `
        slider.className = "fd-slider";
        slider.type = "range";
        el.appendChild(slider);
        return el;
    },
    this.checkBox = function(title) {
        var cont = document.createElement("div");
        cont.style = `
            width: 100%;
            height: fit-content;
            float: left;
            display: block;
            margin-top: 0.2rem;
        `;
        var el = document.createElement("label");
        el.className = "control control-checkbox";
        el.innerHTML = title;
        var box = document.createElement("input");
        box.type = "checkbox";

        box.isActive = false;

        //BUG: Two ripples appear. Fix this sometime!!
        //el.classList.add("ripple-element");
        //appendRipple(el);
        var ind = document.createElement("div");
        ind.className = "control_indicator";

        el.appendChild(box);
        el.appendChild(ind);
        cont.appendChild(el);
    
        return cont;

/*
        <label class="control control-checkbox">
        First checkbox
            <input type="checkbox" checked="checked" />
        <div class="control_indicator"></div>
    </label>*/

    }

}