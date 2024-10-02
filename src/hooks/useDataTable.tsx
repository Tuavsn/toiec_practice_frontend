import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable, DataTableSelectionMultipleChangeEvent, DataTableValue } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { RadioButtonChangeEvent, RadioButton } from "primereact/radiobutton";
import { Toast} from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React from "react";
import { useState, useRef, useEffect } from "react";

type Model = DataTableValue;
type OverrideVoidFunction = null | ( () => void);
type OverrideChangeRowDatadFunction = null | ( (row: Model) => void)
export function useDataTable(
    inputData                       : Model[],
    defaultValues                   : Model,
    overrideColumns                 : React.ReactElement<typeof Column>[],
    isAddActionButtons              : boolean = true,
    overrideToolbar                 : null | React.ReactElement<typeof Toolbar> = null,
    overrideToast                   : null | React.ReactElement<typeof Toast> = null,
    overrideTable                   : null | React.ReactElement<typeof DataTable<Model[]>> = null,
    overrideRenderRowDialog         : null | React.ReactElement<typeof Dialog> = null,
    overrideRenderDeleteRowDialog   : null | React.ReactElement<typeof Dialog> = null,
    overrideRenderDeleteRowsDialog  : null | React.ReactElement<typeof Dialog> = null,
    overrideOpenNew                 : OverrideVoidFunction = null,
    overrideHideDialog              : OverrideVoidFunction = null,
    overrideHideDeleteRowDialog     : OverrideVoidFunction = null,
    overrideHideDeleteRowsDialog    : OverrideVoidFunction = null,
    overrideSaveRow                 : OverrideVoidFunction = null,
    overrideEditRow                 : OverrideChangeRowDatadFunction = null,
    overrideFindIndexById           : null | ( (id:string)=>number) = null,
    overrideConfirmDeleteRow        : OverrideVoidFunction = null,
    overrideDeleteRow               : OverrideVoidFunction = null,
    overrideExportCSV               : OverrideVoidFunction = null,
    overrideConfirmDeleteSelected   : OverrideVoidFunction = null,
    overrideDeleteSelectedRows      : OverrideVoidFunction = null,
) {
    const [rows, setRows] = useState<Model[]>([]);
    const [rowDialog, setRowDialog] = useState<boolean>(false);
    const [deleteRowDialog, setDeleteRowDialog] = useState<boolean>(false);
    const [deleteRowsDialog, setDeleteRowsDialog] = useState<boolean>(false);
    const [row, setRow] = useState<Model>(defaultValues);
    const [selectedRows, setSelectedRows] = useState<Model[]>([]);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Model[]>>(null);





    useEffect(() => {
        setRows(inputData);
        
    }, []);

    const openNew = overrideOpenNew || ( () => {
        setRow(defaultValues);
        setSubmitted(false);
        setRowDialog(true);
    } );

    const hideDialog = overrideHideDialog || ( () => {
        setSubmitted(false);
        setRowDialog(false);
    } );

    const hideDeleteRowDialog = overrideHideDeleteRowDialog || ( () => {
        setDeleteRowDialog(false);
    } );

    const hideDeleteRowsDialog = overrideHideDeleteRowsDialog || ( () => {
        setDeleteRowsDialog(false);
    } );

    const saveRow = overrideSaveRow  || ( () =>  {
        setSubmitted(true);

        if (row.name.trim()) {
            let _rows = [...rows];
            let _row = { ...row };

            if (row.id) {
                const index = findIndexById(row.id);

                _rows[index] = _row;
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Row Updated', life: 3000 });
            } else {
                (_row as any).id = createId();

                _rows.push(_row);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Row Created', life: 3000 });
            }

            setRows(_rows);
            console.log(_rows);
            setRowDialog(false);
            setRow(defaultValues);
        }
    });

    const editRow = overrideEditRow || ( (row: Model) => {
        setRow({ ...row });
        setRowDialog(true);
    });

    const confirmDeleteRow = overrideConfirmDeleteRow || ( (row: Model) => {
        setRow(row);
        setDeleteRowDialog(true);
    });

    const deleteRow = overrideDeleteRow  || ( () =>  {
        let _rows = rows.filter((val) => val.id !== row.id);

        setRows(_rows);
        setDeleteRowDialog(false);
        setRow(defaultValues);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Row Deleted', life: 3000 });
    });

    const findIndexById = overrideFindIndexById || ( (id: string):number => {
        let index = -1;

        for (let i = 0; i < rows.length; i++) {
            if (rows[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    });

    const createId = (): string => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 24; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const exportCSV = overrideExportCSV  || ( () =>  {
        dt.current?.exportCSV();
    });

    const confirmDeleteSelected = overrideConfirmDeleteSelected  || ( () =>  {
        setDeleteRowsDialog(true);
    });

    const deleteSelectedRows = overrideDeleteSelectedRows  || ( () =>  {
        let _rows = rows.filter((val) => !selectedRows.includes(val));

        setRows(_rows);
        setDeleteRowsDialog(false);
        setSelectedRows([]);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Rows Deleted', life: 3000 });
    });

    const onRowCreatedByChange = (e: RadioButtonChangeEvent) => {
        setRow((prevRow) => ({
            ...prevRow,
            created_by: e.value
        }));
    };


    const onInputChange = (e: any, field: keyof Model) => {
        const value = e.target.value ?? ''; // Ensuring fallback to an empty string if value is undefined
        setRow((prevRow) => ({
            ...prevRow,
            [field]: value
        }));
    };


    const leftToolbarTemplate =  () =>  {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedRows || !selectedRows.length} />
            </div>
        );
    };

    const rightToolbarTemplate =  () =>  {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };



    const actionBodyTemplate = (rowData: Model) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editRow(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteRow(rowData)} />
            </React.Fragment>
        );
    };




    const rowDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveRow} />
        </React.Fragment>
    );
    const deleteRowDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteRowDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteRow} />
        </React.Fragment>
    );
    const deleteRowsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteRowsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedRows} />
        </React.Fragment>
    );
    const renderDeleteRowsDialog = overrideRenderDeleteRowsDialog  || (
            <Dialog
                key={'DeleteRowsDialog'}
                visible={deleteRowsDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Confirm"
                modal
                footer={deleteRowsDialogFooter}
                onHide={hideDeleteRowsDialog}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {row && <span>Are you sure you want to delete the selected rows?</span>}
                </div>
            </Dialog>
        );

    const renderDeleteRowDialog = overrideRenderDeleteRowDialog  || 
            <Dialog
                key={'DeleteRowDialog'}
                visible={deleteRowDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Confirm"
                modal
                footer={deleteRowDialogFooter}
                onHide={hideDeleteRowDialog}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {row && <span>Are you sure you want to delete <b>{row.name}</b>?</span>}
                </div>
            </Dialog>
        
  
    const handleSelectionChange = (e: DataTableSelectionMultipleChangeEvent<Model[]>) => {
        if (Array.isArray(e.value)) {
            setSelectedRows(e.value);
        }
    };
    const renderRowRadioButtons =  () =>  {
        const rowsOptions = [
            { label: 'Accessories', value: 'Accessories' },
            { label: 'Clothing', value: 'Clothing' },
            { label: 'Electronics', value: 'Electronics' },
            { label: 'Fitness', value: 'Fitness' }
        ];

        return (
            <div className="field">
                <label className="mb-3 font-bold">Row Type</label>
                <div className="formgrid grid">
                    {rowsOptions.map((option, index) => (
                        <div key={option.value} className="field-radiobutton col-6">
                            <RadioButton
                                inputId={`row${index}`}
                                name="row"
                                value={option.value}
                                onChange={onRowCreatedByChange}
                                checked={row.created_by === option.value}
                            />
                            <label htmlFor={`row${index}`}>{option.label}</label>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderRowDialog = overrideRenderRowDialog  || (  
            <Dialog
                key={'RowDialog'}
                visible={rowDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Row Details"
                modal
                className="p-fluid"
                footer={rowDialogFooter}
                onHide={hideDialog}
            >
                <div className="field">
                    <label htmlFor="name" className="font-bold">Name</label>
                    <InputText
                        id="name"
                        value={row.name}
                        onChange={(e) => onInputChange(e, 'name')}
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !row.name })}
                    />
                    {submitted && !row.name && <small className="p-error">Name is required.</small>}
                </div>

                {/* Radio buttons for row selection */}
                {renderRowRadioButtons()}

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="createdAt" className="font-bold">Created At</label>
                        <Calendar
                            id="createdAt"
                            value={row.created_at ? new Date(row.created_at) : new Date()}
                            onChange={(e) => onInputChange(e, 'created_at')} // Adjusted to match the Calendar's output
                            dateFormat="dd/mm//yy" // Format as needed
                            showIcon
                        />
                    </div>

                </div>
            </Dialog>
        );


    if(isAddActionButtons){
        overrideColumns.push(
            <Column key="col-action"body={actionBodyTemplate}    exportable={false} style={{ minWidth: '12rem' }}/>
        );
    }

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Rows</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" placeholder="Search..." onInput={(e) => { const target = e.target as HTMLInputElement; setGlobalFilter(target.value); }} />
            </IconField>
        </div>
    );
    const renderDialogs = [
        renderRowDialog,
        renderDeleteRowDialog,
        renderDeleteRowsDialog
    ]

    const renderTable = overrideTable || (
        <DataTable
            ref={dt}
            value={rows}
            selection={selectedRows}
            onSelectionChange={(e) => handleSelectionChange(e)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} categories"
            globalFilter={globalFilter}
            header={header}
            selectionMode="multiple"

        >
            {overrideColumns}
        </DataTable>
    )

    const renderToast = overrideToast || (
        <Toast ref={toast} />
    );

    const renderToolbar = overrideToolbar || (
        <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate} />
    )

    const returnObject: {
        setRows: React.Dispatch<React.SetStateAction<Model[]>>,
        openNew?: OverrideVoidFunction;
        hideDialog?: OverrideVoidFunction;
        hideDeleteRowDialog?: OverrideVoidFunction;
        hideDeleteRowsDialog?: OverrideVoidFunction;
        saveRow?: OverrideVoidFunction;
        editRow?: OverrideChangeRowDatadFunction;
        findIndexById?: (id: string) => number;
        confirmDeleteRow?: OverrideVoidFunction;
        deleteRow?: OverrideVoidFunction;
        exportCSV?: OverrideVoidFunction;
        confirmDeleteSelected?: OverrideVoidFunction;
        deleteSelectedRows?: OverrideVoidFunction;
        toolbar?:  React.ReactElement<typeof Toolbar> | null;
        toast?:  React.ReactElement<typeof Toast> | null;
        table?: React.ReactElement<typeof DataTable<Model[]>> | null;
        dialogs?: React.ReactElement<typeof Dialog>[] | null;
    } = {setRows};

    // Conditionally add functions if they are provided
    if (overrideOpenNew) returnObject.openNew = overrideOpenNew;
    if (overrideHideDialog) returnObject.hideDialog = overrideHideDialog;
    if (overrideHideDeleteRowDialog) returnObject.hideDeleteRowDialog = overrideHideDeleteRowDialog;
    if (overrideHideDeleteRowsDialog) returnObject.hideDeleteRowsDialog = overrideHideDeleteRowsDialog;
    if (overrideSaveRow) returnObject.saveRow = overrideSaveRow;
    if (overrideEditRow) returnObject.editRow = overrideEditRow;
    if (overrideFindIndexById) returnObject.findIndexById = overrideFindIndexById;
    if (overrideConfirmDeleteRow) returnObject.confirmDeleteRow = overrideConfirmDeleteRow;
    if (overrideDeleteRow) returnObject.deleteRow = overrideDeleteRow;
    if (overrideExportCSV) returnObject.exportCSV = overrideExportCSV;
    if (overrideConfirmDeleteSelected) returnObject.confirmDeleteSelected = overrideConfirmDeleteSelected;
    if (overrideDeleteSelectedRows) returnObject.deleteSelectedRows = overrideDeleteSelectedRows;

    // Add optional UI components
    returnObject.toolbar = renderToolbar;
    returnObject.toast = renderToast;
    returnObject.table = renderTable;
    returnObject.dialogs = renderDialogs;

    return returnObject;


}
