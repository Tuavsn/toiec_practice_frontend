import { Button } from "primereact/button";
import { Column } from "primereact/column";
import React, { Dispatch } from "react";
import { statusBodyTemplate } from "../../components/Common/Table/CommonColumn";
import { RowActionButtonProps, RowHookAction, CategoryRow } from "../../utils/types/type";
import { useNavigate } from "react-router-dom";
import { emptyCategoryRow } from "../../utils/types/emptyValue";

export function RenderAdminCategoryColumns(dispatch: Dispatch<RowHookAction<CategoryRow>>): JSX.Element[] {
    return [

        <Column key="col-format"/* */ field="format"/*    */ header="Format"/*   */ filter/* */ sortable />,

        <Column key="col-year"/*  */ field="year"/*       */ header="Năm"/*      */ filter/* */ sortable/*   */ alignHeader="center"/>,
        <Column key="col-active"/**/ field="active"/*     */ header="Trạng thái"/*            */ /*    */ bodyClassName="text-center"/**/ body={statusBodyTemplate} alignHeader="center"/>,
        <Column key="col-test"/*                          */ header="Đề thi"/*                                */ bodyClassName="text-center"/**/ body={testsBodyTemplate} alignHeader="center"/>,
        <Column key="col-action"/*                        */ header={() => AddNew(dispatch)}/*     */ headerClassName='flex justify-content-center'/*   */ body={(data) => <ActionBodyTemplate dispatch={dispatch} currentSelectedRow={data} />}  />
    ];
}
// Thành phần ActionBodyTemplate sử dụng React.memo để tối ưu hiệu suất (chỉ render lại khi props thay đổi)
export const ActionBodyTemplate: React.FC<RowActionButtonProps<CategoryRow>> = React.memo(
    ({ currentSelectedRow, dispatch }) => {
        return (
            // Chia các nút hành động ra thành hàng, sử dụng flexbox để căn chỉnh
            <div className='flex justify-content-around'>

                {/* Nút chỉnh sửa: Khi nhấn, dispatch hành động để mở hộp thoại cập nhật bài giảng */}
                <Button icon="pi pi-pencil" rounded outlined style={{ width: "50px", height: "50px" }} onClick={() => { dispatch({ type: "OPEN_UPDATE_DIALOG", payload: currentSelectedRow }); }} />

                {/* Nút xóa: Khi nhấn, dispatch hành động để mở hộp thoại xóa bài giảng */}
                {/* <Button icon={`pi ${currentSelectedRow.active ? "pi-trash" : "pi-sync"}`} rounded outlined severity="danger" style={{ width: "50px", height: "50px" }} onClick={() => { dispatch({ type: "OPEN_DELETE_DIALOG", payload: currentSelectedRow }); }} /> */}

            </div>
        )
    }
);

function testsBodyTemplate(rowData: CategoryRow) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`${rowData.format}___${rowData.id}/tests`)
    };

    return (
        <Button severity="info" label='Chi Tiết' className="w-full text-center" onClick={handleClick}></Button>
    )
}

function AddNew(dispatch: Dispatch<RowHookAction<CategoryRow>>) {
    return (
        <Button icon="pi pi-plus" rounded outlined severity="success" style={{ width: "50px", height: "50px" }} onClick={() => dispatch({ type: "OPEN_CREATE_DIALOG", payload: emptyCategoryRow })} />
    )
}