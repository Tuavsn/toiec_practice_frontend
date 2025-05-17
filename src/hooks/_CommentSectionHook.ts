// Filename: src/features/comments/useCommentSection.ts (Conceptual part 1: State, Actions, InitialState)

import { Comment_t, Meta } from "../utils/types/type";

//------------------------------------------------------
// Định nghĩa cấu trúc State cho khu vực bình luận
//------------------------------------------------------
export interface CommentSectionState {
  rootComments: Comment_t[];
  repliesByParentId: Record<string, Comment_t[]>; // Key là parentId, value là danh sách replies
  meta: Meta | null; // Metadata cho root comments
  replyMetaByParentId: Record<string, Meta | null>; // Metadata cho replies của từng comment cha

  // Trạng thái tải dữ liệu
  isLoadingRootComments: boolean;
  isLoadingReplies: Record<string, boolean>; // Key là parentId, true nếu đang tải replies cho comment đó
  isCreatingComment: boolean;
  isDeletingComment: Record<string, boolean>; // Key là commentId
  isTogglingLike: Record<string, boolean>; // Key là commentId

  // Quản lý lỗi
  error: string | null;

  // Gợi ý cho Mention
  mentionSuggestions: Array<{ id: string; name: string; avatar?: string }>; // id là userId, name là userDisplayName

  // ID của comment cha đang mở form trả lời
  activeReplyParentId: string | null;
  // ID của comment cha đang hiển thị danh sách trả lời
  visibleRepliesParentId: string | null;
}

//------------------------------------------------------
// Định nghĩa các loại Action
//------------------------------------------------------
export enum CommentActionType {
  // Tải root comments
  FETCH_ROOT_COMMENTS_START = "FETCH_ROOT_COMMENTS_START",
  FETCH_ROOT_COMMENTS_SUCCESS = "FETCH_ROOT_COMMENTS_SUCCESS",
  FETCH_ROOT_COMMENTS_FAILURE = "FETCH_ROOT_COMMENTS_FAILURE",

  // Tải replies
  FETCH_REPLIES_START = "FETCH_REPLIES_START",
  FETCH_REPLIES_SUCCESS = "FETCH_REPLIES_SUCCESS",
  FETCH_REPLIES_FAILURE = "FETCH_REPLIES_FAILURE",

  // Tạo comment
  CREATE_COMMENT_START = "CREATE_COMMENT_START",
  CREATE_COMMENT_SUCCESS = "CREATE_COMMENT_SUCCESS",
  CREATE_COMMENT_FAILURE = "CREATE_COMMENT_FAILURE",

  // Xóa comment
  DELETE_COMMENT_START = "DELETE_COMMENT_START",
  DELETE_COMMENT_SUCCESS = "DELETE_COMMENT_SUCCESS",
  DELETE_COMMENT_FAILURE = "DELETE_COMMENT_FAILURE",

  // Toggle like
  TOGGLE_LIKE_START = "TOGGLE_LIKE_START",
  TOGGLE_LIKE_SUCCESS = "TOGGLE_LIKE_SUCCESS",
  TOGGLE_LIKE_FAILURE = "TOGGLE_LIKE_FAILURE",

  // Cập nhật danh sách gợi ý mention
  SET_MENTION_SUGGESTIONS = "SET_MENTION_SUGGESTIONS",

  // Đặt form trả lời đang hoạt động
  SET_ACTIVE_REPLY_FORM = "SET_ACTIVE_REPLY_FORM",
  // Đóng/mở danh sách trả lời
  TOGGLE_REPLIES_VISIBILITY = "TOGGLE_REPLIES_VISIBILITY",

  // Xóa lỗi
  CLEAR_ERROR = "CLEAR_ERROR",
}

//------------------------------------------------------
// Định nghĩa kiểu cho các Action (sử dụng discriminated union)
//------------------------------------------------------
export type CommentAction =
  // Root Comments
  | { type: CommentActionType.FETCH_ROOT_COMMENTS_START }
  | { type: CommentActionType.FETCH_ROOT_COMMENTS_SUCCESS; payload: { comments: Comment_t[]; meta: Meta } }
  | { type: CommentActionType.FETCH_ROOT_COMMENTS_FAILURE; payload: string }
  // Replies
  | { type: CommentActionType.FETCH_REPLIES_START; payload: { parentId: string } }
  | { type: CommentActionType.FETCH_REPLIES_SUCCESS; payload: { parentId: string; replies: Comment_t[]; meta: Meta } }
  | { type: CommentActionType.FETCH_REPLIES_FAILURE; payload: { parentId: string; error: string } }
  // Create Comment
  | { type: CommentActionType.CREATE_COMMENT_START }
  | { type: CommentActionType.CREATE_COMMENT_SUCCESS; payload: Comment_t }
  | { type: CommentActionType.CREATE_COMMENT_FAILURE; payload: string }
  // Delete Comment
  | { type: CommentActionType.DELETE_COMMENT_START; payload: { commentId: string } }
  | { type: CommentActionType.DELETE_COMMENT_SUCCESS; payload: { commentId: string; parentId?: string | null } } // parentId để biết cập nhật list nào
  | { type: CommentActionType.DELETE_COMMENT_FAILURE; payload: { commentId: string; error: string } }
  // Toggle Like
  | { type: CommentActionType.TOGGLE_LIKE_START; payload: { commentId: string } }
  | { type: CommentActionType.TOGGLE_LIKE_SUCCESS; payload: Comment_t }
  | { type: CommentActionType.TOGGLE_LIKE_FAILURE; payload: { commentId: string; error: string } }
  // Mentions
  | { type: CommentActionType.SET_MENTION_SUGGESTIONS; payload: Array<{ id: string; name: string; avatar?: string }> }
  // UI State
  | { type: CommentActionType.SET_ACTIVE_REPLY_FORM; payload: string | null }
  | { type: CommentActionType.TOGGLE_REPLIES_VISIBILITY; payload: string | null } // null để đóng tất cả
  | { type: CommentActionType.CLEAR_ERROR };

//------------------------------------------------------
// Trạng thái khởi tạo cho reducer
//------------------------------------------------------
export const initialCommentSectionState: CommentSectionState = {
  rootComments: [],
  repliesByParentId: {},
  meta: null,
  replyMetaByParentId: {},
  isLoadingRootComments: false,
  isLoadingReplies: {},
  isCreatingComment: false,
  isDeletingComment: {},
  isTogglingLike: {},
  error: null,
  mentionSuggestions: [],
  activeReplyParentId: null,
  visibleRepliesParentId: null,
};