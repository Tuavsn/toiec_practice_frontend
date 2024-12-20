import { DataTable } from "primereact/datatable";
import React from "react";
import { AdminRowTableProps, UserRow } from "../../../utils/types/type";
import { RenderAdminUserColumns } from "../AdminColumn/ColumnManageUserPage";

// Thành phần AdminUserTable sử dụng React.FC với kiểu AdminUserTableProps
const AdminUserTable: React.FC<AdminRowTableProps<UserRow>> = (props) => {

    return (
        // DataTable là một bảng dữ liệu, hiển thị danh sách bài học (lectures) từ props
        <DataTable
            emptyMessage="Không có người dùng"
            value={props.rows ?? []} // Dữ liệu nguồn từ props.lectures
            size="small" // Kích thước của bảng được thiết lập là nhỏ
            loading={props.rows === null} // Hiển thị trạng thái "loading" nếu danh sách bài học rỗng
            dataKey="id" // Sử dụng thuộc tính "id" làm khóa chính cho các hàng trong bảng
        >
            {/* Gọi hàm RenderAdminUserColumns để render các cột bảng, truyền dispatch qua props */}
            {RenderAdminUserColumns(props.dispatch)}
        </DataTable>
    )
};


export default AdminUserTable

