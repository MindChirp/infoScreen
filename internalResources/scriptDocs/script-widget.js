const scrDocs = {
    menus: [
        {
            label: "Creating an element",
            content: [
                {string: "Nothing found."}
            ]
        },
        {
            label: "How to style an element",
            content: [
                {string: "Nothing found."}
            ]
        },
        {
            label: "Assign element functionality",
            content: [
                {string: "Nothing found"}
            ]
        },
        {
            label: "InfoScreen APIs",
            content: [
                {
                    menu: {
                        label: "Slide progression management",
                        content: [
                            {
                                menu: {
                                    label: "Change slides",
                                    content: [
                                        {code: "const toolKit = new ApiTools()<br>toolKit.nextSlide() //(or: toolKit.prevSlide())"},
                                        {string: "You can also select a slide number. If the slide you are trying to select doesn't exist, an error will be returned."},
                                        {code: "const toolKit = new ApiTools()<br>toolKit.selectSlide(slide number)"},
                                        {string: "NOTE: Start counting from zero. The first slide has the value of 0, the second 1, the third 2, and so on."}
                                    ]
                                } 
                            },
                            {
                                menu: {
                                    label: "Get selected slide",
                                    content: [
                                        {code: "const toolKit = new ApiTools()<br>toolKit.selectedSlide()"},
                                        {string: "Returns a number. The lowest possible value is 0."},
                                        {string: "Complete example:"},
                                        {code: "const toolKit = new ApiTools()<br>var slide = toolKit.selectedSlide();<br>console.log(slide);"}
                                    ]
                                }
                            }
                            
                        ]
                    }
                },
                {
                    menu: {
                        label: "Communicating with the InfoScreen server",
                        content: [
                            {string: "The infoScreen server is usually hosted by the user itself. To gain access to the server, one must know its ip-address."},
                            {code: "var xhr = new XMLHttpRequest();<br>xhr.open('POST', *ip-address*/scriptAuth);<br>xhr.send(formData);"},
                            {string: "To connect to the official infoScreen server, do the following"},
                            {code: "var xhr = new XMLHttpRequest();<br>xhr.open('POST', 'https://shrouded-wave-54128.herokuapp.com/scriptAuth');<br>xhr.send(formData);"},
                            {string: "THIS FUNCTION IS NOT ENABLED YET"},
                            {menu: {
                                label: "Authentication formatting",
                                content: [
                                    {string: "All requests must be preceded with identifying information. Start by appending your assinged username and password to each server request like so:"},
                                    {code: "var formData = new FormData();<br>formData.append('username', '*user-name*');<br>formData.append('token': '*token-id*');"},
                                    {string: "The token should <strong>not</strong> be a password you use elsewhere."}
                                ]
                            }},
                            {string: "Continue by following the standard XMLHttpRequest procedures."}
                        ]
                    }
                },
                {
                    menu: {
                        label: "Slide manipulation",
                        content: [
                            {string: "You can edit other elements while they are being displayed with a script widget."},
                            {menu: {
                                label: "Alter appearance",
                                content: [
                                    {string: "Other elements can have their appearance altered."},
                                    {string: "Editing elements on different slides can be done by using the globalFetch method:"},
                                    {code: "const toolKit = new ApiTools();<br>var element = toolKit.globalFetch(*id*);"},
                                    {string: "This is however a bit resource intensive on larger slide shows, and therefore it is recommended to use the localFetch method if you are manipulating elements on the same slide."},
                                    {code: "const toolKit = new ApiTools();<br>var element = toolKit.localFetch(*id*);"},
                                    {string: "The examples below doesn't specify which of these methods to use. To learn how to edit these elements once they are fetched, click on a category below to learn more."},
                                    {menu: {
                                        label: "Background Color",
                                        content: [
                                            {code: "el.backgroundColor('HEX-COLOR-STRING');"}

                                        ]
                                    }},
                                    {menu: {
                                        label: "Blur",
                                        content: [
                                            {code: "el.blur(*integer*);"}
                                        ]
                                    }},
                                    {menu: {
                                        label: "Opacity",
                                        content: [
                                            {code: "el.opacity(integer);"},
                                            {string: "Number between 0 and 1."}
                                        ]
                                    }},
                                    {menu: {
                                        label: "Font Family",
                                        content: [
                                            {code: "el.fontFamily('font-family');"}
                                        ]
                                    }},
                                    {menu: {
                                        label: "Border Radius",
                                        content: [
                                            {code: "el.borderRadius(integer);"}
                                        ]
                                    }},
                                    {menu: {
                                        label: "Text Color",
                                        content: [
                                            {code: "el.color('HEX-COLOR-STRING');"}
                                        ]
                                    }},
                                    {menu: {
                                        label: "Shadow Size",
                                        content: [
                                            {code: "el.shadowSize(integer);"}
                                        ]
                                    }},
                                    {string: "More options coming later.."}
                                ]
                            }
                            },
                            {menu: {
                                label: "Alter function",
                                content: [
                                    {string: "Other elements can have their function and behaviour changed. Click on a category to learn more."},
                                    {menu: {
                                        label: "Time Format",
                                        content: [
                                            {code: "const toolKit = new ApiTools()<br>"}
                                        ]
                                    }},
                                    {menu: {
                                        label: "Clock Display Options",
                                        content: [
                                            {code: "const toolKit = new ApiTools()<br>"}
                                        ]
                                    }}
                                ]
                            }}
                        ]
                    }
                }
            ]
        },
        {
            label: "About",
            content: [
                {string: "Documentation version 0.0.1"},
                {code: "Home made by Frikk <3"}
            ]
        }
    ]
}

module.exports = { scrDocs };