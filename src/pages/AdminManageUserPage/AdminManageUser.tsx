import { Paginator } from "primereact/paginator";
import useUser from "../../hooks/UserHook";
import React from "react";
import AdminUserTable from "./AdminUserTable";
import { DialogUserActionButton } from "./DialogUserRelate";
import { Card } from "primereact/card";
import { CustomBreadCrumb } from "../../components/Common/Index";


function AdminManageUserPage() {
    const {
        state,
        dispatch,
        totalItems,
        onPageChange
    } = useUser();

    return (
        <Card title={<CustomBreadCrumb />}>                                          
            {/* Thành phần DialogUserActionButton quản lý hành động liên quan đến người dùng hiện tại */}
            <DialogUserActionButton
                currentSelectedRow={state.currentSelectedRow}   // người dùng hiện được chọn
                job={state.job}                                         // Công việc hiện tại (job)
                roleList={state.roleList}
                dispatch={dispatch}                                     // Hàm dispatch để cập nhật trạng thái
            />

            {/* Thành phần AdminUserTable hiển thị danh sách các người dùng */}
            <AdminUserTable
                dispatch={dispatch}                                     // Hàm dispatch để quản lý các hành động trong bảng
                rows={state.rows}                               // Dữ liệu các người dùng để hiển thị
            />

            <Paginator first={state.currentPageIndex * 5} rows={5} totalRecords={totalItems.current} onPageChange={onPageChange} />
        </Card>
    );
}

export default React.memo(AdminManageUserPage)