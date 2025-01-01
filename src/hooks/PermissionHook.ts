import { PaginatorPageChangeEvent } from "primereact/paginator";
import { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from "react";
import { callGetPermission } from "../api/api";
import { useToast } from "../context/ToastProvider";
import SetWebPageTitle from "../utils/helperFunction/setTitlePage";
import { RowHookAction } from "../utils/types/action";
import { initialPermissionState } from "../utils/types/emptyValue";
import { RowHookState } from "../utils/types/state";
import { Permission } from "../utils/types/type";

const reducer = (state: RowHookState<Permission>, action: RowHookAction<Permission>): RowHookState<Permission> => {
    switch (action.type) {
        case 'FETCH_ROWS_SUCCESS': {
            const [newCateogories, newPageIndex] = action.payload;
            return { ...state, rows: newCateogories, currentPageIndex: newPageIndex }
        }
        case 'SET_PAGE':
            return { ...state, currentPageIndex: action.payload }
        case 'REFRESH_DATA':
            return { ...state, isRefresh: !state.isRefresh }
        case 'TOGGLE_DIALOG':
            return { ...state, job: action.payload }
        case 'OPEN_UPDATE_DIALOG':
            return { ...state, job: "UPDATE", currentSelectedRow: action.payload }
        case 'OPEN_CREATE_DIALOG':
            return { ...state, job: "CREATE", currentSelectedRow: action.payload }
        case 'OPEN_DELETE_DIALOG':
            return { ...state, job: "DELETE", currentSelectedRow: action.payload }

        default:
            return state;
    }
};



export default function usePermission() {

    const [state, dispatch] = useReducer(reducer, initialPermissionState);
    const totalItems = useRef(0);
    const { toast } = useToast();
    const fetchPermissions = useCallback(async (pageNumber: number) => {

        const response = await callGetPermission(pageNumber);
        if (!response) {
            toast.current?.show({ severity: "error", summary: "Lỗi", detail: "Không thể tải được danh sách chủ đề" });
            return;
        }
        dispatch({ type: "FETCH_ROWS_SUCCESS", payload: [response.result, pageNumber] });
        totalItems.current = response.meta.totalItems;

    }, [])
    useLayoutEffect(() => SetWebPageTitle("Quản lý chủ đề"), []);
    useEffect(() => {

        fetchPermissions(state.currentPageIndex);

    }, [state.isRefresh]);

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        fetchPermissions(e.page)
    }

    return {
        state,
        dispatch,
        totalItems,
        onPageChange,
    }
}
