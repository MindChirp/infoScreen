const fsinputs = {
    dropdown: function(arr) {
        var el = document.createElement("div");
        el.setAttribute("class", "select");

        var list = document.createElement("select");
        el.appendChild(list);
        var x;
        for(x of arr) {
            var opt = document.createElement("option");
            opt.innerHTML = x;
            list.appendChild(opt);
        }


        var arr = document.createElement("div");
        arr.setAttribute("class", "select_arrow");

        el.appendChild(arr);

        return el;
    }
}