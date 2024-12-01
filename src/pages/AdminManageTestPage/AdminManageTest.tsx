import { Paginator } from "primereact/paginator";
import React from "react";
import AdminTestTable from "./AdminTestTable";
import { DialogTestActionButton } from "./DialogTestRelate";
import useTest from "../../hooks/TestTableHook";
import { CustomBreadCrumb } from "../../components/Common/Index";
import { Card } from "primereact/card";


function AdminManageTestPage() {
    const {
        state,
        dispatch,
        totalItems,
        onPageChange
    } = useTest();

    return (
        <Card title={<CustomBreadCrumb />}>

            {/* Thành phần DialogTestActionButton quản lý hành động liên quan đến đề thi hiện tại */}
            <DialogTestActionButton
                currentSelectedRow={state.currentSelectedRow}   // Bài giảng hiện được chọn
                job={state.job}                                         // Công việc hiện tại (job)
                dispatch={dispatch}                                     // Hàm dispatch để cập nhật trạng thái
            />

            {/* Thành phần AdminTestTable hiển thị danh sách các bài giảng */}
            <AdminTestTable
                dispatch={dispatch}                                     // Hàm dispatch để quản lý các hành động trong bảng
                rows={state.rows}                               // Dữ liệu các đề thi để hiển thị
            />

            <Paginator first={state.currentPageIndex * 5} rows={5} totalRecords={totalItems.current} onPageChange={onPageChange} />
        </Card>
    );
}

export default React.memo(AdminManageTestPage)