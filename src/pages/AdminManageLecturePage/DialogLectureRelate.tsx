import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import React, { useRef, useState } from "react";
import { useToast } from "../../context/ToastProvider";
import useTopicRef from "../../hooks/TopicHook";
import { emptyLectureRowValue } from "../../utils/types/emptyValue";
import { DialogLectureBodyProps, DialogLectureProps, RenderLectureDialogParams, Topic, TopicID } from "../../utils/types/type";
import EditCourseRichTextBox from "../../components/Common/richTextBox/richTextBox";



export const DialogLectureActionButton: React.FC<DialogLectureProps> = React.memo(
    ({ currentSelectedLecture, dispatch, job }) => {

        const topicListRef = useTopicRef();
        const [header, body] = RenderDialog({ job, currentSelectedLecture, dispatch, topicListRef });

        return (
            <Dialog
                onHide={() => dispatch({ type: "TOGGLE_DIALOG", payload: "" })}           // Đóng Dialog khi sự kiện onHide xảy ra
                header={header}
                visible={header != ""}                       // Tiêu đề của Dialog lấy từ prop title
                style={{ width: "80vw" }}                    // Thiết lập chiều rộng của Dialog
                maximizable
                maximized={job === "PAGE_DESIGNER" || job === "QUESTION_EDITOR"}
            >
                {body}
            </Dialog>
        );
    }
);

function RenderDialog(params: RenderLectureDialogParams): [string, JSX.Element] {

    switch (params.job) {
        case "CREATE":
            return ["Tạo bài giảng mới", <RenderUpdateLectureBody currentSelectedLecture={emptyLectureRowValue} dispatch={params.dispatch} topicListRef={params.topicListRef} />];
        case "UPDATE":
            return [`Sửa bài giảng ${params.currentSelectedLecture.name}`, <RenderUpdateLectureBody currentSelectedLecture={params.currentSelectedLecture} dispatch={params.dispatch} topicListRef={params.topicListRef} />];
        case "DELETE":
            return [`Xóa bài giảng ${params.currentSelectedLecture.name}`, <h1 className='text-center'>Bạn có chắc muốn xóa</h1>];
        case "PAGE_DESIGNER":
            return [`Viết bài giảng ${params.currentSelectedLecture.name}`, <EditCourseRichTextBox lectureID={params.currentSelectedLecture.id} />];
        case "QUESTION_EDITOR":
            return [`Tạo câu hỏi bài giảng ${params.currentSelectedLecture.name}`, <RenderUpdateLectureBody currentSelectedLecture={params.currentSelectedLecture} dispatch={params.dispatch} topicListRef={params.topicListRef} />];
    }
    return ["", <>Lỗi</>]
};


function GetIDNameTopicPair(topicList: Topic[]) {
    return topicList.map((topic) => ({ label: topic.name, value: topic.id }))
}

const RenderUpdateLectureBody: React.FC<DialogLectureBodyProps> = React.memo(
    (props) => {
        const inputRef = useRef<HTMLInputElement | null>(null);
        const [topicIds, setTopicIds] = useState<TopicID[]>(props.currentSelectedLecture.topic.map(t => t.id));
        const { toast } = useToast();


        // khi nhấn nút Lưu
        const handleSave = () => {
            console.log("Hello update");
            // toast.current?.show({ severity: 'success', content: "Sửa thành công" });
            // callPutQuestionUpdate(formData);
            const updateQuestion = async () => {
                const questionUpdatedResponse: any = ""
                if (questionUpdatedResponse) {
                    if (questionUpdatedResponse.status == 200) {
                        toast.current?.show({ severity: 'success', content: "Sửa thành công" });
                    } else {
                        toast.current?.show({ severity: 'error', content: questionUpdatedResponse.error });
                    }
                }
            }
            updateQuestion();
        };
        return (
            <Fieldset legend="Sửa câu hỏi" >
                <section className='flex flex-column gap-4 justify-content-space'>

                    {/* Transcript */}
                    <div className="field flex-1">
                        <label className='block' htmlFor="lecture">Tiêu Đề Bài giảng</label>
                        <InputText id="lecture" name="name" autoComplete="additional-name" ref={inputRef} defaultValue={props.currentSelectedLecture.name} />
                    </div>
                    {/* Topics */}
                    <div className="field flex-1">
                        <label className='block' htmlFor="topicIds">Chủ đề</label>
                        <MultiSelect name="topicIds" display='chip' placeholder="Select Topics" style={{ width: '100%', maxWidth: "70vw" }} value={topicIds} onChange={(e) => setTopicIds([...e.value])} options={GetIDNameTopicPair(props.topicListRef.current)} />
                    </div>
                </section>
                {/* Save Button */}
                <div className="field flex justify-content-end">
                    <Button label="Lưu" icon="pi pi-save" onClick={handleSave} />
                </div>

            </Fieldset>
        );
    }
)

