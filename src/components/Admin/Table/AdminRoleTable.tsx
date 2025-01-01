import { DataTable } from "primereact/datatable";
import React from "react";
import { AdminRowTableProps } from "../../../utils/types/props";
import { Role } from "../../../utils/types/type";
import { RenderAdminRoleColumns } from "../AdminColumn/ColumnManageRolePage";

// Thành phần AdminRoleTable sử dụng React.FC với kiểu AdminRoleTableProps
const AdminRoleTable: React.FC<AdminRowTableProps<Role>> = (props) => {

    return (
        // DataTable là một bảng dữ liệu, hiển thị danh sách vai trò từ props
        <DataTable
            emptyMessage="Không có vai trò"
            value={props.rows?? []} // Dữ liệu nguồn từ props.lectures
            size="small" // Kích thước của bảng được thiết lập là nhỏ
            loading={props.rows === null} // Hiển thị trạng thái "loading" nếu danh sách vai trò rỗng
            dataKey="id" // Sử dụng thuộc tính "id" làm khóa chính cho các hàng trong bảng
        >
            {/* Gọi hàm RenderAdminRoleColumns để render các cột bảng, truyền dispatch qua props */}
            {RenderAdminRoleColumns(props.dispatch)}
        </DataTable>
    )
};


export default AdminRoleTable

