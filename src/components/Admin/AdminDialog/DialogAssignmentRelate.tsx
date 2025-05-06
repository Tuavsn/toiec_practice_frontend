import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { Dropdown } from "primereact/dropdown"
import { Fieldset } from "primereact/fieldset"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { Toast } from "primereact/toast"
import { TreeNode } from "primereact/treenode"
import React, { MutableRefObject, useState } from "react"
import { useParams } from "react-router-dom"
import { callDeleteAssignmentQuestion, callPostAssignmentQuestion, callPutAssignmentQuestionUpdate } from "../../../api/api"
import { useToast } from "../../../context/ToastProvider"
import { DialogAssignmentQuestionActionProps, DialogQuestionPageProps } from "../../../utils/types/props"
import { LectureID, QuestionNumber, Resource, ResourceIndex, UpdateAssignmentQuestionForm } from "../../../utils/types/type"
import ResourceSection from "../AdminQuestionResourceSection/ResourceSection"

// Định nghĩa component DialogForQuestionPage sử dụng React.FC với React.memo để tối ưu hiệu suất
export const DialogForQuestionPage: React.FC<DialogQuestionPageProps> = React.memo(
    ({ setIsDialogVisible, dialogBodyVisible, title }) => {

        // Trả về component Dialog với các thuộc tính và nội dung được truyền vào
        return (
            <Dialog
                style={{ maxWidth: "80vw" }}            // Thiết lập chiều rộng tối đa cho Dialog
                header={title}                          // Tiêu đề của Dialog lấy từ prop title
                visible={dialogBodyVisible !== null}    // Hiển thị Dialog nếu dialogBodyVisible không phải null
                modal={false}                           // Đặt Dialog không ở chế độ modal (cho phép tương tác ngoài dialog)
                onHide={() => setIsDialogVisible(null)} // Đóng Dialog khi sự kiện onHide xảy ra
            >
                {dialogBodyVisible                      /* Nội dung của Dialog lấy từ prop dialogBodyVisible*/}
            </Dialog>
        );
    }
);


// Định nghĩa component DialogActionButton sử dụng React.FC với React.memo để tối ưu hiệu suất
export const DialogQuestionActionButton: React.FC<DialogAssignmentQuestionActionProps> = React.memo(
    ({ setIsVisible, isVisible, title, currentSelectedQuestion, setReload }) => {

        return (
            <Dialog
                onHide={() => setIsVisible(false)}           // Đóng Dialog khi sự kiện onHide xảy ra
                visible={isVisible}                          // Hiển thị Dialog khi isVisible là true
                header={title}                               // Tiêu đề của Dialog lấy từ prop title
                style={{ width: "80vw" }}                    // Thiết lập chiều rộng của Dialog
            >
                {title === "Xóa" ?                          // Kiểm tra nếu tiêu đề là "Xóa"
                    <RenderDeleteAssignmentQuestionBody          // Hiển thị nội dung xóa câu hỏi
                        setReload={setReload} // Truyền hàm setReload vào RenderDeleteAssignmentQuestionBody    
                        currentSelectedQuestion={currentSelectedQuestion} // Truyền câu hỏi hiện tại vào RenderDeleteAssignmentQuestionBody>
                    />
                    :
                    <RenderUpdateQuestionBody               // Hiển thị nội dung cập nhật câu hỏi
                        currentSelectedQuestion={currentSelectedQuestion} // Truyền câu hỏi hiện tại vào RenderUpdateQuestionBody
                        setReload={setReload} // Truyền hàm setReload vào RenderUpdateQuestionBody
                    />
                }
            </Dialog>
        );
    }
);


interface RenderDeleteAssignmentQuestionBodyProps {
    currentSelectedQuestion: MutableRefObject<TreeNode>;
    setReload: React.Dispatch<React.SetStateAction<boolean>>; // Hàm để thay đổi trạng thái reload
}
const RenderDeleteAssignmentQuestionBody: React.FC<RenderDeleteAssignmentQuestionBodyProps> = React.memo(
    ({ currentSelectedQuestion, setReload }) => {
        const { toast } = useToast();
        const { lecture_id = "" } = useParams<{ lecture_id: LectureID }>();
        const [isDisabled, setIsDisabled] = useState<boolean>(false);
        const questionNum = currentSelectedQuestion.current.data.questionNum as QuestionNumber;
        return (
            <React.Fragment>

                <h1 className='text-center'>Bạn có chắc muốn xóa câu <q>#{questionNum}</q> ?</h1>
                <div className="flex justify-content-end">
                    <Button disabled={isDisabled} label="Xác nhận" icon="pi pi-save" onClick={() => { handleDelete(lecture_id, questionNum, toast, setReload); setIsDisabled(true) }} />
                </div>
            </React.Fragment>
        )
    }
);

// khi nhấn nút Xóa
async function handleDelete(lecture_id: LectureID, index: number, toast: React.MutableRefObject<Toast | null>, setReload: React.Dispatch<React.SetStateAction<boolean>>) {
    const success = await callDeleteAssignmentQuestion(lecture_id, index);


    if (success) {
        toast.current?.show({ severity: 'success', summary: "Thành công", detail: "Thao tác thành công" });
        setReload((prev) => !prev); // Đảo ngược trạng thái reload để cập nhật lại dữ liệu
    } else {
        toast.current?.show({ severity: 'error', summary: "Lỗi", detail: "Thao tác thất bại" });
    }
};

interface RenderUpdateAssignmentQuestionBodyProps {
    currentSelectedQuestion: MutableRefObject<TreeNode>;
    setReload: React.Dispatch<React.SetStateAction<boolean>>; // Hàm để thay đổi trạng thái reload
}
const RenderUpdateQuestionBody: React.FC<RenderUpdateAssignmentQuestionBodyProps> = React.memo(
    ({ currentSelectedQuestion, setReload }) => {
        const { toast } = useToast();
        const [resources, setResourses] = useState<ResourceIndex[]>((currentSelectedQuestion.current.data.resources as Resource[]).map((res, index) => ({ ...res, index, file: null })))
        const { lecture_id = "" } = useParams<{ lecture_id: LectureID }>();
        const [formData, setFormData] = useState<UpdateAssignmentQuestionForm>({
            correctAnswer: currentSelectedQuestion.current.data.correctChoice as string,
            explanation: currentSelectedQuestion.current.data.explanation as string,
            transcript: currentSelectedQuestion.current.data.transcript as string,
            answers: currentSelectedQuestion.current.data.choices as string[],
            content: currentSelectedQuestion.current.data.ask as string,
            questionNum: currentSelectedQuestion.current.data.questionNum as QuestionNumber,

        });

        const handleChange = (e: { target: { name: any; value: any; }; }) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
        };
        // khi nhấn nút Lưu
        const handleSave = () => {
            const upsertQuestion = async () => {
                let success = false;
                if (formData.questionNum) {
                    success = await callPutAssignmentQuestionUpdate(formData, lecture_id, resources);
                } else {
                    success = await callPostAssignmentQuestion(formData, lecture_id, resources);
                }
                if (success) {
                    toast.current?.show({ severity: 'success', content: "Thao tác thành công" });
                    setReload((prev) => !prev); // Đảo ngược trạng thái reload để cập nhật lại dữ liệu
                } else {
                    toast.current?.show({ severity: 'error', content: "Thao tác thất bại" });

                }
            }
            upsertQuestion();
        };

        return (
            <Fieldset legend={formData.questionNum ? "Sửa câu hỏi" : "Tạo câu hỏi"} >
                <section className='flex flex-wrap gap-4 justify-content-space'>


                    {/* Content */}
                    <div className="field flex-1">
                        <label className='block' htmlFor="content">Content</label>
                        <InputTextarea
                            style={{ width: '20vw', resize: 'none' }}
                            id="content"
                            name="content"
                            value={formData.content || ""}
                            onChange={handleChange}
                            rows={10}
                        />
                    </div>


                    {/* Transcript */}
                    <div className="field flex-1">
                        <label className='block' htmlFor="transcript">Transcript</label>
                        <InputTextarea
                            style={{ width: '30vw', resize: 'none' }}
                            id="transcript"
                            name="transcript"
                            value={formData.transcript || ''}
                            onChange={handleChange}
                            rows={10}
                            cols={30}
                            autoResize={false}
                        />
                    </div>

                    {/* Explanation */}
                    <div className="field flex-1">
                        <label className='block' htmlFor="explanation">Explanation</label>
                        <InputTextarea
                            className='' style={{ width: '30vw', resize: 'none' }}
                            id="explanation"
                            name="explanation"
                            value={formData.explanation || ''}
                            onChange={handleChange}
                            rows={10}
                            autoResize={false}
                        />
                    </div>

                    {/* Answers */}
                    <div className="field flex-1">
                        <p className='m-0 mb-2'>Answers</p>
                        <div >

                            {formData.answers.map((answer, index) => (
                                <div key={index} className='flex'>
                                    <InputText
                                        name={'answer' + index}
                                        className='flex-1'
                                        value={answer}
                                        onChange={(e) => {
                                            const updatedAnswers = [...formData.answers];
                                            updatedAnswers[index] = e.target.value;
                                            setFormData({ ...formData, answers: updatedAnswers });
                                        }}
                                        placeholder={`Answer ${index + 1}`}
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-text p-button-danger inline"
                                        onClick={() => {
                                            const updatedAnswers = formData.answers.filter((_, i) => i !== index);
                                            setFormData({ ...formData, answers: updatedAnswers });
                                        }}
                                    />
                                </div>
                            ))}
                            <Button
                                icon="pi pi-plus"
                                className="p-button-text"
                                onClick={() => setFormData({ ...formData, answers: [...formData.answers, ''] })}
                            >
                                Add Answer
                            </Button>
                        </div>


                        {/* Correct Answer */}
                        <div className="field flex-1">
                            <p className='block m-0 mb-2 text-right'><b>Correct Answer</b></p>
                            <Dropdown
                                className='bg-green-200'
                                name="correctAnswer"
                                value={formData.correctAnswer}
                                options={formData.answers.map((answer) => ({ label: answer, value: answer }))}
                                onChange={handleChange}
                                placeholder="Select Correct Answer"
                            />
                        </div>
                    </div>

                </section>
                <ResourceSection resourseIndexes={resources} setResourseIndexes={setResourses} />

                {/* Save Button */}
                <div className="field flex justify-content-end">
                    <Button label="Lưu" icon="pi pi-save" onClick={handleSave} />
                </div>

            </Fieldset>
        );
    }
)

