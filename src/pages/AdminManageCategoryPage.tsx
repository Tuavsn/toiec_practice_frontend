import { Card } from "primereact/card";
import { memo } from "react";
import { Column } from "primereact/column";
import GenericTable from "../components/Common/Table/GenericTable";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { SimpleDialog } from "../components/Common/Dialog/SimpleDialog";
import { useDataTable } from "../hooks/useDataTable";
import React from "react";
import { CustomBreadCrumb } from "../components/Common/Index";
import { CategoryRow } from "../utils/types/type";
import { useNavigate } from 'react-router-dom';
import { SimpleToolBar } from "../components/Common/ToolBar/ToolBar";
import { timeStampBodyTemplate, statusBodyTemplate } from "../components/Common/Table/CommonColumn";
import { Calendar } from "primereact/calendar";




const breadCrumbItems = [
    { label: 'Trang chủ', icon: 'pi pi-home', url: '/' },
    { label: 'Dashboard', icon: 'pi pi-cog', url: '/dashboard' },
];

export function AdminManageCategoryPage() {
    const emptyCategory: CategoryRow = {
        id: "",
        format: "vô danh",
        year: 2020,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
    };

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
        deleteRowDialog,
        openNew,
        page, totalRecords, handleOnPage,
        confirmDeleteSelected,
        exportCSV,
        editRow,
        confirmDeleteRow,
        setSelectedRows,
        setGlobalFilter
    } = useDataTable<CategoryRow>("https://dummyjson.com/c/5667-8045-46d4-a86d", emptyCategory
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
                        (_row as any).id = createId();

                        _rows.push(_row);
                        state.toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Row Created', life: 3000 });
                    }

                    state.setRows(_rows);
                    console.log(_rows);
                    state.setRowDialog(false);
                    state.setRow(emptyCategory);
                }
            },
        })
    );




    const renderColumns = [
        <Column key="col-selection" selectionMode="multiple" exportable={false} />,
        <Column key="col-id" field="id" header="ID" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-format" field="format" header="Format" sortable filter style={{ minWidth: '16rem' }} />,
        <Column key="col-year" field="year" header="Year" sortable />,
        <Column key="col-timestamp" header="Time stamp" body={timeStampBodyTemplate} sortable style={{ minWidth: '10rem' }} />,
        <Column key="col-tests" field="tests" header="Tests" body={TestsBodyTemplate} style={{ minWidth: '17ream' }} />,
        <Column key="col-isActive" field="isActive" header="status" sortable body={statusBodyTemplate} />,
    ];


    // console.log("render ");

    return (
        <React.Fragment>
            <div key={'b'}>
                <CustomBreadCrumb items={breadCrumbItems} />
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
                            {GenericTable<CategoryRow>(renderColumns, dt, rows, true, selectedRows, globalFilter, setGlobalFilter, setSelectedRows, totalRecords, page, handleOnPage, editRow, confirmDeleteRow)}
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

export default memo(AdminManageCategoryPage);


// ------------------------------------- helper function---------------------------------------------------

//--------------------- def columns---------------------------------


function TestsBodyTemplate(rowData: CategoryRow) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/dashboard/test?category_id=' + rowData.id)
    };

    return (
        <Button severity="info" onClick={handleClick}>Chi tiết</Button>
    )
}

//---------------------- for tool bar ----------------------------------


//------------------------for dialog-------------------------------------

function dialogBody(row: CategoryRow, setRow: (value: React.SetStateAction<CategoryRow>) => void, submitted: boolean) {
    const onInputChange = (e: any, field: keyof CategoryRow) => {
        const value = e.target.value ?? ''; // Ensuring fallback to an empty string if value is undefined
        setRow((prevRow) => ({
            ...prevRow,
            [field]: value
        }));
    };

    return (

        <div className="field">
            <label htmlFor="format" className="font-bold">Format</label>
            <InputText
                id="format"
                value={row.format}
                onChange={(e) => onInputChange(e, 'format')}
                required
                autoFocus
                className={classNames({ 'p-invalid': submitted && !row.format })}
            />
            {submitted && !row.format && <small className="p-error">format is required.</small>}
            <Calendar
                value={row.year ? new Date(row.year, 0, 1) : null}  // Convert year number to Date object (Jan 1st)
                onChange={(e) => {
                    const selectedYear = e.value?.getFullYear() ?? null;
                    if (selectedYear !== null) {
                        row.year = selectedYear;  // Update row.year directly
                    }
                }}
                view="year"
                dateFormat="yy"
                placeholder="Select Year"
            />
        </div >

    )
}



function createId(): string {
    let id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 24; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
};