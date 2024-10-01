import { useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';

export const useTable = <T extends { id: string }(emptyItem: T) => {
    const [items, setItems] = useState<T[]>([]);
    const [itemDialog, setItemDialog] = useState<boolean>(false);
    const [deleteItemDialog, setDeleteItemDialog] = useState<boolean>(false);
    const [item, setItem] = useState<T>(emptyItem);
    const [selectedItems, setSelectedItems] = useState<T[]>([]);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const data = useRef<DataTable<T[]>>(null);

    const openNew = () => {
        setItem(emptyItem);
        setSubmitted(false);
        setItemDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setItemDialog(false);
    };

    const hideDeleteItemDialog = () => {
        setDeleteItemDialog(false);
    };

    // const saveItem = () => {
    //     setSubmitted(true);

    //     if (item.name?.trim()) { // Adjust condition based on item structure
    //         let _items = [...items];
    //         let _item = { ...item };

    //         if (item.id) {
    //             const index = findIndexById(item.id);
    //             _items[index] = _item;
    //             toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Item Updated', life: 3000 });
    //         } else {
    //             _item.id = createId(); // Ensure createId is defined
    //             _items.push(_item);
    //             toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Item Created', life: 3000 });
    //         }

    //         setItems(_items);
    //         setItemDialog(false);
    //         setItem(emptyItem);
    //     }
    // };

    const editItem = (item: T) => {
        setItem({ ...item });
        setItemDialog(true);
    };

    const confirmDeleteItem = (item: T) => {
        setItem(item);
        setDeleteItemDialog(true);
    };

    const deleteItem = () => {
        let _items = items.filter((val) => val.id !== item.id);
        setItems(_items);
        setDeleteItemDialog(false);
        setItem(emptyItem);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Item Deleted', life: 3000 });
    };

    const findIndexById = (id: string) => {
        return items.findIndex(item => item.id === id);
    };

    const exportCSV = () => {
        data.current?.exportCSV();
    };

    return {
        items,
        itemDialog,
        deleteItemDialog,
        item,
        selectedItems,
        submitted,
        globalFilter,
        toast,
        data,
        openNew,
        hideDialog,
        hideDeleteItemDialog,
        // saveItem,
        editItem,
        confirmDeleteItem,
        deleteItem,
        exportCSV
    }
}