import { Card } from "primereact/card";
import { Paginator } from "primereact/paginator";
import React from "react";
import { DialogTestActionButton } from "../../components/Admin/AdminDialog/DialogTestRelate";
import AdminTestTable from "../../components/Admin/Table/AdminTestTable";
import { CustomBreadCrumb } from "../../components/Common/Index";
import useTest from "../../hooks/TestTableHook";


function AdminManageTestPage() {
    const {
        state,
        dispatch,
        totalItems,
        onPageChange,
        categoryName,
    } = useTest();

    return (
        <Card title={<CustomBreadCrumb />}>

            {/* Thành phần DialogTestActionButton quản lý hành động liên quan đến đề thi hiện tại */}
            <DialogTestActionButton
                currentSelectedRow={state.currentSelectedRow}   // đề thi hiện được chọn
                job={state.job}                                         // Công việc hiện tại (job)
                dispatch={dispatch}                                     // Hàm dispatch để cập nhật trạng thái
                categoryName={categoryName }
            />

            {/* Thành phần AdminTestTable hiển thị danh sách các đề thi */}
            <AdminTestTable
                dispatch={dispatch}                                     // Hàm dispatch để quản lý các hành động trong bảng
                rows={state.rows}                               // Dữ liệu các đề thi để hiển thị
            />

            <Paginator first={state.currentPageIndex * 5} rows={5} totalRecords={totalItems.current} onPageChange={onPageChange} />
        </Card>
    );
}

export default React.memo(AdminManageTestPage)