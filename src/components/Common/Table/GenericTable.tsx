import { useState } from 'react';
import { DataTable, DataTableValue } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnConfig } from './ColumnConfig';

export type GenericTableProps = {
    data: DataTableValue[];
    columns: ColumnConfig[];
};

export default function GenericTable(props: GenericTableProps) {

    const [data, setData] = useState<DataTableValue[]>(props.data);
    const [selectedData, setSelectedData] = useState<DataTableValue[]>([]);
    const [rowClick, setRowClick] = useState(true);

    return (
        <div className="card my-4">
            <DataTable
                value={data}
                paginator
                rows={5}
                rowsPerPageOptions={[10, 15, 25, 50]}
                selectionMode={'checkbox'}
                selection={selectedData}
                onSelectionChange={(e: any) => setSelectedData(e.value)}
                dataKey="code"
                tableStyle={{ minWidth: '50rem' }}
            >
                {props.columns.map((col, index) => (
                    <Column
                        key={index}
                        field={col.field}
                        header={col.header}
                        sortable={col.sortable}
                        selectionMode={col.selectionMode}
                        headerStyle={col.headerStyle}
                        body={col.body}
                    />
                ))}
            </DataTable>
        </div>
    );
}