import { CommentActionType } from "../../hooks/_CommentSectionHook";
import { FullTestScreenState, ProfileHookState } from "./state";
import { CategoryRow, Comment_t, CommentReport, DialogLectureJobType, DialogRowJobType, EssayQuestionPayload, FetchTaskContentFailurePayload, FetchTaskContentRequestPayload, FetchTaskContentSuccessPayload, GetAiFeedbackFailurePayload, GetAiFeedbackRequestPayload, GetAiFeedbackSuccessPayload, GradedFeedback, LectureCard, LectureRow, LoadPromptsSuccessPayload, Meta, MilestoneItem, MultipleChoiceQuestion, Notification_t, NotificationActionType, Permission, PexelsPhoto, QuestionID, QuestionNumber, QuestionPage, Role, SaveResponsePayload, TableData, TestAnswerSheet, TestReviewAnswerSheet, TestRow, ToeicSpeakingPartActionType, Topic, UserComment, UserRow, WordOfTheDay, WritingPart1Prompt, WritingSheetData, WritingToeicPart2GradedFeedback, WritingToeicPart2Prompt, WritingToeicPart2SheetData, WritingToeicPart3GradedFeedback, WritingToeicPart3SheetData } from "./type";

type RenderTestActiion =
    | { type: "SET_USER_CHOICE_ANSWER_SHEET", payload: { qNum: QuestionNumber; qID: QuestionID; answer: string; } }
    | { type: "TOGGLE_FLAGS", payload: number }

type FullTestScreenAction =
    | { type: "SET_TUTORIALS"; payload: boolean[] }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_CURRENT_PAGE_INDEX"; payload: number }
    | { type: "SET_CURRENT_PAGE_OFFSET"; payload: number }
    | { type: "SET_TUTORIALS_DONE"; payload: number }
    | { type: "SET_STATE"; payload: FullTestScreenState }

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


interface FetchNotificationsStartAction {
    type: NotificationActionType.FETCH_NOTIFICATIONS_START;
}

interface FetchNotificationsSuccessAction {
    type: NotificationActionType.FETCH_NOTIFICATIONS_SUCCESS;
    payload: {
        notifications: Notification_t[];
        meta: Meta;
        unreadCount: number; // Tính toán và truyền vào đây
    };
}

interface FetchNotificationsFailureAction {
    type: NotificationActionType.FETCH_NOTIFICATIONS_FAILURE;
    payload: string; // Thông điệp lỗi
}

interface LoadMoreNotificationsStartAction {
    type: NotificationActionType.LOAD_MORE_NOTIFICATIONS_START;
}

interface LoadMoreNotificationsSuccessAction {
    type: NotificationActionType.LOAD_MORE_NOTIFICATIONS_SUCCESS;
    payload: {
        notifications: Notification_t[]; // Thông báo mới để nối vào danh sách cũ
        meta: Meta;
        unreadCount: number; // Cập nhật lại số lượng chưa đọc
    };
}

interface LoadMoreNotificationsFailureAction {
    type: NotificationActionType.LOAD_MORE_NOTIFICATIONS_FAILURE;
    payload: string; // Thông điệp lỗi
}

interface MarkAsReadSuccessAction {
    type: NotificationActionType.MARK_AS_READ_SUCCESS;
    payload: {
        notificationId: string;
        updatedNotification: Notification_t; // Thông báo đã được cập nhật từ API
        newUnreadCount: number;
    };
}

interface MarkAsReadFailureAction {
    type: NotificationActionType.MARK_AS_READ_FAILURE;
    payload: {
        notificationId: string;
        error: string;
    };
}

interface MarkAllAsReadSuccessAction {
    type: NotificationActionType.MARK_ALL_AS_READ_SUCCESS;
    // Không cần payload phức tạp, chỉ cần cập nhật trạng thái 'read' của tất cả và unreadCount = 0
}

interface MarkAllAsReadFailureAction {
    type: NotificationActionType.MARK_ALL_AS_READ_FAILURE;
    payload: string; // Thông điệp lỗi
}

interface DeleteNotificationSuccessAction {
    type: NotificationActionType.DELETE_NOTIFICATION_SUCCESS;
    payload: {
        notificationId: string;
        newUnreadCount: number;
    };
}

interface DeleteNotificationFailureAction {
    type: NotificationActionType.DELETE_NOTIFICATION_FAILURE;
    payload: {
        notificationId: string;
        error: string;
    };
}

interface UpdateUnreadCountAction {
    type: NotificationActionType.UPDATE_UNREAD_COUNT;
    payload: number; // Số lượng thông báo chưa đọc mới
}
interface ReduceUnreadCountTo1Action {
    type: NotificationActionType.REDUCE_UNREAD_COUNT_BY_1;
}

interface ResetNotificationsAction {
    type: NotificationActionType.RESET_NOTIFICATIONS;
}


/**
 * @typedef NotificationAction
 * @description Union type cho tất cả các hành động liên quan đến thông báo.
 */
type NotificationAction =
    | FetchNotificationsStartAction
    | FetchNotificationsSuccessAction
    | FetchNotificationsFailureAction
    | LoadMoreNotificationsStartAction
    | LoadMoreNotificationsSuccessAction
    | LoadMoreNotificationsFailureAction
    | MarkAsReadSuccessAction
    | MarkAsReadFailureAction
    | MarkAllAsReadSuccessAction
    | MarkAllAsReadFailureAction
    | ReduceUnreadCountTo1Action
    | DeleteNotificationSuccessAction
    | DeleteNotificationFailureAction
    | UpdateUnreadCountAction
    | ResetNotificationsAction;

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

/**
 * @type ActionType
 * @description Các loại hành động cho reducer của ToeicPart1.
 */
type ToeicWritingPart1Action =
    | { type: 'FETCH_IMAGE_AND_GENERATE_PROMPT_START' }
    | { type: 'FETCH_IMAGE_SUCCESS'; payload: PexelsPhoto }
    | { type: 'FETCH_IMAGE_FAILURE'; payload: string } // Error message for UI
    | {
        type: 'GENERATE_PROMPT_SUCCESS';
        payload: Pick<WritingPart1Prompt, 'id' | 'promptText' | 'mandatoryKeyword1' | 'mandatoryKeyword2' | 'createdAt' | 'part' | 'imageUrl' | 'imageAltText'>
    }
    | { type: 'GENERATE_PROMPT_FAILURE'; payload: string } // Error message for UI
    | { type: 'UPDATE_USER_ANSWER'; payload: string }
    | { type: 'SUBMIT_ANSWER_START' }
    | { type: 'SUBMIT_ANSWER_SUCCESS'; payload: GradedFeedback }
    | { type: 'SUBMIT_ANSWER_FAILURE'; payload: string }
    | { type: 'CLEAR_ERROR' }
    | { type: 'RESET_STATE_FOR_NEW_PROMPT' }
    | { type: 'DB_INIT_START' }
    | { type: 'DB_INIT_SUCCESS'; payload: { latestSheet: WritingSheetData | null; totalSheets: number } }
    | { type: 'DB_OPERATION_ERROR'; payload: string } // General DB error
    | { type: 'LOAD_SHEET_START'; payload: { sheetId: number } }
    | { type: 'LOAD_SHEET_SUCCESS'; payload: { sheetData: WritingSheetData; totalSheets: number } } // totalSheets might be redundant if already known
    | { type: 'CREATE_SHEET_SUCCESS'; payload: { newSheet: WritingSheetData; totalSheets: number } } // For newly created sheets
    | { type: 'UPDATE_SHEET_IN_STATE'; payload: Partial<WritingSheetData> } // To update parts of currentSheetData locally after DB update
    | { type: 'SET_CURRENT_SHEET_ID'; payload: number }
    | { type: 'SET_TOTAL_SHEETS'; payload: number }
    | { type: 'INTERNAL_NEW_SHEET_READY'; payload: { newActiveSheet: WritingSheetData; totalSheets: number } };

/**
 * @type WritingToeicPart2Action
 * @description Các loại action cho reducer của WritingToeicPart2.
 */
type WritingToeicPart2Action =
    // --- Actions cho CSDL & Sheet ---
    | { type: 'PART2_DB_INIT_START' }
    | { type: 'PART2_DB_INIT_SUCCESS'; payload: { latestSheet: WritingToeicPart2SheetData | null; totalSheets: number } }
    | { type: 'PART2_DB_OPERATION_ERROR'; payload: string }
    | { type: 'PART2_LOAD_SHEET_START'; payload: { sheetId: number } }
    | { type: 'PART2_LOAD_SHEET_SUCCESS'; payload: { sheetData: WritingToeicPart2SheetData; totalSheets: number } }
    | { type: 'PART2_CREATE_SHEET_SUCCESS'; payload: { newSheet: WritingToeicPart2SheetData; totalSheets: number } } // Khi tạo sheet trắng ban đầu
    | { type: 'PART2_INTERNAL_NEW_SHEET_READY'; payload: { newActiveSheet: WritingToeicPart2SheetData; totalSheets: number } } // Khi generateNewPrompt tạo sheet mới
    | { type: 'PART2_UPDATE_SHEET_IN_STATE'; payload: Partial<WritingToeicPart2SheetData> } // Cập nhật cục bộ sau khi DB update
    | { type: 'PART2_SET_CURRENT_SHEET_ID'; payload: number }
    | { type: 'PART2_SET_TOTAL_SHEETS'; payload: number }

    // --- Actions cho việc tạo đề bài ---
    | { type: 'PART2_GENERATE_PROMPT_START' }
    // payload nên là các trường cần thiết để xây dựng WritingToeicPart2Prompt và cập nhật SheetData
    | { type: 'PART2_GENERATE_PROMPT_SUCCESS'; payload: Pick<WritingToeicPart2Prompt, 'id' | 'receivedEmail' | 'instructionText' | 'generatedAt' | 'part'> }
    | { type: 'PART2_GENERATE_PROMPT_FAILURE'; payload: string }

    // --- Actions cho việc trả lời của người dùng ---
    | { type: 'PART2_UPDATE_USER_RESPONSE'; payload: string }
    | { type: 'PART2_SUBMIT_RESPONSE_START' }
    // payload là WritingToeicPart2GradedFeedback
    | { type: 'PART2_SUBMIT_RESPONSE_SUCCESS'; payload: WritingToeicPart2GradedFeedback }
    | { type: 'PART2_SUBMIT_RESPONSE_FAILURE'; payload: string }

    // --- Actions khác ---
    | { type: 'PART2_CLEAR_ERROR' };

/**
 * @type WritingToeicPart3Action
 * @description Các loại action cho reducer của WritingToeicPart3.
 * @comment Các hành động để cập nhật trạng thái của Part 3.
 */
type WritingToeicPart3Action =
    // --- Actions cho CSDL & Sheet ---
    | { type: 'PART3_DB_INIT_START' }
    | { type: 'PART3_DB_INIT_SUCCESS'; payload: { latestSheet: WritingToeicPart3SheetData | null; totalSheets: number } }
    | { type: 'PART3_DB_OPERATION_ERROR'; payload: string }
    | { type: 'PART3_LOAD_SHEET_START'; payload: { sheetId: number } }
    | { type: 'PART3_LOAD_SHEET_SUCCESS'; payload: { sheetData: WritingToeicPart3SheetData; totalSheets: number } }
    | { type: 'PART3_CREATE_SHEET_SUCCESS'; payload: { newSheet: WritingToeicPart3SheetData; totalSheets: number } }
    | { type: 'PART3_INTERNAL_NEW_SHEET_READY'; payload: { newActiveSheet: WritingToeicPart3SheetData; totalSheets: number } }
    | { type: 'PART3_UPDATE_SHEET_IN_STATE'; payload: Partial<WritingToeicPart3SheetData> }
    | { type: 'PART3_SET_CURRENT_SHEET_ID'; payload: number }
    | { type: 'PART3_SET_TOTAL_SHEETS'; payload: number }

    // --- Actions cho việc tạo đề bài ---
    | { type: 'PART3_GENERATE_ESSAY_QUESTION_START' }
    // payload nên là các trường cần thiết để xây dựng WritingToeicPart3Prompt và cập nhật SheetData
    // Cụ thể ở đây là EssayQuestionDataFromApi (chứa essayQuestion) và directions cố định.
    | { type: 'PART3_GENERATE_ESSAY_QUESTION_SUCCESS'; payload: EssayQuestionPayload }
    | { type: 'PART3_GENERATE_ESSAY_QUESTION_FAILURE'; payload: string }

    // --- Actions cho việc trả lời của người dùng ---
    | { type: 'PART3_UPDATE_USER_ESSAY'; payload: string }
    | { type: 'PART3_SUBMIT_ESSAY_START' }
    // payload là WritingToeicPart3GradedFeedback
    | { type: 'PART3_SUBMIT_ESSAY_SUCCESS'; payload: WritingToeicPart3GradedFeedback }
    | { type: 'PART3_SUBMIT_ESSAY_FAILURE'; payload: string }

    // --- Actions khác ---
    | { type: 'PART3_CLEAR_ERROR' };


type ToeicSpeakingPartAction =
    | { type: ToeicSpeakingPartActionType.LOAD_PROMPTS_REQUEST }
    | { type: ToeicSpeakingPartActionType.LOAD_PROMPTS_SUCCESS; payload: LoadPromptsSuccessPayload }
    | { type: ToeicSpeakingPartActionType.LOAD_PROMPTS_FAILURE; payload: string }

    | { type: ToeicSpeakingPartActionType.FETCH_TASK_CONTENT_REQUEST; payload: FetchTaskContentRequestPayload }
    | { type: ToeicSpeakingPartActionType.FETCH_TASK_CONTENT_SUCCESS; payload: FetchTaskContentSuccessPayload }
    | { type: ToeicSpeakingPartActionType.FETCH_TASK_CONTENT_FAILURE; payload: FetchTaskContentFailurePayload }

    | { type: ToeicSpeakingPartActionType.START_SIMULATION }
    | { type: ToeicSpeakingPartActionType.PROCEED_TO_PREPARATION }
    | { type: ToeicSpeakingPartActionType.START_RECORDING_PHASE }
    | { type: ToeicSpeakingPartActionType.SAVE_RESPONSE; payload: SaveResponsePayload }
    | { type: ToeicSpeakingPartActionType.GET_AI_FEEDBACK_REQUEST; payload: GetAiFeedbackRequestPayload }
    | { type: ToeicSpeakingPartActionType.GET_AI_FEEDBACK_SUCCESS; payload: GetAiFeedbackSuccessPayload }
    | { type: ToeicSpeakingPartActionType.GET_AI_FEEDBACK_FAILURE; payload: GetAiFeedbackFailurePayload }
    | { type: ToeicSpeakingPartActionType.NEXT_QUESTION_OR_TASK }
    | { type: ToeicSpeakingPartActionType.COMPLETE_SIMULATION }
    | { type: ToeicSpeakingPartActionType.RESET_SIMULATION }
    | { type: ToeicSpeakingPartActionType.SET_OVERALL_ERROR; payload: string }
    | { type: ToeicSpeakingPartActionType.CLEAR_OVERALL_ERROR };


type RoadmapAction =
    | { type: "FETCH_START" }
    | { type: "FETCH_SUCCESS"; payload: { wordOfTheDay: WordOfTheDay; milestoneItems: MilestoneItem[] } }
    | { type: "FETCH_ERROR"; payload: string }


export type {
    AdminReportAction, CategoryHookAction, CommentAction, FullTestScreenAction, LectureCardAction,
    LectureHookAction, MultiQuestionAction, NotificationAction, PermissionHookAction, ProfileHookAction,
    RenderTestActiion, RoadmapAction, RoleHookAction, RowHookAction, TestHookAction, TestReviewHookAction, ToeicSpeakingPartAction, ToeicWritingPart1Action, TopicHookAction, UserCommentAction,
    UserHookAction, WritingToeicPart2Action, WritingToeicPart3Action
};

