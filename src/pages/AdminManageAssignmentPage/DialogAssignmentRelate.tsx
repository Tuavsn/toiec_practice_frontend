import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { Dropdown } from "primereact/dropdown"
import { Fieldset } from "primereact/fieldset"
import { InputNumber } from "primereact/inputnumber"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { MultiSelect } from "primereact/multiselect"
import React, { useState } from "react"
import { callPostAssignmentQuestion, callPutQuestionUpdate } from "../../api/api"
import { DialogQuestionActionProps, DialogQuestionPageProps, Topic, UpdateQuestionDialogProps, UpdateQuestionForm } from "../../utils/types/type"
import { useToast } from "../../context/ToastProvider"

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
export const DialogQuestionActionButton: React.FC<DialogQuestionActionProps> = React.memo(
    ({ setIsVisible, isVisible, title, topicList, currentSelectedQuestion }) => {

        return (
            <Dialog
                onHide={() => setIsVisible(false)}           // Đóng Dialog khi sự kiện onHide xảy ra
                visible={isVisible}                          // Hiển thị Dialog khi isVisible là true
                header={title}                               // Tiêu đề của Dialog lấy từ prop title
                style={{ width: "80vw" }}                    // Thiết lập chiều rộng của Dialog
            >
                {title === "Xóa" ?                          // Kiểm tra nếu tiêu đề là "Xóa"
                    <h1 className='text-center'>Bạn có chắc muốn xóa</h1> // Hiển thị nội dung xác nhận xóa
                    :
                    <RenderUpdateQuestionBody               // Hiển thị nội dung cập nhật câu hỏi
                        topicList={topicList}               // Truyền danh sách chủ đề vào RenderUpdateQuestionBody
                        currentSelectedQuestion={currentSelectedQuestion} // Truyền câu hỏi hiện tại vào RenderUpdateQuestionBody
                    />
                }
            </Dialog>
        );
    }
);



const RenderUpdateQuestionBody: React.FC<UpdateQuestionDialogProps> = React.memo(
    ({ currentSelectedQuestion, topicList, }) => {
        const { toast } = useToast();
        const [formData, setFormData] = useState<UpdateQuestionForm>({
            listTopicIds: (currentSelectedQuestion.current.data.topic as Topic[]).map((t) => t.id),
            correctAnswer: currentSelectedQuestion.current.data.correctChoice as string,
            explanation: currentSelectedQuestion.current.data.explanation as string,
            difficulty: currentSelectedQuestion.current.data.difficulty as number,
            transcript: currentSelectedQuestion.current.data.transcript as string,
            practiceId: currentSelectedQuestion.current.data.practiceID as string,
            answers: currentSelectedQuestion.current.data.choices as string[],
            content: currentSelectedQuestion.current.data.ask as string,
            testId: currentSelectedQuestion.current.data.testID,
            id: currentSelectedQuestion.current.key as string,
        });

        const handleChange = (e: { target: { name: any; value: any; }; }) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
        };
        // khi nhấn nút Lưu
        const handleSave = () => {
            const upsertQuestion = async () => {
                let success = false;
                if (formData.id) {
                    success = await callPutQuestionUpdate(formData);
                } else {
                    success = await callPostAssignmentQuestion(formData);
                }
                if (success) {
                    toast.current?.show({ severity: 'success', content: "Thao tác thành công" });
                } else {
                    toast.current?.show({ severity: 'error', content: "Thao tác thất bại" });

                }
            }
            upsertQuestion();
        };

        return (
            <Fieldset legend={formData.id ? "Sửa câu hỏi" : "Tạo câu hỏi"} >
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

                    {/* Difficulty */}
                    <div className="field flex-1">
                        <p className='m-0 mb-2'>Difficulty</p>
                        <InputNumber
                            name="difficulty"
                            value={formData.difficulty}
                            onValueChange={(e) => setFormData({ ...formData, difficulty: e.value ?? 0 })}
                            min={1}
                            max={990}
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
                    {/* Topics */}
                    <div className="field flex-1">
                        <p className='m-0 mb-2'>Topics</p>
                        <MultiSelect
                            style={{ width: '100%', maxWidth: "70vw" }}
                            name="listTopicIds"
                            value={formData.listTopicIds}
                            options={topicList.current.map((topic) => ({ label: topic.name, value: topic.id }))}
                            onChange={(e) => setFormData((prev) => ({ ...prev, listTopicIds: e.value as string[] }))}
                            placeholder="Select Topics"
                            display='chip'
                        />
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

