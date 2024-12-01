import { Button } from "primereact/button";
import { Column } from "primereact/column";
import React, { Dispatch } from "react";
import { statusBodyTemplate } from "../../components/Common/Table/CommonColumn";
import { UserActionButtonProps, UserHookAction } from "../../utils/types/type";

export function RenderAdminUserColumns(dispatch: Dispatch<UserHookAction>): JSX.Element[] {
    return [

        <Column key="col-email"/* */ field="email"/*      */ header="Email"/*    */ filter/* */ sortable />,

        <Column key="col-role"/*  */ field="role.name"/*  */ header="Vai trò"/*  */ filter/* */ sortable/*  */ style={{ width: "5rem" }}/*  */ bodyClassName="text-center"/**/ />,
        <Column key="col-active"/**/ field="role.active"/**/ header="Hoạt động"/**/ filter/* */ sortable/*  */ style={{ width: "5rem" }}/*  */ bodyClassName="text-center"/**/ body={data => statusBodyTemplate(data.role)} />,

        <Column key="col-action"/* */ headerClassName='flex justify-content-end'/*                                                                                          */ body={(data) => <ActionBodyTemplate dispatch={dispatch} currentSelectedUser={data} />} />
    ];
}
// Thành phần ActionBodyTemplate sử dụng React.memo để tối ưu hiệu suất (chỉ render lại khi props thay đổi)
export const ActionBodyTemplate: React.FC<UserActionButtonProps> = React.memo(
    ({ currentSelectedUser, dispatch }) => {
        return (
            // Chia các nút hành động ra thành hàng, sử dụng flexbox để căn chỉnh
            <div className='flex justify-content-around'>

                {/* Nút chỉnh sửa: Khi nhấn, dispatch hành động để mở hộp thoại cập nhật bài giảng */}
                <Button icon="pi pi-pencil" rounded outlined style={{ width: "50px", height: "50px" }} onClick={() => { dispatch({ type: "OPEN_UPDATE_DIALOG", payload: currentSelectedUser }); }} />

                {/* Nút xóa: Khi nhấn, dispatch hành động để mở hộp thoại xóa bài giảng */}
                <Button icon="pi pi-trash" rounded outlined severity="danger" style={{ width: "50px", height: "50px" }} onClick={() => { dispatch({ type: "OPEN_DELETE_DIALOG", payload: currentSelectedUser }); }} />

            </div>
        )
    }
);