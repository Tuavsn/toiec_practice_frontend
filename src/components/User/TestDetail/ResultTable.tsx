import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import convertSecondsToString from "../../../utils/helperFunction/convertSecondsToString";
import formatDate from "../../../utils/helperFunction/formatDateToString";
import { ResultTableProps } from "../../../utils/types/props";
import { CountAnswerTypeTemplate, detailUserResultRowBodyTemplate, typeUserResultRowBodyTemplate } from "../../Common/Column/CommonColumn";


const ResultTable: React.FC<ResultTableProps> = React.memo((props) => {
    const columns = [
        <Column
            key="col-createdAt"
            field="createdAt"
            header="Ngày làm"
            bodyClassName="text-center"
            body={(rowData: { createdAt: Date }) => formatDate(rowData.createdAt)}
            headerClassName="col-createdAt-header"
            data-testid="col-createdAt"
        />,
        <Column
            key="col-answer_count"
            header="thống kê"
            body={CountAnswerTypeTemplate}
            sortable
            filter
            data-testid="col-answer_count"
        />,
        <Column
            key="col-time"
            field="totalTime"
            header="Thời gian làm bài"
            body={(row) => convertSecondsToString(row.totalTime)}
            sortable
            filter
            data-testid="col-time"
        />,
        <Column
            key="col-type"
            header="Loại"
            body={typeUserResultRowBodyTemplate}
            headerClassName="w-max"
            alignHeader="center"
            data-testid="col-type"
        />,
        <Column
            key="col-detail"
            bodyClassName="text-center"
            body={(row) => detailUserResultRowBodyTemplate({ id: row.resultId })}
            data-testid="col-detail"
        />,
    ];

    return (
        <section data-testid="result-table-section">
            <h3 data-testid="result-table-header">Kết quả làm bài của bạn:</h3>
            <DataTable
                size="small"
                value={props.resultsOverview}
                showGridlines
                stripedRows
                emptyMessage="Không có bài làm nào trước đây"
                loading={!props.id}
                paginator
                totalRecords={props.resultsOverview.length}
                rows={5}
                scrollable
                scrollHeight="600px"
                data-testid="result-table"
            >
                {columns}
            </DataTable>
        </section>
    );
});


export default ResultTable;