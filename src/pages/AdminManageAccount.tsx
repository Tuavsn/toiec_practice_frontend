import { Card } from "primereact/card";
import React, { memo } from "react";
import AdminManageTestPage from "./AdminManageTestPage";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { SimpleDialog } from "../components/Common/Dialog/SimpleDialog";
import { CustomBreadCrumb, GenericTable } from "../components/Common/Index";
import { TestCategory, User } from "../utils/types/type";
import { SimpleToolBar } from "../components/Common/ToolBar/ToolBar";

export function AdminManageAccountPage() {
    
    const emptyAccount : User = {
        id: "",
        email: "",
        avatar: "",
        refreshToken: "",
        testAttemptHistory: [],
        learningProgress: [],
        role_id: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
    }

    // const {
    //     row, setRow, rows,
    //     selectedRows,
    //     globalFilter,
    //     dt, toast,
    //     hideDeleteRowsDialog,
    //     deleteRowsDialog,
    //     rowDialog,
    //     deleteSelectedRows,
    //     saveRow,
    //     hideDialog,
    //     hideDeleteRowDialog,
    //     deleteRow,
    //     submitted,
    //     deleteRowDialog,
    //     openNew,
    //     confirmDeleteSelected,
    //     exportCSV,
    //     editRow,
    //     confirmDeleteRow,
    //     setSelectedRows,
    //     setGlobalFilter
    // } = useDataTable<TestCategory>(GetFakeData(), emptyAccount
    //     , (state) => ({
    //         saveRow: () => {
    //             state.setSubmitted(true);
    //             if (state.row.format.trim()) {
    //                 let _rows = [...state.rows];
    //                 let _row = { ...state.row };

    //                 if (state.row.id) {
    //                     const index = _rows.findIndex(item => item.id === state.row.id)

    //                     _rows[index] = _row;
    //                     state.toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Row Updated', life: 3000 });
    //                 } else {
    //                     (_row as any).id = createId();

    //                     _rows.push(_row);
    //                     state.toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Row Created', life: 3000 });
    //                 }

    //                 state.setRows(_rows);
    //                 console.log(_rows);
    //                 state.setRowDialog(false);
    //                 state.setRow(emptyAccount);
    //             }
    //         },
    //     })
    // );

    // return (
    //     <React.Fragment>
    //         <div key={'b'}>
    //             <CustomBreadCrumb items={breadCrumbItems} />
    //             <Card className="my-2">
    //                 <div key={'a'}>
    //                     <Toast ref={toast} />
    //                     <div className="card">
    //                         <SimpleToolBar
    //                             openNew={openNew}
    //                             confirmDeleteSelected={confirmDeleteSelected}
    //                             selectedRows={selectedRows}
    //                             exportCSV={exportCSV}
    //                         />
    //                         {GenericTable<TestCategory>(renderColumns, dt, rows, true, selectedRows, globalFilter, setGlobalFilter, setSelectedRows, editRow, confirmDeleteRow)}
    //                     </div>
    //                     {SimpleDialog(
    //                         dialogBody(row, setRow, submitted),
    //                         rowDialog,
    //                         hideDialog,
    //                         saveRow,
    //                         row,
    //                         deleteRowsDialog,
    //                         hideDeleteRowsDialog,
    //                         deleteSelectedRows,
    //                         hideDeleteRowDialog,
    //                         deleteRow,
    //                         deleteRowDialog
    //                     )}
    //                 </div>
    //             </Card>
    //         </div>
    //     </React.Fragment>
    // )
}


export default memo(AdminManageTestPage);