
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SimpleDialog } from '../components/Common/Dialog/SimpleDialog';
import { CustomBreadCrumb, GenericTable } from '../components/Common/Index';
import { statusBodyTemplate, timeStampBodyTemplate } from '../components/Common/Table/CommonColumn';
import { SimpleToolBar } from '../components/Common/ToolBar/ToolBar';
import { useDataTable } from '../hooks/GenericDataTableHook';
import { CategoryID, Name_ID, TestRow } from '../utils/types/type';
import SplitNameIDFromURL from '../utils/splitNameIDFromURL';
import { emptyTestRow } from '../utils/types/emptyValue';
import { callPostTest } from '../api/api';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';

export function AdminManageTestPage() {
    const { category_name_id = "no idCategory found" } = useParams<{ category_name_id: Name_ID<CategoryID> }>();
    const [, category_id] = SplitNameIDFromURL(category_name_id);

    const emptyTest = emptyTestRow(category_id);

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
    } = useDataTable<TestRow>(`categories/${category_id}/tests`, emptyTest
        , (state) => ({
            saveRow: async () => {
                state.setSubmitted(true);
                if (state.row.name.trim()) {
                    const _rows = [...state.rows];
                    const _row = { ...state.row };

                    if (state.row.id) {
                        const index = _rows.findIndex(item => item.id === state.row.id)

                        _rows[index] = _row;

                        state.toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Row Updated', life: 3000 });
                        state.setTotalRecords((pre: number) => pre + 1)
                    } else {
                        (_row as any).id = crypto.randomUUID();
                        const error = await callPostTest(_row);
                        if (error) {
                            state.toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Tạo thất bại', life: 3000 });

                        } else {
                            _rows.push(_row);
                            state.toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Row Created', life: 3000 });
                        }
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
        <Column key="col-totalTestAttempt" field="totalUserAttempt" header="Total Attempt" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-totalQuestion" field="totalQuestion" header="Total Question" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-totalScore" field="totalScore" header="Total Score" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-limitTime" field="limitTime" header="Limit Time" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-questions" header="questions" body={questionsBodyTemplate} />,
        <Column key="col-timestamp" header="Time stamp" body={timeStampBodyTemplate} sortable style={{ minWidth: '10rem' }} />,
        <Column key="col-isActive" field="isActive" header="Active" sortable body={statusBodyTemplate} />,
    ];

    return (
        <React.Fragment>
            <div key={'b'}>
                <CustomBreadCrumb />
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
        navigate(`${rowData.name}___${rowData.id}/questions`)
    };

    return (
        <Button severity="info" label='Chi Tiết' className="w-full text-center" onClick={handleClick}></Button>
    )
}

//------------------------for dialog-------------------------------------

function dialogBody(row: TestRow, setRow: (value: React.SetStateAction<TestRow>) => void, submitted: boolean) {
    const onInputTextChange = (e: any, field: keyof TestRow) => {
        const value = e.target.value === null ? '' : e.target.value; // Handle text input
        setRow((prevRow) => ({
            ...prevRow,
            [field]: value
        }));
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, field: keyof TestRow) => {
        const value = e.value === null ? 0 : e.value; // Handle number input, default to 0 if null
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
                onChange={(e) => onInputTextChange(e, 'name')}
                required
                autoFocus
                className={classNames({ 'p-invalid': submitted && !row.name })}
            />

            <label htmlFor="totalQuestion" className="font-bold block mb-2">Số câu hỏi</label>
            <InputNumber
                inputId="totalQuestion"
                value={row.totalQuestion}
                onValueChange={(e) => onInputNumberChange(e, 'totalQuestion')}
            />

            <label htmlFor="limitTime" className="font-bold block mb-2">Thời gian làm bài</label>
            <InputNumber
                inputId="limitTime"
                value={row.limitTime}
                onValueChange={(e) => onInputNumberChange(e, 'limitTime')}
            />

            <label htmlFor="totalScore" className="font-bold block mb-2">Điểm tối đa</label>
            <InputNumber
                inputId="totalScore"
                value={row.totalScore}
                onValueChange={(e) => onInputNumberChange(e, 'totalScore')}
            />

            {submitted && !row.name && <small className="p-error">name is required.</small>}
        </div>

    )
}