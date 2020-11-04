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