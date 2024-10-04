import { Button } from "primereact/button";
import { DataTableValue } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React from "react";

export function SimpleDialog(dialogBody: JSX.Element, rowDialog: boolean, hideDialog: () => void, saveRow: () => void,
    row: DataTableValue, deleteRowsDialog: boolean, hideDeleteRowsDialog: { (): void; (): void; }, deleteSelectedRows: () => void,
    hideDeleteRowDialog: () => void, deleteRow: () => void, deleteRowDialog: boolean) {


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
                footer={renderRowDialogFooter(hideDialog, saveRow)}
                onHide={hideDialog}
            >
                {dialogBody}
            </Dialog>
        )
    }

    const renderDeleteRowsDialog = () => {
        return (
            <Dialog
                key={'DeleteRowsDialog'}
                visible={deleteRowsDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Confirm"
                modal
                footer={deleteRowsDialogFooter(hideDeleteRowsDialog, deleteSelectedRows)}
                onHide={hideDeleteRowsDialog}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {row && <span>Are you sure you want to delete the selected rows?</span>}
                </div>
            </Dialog>
        )
    }

    const renderDeleteRowDialog = () => {
        return (
            <Dialog
                key={'DeleteRowDialog'}
                visible={deleteRowDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Confirm"
                modal
                footer={deleteRowDialogFooter(hideDeleteRowDialog, deleteRow)}
                onHide={hideDeleteRowDialog}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamaion-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {row && <span>Are you sure you want to delete <b>this row</b>?</span>}
                </div>
            </Dialog>
        )
    }
    const dialog = [
        renderRowDialog(),
        renderDeleteRowsDialog(),
        renderDeleteRowDialog()
    ]
    return (
        <React.Fragment>
            {dialog}
        </React.Fragment>

    )


}

function renderRowDialogFooter(hideDialog: () => void, saveRow: () => void) {
    return (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveRow} />
        </React.Fragment>
    );
}
function deleteRowDialogFooter(hideDeleteRowDialog: () => void, deleteRow: () => void) {
    return (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteRowDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteRow} />
        </React.Fragment>
    )
}
function deleteRowsDialogFooter(hideDeleteRowsDialog: () => void, deleteSelectedRows: () => void) {
    return (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteRowsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedRows} />
        </React.Fragment>

    )
}







//    <div className="field">
//         <label htmlFor="name" className="font-bold">Name</label>
//         <InputText
//             id="name"
//             value={row.name}
//             onChange={(e) => onInputChange(e, 'name')}
//             required
//             autoFocus
//             className={classNames({ 'p-invalid': submitted && !row.name })}
//         />
//         {submitted && !row.name && <small className="p-error">Name is required.</small>}
//     </div>

//     {/* Radio buttons for row selection */}
//     {renderRowRadioButtons()}

//     <div className="formgrid grid">
//         <div className="field col">
//             <label htmlFor="createdAt" className="font-bold">Created At</label>
//             <Calendar
//                 id="createdAt"
//                 value={row.created_at ? new Date(row.created_at) : new Date()}
//                 onChange={(e) => onInputChange(e, 'created_at')} // Adjusted to match the Calendar's output
//                 dateFormat="dd/mm//yy" // Format as needed
//                 showIcon
//             />
//         </div>

//     </div>