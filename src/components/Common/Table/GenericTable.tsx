import { useMemo } from 'react';
import { DataTable, DataTableValue } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnConfig } from './ColumnConfig';
import { ToolBar } from '../Index';
import { useTable } from '../../../hooks/GenericTableHook';
import { Toast } from 'primereact/toast';

type GenericTableProps = {
    data: DataTableValue[]
    columns: ColumnConfig[];
    toolbar?: boolean;
};

export default function GenericTable<T extends { id: string }>({ data, columns, toolbar = false}: GenericTableProps) {
    const { 
        dataRef, 
        selectedItems, 
        setSelectedItems,
        createItem,
        editItem,
        deleteItem,
        importCSV,
        exportCSV,
        toast
    } = useTable<T>();

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
            {
                toolbar && 
                <ToolBar
                    onCreate={createItem}
                    onEdit={editItem}
                    onDelete={deleteItem}
                    onImport={importCSV}
                    onExport={exportCSV}
                />
            }
            <DataTable
                className='card my-4'
                ref={dataRef}
                value={data}
                showGridlines
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
                selectionMode="checkbox"
                selection={selectedItems}
                onSelectionChange={(e: { value: DataTableValue[] }) => setSelectedItems(e.value)}
                dataKey="code"
                tableStyle={{ minWidth: '50rem' }}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                {columnElements}
            </DataTable>
            <Toast ref={toast} />
        </div>
    );
}
