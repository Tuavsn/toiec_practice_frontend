import { CategoryRow, DialogLectureJobType, DialogRowJobType, LectureCard, LectureRow, MultipleChoiceQuestion, OverallStat, Permission, QuestionPage, Role, SkillStat, TestAnswerSheet, TestReviewAnswerSheet, TestRow, Topic, TopicStat, UserComment, UserDetailResultRow, UserID, UserRow } from "./type";

interface LectureHookState {
  isRefresh: boolean;
  lectures: LectureRow[] | null,
  currentPageIndex: number,
  job: DialogLectureJobType,
  currentSelectedLecture: LectureRow,
  searchText: string,
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
export type {
  CategoryHookState,
  FullTestScreenState,
  LectureCardState,
  LectureHookState,
  MultiQuestionState, PermissionHookState, ProfileHookState,
  RenderTestState,
  RoleHookState,
  RowHookState, TestHookState, TestReviewHookState, TopicHookState, UserCommentState,
  UserHookState
};

