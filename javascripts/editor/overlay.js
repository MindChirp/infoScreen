function toggleOverlay() {
    if(globalSettings.overlaySettings.enableOverlay) {
        ipcRenderer.send("toggle-overlay");
    } else {
        console.log("Overlay disabled");
    }
}