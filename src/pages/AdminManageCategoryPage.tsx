import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { memo } from "react";
import { useNavigate } from 'react-router-dom';
import { callCreateCateogry } from "../api/api";
import { SimpleDialog } from "../components/Common/Dialog/SimpleDialog";
import { CustomBreadCrumb } from "../components/Common/Index";
import { statusBodyTemplate, timeStampBodyTemplate } from "../components/Common/Table/CommonColumn";
import GenericTable from "../components/Common/Table/GenericTable";
import { SimpleToolBar } from "../components/Common/ToolBar/ToolBar";
import { useDataTable } from "../hooks/GenericDataTableHook";
import { CategoryRow } from "../utils/types/type";

function AdminManageCategoryPage() {
    const emptyCategory: CategoryRow = {
        id: "",
        format: "vô danh",
        year: 2020,
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true
    };

    const {
        row, setRow, rows,
        selectedRows,
        globalFilter,
        dt,
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
    } = useDataTable<CategoryRow>('categories', emptyCategory
        , (state) => ({
            saveRow: async () => await customSaveRowFunction(state, emptyCategory)
        })
    );

    const renderColumns = [
        <Column key="col-selection" selectionMode="multiple" exportable={false} />,
        <Column key="col-id" field="id" header="ID" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-format" field="format" header="Format" sortable filter style={{ minWidth: '16rem' }} />,
        <Column key="col-year" field="year" header="Year" sortable />,
        <Column key="col-timestamp" header="Time stamp" body={timeStampBodyTemplate} sortable style={{ minWidth: '10rem' }} />,
        <Column key="col-tests" field="tests" header="Tests" body={TestsBodyTemplate} style={{ minWidth: '17ream' }} />,
        <Column key="col-isActive" field="isActive" header="Active" sortable body={statusBodyTemplate} />,
    ];

    return (
        <React.Fragment>
            <div key={'b'}>
                <CustomBreadCrumb />
                <Card className="my-2">
                    <div key={'a'}>
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
async function customSaveRowFunction(state: any, emptyCategory: CategoryRow) {

    state.setSubmitted(true);
    if (state.row.format.trim()) {
        const _rows: CategoryRow[] = [...state.rows];
        const _row: CategoryRow = { ...state.row };
        // call api
        try {

            const createResponse = await callCreateCateogry(_row.format, _row.year);
            if (createResponse) {
                console.log(createResponse.statusCode);

                if (createResponse.statusCode === 201) {
                    state.toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Row Created', life: 3000 });
                    _rows.push(createResponse.data);
                }
            }
        }
        catch (error: any) {
            state.toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response.data.message, life: 5000 });
        }
        finally {
            state.setRows(_rows);
            console.log(_rows);
            state.setRowDialog(false);
            state.setRow(emptyCategory);
        }
    }

}
//--------------------- def columns---------------------------------


function TestsBodyTemplate(rowData: CategoryRow) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`${rowData.format}-${rowData.year}___${rowData.id}/tests`)
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
            <h3>Năm phát hành</h3>
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
