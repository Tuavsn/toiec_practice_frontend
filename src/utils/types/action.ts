import { CommentActionType } from "../../hooks/_CommentSectionHook";
import { ProfileHookState } from "./state";
import { CategoryRow, Comment_t, CommentReport, DialogLectureJobType, DialogRowJobType, LectureCard, LectureRow, Meta, MultipleChoiceQuestion, Permission, QuestionID, QuestionNumber, QuestionPage, Role, TableData, TestAnswerSheet, TestReviewAnswerSheet, TestRow, Topic, UserComment, UserRow } from "./type";

type RenderTestActiion =
    | { type: "SET_USER_CHOICE_ANSWER_SHEET", payload: { qNum: QuestionNumber; qID: QuestionID; answer: string; } }
    | { type: "TOGGLE_FLAGS", payload: number }

type FullTestScreenAction =
    | { type: "SET_TUTORIALS"; payload: boolean[] }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_CURRENT_PAGE_INDEX"; payload: number }
    | { type: "SET_CURRENT_PAGE_OFFSET"; payload: number }
    | { type: "SET_TUTORIALS_DONE"; payload: number }

type RowHookAction<RowModel> =
    | { type: 'FETCH_ROWS_SUCCESS'; payload: [RowModel[], number] }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'REFRESH_DATA' }
    | { type: 'RESET_ROWS' }
    | { type: 'SET_CURRENT_ROW'; payload: RowModel }
    | { type: 'TOGGLE_DIALOG'; payload: DialogRowJobType }
    | { type: 'OPEN_UPDATE_DIALOG'; payload: RowModel }
    | { type: 'OPEN_DELETE_DIALOG'; payload: RowModel }
    | { type: 'OPEN_CREATE_DIALOG'; payload: RowModel }

type TopicHookAction = RowHookAction<Topic> |
{ type: 'SET_SEARCH'; payload: string }
type PermissionHookAction = RowHookAction<Permission> |
{ type: 'SET_SEARCH'; payload: string }
type TestHookAction = RowHookAction<TestRow> |
{ type: 'SET_SEARCH'; payload: string }
type CategoryHookAction = RowHookAction<CategoryRow> |
{ type: 'SET_SEARCH'; payload: string }

type RoleHookAction =
    | { type: 'FETCH_ROWS_SUCCESS'; payload: [Role[], number] }
    | { type: 'FETCH_PERMISSIONS_SUCCESS'; payload: Permission[] }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'REFRESH_DATA' }
    | { type: 'RESET_ROWS' }
    | { type: 'SET_SEARCH'; payload: string }
    | { type: 'SET_CURRENT_ROW'; payload: Role }
    | { type: 'TOGGLE_DIALOG'; payload: DialogRowJobType }
    | { type: 'OPEN_UPDATE_DIALOG'; payload: Role }
    | { type: 'OPEN_DELETE_DIALOG'; payload: Role }
    | { type: 'OPEN_CREATE_DIALOG'; payload: Role }
type UserCommentAction =
    | { type: 'SET_COMMENTS'; payload: UserComment[] | null }
    | { type: 'FETCH_COMMENTS'; payload: [UserComment[], number] }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'REFRESH_DATA' }

type CommentAction =
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
    | { type: CommentActionType.CLEAR_ERROR }
    | { type: CommentActionType.OPEN_REPORT_DIALOG; payload: Pick<Comment_t, 'id' | 'content' | 'userDisplayName' | 'userId'> }
    | { type: CommentActionType.CLOSE_REPORT_DIALOG }
    | { type: CommentActionType.SUBMIT_COMMENT_REPORT_START }
    | { type: CommentActionType.SUBMIT_COMMENT_REPORT_SUCCESS; payload: { report: CommentReport; message?: string } }
    | { type: CommentActionType.SUBMIT_COMMENT_REPORT_FAILURE; payload: string }
    | { type: CommentActionType.CLEAR_REPORT_SUBMIT_STATUS };

type UserHookAction =
    | { type: 'FETCH_ROWS_SUCCESS'; payload: [UserRow[], number] }
    | { type: 'FETCH_ROLES_SUCCESS'; payload: Role[] }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'SET_SEARCH'; payload: string }
    | { type: 'REFRESH_DATA' }
    | { type: 'RESET_ROWS' }
    | { type: 'SET_CURRENT_ROW'; payload: UserRow }
    | { type: 'TOGGLE_DIALOG'; payload: DialogRowJobType }
    | { type: 'OPEN_UPDATE_DIALOG'; payload: UserRow }
    | { type: 'OPEN_DELETE_DIALOG'; payload: UserRow }
    | { type: 'OPEN_CREATE_DIALOG'; payload: UserRow }
type FetchLecture = {
    lectures: LectureRow[],
    pageIndex: number
}
type LectureHookAction =
    | { type: 'FETCH_LECTURE_SUCCESS'; payload: FetchLecture }
    | { type: 'FETCH_TOPIC_SUCCESS'; payload: Topic[] }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'SET_SEARCH'; payload: string }
    | { type: 'REFRESH_DATA' }
    | { type: 'SET_CURRENT_LECTURE'; payload: LectureRow }
    | { type: 'TOGGLE_DIALOG'; payload: DialogLectureJobType }
    | { type: 'OPEN_UPDATE_DIALOG'; payload: LectureRow }
    | { type: 'OPEN_DELETE_DIALOG'; payload: LectureRow }
    | { type: 'OPEN_CREATE_DIALOG'; payload: LectureRow }
    | { type: 'OPEN_PAGE_DESIGNER_DIALOG'; payload: LectureRow }
    | { type: 'OPEN_QUESTION_EDITOR_DIALOG'; payload: LectureRow }

type MultiQuestionAction =
    | { type: "SET_QUESTION_LIST", payload: MultipleChoiceQuestion[] }
    | { type: "SET_PAGE_MAPPER", payload: QuestionPage[] }
    | { type: "SET_CURRENT_PAGE_INDEX", payload: number }
    | { type: "SET_USER_CHOICE_ANSWER_SHEET", payload: { qNum: QuestionNumber, qID: QuestionID, answer: string } }
    | { type: "SET_FLAGS", payload: boolean[] }
    | { type: "SET_USER_ANSWER_SHEET", payload: TestAnswerSheet }
    | { type: "SET_VISIBLE", payload: boolean }
    | { type: "SET_USER_ANSWER_SHEET_VISIBLE", payload: boolean }
    | { type: "SET_START", payload: boolean }
    | { type: "SET_IS_SUMIT", payload: boolean }
    | { type: "TOGGLE_FLAGS", payload: number }
    | { type: "SET_TEST_DATA", payload: [QuestionPage[], MultipleChoiceQuestion[], boolean[]] }
type TestReviewHookAction =
    | { type: 'FETCH_TEST_REVIEW_SUCCESS'; payload: [TestReviewAnswerSheet, QuestionPage[]] }
    | { type: 'SET_ANSWER_SHEET_VISIBLE'; payload: boolean }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'MOVE_PAGE'; payload: number }
// | { type: 'FETCH_TEST_REVIEW_SUCCESS'; payload: TestReviewAnswerSheet }
type ProfileHookAction =
    | { type: 'FETCH_SUCCESS', payload: ProfileHookState }
    | { type: 'SET_PAGE', payload: number }
    | { type: 'SET_TARGET', payload: number }

type LectureCardAction =
    | { type: 'FETCH_SUCCESS'; payload: LectureCard[] }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'SET_KEYWORD'; payload: string }
    | { type: 'RESET_ROWS' }

type AdminReportAction =
    | { type: 'FETCH_REPORTS_START' }
    | { type: 'FETCH_REPORTS_SUCCESS'; payload: TableData<CommentReport> }
    | { type: 'FETCH_REPORTS_FAILURE'; payload: string }
    | { type: 'UPDATE_STATUS_START'; payload: { reportId: string } }
    | { type: 'UPDATE_STATUS_SUCCESS'; payload: CommentReport } // Payload is the updated report
    | { type: 'UPDATE_STATUS_FAILURE'; payload: { reportId: string; error: string } }
    | { type: 'CLEAR_UPDATE_ERROR'; payload: { reportId: string } }
    | { type: 'DELETE_REPORT_START'; payload: { reportId: string } }
    | { type: 'DELETE_REPORT_SUCCESS'; payload: { reportId: string } } // reportId of deleted item
    | { type: 'DELETE_REPORT_FAILURE'; payload: { reportId: string; error: string } }
    | { type: 'CLEAR_DELETE_ERROR'; payload: { reportId: string } };


export type {
    AdminReportAction, CategoryHookAction, CommentAction, FullTestScreenAction, LectureCardAction,
    LectureHookAction,
    MultiQuestionAction, PermissionHookAction, ProfileHookAction,
    RenderTestActiion, RoleHookAction,
    RowHookAction, TestHookAction, TestReviewHookAction, TopicHookAction, UserCommentAction,
    UserHookAction
};

