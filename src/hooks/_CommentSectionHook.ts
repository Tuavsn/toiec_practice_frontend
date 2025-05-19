// Filename: src/features/comments/useCommentSection.ts (Conceptual part 1: State, Actions, InitialState)


//------------------------------------------------------
// Định nghĩa cấu trúc State cho khu vực bình luận
//------------------------------------------------------


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
  OPEN_REPORT_DIALOG = "OPEN_REPORT_DIALOG",
  CLOSE_REPORT_DIALOG = "CLOSE_REPORT_DIALOG",
  SUBMIT_COMMENT_REPORT_START = "SUBMIT_COMMENT_REPORT_START",
  SUBMIT_COMMENT_REPORT_SUCCESS = "SUBMIT_COMMENT_REPORT_SUCCESS",
  SUBMIT_COMMENT_REPORT_FAILURE = "SUBMIT_COMMENT_REPORT_FAILURE",
  CLEAR_REPORT_SUBMIT_STATUS = "CLEAR_REPORT_SUBMIT_STATUS",
}

//------------------------------------------------------
// Định nghĩa kiểu cho các Action (sử dụng discriminated union)
//------------------------------------------------------

//------------------------------------------------------
// Trạng thái khởi tạo cho reducer
//------------------------------------------------------

