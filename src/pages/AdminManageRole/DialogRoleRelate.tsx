import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import React, { useRef, useState } from "react";
import { callPostRole, callPutRoleRowActive, callPutUpdateRole } from "../../api/api";
import { useToast } from "../../context/ToastProvider";
import { DialogDeleteRowBodyProps, DialogRoleRowProps, DialogUpdateRoleBodyProps, handeDeleteRowParams, handeSaveRoleParams, PermissionID, RenderRoleRowDialogParams, Role } from "../../utils/types/type";


// Thành phần DialogRoleActionButton sử dụng React.memo để tối ưu hiệu suất (chỉ render lại khi props thay đổi)
export const DialogRoleActionButton: React.FC<DialogRoleRowProps> = React.memo(
    ({ currentSelectedRow, dispatch, job, permissionList }) => {

        // Render nội dung của Dialog, bao gồm header và body, từ hàm RenderDialog
        const [header, body] = RenderDialog({ job, currentSelectedRow, dispatch, permissionList });

        return (
            <Dialog
                // Đóng Dialog khi sự kiện onHide xảy ra, dispatch hành động để thay đổi trạng thái
                onHide={() => dispatch({ type: "TOGGLE_DIALOG", payload: "" })}
                header={header}                                                         // Tiêu đề của Dialog lấy từ prop header
                visible={header != ""}                                                  // Nếu header không trống, Dialog sẽ hiển thị
                style={{ width: "80vw" }}                                               // Thiết lập chiều rộng của Dialog (80% của viewport)
                maximizable                                                             // Cho phép vai trò tối đa hóa Dialog

            >
                {body                                                                   /* Nội dung của Dialog */}
            </Dialog>
        );
    }
);



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------




// Hàm RenderDialog nhận đối số là params và trả về một mảng gồm một chuỗi tiêu đề và một phần tử JSX (nội dung của Dialog)
function RenderDialog(params: RenderRoleRowDialogParams): [string, JSX.Element] {

    // Dựa trên giá trị của params.job, hàm sẽ trả về tiêu đề và nội dung phù hợp
    switch (params.job) {

        case "DELETE"://------------------------------------- Khi job là DELETE, hiển thị tiêu đề "Xóa vai trò" cùng với tên của vai trò hiện tại và một thông báo xác nhận xóa
            {
                const text = params.currentSelectedRow.active ? "Xóa" : "Khôi phục";

                return [`${text} vai trò ${params.currentSelectedRow.name}`,
                <RenderDeleteRoleBody currentSelectedRow={params.currentSelectedRow} dispatch={params.dispatch} />
                ];
            }
        case "CREATE"://------------------------------------- Khi job là DELETE, hiển thị tiêu đề "Xóa vai trò" cùng với tên của vai trò hiện tại và một thông báo xác nhận xóa

            return [`Tạo vai trò mới`,
                <RenderUpsertRoleBody currentSelectedRow={params.currentSelectedRow} dispatch={params.dispatch} permissionList={params.permissionList} />
            ];
        case "UPDATE"://------------------------------------- Khi job là DELETE, hiển thị tiêu đề "Xóa vai trò" cùng với tên của vai trò hiện tại và một thông báo xác nhận xóa

            return [`Cập nhật vai trò ${params.currentSelectedRow.name}`,
            <RenderUpsertRoleBody currentSelectedRow={params.currentSelectedRow} dispatch={params.dispatch} permissionList={params.permissionList} />
            ];
    }

    // Trả về giá trị mặc định nếu không có case nào phù hợp (đây là trường hợp lỗi)
    return ["", <>Lỗi</>]
};



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
type UpsertRoleForm = {
    name: string;
    description: string;
    permissionIDs: PermissionID[]
}

const RenderUpsertRoleBody: React.FC<DialogUpdateRoleBodyProps> = React.memo(
    (props) => {
        const [formData, setFormData] = useState<UpsertRoleForm>({ ...props.currentSelectedRow, permissionIDs: props.currentSelectedRow.permissions.map(p => p.id) })
        const { toast } = useToast();
        const [isDisabled, setIsDisabled] = useState(false);
        const title = useRef<string>(props.currentSelectedRow.id ? "Sửa vai trò" : "Thêm vai trò");
        return (
            <Fieldset legend={title.current} >
                <section className='flex flex-row flex-wrap gap-4 justify-content-space'>
                    {
                        /* -----------------------------------------------------tên vai trò ----------------------------------------------------------------------------------------------------------*/
                        <div className="field flex-1">
                            <label className='block' htmlFor="row">Tên</label>
                            <InputText id="row" name="row" value={formData.name} required autoComplete="additional-name" onChange={(e) => setFormData({ ...formData, name: e.target.value || "" })} />
                        </div>
                        /* -----------------------------------------------------================= ----------------------------------------------------------------------------------------------------------*/

                    }

                    {
                        <div className="field flex-1">
                            <label className='block' htmlFor="solution">Mô tả về quyền</label>
                            <InputTextarea
                                style={{ width: '20vw', resize: 'none' }}
                                id="solution"
                                name="solution"
                                value={formData.description || ""}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value || "" })}
                                rows={10}
                            />
                        </div>
                    }
                    {/* permission */}
                    <div className="field flex-1">
                        <p className='m-0 mb-2'>Thao tác được phép</p>
                        <MultiSelect
                            style={{ width: '100%', maxWidth: "70vw" }}
                            name="listTopicIds"
                            value={formData.permissionIDs}
                            options={props.permissionList.map((p) => ({ label: p.name, value: p.id }))}
                            onChange={(e) => setFormData((prev) => ({ ...prev, permissionIDs: e.value as PermissionID[] }))}
                            placeholder="Chọn các thao tác"
                            display='chip'
                        />
                    </div>
                </section>
                {/* Save Button */}
                <div className="field flex justify-content-end mt-5">
                    <Button label="Lưu" icon="pi pi-save" disabled={isDisabled} onClick={() => handleSave({ row: { ...props.currentSelectedRow, ...formData }, permissionIDList: formData.permissionIDs, dispatch: props.dispatch, toast, setIsDisabled })} />
                </div>

            </Fieldset>
        );
    }
)


//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// khi nhấn nút Lưu
async function handleSave(params: handeSaveRoleParams) {
    if (!params.row.name.trim() || !params.row.description.trim()) {
        params.toast.current?.show({ severity: 'error', summary: "Cảnh báo", detail: "Tên vai trò / mô tả không được phép để trống" });
        return;
    }
    params.setIsDisabled(true);
    let success = false;
    if (params.row.id) {
        success = await callPutUpdateRole(params.row, params.permissionIDList);
    } else {
        success = await callPostRole(params.row, params.permissionIDList);
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


const RenderDeleteRoleBody: React.FC<DialogDeleteRowBodyProps<Role>> = React.memo(
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
async function handleDelete(params: handeDeleteRowParams<Role>) {
    const success = await callPutRoleRowActive(params.row);


    if (success) {
        params.toast.current?.show({ severity: 'success', summary: "Thành công", detail: "Thao tác thành công" });
        params.dispatch({ type: "REFRESH_DATA" });
    } else {
        params.toast.current?.show({ severity: 'error', summary: "Lỗi", detail: "Thao tác thất bại" });
    }
};
