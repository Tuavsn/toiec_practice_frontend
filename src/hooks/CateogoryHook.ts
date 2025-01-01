import { PaginatorPageChangeEvent } from "primereact/paginator";
import { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from "react";
import { callGetCategoryRow } from "../api/api";
import { useToast } from "../context/ToastProvider";
import GetAbortController from "../utils/helperFunction/GetAbortController";
import SetWebPageTitle from "../utils/helperFunction/setTitlePage";
import { CategoryHookAction } from "../utils/types/action";
import { initialCategoryState } from "../utils/types/emptyValue";
import { CategoryHookState } from "../utils/types/state";

const reducer = (state: CategoryHookState, action: CategoryHookAction): CategoryHookState => {
    switch (action.type) {
        case 'FETCH_ROWS_SUCCESS': {
            const [newCateogories, newPageIndex] = action.payload;
            return { ...state, rows: newCateogories, currentPageIndex: newPageIndex }
        }
        case 'SET_SEARCH':
            return { ...state, searchText: action.payload }
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

export default function useCategory() {

    const [state, dispatch] = useReducer(reducer, initialCategoryState);
    const totalItems = useRef(0);
    const { toast } = useToast();
    const abortControllerRef = useRef<AbortController | null>(null);
    const fetchCategorys = useCallback(async (pageNumber: number, searchText: string) => {
        const controller = GetAbortController(abortControllerRef);
        const response = await callGetCategoryRow(controller.signal, pageNumber, searchText);
        if (response === "abort") return;
        if (!response) {
            toast.current?.show({ severity: "error", summary: "Lỗi", detail: "Không thể tải được danh sách bộ đề" });
            return;
        }
        dispatch({ type: "FETCH_ROWS_SUCCESS", payload: [response.result, pageNumber] });
        totalItems.current = response.meta.totalItems;

    }, [])
    useLayoutEffect(() => SetWebPageTitle("Quản lý bộ đề"), []);
    useEffect(() => {

        fetchCategorys(state.currentPageIndex, state.searchText);

    }, [state.isRefresh, state.searchText]);

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        fetchCategorys(e.page, state.searchText)
    }

    return {
        state,
        dispatch,
        totalItems,
        onPageChange,
    }
}

