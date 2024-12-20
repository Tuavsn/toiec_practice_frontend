import { DataTable } from "primereact/datatable";
import React from "react";
import { AdminRowTableProps, Topic } from "../../../utils/types/type";
import { RenderAdminTopicColumns } from "../AdminColumn/ColumnManageTopicPage";

// Thành phần AdminTopicTable sử dụng React.FC với kiểu AdminTopicTableProps
const AdminTopicTable: React.FC<AdminRowTableProps<Topic>> = (props) => {

    return (
        // DataTable là một bảng dữ liệu, hiển thị danh sách chủ đề từ props
        <DataTable
            emptyMessage="Không có chủ đề"
            value={props.rows?? []} // Dữ liệu nguồn từ props.lectures
            size="small" // Kích thước của bảng được thiết lập là nhỏ
            loading={props.rows === null} // Hiển thị trạng thái "loading" nếu danh sách chủ đề rỗng
            dataKey="id" // Sử dụng thuộc tính "id" làm khóa chính cho các hàng trong bảng
        >
            {/* Gọi hàm RenderAdminTopicColumns để render các cột bảng, truyền dispatch qua props */}
            {RenderAdminTopicColumns(props.dispatch)}
        </DataTable>
    )
};


export default AdminTopicTable

