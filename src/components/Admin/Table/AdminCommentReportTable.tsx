// Filename: src/features/admin/components/reports/AdminCommentReportsTable.tsx
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner'; // For a more prominent loading state
import React, { useCallback, useEffect, useState } from 'react';
// Placeholder imports for sub-components we will create:
import { SortOrder } from 'primereact/api'; // For DataTable sortOrder (1 for asc, -1 for desc, 0 for unsorted)
import { DataTableSortEvent } from 'primereact/datatable';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useAdminCommentReports } from '../../../hooks/AdminCommentReportsHook';
import { ReportTableFilters } from '../../../utils/types/type';
import ReportTableToolbar from '../AdminToolbar/ReportTableToolbar';
import ReportDataTable from './ReportDataTable';

//------------------------------------------------------
// Props for AdminCommentReportsTable
//------------------------------------------------------
export interface AdminCommentReportsTableProps {
  // This prop will be used to set the search term in the AdminCommentTable
  setAdminCommentGlobalSearchTerm: (commentId: string) => void;
}

//------------------------------------------------------
// Admin Comment Reports Table Section Component
//------------------------------------------------------
const AdminCommentReportsTable: React.FC<AdminCommentReportsTableProps> = ({
  setAdminCommentGlobalSearchTerm,
}) => {
  const {
    state,
    loadReports,
    updateReportStatus,
    deleteReport,
    // clearUpdateError, // Will be called within action handlers or by child components
    // clearDeleteError,
  } = useAdminCommentReports();

  const { reports, meta, isLoading, error, isUpdatingReportStatus, updateReportError, isDeletingReport, deleteReportError } = state;

  // State for filters, sorting, and pagination to pass to loadReports
  const [lazyParams, setLazyParams] = useState({
    first: 0, // First record offset for Paginator
    page: 1,  // Current page for API
    rows: 10, // Page size
    sortField: 'createdAt',
    sortOrder: -1 as SortOrder, // -1 for desc, 1 for asc
    filters: {} as ReportTableFilters, // Will be populated by ReportTableToolbar
  });

  //------------------------------------------------------
  // Initial data load and re-fetch on lazyParams change
  //------------------------------------------------------
  useEffect(() => {
    const apiParams = {
      page: lazyParams.page,
      pageSize: lazyParams.rows,
      sortBy: lazyParams.sortField,
      sortDirection: lazyParams.sortOrder === 1 ? 'asc' : ('desc' as 'asc' | 'desc'),
      status: lazyParams.filters.status || undefined,
      reasonCategory: lazyParams.filters.reasonCategory || undefined,
      // Add other filters from lazyParams.filters if needed
    };
    loadReports(apiParams);
  }, [lazyParams, loadReports]);

  //------------------------------------------------------
  // Handlers for DataTable and Paginator events
  //------------------------------------------------------
  const handlePageChange = (event: PaginatorPageChangeEvent) => {
    setLazyParams(prev => ({
      ...prev,
      page: event.page + 1, // PrimeReact Paginator is 0-indexed for page, API is 1-indexed
      first: event.first,
      rows: event.rows,
    }));
  };

  const handleSort = (event: DataTableSortEvent) => {
    setLazyParams(prev => ({
      ...prev,
      sortField: event.sortField,
      sortOrder: event.sortOrder ?? 0, // Default to 0 if null/undefined
    }));
  };

  const handleFilterChange = useCallback((newFilters: ReportTableFilters) => {
    setLazyParams(prev => ({
      ...prev,
      page: 1, // Reset to first page on filter change
      first: 0,
      filters: newFilters,
    }));
  }, []);

  //------------------------------------------------------
  // Action Handlers to pass to ReportDataTable
  //------------------------------------------------------
  const handleViewComment = (commentId: string) => {
    setAdminCommentGlobalSearchTerm(commentId);
    // Optionally, scroll to the AdminCommentTable or highlight it
    const commentTableElement = document.getElementById('admin-comment-table-section'); // Assuming AdminCommentTable has an id
    if (commentTableElement) {
      commentTableElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // updateReportStatus and deleteReport from the hook can be passed directly
  // or wrapped if additional logic (like specific toasts) is needed here.

  //------------------------------------------------------
  // Render Logic
  //------------------------------------------------------
  const renderContent = () => {
    if (isLoading && !reports.length) {
      return (
        <div className="flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" animationDuration=".5s" />
        </div>
      );
    }

    if (error && !reports.length) {
      return <Message severity="error" text={`Lỗi tải báo cáo: ${error}. Vui lòng thử lại.`} className="mt-3" />;
    }

    if (!isLoading && reports.length === 0 && !error) {
      return <Message severity="info" text="Không có báo cáo nào phù hợp với tiêu chí tìm kiếm." className="mt-3" />;
    }

    return (
      <>
        <ReportDataTable
        
          reports={reports}
          isLoading={isLoading} // For inline loading indicators in DataTable if any
          sortField={lazyParams.sortField}
          sortOrder={lazyParams.sortOrder}
          onSort={handleSort}
          // Filter values will be managed by ReportTableToolbar and passed via lazyParams.filters to loadReports
          // Individual column filtering can also be set up here if DataTable supports it directly with onFilter
          onViewComment={handleViewComment}
          onUpdateReportStatus={updateReportStatus} // from hook
          onDeleteReport={deleteReport} // from hook
          // Pass status/error states for individual rows if needed
          isUpdatingReportStatus={isUpdatingReportStatus}
          updateReportError={updateReportError}
          isDeletingReport={isDeletingReport}
          deleteReportError={deleteReportError}
        />
        <Paginator first={lazyParams.first} rows={lazyParams.rows} totalRecords={meta?.totalItems} onPageChange={handlePageChange} />
      </>
    );
  };

  return (
    <div id="admin-report-table-section" className="p-card p-4 mt-5 shadow-1"> {/* Added mt-5 for spacing */}
      <h3 className="mt-0 mb-4 text-xl font-semibold">
        Quản lý Báo cáo Bình luận ({meta?.totalItems || 0})
      </h3>

      <ReportTableToolbar
        onFilterChange={handleFilterChange}
        initialFilters={lazyParams.filters} // To pre-fill filters if component re-mounts
      />

      {renderContent()}
    </div>
  );
};

export default AdminCommentReportsTable;