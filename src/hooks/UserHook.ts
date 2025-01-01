import { PaginatorPageChangeEvent } from "primereact/paginator";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { callGetRole, callGetUserRow } from "../api/api";
import { useToast } from "../context/ToastProvider";
import GetAbortController from "../utils/helperFunction/GetAbortController";
import { UserHookAction } from "../utils/types/action";
import { initialUserState } from "../utils/types/emptyValue";
import { UserHookState } from "../utils/types/state";





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
        case 'SET_SEARCH':
            return { ...state, searchText: action.payload }
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

    // Sử dụng useReducer để quản lý state và dispatch cho người dùng
    const [state, dispatch] = useReducer(reducer, initialUserState);
    // Biến tham chiếu để lưu tổng số lượng mục
    const totalItems = useRef(0);
    // Sử dụng hook toast để hiển thị thông báo
    const { toast } = useToast();
    // Biến tham chiếu để lưu trữ AbortController
    const abortControllerRef = useRef<AbortController | null>(null);

    // Hàm lấy danh sách người dùng
    const fetchUsers = useCallback(async (pageNumber: number, searchText: string) => {
        // Lấy hoặc tạo AbortController mới
        const controller = GetAbortController(abortControllerRef);

        // Gọi API để lấy dữ liệu người dùng
        const response = await callGetUserRow(controller.signal, pageNumber, searchText);
        if (response === "abort") return; // Nếu request bị hủy, kết thúc hàm
        if (!response) {
            // Hiển thị thông báo lỗi nếu không lấy được dữ liệu
            toast.current?.show({ severity: "error", summary: "Lỗi", detail: "Không thể tải được danh sách người dùng" });
            return;
        }
        // Cập nhật state với dữ liệu mới
        dispatch({ type: "FETCH_ROWS_SUCCESS", payload: [response.result, pageNumber] });
        totalItems.current = response.meta.totalItems; // Cập nhật tổng số lượng mục

    }, []); // Hàm chỉ được tạo lại nếu không có dependency nào thay đổi

    useEffect(() => {
        // Tạo hoặc lấy AbortController mới
        const controller = GetAbortController(abortControllerRef);

        // Nếu danh sách vai trò (roles) chưa được tải, gọi API để lấy dữ liệu
        if (state.roleList.length === 0) {
            callGetRole(controller.signal).then(data => {
                if (data && data !== "abort") {
                    dispatch({ type: "FETCH_ROLES_SUCCESS", payload: data.result });
                }
            });
        }
        // Lấy danh sách người dùng dựa trên trang hiện tại và từ khóa tìm kiếm
        fetchUsers(state.currentPageIndex, state.searchText);

        // Cleanup: Hủy request nếu dependency thay đổi hoặc component unmount
    }, [state.isRefresh, state.searchText]);

    // Hàm xử lý khi người dùng thay đổi trang
    const onPageChange = (e: PaginatorPageChangeEvent) => {
        dispatch({ type: "RESET_ROWS" }); // Reset danh sách người dùng hiện tại
        fetchUsers(e.page, state.searchText); // Lấy dữ liệu cho trang mới
    };

    return {
        state, // Trạng thái hiện tại
        dispatch, // Hàm dispatch để cập nhật state
        totalItems, // Tổng số lượng mục
        onPageChange, // Hàm xử lý khi thay đổi trang
    };
}


