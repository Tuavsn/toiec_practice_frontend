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
import { TestCategory } from "../utils/types/type";
import { Tag } from "primereact/tag";
import { useNavigate } from 'react-router-dom';
import { SimpleToolBar } from "../components/Common/ToolBar/ToolBar";
import formatDate from "../utils/formatDateToString";




const breadCrumbItems = [
    { label: 'Trang chủ', icon: 'pi pi-home', url: '/' },
    { label: 'Dashboard', icon: 'pi pi-cog', url: '/dashboard' },
];

export function AdminManageCategoryPage() {
    const emptyCategory: TestCategory = {
        id: "",
        format: "vô danh",
        year: -9999,
        createdAt: new Date(),
        updatedAt: new Date(),
        tests: [],
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
    } = useDataTable<TestCategory>("https://dummyjson.com/c/5667-8045-46d4-a86d", emptyCategory
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


    console.log("render ");

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
                            {GenericTable<TestCategory>(renderColumns, dt, rows, true, selectedRows, globalFilter, setGlobalFilter, setSelectedRows, totalRecords, page, handleOnPage, editRow, confirmDeleteRow)}
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
function timeStampBodyTemplate(rowData: TestCategory) {
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

function getSeverity(category: TestCategory) {
    switch (category.isActive) {
        case true:
            return 'success';

        case false:
            return 'warning';
        default:
            return null;
    }
};

function statusBodyTemplate(rowData: TestCategory) {
    return <Tag value={(rowData.isActive) + ""} severity={getSeverity(rowData)}></Tag>;
};


function TestsBodyTemplate(rowData: TestCategory) {
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

function dialogBody(row: TestCategory, setRow: (value: React.SetStateAction<TestCategory>) => void, submitted: boolean) {
    const onInputChange = (e: any, field: keyof TestCategory) => {
        const value = e.target.value ?? ''; // Ensuring fallback to an empty string if value is undefined
        setRow((prevRow) => ({
            ...prevRow,
            [field]: value
        }));
    };

    return (

        <div className="field">
            <label htmlFor="name" className="font-bold">Name</label>
            <InputText
                id="name"
                value={row.format}
                onChange={(e) => onInputChange(e, 'format')}
                required
                autoFocus
                className={classNames({ 'p-invalid': submitted && !row.format })}
            />
            {submitted && !row.format && <small className="p-error">format is required.</small>}
        </div>

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