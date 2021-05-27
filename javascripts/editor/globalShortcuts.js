setTimeout(()=>{

    const hook = require("iohook");
    
    hook.on("keypress", event =>{
        console.log(event);
    })
  }, 1000)