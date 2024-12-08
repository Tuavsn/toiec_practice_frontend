import { DataTable } from "primereact/datatable";
import React from "react";
import { AdminRowTableProps, CategoryRow } from "../../utils/types/type";
import { RenderAdminCategoryColumns } from "./ColumnManageCategoryPage";

// Thành phần AdminCategoryTable sử dụng React.FC với kiểu AdminCategoryTableProps
const AdminCategoryTable: React.FC<AdminRowTableProps<CategoryRow>> = (props) => {

    return (
        // DataTable là một bảng dữ liệu, hiển thị danh sách bộ đề (lectures) từ props
        <DataTable
            emptyMessage="Không có bộ đề"
            value={props.rows?? []} // Dữ liệu nguồn từ props.lectures
            size="small" // Kích thước của bảng được thiết lập là nhỏ
            loading={props.rows === null} // Hiển thị trạng thái "loading" nếu danh sách bộ đề rỗng
            dataKey="id" // Sử dụng thuộc tính "id" làm khóa chính cho các hàng trong bảng
        >
            {/* Gọi hàm RenderAdminCategoryColumns để render các cột bảng, truyền dispatch qua props */}
            {RenderAdminCategoryColumns(props.dispatch)}
        </DataTable>
    )
};


export default AdminCategoryTable

