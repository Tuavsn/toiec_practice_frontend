import { PaginatorPageChangeEvent } from "primereact/paginator";
import { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from "react";
import { callGetCategoryRow } from "../api/api";
import { useToast } from "../context/ToastProvider";
import SetWebPageTitle from "../utils/helperFunction/setTitlePage";
import { RowHookAction } from "../utils/types/action";
import { initialCategoryState } from "../utils/types/emptyValue";
import { RowHookState } from "../utils/types/state";
import { CategoryRow, } from "../utils/types/type";

const reducer = (state: RowHookState<CategoryRow>, action: RowHookAction<CategoryRow>): RowHookState<CategoryRow> => {
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

export default function useCategory() {

    const [state, dispatch] = useReducer(reducer, initialCategoryState);
    const totalItems = useRef(0);
    const { toast } = useToast();
    const fetchCategorys = useCallback(async (pageNumber: number) => {

        const response = await callGetCategoryRow(pageNumber);
        if (!response) {
            toast.current?.show({ severity: "error", summary: "Lỗi", detail: "Không thể tải được danh sách bộ đề" });
            return;
        }
        dispatch({ type: "FETCH_ROWS_SUCCESS", payload: [response.result, pageNumber] });
        totalItems.current = response.meta.totalItems;

    }, [])
    useLayoutEffect(() => SetWebPageTitle("Quản lý bộ đề"), []);
    useEffect(() => {

        fetchCategorys(state.currentPageIndex);

    }, [state.isRefresh]);

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        fetchCategorys(e.page)
    }

    return {
        state,
        dispatch,
        totalItems,
        onPageChange,
    }
}

