import { Card } from "primereact/card";
import { memo } from "react";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import GenericTable from "../components/Common/Table/GenericTable";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { SimpleDialog } from "../components/Common/Dialog/SimpleDialog";
import { useDataTable } from "../hooks/useDataTable";
import React from "react";
import { CustomBreadCrumb } from "../components/Common/Index";
import { VirtualScroller, VirtualScrollerTemplateOptions } from "primereact/virtualscroller";
import { TestCategory } from "../utils/types/type";




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
        tests: []
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
        confirmDeleteSelected,
        exportCSV,
        editRow,
        confirmDeleteRow,
        setSelectedRows,
        setGlobalFilter
    } = useDataTable<TestCategory>(GetFakeData(), emptyCategory
        , (state)=> ({
            saveRow: () => {
                state.setSubmitted(true);
                if (state.row.format.trim()) {
                    let _rows = [...state.rows];
                    let _row = { ...state.row };
        
                    if (state.row.id) {
                        const index = state.findIndexById(state.row.id);
        
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
        <Column key="col-id" field="id" header="ID" sortable style={{ minWidth: '12rem' }} />,
        <Column key="col-format" field="format" header="Format" sortable style={{ minWidth: '16rem' }} />,
        <Column key="col-year" field="year" header="Year" sortable style={{ minWidth: '8rem' }} />,
        <Column key="col-createdAt" field="createdAt" header="Created At" body={createdAtBodyTemplate} sortable style={{ minWidth: '12rem' }} />,
        <Column key="col-updatedAt" field="updatedAt" header="Updated At" body={updatedAtBodyTemplate} sortable style={{ minWidth: '12rem' }} />,
        <Column key="col-tests" field="tests" header="Tests" body={TestsBodyTemplate} style={{ minWidth: '17ream' }} />
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
                            <Toolbar className="mb-4"
                                start={leftToolbarTemplate(openNew, confirmDeleteSelected, selectedRows)}
                                end={rightToolbarTemplate(exportCSV)} />
                            {GenericTable<TestCategory>(renderColumns, dt, rows, true, selectedRows, globalFilter, setGlobalFilter, setSelectedRows, editRow, confirmDeleteRow)}
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
function createdAtBodyTemplate(rowData: TestCategory) {
    return (
        <Calendar
            value={new Date(rowData.createdAt)}
            dateFormat="dd/mm/yy"
            showIcon
            disabled
        />
    );
};

// function getSeverity(category: TestCategory) {
//     switch (category.is_active) {
//         case true:
//             return 'success';

//         case false:
//             return 'warning';
//         default:
//             return null;
//     }
// };

// function statusBodyTemplate(rowData: TestCategory) {
//     return <Tag value={(rowData.is_active) + ""} severity={getSeverity(rowData)}></Tag>;
// };

function updatedAtBodyTemplate(rowData: TestCategory) {
    return (
        <Calendar
            value={new Date(rowData.updatedAt)}
            dateFormat="dd/mm/yy"
            showIcon
            disabled
        />
    );
};

function TestsBodyTemplate(rowData: TestCategory) {

    const handleClick = (testId: string) => {
        // Handle the click event
        alert(`You clicked on: ${testId}`);
    };

    const itemTemplate = (item: string, options: VirtualScrollerTemplateOptions) => {
        const className = classNames('flex align-items-center p-2', {
            'surface-hover': options.odd
        });
        return (
            <button
                className={className}
                style={{ height: options.props.itemSize + 'px', width: '100%', border: 'none', background: '#f0000055', textAlign: 'left', cursor: 'pointer' }}
                onClick={() => handleClick(item)}
            >
                {item}
            </button>
        );
    };

    return (
        <VirtualScroller
            items={rowData.tests}
            itemSize={50}
            itemTemplate={itemTemplate}
            className="border-1 surface-border border-round"
            style={{ minWidth: '200px', height: '200px' }}
        />
    )
}

//---------------------- for tool bar ----------------------------------
function leftToolbarTemplate(
    openNew: () => void,
    confirmDeleteSelected: () => void,
    selectedRows: TestCategory[]) {

    return (
        <div className="flex flex-wrap gap-2">
            <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
            <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedRows || !selectedRows.length} />
        </div>
    );
}

function rightToolbarTemplate(exportCSV: () => void) {
    return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
}

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





function GetFakeData(): TestCategory[] {
    return [
        {
            id: "1",
            format: "Electronics",
            year: 2024,
            createdAt: new Date("2024-01-15T10:00:00Z"),
            updatedAt: new Date("2024-03-10T12:30:00Z"),
            tests: ["11119999999999999999999999999999", "2222", "1111", "2222", "1111", "2222", "1111", "2222", "1111", "2222"]
        },
        {
            id: "2",
            format: "Books",
            year: 2023,
            createdAt: new Date("2023-06-22T09:15:00Z"),
            updatedAt: new Date("2024-01-05T11:00:00Z"),
            tests: ["1111", "2222", "1111", "2222", "1111", "2222", "1111", "2222", "1111", "2222"]
        },
        {
            id: "3",
            format: "Fashion",
            year: 2022,
            createdAt: new Date("2022-05-10T14:45:00Z"),
            updatedAt: new Date("2023-12-30T08:30:00Z"),
            tests: ["1111", "2222", "1111", "2222", "1111", "2222", "1111", "2222", "1111", "2222"]
        },
        {
            id: "4",
            format: "Home & Kitchen",
            year: 2024,
            createdAt: new Date("2024-02-01T07:20:00Z"),
            updatedAt: new Date("2024-04-15T13:15:00Z"),
            tests: ["1111", "2222", "1111", "2222", "1111", "2222", "1111", "2222", "1111", "2222"]
        },
        {
            id: "5",
            format: "Sports",
            year: 2023,
            createdAt: new Date("2023-09-10T16:00:00Z"),
            updatedAt: new Date("2023-11-25T10:00:00Z"),
            tests: ["1111", "2222", "1111", "2222", "1111", "2222", "1111", "2222", "1111", "2222"]
        }
    ]
}


function createId(): string {
    let id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 24; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
};