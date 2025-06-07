import { PaginatorPageChangeEvent } from "primereact/paginator";
import { TreeNode } from "primereact/treenode";
import { Dispatch, MutableRefObject } from "react";
import { CategoryHookAction, FullTestScreenAction, LectureHookAction, MultiQuestionAction, PermissionHookAction, RoleHookAction, RowHookAction, TestHookAction, TestReviewHookAction, TopicHookAction, UserHookAction } from "./action";
import { LectureHookState, MultiQuestionState, TestReviewHookState, WritingToeicPart3State } from "./state";
import { CategoryRow, Comment_t, DeleteReason, DialogLectureJobType, DialogRowJobType, DoTestFunction, GradedFeedback, LectureRow, Meta, MultipleChoiceQuestion, MultiQuestionRef, Notification_t, Permission, PexelsPhoto, QuestionAnswerRecord, QuestionID, QuestionNumber, QuestionPage, ResourceIndex, ResultOverview, Role, TestAnswerSheet, TestID, TestRow, TestSheet, TestType, ToeicSpeakingLoadedTask, ToeicSpeakingPracticeView, ToeicSpeakingSubQuestion, Topic, TopicOverview, TopicStat, UIWritingPart1Control, UserAnswerRecord, UserDetailResultRow, UserRow, WritingPart1Prompt, WritingToeicPart2GradedFeedback, WritingToeicPart2Prompt, WritingToeicPart3GradedFeedback, WritingToeicPart3Prompt, WritingToeicPart3UIControls } from "./type";

interface ButtonListProps {
    pageMapper: QuestionPage[],
    userAnswerSheet: TestAnswerSheet,
    currentPageIndex: number,
    questionList: MultipleChoiceQuestion[],
    flags: boolean[],
    dispatch: Dispatch<MultiQuestionAction>,
}
interface ConfirmSubmitDialogProps {
    isDialogVisible: boolean,
    dispatch: Dispatch<MultiQuestionAction>;
    MultiRef: MutableRefObject<MultiQuestionRef>;
    answeredCount: number;
    onEndTest: () => Promise<void>;
}
interface FullTestScreenProps {
    questionList: MultipleChoiceQuestion[];
    pageMapper: QuestionPage[];
    currentPageIndex: number;
    userAnswerSheet: TestAnswerSheet;
    flags: boolean[];
    isVisible: boolean;
    isUserAnswerSheetVisible: boolean;
    func: DoTestFunction,
    dispatch: Dispatch<MultiQuestionAction>
    answeredCount: number,
    MultiRef: MutableRefObject<MultiQuestionRef>
}
interface RennderTutorialProps {
    partNeedToShow: number;
    dispatchTutorialIsDone: React.Dispatch<FullTestScreenAction>
}
interface RenderTestProps {
    onEndTest: () => Promise<void>,
    currentPageIndex: number,
    thisQuestion: QuestionAnswerRecord,
    doTestDataRef: React.MutableRefObject<TestSheet>
    changePageOffset: (offset: number) => void
    moveToPage: (pageIndex: number) => void
    autoSaveDraftTest: () => void
}

type RichEditorProps = {
    button: React.MutableRefObject<HTMLButtonElement>,
    text: React.MutableRefObject<string>,
    saveText(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, text: React.MutableRefObject<string>): void

}
type DialogLectureProps = {
    currentSelectedLecture: LectureRow,
    dispatch: Dispatch<LectureHookAction>,
    job: DialogLectureJobType,
}

type DialogRowProps<RowModel> = {
    currentSelectedRow: RowModel,
    dispatch: Dispatch<RowHookAction<RowModel>>,
    job: DialogRowJobType,
}
type DialogTestRowProps = {
    currentSelectedRow: TestRow,
    dispatch: Dispatch<RowHookAction<TestRow>>,
    job: DialogRowJobType,
    categoryName: string,
}
type DialogRoleRowProps = {
    currentSelectedRow: Role,
    dispatch: Dispatch<RoleHookAction>,
    job: DialogRowJobType,
    permissionList: Permission[]
}
type DialogUserRowProps = {
    currentSelectedRow: UserRow,
    dispatch: Dispatch<UserHookAction>,
    job: DialogRowJobType,
    roleList: Role[]
}

type DialogUpdateCategoryBodyProps = {
    currentSelectedRow: CategoryRow,
    dispatch: Dispatch<RowHookAction<CategoryRow>>,
}
type DialogUpdateTopicBodyProps = {
    currentSelectedRow: Topic,
    dispatch: Dispatch<RowHookAction<Topic>>,
}
type DialogUpdatePermissionBodyProps = {
    currentSelectedRow: Permission,
    dispatch: Dispatch<RowHookAction<Permission>>,
}
type DialogUpdateRoleBodyProps = {
    currentSelectedRow: Role,
    dispatch: Dispatch<RoleHookAction>,
    permissionList: Permission[],
}
type DialogUpdateUserBodyProps = {
    currentSelectedRow: UserRow,
    dispatch: Dispatch<UserHookAction>,
    roleList: Role[],
}
type DialogUpdateTestBodyProps = {
    currentSelectedRow: TestRow,
    dispatch: Dispatch<RowHookAction<TestRow>>,
}
type DialogUpdateLectureBodyProps = {
    currentSelectedLecture: LectureRow,
    dispatch: Dispatch<LectureHookAction>,
    topicListRef: React.MutableRefObject<Topic[]>,
}
type AdminLectureTableProps = {
    lectures: LectureRow[] | null,
    dispatch: Dispatch<LectureHookAction>,
}

type AdminRowTableProps<RowModel> = {
    rows: RowModel[] | null,
    dispatch: Dispatch<RowHookAction<RowModel>>,
}

type AdminGenericTableProps<RowModel, Action> = {
    rows: RowModel[] | null,
    dispatch: Dispatch<Action>,
}

type AdminTopicTableProps = AdminGenericTableProps<Topic, TopicHookAction>;
type AdminRoleTableProps = AdminGenericTableProps<Role, RoleHookAction>;
type AdminTestTableProps = AdminGenericTableProps<TestRow, TestHookAction>;
type AdminCategoryTableProps = AdminGenericTableProps<CategoryRow, CategoryHookAction>;


type AdminPermissionTableProps = AdminGenericTableProps<Permission, PermissionHookAction>;
type AdminUserTableProps = {
    rows: UserRow[] | null,
    dispatch: Dispatch<UserHookAction>,
}

type LectureActionButtonProps = {
    currentSelectedLecture: LectureRow,
    dispatch: Dispatch<LectureHookAction>,
}

type RowActionButtonProps<RowModel> = {
    currentSelectedRow: RowModel,
    dispatch: Dispatch<RowHookAction<RowModel>>,
}
type DialogDeleteLectureBodyProps = LectureActionButtonProps;

type DialogDeleteRowBodyProps<RowModel> = RowActionButtonProps<RowModel>;

interface SimpleTimeCountDownProps {
    isTutorial: boolean;
    timeLeftInSecond: number;
    onTimeUp: () => void;
}

interface DoTestPageProps {
    id: TestID,
    func: DoTestFunction,
    state: MultiQuestionState,
    onEndTest: () => Promise<void>,
    timeLimitRef: React.MutableRefObject<number>,
    dispatch: React.Dispatch<MultiQuestionAction>,
    MultiRef: React.MutableRefObject<MultiQuestionRef>,
}

interface DoExercisePageProps {
    setIsUserAnswerSheetVisible: React.Dispatch<React.SetStateAction<boolean>>,
    isUserAnswerSheetVisible: boolean,
    setTestAnswerSheet: (qNum: QuestionNumber, qID: QuestionID, answer: string) => void,
    totalQuestions: number,
    changePage: (offset: number) => void,
    timeDoTest: React.MutableRefObject<number>,
    isSumit: boolean,
    onEndTest: () => Promise<void>,
    startTest: () => void,
    start: boolean,
    userAnswerSheet: TestAnswerSheet,
    createButtonListElement: () => JSX.Element[],
    currentPageIndex: number,
    questionList: MultipleChoiceQuestion[],
}

interface DialogQuestionActionProps {
    isVisible: boolean,
    title: string,

    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    currentSelectedQuestion: React.MutableRefObject<TreeNode>,
    topicList: React.MutableRefObject<Topic[]>,
}

interface DialogAssignmentQuestionActionProps {
    isVisible: boolean,
    title: string,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    currentSelectedQuestion: React.MutableRefObject<TreeNode>,
    setReload: React.Dispatch<React.SetStateAction<boolean>>
}

type LectureReduceProps = {
    state: LectureHookState;
    dispatch: Dispatch<LectureHookAction>;
}

interface UserAnswerSheetProps {
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    ButtonListElement: JSX.Element[],
}
interface UserAnswerSheetFullTestProps {
    visible: boolean,
    pageMapper: QuestionPage[],
    userAnswerSheet: TestAnswerSheet,
    currentPageIndex: number,
    questionList: MultipleChoiceQuestion[],
    flags: boolean[],
    dispatch: Dispatch<MultiQuestionAction>,
}

type UserAnswerSheetReviewProps = {
    dispatch: Dispatch<TestReviewHookAction>,
    state: TestReviewHookState
}

type TestReviewAreaProps = {
    question: UserAnswerRecord,
    dispatch: Dispatch<TestReviewHookAction>,
}

interface TestAreaProps {
    testType: TestType,
    question: MultipleChoiceQuestion,
    userAnswerSheet: TestAnswerSheet,
    setTestAnswerSheet: (questionNumber: number, questionID: string, answer: string) => void
    changePage: (offset: number) => void
}
interface FullTestAreaProps {
    thisQuestion: QuestionAnswerRecord
    setReloadToolbar: React.Dispatch<React.SetStateAction<boolean>>
    changePageOffset: (offset: number) => void,
    doTestDataRef: React.MutableRefObject<TestSheet>,
    autoSaveDraftTest: () => void
}
interface SkillInsightsProps {
    parts: TopicStat[]
}
interface TimerClockProps {
    onEndTest: () => Promise<void>,
    doTestDataRef: React.MutableRefObject<TestSheet>
}
interface QuestionTableProps {
    setContextDialogBody: React.Dispatch<React.SetStateAction<JSX.Element | null>>,
    setResourceDialogBody: React.Dispatch<React.SetStateAction<JSX.Element | null>>,
    setTopicDialogBody: React.Dispatch<React.SetStateAction<JSX.Element | null>>,
}
interface AssignmentQuestionTableProps {
    setContextDialogBody: React.Dispatch<React.SetStateAction<JSX.Element | null>>,
    setResourceDialogBody: React.Dispatch<React.SetStateAction<JSX.Element | null>>,
}
interface TestToolBarProps {
    currentPageIndex: number,
    onEndTest: () => Promise<void>,
    thisQuestion: QuestionAnswerRecord
    moveToPage: (pageIndex: number) => void
    doTestDataRef: React.MutableRefObject<TestSheet>

}
interface ResourceSectionProps {
    resourseIndexes: ResourceIndex[],
    setResourseIndexes: React.Dispatch<React.SetStateAction<ResourceIndex[]>>,

}
interface ToolBarFrameProps {
    onEndTest: () => Promise<void>,
    buttonElementList: JSX.Element
    doTestDataRef: React.MutableRefObject<TestSheet>
}
interface UserAnswerSideBarProps {
    isShowed: boolean,
    setIsShowed: React.Dispatch<React.SetStateAction<boolean>>
    buttonElementList: JSX.Element
}

interface DialogQuestionPageProps {
    setIsDialogVisible: React.Dispatch<React.SetStateAction<JSX.Element | null>>
    dialogBodyVisible: JSX.Element | null,
    title: string
}

interface ActivityLogProps {
    userResultRows: UserDetailResultRow[]
}
interface QuestionActionButtonProps {
    questionNode: TreeNode,
    setTitle: React.Dispatch<React.SetStateAction<string>>,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    currentSelectedQuestion: React.MutableRefObject<TreeNode>,
}

interface UpdateQuestionDialogProps {
    currentSelectedQuestion: React.MutableRefObject<TreeNode>,
    topicList: React.MutableRefObject<Topic[]>,
}

interface RenderPressStartButtonProps {
    id: TestID,
    startTestFunc: () => void
}
interface PartDetailSectionProps {
    topicsOverview: TopicOverview[]
}

interface ResultTableProps {
    resultsOverview: ResultOverview[],
    id: TestID
}

interface UserAnswerSideTabProps {
    buttonElementList: JSX.Element
    dotestDataRef: React.MutableRefObject<TestSheet>
}

interface ImageDisplayProps {
    image: PexelsPhoto | null;
    isLoading: boolean;
    imageAltText?: string; // Văn bản thay thế cho ảnh
}

interface PromptDisplayProps {
    prompt: WritingPart1Prompt | null;
    isLoading: boolean;
}
interface AnswerFormProps {
    answerText: string;
    onAnswerChange: (text: string) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    isSubmitAnswerButtonDisable: boolean; // Để vô hiệu hoá nếu chưa có đề
}
interface PanelHeaderProps {
    generateNewQuestion: () => void,
    currentSheetId: number | null,
    uiControl: UIWritingPart1Control,
    totalSheets: number,
}

interface GradeDisplayProps {
    feedback: GradedFeedback | null;

    uiControls: UIWritingPart1Control
}

interface EmailPromptDisplayProps {
    prompt: WritingToeicPart2Prompt | null;
    isLoading: boolean;
}

interface WritingToeicPart2InitialMessageProps {
    error: string | null;
    // Thêm callback nếu muốn có nút "Thử lại" hoặc "Tạo đề mới" trực tiếp từ đây
    // onRetry?: () => void;
}
interface WritingToeicPart2PromptSectionProps {
    prompt: WritingToeicPart2Prompt | null;
    isLoading: boolean; // isLoading cho skeleton của EmailPromptDisplay
}
interface WritingToeicPart2ResponseSectionProps {
    userResponseText: string;
    onResponseChange: (text: string) => void;
    onSubmit: () => void;
    isSubmitting: boolean; // Loading của nút submit
    isFormDisabled: boolean; // Vô hiệu hóa toàn bộ form (ví dụ: khi đang tải đề)
    // isPromptAvailable: boolean; // Không cần nữa nếu component này chỉ render khi prompt có sẵn
}
interface WritingToeicPart2GradeSectionProps {
    feedback: WritingToeicPart2GradedFeedback | null;
    isLoading: boolean; // isLoading cho skeleton của EmailGradeDisplay
}
interface WritingToeicPart2PaginatorSectionProps {
    currentSheetId: number | null;
    totalSheets: number;
    onPageChange: (event: PaginatorPageChangeEvent) => void;
    isDisabled: boolean;
}

interface EmailResponseFormProps {
    // Nội dung email hiện tại của người dùng
    responseText: string;
    // Callback khi nội dung thay đổi
    onResponseChange: (text: string) => void;
    // Callback khi nhấn nút nộp bài
    onSubmit: () => void;
    // Cờ báo hiệu đang nộp bài (cho trạng thái loading của nút)
    isSubmitting: boolean;
    // Cờ báo hiệu toàn bộ form có bị vô hiệu hóa không (ví dụ: khi đang tải đề)
    isFormDisabled: boolean;
}
interface EmailGradeDisplayProps {
    // Đối tượng chứa thông tin điểm và nhận xét
    feedback: WritingToeicPart2GradedFeedback | null;
    // Cờ báo hiệu đang tải/chấm điểm
    isLoading: boolean;
}

interface WritingToeicPart3PanelHeaderProps {
    state: WritingToeicPart3State;
    uiControls: WritingToeicPart3UIControls;
    generateNewEssayQuestion: () => void;
}
interface EssayQuestionDisplayProps {
    // Đối tượng chứa câu hỏi luận và hướng dẫn
    prompt: WritingToeicPart3Prompt | null;
    // Cờ báo hiệu đang tải đề bài
    isLoading: boolean;
}
interface EssayEditorFormProps {
    // Nội dung bài luận hiện tại của người dùng
    essayText: string;
    // Callback khi nội dung thay đổi
    onEssayChange: (text: string) => void;
    // Callback khi nhấn nút nộp bài
    onSubmit: () => void;
    // Cờ báo hiệu đang nộp bài (cho trạng thái loading của nút)
    isSubmitting: boolean;
    // Cờ báo hiệu toàn bộ form có bị vô hiệu hóa không (ví dụ: khi đang tải đề)
    isFormDisabled: boolean;
}
interface EssayGradeDisplayProps {
    // Đối tượng chứa thông tin điểm và nhận xét chi tiết cho bài luận
    feedback: WritingToeicPart3GradedFeedback | null;
    // Cờ báo hiệu đang tải/chấm điểm
    isLoading: boolean;
}
interface GlassCardProps {
    title: string; // Tiêu đề chính của card
    onClick: () => void; // Hành động khi click
    bgColorClass: string; // Lớp màu nền, ví dụ: 'bg-orange-700'
    textColorClass?: string; // Lớp màu chữ, ví dụ: 'text-white'
    icon?: string; // Tên icon của PrimeIcons, ví dụ: 'pi pi-book'
    className?: string; // Các lớp CSS tùy chỉnh thêm
    // Bạn có thể thêm các props khác nếu cần, ví dụ: description, etc.
}

//------------------------------------------------------
// Props for Components (will be expanded)
//------------------------------------------------------
interface ToeicSpeakingPartTimerProps {
    durationSeconds: number;
    standardDurationSeconds: number;
    onTimerEnd: () => void;
    isPrepTime: boolean;
    title?: string;
}

interface ToeicSpeakingPartTaskPromptProps {
    task: ToeicSpeakingLoadedTask; // Task đã có thể chứa imageUrl và cờ loading
    subQuestion?: ToeicSpeakingSubQuestion;
    isRecording: boolean;
    // isLoadingContent is now part of task.isContentLoading
    onStartRecording?: () => void;
    onStopRecording?: () => void;
    currentPrepTime?: number;
    currentResponseTime?: number;
}

interface ToeicSpeakingPartTaskPlayerProps {
    task: ToeicSpeakingLoadedTask;
    taskIndex: number; // Index of the current task, needed for actions
    currentGlobalView: ToeicSpeakingPracticeView; // Global view state from the hook
    isCurrentTaskContentLoading: boolean; // From uiControls
    // Actions from the useToeicSpeaking hook
    actions: {
        fetchDynamicContentForTask: (taskIndex: number) => Promise<void>;
        proceedToPreparation: () => void; // Manually move to preparation phase
        startRecordingPhase: () => void;
        saveResponse: (data: { taskId: string; subQuestionId?: string; audioBlob: Blob }) => void;
        // We'll need more actions later, e.g.:
        // startRecordingPhase: () => void;
        // saveResponseAndProceed: (response: UserResponseData) => void;
        // completeSimulation: () => void;
    };
}
interface ToeicSpeakingPartAudioRecorderProps {
    /**
     * Callback function invoked when recording is complete and the audio Blob is ready.
     * @param audioBlob The recorded audio data as a Blob.
     */
    onRecordingComplete: (audioBlob: Blob) => void;
    /**
     * Prop to signal if recording should automatically stop (e.g., when a parent timer ends).
     * The component will watch this prop.
     */
    forceStop?: boolean;
    /**
     * Is recording currently allowed by the parent component (e.g., during response phase).
     */
    isRecordingActivePhase: boolean;
}

interface RadioButtonGroupProps {
    currentQuestionNumber: number,
    question: QuestionAnswerRecord,
    answerTexts: string[],
    setReloadToolbar: React.Dispatch<React.SetStateAction<boolean>>,
    doTestDataRef: React.MutableRefObject<TestSheet>
    autoSaveDraftTest: () => void,
}
//------------------------------------------------------
// Props for NotificationItem
//------------------------------------------------------
/**
 * @interface NotificationItemProps
 * @description Props cho component hiển thị một mục thông báo đơn lẻ.
 * @property {Notification_t} notification - Đối tượng thông báo để hiển thị.
 * @property {(notification: Notification_t) => void} onClick - Hàm callback khi mục thông báo được nhấp vào.
 * @property {(notificationId: string) => void} onDelete - Hàm callback khi nút xóa thông báo được nhấp vào.
 */
interface NotificationItemProps {
    notification: Notification_t;
    onClick: (notification: Notification_t) => void; // Thường là handleNotificationClick từ hook
    onDelete: (notificationId: string) => void;   // Thường là deleteNotificationItem từ hook

}

//------------------------------------------------------
// Props for NotificationPanel
//------------------------------------------------------
/**
 * @interface NotificationPanelProps
 * @description Props cho component hiển thị bảng danh sách thông báo.
 * Component này sẽ sử dụng hook useNotification để lấy dữ liệu và hàm xử lý.
 * @property {() => void} onClosePanel - Hàm callback để đóng OverlayPanel chứa nó.
 */
interface NotificationPanelProps {
    // Lấy các giá trị và hàm cần thiết trực tiếp từ useNotification hook.
    // Tuy nhiên, chúng ta có thể truyền một callback để đóng panel khi một thông báo được click.
    onClosePanel?: () => void;
    notifications: Notification_t[]
    meta: Meta | null,
    unreadCount: number
    isLoading: boolean,
    isLoadingMore: boolean,
    error: string | null,
    loadMoreNotifications: () => Promise<void>,
    handleNotificationClick: (notification: Notification_t) => Promise<void>,
    markAllAsRead: () => Promise<void>,
    deleteNotificationItem: (notificationId: string) => Promise<void>,
}

//------------------------------------------------------
// Props for NotificationIcon (Component hiển thị chuông và badge)
//------------------------------------------------------
/**
 * @interface NotificationIconProps
 * @description Props cho component hiển thị icon chuông thông báo và badge.
 * @property {number} unreadCount - Số lượng thông báo chưa đọc.
 * @property {(event: React.MouseEvent<HTMLElement>) => void} onClick - Hàm xử lý khi icon được nhấp, thường để mở OverlayPanel.
 */
interface NotificationIconProps {
    unreadCount: number;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

interface CommentItemProps {
    comment: Comment_t;
    amINotLoggedIn: boolean;
    currentUserId: string | null;
    potentialMentionedUsers: Array<{ id: string; name: string; avatar?: string }>; // For CommentContentRenderer & reply form

    // Actions
    onToggleLike: (commentId: string) => void;
    onDeleteComment: (commentId: string, reason: DeleteReason, parentId?: string | null) => void;

    // Reply handling for this specific comment (if it's a root comment)
    onShowReplyForm?: (parentId: string) => void; // Tells hook to set this comment.id as activeReplyParentId
    isReplyFormVisible?: boolean; // True if form to reply TO THIS comment is visible
    onPostReply?: (text: string, mentionedUserIds: string[], parentId: string) => Promise<void | unknown>;
    isPostingReply?: boolean; // Loading state for the reply form

    // Handling display of replies TO THIS comment
    onShowReplies?: (parentId: string, currentReplyPage?: number) => void; // To load/show replies
    // Replies to this comment are passed down and rendered by CommentSection directly after this item.
    // This item only needs to trigger loading/showing them.
    // We can show a "hide replies" button if they are visible for this parent.
    areRepliesVisible?: boolean; // True if replies for THIS comment are currently shown by parent
    isLoadingReplies?: boolean; // True if replies for THIS comment are being loaded
    replyMeta?: Meta | null; // Pagination for this comment's replies
    onOpenReportDialog: (comment: Comment_t) => void;
}

export type {
    ActivityLogProps, AdminCategoryTableProps, AdminGenericTableProps, AdminLectureTableProps, AdminPermissionTableProps, AdminRoleTableProps, AdminRowTableProps, AdminGenericTableProps as AdminTableAndToolBarProps, AdminTestTableProps, AdminTopicTableProps, AdminUserTableProps, AnswerFormProps, AssignmentQuestionTableProps, ButtonListProps, CommentItemProps, ConfirmSubmitDialogProps, DialogAssignmentQuestionActionProps, DialogDeleteLectureBodyProps,
    DialogDeleteRowBodyProps, DialogLectureProps, DialogQuestionActionProps,
    DialogQuestionPageProps, DialogRoleRowProps, DialogRowProps,
    DialogTestRowProps, DialogUpdateCategoryBodyProps, DialogUpdateLectureBodyProps, DialogUpdatePermissionBodyProps,
    DialogUpdateRoleBodyProps, DialogUpdateTestBodyProps,
    DialogUpdateTopicBodyProps, DialogUpdateUserBodyProps,
    DialogUserRowProps, DoExercisePageProps,
    DoTestPageProps, EmailGradeDisplayProps, EmailPromptDisplayProps, EmailResponseFormProps, EssayEditorFormProps, EssayGradeDisplayProps, EssayQuestionDisplayProps, FullTestAreaProps,
    FullTestScreenProps, GlassCardProps, GradeDisplayProps, ImageDisplayProps, LectureActionButtonProps, LectureReduceProps, NotificationIconProps, NotificationItemProps, NotificationPanelProps, PanelHeaderProps, PartDetailSectionProps, PromptDisplayProps, QuestionActionButtonProps,
    QuestionTableProps, RadioButtonGroupProps, RenderPressStartButtonProps,
    RenderTestProps, RennderTutorialProps,
    ResourceSectionProps,
    ResultTableProps,
    RichEditorProps,
    RowActionButtonProps,
    SimpleTimeCountDownProps,
    SkillInsightsProps,
    TestAreaProps,
    TestReviewAreaProps,
    TestToolBarProps, TimerClockProps, ToeicSpeakingPartAudioRecorderProps, ToeicSpeakingPartTaskPlayerProps, ToeicSpeakingPartTaskPromptProps, ToeicSpeakingPartTimerProps, ToolBarFrameProps, UpdateQuestionDialogProps,
    UserAnswerSheetFullTestProps,
    UserAnswerSheetProps,
    UserAnswerSheetReviewProps, UserAnswerSideBarProps, UserAnswerSideTabProps, WritingToeicPart2GradeSectionProps, WritingToeicPart2InitialMessageProps, WritingToeicPart2PaginatorSectionProps, WritingToeicPart2PromptSectionProps, WritingToeicPart2ResponseSectionProps, WritingToeicPart3PanelHeaderProps
};

