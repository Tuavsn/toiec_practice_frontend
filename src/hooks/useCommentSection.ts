// Filename: src/features/comments/useCommentSection.ts

import { useCallback, useEffect, useReducer, useRef } from "react";
import { createComment, deleteOneComment, fetchRepliesList, fetchRootCommentList, submitCommentReport, toggleOneLike } from "../api/api";
import { useToast } from "../context/ToastProvider";
import { getCurrentUserId } from "../utils/helperFunction/AuthCheck";
import { CommentAction } from "../utils/types/action";
import { initialCommentSectionState } from "../utils/types/emptyValue";
import { Comment_t, CommentPage, CreateCommentReportPayload, CreateCommentRequest, DeleteCommentRequest, DeleteReason, TargetType } from "../utils/types/type";
import { CommentActionType } from "./_CommentSectionHook";
import { commentReducer } from "./CommentReducer";

//------------------------------------------------------
// Hook tùy chỉnh để quản lý logic khu vực bình luận
//------------------------------------------------------
export interface UseCommentSectionProps {
    targetType: TargetType;
    targetId: string;
}

export const useCommentSection = ({
    targetType,
    targetId,
}: UseCommentSectionProps) => {
    const [state, dispatch] = useReducer(commentReducer, initialCommentSectionState);
    const abortControllerRef = useRef<AbortController | null>(null);
    const { toast } = useToast();
    //------------------------------------------------------
    // Hủy các request API đang thực hiện khi component unmount
    //------------------------------------------------------
    useEffect(() => {
        // Khởi tạo AbortController mới mỗi khi targetType hoặc targetId thay đổi
        // hoặc khi component được mount lần đầu.
        abortControllerRef.current = new AbortController();
        const controller = abortControllerRef.current;

        return () => {
            controller.abort(); // Hủy request khi component unmount hoặc target thay đổi
        };
    }, [targetType, targetId]);


    //------------------------------------------------------
    // Hàm gọi API chung có xử lý AbortController
    //------------------------------------------------------
    const callApi = useCallback(async <T>(
        apiCall: (signal: AbortSignal) => Promise<T | null>,
        startActionType: CommentActionType,
        successAction: (payload: T) => CommentAction,
        failureActionType: CommentActionType,
        failurePayload?: any // Dùng cho các action failure cần payload cụ thể
    ): Promise<T | null> => {
        if (abortControllerRef.current?.signal.aborted) {
            console.warn("Attempted to call API with an aborted signal.");
            return null;
        }
        const currentController = abortControllerRef.current ?? new AbortController(); // Đảm bảo controller luôn tồn tại

        dispatch({ type: startActionType, payload: failurePayload }); // payload dùng cho START actions cần nó (e.g. DELETE_COMMENT_START)
        try {
            const result = await apiCall(currentController.signal);
            if (currentController.signal.aborted) return null; // Kiểm tra nếu đã bị hủy trong lúc chờ
            if (result) {
                dispatch(successAction(result));
                return result;
            } else {
                // Nếu API trả về null mà không phải do lỗi (ví dụ: not found nhưng API xử lý trả về null)
                // thì cần xem xét có nên dispatch failure hay không. Hiện tại, dựa vào throw error.
                // Nếu API tự throw error, nó sẽ được bắt ở catch block.
                // Nếu API trả về null một cách "hợp lệ", successAction có thể cần xử lý null.
            }
        } catch (error: any) {
            if (!currentController.signal.aborted) {
                const errorMessage = error.message || "Đã có lỗi xảy ra.";
                dispatch({
                    type: failureActionType,
                    payload: failurePayload ? { ...failurePayload, error: errorMessage } : errorMessage
                } as CommentAction);
            }
        }
        return null;
    }, [dispatch]);


    //------------------------------------------------------
    // Lấy danh sách bình luận gốc (root comments)
    //------------------------------------------------------
    const fetchRootComments = useCallback(
        async (page = 1, pageSize = 10, term?: string) => {
            // Hủy controller cũ và tạo mới cho request này để tránh race condition nếu fetch nhanh liên tiếp
            if (!targetId) {
                return;
            }
            abortControllerRef.current?.abort();
            abortControllerRef.current = new AbortController();

            await callApi(
                (signal) => fetchRootCommentList(targetType, targetId, signal, page, pageSize, term, ["createdAt"], ["desc"], true),
                CommentActionType.FETCH_ROOT_COMMENTS_START,
                (payload: CommentPage) => ({ type: CommentActionType.FETCH_ROOT_COMMENTS_SUCCESS, payload: { comments: payload.result, meta: payload.meta } }),
                CommentActionType.FETCH_ROOT_COMMENTS_FAILURE
            );
        },
        [targetType, targetId, callApi]
    );

    //------------------------------------------------------
    // Lấy danh sách phản hồi (replies)
    //------------------------------------------------------
    const fetchReplies = useCallback(
        async (parentId: string, page = 1, pageSize = 5) => {
            // Không hủy controller chung ở đây, vì có thể fetch nhiều replies song song
            //const localController = new AbortController(); // Controller riêng cho từng fetch replies
            await callApi(
                (signal) => fetchRepliesList(targetType, targetId, parentId, signal, page, pageSize, undefined, ["createdAt"], ["asc"], undefined),
                CommentActionType.FETCH_REPLIES_START,
                (payload: CommentPage) => ({ type: CommentActionType.FETCH_REPLIES_SUCCESS, payload: { parentId, replies: payload.result, meta: payload.meta } }),
                CommentActionType.FETCH_REPLIES_FAILURE,
                { parentId } // payload cho failure action
            );
            // Không có cleanup cho localController ở đây vì callApi không quản lý nó trực tiếp,
            // nhưng signal của nó được truyền vào. Nếu component unmount, useEffect chính sẽ abort.
        },
        [targetType, targetId, callApi]
    );

    //------------------------------------------------------
    // Tạo bình luận mới
    //------------------------------------------------------
    const addComment = useCallback(
        async (text: string, mentionedUserIds: string[] = [], parentCommentId?: string) => {
            const newCommentData: CreateCommentRequest = {
                targetType,
                targetId,
                content: text,
                mentionedUserIds,
                parentId: parentCommentId,
            };
            // Không hủy controller chung, cho phép tạo comment trong khi đang tải
            await callApi(
                (signal) => createComment(newCommentData, signal), // Giả sử apiCreateComment chấp nhận signal
                CommentActionType.CREATE_COMMENT_START,
                (payload: Comment_t) => ({ type: CommentActionType.CREATE_COMMENT_SUCCESS, payload }),
                CommentActionType.CREATE_COMMENT_FAILURE
            );
        },
        [targetType, targetId, callApi]
    );

    //------------------------------------------------------
    // Xóa bình luận
    //------------------------------------------------------
    const deleteComment = useCallback(
        async (commentId: string, parentId?: string | null, reason: DeleteReason = DeleteReason.USER_DELETE) => {
            const deleteRequest: DeleteCommentRequest = { reasonTag: "USER_DELETE", reason };
            // Không hủy controller chung
            await callApi(
                (signal) => deleteOneComment(commentId, deleteRequest, signal), // Giả sử apiDeleteComment chấp nhận signal
                CommentActionType.DELETE_COMMENT_START,
                // API delete thường trả về comment đã xóa hoặc null/confirm.
                // Reducer cần commentId và parentId để xóa khỏi state.
                // Nếu API trả về Comment_t đã xóa, có thể dùng nó. Nếu không, chỉ cần xác nhận.
                // Giả sử API trả về Comment_t (hoặc 1 object có id) sau khi xóa thành công
                (_payload: Comment_t | null) => ({ type: CommentActionType.DELETE_COMMENT_SUCCESS, payload: { commentId, parentId } }),
                CommentActionType.DELETE_COMMENT_FAILURE,
                { commentId }
            );
        },
        [callApi]
    );

    //------------------------------------------------------
    // Thích hoặc bỏ thích bình luận
    //------------------------------------------------------
    const toggleLike = useCallback(
        async (commentId: string) => {
            // Không hủy controller chung
            await callApi(
                (signal) => toggleOneLike(commentId, signal), // Giả sử apiToggleLike chấp nhận signal
                CommentActionType.TOGGLE_LIKE_START,
                (payload: Comment_t) => ({ type: CommentActionType.TOGGLE_LIKE_SUCCESS, payload }),
                CommentActionType.TOGGLE_LIKE_FAILURE,
                { commentId }
            );
        },
        [callApi]
    );

    //------------------------------------------------------
    // Cập nhật danh sách gợi ý cho @Mention
    // Dựa trên các user đã bình luận (root và replies)
    //------------------------------------------------------
    useEffect(() => {
        const usersInComments = new Map<string, { id: string; name: string; avatar?: string }>();

        const addUser = (comment: Comment_t) => {
            if (!usersInComments.has(comment.userId) && comment.userDisplayName) {
                usersInComments.set(comment.userId, {
                    id: comment.userId,
                    name: comment.userDisplayName, // Đây là tên để hiển thị trong mention
                    avatar: comment.userAvatarUrl,
                });
            }
        };

        state.rootComments.forEach(addUser);
        Object.values(state.repliesByParentId).flat().forEach(addUser);

        // Thêm người dùng hiện tại vào danh sách mention nếu họ chưa có ở đó
        // (hữu ích nếu họ muốn @mention chính mình hoặc nếu chưa có comment nào)
        //const currentUserId = getCurrentUserId();
        // const currentUserDisplayName = getCurrentUserDisplayName(); // Bạn cần hàm này từ utils
        // if (currentUserId && currentUserDisplayName && !usersInComments.has(currentUserId)) {
        //   usersInComments.set(currentUserId, { id: currentUserId, name: currentUserDisplayName });
        // }

        dispatch({
            type: CommentActionType.SET_MENTION_SUGGESTIONS,
            payload: Array.from(usersInComments.values()),
        });
    }, [state.rootComments, state.repliesByParentId, dispatch]);


    //------------------------------------------------------
    // Các hàm xử lý UI đơn giản (dispatch trực tiếp)
    //------------------------------------------------------
    const setActiveReplyForm = useCallback(
        (parentId: string | null) => {
            dispatch({ type: CommentActionType.SET_ACTIVE_REPLY_FORM, payload: parentId });
        },
        [dispatch]
    );

    const toggleRepliesVisibility = useCallback(
        (parentId: string | null) => {
            dispatch({ type: CommentActionType.TOGGLE_REPLIES_VISIBILITY, payload: parentId });
            // Nếu đang mở replies cho một comment, và chưa có replies nào được tải, thì tải chúng
            if (parentId && !state.repliesByParentId[parentId]?.length && !state.isLoadingReplies[parentId]) {
                fetchReplies(parentId);
            }
        },
        [dispatch, state.repliesByParentId, state.isLoadingReplies, fetchReplies] // Thêm fetchReplies vào dependencies
    );

    const clearError = useCallback(() => {
        dispatch({ type: CommentActionType.CLEAR_ERROR });
    }, [dispatch]);


    const openReportDialog = useCallback((commentToReport: Comment_t) => {
        // Pick only necessary fields to avoid passing a large object if not needed
        // Ensure 'userId' is included if your dialog or logic needs it for any checks
        dispatch({
            type: CommentActionType.OPEN_REPORT_DIALOG,
            payload: {
                id: commentToReport.id,
                content: commentToReport.content,
                userDisplayName: commentToReport.userDisplayName,
                userId: commentToReport.userId, // Important for any checks
            }
        });
    }, [dispatch]);

    const closeReportDialog = useCallback(() => {
        dispatch({ type: CommentActionType.CLOSE_REPORT_DIALOG });
    }, [dispatch]);

    const handleSubmitReportWithToast = useCallback(async (

        payload: CreateCommentReportPayload
    ): Promise<boolean> => { // Returns true for success, false for failure to let dialog know
        dispatch({ type: CommentActionType.SUBMIT_COMMENT_REPORT_START });
        try {
            const report = await submitCommentReport(payload,);
            dispatch({ type: CommentActionType.SUBMIT_COMMENT_REPORT_SUCCESS, payload: { report } });
            toast?.current?.show({ severity: 'success', summary: 'Đã gửi', detail: 'Báo cáo của bạn đã được gửi thành công.' });
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Lỗi không xác định khi gửi báo cáo.";
            dispatch({ type: CommentActionType.SUBMIT_COMMENT_REPORT_FAILURE, payload: errorMessage });
            toast?.current?.show({ severity: 'error', summary: 'Lỗi', detail: errorMessage });
            return false;
        }
    }, [dispatch /*, callApi if you adapt it for this, toast (if used here) */]);

    const clearReportSubmitStatus = useCallback(() => {
        dispatch({ type: CommentActionType.CLEAR_REPORT_SUBMIT_STATUS });
    }, [dispatch]);


    //------------------------------------------------------
    // Giá trị trả về từ Hook
    //------------------------------------------------------
    return {
        state,
        fetchRootComments,
        fetchReplies,
        addComment,
        deleteComment,
        toggleLike,
        setActiveReplyForm,
        toggleRepliesVisibility,
        clearError,
        currentUserId: getCurrentUserId(), // Trả về userId hiện tại để component dễ dàng sử dụng
        openReportDialog,
        closeReportDialog,
        handleSubmitReportWithToast,
        clearReportSubmitStatus,
    };
};