import { Button } from "primereact/button";
import { Column } from "primereact/column";
import React, { Dispatch } from "react";
import { RowHookAction } from "../../../utils/types/action";
import { emptyPermissionRowValue } from "../../../utils/types/emptyValue";
import { RowActionButtonProps } from "../../../utils/types/props";
import { Permission } from "../../../utils/types/type";
import { statusBodyTemplate } from "../../Common/Column/CommonColumn";

export function RenderAdminPermissionColumns(dispatch: Dispatch<RowHookAction<Permission>>): JSX.Element[] {
    return [

        
        <Column key="col-name"/*  */ field="name"/*        */ header="Tên"/*      */ filter/* */ sortable/*   */ alignHeader="center"/>,
        <Column key="col-api"/* */ field="apiPath"/**/ header="Đường dẫn"/*                 */ sortable />,
        <Column key="col-module"/* */ field="module"/**/ header="Loại"/*                 */ sortable />,
        <Column key="col-method"   field="method"/*    */ header="Phương thức"/*                      */ alignHeader="center" style={{maxWidth:"8rem"}} bodyClassName="text-center"/>,
        <Column key="col-active"/**/ field="active"/*      */ header="Trạng thái"/*            */ /*    */ bodyClassName="text-center"/*                    */ body={statusBodyTemplate} alignHeader="center"/>,
        <Column key="col-action"/*                         */ header={() => AddNew(dispatch)}/*         */ headerClassName='flex justify-content-center'/*   */  body={(data) => <ActionBodyTemplate dispatch={dispatch} currentSelectedRow={data} />} />
    ];
}
// Thành phần ActionBodyTemplate sử dụng React.memo để tối ưu hiệu suất (chỉ render lại khi props thay đổi)
 const ActionBodyTemplate: React.FC<RowActionButtonProps<Permission>> = React.memo(
    ({ currentSelectedRow, dispatch }) => {
        return (
            // Chia các nút hành động ra thành hàng, sử dụng flexbox để căn chỉnh
            <div className='flex justify-content-around'>

                {/* Nút chỉnh sửa: Khi nhấn, dispatch hành động để mở hộp thoại cập nhật quyền */}
                <Button icon="pi pi-pencil" rounded outlined style={{ width: "50px", height: "50px" }} onClick={() => { dispatch({ type: "OPEN_UPDATE_DIALOG", payload: currentSelectedRow }); }} />

                {/* Nút xóa: Khi nhấn, dispatch hành động để mở hộp thoại xóa quyền */}
                <Button icon={`pi ${currentSelectedRow.active ? "pi-trash" : "pi-sync"}`} rounded outlined severity="danger" style={{ width: "50px", height: "50px" }} onClick={() => { dispatch({ type: "OPEN_DELETE_DIALOG", payload: currentSelectedRow }); }} />

            </div>
        )
    }
);


function AddNew(dispatch: Dispatch<RowHookAction<Permission>>) {
    return (
        <Button icon="pi pi-plus" rounded outlined severity="success" style={{ width: "50px", height: "50px" }} onClick={() => dispatch({ type: "OPEN_CREATE_DIALOG", payload: emptyPermissionRowValue })} />
    )
}