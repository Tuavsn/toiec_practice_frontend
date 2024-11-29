import { PaginatorPageChangeEvent } from "primereact/paginator";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { callGetUserRow } from "../api/api";
import { useToast } from "../context/ToastProvider";
import { initialUserState } from "../utils/types/emptyValue";
import { UserHookAction, UserHookState } from "../utils/types/type";




const reducer = (state: UserHookState, action: UserHookAction): UserHookState => {
    switch (action.type) {
        case 'FETCH_USERS_SUCCESS':
            const [newUsers, newPageIndex] = action.payload;
            return { ...state, users: newUsers, currentPageIndex: newPageIndex }
        case 'SET_PAGE':
            return { ...state, currentPageIndex: action.payload }
        case 'REFRESH_DATA':
            return { ...state, isRefresh: !state.isRefresh }
        case 'TOGGLE_DIALOG':
            return { ...state, job: action.payload }
        case 'OPEN_UPDATE_DIALOG':
            return { ...state, job: "UPDATE", currentSelectedUser: action.payload }
        case 'OPEN_CREATE_DIALOG':
            return { ...state, job: "CREATE", currentSelectedUser: action.payload }
        case 'OPEN_DELETE_DIALOG':
            return { ...state, job: "DELETE", currentSelectedUser: action.payload }

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
        dispatch({ type: "FETCH_USERS_SUCCESS", payload: [response.result, pageNumber] });
        totalItems.current = response.meta.totalItems;

    }, [])
    useEffect(() => {

        fetchUsers(state.currentPageIndex);

    }, [state.isRefresh]);

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        fetchUsers(e.page)
    }

    return {
        state,
        dispatch,
        totalItems,
        onPageChange,
    }
}


