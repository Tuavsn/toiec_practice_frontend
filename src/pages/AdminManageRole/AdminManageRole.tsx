import { Paginator } from "primereact/paginator";
import React from "react";
import AdminRoleTable from "./AdminRoleTable";
import { DialogRoleActionButton } from "./DialogRoleRelate";

import { CustomBreadCrumb } from "../../components/Common/Index";
import { Card } from "primereact/card";
import useRole from "../../hooks/RoleHook";


function AdminManageRolePage() {
    const {
        state,
        dispatch,
        totalItems,
        onPageChange
    } = useRole();

    return (
        <Card title={<CustomBreadCrumb />}>

            {/* Thành phần DialogRoleActionButton quản lý hành động liên quan đến vai trò hiện tại */}
            <DialogRoleActionButton
                currentSelectedRow={state.currentSelectedRow}   // vai trò hiện được chọn
                job={state.job}                                         // Công việc hiện tại (job)
                permissionList={state.permissionList}
                dispatch={dispatch}                                     // Hàm dispatch để cập nhật trạng thái
            />

            {/* Thành phần AdminRoleTable hiển thị danh sách các vai trò */}
            <AdminRoleTable
                dispatch={dispatch}                                     // Hàm dispatch để quản lý các hành động trong bảng
                rows={state.rows}                               // Dữ liệu các vai trò để hiển thị
            />

            <Paginator first={state.currentPageIndex * 5} rows={9999} totalRecords={totalItems.current} onPageChange={onPageChange} />
        </Card>
    );
}

export default React.memo(AdminManageRolePage)