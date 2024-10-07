import { Card } from "primereact/card";
import React, { memo } from "react";
import AdminManageTestPage from "./AdminManageTestPage";
import { Toast } from "primereact/toast";
import { SimpleDialog } from "../components/Common/Dialog/SimpleDialog";
import { GenericTable } from "../components/Common/Index";
import { BasicUser } from "../utils/types/type";
import { SimpleToolBar } from "../components/Common/ToolBar/ToolBar"
import { useDataTable } from "../hooks/useDataTable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import formatDate from "../utils/formatDateToString";
export function AdminManageAccountPage() {

    const emptyAccount: BasicUser = {
        id: "",
        email: "aaa@",
        role: "m",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
    }

    const {
        row, setRow, rows,
        selectedRows,
        globalFilter,
        dt, toast,
        hideDeleteRowsDialog,
        deleteRowsDialog,
        rowDialog,
        deleteSelectedRows,
        saveRow,
        hideDialog,
        hideDeleteRowDialog,
        deleteRow,
        submitted,
        totalRecords,
        page,
        deleteRowDialog,
        openNew,
        confirmDeleteSelected,
        exportCSV,
        editRow,
        confirmDeleteRow,
        setSelectedRows,
        setGlobalFilter,
        handleOnPage
    } = useDataTable<BasicUser>("https://dummyjson.com/c/cba1-c411-488b-9200", emptyAccount
        , (state) => ({
            saveRow: () => {
                state.setSubmitted(true);
                if (state.row.format.trim()) {
                    let _rows = [...state.rows];
                    let _row = { ...state.row };

                    if (state.row.id) {
                        const index = _rows.findIndex(item => item.id === state.row.id)

                        _rows[index] = _row;
                        state.toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Row Updated', life: 3000 });
                    } else {
                        (_row as any).id = crypto.randomUUID();

                        _rows.push(_row);
                        state.toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Row Created', life: 3000 });
                    }

                    state.setRows(_rows);
                    console.log(_rows);
                    state.setRowDialog(false);
                    state.setRow(emptyAccount);
                }
            },
        })
    );

    const renderColumns = [
        <Column key="col-selection" selectionMode="multiple" exportable={false} />,
        <Column key="col-id" field="id" header="ID" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-email" field="email" header="Email" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-timestamp" header="Time stamp" body={timeStampBodyTemplate} sortable style={{ minWidth: '10rem' }} />,
        <Column key="col-role" field="role" header="Role" style={{ minWidth: '17ream' }} />,
        <Column key="col-isActive" field="isActive" header="status" sortable body={statusBodyTemplate} />,
    ];

    return (
        <React.Fragment>
            <div key={'b'}>
                {/* <CustomBreadCrumb items={breadCrumbItems} /> */}
                <Card className="my-2">
                    <div key={'a'}>
                        <Toast ref={toast} />
                        <div className="card">
                            <SimpleToolBar
                                openNew={openNew}
                                confirmDeleteSelected={confirmDeleteSelected}
                                selectedRows={selectedRows}
                                exportCSV={exportCSV}
                            />
                            {GenericTable<BasicUser>(renderColumns, dt, rows, true, selectedRows, globalFilter, setGlobalFilter, setSelectedRows, totalRecords, page, handleOnPage, editRow, confirmDeleteRow)}
                        </div>
                        {SimpleDialog(
                            dialogBody(row, setRow, submitted),
                            rowDialog,
                            hideDialog,
                            saveRow,
                            row,
                            deleteRowsDialog,
                            hideDeleteRowsDialog,
                            deleteSelectedRows,
                            hideDeleteRowDialog,
                            deleteRow,
                            deleteRowDialog
                        )}
                    </div>
                </Card>
            </div>
        </React.Fragment>
    )
}


export default memo(AdminManageTestPage);


// ------------------------------------- helper function---------------------------------------------------

//--------------------- def columns---------------------------------
function timeStampBodyTemplate(rowData: BasicUser) {
    return (
        <Card className="flex align-items-center justify-content-start">
            <div className="flex align-items-center">
                <i className="pi pi-calendar-plus mr-2" style={{ color: 'slateblue' }}></i>
                {formatDate(rowData.createdAt)}
            </div>
            <div className="flex align-items-center">
                <i className="pi pi-pencil mr-2" style={{ color: 'red' }}></i>
                {formatDate(rowData.updatedAt)}
            </div>
        </Card>


    );
};


function getSeverity(category: BasicUser) {
    switch (category.isActive) {
        case true:
            return 'success';

        case false:
            return 'warning';
        default:
            return null;
    }
};

function statusBodyTemplate(rowData: BasicUser) {
    return <Tag value={(rowData.isActive) + ""} severity={getSeverity(rowData)}></Tag>;
};

//------------------------for dialog-------------------------------------

function dialogBody(row: BasicUser, setRow: (value: React.SetStateAction<BasicUser>) => void, submitted: boolean) {
    const onInputChange = (e: any, field: keyof BasicUser) => {
        const value = e.target.value ?? ''; // Ensuring fallback to an empty string if value is undefined
        setRow((prevRow) => ({
            ...prevRow,
            [field]: value
        }));
    };

    return (

        <div className="field">
            <label htmlFor="name" className="font-bold">email</label>
            <InputText
                id="name"
                value={row.email}
                onChange={(e) => onInputChange(e, 'email')}
                required
                autoFocus
                className={classNames({ 'p-invalid': submitted && !row.email })}
            />
            {submitted && !row.email && <small className="p-error">format is required.</small>}
        </div>

    )
}