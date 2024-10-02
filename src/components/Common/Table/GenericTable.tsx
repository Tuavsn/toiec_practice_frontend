import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { DataTable, DataTableSelectionMultipleChangeEvent, DataTableValue } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { RadioButtonChangeEvent, RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React from "react";
import { useState, useRef, useEffect } from "react";

export function useDataTable<Model extends DataTableValue>(
    inputData: Model[],
    defaultValues: Model,
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

    const openNew = () => {
        setRow(defaultValues);
        setSubmitted(false);
        setRowDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setRowDialog(false);
    };

    const hideDeleteRowDialog = () => {
        setDeleteRowDialog(false);
    };

    const hideDeleteRowsDialog = () => {
        setDeleteRowsDialog(false);
    };

    const saveRow = () => {
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
    };

    const editRow = (row: Model) => {
        setRow({ ...row });
        setRowDialog(true);
    };

    const confirmDeleteRow = (row: Model) => {
        setRow(row);
        setDeleteRowDialog(true);
    };

    const deleteRow = () => {
        let _rows = rows.filter((val) => val.id !== row.id);

        setRows(_rows);
        setDeleteRowDialog(false);
        setRow(defaultValues);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Row Deleted', life: 3000 });
    };

    const findIndexById = (id: string) => {
        let index = -1;

        for (let i = 0; i < rows.length; i++) {
            if (rows[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = (): string => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteRowsDialog(true);
    };

    const deleteSelectedRows = () => {
        let _rows = rows.filter((val) => !selectedRows.includes(val));

        setRows(_rows);
        setDeleteRowsDialog(false);
        setSelectedRows([]);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Rows Deleted', life: 3000 });
    };

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


    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedRows || !selectedRows.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
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
    const renderDeleteRowsDialog = () => {
        return (
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
    };
    const renderDeleteRowDialog = () => {
        return (
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
        );
    };
    const handleSelectionChange = (e: DataTableSelectionMultipleChangeEvent<Model[]>) => {
        if (Array.isArray(e.value)) {
            setSelectedRows(e.value);
        }
    };
    const renderRowRadioButtons = () => {
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

    const renderRowDialog = () => {
        return (
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
    };



    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Rows</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" placeholder="Search..." onInput={(e) => { const target = e.target as HTMLInputElement; setGlobalFilter(target.value); }} />
            </IconField>
        </div>
    );
    const dialog = [
        renderRowDialog(),
        renderDeleteRowDialog(),
        renderDeleteRowsDialog()
    ]
    return {
        rows,
        selectedRows,
        leftToolbarTemplate,
        rightToolbarTemplate,
        toast,
        dt,
        header,
        globalFilter,
        dialog,
        handleSelectionChange,
        actionBodyTemplate
    }


}
