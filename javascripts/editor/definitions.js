var fileDataTemplate = {
    template:
    {
        borderRadius: "0.25", 
        opacity: "1", 
        shadowMultiplier: 0, 
        blur: 0, 
        position: [10 + "px",10 + "px"], 
        size: {height: "30%", width: "30%"}, 
        display: true, 
        backgroundColor: "#ffffff",
        backgroundOpacity: "FF",
        textColor: "#000000", 
        fontSize: 4, 
        fontFamily: "Bahnschrift", 
        widgetAttributes: 
        {
            time: 
                {
                    showHours: true, 
                    showMinutes: true, 
                    showSeconds: true, 
                    showDate: false, 
                    timeFormat: "1"
                },
            script: 
                {
                    hasScript: false,
                    scriptContents: ""
                }
        }, 
        sizeType: 0,
        keepAspectRatio: true
    }
};

module.exports = { fileDataTemplate };
