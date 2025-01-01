import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Fieldset } from "primereact/fieldset";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import React, { useRef, useState } from "react";
import { callPostTest, callPostUpdateTest, callPutDeleteTestRow } from "../../../api/api";
import { useToast } from "../../../context/ToastProvider";
import { RenderTestRowDialogParams, handeDeleteRowParams, handeSaveRowParams } from "../../../utils/types/prams";
import { DialogDeleteRowBodyProps, DialogTestRowProps, DialogUpdateTestBodyProps } from "../../../utils/types/props";
import { TestRow } from "../../../utils/types/type";


// Thành phần DialogTestActionButton sử dụng React.memo để tối ưu hiệu suất (chỉ render lại khi props thay đổi)
export const DialogTestActionButton: React.FC<DialogTestRowProps> = React.memo(
    ({ currentSelectedRow, dispatch, job, categoryName }) => {

        // Render nội dung của Dialog, bao gồm header và body, từ hàm RenderDialog
        const [header, body] = RenderDialog({ job, currentSelectedRow, dispatch, categoryName });

        return (
            <Dialog
                // Đóng Dialog khi sự kiện onHide xảy ra, dispatch hành động để thay đổi trạng thái
                onHide={() => dispatch({ type: "TOGGLE_DIALOG", payload: "" })}
                header={header}                                                         // Tiêu đề của Dialog lấy từ prop header
                visible={header != ""}                                                  // Nếu header không trống, Dialog sẽ hiển thị
                style={{ width: "80vw" }}                                               // Thiết lập chiều rộng của Dialog (80% của viewport)
                maximizable                                                             // Cho phép bộ đề tối đa hóa Dialog

            >
                {body                                                                   /* Nội dung của Dialog */}
            </Dialog>
        );
    }
);



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------




// Hàm RenderDialog nhận đối số là params và trả về một mảng gồm một chuỗi tiêu đề và một phần tử JSX (nội dung của Dialog)
function RenderDialog(params: RenderTestRowDialogParams): [string, JSX.Element] {

    // Dựa trên giá trị của params.job, hàm sẽ trả về tiêu đề và nội dung phù hợp
    switch (params.job) {

        case "DELETE"://------------------------------------- Khi job là DELETE, hiển thị tiêu đề "Xóa bộ đề" cùng với tên của bộ đề hiện tại và một thông báo xác nhận xóa
            {
                const text = params.currentSelectedRow.active ? "Xóa" : "Khôi phục";
                return [`${text} đề ${params.currentSelectedRow.name} thuộc ${params.categoryName}`,
                <RenderDeleteTestBody currentSelectedRow={params.currentSelectedRow} dispatch={params.dispatch} />
                ];
            }
        case "CREATE"://------------------------------------- Khi job là DELETE, hiển thị tiêu đề "Xóa bộ đề" cùng với tên của bộ đề hiện tại và một thông báo xác nhận xóa

            return [`Tạo đề mới thuộc ${params.categoryName}`,
            <RenderUpsertTestBody currentSelectedRow={params.currentSelectedRow} dispatch={params.dispatch} />
            ];
        case "UPDATE"://------------------------------------- Khi job là DELETE, hiển thị tiêu đề "Xóa bộ đề" cùng với tên của bộ đề hiện tại và một thông báo xác nhận xóa

            return [`Cập nhật đề ${params.currentSelectedRow.name} thuộc ${params.categoryName}`,
            <RenderUpsertTestBody currentSelectedRow={params.currentSelectedRow} dispatch={params.dispatch} />
            ];
    }

    // Trả về giá trị mặc định nếu không có case nào phù hợp (đây là trường hợp lỗi)
    return ["", <>Lỗi</>]
};



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------


const RenderUpsertTestBody: React.FC<DialogUpdateTestBodyProps> = React.memo(
    (props) => {
        const [formData, setFormData] = useState<TestRow>(props.currentSelectedRow);
        const { toast } = useToast();
        const title = useRef<string>(props.currentSelectedRow.id ? "Sửa đề thi" : "Thêm đề thi");
        const [isDisabled, setIsDisabled] = useState(false);
        const onInputTextChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof TestRow) => {
            const value = e.target.value === null ? '' : e.target.value; // Handle text input
            setFormData((prevRow) => ({
                ...prevRow,
                [field]: value
            }));
        };

        const onInputNumberChange = (e: InputNumberValueChangeEvent, field: keyof TestRow) => {
            const value = e.value === null ? 0 : e.value; // Handle number input, default to 0 if null
            setFormData((prevRow) => ({
                ...prevRow,
                [field]: value
            }));
        };

        return (
            <Fieldset legend={title.current} >
                <section className='flex flex-column gap-4 justify-content-space'>
                    {
                        /* -----------------------------------------------------Định dạng bộ đề ----------------------------------------------------------------------------------------------------------*/
                        <div className="field flex-1">
                            <label className='block' htmlFor="row">Tên đề</label>
                            <InputText id="row" name="row" value={formData.name} required autoComplete="additional-name" onChange={(e) => onInputTextChange(e, 'name')} />
                        </div>
                        /* -----------------------------------------------------================= ----------------------------------------------------------------------------------------------------------*/

                    }
                    {
                        <div className="field flex-1">
                            <label htmlFor="totalQuestion" className="font-bold block mb-2">Số câu hỏi</label>
                            <InputNumber inputId="totalQuestion" value={formData.totalQuestion} onValueChange={(e) => onInputNumberChange(e, 'totalQuestion')} />
                        </div>
                    }
                    {
                        <div className="field flex-1">
                            <label htmlFor="limitTime" className="font-bold block mb-2">Thời gian làm bài</label>
                            <InputNumber inputId="limitTime" value={formData.limitTime} onValueChange={(e) => onInputNumberChange(e, 'limitTime')} />
                        </div>
                    }
                    {
                        <div className="field flex-1">
                            <label htmlFor="totalScore" className="font-bold block mb-2">Điểm tối đa</label>
                            <InputNumber inputId="totalScore" value={formData.totalScore} onValueChange={(e) => onInputNumberChange(e, 'totalScore')} />
                        </div>
                    }
                </section>
                {/* Save Button */}
                <div className="field flex justify-content-end">
                    <Button label="Lưu" icon="pi pi-save" disabled={isDisabled} onClick={() => { handleSave({ row: formData, dispatch: props.dispatch, toast, setIsDisabled }) }} />
                </div>

            </Fieldset>
        );
    }
)


//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// khi nhấn nút Lưu
async function handleSave(params: handeSaveRowParams<TestRow>) {
    if (!params.row.name.trim()) {
        params.toast.current?.show({ severity: 'error', summary: "Cảnh báo", detail: "Tên đề thi không được phép để trống" });
        return;
    }
    params.setIsDisabled(true);
    let success = false;
    if (params.row.id) {
        success = await callPostUpdateTest(params.row);
    } else {
        success = await callPostTest(params.row);
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


const RenderDeleteTestBody: React.FC<DialogDeleteRowBodyProps<TestRow>> = React.memo(
    (props) => {
        const { toast } = useToast();
        const text = props.currentSelectedRow.active ? "xóa" : "khôi phục";
        return (
            <React.Fragment>

                <h1 className='text-center'>Bạn có chắc muốn {text} <q>{props.currentSelectedRow.name}</q> ?</h1>
                <div className="flex justify-content-end">
                    <Button label="Xác nhận" icon="pi pi-save" onClick={() => handleDelete({ row: props.currentSelectedRow, dispatch: props.dispatch, toast })} />
                </div>
            </React.Fragment>
        )
    }
)



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------



// khi nhấn nút Xóa
async function handleDelete(params: handeDeleteRowParams<TestRow>) {
    const success = await callPutDeleteTestRow(params.row);


    if (success) {
        params.toast.current?.show({ severity: 'success', summary: "Thành công", detail: "Xóa thành công" });
        params.dispatch({ type: "REFRESH_DATA" });
    } else {
        params.toast.current?.show({ severity: 'error', summary: "Lỗi", detail: "Xóa thất bại" });
    }
};
