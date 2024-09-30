import { useState, useMemo } from 'react';
import { DataTable, DataTableValue } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnConfig } from './ColumnConfig';
import { ToolBar } from '../Index';

type GenericTableProps = {
    data: DataTableValue[];
    columns: ColumnConfig[];
    toolbar?: boolean;
    onAdd?: () => void;
    onEdit?: (rowData: any) => void;
    onDelete?: (rowData: any) => void;
    onImport?: () => void;
    onExport?: () => void;
    searchValue?: string;
    setSearchValue?: (value: string) => void;
};

export default function GenericTable({ data, columns, toolbar = false }: GenericTableProps) {
    const [selectedData, setSelectedData] = useState<DataTableValue[]>([]);

    const columnElements = useMemo(() => 
        columns.map((col, index) => (
            <Column
                key={index}
                field={col.field}
                header={col.header}
                sortable={col.sortable}
                headerStyle={col.headerStyle}
                body={col.body}
            />
        )),
    [columns]);

    return (
        <div>
            {toolbar && <ToolBar />}
            <DataTable
                className='card my-4'
                value={data}
                showGridlines
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
                selectionMode="checkbox"
                selection={selectedData}
                onSelectionChange={(e: { value: DataTableValue[] }) => setSelectedData(e.value)}
                dataKey="code"
                tableStyle={{ minWidth: '50rem' }}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                {columnElements}
            </DataTable>
        </div>
    );
}
