import '/global.js'
import "../libs/jquery.min.js"
import "../libs/dist/jstree.js"
import "../libs/quill.js"

window.JSTreeState = [{
    "id": 1,
    "text": "Root",
    "children": []
}]

$('#tree').jstree({
    "core": {
        "animation": 0,
        "check_callback": true,
        'themes': {
            'name': 'proton',
            'responsive': true
        },
        'data': window.JSTreeState
    },
    "types": {
        "#": {
            "max_children": 1,
            "max_depth": 9,
            "valid_children": ["root"]
        },
        "root": {
            "icon": "fa-solid fa-book",
            "valid_children": ["default", "file"]
        },
        "default": {
            "valid_children": ["default", "file"]
        },
        "file": {
            "icon": "fa-solid fa-file",
            "valid_children": []
        }
    },
    "plugins": [
        "contextmenu", "dnd", "search",
        "state", "types", "wholerow"
    ]
});


var quill = new Quill('#text-editor', {
    theme: 'snow',
    modules: {
        toolbar: {
            container: [
                [{
                    'header': [1, 2, false]
                }],
                ['bold', 'italic', 'underline'],
                ["link", 'image'],
                [{
                    'list': 'ordered'
                }, {
                    'list': 'bullet'
                }]
            ],
            handlers: {
                link: function (value)  {
                    if (value) {
                        var href = prompt('Name:');
                        if(!href.startsWith("manuscript:")){
                          this.quill.format('link', `Articles/${href}`);
                        }else{
                          this.quill.format('link', `Manuscripts/${href}`);
                        }
                    } else {
                        this.quill.format('link', false);
                    }

                },
            }
        }
    },

});



const resizeable = (containerName) => {
    const sb = $(containerName)
    const sb_resize = $(containerName + " .resize-button")
    let startWidth = sb.width()

    sb_resize.on("mousedown", (e) => {
        sb.attr("resizing", true)
    })

    $(document).on("mousemove", (e) => {
        if (sb.attr("resizing") == "true") {
            sb.css("width", `${$(document).width()-e.pageX}`)
        }
    })

    $(document).on("mouseup", (e) => {
        sb.attr("resizing", false)
    })
}

$(() => {
    resizeable(".sidebar-container");
})