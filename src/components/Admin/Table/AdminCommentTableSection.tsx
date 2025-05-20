// Filename: src/features/admin/components/comments/AdminCommentTableSection.tsx
"use client"; // If using Next.js App Router

import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'; // Import confirmDialog directly
import { DataTable, DataTableSortEvent } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Tag } from 'primereact/tag';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { deleteOneComment, fetchTableOfComments, toggleActive } from '../../../api/api';
import { useToast } from '../../../context/ToastProvider';
import formatDateToString from '../../../utils/helperFunction/formatDateToString';
import { Comment_t, DeleteCommentRequest, DeleteReason, TargetType } from '../../../utils/types/type';
import IDGroupCell, { IDGroup } from '../../Common/IDGroup/IDGroupCell';
import ColumnManageCommentTable from '../AdminColumn/ColumnManageCommentTable';
import CommentDataTableHeader from '../AdminToolbar/CommentDataTableHeader';

//------------------------------------------------------
// Props for AdminCommentTableSection
//------------------------------------------------------
interface AdminCommentTableSectionProps {
    // This prop will be updated by AdminCommentReportsTable when "View Comment" is clicked
    // This component should listen to changes in this prop to update its own globalFilter
    // and potentially trigger a load.
    externalSearchTerm?: string;
}


//------------------------------------------------------
// Admin Comment Table Section Component
//------------------------------------------------------
const AdminCommentTableSection: React.FC<AdminCommentTableSectionProps> = ({
    externalSearchTerm
}) => {
    const [comments, setComments] = useState<Comment_t[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: "createdAt",
        sortOrder: -1 as -1 | 1 | null | undefined, // Match PrimeReact SortOrder
        active: "all" as "all" | "true" | "false",
        // filters: {}, // If using DataTable's own filter display
    });
    const [globalFilter, setGlobalFilter] = useState<string>("");
    // Delete confirmation state
    // const [deleteConfirmVisible, setDeleteConfirmVisible] = useState<boolean>(false); // Replaced by global confirmDialog
    // const [commentToDelete, setCommentToDelete] = useState<Comment_t | null>(null);
    // const [deleteReason, setDeleteReason] = useState<string>(""); // Now a local var in confirmDelete

    const { toast } = useToast();
    const abortControllerRef = useRef<AbortController | null>(null);

    const deleteReasonOptions = Object.values(DeleteReason).map(value => ({
        label: value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Basic formatting
        value: value
    }));


    const loadComments = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        setLoading(true);

        const result = await fetchTableOfComments(

            toast, // Toast is handled by individual actions now
            lazyParams.page,
            lazyParams.rows,
            globalFilter || undefined, // Use internal globalFilter
            abortControllerRef.current.signal,
            [lazyParams.sortField || "createdAt"],
            [lazyParams.sortOrder === 1 ? "asc" : "desc"],
            lazyParams.active === "all" ? undefined : lazyParams.active === "true",
        );

        if (result) {
            setComments(result.result);
            setTotalRecords(result.meta.totalItems);
        } else {
            // API function handles console.error and returns null
            // Optionally show a toast here for general load failure if not too noisy
        }
        setLoading(false);
    }, [lazyParams, globalFilter]); // Dependencies for loadComments

    useEffect(() => {
        loadComments();
    }, [loadComments]); // useEffect depends on the memoized loadComments

    // Effect to handle external search term changes
    useEffect(() => {
        if (externalSearchTerm !== undefined && externalSearchTerm !== globalFilter) {
            setGlobalFilter(externalSearchTerm);
            setLazyParams(prev => ({ ...prev, page: 1, first: 0 })); // Reset to page 1
            // loadComments will be triggered by globalFilter or lazyParams changing in the main useEffect
        }
    }, [externalSearchTerm]);


    const onPage = (event: PaginatorPageChangeEvent) => {
        setLazyParams(prev => ({
            ...prev,
            first: event.first,
            page: event.page + 1,
            rows: event.rows,
        }));
    };

    const onSort = (event: DataTableSortEvent) => {
        setLazyParams(prev => ({
            ...prev,
            sortField: event.sortField as string,
            sortOrder: event.sortOrder as -1 | 1 | null | undefined,
        }));
    };

    // For DataTable's own filter display, if you use it.
    // const onTableFilter = (event: DataTableFilterEvent) => {
    //   setLazyParams(prev => ({
    //     ...prev,
    //     first: 0,
    //     page: 1,
    //     filters: event.filters as any, // Cast if necessary
    //   }));
    // };

    const handleGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilter(value);
        setLazyParams(prev => ({ ...prev, page: 1, first: 0 })); // Reset to page 1 on new global search
    };

    const handleActiveFilterChange = (value: "all" | "true" | "false") => {
        setLazyParams(prev => ({ ...prev, active: value, page: 1, first: 0 }));
    };


    const confirmCommentDelete = (comment: Comment_t) => {
        let selectedDeleteReason = DeleteReason.ADMIN_DELETE; // Default or first option

        const reasonDropdown = (
            <div className="p-fluid mt-3">
                <label htmlFor="deleteReasonSelect" className="font-medium">Lý do xóa:</label>
                <Dropdown
                    id="deleteReasonSelect"
                    value={selectedDeleteReason}
                    options={deleteReasonOptions}
                    onChange={(e: DropdownChangeEvent) => {
                        selectedDeleteReason = e.value;
                    }}
                    placeholder="Chọn lý do xóa"
                    className="mt-1 w-full"
                />
            </div>
        );

        confirmDialog({
            message: (
                <div>
                    <p>Bạn có chắc chắn muốn xóa bình luận này (ID: {comment.id.substring(0, 8)}...)?</p>
                    <p>"{comment.content.substring(0, 100)}{comment.content.length > 100 ? '...' : ''}"</p>
                    {reasonDropdown}
                </div>
            ),
            header: "Xác nhận xóa bình luận",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Xóa",
            rejectLabel: "Hủy",
            acceptClassName: "p-button-danger",
            accept: async () => {
                if (!selectedDeleteReason) {
                    toast?.current?.show({ severity: 'warn', summary: 'Thiếu thông tin', detail: 'Vui lòng chọn lý do xóa.' });
                    return;
                }
                const deleteRequest: DeleteCommentRequest = {
                    reason: `Admin deleted: ${selectedDeleteReason}`, // More descriptive reason
                    reasonTag: selectedDeleteReason as DeleteReason, // Cast needed
                };
                setLoading(true); // Show loading for the table
                const result = await deleteOneComment(comment.id, deleteRequest);
                setLoading(false);

                if (result !== null) {
                    toast?.current?.show({ severity: "success", summary: "Thành công", detail: `Xóa bình luận thành công.`, life: 3000 });
                    loadComments(); // Reload data
                } else {
                    toast?.current?.show({ severity: "error", summary: "Lỗi", detail: `Lỗi khi xóa bình luận.`, life: 3000 });
                }
            },
            reject: () => { /* No action on reject */ },
        });
    };


    const handleToggleActive = async (comment: Comment_t) => {
        setLoading(true); // Show loading for the table
        const result = await toggleActive(comment.id);
        setLoading(false);

        if (result !== null) {
            toast?.current?.show({
                severity: "success",
                summary: "Thành công",
                detail: `Bình luận đã được ${result.active ? "hiển thị" : "ẩn"} thành công.`,
                life: 3000,
            });
            setComments(prevComments => prevComments.map((c) => (c.id === result.id ? result : c)));
        } else {
            toast?.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Không thể thay đổi trạng thái hiển thị của bình luận.",
                life: 3000,
            });
        }
    };

    // --- Column Body Templates ---
    const idBodyTemplate = (rowData: Comment_t) => {
        const ids: IDGroup[] = [
            { title: "ID", idValue: rowData.id },
            { title: "ID người dùng", idValue: rowData.userId },
            { title: `ID ${rowData.targetType === TargetType.LESSON ? "bài học" : "đề thi"}`, idValue: rowData.targetId },

        ]
        return IDGroupCell(ids);
    }
const emailBodyTemplate = (rowData: Comment_t) => <span className="text-xs">{rowData.userDisplayName}</span>;
    const contentBodyTemplate = (rowData: Comment_t) => {
        const truncated = rowData.content.length > 100 ? `${rowData.content.substring(0, 100)}...` : rowData.content;
        return <span title={rowData.content} className="text-xs">{truncated}</span>;
    };
    const dateCreatedBodyTemplate = (rowData: Comment_t) => <span className="text-xs">{formatDateToString(rowData.createdAt)}</span>;
    const likesBodyTemplate = (rowData: Comment_t) => <span className="text-xs">{rowData.likeCounts}</span>;
    const repliesBodyTemplate = (rowData: Comment_t) => <span className="text-xs">{rowData.directReplyCount}</span>;
    const activeStatusBodyTemplate = (rowData: Comment_t) => (
        <Tag severity={rowData.active ? "success" : "danger"} value={rowData.active ? "Hiện" : "Ẩn"} />
    );


    return (
        <div id="admin-comment-table-section" className="p-card shadow-1">
            {/* ConfirmDialog needs to be rendered, typically once globally or within the component that triggers confirmDialog */}
            <ConfirmDialog />
            <CommentDataTableHeader
                globalFilterValue={globalFilter}
                onGlobalFilterChange={handleGlobalFilterChange}
                activeFilterValue={lazyParams.active}
                onActiveFilterChange={handleActiveFilterChange}
                totalRecords={totalRecords}
            />
            <DataTable
                value={comments}
                lazy
                first={lazyParams.first}
                rows={lazyParams.rows}
                totalRecords={totalRecords}
                onSort={onSort}
                sortField={lazyParams.sortField}
                sortOrder={lazyParams.sortOrder as 1 | -1 | null | undefined} // PrimeReact type for sortOrder
                // onFilter={onTableFilter} // If using built-in column filters
                loading={loading}
                className="p-datatable-sm p-datatable-responsive p-datatable-striped mt-3" // Added striped
                rowHover
                scrollable
                scrollHeight="calc(100vh - 350px)" // Adjust height dynamically
                emptyMessage="Không có bình luận nào."
                dataKey="id" // Important for selection, expansion, etc.
            >
                <Column field="id" header="ID" body={idBodyTemplate} sortable style={{ width: '80px' }} />
                <Column field="userDisplayName" header="Email User" body={emailBodyTemplate} sortable style={{ minWidth: '150px' }} />
                <Column field="content" header="Nội dung" body={contentBodyTemplate} sortable style={{ minWidth: '250px' }} />
                <Column field="createdAt" header="Ngày tạo" body={dateCreatedBodyTemplate} sortable style={{ width: '120px' }} />
                <Column field="likeCounts" header="Thích" body={likesBodyTemplate} sortable style={{ width: '70px', textAlign: 'center' }} />
                <Column field="directReplyCount" header="Phản hồi" body={repliesBodyTemplate} sortable style={{ width: '80px', textAlign: 'center' }} />
                <Column header="Mức độ độc hại" body={(rowData: Comment_t) => <ColumnManageCommentTable.CommentToxicityCell rowData={rowData} />} style={{ width: '180px' }} />
                <Column field="active" header="Hiển thị" body={activeStatusBodyTemplate} sortable style={{ width: '100px', textAlign: 'center' }} />
                <Column
                    header="Hành động"
                    body={(rowData: Comment_t) => (
                        <ColumnManageCommentTable.CommentActionsCell
                            rowData={rowData}
                            onConfirmDelete={confirmCommentDelete}
                            onToggleActive={handleToggleActive}
                        />
                    )}
                    style={{ width: '120px', textAlign: 'center' }}
                    exportable={false} // Actions column usually not exported
                />
            </DataTable>
            <Paginator
                first={lazyParams.first}
                rows={lazyParams.rows}
                totalRecords={totalRecords}
                onPageChange={onPage}
                rowsPerPageOptions={[10, 20, 50, 100]}
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} bình luận"
                className="mt-3 justify-content-center md:justify-content-end"
            />
        </div>
    );
};
export default AdminCommentTableSection;