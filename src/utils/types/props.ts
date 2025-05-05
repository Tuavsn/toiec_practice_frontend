import { TreeNode } from "primereact/treenode";
import { Dispatch, MutableRefObject } from "react";
import { CategoryHookAction, FullTestScreenAction, LectureHookAction, MultiQuestionAction, PermissionHookAction, RoleHookAction, RowHookAction, TestHookAction, TestReviewHookAction, TopicHookAction, UserHookAction } from "./action";
import { LectureHookState, MultiQuestionState, TestReviewHookState } from "./state";
import { CategoryRow, DialogLectureJobType, DialogRowJobType, DoTestFunction, LectureRow, MultipleChoiceQuestion, MultiQuestionRef, Permission, QuestionAnswerRecord, QuestionID, QuestionNumber, QuestionPage, ResourceIndex, ResultOverview, Role, TestAnswerSheet, TestID, TestRow, TestSheet, TestType, Topic, TopicOverview, TopicStat, UserAnswerRecord, UserDetailResultRow, UserRow } from "./type";

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
    setReload: React.Dispatch<React.SetStateAction<boolean>>
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    currentSelectedQuestion: React.MutableRefObject<TreeNode>,
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
    doTestDataRef: React.MutableRefObject<TestSheet>
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

export type {
    ActivityLogProps, AdminCategoryTableProps, AdminLectureTableProps, AdminPermissionTableProps, AdminRoleTableProps, AdminRowTableProps, AdminGenericTableProps as AdminTableAndToolBarProps, AdminTestTableProps, AdminTopicTableProps, AdminUserTableProps, AssignmentQuestionTableProps, ButtonListProps,
    ConfirmSubmitDialogProps,
    DialogDeleteLectureBodyProps,
    DialogDeleteRowBodyProps,
    DialogLectureProps,
    DialogQuestionActionProps,
    DialogQuestionPageProps,
    DialogRoleRowProps,
    DialogRowProps,
    DialogTestRowProps,
    DialogUpdateCategoryBodyProps,
    DialogUpdateLectureBodyProps,
    DialogUpdatePermissionBodyProps,
    DialogUpdateRoleBodyProps,
    DialogUpdateTestBodyProps,
    DialogUpdateTopicBodyProps,
    DialogUpdateUserBodyProps,
    DialogUserRowProps,
    DoExercisePageProps,
    DoTestPageProps,
    FullTestAreaProps,
    FullTestScreenProps,
    LectureActionButtonProps,
    LectureReduceProps,
    PartDetailSectionProps,
    QuestionActionButtonProps,
    QuestionTableProps,
    RenderPressStartButtonProps,
    RenderTestProps,
    RennderTutorialProps,
    ResourceSectionProps,
    ResultTableProps,
    RichEditorProps,
    RowActionButtonProps,
    SimpleTimeCountDownProps,
    SkillInsightsProps,
    TestAreaProps,
    TestReviewAreaProps,
    TestToolBarProps, TimerClockProps, ToolBarFrameProps, UpdateQuestionDialogProps,
    UserAnswerSheetFullTestProps,
    UserAnswerSheetProps,
    UserAnswerSheetReviewProps, UserAnswerSideBarProps, UserAnswerSideTabProps
};

