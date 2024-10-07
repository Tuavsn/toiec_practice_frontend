import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTablePageEvent, DataTableSelectionMultipleChangeEvent, DataTableValue } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import React, { Dispatch, ReactElement, RefObject, SetStateAction ,useCallback} from "react";

type ColumnElement = ReactElement<typeof Column>;
export default function GenericTable<Model extends DataTableValue>(
    columns: ColumnElement[],
    dt: RefObject<DataTable<Model[]>>,
    rows: Model[],
    isAddActionButtons: boolean,
    selectedRows: Model[],
    globalFilter:string,
    setGlobalFilter: Dispatch<SetStateAction<string>>,
    setSelectedRows:Dispatch<SetStateAction<Model[]>>,
    totalRecords: number,
    page: { first: number, rows: number },
    handleOnPage: (event: DataTablePageEvent) => void,
    editRow?:(a:Model)=>void,
    confirmDeleteRow?:(rowData:Model)=>void,
) {
    const handleSelectionChange = useCallback((e: DataTableSelectionMultipleChangeEvent<Model[]>) => {
        if (Array.isArray(e.value)) {
            setSelectedRows(e.value);
        }
    }, [setSelectedRows]); 
    const header = React.useMemo((): JSX.Element => (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Rows</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText
                    type="search"
                    placeholder="Search..."
                    onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        setGlobalFilter(target.value);
                    }}
                />
            </IconField>
        </div>
    ), [setGlobalFilter]);

    const renderColumns = React.useMemo(() => {
        const colCopy = [...columns]; // Copy to avoid mutating props

        if (isAddActionButtons && editRow && confirmDeleteRow) {
            colCopy.push(
                <Column
                    key="col-action"
                    body={(rowData) => actionBodyTemplate(rowData, editRow, confirmDeleteRow)}
                    exportable={false}
                    style={{ minWidth: '12rem' }}
                />
            );
        }

        return colCopy; 
    }, [columns, isAddActionButtons, editRow, confirmDeleteRow]);

    return (
        <DataTable
            showGridlines
            
            ref={dt}
            value={rows}
            selection={selectedRows}
            onSelectionChange={(e) => handleSelectionChange(e)}
            dataKey="id"
            paginator
            rows={page.rows}
            first={page.first}
            onPage={handleOnPage}
            totalRecords={totalRecords}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} categories"
            globalFilter={globalFilter}
            header={header}
            selectionMode="multiple"
        >
            {renderColumns}
        </DataTable>
    )
}

function actionBodyTemplate<Model> (rowData: Model, editRow:(a:Model)=>void,
confirmDeleteRow:(rowData:Model)=>void ) {
    return (
        <React.Fragment>
            <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editRow(rowData)} />
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteRow(rowData)} />
        </React.Fragment>
    );
};
