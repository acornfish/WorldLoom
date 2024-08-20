import '/global.js'
import "../libs/jquery.min.js"

const container = document.querySelector('#root').nextElementSibling;

let lastReferenced = container;

$(".tree").get(0).addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
        lastReferenced = event.target.nextElementSibling;
    }
    console.log(lastReferenced)
});


function serializeTree() {
    let $tree = $(".tree")

    function serializeNode($node) {
        const children = [];
        const label = $node.find('>label').first().text();

        $node.children('ol').children('li').each(function () {
            const $child = $(this);
            if ($child.hasClass('scene')) {
                const reference = $child.find('a').attr('reference');
                children.push({
                    type: 'scene',
                    reference
                });
            } else {
                children.push(serializeNode($child));
            }
        });

        return {
            name: label,
            children
        };
    }

    return serializeNode($tree.find('li'));
}
window.serializeTree = serializeTree

function createNewScene() {
    const newscene = $('<li>', {
        class: 'scene'
    });
    const input = $('<input>', {
        type: 'text',
        placeholder: 'Enter scene name'
    });

    input.blur(() => {
        const text = $("<a>", {
            href: "#",
            onclick: "openScene(this)",
            reference: window.uid() + input.val()
        });
        text.html((input.val()))
        if (input.val() == "") {
            input.remove();
            return;
        };
        input.replaceWith(text);
    });

    input.on('keypress', (event) => {
        if (event.key === 'Enter') {
            const text = $("<a>", {
                href: "#",
                onclick: "openScene(this)",
                reference: window.uid() + input.val()
            });
            text.html((input.val()))
            if (input.val() == "") {
                input.remove();
                return;
            };
            input.replaceWith(text);
        }
    });
    // refers to the checkbox itself
    lastReferenced.previousElementSibling.checked = true;

    newscene.append(input);
    console.log(lastReferenced.nextElementSibling)
    $(lastReferenced.nextElementSibling).append(newscene)
    input.focus();
}

function createNewFolder() {
    const newFolder = $('<li>');

    const input = $('<input>', {
        type: 'text',
        placeholder: 'Enter folder name'
    });

    input.blur(() => {
        const label = $('<label>').text(input.val());
        const checkbox = $('<input>', {
            type: 'checkbox'
        });
        const ol = $('<ol>');

        if (input.val() === "") {
            input.remove();
            return;
        }

        let className = input.val() + Math.random();
        input.replaceWith(label);
        label.attr("for", className)
        checkbox.attr("id", className)
        newFolder.append(checkbox, label, ol);
    });

    input.on('keypress', (event) => {
        if (event.key === 'Enter') {
            const label = $('<label>').text(input.val());
            const checkbox = $('<input>', {
                type: 'checkbox'
            });
            const ol = $('<ol>');

            if (input.val() === "") {
                input.remove();
                return;
            }
            let className = input.val() + Math.random();
            label.attr("for", className)
            checkbox.attr("id", className)
            input.replaceWith(label);
            newFolder.append(checkbox, label, ol);
        }
    });

    newFolder.append(input);
    lastReferenced.previousElementSibling.checked = true;
    $(lastReferenced.nextElementSibling).append(newFolder);
    input.focus();
}

function openScene(e) {
    let $e = $(e);
    let reference = $e.attr("reference")
    console.log(reference)
}


function saveState(e) {
    const projectName = localStorage.getItem("CurrentProject");
    const manuscriptData = serializeTree();

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/saveManuscript");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = (response) => {
        if (xhr.status === 200) {
            console.log("Success:", response.responseText);
        } else {
            console.error("Error:", response.statusText);
        }
    }

    xhr.onerror = function (error) {
        console.error("Error:", error);
    };

    xhr.send(JSON.stringify({
        Project: projectName,
        Data: manuscriptData
    }));
}

var contextTriggerElement = document.createElement("li")
var copiedElement = document.createElement("li")


$(function () {
    $(".tree li").on('contextmenu', function (e) {
        e.preventDefault();
        e.stopPropagation()
        $('#contextMenu').css({
            left: e.pageX + 'px',
            top: e.pageY + 'px'
        }).show();
        contextTriggerElement = e.currentTarget;
    });

    $('.tree').on('mouseenter', 'li', function() {
        $(this).addClass('hovered');
    }).on('mouseleave', 'li', function() {
        $(this).removeClass('hovered');
    });
          

    $(document).on("click", function (e) {
        if (!$(e.target).closest('#contextMenu').length) {
            $('#contextMenu').hide();
        } else {
            e.preventDefault()
            e.stopPropagation()
        }
    });

    $('#contextMenu li').on("click", (e) => {
        if(contextTriggerElement.tagName.toLowerCase() != "li") return;
        console.log(copiedElement)
        switch ($(e.currentTarget).text()) {
            case "Copy":
                copiedElement = $(contextTriggerElement).clone();
                break;
            case "Cut":
                copiedElement = $(contextTriggerElement).clone();
                break;
            case "Paste":
                let copy = copiedElement.clone()
                console.log("copy")
                console.log(copy)
                if(contextTriggerElement.classList.contains("scene")){
                    contextTriggerElement.parentElement.appendChild(copy.get(0))
                }else{
                    $(contextTriggerElement).find(">ol").first().append(copy)
                }
                break;
            case "Delete":
                break;
        }
        $('#contextMenu').hide();
    });
});
window.openScene = openScene;
window.saveState = saveState;

document.querySelector('.new-scene').addEventListener('click', createNewScene);
document.querySelector('.new-folder').addEventListener('click', createNewFolder);