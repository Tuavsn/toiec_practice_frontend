import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useRef, useState } from "react";
import { callPostTopic, callPutTopicRowActive, callPutUpdateTopic } from "../../../api/api";
import { useToast } from "../../../context/ToastProvider";
import { emptyTopicRowValue } from "../../../utils/types/emptyValue";
import { DialogDeleteRowBodyProps, DialogRowProps, DialogUpdateTopicBodyProps, handeDeleteRowParams, handeSaveRowParams, RenderRowDialogParams, Topic } from "../../../utils/types/type";


// Thành phần DialogTopicActionButton sử dụng React.memo để tối ưu hiệu suất (chỉ render lại khi props thay đổi)
export const DialogTopicActionButton: React.FC<DialogRowProps<Topic>> = React.memo(
    ({ currentSelectedRow, dispatch, job }) => {

        // Render nội dung của Dialog, bao gồm header và body, từ hàm RenderDialog
        const [header, body] = RenderDialog({ job, currentSelectedRow, dispatch });

        return (
            <Dialog
                // Đóng Dialog khi sự kiện onHide xảy ra, dispatch hành động để thay đổi trạng thái
                onHide={() => dispatch({ type: "TOGGLE_DIALOG", payload: "" })}
                header={header}                                                         // Tiêu đề của Dialog lấy từ prop header
                visible={header != ""}                                                  // Nếu header không trống, Dialog sẽ hiển thị
                style={{ width: "80vw" }}                                               // Thiết lập chiều rộng của Dialog (80% của viewport)
                maximizable                                                             // Cho phép chủ đề tối đa hóa Dialog

            >
                {body                                                                   /* Nội dung của Dialog */}
            </Dialog>
        );
    }
);



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------




// Hàm RenderDialog nhận đối số là params và trả về một mảng gồm một chuỗi tiêu đề và một phần tử JSX (nội dung của Dialog)
function RenderDialog(params: RenderRowDialogParams<Topic>): [string, JSX.Element] {

    // Dựa trên giá trị của params.job, hàm sẽ trả về tiêu đề và nội dung phù hợp
    switch (params.job) {

        case "DELETE"://------------------------------------- Khi job là DELETE, hiển thị tiêu đề "Xóa chủ đề" cùng với tên của chủ đề hiện tại và một thông báo xác nhận xóa

            return [`Xóa chủ đề ${params.currentSelectedRow.name}`,
            <RenderDeleteTopicBody currentSelectedRow={params.currentSelectedRow} dispatch={params.dispatch} />
            ];
        case "CREATE"://------------------------------------- Khi job là DELETE, hiển thị tiêu đề "Xóa chủ đề" cùng với tên của chủ đề hiện tại và một thông báo xác nhận xóa

            return [`Tạo chủ đề mới`,
                <RenderUpsertTopicBody currentSelectedRow={params.currentSelectedRow} dispatch={params.dispatch} />
            ];
        case "UPDATE"://------------------------------------- Khi job là DELETE, hiển thị tiêu đề "Xóa chủ đề" cùng với tên của chủ đề hiện tại và một thông báo xác nhận xóa

            return [`Cập nhật chủ đề ${params.currentSelectedRow.name}`,
            <RenderUpsertTopicBody currentSelectedRow={params.currentSelectedRow} dispatch={params.dispatch} />
            ];
    }

    // Trả về giá trị mặc định nếu không có case nào phù hợp (đây là trường hợp lỗi)
    return ["", <>Lỗi</>]
};



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
type UpsertTopicForm = {
    name: string,
    solution: string,
    overallSkill: "Từ vựng" | "Ngữ pháp"
}

const RenderUpsertTopicBody: React.FC<DialogUpdateTopicBodyProps> = React.memo(
    (props) => {
        const [formData, setFormData] = useState<UpsertTopicForm>({ ...emptyTopicRowValue })
        const { toast } = useToast();
        const [isDisabled, setIsDisabled] = useState(false);
        const title = useRef<string>(props.currentSelectedRow.id ? "Sửa chủ đề" : "Thêm chủ đề");
        return (
            <Fieldset legend={title.current} >
                <section className='flex flex-row flex-wrap gap-4 justify-content-space'>
                    {
                        /* -----------------------------------------------------tên chủ đề ----------------------------------------------------------------------------------------------------------*/
                        <div className="field flex-1">
                            <label className='block' htmlFor="row">Tên</label>
                            <InputText id="row" name="row" value={formData.name} required autoComplete="additional-name" onChange={(e) => setFormData({ ...formData, name: e.target.value || "" })} />
                        </div>
                        /* -----------------------------------------------------================= ----------------------------------------------------------------------------------------------------------*/

                    }

                    {
                        <div className="field flex-1">
                            <label className='block' htmlFor="solution">Giải pháp</label>
                            <InputTextarea
                                style={{ width: '20vw', resize: 'none' }}
                                id="solution"
                                name="solution"
                                value={formData.solution || ""}
                                onChange={(e) => setFormData({ ...formData, solution: e.target.value || "" })}
                                rows={10}
                            />
                        </div>
                    }
                    {
                        <div className="field flex-1">
                            <Dropdown
                                name="overall skill"
                                value={formData.overallSkill}
                                options={[{ label: "Từ vựng", value: "Từ vựng" }, { label: "Ngữ pháp", value: "Ngữ pháp" }]}
                                onChange={(e) => setFormData({ ...formData, overallSkill: e.target.value || "" })}
                                placeholder="Chọn loại"
                            />
                        </div>
                    }
                </section>
                {/* Save Button */}
                <div className="field flex justify-content-end mt-5">
                    <Button label="Lưu" icon="pi pi-save" disabled={isDisabled} onClick={() => handleSave({ row: { ...props.currentSelectedRow, ...formData }, dispatch: props.dispatch, toast, setIsDisabled })} />
                </div>

            </Fieldset>
        );
    }
)


//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// khi nhấn nút Lưu
async function handleSave(params: handeSaveRowParams<Topic>) {
    if (!params.row.name.trim() || !params.row.solution) {
        params.toast.current?.show({ severity: 'error', summary: "Cảnh báo", detail: "Tên chủ đề / giải pháp không được phép để trống" });
        return;
    }
    params.setIsDisabled(true);
    let success = false;
    if (params.row.id) {
        success = await callPutUpdateTopic(params.row);
    } else {
        success = await callPostTopic(params.row);
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


const RenderDeleteTopicBody: React.FC<DialogDeleteRowBodyProps<Topic>> = React.memo(
    (props) => {
        const { toast } = useToast();
        const [isDisabled, setIsDisabled] = useState<boolean>(false);
        const text = props.currentSelectedRow.active ? "xóa" : "khôi phục";
        return (
            <React.Fragment>

                <h1 className='text-center'>Bạn có chắc muốn {text} <q>{props.currentSelectedRow.name}</q> ?</h1>
                <div className="flex justify-content-end">
                    <Button disabled={isDisabled} label="Xác nhận" icon="pi pi-save" onClick={() => { handleDelete({ row: props.currentSelectedRow, dispatch: props.dispatch, toast }); setIsDisabled(true) }} />
                </div>
            </React.Fragment>
        )
    }
)



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------



// khi nhấn nút Xóa
async function handleDelete(params: handeDeleteRowParams<Topic>) {
    const success = await callPutTopicRowActive(params.row);


    if (success) {
        params.toast.current?.show({ severity: 'success', summary: "Thành công", detail: "Thao tác thành công" });
        params.dispatch({ type: "REFRESH_DATA" });
    } else {
        params.toast.current?.show({ severity: 'error', summary: "Lỗi", detail: "Thao tác thất bại" });
    }
};
