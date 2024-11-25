import { Dialog } from "primereact/dialog";
import React from "react";
import { DialogLectureActionProps } from "../../utils/types/type";

export const DialogLectureActionButton: React.FC<DialogLectureActionProps> = React.memo(
    ({ state, dispatch }) => {

        return (
            <Dialog
                onHide={() => dispatch({ type: "TOGGLE_DIALOG", payload: "" })}           // Đóng Dialog khi sự kiện onHide xảy ra
                header={state.title}
                visible={state.title != ""}                       // Tiêu đề của Dialog lấy từ prop title
                style={{ width: "80vw" }}                    // Thiết lập chiều rộng của Dialog
            >
                {state.title === "Xóa" ?                          // Kiểm tra nếu tiêu đề là "Xóa"
                    <h1 className='text-center'>Bạn có chắc muốn xóa</h1> // Hiển thị nội dung xác nhận xóa
                    :
                    <h3>chỉnh sửa</h3>
                }
            </Dialog>
        );
    }
);