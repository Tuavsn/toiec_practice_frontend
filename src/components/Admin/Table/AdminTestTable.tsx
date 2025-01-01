import { DataTable } from "primereact/datatable";
import React from "react";
import { AdminTestTableProps } from "../../../utils/types/props";
import { RenderAdminTestColumns } from "../AdminColumn/ColumnManageTestPage";
import SearchTextBox from "../AdminToolbar/SearchTextBox";

// Thành phần AdminTestTable sử dụng React.FC với kiểu AdminTestTableProps
const AdminTestTable: React.FC<AdminTestTableProps> = ({ rows, dispatch }) => {

    return (
        // DataTable là một bảng dữ liệu, hiển thị danh sách các đề từ props
        <DataTable
            header={<SearchTextBox dispatchSearch={dispatch} />}
            emptyMessage="Không có đề thi"
            stripedRows
            value={rows ?? []} // Dữ liệu nguồn từ tests
            size="small" // Kích thước của bảng được thiết lập là nhỏ
            loading={rows === null} // Hiển thị trạng thái "loading" nếu danh sách đề thi rỗng
            dataKey="id" // Sử dụng thuộc tính "id" làm khóa chính cho các hàng trong bảng
        >
            {/* Gọi hàm RenderAdminTestColumns để render các cột bảng, truyền dispatch qua props */}
            {RenderAdminTestColumns(dispatch)}
        </DataTable>
    )
};


export default AdminTestTable

