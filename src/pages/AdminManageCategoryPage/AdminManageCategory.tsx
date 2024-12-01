import { Paginator } from "primereact/paginator";
import React from "react";
import AdminCategoryTable from "./AdminCategoryTable";
import { DialogCategoryActionButton } from "./DialogCategoryRelate";
import useCategory from "../../hooks/CateogoryHook";
import { CustomBreadCrumb } from "../../components/Common/Index";
import { Card } from "primereact/card";


function AdminManageCategoryPage() {
    const {
        state,
        dispatch,
        totalItems,
        onPageChange
    } = useCategory();

    return (
        <Card title={<CustomBreadCrumb />}>

            {/* Thành phần DialogCategoryActionButton quản lý hành động liên quan đến bài giảng hiện tại */}
            <DialogCategoryActionButton
                currentSelectedRow={state.currentSelectedRow}   // Bài giảng hiện được chọn
                job={state.job}                                         // Công việc hiện tại (job)
                dispatch={dispatch}                                     // Hàm dispatch để cập nhật trạng thái
            />

            {/* Thành phần AdminCategoryTable hiển thị danh sách các bài giảng */}
            <AdminCategoryTable
                dispatch={dispatch}                                     // Hàm dispatch để quản lý các hành động trong bảng
                rows={state.rows}                               // Dữ liệu các bài giảng để hiển thị
            />

            <Paginator first={state.currentPageIndex * 5} rows={5} totalRecords={totalItems.current} onPageChange={onPageChange} />
        </Card>
    );
}

export default React.memo(AdminManageCategoryPage)