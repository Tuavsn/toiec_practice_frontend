import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import React, { useRef, useState } from "react";
import { callPostPermission, callPutPermissionRowActive, callPutUpdatePermission } from "../../../api/api";
import { useToast } from "../../../context/ToastProvider";
import { DialogDeleteRowBodyProps, DialogRowProps, DialogUpdatePermissionBodyProps, Permission, RenderRowDialogParams, handeDeleteRowParams, handeSaveRowParams } from "../../../utils/types/type";

// Thành phần DialogPermissionActionButton sử dụng React.memo để tối ưu hiệu suất (chỉ render lại khi props thay đổi)
export const DialogPermissionActionButton: React.FC<DialogRowProps<Permission>> = React.memo(
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
                maximizable                                                             // Cho phép quyền tối đa hóa Dialog

            >
                {body                                                                   /* Nội dung của Dialog */}
            </Dialog>
        );
    }
);



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------




// Hàm RenderDialog nhận đối số là params và trả về một mảng gồm một chuỗi tiêu đề và một phần tử JSX (nội dung của Dialog)
function RenderDialog(params: RenderRowDialogParams<Permission>): [string, JSX.Element] {

    // Dựa trên giá trị của params.job, hàm sẽ trả về tiêu đề và nội dung phù hợp
    switch (params.job) {

        case "DELETE"://------------------------------------- Khi job là DELETE, hiển thị tiêu đề "Xóa quyền" cùng với tên của quyền hiện tại và một thông báo xác nhận xóa
            {
                const text = params.currentSelectedRow.active ? "Xóa" : "Khôi phục";

                return [`${text} quyền ${params.currentSelectedRow.name}`,
                <RenderDeletePermissionBody currentSelectedRow={params.currentSelectedRow} dispatch={params.dispatch} />
                ];
            }
        case "CREATE"://------------------------------------- Khi job là DELETE, hiển thị tiêu đề "Xóa quyền" cùng với tên của quyền hiện tại và một thông báo xác nhận xóa

            return [`Tạo quyền mới`,
                <RenderUpsertPermissionBody currentSelectedRow={params.currentSelectedRow} dispatch={params.dispatch} />
            ];
        case "UPDATE"://------------------------------------- Khi job là DELETE, hiển thị tiêu đề "Xóa quyền" cùng với tên của quyền hiện tại và một thông báo xác nhận xóa

            return [`Cập nhật quyền ${params.currentSelectedRow.name}`,
            <RenderUpsertPermissionBody currentSelectedRow={params.currentSelectedRow} dispatch={params.dispatch} />
            ];
    }

    // Trả về giá trị mặc định nếu không có case nào phù hợp (đây là trường hợp lỗi)
    return ["", <>Lỗi</>]
};



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
type UpsertPermissionForm = {
    name: string;
    apiPath: string;
    method: string;
    module: string;
}

const RenderUpsertPermissionBody: React.FC<DialogUpdatePermissionBodyProps> = React.memo(
    (props) => {
        const [formData, setFormData] = useState<UpsertPermissionForm>({ ...props.currentSelectedRow})
        const { toast } = useToast();
        const [isDisabled, setIsDisabled] = useState(false);
        const title = useRef<string>(props.currentSelectedRow.id ? "Sửa quyền" : "Thêm quyền");
        return (
            <Fieldset legend={title.current} >
                <section className='flex flex-row flex-wrap gap-4 justify-content-space'>
                    {
                        /* -----------------------------------------------------tên quyền ----------------------------------------------------------------------------------------------------------*/
                        <div className="field flex-1">
                            <label className='block' htmlFor="row">Tên</label>
                            <InputText id="row" name="row" value={formData.name} required autoComplete="additional-name" onChange={(e) => setFormData({ ...formData, name: e.target.value || "" })} />
                        </div>
                        /* -----------------------------------------------------================= ----------------------------------------------------------------------------------------------------------*/
                    }
                    {
                        /* -----------------------------------------------------đường dẫn quyền ----------------------------------------------------------------------------------------------------------*/
                        <div className="field flex-1">
                            <label className='block' htmlFor="path">Đường dẫn</label>
                            <InputText id="path" name="path" value={formData.apiPath} required autoComplete="additional-name" onChange={(e) => setFormData({ ...formData, apiPath: e.target.value || "" })} />
                        </div>
                        /* -----------------------------------------------------================= ----------------------------------------------------------------------------------------------------------*/
                    }
                    {
                        /* -----------------------------------------------------phương thức quyền ----------------------------------------------------------------------------------------------------------*/
                        <div className="field flex-1">
                            <label className='block' htmlFor="phương thức">Phương thức</label>
                            <InputText id="phương thức" name="phương thức" value={formData.method} required autoComplete="additional-name" onChange={(e) => setFormData({ ...formData, method: e.target.value || "" })} />
                        </div>
                        /* -----------------------------------------------------================= ----------------------------------------------------------------------------------------------------------*/
                    }
                    {
                        /* -----------------------------------------------------loại quyền ----------------------------------------------------------------------------------------------------------*/
                        <div className="field flex-1">
                            <label className='block' htmlFor="module">Loại</label>
                            <InputText id="module" name="module" value={formData.module} required autoComplete="additional-name" onChange={(e) => setFormData({ ...formData, module: e.target.value || "" })} />
                        </div>
                        /* -----------------------------------------------------================= ----------------------------------------------------------------------------------------------------------*/
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
async function handleSave(params: handeSaveRowParams<Permission>) {
    if (!params.row.name.trim() || !params.row.apiPath.trim() || !params.row.method.trim() || !params.row.module.trim()) {
        params.toast.current?.show({ severity: 'error', summary: "Cảnh báo", detail: "Tên quyền / đường dẫn / phương thức / loại không được phép để trống" });
        return;
    }
    params.setIsDisabled(true);
    let success = false;
    if (params.row.id) {
        success = await callPutUpdatePermission(params.row);
    } else {
        success = await callPostPermission(params.row);
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


const RenderDeletePermissionBody: React.FC<DialogDeleteRowBodyProps<Permission>> = React.memo(
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
async function handleDelete(params: handeDeleteRowParams<Permission>) {
    const success = await callPutPermissionRowActive(params.row);


    if (success) {
        params.toast.current?.show({ severity: 'success', summary: "Thành công", detail: "Thao tác thành công" });
        params.dispatch({ type: "REFRESH_DATA" });
    } else {
        params.toast.current?.show({ severity: 'error', summary: "Lỗi", detail: "Thao tác thất bại" });
    }
};
