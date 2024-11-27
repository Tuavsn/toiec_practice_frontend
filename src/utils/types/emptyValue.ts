import { CategoryID, CategoryRow, LectureHookState, LectureRow, TestResultSummary, TestRow, UserRow } from "./type";

export const emptyLectureRowValue: LectureRow = {
    id: "",
    name: "",
    topic: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    active: false
} as const

export const emptyTestResultSummaryValue: TestResultSummary = {
    id: "",
    testId: "",
    totalTime: 0,
    totalReadingScore: 0,
    totalListeningScore: 0,
    totalCorrectAnswer: 0,
    totalIncorrectAnswer: 0,
    totalSkipAnswer: 0,
    type: "practice",
    parts: "",
    userAnswers: []
} as const

export const emptyUserRow: UserRow = {
    id: "",
    email: "",
    avatar: "",
    roleName: "",
    target: 0,
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date()
} as const

export const emptyCategoryRow: CategoryRow = {
    id: "",
    format: "vô danh",
    year: 2020,
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true
} as const;

export function emptyTestRow(category_id: CategoryID): TestRow {
    return {
        id: '',
        name: '',
        active: true,
        idCategory: category_id,
        totalTestAttempt: 0,
        totalQuestion: 200,
        totalScore: 990,
        limitTime: 90,
        totalUserAttempt: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    } as const
}

export const initialLectureState: LectureHookState = {
    lectures: [],
    currentPageIndex: 0,
    job: "",
    currentSelectedLecture: emptyLectureRowValue
} as const