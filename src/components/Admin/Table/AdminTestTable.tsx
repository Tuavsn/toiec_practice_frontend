import { DataTable } from "primereact/datatable";
import React from "react";
import { AdminRowTableProps } from "../../../utils/types/props";
import { TestRow } from "../../../utils/types/type";
import { RenderAdminTestColumns } from "../AdminColumn/ColumnManageTestPage";

// Thành phần AdminTestTable sử dụng React.FC với kiểu AdminTestTableProps
const AdminTestTable: React.FC<AdminRowTableProps<TestRow>> = (props) => {

    return (
        // DataTable là một bảng dữ liệu, hiển thị danh sách các đề từ props
        <DataTable
            emptyMessage="Không có đề thi"
            stripedRows
            value={props.rows?? []} // Dữ liệu nguồn từ tests
            size="small" // Kích thước của bảng được thiết lập là nhỏ
            loading={props.rows === null} // Hiển thị trạng thái "loading" nếu danh sách đề thi rỗng
            dataKey="id" // Sử dụng thuộc tính "id" làm khóa chính cho các hàng trong bảng
        >
            {/* Gọi hàm RenderAdminTestColumns để render các cột bảng, truyền dispatch qua props */}
            {RenderAdminTestColumns(props.dispatch)}
        </DataTable>
    )
};


export default AdminTestTable

