import { useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { DataTable, DataTableValue } from 'primereact/datatable';

export const useTable = () => {
    const [selectedItems, setSelectedItems] = useState<DataTableValue[]>([]);
    const [itemCreateDialog, setItemCreateDialog] = useState(false)
    const [itemEditDialog, setItemEditDialog] = useState(false)
    const [itemDeleteDialog,setItemDeleteDialog] = useState(false)
    const [search, setSearch] = useState('')
    const toast = useRef<Toast>(null);
    const dataRef = useRef<DataTable<DataTableValue[]>>(null);

    const createItem = () => {
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Item Created', life: 3000 });
    }

    const editItem = () => {
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Item Edited', life: 3000 });
    }

    const deleteItem = () => {
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Item Deleted', life: 3000 });
    }

    const importCSV = () => {
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Item Imported', life: 3000 });
    }

    const exportCSV = () => {
        dataRef.current?.exportCSV();
    };

    return {
        // Selected
        selectedItems,
        setSelectedItems,
        // Create
        itemCreateDialog,
        setItemCreateDialog,
        createItem,
        // Edit
        itemEditDialog,
        setItemEditDialog,
        editItem,
        // Delete
        itemDeleteDialog,
        setItemDeleteDialog,
        deleteItem,
        // Search
        search,
        setSearch,
        // Table Ref
        dataRef,
        // Import & Export
        importCSV,
        exportCSV,
        // Alert
        toast
    }
}