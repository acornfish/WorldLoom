import { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import 'react-quill/dist/quill.snow.css';

export default function RichTextEditor({PromptName, value, setValue}) {
    const modules = {
        toolbar: [
            [{
                'header': [1, 2, false]
            }],
            ['bold', 'italic', 'underline'],
            ["link", 'image'],
            [{
                'list': 'ordered'
            }, {
                'list': 'bullet'
            }, {
                'color': []
            }],
            [{
                'align': []
            }],
            [
                'articleReference'
            ]
        ],
    };

    let id = window.domid()


    return ( 
        <ReactQuill 
            theme = "snow"
            value = {
                value
            }
            onChange = {
                setValue
            }
            modules={modules}
            id={id}
            className="prompt richtext-prompt"
        />
    )
}
    
const QuillTextFormat = Quill.import('formats/bold');
const customIcons = Quill.import('ui/icons');
customIcons['articleReference'] = '<i class="fa-solid fa-link" style="color: var(--text-color);"></i>';

class ArticleReferenceBlot extends QuillTextFormat {
    static blotName = 'articleReference';
    static tagName = 'a';
    static className = 'quill-article-reference';

    static create(value) {
        let node = super.create();
        node.classList.add('quill-button-link');
        node.value = value.text
        node.setAttribute(
            'onclick',
            `openArticleReference("${value.id}");return false`
        ); 
        node.setAttribute(
            'id',
            `${value.id}`
        ); 
        node.setAttribute(
            'type',
            `button`
        );
        return node;
    }

    static formats(node) {
        let content = {
            id: node.getAttribute('id'),
            text: node.innerText
        };

        return content
    }

}

Quill.register(ArticleReferenceBlot);