
import { Editor } from "primereact/editor";
import { LectureID } from "../../../utils/types/type";
import RenderHeader from "./textboxToolbar";
import useRichTextBox from "../../../hooks/richTextboxHook";

export default function EditCourseRichTextBox(props: { lectureID: LectureID }) {
    const {
        text,
        button,
        EditText,
        onSaveText,
    } = useRichTextBox(props.lectureID);
    return (
        <div className="card">
            <Editor value={text.current} style={{height:"70vh"}}
                headerTemplate={<RenderHeader button={button} text={text} saveText={onSaveText} />}
                onTextChange={(e) => EditText({ e, button, text })} />
        </div>
    )
}



