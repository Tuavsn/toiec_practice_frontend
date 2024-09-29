import AdminLayout from "../components/Layout/AdminLayout";
import { CustomBreadCrumb, ToolBar } from "../components/Common/Index";
import { Card } from "primereact/card";
import { ChangeEvent, memo, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableSelectionMultipleChangeEvent } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { RadioButtonChangeEvent, RadioButton } from "primereact/radiobutton";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React from "react";
import { Calendar } from "primereact/calendar";

interface Category {
    id: string;
    name: string;
    year: number;
    created_at: Date;
    created_by: string;
    updated_at: Date;
    updated_by: string;
    is_active: boolean
}

export function AdminManageCategoryPage() {
    let emptyCategory: Category = {
        id: "",
        name: "vô danh",
        year: -9999,
        created_at: new Date(),
        created_by: "vô danh",
        updated_at: new Date,
        updated_by: "vô chủ",
        is_active: true
    };

    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryDialog, setCategoryDialog] = useState<boolean>(false);
    const [deleteCategoryDialog, setDeleteCategoryDialog] = useState<boolean>(false);
    const [deleteCategoriesDialog, setDeleteCategoriesDialog] = useState<boolean>(false);
    const [category, setCategory] = useState<Category>(emptyCategory);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Category[]>>(null);

    useEffect(() => {
        setCategories(GetFakeData() as any);
    }, []);

    const openNew = () => {
        setCategory(emptyCategory);
        setSubmitted(false);
        setCategoryDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCategoryDialog(false);
    };

    const hideDeleteCategoryDialog = () => {
        setDeleteCategoryDialog(false);
    };

    const hideDeleteCategoriesDialog = () => {
        setDeleteCategoriesDialog(false);
    };

    const saveCategory = () => {
        setSubmitted(true);

        if (category.name.trim()) {
            let _categories = [...categories];
            let _category = { ...category };

            if (category.id) {
                const index = findIndexById(category.id);

                _categories[index] = _category;
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Category Updated', life: 3000 });
            } else {
                _category.id = createId();
                _categories.push(_category);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Category Created', life: 3000 });
            }

            setCategories(_categories);
            console.log(_categories);
            setCategoryDialog(false);
            setCategory(emptyCategory);
        }
    };

    const editCategory = (category: Category) => {
        setCategory({ ...category });
        setCategoryDialog(true);
    };

    const confirmDeleteCategory = (category: Category) => {
        setCategory(category);
        setDeleteCategoryDialog(true);
    };

    const deleteCategory = () => {
        let _categories = categories.filter((val) => val.id !== category.id);

        setCategories(_categories);
        setDeleteCategoryDialog(false);
        setCategory(emptyCategory);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Category Deleted', life: 3000 });
    };

    const findIndexById = (id: string) => {
        let index = -1;

        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id === id) {
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
        setDeleteCategoriesDialog(true);
    };

    const deleteSelectedCategories = () => {
        let _categories = categories.filter((val) => !selectedCategories.includes(val));

        setCategories(_categories);
        setDeleteCategoriesDialog(false);
        setSelectedCategories([]);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Categories Deleted', life: 3000 });
    };

    const onCategoryCreatedByChange = (e: RadioButtonChangeEvent) => {
        setCategory((prevCategory) => ({
            ...prevCategory,
            created_by: e.value
        }));
    };


    const onInputChange = (e: any, field: keyof Category) => {
        const value = e.target.value ?? ''; // Ensuring fallback to an empty string if value is undefined
        setCategory((prevCategory) => ({
            ...prevCategory,
            [field]: value
        }));
    };


    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedCategories || !selectedCategories.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const createdAtBodyTemplate = (rowData: Category) => {
        return (
            <Calendar
                value={new Date(rowData.created_at)}
                dateFormat="dd/mm/yy"
                showIcon
                disabled
            />
        );
    };

    const updatedAtBodyTemplate = (rowData: Category) => {
        return (
            <Calendar
                value={new Date(rowData.updated_at)}
                dateFormat="dd/mm/yy"
                showIcon
                disabled
            />
        );
    };


    const statusBodyTemplate = (rowData: Category) => {
        return <Tag value={(rowData.is_active) + ""} severity={getSeverity(rowData)}></Tag>;
    };

    const actionBodyTemplate = (rowData: Category) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editCategory(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteCategory(rowData)} />
            </React.Fragment>
        );
    };

    const getSeverity = (category: Category) => {
        switch (category.is_active) {
            case true:
                return 'success';

            case false:
                return 'warning';
            default:
                return null;
        }
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Categories</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" placeholder="Search..." onInput={(e) => { const target = e.target as HTMLInputElement; setGlobalFilter(target.value); }} />
            </IconField>
        </div>
    );
    const categoryDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveCategory} />
        </React.Fragment>
    );
    const deleteCategoryDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteCategoryDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteCategory} />
        </React.Fragment>
    );
    const deleteCategoriesDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteCategoriesDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedCategories} />
        </React.Fragment>
    );
    const renderColumns = () => {
        return [
            <Column key="selection" selectionMode="multiple" exportable={false} />,
            <Column key="id" field="id" header="ID" sortable style={{ minWidth: '12rem' }} />,
            <Column key="name" field="name" header="Name" sortable style={{ minWidth: '16rem' }} />,
            <Column key="created_at" field="created_at" header="Created At" body={createdAtBodyTemplate} sortable style={{ minWidth: '14rem' }} />,
            <Column key="updated_at" field="updated_at" header="Updated At" body={updatedAtBodyTemplate} sortable style={{ minWidth: '14rem' }} />,
            <Column key="created_by" field="created_by" header="Create by" sortable style={{ minWidth: '16rem' }} />,
            <Column key="updated_by" field="updated_by" header="Update by" sortable style={{ minWidth: '16rem' }} />,
            <Column key="is_active" field="is_active" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }} />,
            <Column key="action" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
        ];
    };
    const renderDeleteCategoriesDialog = () => {
        return (
            <Dialog
                visible={deleteCategoriesDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Confirm"
                modal
                footer={deleteCategoriesDialogFooter}
                onHide={hideDeleteCategoriesDialog}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {category && <span>Are you sure you want to delete the selected categories?</span>}
                </div>
            </Dialog>
        );
    };
    const renderDeleteCategoryDialog = () => {
        return (
            <Dialog
                visible={deleteCategoryDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Confirm"
                modal
                footer={deleteCategoryDialogFooter}
                onHide={hideDeleteCategoryDialog}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {category && <span>Are you sure you want to delete <b>{category.name}</b>?</span>}
                </div>
            </Dialog>
        );
    };
    const handleSelectionChange = (e: DataTableSelectionMultipleChangeEvent<Category[]>) => {
        if (Array.isArray(e.value)) {
            setSelectedCategories(e.value);
        }
    };
    const renderCategoryRadioButtons = () => {
        const categoriesOptions = [
            { label: 'Accessories', value: 'Accessories' },
            { label: 'Clothing', value: 'Clothing' },
            { label: 'Electronics', value: 'Electronics' },
            { label: 'Fitness', value: 'Fitness' }
        ];

        return (
            <div className="field">
                <label className="mb-3 font-bold">Category Type</label>
                <div className="formgrid grid">
                    {categoriesOptions.map((option, index) => (
                        <div key={option.value} className="field-radiobutton col-6">
                            <RadioButton
                                inputId={`category${index}`}
                                name="category"
                                value={option.value}
                                onChange={onCategoryCreatedByChange}
                                checked={category.created_by === option.value}
                            />
                            <label htmlFor={`category${index}`}>{option.label}</label>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderCategoryDialog = () => {
        return (
            <Dialog
                visible={categoryDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Category Details"
                modal
                className="p-fluid"
                footer={categoryDialogFooter}
                onHide={hideDialog}
            >
                <div className="field">
                    <label htmlFor="name" className="font-bold">Name</label>
                    <InputText
                        id="name"
                        value={category.name}
                        onChange={(e) => onInputChange(e, 'name')}
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !category.name })}
                    />
                    {submitted && !category.name && <small className="p-error">Name is required.</small>}
                </div>

                {/* Radio buttons for category selection */}
                {renderCategoryRadioButtons()}

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="createdAt" className="font-bold">Created At</label>
                        <Calendar
                            id="createdAt"
                            value={category.created_at ? new Date(category.created_at) : new Date()}
                            onChange={(e) => onInputChange(e, 'created_at')} // Adjusted to match the Calendar's output
                            dateFormat="dd/mm//yy" // Format as needed
                            showIcon
                        />
                    </div>

                </div>
            </Dialog>
        );
    };
    return (
        <AdminLayout>
            <div>
                <CustomBreadCrumb />
                <Card className="my-2">
                    <div>
                        <Toast ref={toast} />
                        <div className="card">
                            <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate} />

                            <DataTable
                                ref={dt}
                                value={categories}
                                selection={selectedCategories}
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

                                {renderColumns()}
                            </DataTable>
                        </div>

                        {renderCategoryDialog()}
                        {renderDeleteCategoryDialog()}
                        {renderDeleteCategoriesDialog()}
                    </div>
                </Card>
            </div>
        </AdminLayout>
    )
}

export default memo(AdminManageCategoryPage);


function GetFakeData(): Category[] {
    return [
        {
            id: "1",
            name: "Electronics",
            year: 2024,
            created_at: new Date("2024-01-15T10:00:00Z"),
            created_by: "admin",
            updated_at: new Date("2024-03-10T12:30:00Z"),
            updated_by: "admin",
            is_active: true
        },
        {
            id: "2",
            name: "Books",
            year: 2023,
            created_at: new Date("2023-06-22T09:15:00Z"),
            created_by: "user1",
            updated_at: new Date("2024-01-05T11:00:00Z"),
            updated_by: "user2",
            is_active: true
        },
        {
            id: "3",
            name: "Fashion",
            year: 2022,
            created_at: new Date("2022-05-10T14:45:00Z"),
            created_by: "user3",
            updated_at: new Date("2023-12-30T08:30:00Z"),
            updated_by: "admin",
            is_active: false
        },
        {
            id: "4",
            name: "Home & Kitchen",
            year: 2024,
            created_at: new Date("2024-02-01T07:20:00Z"),
            created_by: "admin",
            updated_at: new Date("2024-04-15T13:15:00Z"),
            updated_by: "user4",
            is_active: true
        },
        {
            id: "5",
            name: "Sports",
            year: 2023,
            created_at: new Date("2023-09-10T16:00:00Z"),
            created_by: "user5",
            updated_at: new Date("2023-11-25T10:00:00Z"),
            updated_by: "user1",
            is_active: true
        }
    ]
}


