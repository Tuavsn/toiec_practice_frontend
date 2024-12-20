import { PaginatorPageChangeEvent } from "primereact/paginator";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { callGetRole, callGetUserRow } from "../api/api";
import { useToast } from "../context/ToastProvider";
import { initialUserState } from "../utils/types/emptyValue";
import { UserHookAction, UserHookState } from "../utils/types/type";




const reducer = (state: UserHookState, action: UserHookAction): UserHookState => {
    switch (action.type) {
        case 'FETCH_ROWS_SUCCESS': {
            const [newUsers, newPageIndex] = action.payload;
            return { ...state, rows: newUsers, currentPageIndex: newPageIndex }
        }
        case 'FETCH_ROLES_SUCCESS': {
            return { ...state, roleList: action.payload }
        }
        case 'RESET_ROWS':
            return { ...state, rows: [] }
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
export default function useUser() {

    const [state, dispatch] = useReducer(reducer, initialUserState);
    const totalItems = useRef(0);
    const { toast } = useToast();
    const fetchUsers = useCallback(async (pageNumber: number) => {

        const response = await callGetUserRow(pageNumber);
        if (!response) {
            toast.current?.show({ severity: "error", summary: "Lỗi", detail: "Không thể tải được danh sách người dùng" });
            return;
        }
        dispatch({ type: "FETCH_ROWS_SUCCESS", payload: [response.result, pageNumber] });
        totalItems.current = response.meta.totalItems;

    }, [])
    useEffect(() => {
        if (state.roleList.length === 0) {
            callGetRole().then(data => { if (data) dispatch({ type: "FETCH_ROLES_SUCCESS", payload: data.result }) })
        }
        fetchUsers(state.currentPageIndex);

    }, [state.isRefresh]);

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        dispatch({ type: "RESET_ROWS" });
        fetchUsers(e.page)
    }

    return {
        state,
        dispatch,
        totalItems,
        onPageChange,
    }
}


