// Filename: src/features/admin/components/reports/ReportDataTable.tsx
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { confirmDialog } from 'primereact/confirmdialog'; // For delete confirmation
import { DataTable, DataTableSortEvent, DataTableValue } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog'; // For editing status + notes
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea'; // For admin notes
import { OverlayPanel } from 'primereact/overlaypanel'; // For showing full details
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip'; // For truncating text
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '../../../context/ToastProvider';
import formatDate from '../../../utils/helperFunction/formatDateToString';
import { reportReasonToLabel } from '../../../utils/helperFunction/ReportEnumToLabel';
import { CommentReport, CommentReportReasonCategory, CommentReportStatus, UpdateCommentReportStatusPayload } from '../../../utils/types/type';
import IDGroupCell, { IDGroup } from '../../Common/IDGroup/IDGroupCell';
import ColumnManageCommentTable from '../AdminColumn/ColumnManageCommentTable';
import { reportStatusToLabel } from '../AdminToolbar/ReportTableToolbar';


//------------------------------------------------------
// Props for ReportDataTable
//------------------------------------------------------
export interface ReportDataTableProps {
    reports: CommentReport[];
    isLoading: boolean;
    sortField: string;
    sortOrder: 1 | -1 | 0 | null | undefined; // DataTableSortOrder
    onSort: (event: DataTableSortEvent) => void;
    onViewComment: (commentId: string) => void;
    onUpdateReportStatus: (reportId: string, payload: UpdateCommentReportStatusPayload) => Promise<CommentReport | null>;
    onDeleteReport: (reportId: string) => Promise<boolean>;
    // States for individual row operations
    isUpdatingReportStatus: Record<string, boolean>;
    updateReportError: Record<string, string | null>;
    isDeletingReport: Record<string, boolean>;
    deleteReportError: Record<string, string | null>;
}

//------------------------------------------------------
// Helper component for Status Editor (within a Dialog)
//------------------------------------------------------
interface StatusEditorDialogProps {
    visible: boolean;
    onHide: () => void;
    report: CommentReport;
    onUpdateReportStatus: ReportDataTableProps['onUpdateReportStatus'];
    isUpdating: boolean;
}

const StatusEditorDialog: React.FC<StatusEditorDialogProps> = ({
    visible, onHide, report, onUpdateReportStatus, isUpdating
}) => {
    const [selectedStatus, setSelectedStatus] = useState<CommentReportStatus>(report.status);
    const [adminNotes, setAdminNotes] = useState<string>(report.adminNotes || '');
    const { toast } = useToast();

    useEffect(() => {
        if (visible) {
            setSelectedStatus(report.status);
            setAdminNotes(report.adminNotes || '');
        }
    }, [visible, report]);

    const statusOptions = Object.values(CommentReportStatus).map(value => ({
        label: reportStatusToLabel(value),
        value,
    }));

    const handleSaveStatus = async () => {
        const success = await onUpdateReportStatus(report.id, {
            status: selectedStatus,
            adminNotes: adminNotes.trim() || undefined,
        });
        if (success) {
            toast?.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật trạng thái báo cáo thành công.' });
            onHide();
        } else {
            toast?.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể cập nhật trạng thái. Vui lòng thử lại.' });
            // Error state is managed by the hook and can be displayed on the row if needed
        }
    };

    const dialogFooter = (
        <div>
            <Button label="Hủy" icon="pi pi-times" onClick={onHide} className="p-button-text" disabled={isUpdating} />
            <Button label="Lưu thay đổi" icon="pi pi-check" onClick={handleSaveStatus} loading={isUpdating} />
        </div>
    );

    return (
        <Dialog header="Cập nhật Trạng thái Báo cáo" visible={visible} style={{ width: 'min(90vw, 450px)' }} modal footer={dialogFooter} onHide={onHide} blockScroll>
            <div className="p-fluid">
                <div className="field mb-3">
                    <label htmlFor="reportStatusDropdown" className="font-medium block mb-2">Trạng thái</label>
                    <Dropdown
                        id="reportStatusDropdown"
                        value={selectedStatus}
                        options={statusOptions}
                        onChange={(e: DropdownChangeEvent) => setSelectedStatus(e.value)}
                        className="w-full"
                    />
                </div>
                <div className="field">
                    <label htmlFor="adminNotesTextarea" className="font-medium block mb-2">Ghi chú của Admin</label>
                    <InputTextarea
                        id="adminNotesTextarea"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        rows={4}
                        autoResize
                        className="w-full text-sm"
                        placeholder="Thêm ghi chú (nếu có)..."
                    />
                </div>
            </div>
        </Dialog>
    );
};


//------------------------------------------------------
// Report Data Table Component
//------------------------------------------------------
const ReportDataTable: React.FC<ReportDataTableProps> = ({
    reports,
    isLoading,
    sortField,
    sortOrder,
    onSort,
    onViewComment,
    onUpdateReportStatus,
    onDeleteReport,
    isUpdatingReportStatus,
    // updateReportError, // Error can be shown via toast or a small icon next to status
    isDeletingReport,
    // deleteReportError,
}) => {
    const [editingReport, setEditingReport] = useState<CommentReport | null>(null); // For status editor dialog
    const detailsOverlayPanel = useRef<OverlayPanel>(null);
    const [detailsContent, setDetailsContent] = useState('');
    const { toast } = useToast(); // For delete error

    const showDetails = (event: React.MouseEvent, content: string) => {
        setDetailsContent(content);
        detailsOverlayPanel.current?.toggle(event);
    };

    // --- Column Body Templates ---

    const idBodyTemplate = (rowData: CommentReport) => {

        const idgs: IDGroup[] = [
            { title: "ID", idValue: rowData.id },
            { title: "ID bình luận", idValue: rowData.reportedCommentId },
            { title: "ID người báo", idValue: rowData.reporterUserId }
        ]
        return IDGroupCell(idgs);

    }

    const reasonBodyTemplate = (rowData: CommentReport) => (
        <Tag value={reportReasonToLabel(rowData.reasonCategory)} severity={getReasonSeverity(rowData.reasonCategory)} />
    );

    const detailsBodyTemplate = (rowData: CommentReport) => {
        if (!rowData.reasonDetails) return <span className="text-color-secondary text-xs">N/A</span>;
        const truncated = rowData.reasonDetails.length > 30 ? `${rowData.reasonDetails.substring(0, 30)}...` : rowData.reasonDetails;
        return (
            <>
                <Tooltip target={`.details-report-${rowData.id}`} content={rowData.reasonDetails} position="top" event="hover" />
                <span className={`details-report-${rowData.id} text-xs`} onClick={(e) => showDetails(e, rowData.reasonDetails || '')} style={{ cursor: 'pointer' }}>
                    {truncated}
                </span>
            </>
        );
    };

    const dateBodyTemplate = (rowData: CommentReport) => (
        <span className="text-xs">{formatDate(rowData.createdAt)}</span>
    );

    const statusBodyTemplate = (rowData: CommentReport) => {
        const isLoadingStatus = isUpdatingReportStatus[rowData.id];
        return (
            <div className="flex align-items-center gap-2">
                <Tag value={reportStatusToLabel(rowData.status)} severity={getStatusSeverity(rowData.status)} />
                <Button
                    icon="pi pi-pencil"
                    className="p-button-text p-button-rounded p-button-sm"
                    onClick={() => setEditingReport(rowData)}
                    tooltip="Chỉnh sửa trạng thái"
                    tooltipOptions={{ position: 'top' }}
                    loading={isLoadingStatus}
                />
            </div>
        );
    };

    // Helper for Tag severities based on status/reason
    const getStatusSeverity = (status: CommentReportStatus) => {
        switch (status) {
            case CommentReportStatus.PENDING_REVIEW: return 'warning';
            case CommentReportStatus.UNDER_REVIEW: return 'info';
            case CommentReportStatus.ACTION_TAKEN: return 'success';
            case CommentReportStatus.NO_ACTION_NEEDED: return 'secondary';
            default: return undefined;
        }
    };
    const getReasonSeverity = (reason: CommentReportReasonCategory): "success" | "info" | "secondary" | "contrast" | "warning" | "danger" | null | undefined => {
        // Example severities, adjust as needed
        switch (reason) {
            case CommentReportReasonCategory.HATE_SPEECH:
            case CommentReportReasonCategory.VIOLENCE_OR_THREATS:
            case CommentReportReasonCategory.CHILD_SAFETY_ISSUES:
            case CommentReportReasonCategory.SELF_HARM_OR_SUICIDE:
                return 'danger';
            case CommentReportReasonCategory.HARASSMENT:
            case CommentReportReasonCategory.NON_CONSENSUAL_CONTENT:
                return 'warning';
            case CommentReportReasonCategory.SPAM:
                return 'info';
            default: return 'success';
        }
    };


    const actionsBodyTemplate = (rowData: CommentReport) => {
        const isDeleting = isDeletingReport[rowData.id];
        const handleDeleteReport = () => {
            confirmDialog({
                message: `Bạn có chắc chắn muốn xóa báo cáo này (ID: ${rowData.id.substring(0, 8)}...)? Hành động này không xóa bình luận gốc.`,
                header: 'Xác nhận xóa báo cáo',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Xóa',
                rejectLabel: 'Hủy',
                acceptClassName: 'p-button-danger',
                accept: async () => {
                    const success = await onDeleteReport(rowData.id);
                    if (success) {
                        toast?.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa báo cáo.' });
                    } else {
                        toast?.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa báo cáo. Vui lòng thử lại.' });
                    }
                },
            });
        };

        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-text p-button-info"
                    tooltip="Xem bình luận gốc"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => onViewComment(rowData.reportedCommentId)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text p-button-danger"
                    tooltip="Xóa báo cáo này"
                    tooltipOptions={{ position: 'top' }}
                    onClick={handleDeleteReport}
                    loading={isDeleting}
                />
                {/* Future: Button to take action on original comment, e.g., hide/delete comment */}
            </div>
        );
    };

    return (
        <>
            <DataTable
                tableStyle={{ tableLayout: 'auto' }}
                value={reports as DataTableValue[]} // Cast needed if DataTableValue[] is stricter
                loading={isLoading}
                paginator={false} // External paginator will be used
                lazy
                sortField={sortField}
                sortOrder={sortOrder as any} // Cast to any if type mismatch with PrimeReact's SortOrder
                onSort={onSort}
                className="p-datatable-sm admin-reports-table mt-3" // Smaller table
                rowHover
                emptyMessage="Không tìm thấy báo cáo nào."

            >

                <Column header="ID Báo cáo" body={idBodyTemplate} sortable style={{ minWidth: '100px' }} headerStyle={{ whiteSpace: 'nowrap' }}   // ← Prevent header wrapping
                    bodyStyle={{
                        whiteSpace: 'nowrap',                  // ← Prevent cell wrapping
                        overflow: 'hidden',                    // ← Hide overflowed text
                        textOverflow: 'ellipsis'               // ← Show “…” for overflow
                    }} />
                <Column field="reasonCategory" header="Lý do" body={reasonBodyTemplate} sortable style={{ minWidth: '180px' }} />
                <Column field="reasonDetails" header="Chi tiết" body={detailsBodyTemplate} style={{ minWidth: '200px', maxWidth: '300px' }} />
                <Column header="Mức độ độc hại" body={(rowData: CommentReport) => ColumnManageCommentTable.CommentToxicityCell({ rowData })} style={{ minWidth: '120px' }} />
                <Column field="createdAt" header="Ngày báo cáo" body={dateBodyTemplate} sortable style={{ minWidth: '120px' }} />
                <Column field="status" header="Trạng thái" body={statusBodyTemplate} sortable style={{ minWidth: '180px' }} />
                <Column header="Hành động" body={actionsBodyTemplate} exportable={false} style={{ minWidth: '120px', textAlign: 'center' }} />
            </DataTable>

            {editingReport && (
                <StatusEditorDialog
                    visible={!!editingReport}
                    onHide={() => setEditingReport(null)}
                    report={editingReport}
                    onUpdateReportStatus={onUpdateReportStatus}
                    isUpdating={isUpdatingReportStatus[editingReport.id] || false}
                />
            )}
            <OverlayPanel ref={detailsOverlayPanel} showCloseIcon style={{ maxWidth: '400px' }}>
                <p className="text-sm p-2" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{detailsContent}</p>
            </OverlayPanel>
        </>
    );
};

export default ReportDataTable;