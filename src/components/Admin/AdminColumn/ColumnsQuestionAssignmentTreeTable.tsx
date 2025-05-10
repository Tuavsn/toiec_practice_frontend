// ---------------------------- Các hàm template giúp hiển thị nội dung của từng cột trong bảng --------------------------------------

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { TreeNode } from "primereact/treenode";
import React from "react";
import { emptyQuestionTreeNode } from "../../../utils/types/emptyValue";
import { QuestionActionButtonProps } from "../../../utils/types/props";
import { QuestionContext, Resource } from "../../../utils/types/type";


export function RenderColumnsForTable(setContextDialogBody: React.Dispatch<React.SetStateAction<JSX.Element | null>>, setResourceDialogBody: React.Dispatch<React.SetStateAction<JSX.Element | null>>, setTitle: React.Dispatch<React.SetStateAction<string>>, setIsVisible: React.Dispatch<React.SetStateAction<boolean>>, currentSelectedQuestion: React.MutableRefObject<TreeNode>): JSX.Element[] {

    return [

        /* Cột hiển thị số thứ tự câu hỏi */
        < Column key="col-questionNum" bodyClassName="text-center" headerClassName='text-center' header="Câu" body={(data) => <div>{data ? data.data.questionNum : "1x"}</div>} />,

        /* Cột hiển thị nội dung câu hỏi (nút Chi Tiết) */
        < Column key="col-context" bodyClassName="text-center" headerClassName='text-center' header="Nội dung" body={(data) => ContextBodyTemplate(data, setContextDialogBody)} />,

        /* Cột hiển thị tài nguyên (nút Chi Tiết) */
        <Column key="col-resource" bodyClassName="text-center" headerClassName='text-center' header="Tài nguyên" body={(data) => ResourceBodyTemplate(data, setResourceDialogBody)} />,

        /* Cột hiển thị nút sửa và xóa */
        <Column key="col-action" headerClassName='text-center' header={AddNew(setTitle, setIsVisible, currentSelectedQuestion)} body={(data) => <ActionBodyTemplate questionNode={data} setTitle={setTitle} setIsVisible={setIsVisible} currentSelectedQuestion={currentSelectedQuestion} />} />,
    ]
}



// Hiển thị loại câu hỏi, với các màu sắc khác nhau dựa trên loại

// Hiển thị nút "Chi Tiết" nếu có thông tin câu hỏi như nội dung, lựa chọn, đáp án đúng, đoạn văn hoặc giải thích
export function ContextBodyTemplate(questionNode: TreeNode, setContextDialogBody: React.Dispatch<React.SetStateAction<JSX.Element | null>>): JSX.Element {
    return questionNode.data.ask ||
        questionNode.data.choices ||
        questionNode.data.correctChoice ||
        questionNode.data.transcript ||
        questionNode.data.explanation ? (
        <Button label='Chi Tiết' onClick={() => setContextDialogBody(ConvertContextToSimpleTable(questionNode.data as QuestionContext))} />
    ) : <></>
}

// Hi
// Hiển thị nút "Chi Tiết" nếu có tài nguyên (resources) đính kèm
export function ResourceBodyTemplate(questionNode: TreeNode, setResourceDialogBody: React.Dispatch<React.SetStateAction<JSX.Element | null>>): JSX.Element {
    const resources: Resource[] = questionNode.data.resources;


    return resources ? (
        <Button label='Chi Tiết' onClick={() => setResourceDialogBody(ConvertResourcesToSimpleTable(resources))} />
    ) : <></>
}

// Định nghĩa component ActionBodyTemplate, sử dụng React.memo để ghi nhớ và tránh render lại không cần thiết.
// Component này nhận các props: questionNode (node của câu hỏi), topicList (danh sách chủ đề) và toast (thông báo).
export const ActionBodyTemplate: React.FC<QuestionActionButtonProps> = React.memo(
    ({ questionNode, setTitle, setIsVisible, currentSelectedQuestion }) => {


        return (
            <div className='flex justify-content-around'>

                {/* Nút chỉnh sửa */}
                <Button icon="pi pi-pencil" rounded outlined style={{ width: "50px", height: "50px" }} onClick={() => {
                    currentSelectedQuestion.current = questionNode;
                    setTitle("Cập nhật"); // Thiết lập tiêu đề cho Dialog là "Cập nhật"
                    setIsVisible(true); // Hiển thị Dialog

                }} />

                {/* Nút xóa */}
                <Button icon={"pi pi-trash"} rounded outlined severity="danger" style={{ width: "50px", height: "50px" }} onClick={() => {
                    currentSelectedQuestion.current = questionNode
                    setTitle("Xóa"); // Thiết lập tiêu đề cho Dialog là "Xóa"
                    setIsVisible(true); // Hiển thị Dialog
                }} />
            </div>
        )
    }
);

function ConvertResourcesToSimpleTable(resources: Resource[]): JSX.Element {
    return (
        <DataTable value={resources} showGridlines scrollable>
            <Column field='type' header="Kiểu" className='text-center' />
            <Column field='content' header="Dữ liệu" headerClassName='text-center' />
        </DataTable>
    )
}

// Hàm ConvertContextToSimpleTable để chuyển đổi questionContext thành JSX.Element hiển thị dữ liệu
function ConvertContextToSimpleTable(questionContext: QuestionContext): JSX.Element {

    return ( // Bao bọc nội dung trong một section với kiểu layout flex
        <section className='flex flex-wrap gap-3'>
            {
                questionContext.ask &&                 // Kiểm tra nếu có câu hỏi (ask) Hiển thị câu hỏi trong div với border và padding
                <div className='border-solid p-2'>
                    <h3>{questionContext.ask}</h3>
                    {questionContext.choices?.map((choice, index) => {  // Duyệt qua các lựa chọn
                        let choiceElement: JSX.Element | string = '- ' + choice;
                        if (choice === questionContext.correctChoice) {   // Kiểm tra nếu đây là lựa chọn đúng
                            choiceElement = <b>{choiceElement}</b>;         // In đậm lựa chọn đúng
                        }
                        return (
                            <p key={index}>{choiceElement}</p>  // Hiển thị từng lựa chọn
                        );
                    })}
                </div>
            }
            {
                questionContext.explanation && (    // Kiểm tra nếu có giải thích Hiển thị giải thích trong div với border và padding
                    <div className='border-solid p-2'>
                        <h3>Giải thích</h3>
                        <pre style={{ whiteSpace: 'pre-wrap' }}>{questionContext.explanation /*Hiển thị giải thích với style giữ nguyên khoảng trắng*/}</pre>
                    </div>
                )
            }

            {
                questionContext.transcript && (    // Kiểm tra nếu có hội thoại (transcript)
                    <div className='border-solid p-2'>
                        <pre style={{ whiteSpace: 'pre-wrap' }}>{questionContext.transcript /* Hiển thị hội thoại với style giữ nguyên khoảng trắng */}</pre>
                    </div>
                )
            }

        </section>
    );
}

function AddNew(setTitle: React.Dispatch<React.SetStateAction<string>>, setIsVisible: React.Dispatch<React.SetStateAction<boolean>>, currentSelectedQuestion: React.MutableRefObject<TreeNode>) {
    return (
        <Button icon="pi pi-plus" rounded outlined severity="success" style={{ width: "50px", height: "50px" }} onClick={() => {
            setTitle("Tạo");
            setIsVisible(true);
            currentSelectedQuestion.current = emptyQuestionTreeNode;
        }} />
    )
}