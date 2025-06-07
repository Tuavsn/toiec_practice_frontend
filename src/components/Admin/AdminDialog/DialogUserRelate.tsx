import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Fieldset } from "primereact/fieldset";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { callLogout, callPutUpdateRoleForUser, callPutUpdateUserRow } from "../../../api/api";
import { useToast } from "../../../context/ToastProvider";
import { RenderUserRowDialogParams, handeDeleteRowParams, handeSaveUserRowParams } from "../../../utils/types/prams";
import { DialogDeleteRowBodyProps, DialogUpdateUserBodyProps, DialogUserRowProps } from "../../../utils/types/props";
import { Role, UserRow } from "../../../utils/types/type";


// Thành phần DialogUserActionButton sử dụng React.memo để tối ưu hiệu suất (chỉ render lại khi props thay đổi)
export const DialogUserActionButton: React.FC<DialogUserRowProps> = React.memo(
    ({ currentSelectedRow, dispatch, job, roleList }) => {

        // Render nội dung của Dialog, bao gồm header và body, từ hàm RenderDialog
        const [header, body] = RenderDialog({ job, currentSelectedRow, dispatch, roleList });

        return (
            <Dialog
                // Đóng Dialog khi sự kiện onHide xảy ra, dispatch hành động để thay đổi trạng thái
                onHide={() => dispatch({ type: "TOGGLE_DIALOG", payload: "" })}
                header={header}                                                         // Tiêu đề của Dialog lấy từ prop header
                visible={header != ""}                                                  // Nếu header không trống, Dialog sẽ hiển thị
                style={{ width: "80vw" }}                                               // Thiết lập chiều rộng của Dialog (80% của viewport)
                maximizable                                                             // Cho phép người dùng tối đa hóa Dialog

            >
                {body                                                                   /* Nội dung của Dialog */}
            </Dialog>
        );
    }
);



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------




// Hàm RenderDialog nhận đối số là params và trả về một mảng gồm một chuỗi tiêu đề và một phần tử JSX (nội dung của Dialog)
function RenderDialog(params: RenderUserRowDialogParams): [string, JSX.Element] {

    // Dựa trên giá trị của params.job, hàm sẽ trả về tiêu đề và nội dung phù hợp
    switch (params.job) {

        case "DELETE"://------------------------------------- Khi job là DELETE, hiển thị tiêu đề "Xóa người dùng" cùng với tên của người dùng hiện tại và một thông báo xác nhận xóa
            {
                const text = params.currentSelectedRow.active ? "Xóa người dùng" : "Khôi phục";
                return [`${text}:  ${params.currentSelectedRow.email.split('@')[0]}`,
                <RenderDeleteUserBody currentSelectedRow={params.currentSelectedRow} dispatch={params.dispatch} />
                ];
            }
        case "UPDATE"://------------------------------------- Khi job là DELETE, hiển thị tiêu đề "Xóa chủ đề" cùng với tên của chủ đề hiện tại và một thông báo xác nhận xóa

            return [`Cập nhật quyền ${params.currentSelectedRow.email}`,
            <RenderUpdateUserBody currentSelectedRow={params.currentSelectedRow} dispatch={params.dispatch} roleList={params.roleList} />
            ];
    }

    // Trả về giá trị mặc định nếu không có case nào phù hợp (đây là trường hợp lỗi)
    return ["", <>Lỗi</>]
};



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const RenderUpdateUserBody: React.FC<DialogUpdateUserBodyProps> = React.memo(
    (props) => {
        const [formData, setFormData] = useState<Role>(props.currentSelectedRow.role)
        const { toast } = useToast();
        const [isDisabled, setIsDisabled] = useState(false);
        const navigate = useNavigate();
        const title = useRef<string>(props.currentSelectedRow.id ? "Sửa tài khoản" : "Thêm tài khoản");
        return (
            <Fieldset legend={title.current} >
                <section className='flex flex-row flex-wrap gap-4 justify-content-space'>
                    {
                        <div className="field flex-1">
                            <label className='block' htmlFor="overall skill">Chức danh</label>
                            <Dropdown
                                name="overall skill"
                                value={formData.id}
                                options={props.roleList.map((r: Role) => { return { label: r.name, value: r.id } })}
                                onChange={(e) => setFormData({ ...formData, id: e.target.value || "" })}
                                placeholder="Chọn loại"
                            />
                        </div>
                    }
                </section>
                {/* Save Button */}
                <div className="field flex justify-content-end mt-5">
                    <Button label="Lưu" icon="pi pi-save" disabled={isDisabled} onClick={() => handleSave({ role: formData, user: props.currentSelectedRow, dispatch: props.dispatch, toast, setIsDisabled, navigate: navigate })} />
                </div>

            </Fieldset>
        );
    }
)


//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
async function handleSave(params: handeSaveUserRowParams) {
    if (!params.role.id.trim()) {
        params.toast.current?.show({ severity: 'error', summary: "Cảnh báo", detail: "Tên chức danh không được phép để trống" });
        return;
    }
    params.setIsDisabled(true);
    let success = false;

    success = await callPutUpdateRoleForUser(params.role, params.user);

    params.setIsDisabled(false);
    if (success) {
        params.toast.current?.show({ severity: 'success', summary: "Thành công", detail: "Thao tác thành công" });
        if (params.user.id === localStorage.getItem("iduser")) {
            await callLogout()
            params.navigate("/home", { replace: true });
        } else {
            params.dispatch({ type: "REFRESH_DATA" });
        }
    } else {
        params.toast.current?.show({ severity: 'error', summary: "Lỗi", detail: "Sửa thất bại" });
    }
};


//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------


const RenderDeleteUserBody: React.FC<DialogDeleteRowBodyProps<UserRow>> = React.memo(
    (props) => {
        const { toast } = useToast();
        const [isDisabled, setIsDisabled] = useState<boolean>(false);
        const text = props.currentSelectedRow.active ? "xóa" : "khôi phục";
        return (
            <React.Fragment>

                <h1 className='text-center'>Bạn có chắc muốn {text} <q>{props.currentSelectedRow.email.split('@')[0]}</q> ?</h1>
                <div className="flex justify-content-end">
                    <Button disabled={isDisabled} label="Xác nhận" icon="pi pi-save" onClick={() => { handleDelete({ row: props.currentSelectedRow, dispatch: props.dispatch, toast }); setIsDisabled(true) }} />
                </div>
            </React.Fragment>
        )
    }
)



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------



// khi nhấn nút Xóa
async function handleDelete(params: handeDeleteRowParams<UserRow>) {
    const success = await callPutUpdateUserRow(params.row);


    if (success) {
        params.toast.current?.show({ severity: 'success', summary: "Thành công", detail: "Thao tác thành công" });
        params.dispatch({ type: "REFRESH_DATA" });
    } else {
        params.toast.current?.show({ severity: 'error', summary: "Lỗi", detail: "Thao tác thất bại" });
    }
};
