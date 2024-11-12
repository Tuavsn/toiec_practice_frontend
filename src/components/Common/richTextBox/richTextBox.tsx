
import React, { useEffect, useState } from "react";
import { Editor, EditorTextChangeEvent } from "primereact/editor";

export default function EditCourseRichTextBox(props: { content: string }) {
    const [text, setText] = useState<string>('');
    const [dirty, setDirty] = useState<boolean>(false);
    useEffect(() => {
        setText(props.content);
        setDirty(false);
    }, [])


    const header = renderHeader(dirty);

    return (
        <div className="card">
            <Editor value={text} onTextChange={(e: EditorTextChangeEvent) => { if (e.htmlValue) { setDirty(true); } setText(e.htmlValue ?? "") }} headerTemplate={header} style={{ height: '320px' }} />
        </div>
    )
}


const renderHeader = (dirty: boolean) => {
    return (
        <React.Fragment>
            <span className="ql-formats">
                <button className="bg-yellow-500 min-w-min">Lưu {dirty ? '*' : ''}</button>
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