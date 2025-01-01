import { DataTable } from "primereact/datatable";
import React from "react";
import { AdminUserTableProps } from "../../../utils/types/props";
import { RenderAdminUserColumns } from "../AdminColumn/ColumnManageUserPage";
import SearchTextBox from "../AdminToolbar/SearchTextBox";

// Thành phần AdminUserTable sử dụng React.FC với kiểu AdminUserTableProps
const AdminUserTable: React.FC<AdminUserTableProps> = ({ rows, dispatch }) => {

    return (
        // DataTable là một bảng dữ liệu, hiển thị danh sách bài học (lectures) từ props
        <DataTable
            header={<SearchTextBox dispatchSearch={dispatch} />} // Thanh tìm kiếm được render bằng hàm SearchTextBox
            emptyMessage="Không có người dùng"
            value={rows ?? []} // Dữ liệu nguồn từ users
            size="small" // Kích thước của bảng được thiết lập là nhỏ
            loading={rows === null} // Hiển thị trạng thái "loading" nếu danh sách người dùng rỗng
            dataKey="id" // Sử dụng thuộc tính "id" làm khóa chính cho các hàng trong bảng
        >
            {/* Gọi hàm RenderAdminUserColumns để render các cột bảng, truyền dispatch qua props */}
            {RenderAdminUserColumns(dispatch)}
        </DataTable>
    )
};


export default AdminUserTable

