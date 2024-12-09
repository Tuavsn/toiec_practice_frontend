import { DataTable } from "primereact/datatable";
import React from "react";
import { AdminRowTableProps, Permission } from "../../utils/types/type";
import { RenderAdminPermissionColumns } from "./ColumnManagePermissionPage";

// Thành phần AdminPermissionTable sử dụng React.FC với kiểu AdminPermissionTableProps
const AdminPermissionTable: React.FC<AdminRowTableProps<Permission>> = (props) => {

    return (
        // DataTable là một bảng dữ liệu, hiển thị danh sách quyền từ props
        <DataTable
            emptyMessage="Không có quyền"
            value={props.rows?? []} // Dữ liệu nguồn từ props.lectures
            size="small" // Kích thước của bảng được thiết lập là nhỏ
            loading={props.rows === null} // Hiển thị trạng thái "loading" nếu danh sách quyền rỗng
            dataKey="id" // Sử dụng thuộc tính "id" làm khóa chính cho các hàng trong bảng
        >
            {/* Gọi hàm RenderAdminPermissionColumns để render các cột bảng, truyền dispatch qua props */}
            {RenderAdminPermissionColumns(props.dispatch)}
        </DataTable>
    )
};


export default AdminPermissionTable

