// Filename: src/features/comments/commentReducer.ts

import { Comment_t } from "../utils/types/type";
import { CommentAction, CommentActionType, CommentSectionState } from "./_CommentSectionHook";


//------------------------------------------------------
// Reducer cho quản lý trạng thái khu vực bình luận
//------------------------------------------------------
export const commentReducer = (
  state: CommentSectionState,
  action: CommentAction,
): CommentSectionState => {
  switch (action.type) {
    //----------------------------------
    // Tải Root Comments
    //----------------------------------
    case CommentActionType.FETCH_ROOT_COMMENTS_START:
      return {
        ...state,
        isLoadingRootComments: true,
        error: null,
      };
    case CommentActionType.FETCH_ROOT_COMMENTS_SUCCESS:
      return {
        ...state,
        isLoadingRootComments: false,
        rootComments: action.payload.comments,
        meta: action.payload.meta,
      };
    case CommentActionType.FETCH_ROOT_COMMENTS_FAILURE:
      return {
        ...state,
        isLoadingRootComments: false,
        error: action.payload,
      };

    //----------------------------------
    // Tải Replies
    //----------------------------------
    case CommentActionType.FETCH_REPLIES_START:
      return {
        ...state,
        isLoadingReplies: {
          ...state.isLoadingReplies,
          [action.payload.parentId]: true,
        },
        error: null, // Xóa lỗi cục bộ cho replies này
      };
    case CommentActionType.FETCH_REPLIES_SUCCESS: {
      // Cập nhật directReplyCount cho comment cha
      const updatedRootComments = state.rootComments.map(comment =>
        comment.id === action.payload.parentId
          ? { ...comment, directReplyCount: action.payload.replies.length } // Hoặc action.payload.meta.totalItems nếu API trả về tổng số reply chính xác
          : comment
      );
      return {
        ...state,
        isLoadingReplies: {
          ...state.isLoadingReplies,
          [action.payload.parentId]: false,
        },
        repliesByParentId: {
          ...state.repliesByParentId,
          [action.payload.parentId]: action.payload.replies,
        },
        replyMetaByParentId: {
          ...state.replyMetaByParentId,
          [action.payload.parentId]: action.payload.meta,
        },
        rootComments: updatedRootComments, // Cập nhật rootComments với directReplyCount mới
      };
    }
    case CommentActionType.FETCH_REPLIES_FAILURE:
      return {
        ...state,
        isLoadingReplies: {
          ...state.isLoadingReplies,
          [action.payload.parentId]: false,
        },
        error: action.payload.error, // Hoặc có thể lưu lỗi theo parentId: errorByParentId: { ...state.errorByParentId, [action.payload.parentId]: action.payload.error }
      };

    //----------------------------------
    // Tạo Comment
    //----------------------------------
    case CommentActionType.CREATE_COMMENT_START:
      return {
        ...state,
        isCreatingComment: true,
        error: null,
      };
    case CommentActionType.CREATE_COMMENT_SUCCESS: {
      const newComment = action.payload;
      let newRootComments = state.rootComments;
      let newRepliesByParentId = state.repliesByParentId;

      if (newComment.parentId) {
        // Đây là một reply
        const parentReplies = state.repliesByParentId[newComment.parentId] || [];
        newRepliesByParentId = {
          ...state.repliesByParentId,
          [newComment.parentId]: [...parentReplies, newComment],
        };
        // Cập nhật directReplyCount cho comment cha
        newRootComments = state.rootComments.map(comment =>
          comment.id === newComment.parentId
            ? { ...comment, directReplyCount: (comment.directReplyCount || 0) + 1 }
            : comment
        );
      } else {
        // Đây là một root comment
        newRootComments = [newComment, ...state.rootComments]; // Thêm vào đầu danh sách
      }
      return {
        ...state,
        isCreatingComment: false,
        rootComments: newRootComments,
        repliesByParentId: newRepliesByParentId,
        activeReplyParentId: null, // Đóng form reply sau khi gửi thành công
      };
    }
    case CommentActionType.CREATE_COMMENT_FAILURE:
      return {
        ...state,
        isCreatingComment: false,
        error: action.payload,
      };

    //----------------------------------
    // Xóa Comment
    //----------------------------------
    case CommentActionType.DELETE_COMMENT_START:
      return {
        ...state,
        isDeletingComment: {
          ...state.isDeletingComment,
          [action.payload.commentId]: true,
        },
        error: null,
      };
    case CommentActionType.DELETE_COMMENT_SUCCESS: {
      const { commentId, parentId } = action.payload;
      let newRootComments = state.rootComments;
      let newRepliesByParentId = state.repliesByParentId;

      if (parentId) {
        // Xóa một reply
        const parentReplies = state.repliesByParentId[parentId] || [];
        newRepliesByParentId = {
          ...state.repliesByParentId,
          [parentId]: parentReplies.filter(reply => reply.id !== commentId),
        };
        // Cập nhật directReplyCount cho comment cha
        newRootComments = state.rootComments.map(comment =>
          comment.id === parentId
            ? { ...comment, directReplyCount: Math.max(0, (comment.directReplyCount || 0) - 1) }
            : comment
        );
      } else {
        // Xóa một root comment
        newRootComments = state.rootComments.filter(comment => comment.id !== commentId);
        // Nếu root comment bị xóa, cũng xóa các replies của nó (nếu có)
        if (state.repliesByParentId[commentId]) {
            const { [commentId]: _deletedReplies, ...remainingReplies } = state.repliesByParentId;
            newRepliesByParentId = remainingReplies;
        }
      }
      return {
        ...state,
        isDeletingComment: {
          ...state.isDeletingComment,
          [commentId]: false,
        },
        rootComments: newRootComments,
        repliesByParentId: newRepliesByParentId,
      };
    }
    case CommentActionType.DELETE_COMMENT_FAILURE:
      return {
        ...state,
        isDeletingComment: {
          ...state.isDeletingComment,
          [action.payload.commentId]: false,
        },
        error: action.payload.error,
      };

    //----------------------------------
    // Toggle Like
    //----------------------------------
    case CommentActionType.TOGGLE_LIKE_START:
      return {
        ...state,
        isTogglingLike: {
          ...state.isTogglingLike,
          [action.payload.commentId]: true,
        },
      };
    case CommentActionType.TOGGLE_LIKE_SUCCESS: {
      const updatedComment = action.payload;
      const updateCommentList = (list: Comment_t[]) =>
        list.map(c => (c.id === updatedComment.id ? updatedComment : c));

      let newRootComments = state.rootComments;
      let newRepliesByParentId = state.repliesByParentId;

      // Kiểm tra xem comment được like có trong rootComments không
      if (state.rootComments.some(c => c.id === updatedComment.id)) {
          newRootComments = updateCommentList(state.rootComments);
      }
      // Kiểm tra xem comment được like có trong repliesByParentId không
      if (updatedComment.parentId && state.repliesByParentId[updatedComment.parentId]) {
        newRepliesByParentId = {
            ...state.repliesByParentId,
            [updatedComment.parentId]: updateCommentList(state.repliesByParentId[updatedComment.parentId]),
        };
      } else {
        // Xử lý trường hợp comment có parentId nhưng không tìm thấy trong repliesByParentId
        // Hoặc comment không có parentId nhưng cũng không có trong rootComments (trường hợp hiếm)
        // Tìm trong tất cả các list replies nếu không có parentId rõ ràng (ít khả năng xảy ra với cấu trúc hiện tại)
        for (const parentKey in state.repliesByParentId) {
            if (state.repliesByParentId[parentKey].some(c => c.id === updatedComment.id)) {
                newRepliesByParentId = {
                    ...state.repliesByParentId,
                    [parentKey]: updateCommentList(state.repliesByParentId[parentKey]),
                };
                break;
            }
        }
      }

      return {
        ...state,
        isTogglingLike: {
          ...state.isTogglingLike,
          [updatedComment.id]: false,
        },
        rootComments: newRootComments,
        repliesByParentId: newRepliesByParentId,
      };
    }
    case CommentActionType.TOGGLE_LIKE_FAILURE:
      return {
        ...state,
        isTogglingLike: {
          ...state.isTogglingLike,
          [action.payload.commentId]: false,
        },
        error: action.payload.error,
      };

    //----------------------------------
    // Gợi ý Mention
    //----------------------------------
    case CommentActionType.SET_MENTION_SUGGESTIONS:
      return {
        ...state,
        mentionSuggestions: action.payload,
      };

    //----------------------------------
    // Trạng thái UI
    //----------------------------------
    case CommentActionType.SET_ACTIVE_REPLY_FORM:
      // Nếu click vào nút reply của comment đang mở form, thì đóng form lại
      if (state.activeReplyParentId === action.payload) {
        return { ...state, activeReplyParentId: null };
      }
      // Ngược lại, mở form cho comment được click và đóng form của comment khác (nếu có)
      return {
        ...state,
        activeReplyParentId: action.payload,
        // Nếu mở form reply, cũng nên đảm bảo replies của nó được hiển thị (nếu chưa)
        // visibleRepliesParentId: action.payload ? (state.visibleRepliesParentId === action.payload ? state.visibleRepliesParentId : action.payload) : state.visibleRepliesParentId,
      };

    case CommentActionType.TOGGLE_REPLIES_VISIBILITY: {
      const parentIdToToggle = action.payload;
      // Nếu payload là null, ẩn tất cả replies
      if (parentIdToToggle === null) {
        return { ...state, visibleRepliesParentId: null };
      }
      // Nếu click vào comment đang hiển thị replies, thì ẩn nó đi
      if (state.visibleRepliesParentId === parentIdToToggle) {
        return { ...state, visibleRepliesParentId: null, activeReplyParentId: null }; // Cũng đóng form reply nếu có
      }
      // Ngược lại, hiển thị replies cho comment này và ẩn của comment khác (nếu có)
      return {
        ...state,
        visibleRepliesParentId: parentIdToToggle,
        activeReplyParentId: null, // Đóng form reply khi chuyển đổi hiển thị replies
      };
    }

    case CommentActionType.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      // TypeScript sẽ cảnh báo nếu chúng ta quên xử lý một action nào đó nhờ vào `never` type trick (nếu action là never)
      // const _exhaustiveCheck: never = action;
      return state;
  }
};