import { useCallback, useEffect, useReducer, useRef } from "react";
import { deleteAdminCommentReport, fetchAdminCommentReports, updateAdminCommentReportStatus } from "../api/api";
import { AdminReportAction } from "../utils/types/action";
import { initialAdminReportState } from "../utils/types/emptyValue";
import { AdminReportsState } from "../utils/types/state";
import { CommentReport, UpdateCommentReportStatusPayload } from "../utils/types/type";

const adminReportsReducer = (state: AdminReportsState, action: AdminReportAction): AdminReportsState => {
  switch (action.type) {
    case 'FETCH_REPORTS_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_REPORTS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        reports: action.payload.result,
        meta: action.payload.meta,
      };
    case 'FETCH_REPORTS_FAILURE':
      return { ...state, isLoading: false, error: action.payload };

    case 'UPDATE_STATUS_START':
      return {
        ...state,
        isUpdatingReportStatus: { ...state.isUpdatingReportStatus, [action.payload.reportId]: true },
        updateReportError: { ...state.updateReportError, [action.payload.reportId]: null },
      };
    case 'UPDATE_STATUS_SUCCESS':
      return {
        ...state,
        reports: state.reports.map(report =>
          report.id === action.payload.id ? action.payload : report // Replace with updated report
        ),
        isUpdatingReportStatus: { ...state.isUpdatingReportStatus, [action.payload.id]: false },
      };
    case 'UPDATE_STATUS_FAILURE':
      return {
        ...state,
        isUpdatingReportStatus: { ...state.isUpdatingReportStatus, [action.payload.reportId]: false },
        updateReportError: { ...state.updateReportError, [action.payload.reportId]: action.payload.error },
      };
    case 'CLEAR_UPDATE_ERROR':
        return {
            ...state,
            updateReportError: { ...state.updateReportError, [action.payload.reportId]: null },
        };

    case 'DELETE_REPORT_START':
      return {
        ...state,
        isDeletingReport: { ...state.isDeletingReport, [action.payload.reportId]: true },
        deleteReportError: { ...state.deleteReportError, [action.payload.reportId]: null },
      };
    case 'DELETE_REPORT_SUCCESS':
      return {
        ...state,
        reports: state.reports.filter(report => report.id !== action.payload.reportId), // Remove deleted report
        isDeletingReport: { ...state.isDeletingReport, [action.payload.reportId]: false },
      };
    case 'DELETE_REPORT_FAILURE':
      return {
        ...state,
        isDeletingReport: { ...state.isDeletingReport, [action.payload.reportId]: false },
        deleteReportError: { ...state.deleteReportError, [action.payload.reportId]: action.payload.error },
      };
    case 'CLEAR_DELETE_ERROR':
        return {
            ...state,
            deleteReportError: { ...state.deleteReportError, [action.payload.reportId]: null },
        };
    default:
      return state;
  }
};

export const useAdminCommentReports = () => {
  const [state, dispatch] = useReducer(adminReportsReducer, initialAdminReportState);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    const controller = abortControllerRef.current; // Capture current controller for cleanup
    return () => controller.abort();
  }, []);


  const loadReports = useCallback(async (
    params: Parameters<typeof fetchAdminCommentReports>[0] = {}
  ) => {
    abortControllerRef.current?.abort(); // Abort previous request
    const currentController = new AbortController(); // Create new controller for this request
    abortControllerRef.current = currentController;

    dispatch({ type: 'FETCH_REPORTS_START' });
    const data = await fetchAdminCommentReports(params, currentController.signal);

    if (currentController.signal.aborted) {
      console.log("loadReports aborted");
      return; // Don't dispatch if aborted
    }

    if (data) {
      dispatch({ type: 'FETCH_REPORTS_SUCCESS', payload: data });
    } else {
      // API returned null, meaning an error occurred (logged in API function) or was cancelled
      dispatch({ type: 'FETCH_REPORTS_FAILURE', payload: 'Không thể tải danh sách báo cáo.' }); // Generic error
    }
  }, []); // No dependencies on dispatch, as it's stable

  const updateReportStatus = useCallback(async (
    reportId: string,
    payload: UpdateCommentReportStatusPayload
  ): Promise<CommentReport | null> => { // Return updated report or null
    dispatch({ type: 'UPDATE_STATUS_START', payload: { reportId } });
    const updatedReport = await updateAdminCommentReportStatus(reportId, payload); // No signal needed for quick updates usually

    if (updatedReport) {
      dispatch({ type: 'UPDATE_STATUS_SUCCESS', payload: updatedReport });
      return updatedReport;
    } else {
      dispatch({
        type: 'UPDATE_STATUS_FAILURE',
        payload: { reportId, error: 'Không thể cập nhật trạng thái báo cáo.' }, // Generic error
      });
      return null;
    }
  }, []);

  const deleteReport = useCallback(async (reportId: string): Promise<boolean> => { // Return true on success, false on failure
    dispatch({ type: 'DELETE_REPORT_START', payload: { reportId } });
    const success = await deleteAdminCommentReport(reportId); // API returns boolean | null

    if (success === true) {
      dispatch({ type: 'DELETE_REPORT_SUCCESS', payload: { reportId } });
      return true;
    } else {
      // success can be false or null (if API call failed)
      dispatch({
        type: 'DELETE_REPORT_FAILURE',
        payload: { reportId, error: 'Không thể xóa báo cáo.' }, // Generic error
      });
      return false;
    }
  }, []);


  const clearUpdateError = useCallback((reportId: string) => {
    dispatch({ type: 'CLEAR_UPDATE_ERROR', payload: { reportId } });
  }, []);

  const clearDeleteError = useCallback((reportId: string) => {
    dispatch({ type: 'CLEAR_DELETE_ERROR', payload: { reportId } });
  }, []);

  return {
    state,
    loadReports,
    updateReportStatus,
    deleteReport,
    clearUpdateError,
    clearDeleteError,
  };
};

