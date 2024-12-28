import { ProfileHookState } from "./state";
import { DialogLectureJobType, DialogRowJobType, LectureRow, MultipleChoiceQuestion, Permission, QuestionID, QuestionNumber, QuestionPage, Role, TestAnswerSheet, TestReviewAnswerSheet, Topic, UserComment, UserRow } from "./type";

type RenderTestActiion =
    | { type: "SET_USER_CHOICE_ANSWER_SHEET", payload: { qNum: QuestionNumber; qID: QuestionID; answer: string; } }
    | { type: "TOGGLE_FLAGS", payload: number }

type FullTestScreenAction =
    | { type: "SET_TUTORIALS"; payload: boolean[] }
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
type RoleHookAction =
    | { type: 'FETCH_ROWS_SUCCESS'; payload: [Role[], number] }
    | { type: 'FETCH_PERMISSIONS_SUCCESS'; payload: Permission[] }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'REFRESH_DATA' }
    | { type: 'RESET_ROWS' }
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
type UserHookAction =
    | { type: 'FETCH_ROWS_SUCCESS'; payload: [UserRow[], number] }
    | { type: 'FETCH_ROLES_SUCCESS'; payload: Role[] }
    | { type: 'SET_PAGE'; payload: number }
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

type LectureCardAction =
    | { type: 'FETCH_SUCCESS'; payload: LectureRow[] }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'SET_KEYWORD'; payload: string }
    | { type: 'RESET_ROWS' }


export type {
    FullTestScreenAction,
    LectureCardAction,
    LectureHookAction,
    MultiQuestionAction,
    ProfileHookAction,
    RenderTestActiion,
    RoleHookAction,
    RowHookAction,
    TestReviewHookAction,
    UserCommentAction,
    UserHookAction
};

