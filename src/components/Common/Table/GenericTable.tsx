import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableSelectionMultipleChangeEvent, DataTableValue } from "primereact/datatable";
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
            rows={10}
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

// const onInputChange = (e: any, field: keyof Model) => {
//     const value = e.target.value ?? ''; // Ensuring fallback to an empty string if value is undefined
//     setRow((prevRow) => ({
//         ...prevRow,
//         [field]: value
//     }));
// };

// const renderRowRadioButtons = () => {
//     const rowsOptions = [
//         { label: 'Accessories', value: 'Accessories' },
//         { label: 'Clothing', value: 'Clothing' },
//         { label: 'Electronics', value: 'Electronics' },
//         { label: 'Fitness', value: 'Fitness' }
//     ];

//     return (
//         <div className="field">
//             <label className="mb-3 font-bold">Row Type</label>
//             <div className="formgrid grid">
//                 {rowsOptions.map((option, index) => (
//                     <div key={option.value} className="field-radiobutton col-6">
//                         <RadioButton
//                             inputId={`row${index}`}
//                             name="row"
//                             value={option.value}
//                             onChange={onRowCreatedByChange}
//                             checked={row.created_by === option.value}
//                         />
//                         <label htmlFor={`row${index}`}>{option.label}</label>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// const rowDialogFooter = (
//     <React.Fragment>
//         <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
//         <Button label="Save" icon="pi pi-check" onClick={saveRow} />
//     </React.Fragment>
// );
// const deleteRowDialogFooter = (
//     <React.Fragment>
//         <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteRowDialog} />
//         <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteRow} />
//     </React.Fragment>
// );
// const deleteRowsDialogFooter = (
//     <React.Fragment>
//         <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteRowsDialog} />
//         <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedRows} />
//     </React.Fragment>
// );

// const renderDeleteRowDialog =
//     <Dialog
//         key={'DeleteRowDialog'}
//         visible={deleteRowDialog}
//         style={{ width: '32rem' }}
//         breakpoints={{ '960px': '75vw', '641px': '90vw' }}
//         header="Confirm"
//         modal
//         footer={deleteRowDialogFooter}
//         onHide={hideDeleteRowDialog}
//     >
//         <div className="confirmation-content">
//             <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
//             {row && <span>Are you sure you want to delete <b>{row.name}</b>?</span>}
//         </div>
//     </Dialog>

    
// const renderDeleteRowsDialog = (
//     <Dialog
//         key={'DeleteRowsDialog'}
//         visible={deleteRowsDialog}
//         style={{ width: '32rem' }}
//         breakpoints={{ '960px': '75vw', '641px': '90vw' }}
//         header="Confirm"
//         modal
//         footer={deleteRowsDialogFooter}
//         onHide={hideDeleteRowsDialog}
//     >
//         <div className="confirmation-content">
//             <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
//             {row && <span>Are you sure you want to delete the selected rows?</span>}
//         </div>
//     </Dialog>
// );

// function renderRowDialog(rowDialog ,rowDialogFooter,hideDialog,row,submitted){
//     return (
//         <Dialog
//             key={'RowDialog'}
//             visible={rowDialog}
//             style={{ width: '32rem' }}
//             breakpoints={{ '960px': '75vw', '641px': '90vw' }}
//             header="Row Details"
//             modal
//             className="p-fluid"
//             footer={rowDialogFooter}
//             onHide={hideDialog}
//         >
//             <div className="field">
//                 <label htmlFor="name" className="font-bold">Name</label>
//                 <InputText
//                     id="name"
//                     value={row.name}
//                     onChange={(e) => onInputChange(e, 'name')}
//                     required
//                     autoFocus
//                     className={classNames({ 'p-invalid': submitted && !row.name })}
//                 />
//                 {submitted && !row.name && <small className="p-error">Name is required.</small>}
//             </div>

//             {/* Radio buttons for row selection */}
//             {renderRowRadioButtons()}

//             <div className="formgrid grid">
//                 <div className="field col">
//                     <label htmlFor="createdAt" className="font-bold">Created At</label>
//                     <Calendar
//                         id="createdAt"
//                         value={row.created_at ? new Date(row.created_at) : new Date()}
//                         onChange={(e) => onInputChange(e, 'created_at')} // Adjusted to match the Calendar's output
//                         dateFormat="dd/mm//yy" // Format as needed
//                         showIcon
//                     />
//                 </div>

//             </div>
//         </Dialog>
//     )
// }