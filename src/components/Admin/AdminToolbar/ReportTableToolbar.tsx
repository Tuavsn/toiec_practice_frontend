// Filename: src/features/admin/components/reports/ReportTableToolbar.tsx
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar'; // For layout
import React, { useEffect, useState } from 'react';
import { reportReasonToLabel } from '../../../utils/helperFunction/ReportEnumToLabel';
import { CommentReportReasonCategory, CommentReportStatus, ReportTableFilters } from '../../../utils/types/type';

//------------------------------------------------------
// Props for ReportTableToolbar
//------------------------------------------------------
export interface ReportTableToolbarProps {
    initialFilters: ReportTableFilters;
    onFilterChange: (filters: ReportTableFilters) => void;
    // onRefresh?: () => void; // Optional: if you want a manual refresh button
}

//------------------------------------------------------
// Report Table Toolbar Component
//------------------------------------------------------
const ReportTableToolbar: React.FC<ReportTableToolbarProps> = ({
    initialFilters,
    onFilterChange,
    // onRefresh,
}) => {
    const [selectedStatus, setSelectedStatus] = useState<CommentReportStatus | null | undefined>(initialFilters.status);
    const [selectedReason, setSelectedReason] = useState<CommentReportReasonCategory | null | undefined>(initialFilters.reasonCategory);

    // Effect to update internal state if initialFilters prop changes from parent
    useEffect(() => {
        setSelectedStatus(initialFilters.status);
        setSelectedReason(initialFilters.reasonCategory);
    }, [initialFilters]);

    const statusOptions = React.useMemo(() => [
        { label: 'Tất cả trạng thái', value: null }, // Option for "all"
        ...Object.values(CommentReportStatus).map(value => ({
            label: reportStatusToLabel(value), // You'll need to create this helper
            value,
        })),
    ], []);

    const reasonOptions = React.useMemo(() => [
        { label: 'Tất cả lý do', value: null }, // Option for "all"
        ...Object.values(CommentReportReasonCategory).map(value => ({
            label: reportReasonToLabel(value), // Using existing helper
            value,
        })),
    ], []);

    const handleApplyFilters = () => {
        onFilterChange({
            status: selectedStatus,
            reasonCategory: selectedReason,
        });
    };

    const handleClearFilters = () => {
        setSelectedStatus(null);
        setSelectedReason(null);
        onFilterChange({
            status: null,
            reasonCategory: null,
        });
    };

    const startContent = (
        <div className="flex flex-wrap gap-3 align-items-center"> {/* Use gap for spacing */}
            <div className="p-field">
                <label htmlFor="statusFilter" className="p-sr-only">Lọc theo trạng thái</label> {/* Screen-reader only label */}
                <Dropdown
                    id="statusFilter"
                    value={selectedStatus}
                    options={statusOptions}
                    onChange={(e: DropdownChangeEvent) => setSelectedStatus(e.value)}
                    placeholder="Lọc theo trạng thái"
                    showClear
                    className="w-full md:w-15rem text-sm" // Responsive width
                />
            </div>
            <div className="p-field">
                <label htmlFor="reasonFilter" className="p-sr-only">Lọc theo lý do</label>
                <Dropdown
                    id="reasonFilter"
                    value={selectedReason}
                    options={reasonOptions}
                    onChange={(e: DropdownChangeEvent) => setSelectedReason(e.value)}
                    placeholder="Lọc theo lý do"
                    showClear
                    className="w-full md:w-18rem text-sm" // Responsive width
                />
            </div>
        </div>
    );

    const endContent = (
        <div className="flex gap-2">
            <Button
                label="Xóa lọc"
                icon="pi pi-filter-slash"
                className="p-button-outlined p-button-sm"
                onClick={handleClearFilters}
                disabled={selectedStatus === null && selectedReason === null}
            />
            <Button
                label="Áp dụng"
                icon="pi pi-check"
                className="p-button-sm"
                onClick={handleApplyFilters}
            />
            {/* {onRefresh && (
        <Button
          icon="pi pi-refresh"
          className="p-button-outlined p-button-sm"
          onClick={onRefresh}
          tooltip="Tải lại dữ liệu"
        />
      )} */}
        </div>
    );

    return (
        <Toolbar
            start={startContent}
            end={endContent}
            className="mb-4 p-toolbar-sm surface-ground border-noround" // PrimeReact class for smaller toolbar, custom styling
        />
    );
};

export default ReportTableToolbar;

export function reportStatusToLabel(value: CommentReportStatus): string {
    switch (value) {
        case CommentReportStatus.PENDING_REVIEW:
            return 'Chờ duyệt';
        case CommentReportStatus.ACTION_TAKEN:
            return 'Đã xử lý';
        case CommentReportStatus.UNDER_REVIEW:
            return 'Đang xem xét';
        case CommentReportStatus.NO_ACTION_NEEDED:
            return 'Không cần xử lý';
        default:
            return 'Không xác định';
    }
}
