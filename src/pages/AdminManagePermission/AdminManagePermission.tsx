
import { Card } from "primereact/card";
import { Paginator } from "primereact/paginator";
import React from "react";
import { DialogPermissionActionButton } from "../../components/Admin/AdminDialog/DialogPermissionRelate";
import AdminPermissionTable from "../../components/Admin/Table/AdminPermissionTable";
import { CustomBreadCrumb } from "../../components/Common/Index";
import usePermission from "../../hooks/PermissionHook";


function AdminManagePermissionPage() {
    const {
        state,
        dispatch,
        totalItems,
        onPageChange
    } = usePermission();

    return (
        <Card title={<CustomBreadCrumb />}>

            {/* Thành phần DialogPermissionActionButton quản lý hành động liên quan đến quyền hiện tại */}
            <DialogPermissionActionButton
                currentSelectedRow={state.currentSelectedRow}   // quyền hiện được chọn
                job={state.job}                                         // Công việc hiện tại (job)
                dispatch={dispatch}                                     // Hàm dispatch để cập nhật trạng thái
            />

            {/* Thành phần AdminPermissionTable hiển thị danh sách các quyền */}
            <AdminPermissionTable
                dispatch={dispatch}                                     // Hàm dispatch để quản lý các hành động trong bảng
                rows={state.rows}                               // Dữ liệu các quyền để hiển thị
            />

            <Paginator first={state.currentPageIndex * 5} rows={5} totalRecords={totalItems.current} onPageChange={onPageChange} />
        </Card>
    );
}

export default React.memo(AdminManagePermissionPage)