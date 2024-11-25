import { Button } from "primereact/button";
import React from "react";
import { LectureActionButtonProps } from "../../utils/types/type";

export const ActionBodyTemplate: React.FC<LectureActionButtonProps> = React.memo(
    ({ currentSelectedLecture, dispatch }) => {


        return ( // Kiểm tra key của questionNode có bắt đầu bằng "part" không. Nếu có, trả về rỗng.
            <div className='flex justify-content-around'>

                {/* Nút chỉnh sửa */}
                <Button icon="pi pi-pencil" rounded outlined style={{ width: "50px", height: "50px" }} onClick={() => {
                    dispatch({ type: "TOGGLE_DIALOG", payload: `Sửa: ${currentSelectedLecture.name}` });
                    dispatch({ type: "SET_CURRENT_LECTURE", payload: currentSelectedLecture })

                }} />

                {/* Nút xóa */}
                <Button icon="pi pi-trash" rounded outlined severity="danger" style={{ width: "50px", height: "50px" }} onClick={() => {
                    dispatch({ type: "TOGGLE_DIALOG", payload: "Xóa" });
                    dispatch({ type: "SET_CURRENT_LECTURE", payload: currentSelectedLecture })
                }} />
            </div>
        )
    }
);