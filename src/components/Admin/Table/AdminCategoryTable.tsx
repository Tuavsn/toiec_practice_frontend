import { DataTable } from "primereact/datatable";
import React from "react";
import { AdminCategoryTableProps } from "../../../utils/types/props";
import { RenderAdminCategoryColumns } from "../AdminColumn/ColumnManageCategoryPage";
import SearchTextBox from "../AdminToolbar/SearchTextBox";

// Thành phần AdminCategoryTable sử dụng React.FC với kiểu AdminCategoryTableProps
const AdminCategoryTable: React.FC<AdminCategoryTableProps> = ({ rows, dispatch }) => {

    return (
        // DataTable là một bảng dữ liệu, hiển thị danh sách bộ đề (lectures) từ props
        <DataTable
            header={<SearchTextBox dispatchSearch={dispatch} />}
            emptyMessage="Không có bộ đề"
            value={rows ?? []} // Dữ liệu nguồn từ props.lectures
            size="small" // Kích thước của bảng được thiết lập là nhỏ
            loading={rows === null} // Hiển thị trạng thái "loading" nếu danh sách bộ đề rỗng
            dataKey="id" // Sử dụng thuộc tính "id" làm khóa chính cho các hàng trong bảng
        >
            {/* Gọi hàm RenderAdminCategoryColumns để render các cột bảng, truyền dispatch qua props */}
            {RenderAdminCategoryColumns(dispatch)}
        </DataTable>
    )
};


export default AdminCategoryTable

