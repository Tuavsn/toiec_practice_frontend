import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React from "react";
import { callPutUpdateUserRow } from "../../api/api";
import { useToast } from "../../context/ToastProvider";
import { DialogDeleteUserBodyProps, DialogUserProps, handeDeleteUserParams, RenderUserDialogParams, UserRow } from "../../utils/types/type";


// Thành phần DialogUserActionButton sử dụng React.memo để tối ưu hiệu suất (chỉ render lại khi props thay đổi)
export const DialogUserActionButton: React.FC<DialogUserProps> = React.memo(
    ({ currentSelectedUser, dispatch, job }) => {

        // Render nội dung của Dialog, bao gồm header và body, từ hàm RenderDialog
        const [header, body] = RenderDialog({ job, currentSelectedUser, dispatch });

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
function RenderDialog(params: RenderUserDialogParams): [string, JSX.Element] {

    // Dựa trên giá trị của params.job, hàm sẽ trả về tiêu đề và nội dung phù hợp
    switch (params.job) {

        case "DELETE"://------------------------------------- Khi job là DELETE, hiển thị tiêu đề "Xóa người dùng" cùng với tên của người dùng hiện tại và một thông báo xác nhận xóa

            return [`Xóa người dùng ${params.currentSelectedUser.name}`,
            <RenderDeleteUserBody currentSelectedUser={params.currentSelectedUser} dispatch={params.dispatch} />
            ];

    }

    // Trả về giá trị mặc định nếu không có case nào phù hợp (đây là trường hợp lỗi)
    return ["", <>Lỗi</>]
};



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------




//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------


const RenderDeleteUserBody: React.FC<DialogDeleteUserBodyProps> = React.memo(
    (props) => {
        const { toast } = useToast();
        return (
            <React.Fragment>

                <h1 className='text-center'>Bạn có chắc muốn xóa <q>{props.currentSelectedUser.name}</q> ?</h1>
                <div className="flex justify-content-end">
                    <Button label="Xóa" icon="pi pi-save" onClick={() => handleDelete({ userID: props.currentSelectedUser.id, dispatch: props.dispatch, toast })} />
                </div>
            </React.Fragment>
        )
    }
)



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------



// khi nhấn nút Xóa
async function handleDelete(params: handeDeleteUserParams) {
    const success = await callPutUpdateUserRow({id:params.userID}as UserRow);


    if (success) {
        params.toast.current?.show({ severity: 'success', summary: "Thành công", detail: "Xóa thành công" });
        params.dispatch({ type: "REFRESH_DATA" });
    } else {
        params.toast.current?.show({ severity: 'error', summary: "Lỗi", detail: "Xóa thất bại" });
    }
};
