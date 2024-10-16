
import React, { memo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { TestRow } from '../utils/types/type';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { SimpleDialog } from '../components/Common/Dialog/SimpleDialog';
import { GenericTable } from '../components/Common/Index';
import { SimpleToolBar } from '../components/Common/ToolBar/ToolBar';
import { useDataTable } from '../hooks/useDataTable';
import { timeStampBodyTemplate, statusBodyTemplate } from '../components/Common/Table/CommonColumn';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';

export function AdminManageTestPage() {
    // const categoryID: string = new URLSearchParams(useLocation().search).get('category_id') ?? '';
    const { category_id } = useParams<{ category_id: string }>();
    const emptyTest: TestRow = {
        id: '',
        name: '',
        isActive: true,
        totalTestAttempt: 0,
        totalQuestion: 0,
        totalScore: 0,
        limitTime: 0,
        questions: [],
        totalUserAttempt: 0,
        createdAt: new Date(),
        updatedAt: new Date()
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
    } = useDataTable<TestRow>("https://dummyjson.com/c/00ac-df9c-4a5b-8e4a", emptyTest
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
                    state.setRow(emptyTest);
                }
            },
        })
    );

    const renderColumns = [
        <Column key="col-selection" selectionMode="multiple" exportable={false} />,
        <Column key="col-id" field="id" header="ID" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-name" field="name" header="Name" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-totalTestAttempt" field="totalTestAttempt" header="total Attempt" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-totalQuestion" field="totalQuestion" header="total Question" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-totalScore" field="totalScore" header="total Score" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-limitTime" field="limitTime" header="limit Time" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-questions" header="questions" body={questionsBodyTemplate} />,
        <Column key="col-timestamp" header="Time stamp" body={timeStampBodyTemplate} sortable style={{ minWidth: '10rem' }} />,
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
                            {GenericTable<TestRow>(renderColumns, dt, rows, true, selectedRows, globalFilter, setGlobalFilter, setSelectedRows, totalRecords, page, handleOnPage, editRow, confirmDeleteRow)}
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


function questionsBodyTemplate(rowData: TestRow) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/dashboard/test/question?test_id=' + rowData.id)
    };

    return (
        <Button severity="info" label='Chi Tiết' className="w-full text-center" onClick={handleClick}></Button>
    )
}

//------------------------for dialog-------------------------------------

function dialogBody(row: TestRow, setRow: (value: React.SetStateAction<TestRow>) => void, submitted: boolean) {
    const onInputChange = (e: any, field: keyof TestRow) => {
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
                value={row.name}
                onChange={(e) => onInputChange(e, 'name')}
                required
                autoFocus
                className={classNames({ 'p-invalid': submitted && !row.name })}
            />
            {submitted && !row.email && <small className="p-error">format is required.</small>}
        </div>

    )
}