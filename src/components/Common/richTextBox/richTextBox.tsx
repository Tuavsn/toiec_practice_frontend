
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import React, { useRef } from "react";

export default function EditCourseRichTextBox(props: { content: string }) {
    const text = useRef<string>(props.content);
    const button = useRef<HTMLButtonElement | null>(null);
    const header = renderHeader(button);
    const editor = useRef<Editor|null>(null);
    editor.current?.getElement()
    return (
        <div className="card">
            <Editor value={text.current} headerTemplate={header} style={{ height: '320px' }} onTextChange={
                (e) => editText(e, button, text)} />
        </div>
    )
}

function editText(e: EditorTextChangeEvent, button: React.MutableRefObject<HTMLButtonElement | null>, text: React.MutableRefObject<string>) {
    if (e.htmlValue) { button.current!.innerText = "Lưu*"; toggleButtonColor(button.current!) }
    console.log(text);
    text.current = e.htmlValue ?? ""
}


const renderHeader = (button: React.MutableRefObject<HTMLButtonElement | null>) => {
    // const color = dirty.current ? "bg-yellow-500" : "bg-green-500"
    return (
        <React.Fragment>
            <span className="ql-formats">
                <button ref={button} className={`bg-green-500`} style={{ width: "60px" }} onClick={saveText} >Lưu</button>
            </span>
            <span className="ql-formats">
                <select className="ql-font"></select>
                <select className="ql-size"></select>
            </span>
            <span className="ql-formats">
                <button className="ql-bold"></button>
                <button className="ql-italic"></button>
                <button className="ql-underline"></button>
                <button className="ql-strike"></button>
            </span>
            <span className="ql-formats">
                <select className="ql-color"></select>
                <select className="ql-background"></select>
            </span>
            <span className="ql-formats">
                <button className="ql-script" value="sub"></button>
                <button className="ql-script" value="super"></button>
            </span>
            <span className="ql-formats">
                <button className="ql-header" value="1"></button>
                <button className="ql-header" value="2"></button>
                <button className="ql-blockquote"></button>
                <button className="ql-code-block"></button>
            </span>
            <span className="ql-formats">
                <button className="ql-list" value="ordered"></button>
                <button className="ql-list" value="bullet"></button>
                <button className="ql-indent" value="-1"></button>
                <button className="ql-indent" value="+1"></button>
            </span>
            <span className="ql-formats">
                <button className="ql-direction" value="rtl"></button>
                <select className="ql-align"></select>
            </span>
            <span className="ql-formats">
                <button className="ql-link"></button>
                <button className="ql-image"></button>
                <button className="ql-video"></button>
                <button className="ql-formula"></button>
            </span>
            <span className="ql-formats">
                <button className="ql-clean"></button>
            </span>
        </React.Fragment>
    );
};

function saveText(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    toggleButtonColor(e.currentTarget);
    e.currentTarget.innerText = "Lưu";
}

function toggleButtonColor(button: HTMLButtonElement) {
    button.classList.toggle("bg-green-500");
    button.classList.toggle("bg-yellow-500");
}