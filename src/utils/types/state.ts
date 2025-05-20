import { CategoryRow, Comment_t, CommentReport, DialogLectureJobType, DialogRowJobType, GradedFeedback, LectureCard, LectureRow, Meta, MultipleChoiceQuestion, OverallStat, Permission, PexelsPhoto, QuestionPage, Role, SkillStat, TestAnswerSheet, TestReviewAnswerSheet, TestRow, Topic, TopicStat, UserComment, UserDetailResultRow, UserID, UserRow, WritingPart1Prompt, WritingSheetData } from "./type";

interface LectureHookState {
  isRefresh: boolean;
  lectures: LectureRow[] | null,
  currentPageIndex: number,
  job: DialogLectureJobType,
  currentSelectedLecture: LectureRow,
  searchText: string,
}

type CommentsState = {
  comments: Comment_t[]
  loading: boolean
  error: string | null
  meta: Meta | null
}

type ProfileHookState = {
  id: UserID,
  avatar: string,
  role: Role,
  target: number,
  overallStat: OverallStat | null,
  topicStats: TopicStat[],
  skillStats: SkillStat[],
  results: UserDetailResultRow[],
}
interface UserCommentState {
  comments: UserComment[] | null;
  currentPageIndex: number;
}
interface TestReviewHookState {
  testReviewAnswerSheet: TestReviewAnswerSheet,
  isUserAnswerSheetVisible: boolean,
  currentPageIndex: number,
  pageMapper: QuestionPage[],
}
type RowHookState<RowModel> = {
  rows: RowModel[] | null,
  isRefresh: boolean;
  currentPageIndex: number,
  job: DialogRowJobType,
  currentSelectedRow: RowModel,
}
type TopicHookState = RowHookState<Topic> & {
  searchText: string,
}
type PermissionHookState = RowHookState<Permission> & {
  searchText: string,
}
type CategoryHookState = RowHookState<CategoryRow> & {
  searchText: string,
}
type TestHookState = RowHookState<TestRow> & {
  searchText: string,
}



type RoleHookState = {
  rows: Role[] | null,
  searchText: string,
  isRefresh: boolean;
  currentPageIndex: number,
  job: DialogRowJobType,
  currentSelectedRow: Role,
  permissionList: Permission[],
}
type UserHookState = {
  searchText: string,
  rows: UserRow[] | null,
  isRefresh: boolean;
  currentPageIndex: number,
  job: DialogRowJobType,
  currentSelectedRow: UserRow,
  roleList: Role[],
}
interface MultiQuestionState {
  questionList: MultipleChoiceQuestion[];
  pageMapper: QuestionPage[];
  currentPageIndex: number;
  userAnswerSheet: TestAnswerSheet;
  flags: boolean[];
  isVisible: boolean;
  isUserAnswerSheetVisible: boolean;
  start: boolean;
  isSumit: boolean;
}
interface RenderTestState {
  userAnswerSheet: TestAnswerSheet
}
type FullTestScreenState = {
  isLoading: boolean;
  tutorials: boolean[];
  currentPageIndex: number;
};
interface LectureCardState {
  lectures: LectureCard[],
  keyword: string,
  currentPageIndex: number,

}

interface CommentSectionState {
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

  // Report dialog state
  isReportDialogVisible: boolean;
  commentForReporting: Pick<Comment_t, 'id' | 'content' | 'userDisplayName' | 'userId'> | null;
  isSubmittingReport: boolean;
  reportSubmitError: string | null;
}

interface AdminReportsState {
  reports: CommentReport[];
  meta: Meta | null;
  isLoading: boolean; // For fetching list
  error: string | null; // For fetching list
  isUpdatingReportStatus: Record<string, boolean>; // Key: reportId, for status update
  updateReportError: Record<string, string | null>; // Key: reportId, for status update error
  isDeletingReport: Record<string, boolean>;      // Key: reportId, for delete operation
  deleteReportError: Record<string, string | null>; // Key: reportId, for delete operation error
}

/**
 * @interface ToeicWritingPart1State 
 * @description Định nghĩa trạng thái cho trang TOEIC Part 1.
 */
interface ToeicWritingPart1State {
  isLoadingImage: boolean; // Trạng thái đang tải hình ảnh
  isCreatingQuestion: boolean; // Trạng thái đang tạo đề bài
  isLoadingGrade: boolean; // Trạng thái đang chấm điểm
  currentImage: PexelsPhoto | null; // Hình ảnh hiện tại từ Pexels
  currentPrompt: WritingPart1Prompt | null; // Đề bài hiện tại
  userAnswerText: string; // Nội dung câu trả lời của người dùng
  currentFeedback: GradedFeedback | null; // Phản hồi và điểm số hiện tại
  error: string | null; // Thông báo lỗi (nếu có)
  currentSheetId: number | null; // ID of the currently loaded/active sheet
  currentSheetData: WritingSheetData | null; // Full data of the loaded sheet
  totalSheets: number; // Total number of sheets in DB for Paginator
  isDbLoading: boolean; // For initial DB load or sheet switching
}

export type {
  AdminReportsState, CategoryHookState, CommentSectionState, CommentsState, FullTestScreenState,
  LectureCardState,
  LectureHookState, MultiQuestionState, PermissionHookState, ProfileHookState,
  RenderTestState,
  RoleHookState, RowHookState, TestHookState, TestReviewHookState, ToeicWritingPart1State, TopicHookState, UserCommentState,
  UserHookState
};

