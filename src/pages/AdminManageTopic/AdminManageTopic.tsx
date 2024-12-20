import { Card } from "primereact/card";
import { Paginator } from "primereact/paginator";
import React from "react";
import { DialogTopicActionButton } from "../../components/Admin/AdminDialog/DialogTopicRelate";
import AdminTopicTable from "../../components/Admin/Table/AdminTopicTable";
import { CustomBreadCrumb } from "../../components/Common/Index";
import useTopic from "../../hooks/TopicHook";


function AdminManageTopicPage() {
    const {
        state,
        dispatch,
        totalItems,
        onPageChange
    } = useTopic();

    return (
        <Card title={<CustomBreadCrumb />}>

            {/* Thành phần DialogTopicActionButton quản lý hành động liên quan đến chủ đề hiện tại */}
            <DialogTopicActionButton
                currentSelectedRow={state.currentSelectedRow}   // chủ đề hiện được chọn
                job={state.job}                                         // Công việc hiện tại (job)
                dispatch={dispatch}                                     // Hàm dispatch để cập nhật trạng thái
            />

            {/* Thành phần AdminTopicTable hiển thị danh sách các chủ đề */}
            <AdminTopicTable
                dispatch={dispatch}                                     // Hàm dispatch để quản lý các hành động trong bảng
                rows={state.rows}                               // Dữ liệu các chủ đề để hiển thị
            />

            <Paginator first={state.currentPageIndex * 5} rows={5} totalRecords={totalItems.current} onPageChange={onPageChange} />
        </Card>
    );
}

export default React.memo(AdminManageTopicPage)