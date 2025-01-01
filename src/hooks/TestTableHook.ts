import { PaginatorPageChangeEvent } from "primereact/paginator";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { useParams } from "react-router-dom";
import { callGetTestRow } from "../api/api";
import { useToast } from "../context/ToastProvider";
import GetAbortController from "../utils/helperFunction/GetAbortController";
import SplitNameIDFromURL from "../utils/helperFunction/splitNameIDFromURL";
import { TestHookAction } from "../utils/types/action";
import { emptyTestRow, initialTestState } from "../utils/types/emptyValue";
import { TestHookState } from "../utils/types/state";
import { CategoryID, Name_ID } from "../utils/types/type";

const reducer = (state: TestHookState, action: TestHookAction): TestHookState => {
    switch (action.type) {
        case 'FETCH_ROWS_SUCCESS':
            const [newCateogories, newPageIndex] = action.payload;
            return { ...state, rows: newCateogories, currentPageIndex: newPageIndex }
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

export default function useTest() {

    const [state, dispatch] = useReducer(reducer, initialTestState);
    const totalItems = useRef(0);
    const { toast } = useToast();
    const abortControllerRef = useRef<AbortController | null>(null);
    const { category_name_id = "no idCategory found" } = useParams<{ category_name_id: Name_ID<CategoryID> }>();
    const [categoryName, category_id] = SplitNameIDFromURL(category_name_id);
    emptyTestRow.idCategory = category_id;
    const fetchTests = useCallback(async (pageNumber: number, searchText: string) => {
        const controller = GetAbortController(abortControllerRef);
        const response = await callGetTestRow(controller.signal, category_id, pageNumber, searchText);
        if (response === "abort") return;
        if (!response) {
            toast.current?.show({ severity: "error", summary: "Lỗi", detail: "Không thể tải được danh sách bộ đề" });
            return;
        }
        dispatch({ type: "FETCH_ROWS_SUCCESS", payload: [response.result, pageNumber] });
        totalItems.current = response.meta.totalItems;
    }, [category_id])
    useEffect(() => {

        fetchTests(state.currentPageIndex, state.searchText);

    }, [state.isRefresh, state.searchText]);

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        fetchTests(e.page, state.searchText);
    }

    return {
        state,
        dispatch,
        totalItems,
        onPageChange,
        categoryName,
    }
}

