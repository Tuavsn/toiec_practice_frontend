import { PaginatorPageChangeEvent } from "primereact/paginator";
import { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from "react";
import { callGetPermissionList, callGetRole } from "../api/api";
import { useToast } from "../context/ToastProvider";
import SetWebPageTitle from "../utils/setTitlePage";
import { RoleHookAction } from "../utils/types/action";
import { initialRoleState } from "../utils/types/emptyValue";
import { RoleHookState } from "../utils/types/state";

const reducer = (state: RoleHookState, action: RoleHookAction): RoleHookState => {
    switch (action.type) {
        case 'FETCH_ROWS_SUCCESS': {
            const [newCateogories, newPageIndex] = action.payload;
            return { ...state, rows: newCateogories, currentPageIndex: newPageIndex }
        }
        case 'FETCH_PERMISSIONS_SUCCESS': {
            return { ...state, permissionList: action.payload }
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



export default function useRole() {

    const [state, dispatch] = useReducer(reducer, initialRoleState);
    const totalItems = useRef(0);
    const { toast } = useToast();
    const fetchRoles = useCallback(async (pageNumber: number) => {

        const response = await callGetRole();
        if (!response) {
            toast.current?.show({ severity: "error", summary: "Lỗi", detail: "Không thể tải được danh sách quyền" });
            return;
        }
        dispatch({ type: "FETCH_ROWS_SUCCESS", payload: [response.result, pageNumber] });
        totalItems.current = response.meta.totalItems;

    }, [])
    useLayoutEffect(() => SetWebPageTitle("Quản lý quyền"), []);
    useEffect(() => {
        if (state.permissionList.length === 0) {
            callGetPermissionList().then(data => {
                if (data) dispatch({ type: "FETCH_PERMISSIONS_SUCCESS", payload: data.result })
            })
        }
        fetchRoles(state.currentPageIndex);

    }, [state.isRefresh]);

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        fetchRoles(e.page)
    }

    return {
        state,
        dispatch,
        totalItems,
        onPageChange,
    }
}
