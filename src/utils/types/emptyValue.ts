import { TreeNode } from "primereact/treenode";
import { LectureCardState, LectureHookState, MultiQuestionState, ProfileHookState, RoleHookState, RowHookState, TestReviewHookState, UserHookState } from "./state";
import { AnswerPair, CategoryRow, LectureRow, OverallStat, Permission, QuestionNumber, Role, TestDetailPageData, TestResultSummary, TestRow, Topic, UserRow } from "./type";
const emptyDate = new Date(0, 0, 0);
Object.freeze(emptyDate);
export const emptyLectureRowValue: LectureRow = {
    id: "",
    name: "",
    topic: [],
    createdAt: emptyDate,
    updatedAt: emptyDate,
    active: false
} as const

export const emptyTestResultSummaryValue: TestResultSummary = {
    id: "",
    testId: "",
    totalTime: 0,
    testName: "",
    totalReadingScore: 0,
    totalListeningScore: 0,
    totalCorrectAnswer: 0,
    totalIncorrectAnswer: 0,
    totalSkipAnswer: 0,
    type: "practice",
    parts: "",
    userAnswers: []
} as const

export const emptyTopicRowValue: Topic = {
    createdAt: emptyDate,
    updatedAt: emptyDate,
    id: "",
    name: "",
    solution: "",
    overallSkill: "Từ vựng",
    active: false
}

export const emptyUserRow: UserRow = {
    id: "",
    email: "",
    avatar: "",
    role: {
        createdAt: "",
        updatedAt: "",
        id: "",
        name: "",
        description: "",
        permissions: [],
        active: false
    },
    target: 0,
    active: false,
    createdAt: emptyDate,
    updatedAt: emptyDate
} as const

export const emptyCategoryRow: CategoryRow = {
    id: "",
    format: "vô danh",
    year: 2020,
    createdAt: emptyDate,
    updatedAt: emptyDate,
    active: true
} as const;

export const initialLectureCardState: LectureCardState = {
    lectures: [],
    keyword: "",
    currentPageIndex: 0
} as const
export const emptyTestRow: TestRow = {
    id: '',
    name: '',
    active: true,
    idCategory: "",
    totalTestAttempt: 0,
    totalQuestion: 200,
    totalScore: 990,
    limitTime: 90,
    totalUserAttempt: 0,
    createdAt: emptyDate,
    updatedAt: emptyDate
} as const

export const emptyPermissionRowValue: Permission = {
    createdAt: emptyDate,
    updatedAt: emptyDate,
    id: "",
    name: "",
    apiPath: "",
    method: "",
    module: "",
    active: false
}
export const initialLectureState: LectureHookState = {
    job: "",
    lectures: null,
    isRefresh: true,
    currentPageIndex: 0,
    currentSelectedLecture: emptyLectureRowValue
} as const

export const initialTopicState: RowHookState<Topic> = {
    rows: null,
    isRefresh: false,
    currentPageIndex: 0,
    job: "",
    currentSelectedRow: emptyTopicRowValue
} as const
export const initialPermissionState: RowHookState<Permission> = {
    rows: null,
    isRefresh: false,
    currentPageIndex: 0,
    job: "",
    currentSelectedRow: emptyPermissionRowValue
} as const


export const initialTestReviewState: TestReviewHookState = {
    isUserAnswerSheetVisible: false,
    testReviewAnswerSheet: [],
    currentPageIndex: 0,
    pageMapper: []
} as const

export const initialUserState: UserHookState = {
    rows: null,
    isRefresh: false,
    currentPageIndex: 0,
    job: "",
    currentSelectedRow: emptyUserRow,
    roleList: [],
} as const

export const initialCategoryState: RowHookState<CategoryRow> = {
    rows: null,
    isRefresh: false,
    currentPageIndex: 0,
    job: "",
    currentSelectedRow: emptyCategoryRow
} as const

export const initialTestState: RowHookState<TestRow> = {
    rows: null,
    isRefresh: false,
    currentPageIndex: 0,
    job: "",
    currentSelectedRow: emptyTestRow
}

export const emptyQuestionTreeNode: TreeNode = {
    key: "",
    data: {
        practiceID: "",
        testID: "",
        //----
        questionNum: "",
        partNum: 1,
        type: "single",
        difficulty: 999,
        //------
        ask: "what are you doing ?",
        choices: ["i am", "am i", "yes", "no"],
        correctChoice: "yes",
        transcript: "this is transcript",
        explanation: "because...",
        //------
        topic: [],
        //------
        resources: [],
        //------
        createdAt: emptyDate,
        updatedAt: emptyDate
    }
} as const;

export const emptyTestDetailPageData: TestDetailPageData = {
    id: "",
    name: "",
    totalUserAttempt: 0,
    totalQuestion: 0,
    totalScore: 0,
    limitTime: 0,
    resultsOverview: [],
    topicsOverview: []
} as const


export const emptyOverallStat: OverallStat = {
    averageListeningScore: 0,
    listeningScoreCount: 0,
    averageReadingScore: 0,
    readingScoreCount: 0,
    averageTotalScore: 0,
    totalScoreCount: 0,
    averageTime: 0,
    timeCount: 0,
    highestScore: 0
} as const;

export const emptyRole: Role = {
    createdAt: "",
    updatedAt: "",
    id: "",
    name: "",
    description: "",
    permissions: [],
    active: false
} as const
export const initProfile: ProfileHookState = {
    id: "",
    avatar: "",
    role: emptyRole,
    target: 0,
    overallStat: emptyOverallStat,
    topicStats: [],
    skillStats: [],
    results: []
} as const;

export const initialRoleState: RoleHookState = {
    rows: null,
    isRefresh: false,
    currentPageIndex: 0,
    job: "",
    currentSelectedRow: emptyRole,
    permissionList: [],
}

export const initialState: MultiQuestionState = {
    questionList: [],
    pageMapper: [],
    currentPageIndex: 0,
    userAnswerSheet: new Map<QuestionNumber, AnswerPair>(),
    flags: [],
    isVisible: false,
    isUserAnswerSheetVisible: false,
    start: false,
    isSumit: false,
} as const;