import ReactQuill, { Quill } from "react-quill-new";
import { useReferencePopup } from "../hooks/referencePopupProvider";
import 'react-quill-new/dist/quill.snow.css';
import '../styles/richTextEditor.css'
import { useRef } from "react";
import { WLdomid } from '../utils/uid'

export default function RichTextEditor({PromptName, value, setValue}) {
    const openPopup = useReferencePopup();
    const editor = useRef();

    let id = WLdomid();

    const handleArticleReferences = (value) => {
        console.log(editor.current)
        let quill = editor.current.editor
        let range = quill.getSelection();
        if (!range.length) {
            return
        }

        openPopup().then(val => {
            console.log(val)
        })

        if (value) {
            quill.formatText(range.index, range.length, 'articleReference', value);
            quill.setSelection(range.index + range.length);
            quill.format('articleReference', false);
        }

    }

    const modules = {
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
            handlers: {
                articleReference: handleArticleReferences,
            }
        }
    };


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
            ref={editor}
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