import { DataTable, DataTablePageEvent, DataTableValue } from "primereact/datatable";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { useState, useEffect, useRef } from "react";

export function useDataTable<Model extends DataTableValue>(
    urlApi: string,
    defaultValues: Model,
    overrides: (state: any) => Partial<any> = () => ({}),
    searchValue: string = ''
) {
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Model[]>>(null);
    const [rows, setRows] = useState<Model[]>([]);
    const [rowDialog, setRowDialog] = useState<boolean>(false);
    const [deleteRowDialog, setDeleteRowDialog] = useState<boolean>(false);
    const [deleteRowsDialog, setDeleteRowsDialog] = useState<boolean>(false);
    const [row, setRow] = useState<Model>(defaultValues);
    const [selectedRows, setSelectedRows] = useState<Model[]>([]);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>(searchValue);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState({ first: 0, rows: 20 });

    useEffect(() => {
        fetchData(0, page.rows);

    }, []);

    const openNew = (() => {
        setRow(defaultValues);
        setSubmitted(false);
        setRowDialog(true);
    });

    const hideDialog = (() => {
        setSubmitted(false);
        setRowDialog(false);
    });

    const hideDeleteRowDialog = (() => {
        setDeleteRowDialog(false);
    });

    const hideDeleteRowsDialog = (() => {
        setDeleteRowsDialog(false);
    });

    const saveRow = (() => {
        setSubmitted(true);
        toast.current?.show({ severity: 'success', summary: 'Cần quá tải hàm saveRow', detail: 'Row Updated', life: 3000 });
        // if (row.name.trim()) {
        //     let _rows = [...rows];
        //     let _row = { ...row };

        //     if (row.id) {
        //         const index = findIndexById(row.id);

        //         _rows[index] = _row;
        //         toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Row Updated', life: 3000 });
        //     } else {
        //         (_row as any).id = createId();

        //         _rows.push(_row);
        //         toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Row Created', life: 3000 });
        //     }

        //     setRows(_rows);
        //     console.log(_rows);
        //     setRowDialog(false);
        //     setRow(defaultValues);
        // }
    });

    // Fetch data from server
    const fetchData = async (pageNumber: number, _pageSize: number) => {
        try {
            const response = await fetch(urlApi);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data: { data: Model[], totalRecords: number } = await response.json();  // Parse the JSON response
            setRows(data.data); // Update with server data
            setTotalRecords(data.totalRecords);
            return data;  // Return the data
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            return null;  // Handle the error, returning null or an appropriate value
        }
    };

    const editRow = ((row: Model) => {
        setRow({ ...row });
        setRowDialog(true);
    });

    const confirmDeleteRow = ((row: Model) => {
        setRow(row);
        setDeleteRowDialog(true);
    });

    const deleteRow = (() => {
        let _rows = rows.filter((val) => val.id !== row.id);

        setRows(_rows);
        setDeleteRowDialog(false);
        setRow(defaultValues);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Row Deleted', life: 3000 });
    });

    const exportCSV = (() => {
        dt.current?.exportCSV();
    });

    const confirmDeleteSelected = (() => {
        setDeleteRowsDialog(true);
    });

    const deleteSelectedRows = (() => {
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
    const handleOnPage = (event: DataTablePageEvent) => {
        setPage({ first: event.first, rows: event.rows });

        // Calculate the page number based on event.first and event.rows
        const pageNumber = event.first / event.rows;
        fetchData(pageNumber, event.rows);
    }
    // The state object to pass to the override functions
    const state = {
        rows, setRows,
        rowDialog, setRowDialog,
        deleteRowDialog, setDeleteRowDialog,
        deleteRowsDialog, setDeleteRowsDialog,
        row, setRow,
        selectedRows, setSelectedRows,
        submitted, setSubmitted,
        globalFilter, setGlobalFilter,
        toast, dt, page, totalRecords
    };
    const actions = {
        openNew: overrides(state).openNew || openNew,
        hideDialog: overrides(state).hideDialog || hideDialog,
        hideDeleteRowDialog: overrides(state).hideDeleteRowDialog || hideDeleteRowDialog,
        hideDeleteRowsDialog: overrides(state).hideDeleteRowsDialog || hideDeleteRowsDialog,
        saveRow: overrides(state).saveRow || saveRow,
        editRow: overrides(state).editRow || editRow,
        confirmDeleteRow: overrides(state).confirmDeleteRow || confirmDeleteRow,
        deleteRow: overrides(state).deleteRow || deleteRow,
        exportCSV: overrides(state).exportCSV || exportCSV,
        confirmDeleteSelected: overrides(state).confirmDeleteSelected || confirmDeleteSelected,
        deleteSelectedRows: overrides(state).deleteSelectedRows || deleteSelectedRows,
        onRowCreatedByChange: overrides(state).onRowCreatedByChange || onRowCreatedByChange,
        handleOnPage: overrides(state).handleOnPage || handleOnPage,
    }
    return {
        ...state,
        ...actions
    };
}
