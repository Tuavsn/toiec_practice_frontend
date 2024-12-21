import { CategoryRow, DialogLectureJobType, DialogRowJobType, LectureRow, MultipleChoiceQuestion, OverallStat, Permission, QuestionPage, Role, SkillStat, TestAnswerSheet, TestReviewAnswerSheet, TopicStat, UserComment, UserDetailResultRow, UserID, UserRow } from "./type";

interface LectureHookState {
  isRefresh: boolean;
  lectures: LectureRow[] | null,
  currentPageIndex: number,
  job: DialogLectureJobType,
  currentSelectedLecture: LectureRow
}
interface CategoryHookState {
  isRefresh: boolean;
  lectures: CategoryRow[],
  currentPageIndex: number,
  job: DialogRowJobType,
  currentSelectedCategory: CategoryRow
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
type RoleHookState = {
  rows: Role[] | null,
  isRefresh: boolean;
  currentPageIndex: number,
  job: DialogRowJobType,
  currentSelectedRow: Role,
  permissionList: Permission[],
}
type UserHookState = {
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
  flags: boolean[]
}
type FullTestScreenState = {
    tutorials: boolean[];
    currentPageIndex: number;
  };

  export type {
    CategoryHookState, FullTestScreenState, LectureHookState, MultiQuestionState, ProfileHookState, RenderTestState, RoleHookState, RowHookState, TestReviewHookState, UserCommentState, UserHookState
};
