import { DataTable } from "primereact/datatable";
import React from "react";
import { AdminPermissionTableProps } from "../../../utils/types/props";
import { RenderAdminPermissionColumns } from "../AdminColumn/ColumnManagePermissionPage";
import SearchTextBox from "../AdminToolbar/SearchTextBox";

// Thành phần AdminPermissionTable sử dụng React.FC với kiểu AdminPermissionTableProps
const AdminPermissionTable: React.FC<AdminPermissionTableProps> = ({ rows, dispatch }) => {

    return (
        // DataTable là một bảng dữ liệu, hiển thị danh sách quyền từ props
        <DataTable
            header={<SearchTextBox dispatchSearch={dispatch} />}
            emptyMessage="Không có quyền"
            value={rows ?? []} // Dữ liệu nguồn từ props.lectures
            size="small" // Kích thước của bảng được thiết lập là nhỏ
            loading={rows === null} // Hiển thị trạng thái "loading" nếu danh sách quyền rỗng
            dataKey="id" // Sử dụng thuộc tính "id" làm khóa chính cho các hàng trong bảng
        >
            {/* Gọi hàm RenderAdminPermissionColumns để render các cột bảng, truyền dispatch qua props */}
            {RenderAdminPermissionColumns(dispatch)}
        </DataTable>
    )
};


export default AdminPermissionTable

