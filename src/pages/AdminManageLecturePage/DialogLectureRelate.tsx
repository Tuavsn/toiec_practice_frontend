import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import React, { useRef, useState } from "react";
import { callPutLectureActive, callPostLectureDetail, callPutLectureDetailUpdate } from "../../api/api";
import EditCourseRichTextBox from "../../components/Common/richTextBox/richTextBox";
import { useToast } from "../../context/ToastProvider";
import useTopicRef from "../../hooks/TopicRefHook";
import { emptyLectureRowValue } from "../../utils/types/emptyValue";
import { DialogDeleteLectureBodyProps, DialogLectureProps, DialogUpdateLectureBodyProps, handeDeleteLectureParams, handeSaveLectureParams, RenderLectureDialogParams, Topic, TopicID } from "../../utils/types/type";



// Thành phần DialogLectureActionButton sử dụng React.memo để tối ưu hiệu suất (chỉ render lại khi props thay đổi)
export const DialogLectureActionButton: React.FC<DialogLectureProps> = React.memo(
    ({ currentSelectedLecture, dispatch, job }) => {

        // Khai báo hook useTopicRef để tham chiếu đến danh sách chủ đề (topics)
        const topicListRef = useTopicRef();

        // Render nội dung của Dialog, bao gồm header và body, từ hàm RenderDialog
        const [header, body] = RenderDialog({ job, currentSelectedLecture, dispatch, topicListRef });

        return (
            <Dialog
                // Đóng Dialog khi sự kiện onHide xảy ra, dispatch hành động để thay đổi trạng thái
                onHide={() => dispatch({ type: "TOGGLE_DIALOG", payload: "" })}
                header={header}                                                         // Tiêu đề của Dialog lấy từ prop header
                visible={header != ""}                                                  // Nếu header không trống, Dialog sẽ hiển thị
                style={{ width: "80vw" }}                                               // Thiết lập chiều rộng của Dialog (80% của viewport)
                maximizable                                                             // Cho phép người dùng tối đa hóa Dialog
                maximized={job === "PAGE_DESIGNER" || job === "QUESTION_EDITOR"}        // Mở tối đa Dialog nếu job là PAGE_DESIGNER hoặc QUESTION_EDITOR
            >
                {body                                                                   /* Nội dung của Dialog */}
            </Dialog>
        );
    }
);



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------




// Hàm RenderDialog nhận đối số là params và trả về một mảng gồm một chuỗi tiêu đề và một phần tử JSX (nội dung của Dialog)
function RenderDialog(params: RenderLectureDialogParams): [string, JSX.Element] {

    // Dựa trên giá trị của params.job, hàm sẽ trả về tiêu đề và nội dung phù hợp
    switch (params.job) {
        case "CREATE"://------------------------------------ Khi job là CREATE, hiển thị tiêu đề "Tạo bài giảng mới" và nội dung RenderUpdateLectureBody với giá trị bài giảng rỗng

            return ["Tạo bài giảng mới",
                <RenderUpdateLectureBody dispatch={params.dispatch} topicListRef={params.topicListRef} currentSelectedLecture={emptyLectureRowValue} />
            ];
        case "UPDATE"://------------------------------------- Khi job là UPDATE, hiển thị tiêu đề "Sửa bài giảng" cùng với tên của bài giảng hiện tại và nội dung RenderUpdateLectureBody với bài giảng đã chọn

            return [`Sửa bài giảng ${params.currentSelectedLecture.name}`,
            <RenderUpdateLectureBody dispatch={params.dispatch} topicListRef={params.topicListRef} currentSelectedLecture={params.currentSelectedLecture} />
            ];
        case "DELETE"://------------------------------------- Khi job là DELETE, hiển thị tiêu đề "Xóa bài giảng" cùng với tên của bài giảng hiện tại và một thông báo xác nhận xóa

            return [`Xóa bài giảng ${params.currentSelectedLecture.name}`,
            <RenderDeleteLectureBody currentSelectedLecture={params.currentSelectedLecture} dispatch={params.dispatch} />
            ];
        case "PAGE_DESIGNER"://------------------------------- Khi job là PAGE_DESIGNER, hiển thị tiêu đề "Viết bài giảng" và nội dung là EditCourseRichTextBox

            return [`Viết bài giảng ${params.currentSelectedLecture.name}`,
            <EditCourseRichTextBox lectureID={params.currentSelectedLecture.id} />
            ];
    }

    // Trả về giá trị mặc định nếu không có case nào phù hợp (đây là trường hợp lỗi)
    return ["", <>Lỗi</>]
};





//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------





function GetIDNameTopicPair(topicList: Topic[]) {
    return topicList.map((topic) => ({ label: topic.name, value: topic.id }))
}





//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------



const RenderUpdateLectureBody: React.FC<DialogUpdateLectureBodyProps> = React.memo(
    (props) => {
        const inputRef = useRef<HTMLInputElement | null>(null);
        const [topicIds, setTopicIds] = useState<TopicID[]>(props.currentSelectedLecture.topic.map(t => t.id));
        const { toast } = useToast();
        const [isDisabled, setIsDisabled] = useState(false);
        const title = useRef<string>(props.currentSelectedLecture.id ? "Sửa bài giảng" : "Thêm bài giảng");
        return (
            <Fieldset legend={title.current} >
                <section className='flex flex-column gap-4 justify-content-space'>
                    {
                        /* -----------------------------------------------------Tiêu đề bài giảng ----------------------------------------------------------------------------------------------------------*/
                        <div className="field flex-1">
                            <label className='block' htmlFor="lecture">Tiêu Đề Bài giảng</label>
                            <InputText id="lecture" name="name" autoComplete="additional-name" ref={inputRef} defaultValue={props.currentSelectedLecture.name} />
                        </div>
                        /* -----------------------------------------------------================= ----------------------------------------------------------------------------------------------------------*/

                    }

                    {
                        /* -----------------------------------------------------Chủ đề ---------------------------------------------------------------------------------------------------------------------*/
                        <div className="field flex-1">
                            <label className='block' htmlFor="topicIds">Chủ đề</label>
                            <MultiSelect name="topicIds" display='chip' placeholder="Select Topics" style={{ width: '100%', maxWidth: "70vw" }} value={topicIds} onChange={(e) => setTopicIds([...e.value])} options={GetIDNameTopicPair(props.topicListRef.current)} />
                        </div>
                        /* -----------------------------------------------------================= ----------------------------------------------------------------------------------------------------------*/
                    }
                </section>
                {/* Save Button */}
                <div className="field flex justify-content-end">
                    <Button label="Lưu" icon="pi pi-save" disabled={isDisabled} onClick={() => handleSave({ lectureID: props.currentSelectedLecture.id, title: inputRef.current?.value || "", dispatch: props.dispatch, toast, topicIds, setIsDisabled })} />
                </div>

            </Fieldset>
        );
    }
)



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------




// khi nhấn nút Lưu
async function handleSave(params: handeSaveLectureParams) {
    if (!params.title.trim() || !params.topicIds.length) {
        params.toast.current?.show({ severity: 'error', summary: "Cảnh báo", detail: "Tên bài giảng cùng danh sách chủ đề không được phép để trống" });
        return;
    }
    let success = false;
    params.setIsDisabled(true);
    if (params.lectureID) {
        success = await callPutLectureDetailUpdate(params.lectureID, params.title, params.topicIds);
    } else {
        success = await callPostLectureDetail(params.title, params.topicIds);
    }
    params.setIsDisabled(false);
    if (success) {
        params.toast.current?.show({ severity: 'success', summary: "Thành công", detail: "Thao tác thành công" });
        params.dispatch({ type: "REFRESH_DATA" });
    } else {
        params.toast.current?.show({ severity: 'error', summary: "Lỗi", detail: "Sửa thất bại" });
    }
};

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------


const RenderDeleteLectureBody: React.FC<DialogDeleteLectureBodyProps> = React.memo(
    (props) => {
        const { toast } = useToast();
        const text = props.currentSelectedLecture.active ? "xóa" : "khôi phục";
        return (
            <React.Fragment>

                <h1 className='text-center'>Bạn có chắc muốn {text} <q>{props.currentSelectedLecture.name}</q> ?</h1>
                <div className="flex justify-content-end">
                    <Button label="Xác nhận" icon="pi pi-save" onClick={() => handleDelete({ lecture: props.currentSelectedLecture, dispatch: props.dispatch, toast })} />
                </div>
            </React.Fragment>
        )
    }
)



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------



// khi nhấn nút Xóa
async function handleDelete(params: handeDeleteLectureParams) {
    const success = await callPutLectureActive(params.lecture);


    if (success) {
        params.toast.current?.show({ severity: 'success', summary: "Thành công", detail: "Thao tác thành công" });
        params.dispatch({ type: "REFRESH_DATA" });
    } else {
        params.toast.current?.show({ severity: 'error', summary: "Lỗi", detail: "Thao tác thất bại" });
    }
};