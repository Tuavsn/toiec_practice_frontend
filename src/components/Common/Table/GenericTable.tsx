import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTablePageEvent, DataTableSelectionMultipleChangeEvent, DataTableValue } from "primereact/datatable";
import React, { Dispatch, ReactElement, RefObject, SetStateAction, useCallback } from "react";
import { SearchInput } from "./SearchInput";
import { Paginator } from "primereact/paginator";

type ColumnElement = ReactElement<typeof Column>;
export default function GenericTable<Model extends DataTableValue>(
    columns: ColumnElement[],
    dt: RefObject<DataTable<Model[]>>,
    rows: Model[],
    isAddActionButtons: boolean,
    selectedRows: Model[],
    globalFilter: string,
    setGlobalFilter: Dispatch<SetStateAction<string>>,
    setSelectedRows: Dispatch<SetStateAction<Model[]>>,
    totalRecords: number,
    page: { first: number, rows: number },
    handleOnPage: (event: DataTablePageEvent) => void,
    editRow?: (a: Model) => void,
    confirmDeleteRow?: (rowData: Model) => void,
) {
    const handleSelectionChange = useCallback((e: DataTableSelectionMultipleChangeEvent<Model[]>) => {
        if (Array.isArray(e.value)) {
            setSelectedRows(e.value);
        }
    }, [setSelectedRows]);
    const header = React.useMemo((): JSX.Element => (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Rows</h4>
            <SearchInput setGlobalFilter={setGlobalFilter} />
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

                />
            );
        }

        return colCopy;
    }, [columns, isAddActionButtons, editRow, confirmDeleteRow]);

    return (
        <React.Fragment>

            <DataTable
                loading={totalRecords <= 0}
                showGridlines
                size="small"
                ref={dt}
                value={rows}
                selection={selectedRows}
                onSelectionChange={(e) => handleSelectionChange(e)}
                dataKey="id"
                globalFilter={globalFilter}
                header={header}
                selectionMode="multiple"
            >
                {renderColumns}
            </DataTable>
            <Paginator first={page.first} rows={page.rows} totalRecords={totalRecords} onPageChange={handleOnPage} />
        </React.Fragment>
    )
}

function actionBodyTemplate<Model>(rowData: Model, editRow: (a: Model) => void,
    confirmDeleteRow: (rowData: Model) => void) {
    return (
        <div className="flex justify-content-around">
            <Button icon="pi pi-pencil" rounded outlined style={{ width: "50px", height: "50px" }} onClick={() => editRow(rowData)} />
            <Button icon="pi pi-trash" rounded outlined style={{ width: "50px", height: "50px" }} severity="danger" onClick={() => confirmDeleteRow(rowData)} />
        </div>
    );
};
