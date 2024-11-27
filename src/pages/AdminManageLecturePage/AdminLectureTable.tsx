import { DataTable } from "primereact/datatable";
import React from "react";
import { AdminLectureTableProps } from "../../utils/types/type";
import { RenderAdminLectureColumns } from "./ColumnManageLecturePage";

// Thành phần AdminLectureTable sử dụng React.FC với kiểu AdminLectureTableProps
const AdminLectureTable: React.FC<AdminLectureTableProps> = (props) => {

    return (
        // DataTable là một bảng dữ liệu, hiển thị danh sách bài giảng (lectures) từ props
        <DataTable 
            value={props.lectures} // Dữ liệu nguồn từ props.lectures
            size="small" // Kích thước của bảng được thiết lập là nhỏ
            loading={props.lectures.length <= 0} // Hiển thị trạng thái "loading" nếu danh sách bài giảng rỗng
            dataKey="id" // Sử dụng thuộc tính "id" làm khóa chính cho các hàng trong bảng
        >
            {/* Gọi hàm RenderAdminLectureColumns để render các cột bảng, truyền dispatch qua props */}
            {RenderAdminLectureColumns(props.dispatch)}
        </DataTable>
    )
};


export default AdminLectureTable

