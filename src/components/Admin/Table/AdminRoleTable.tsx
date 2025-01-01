import { DataTable } from "primereact/datatable";
import React from "react";
import { AdminRoleTableProps } from "../../../utils/types/props";
import { RenderAdminRoleColumns } from "../AdminColumn/ColumnManageRolePage";
import SearchTextBox from "../AdminToolbar/SearchTextBox";

// Thành phần AdminRoleTable sử dụng React.FC với kiểu AdminRoleTableProps
const AdminRoleTable: React.FC<AdminRoleTableProps> = ({ rows, dispatch }) => {

    return (
        // DataTable là một bảng dữ liệu, hiển thị danh sách vai trò từ props
        <DataTable
            header={<SearchTextBox dispatchSearch={dispatch} />}
            emptyMessage="Không có vai trò"
            value={rows ?? []} // Dữ liệu nguồn từ props.lectures
            size="small" // Kích thước của bảng được thiết lập là nhỏ
            loading={rows === null} // Hiển thị trạng thái "loading" nếu danh sách vai trò rỗng
            dataKey="id" // Sử dụng thuộc tính "id" làm khóa chính cho các hàng trong bảng
        >
            {/* Gọi hàm RenderAdminRoleColumns để render các cột bảng, truyền dispatch qua props */}
            {RenderAdminRoleColumns(dispatch)}
        </DataTable>
    )
};


export default AdminRoleTable

