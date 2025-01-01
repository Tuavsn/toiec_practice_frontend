import { Card } from "primereact/card";
import { Paginator } from "primereact/paginator";
import React from "react";
import { DialogCategoryActionButton } from "../../components/Admin/AdminDialog/DialogCategoryRelate";
import AdminCategoryTable from "../../components/Admin/Table/AdminCategoryTable";
import { CustomBreadCrumb } from "../../components/Common/Index";
import useCategory from "../../hooks/CateogoryHook";


function AdminManageCategoryPage() {
    const {
        state,
        dispatch,
        totalItems,
        onPageChange
    } = useCategory();

    return (
        <Card title={<CustomBreadCrumb />}>

            {/* Thành phần DialogCategoryActionButton quản lý hành động liên quan đến bộ đề hiện tại */}
            <DialogCategoryActionButton
                currentSelectedRow={state.currentSelectedRow}   // bộ đề hiện được chọn
                job={state.job}                                         // Công việc hiện tại (job)
                dispatch={dispatch}                                     // Hàm dispatch để cập nhật trạng thái
            />

            {/* Thành phần AdminCategoryTable hiển thị danh sách các bộ đề */}
            <AdminCategoryTable
                dispatch={dispatch}                                     // Hàm dispatch để quản lý các hành động trong bảng
                rows={state.rows}                               // Dữ liệu các bộ đề để hiển thị
            />

            <Paginator first={state.currentPageIndex * 5} rows={5} totalRecords={totalItems.current} onPageChange={onPageChange} />
        </Card>
    );
}

export default React.memo(AdminManageCategoryPage)