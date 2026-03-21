import ReactQuill, { Quill } from "react-quill-new";
import { useReferencePopup } from "../hooks/referencePopupProvider";
import 'react-quill-new/dist/quill.snow.css';
import '../styles/richTextEditor.css'
import { useRef } from "react";
import React from "react";
import { WLdomid } from '../utils/uid'

const QuillTextFormat = Quill.import('blots/inline');
const customIcons = Quill.import('ui/icons');
customIcons['articleReference'] = '<i class="fa-solid fa-link" style="color: var(--text-color);"></i>';

class ArticleReferenceBlot extends QuillTextFormat {
    static blotName = 'articleReference';
    static tagName = 'a';
    static className = 'quill-article-reference';

    static create(value) {
        let node = super.create();
        node.classList.add('quill-button-link');
        value = JSON.parse(value)
        
        node.value = value.text
        node.setAttribute(
            'onclick',
            `
            openArticleReference("${value.id}");

            return false;
            `
        ); 

        node.setAttribute(
            'id',
            `${value.id}`
        ); 
 
        return node;
    }

    static formats(node) {
        let content = {
            id: node.getAttribute('id'),
            text: node.innerText
        };

        return JSON.stringify(content)
    }
}

//TODO
Quill.register(ArticleReferenceBlot, false)

export default function RichTextEditor (props){
    const openPopup = useReferencePopup();
    return (
        <RichTextEditorInternal {...props} referencePopup={openPopup}>

        </RichTextEditorInternal>
    )
}

class RichTextEditorInternal extends React.Component{
    #editorRef
    #reactQuillRef
    #openPopup 
    #id
    value
    setValue
    PromptName
    props

    handleArticleReferences = async (value) => {
        let quill = this.#editorRef;
        let range = quill.getSelection();
        if (!range.length) {
            return
        }
        
        const val = await this.#openPopup();
        
        if(val) {
            quill.formatText(range.index, range.length, {'articleReference': val})
            quill.setSelection(range.index + range.length);
            quill.format('articleReference', false);
        }
    }

    componentDidMount() {
        this.attachQuillRefs();
    }

    componentDidUpdate() {
        this.attachQuillRefs();
    }


    attachQuillRefs = () => {
      if (typeof this.#reactQuillRef.getEditor !== 'function') return;
      this.#editorRef = this.#reactQuillRef.getEditor();
    };



    constructor(props) {
        super(props)
        this.props = props;

        const {PromptName, value, setValue, referencePopup} = this.props;
        this.#openPopup = referencePopup;
        this.#editorRef = null;
        this.#reactQuillRef = null;
        this.value = value;
        this.setValue = setValue;
        this.PromptName = PromptName;
        this.#id = WLdomid();

        window.openArticleReference = (id) => {
            sessionStorage.setItem("Article", id)
            window.location = '/article'
        }
    }

    render(){
        const {PromptName, value, setValue, referencePopup} = this.props;
        this.#openPopup = referencePopup;
        this.#editorRef = null;
        this.#reactQuillRef = null;
        this.value = value;
        this.setValue = setValue;
        this.PromptName = PromptName;
        this.#id = WLdomid();

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
                    articleReference: this.handleArticleReferences,
                }
            }
        };

        return ( 
            <ReactQuill 
                theme = "snow"
                value = {
                    this.value?.ops ? this.value : { ops: this.value ?? [] }
                }
                modules={modules}            
                id={this.#id}
                key={this.value ? "loaded" : "loading"}
                className="prompt richtext-prompt"
                ref={(el) => {
                    this.#reactQuillRef = el;
                }}
                onChange={
                    (val, delta, src, editor) => {
                        let contents = editor.getContents()
                        if(JSON.stringify(contents) != JSON.stringify(this.value)) this.setValue(contents)
                    }
                }
            />
        )
    }
    
}
