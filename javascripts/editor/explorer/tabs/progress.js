function progContent(config) {
    var wr = document.createElement("div");
    var scale = tabInputs.input("Scale", "number", "%");
    scale.className = "scale";
    var val = config.widgetAttributes.progress.scale;
    scale.getElementsByTagName("input")[0].value = val*100;
    wr.appendChild(scale);
    
    return wr;
}