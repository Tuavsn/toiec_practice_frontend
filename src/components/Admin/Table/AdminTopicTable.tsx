import { DataTable } from "primereact/datatable";
import React from "react";
import { AdminTopicTableProps } from "../../../utils/types/props";
import { RenderAdminTopicColumns } from "../AdminColumn/ColumnManageTopicPage";
import SearchTextBox from "../AdminToolbar/SearchTextBox";

// Thành phần AdminTopicTable sử dụng React.FC với kiểu AdminTopicTableProps
const AdminTopicTable: React.FC<AdminTopicTableProps> = ({ rows, dispatch }) => {

    return (
        // DataTable là một bảng dữ liệu, hiển thị danh sách chủ đề từ props
        <DataTable
            header={<SearchTextBox dispatchSearch={dispatch} />}
            emptyMessage="Không có chủ đề"
            value={rows ?? []} // Dữ liệu nguồn từ rows
            size="small" // Kích thước của bảng được thiết lập là nhỏ
            loading={rows === null} // Hiển thị trạng thái "loading" nếu danh sách chủ đề rỗng
            dataKey="id" // Sử dụng thuộc tính "id" làm khóa chính cho các hàng trong bảng
        >
            {/* Gọi hàm RenderAdminTopicColumns để render các cột bảng, truyền dispatch qua props */}
            {RenderAdminTopicColumns(dispatch)}
        </DataTable>
    )
};


export default AdminTopicTable

