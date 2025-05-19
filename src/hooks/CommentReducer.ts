// Filename: src/features/comments/CommentReducer.ts

import { CommentAction } from "../utils/types/action";
import { CommentSectionState } from "../utils/types/state";
import { CommentActionType } from "./_CommentSectionHook";

//------------------------------------------------------
// Reducer cho quản lý trạng thái khu vực bình luận
// (Reducer for managing comment section state)
//------------------------------------------------------
export const commentReducer = (
  state: CommentSectionState,
  action: CommentAction,
): CommentSectionState => {
  // console.log("REDUCER: Action received - ", action.type, action.payload); // General log for all actions

  switch (action.type) {
    //----------------------------------
    // Tải Bình Luận Gốc (Fetch Root Comments)
    //----------------------------------
    case CommentActionType.FETCH_ROOT_COMMENTS_START:
      console.log("REDUCER: FETCH_ROOT_COMMENTS_START");
      return {
        ...state,
        isLoadingRootComments: true,
        error: null, // Clear previous general errors
      };
    case CommentActionType.FETCH_ROOT_COMMENTS_SUCCESS:
      console.log("REDUCER: FETCH_ROOT_COMMENTS_SUCCESS - Raw Payload:", action.payload);
      console.log("REDUCER: FETCH_ROOT_COMMENTS_SUCCESS - Current rootComments count before update:", state.rootComments.length);
      // Ensure payload and its nested properties are valid before spreading
      const newRootComments = action.payload?.comments || [];
      const newMeta = action.payload?.meta || null;
      const newStateAfterRootSuccess = {
        ...state,
        isLoadingRootComments: false,
        rootComments: newRootComments,
        meta: newMeta,
        error: null,
      };
      console.log("REDUCER: FETCH_ROOT_COMMENTS_SUCCESS - New rootComments count after update:", newStateAfterRootSuccess.rootComments.length);
      if (newRootComments.length > 0) {
        console.log("REDUCER: FETCH_ROOT_COMMENTS_SUCCESS - First new comment:", newRootComments[0]);
      }
      return newStateAfterRootSuccess;
    case CommentActionType.FETCH_ROOT_COMMENTS_FAILURE:
      console.error("REDUCER: FETCH_ROOT_COMMENTS_FAILURE - Payload:", action.payload);
      return {
        ...state,
        isLoadingRootComments: false,
        error: action.payload, // Payload is the error message string
      };

    //----------------------------------
    // Tải Phản Hồi (Fetch Replies)
    //----------------------------------
    case CommentActionType.FETCH_REPLIES_START:
      // console.log("REDUCER: FETCH_REPLIES_START - Parent ID:", action.payload.parentId);
      return {
        ...state,
        isLoadingReplies: {
          ...state.isLoadingReplies,
          [action.payload.parentId]: true,
        },
        // Do not clear general error here, as this is a specific reply load
      };
    case CommentActionType.FETCH_REPLIES_SUCCESS:
      // console.log("REDUCER: FETCH_REPLIES_SUCCESS - Parent ID:", action.payload.parentId, "Replies count:", action.payload.replies.length);
      // Update directReplyCount for the parent comment if it's a root comment
      const updatedRootCommentsForReplyCount = state.rootComments.map(comment =>
        comment.id === action.payload.parentId
          ? { ...comment, directReplyCount: action.payload.meta?.totalItems || action.payload.replies.length }
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
        rootComments: updatedRootCommentsForReplyCount,
      };
    case CommentActionType.FETCH_REPLIES_FAILURE:
      // console.error("REDUCER: FETCH_REPLIES_FAILURE - Parent ID:", action.payload.parentId, "Error:", action.payload.error);
      return {
        ...state,
        isLoadingReplies: {
          ...state.isLoadingReplies,
          [action.payload.parentId]: false,
        },
        // Potentially set a specific error for this reply loading, or use general error
        error: `Lỗi tải phản hồi cho ${action.payload.parentId}: ${action.payload.error}`,
      };

    //----------------------------------
    // Tạo Bình Luận (Create Comment)
    //----------------------------------
    case CommentActionType.CREATE_COMMENT_START:
      return {
        ...state,
        isCreatingComment: true,
        error: null, // Clear error before attempting to create
      };
    case CommentActionType.CREATE_COMMENT_SUCCESS: {
      const newComment = action.payload;
      let newRootCommentsList = state.rootComments;
      let newRepliesMap = { ...state.repliesByParentId }; // Ensure new map for immutability

      if (newComment.parentId) { // It's a reply
        const parentReplies = state.repliesByParentId[newComment.parentId] || [];
        newRepliesMap[newComment.parentId] = [newComment, ...parentReplies]; // Add new reply to the beginning

        // Update directReplyCount of the parent comment in rootComments
        newRootCommentsList = state.rootComments.map(comment =>
          comment.id === newComment.parentId
            ? { ...comment, directReplyCount: (comment.directReplyCount || 0) + 1 }
            : comment
        );
      } else { // It's a new root comment
        newRootCommentsList = [newComment, ...state.rootComments]; // Add to the beginning of root comments
      }
      return {
        ...state,
        isCreatingComment: false,
        rootComments: newRootCommentsList,
        repliesByParentId: newRepliesMap,
        activeReplyParentId: null, // Close reply form after successful submission
      };
    }
    case CommentActionType.CREATE_COMMENT_FAILURE:
      return {
        ...state,
        isCreatingComment: false,
        error: action.payload, // Payload is the error message string
      };

    //----------------------------------
    // Xóa Bình Luận (Delete Comment)
    //----------------------------------
    case CommentActionType.DELETE_COMMENT_START:
      return {
        ...state,
        isDeletingComment: {
          ...state.isDeletingComment,
          [action.payload.commentId]: true,
        },
      };
    case CommentActionType.DELETE_COMMENT_SUCCESS: {
      const { commentId, parentId } = action.payload;
      let updatedRootComments = state.rootComments;
      let updatedRepliesByParentId = { ...state.repliesByParentId };

      if (parentId) { // Deleting a reply
        const parentReplies = state.repliesByParentId[parentId] || [];
        updatedRepliesByParentId[parentId] = parentReplies.filter(reply => reply.id !== commentId);
        // Update directReplyCount of the parent
        updatedRootComments = state.rootComments.map(comment =>
          comment.id === parentId
            ? { ...comment, directReplyCount: Math.max(0, (comment.directReplyCount || 1) - 1) }
            : comment
        );
      } else { // Deleting a root comment
        updatedRootComments = state.rootComments.filter(comment => comment.id !== commentId);
        // Also remove its replies from the map if they exist
        if (updatedRepliesByParentId[commentId]) {
          delete updatedRepliesByParentId[commentId];
        }
      }
      // Create a new object for isDeletingComment to ensure immutability if needed, though deleting a key is fine for this pattern
      const newIsDeletingComment = { ...state.isDeletingComment };
      delete newIsDeletingComment[commentId];

      return {
        ...state,
        isDeletingComment: newIsDeletingComment,
        rootComments: updatedRootComments,
        repliesByParentId: updatedRepliesByParentId,
      };
    }
    case CommentActionType.DELETE_COMMENT_FAILURE:
      const newIsDeletingCommentFailure = { ...state.isDeletingComment };
      delete newIsDeletingCommentFailure[action.payload.commentId];
      return {
        ...state,
        isDeletingComment: newIsDeletingCommentFailure,
        error: action.payload.error,
      };

    //----------------------------------
    // Thích/Bỏ Thích (Toggle Like)
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
      const likedComment = action.payload;
      const updateCommentInList = (list: any[]) => // Using any[] for Comment_t for brevity here
        list.map(c => (c.id === likedComment.id ? likedComment : c));

      let newRootCommentsAfterLike = state.rootComments;
      let newRepliesMapAfterLike = { ...state.repliesByParentId };

      if (state.rootComments.some(c => c.id === likedComment.id)) {
        newRootCommentsAfterLike = updateCommentInList(state.rootComments);
      } else {
        for (const pid in state.repliesByParentId) {
          if (state.repliesByParentId[pid].some(reply => reply.id === likedComment.id)) {
            newRepliesMapAfterLike[pid] = updateCommentInList(state.repliesByParentId[pid]);
            break;
          }
        }
      }
      const newIsTogglingLike = { ...state.isTogglingLike };
      delete newIsTogglingLike[likedComment.id];

      return {
        ...state,
        isTogglingLike: newIsTogglingLike,
        rootComments: newRootCommentsAfterLike,
        repliesByParentId: newRepliesMapAfterLike,
      };
    }
    case CommentActionType.TOGGLE_LIKE_FAILURE:
      const newIsTogglingLikeFailure = { ...state.isTogglingLike };
      delete newIsTogglingLikeFailure[action.payload.commentId];
      return {
        ...state,
        isTogglingLike: newIsTogglingLikeFailure,
        error: action.payload.error,
      };

    //----------------------------------
    // Gợi Ý Mention (Mention Suggestions)
    //----------------------------------
    case CommentActionType.SET_MENTION_SUGGESTIONS:
      return {
        ...state,
        mentionSuggestions: action.payload,
      };

    //----------------------------------
    // Trạng Thái UI (UI State - Forms, Visibility)
    //----------------------------------
    case CommentActionType.SET_ACTIVE_REPLY_FORM:
      return {
        ...state,
        // Toggle: if clicking the same parent's reply button, close it. Otherwise, open for new parent.
        activeReplyParentId: state.activeReplyParentId === action.payload ? null : action.payload,
      };
    case CommentActionType.TOGGLE_REPLIES_VISIBILITY: {
      const parentIdToToggle = action.payload;
      // If payload is null, hide all replies and active forms
      if (parentIdToToggle === null) {
          return { ...state, visibleRepliesParentId: null, activeReplyParentId: null };
      }
      // If clicking the same parent that's already visible, hide its replies and any active form
      if (state.visibleRepliesParentId === parentIdToToggle) {
          return { ...state, visibleRepliesParentId: null, activeReplyParentId: null };
      }
      // Otherwise, show replies for this parent and hide others/active forms
      return { ...state, visibleRepliesParentId: parentIdToToggle, activeReplyParentId: null };
    }

    case CommentActionType.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    //----------------------------------
    // Báo Cáo Bình Luận (Report Comment Flow)
    //----------------------------------
    case CommentActionType.OPEN_REPORT_DIALOG:
      return {
        ...state,
        isReportDialogVisible: true,
        commentForReporting: action.payload, // Payload is Pick<Comment_t, 'id' | 'content' | 'userDisplayName' | 'userId'>
        reportSubmitError: null, // Clear previous report errors
      };
    case CommentActionType.CLOSE_REPORT_DIALOG:
      return {
        ...state,
        isReportDialogVisible: false,
        commentForReporting: null,
        isSubmittingReport: false, // Reset submitting state if dialog is closed manually
        // Keep reportSubmitError so user can see it if dialog reopens, unless explicitly cleared
      };
    case CommentActionType.SUBMIT_COMMENT_REPORT_START:
      return {
        ...state,
        isSubmittingReport: true,
        reportSubmitError: null,
      };
    case CommentActionType.SUBMIT_COMMENT_REPORT_SUCCESS:
      // action.payload is { report: CommentReport_t; message?: string }
      return {
        ...state,
        isSubmittingReport: false,
        isReportDialogVisible: false, // Close dialog on successful report
        commentForReporting: null,    // Clear the reported comment
        reportSubmitError: null,
        // Optional: Could set a success message in state if needed by UI beyond a toast
        // reportSubmitSuccessMessage: action.payload.message || "Báo cáo đã được gửi thành công.",
      };
    case CommentActionType.SUBMIT_COMMENT_REPORT_FAILURE:
      // action.payload is error string
      return {
        ...state,
        isSubmittingReport: false,
        reportSubmitError: action.payload,
        // Dialog might stay open to show the error within it, or CommentSection can show a toast
      };
    case CommentActionType.CLEAR_REPORT_SUBMIT_STATUS:
        return {
            ...state,
            reportSubmitError: null,
            // reportSubmitSuccessMessage: null, // If you were using this
        };

    default:
      // Optional: Log unhandled actions if any for debugging
      // const _exhaustiveCheck: never = action; // For compile-time check if all actions are handled
      // console.warn("REDUCER: Unhandled action type -", (action as any).type);
      return state;
  }
};