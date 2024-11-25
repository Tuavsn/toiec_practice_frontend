import { DataTable } from "primereact/datatable";
import React from "react";
import { AdminLectureTableProps } from "../../utils/types/type";
import { RenderAdminLectureColumns } from "./ColumnManageLecturePage";

const AdminLectureTable: React.FC<AdminLectureTableProps> = (props) => {

    return (
        <DataTable value={props.lectures} size="small"
            loading={props.lectures.length <= 0}
            dataKey="id" >
            {RenderAdminLectureColumns(props.dispatch)}
        </DataTable>
    )
};

export default AdminLectureTable

