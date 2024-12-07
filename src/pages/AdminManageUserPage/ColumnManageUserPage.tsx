import { Button } from "primereact/button";
import { Column } from "primereact/column";
import React, { Dispatch } from "react";
import { statusBodyTemplate } from "../../components/Common/Table/CommonColumn";
import { RowActionButtonProps, RowHookAction, UserRow } from "../../utils/types/type";

export function RenderAdminUserColumns(dispatch: Dispatch<RowHookAction<UserRow>>): JSX.Element[] {
    return [

        <Column key="col-email"/* */ field="email"/*      */ header="Email"/*    */ filter/* */ sortable />,

        <Column key="col-role"/*  */ field="role.name"/*  */ header="Vai trò"/*  */ filter/* */ sortable/*  */ /*  ***/ />,
        <Column key="col-active"/**/ field="active"/*     */ header="Trạng thái"/*            */ sortable/*  */ /*  **/ body={statusBodyTemplate} />,

        <Column key="col-action"/* */ headerClassName='flex justify-content-end'/*                                                                                          */ body={(data) => <ActionBodyTemplate dispatch={dispatch} currentSelectedRow={data} />} />
    ];
}
// Thành phần ActionBodyTemplate sử dụng React.memo để tối ưu hiệu suất (chỉ render lại khi props thay đổi)
export const ActionBodyTemplate: React.FC<RowActionButtonProps<UserRow>> = React.memo(
    ({ currentSelectedRow, dispatch }) => {
        return (
            // Chia các nút hành động ra thành hàng, sử dụng flexbox để căn chỉnh
            <div className='flex gap-2'>

                {/* Nút chỉnh sửa: Khi nhấn, dispatch hành động để mở hộp thoại cập nhật bài giảng */}
                <Button icon="pi pi-pencil" rounded outlined style={{ width: "50px", height: "50px" }} onClick={() => { dispatch({ type: "OPEN_UPDATE_DIALOG", payload: currentSelectedRow }); }} />

                {/* Nút xóa: Khi nhấn, dispatch hành động để mở hộp thoại xóa bài giảng */}
                <Button icon={`pi ${currentSelectedRow.active ? "pi-trash" : "pi-sync"}`} rounded outlined severity="danger" style={{ width: "50px", height: "50px" }} onClick={() => { dispatch({ type: "OPEN_DELETE_DIALOG", payload: currentSelectedRow }); }} />

            </div>
        )
    }
);