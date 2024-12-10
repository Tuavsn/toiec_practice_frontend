import { PaginatorPageChangeEvent } from "primereact/paginator";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { callGetTestRow } from "../api/api";
import { useToast } from "../context/ToastProvider";
import { emptyTestRow, initialTestState } from "../utils/types/emptyValue";
import { TestRow, RowHookAction, RowHookState, CategoryID, Name_ID } from "../utils/types/type";
import { useParams } from "react-router-dom";
import SplitNameIDFromURL from "../utils/splitNameIDFromURL";

const reducer = (state: RowHookState<TestRow>, action: RowHookAction<TestRow>): RowHookState<TestRow> => {
    switch (action.type) {
        case 'FETCH_ROWS_SUCCESS':
            const [newCateogories, newPageIndex] = action.payload;
            return { ...state, rows: newCateogories, currentPageIndex: newPageIndex }
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
    const { category_name_id = "no idCategory found" } = useParams<{ category_name_id: Name_ID<CategoryID> }>();
    const [, category_id] = SplitNameIDFromURL(category_name_id);
    emptyTestRow.idCategory = category_id;
    const fetchTests = async (pageNumber: number) => {

        const response = await callGetTestRow(category_id, pageNumber);
        if (!response) {
            toast.current?.show({ severity: "error", summary: "Lỗi", detail: "Không thể tải được danh sách bộ đề" });
            return;
        }
        dispatch({ type: "FETCH_ROWS_SUCCESS", payload: [response.result, pageNumber] });
        totalItems.current = response.meta.totalItems;
    }
    useEffect(() => {

        fetchTests(state.currentPageIndex);

    }, [state.isRefresh]);

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        fetchTests(e.page)
    }

    return {
        state,
        dispatch,
        totalItems,
        onPageChange,

    }
}

