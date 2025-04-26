import React from "react";
import { RichEditorProps } from "../../../utils/types/props";

const RenderHeader: React.FC<RichEditorProps> = React.memo(
    (props) => {
        // const color = dirty.current ? "bg-yellow-500" : "bg-green-500"
        return (
            <React.Fragment>
                <span className="ql-formats">
                    <button ref={props.button} className={`bg-green-500`} style={{ width: "60px" }} onClick={(e) => props.saveText(e, props.text)} >Lưu</button>
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
    }
)
export default RenderHeader