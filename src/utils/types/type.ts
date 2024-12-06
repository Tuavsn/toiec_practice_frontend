import { DataTableValue } from "primereact/datatable";
import { EditorTextChangeEvent } from "primereact/editor";
import { Toast } from "primereact/toast";
import { TreeNode } from "primereact/treenode";
import { Dispatch, MutableRefObject } from "react";


export interface Category extends CategoryRow {
  tests: Test[];
}

// Lecture Collection
export interface Lecture extends DataTableValue {
  id: LectureID;
  name: string;
  topic: Topic[];
  content: string;
  practiceQuestions: QuestionRow[] | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Topic {
  createdAt: Date,
  updatedAt: Date,
  id: TopicID,
  name: string,
  solution: string,
  overallSkill: "Từ vựng" | "Ngữ pháp",
  active: boolean
}



export interface Assignment extends DataTableValue {
  required: number;
  totalQuestion: number;
  questionIds: string[];  // List of Question IDs
}

// Question Collection
export interface QuestionRow extends DataTableValue {
  id: QuestionID;
  parentId: QuestionID;
  testId: TestID;
  practiceId: string | null;
  questionNum: number;
  partNum: number;
  type: QuestionType;
  subQuestions: QuestionRow[];  // List of subquestions
  content: string;
  difficulty: number;
  topic: Topic[];  // Array of topics
  resources: Resource[];
  transcript?: string;
  explanation?: string;
  answers: string[];  // Array of answers
  correctAnswer: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resource extends DataTableValue {
  type: ResourceType;  // Resource type
  content: string;
}

// Result Collection
export interface Result extends DataTableValue {
  id: string;
  testId: string;
  user: User;  // Reference to User
  totalTime: number;
  totalReadingScore: number;
  totalListeningScore: number;
  totalCorrectAnswer: number;
  totalIncorrectAnswer: number;
  totalSkipAnswer: number;
  type: 'practice' | 'fulltest';
  parts: number[];  // Practice parts
  userAnswers: UserAnswerResult[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAnswerResult extends DataTableValue {
  questionId: string;
  answer: string;
  solution: string;
  questionNum: QuestionNumber;
  partNum: number;
  content: string;
  resources: Resource[];
  transcript: string;
  explanation: string;
  answers: string[];
  correctAnswer: string;
}

// Role Collection
export interface Role extends DataTableValue {
  createdAt: string;
  updatedAt: string;
  id: RoleID;
  name: string;
  description: string;
  permissions: Permission[];
  active: boolean;
}

export interface Permission extends DataTableValue {
  createdAt: Date;
  updatedAt: Date;
  id: PermissionID;
  name: string;
  apiPath: string;
  method: string;
  module: string;
  active: boolean;
}



export interface Test extends TestRow {
  category: Category;  // Reference to Category
}

export interface LectureRow {
  id: LectureID;
  name: string;
  topic: Topic[];
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export interface User extends UserRow {
  refreshToken: string;
  testAttemptHistory: TestAttempt[];  // List of test attempts
  learningProgress: LearningProgress[];  // List of learning progress
}

export interface TestAttempt extends DataTableValue {
  testId: string;
  results: Result[];  // List of Results
}

export interface LearningProgress extends DataTableValue {
  lectures: Lecture[];  // List of Lectures
  isCompleted: boolean;
}

//-------------------------------------------------REQUEST RESPONE OBJECT----------------------------------------------------------------

export interface TableData<T> {
  meta: {
    current: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  result: T[];
}

export interface Meta {
  current: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface ApiResponse<T> {
  statusCode: number,
  message: string,
  data: T,
  error: string,
}

export interface PracticeTitle {
  title: string;
  isCompleted: boolean
}

export interface CategoryLabel {
  format: string;
  year: number[];
}

export interface LectureCard {
  id: string,
  name: string,
  topic: string[],
}

export interface TestCard {
  id: string;
  format: string;
  year: number;
  name: string;
}

export interface CategoryRow extends DataTableValue {
  id: string;
  format: string;
  year: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Test Collection
export interface TestRow extends DataTableValue {
  id: string;
  name: string;
  totalUserAttempt: number;
  totalQuestion: number;
  totalScore: number;
  idCategory: string;
  limitTime: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User Collection
export interface UserRow extends DataTableValue {
  id: UserID;
  email: string;
  role: Role;
  target: number;
}


export interface UserResultRow {
  id: ResultID,
  createdAt: Date,
  totalCorrectAnswer: number,
  totalTime: number,
  type: TestType;
  parts: number[];  // Practice parts
}

export type UserDetailResultRow = {
  createdAt: Date; // ISO 8601 date string
  testId: TestID;
  resultId: ResultID;
  testName: string;
  result: string; // "1/200" format
  totalTime: number; // Total time in seconds
  totalReadingScore: number;
  totalListeningScore: number;
  totalCorrectAnswer: number;
  totalIncorrectAnswer: number;
  totalSkipAnswer: number;
  type: TestType; // E.g., "fulltest"
  parts: string;
}

export interface TestPaper {
  totalQuestion: number,
  listMultipleChoiceQuestions: MultipleChoiceQuestion[]
}
export interface SelectedQuestionDialogTestOverallPage {
  body: JSX.Element | null;
  title: JSX.Element | null;
}
export interface QuestionPage {
  questionNum: QuestionNumber,
  part: number,
  page: number,
}

export interface UserAnswerResult {
  questionId: QuestionID;
  answer: string;
  solution: string;
  timeSpent: number;
  correct: boolean;
  partNum: number;
  resources: Resource[];
  transcript: string;
  explanation: string;
  answers: string[];
  listTopics: Topic[];
  correctAnswer: string;
}

export interface AnswerPair {
  questionId: QuestionID,
  userAnswer: string,
}

export type TestRecord = {
  totalSeconds: number;
  testId: string;
  parts: string;
  userAnswer: AnswerRecord[];
  type: TestType
}
export interface TestDetailPageData {
  id: string;
  name: string;
  totalUserAttempt: number;
  totalQuestion: number;
  totalScore: number;
  limitTime: number;
  resultsOverview: ResultOverview[];
  topicsOverview: TopicOverview[];
}
export type TopicStat = {
  topic: Topic; // Assuming Topic is another type or interface
  totalCorrect: number;
  totalIncorrect: number;
  averageTime: number;
  timeCount: number;
  totalTime: number;
};
export type OverallStat = {
  averageListeningScore: number;
  listeningScoreCount: number;
  averageReadingScore: number;
  readingScoreCount: number;
  averageTotalScore: number;
  totalScoreCount: number;
  averageTime: number;
  timeCount: number;
  highestScore: number;
};
export type SkillStat = {
  skill: string; // "listening", "reading", etc.
  totalCorrect: number;
  totalIncorrect: number;
  totalTime: number;
};
interface ResultOverview {
  createdAt: Date; // Use ISO string for Instant in Java
  result: ResultID; // e.g., "x/200", "x/30"
  totalTime: number;
  totalReadingScore: number;
  totalListeningScore: number;
  totalCorrectAnswer: number;
  totalIncorrectAnswer: number;
  totalSkipAnswer: number;
  type: TestType; // "practice" or "fulltest"
  parts: string; // "Practice parts"
}

interface TopicOverview {
  partNum: number;
  topicNames: string[];
}

export type TestResultSummary = {
  testName: string;
  id: ResultID;
  testId: TestID;
  totalTime: number;
  totalReadingScore: number;
  totalListeningScore: number;
  totalCorrectAnswer: number;
  totalIncorrectAnswer: number;
  totalSkipAnswer: number;
  type: TestType;  // if "type" has specific possible values, you can use union types
  parts: string;
  userAnswers: UserAnswerResult[];
}

export interface PracticePaper {
  totalQuestions: number,
  practiceQuestions: PracticeQuestion[]
}

export interface PracticeQuestion {
  id: QuestionID;
  type: QuestionType;
  subQuestions: PracticeQuestion[];
  content: string;
  resources: Resource[];
  transcript: string;
  explanation: string;
  answers: string[];
  correctAnswer: string;
}

export interface UserAnswerRecord {
  questionId: QuestionID;
  parentId: QuestionID;
  listTopics: Topic[];
  userAnswer: string;
  solution: string | null;
  correct: boolean;
  timeSpent: number;
  questionNum: QuestionNumber;
  partNum: number;
  type: QuestionType;
  content: string;
  difficulty: number;
  resources: Resource[];
  transcript: string;
  explanation: string;
  answers: string[];
  correctAnswer: string;
  subUserAnswer: UserAnswerRecord[];
}

export interface MultipleChoiceQuestion {
  id: QuestionID;
  questionNum: number;
  type: string;
  partNum: number
  subQuestions: MultipleChoiceQuestion[];
  content: string;
  resources: Resource[];
  answers: string[];
}

export interface SuggestionsForUser {
  title: string;
  content: string;
}

export interface UpdateQuestionForm {
  id: QuestionID;
  testId: TestID;
  practiceId: string;
  content: string;
  difficulty: number;
  listTopicIds: TopicID[];
  transcript: string;
  explanation: string;
  answers: string[];
  correctAnswer: string;
}

export interface UpdateLectureForm {
  id: LectureID;
  name: string;
  topicIds: TopicID[];
}




// ------------------------- tham số truyền
export type RichEditorProps = {
  button: React.MutableRefObject<HTMLButtonElement>,
  text: React.MutableRefObject<string>,
  saveText(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, text: React.MutableRefObject<string>): void

}
export type DialogLectureProps = {
  currentSelectedLecture: LectureRow,
  dispatch: Dispatch<LectureHookAction>,
  job: DialogLectureJobType,
}

export type DialogRowProps<RowModel> = {
  currentSelectedRow: RowModel,
  dispatch: Dispatch<RowHookAction<RowModel>>,
  job: DialogRowJobType,
}

export type DialogUpdateCategoryBodyProps = {
  currentSelectedRow: CategoryRow,
  dispatch: Dispatch<RowHookAction<CategoryRow>>,
}
export type DialogUpdateTestBodyProps = {
  currentSelectedRow: TestRow,
  dispatch: Dispatch<RowHookAction<TestRow>>,
}
export type DialogUpdateLectureBodyProps = {
  currentSelectedLecture: LectureRow,
  dispatch: Dispatch<LectureHookAction>,
  topicListRef: React.MutableRefObject<Topic[]>,
}

export type RenderLectureDialogParams = {
  job: DialogLectureJobType,
  currentSelectedLecture: LectureRow,
  dispatch: Dispatch<LectureHookAction>,
  topicListRef: React.MutableRefObject<Topic[]>
}

export type RenderRowDialogParams<RowModel> = {
  job: DialogRowJobType,
  currentSelectedRow: RowModel,
  dispatch: Dispatch<RowHookAction<RowModel>>,
}

export type SaveTextParams = {
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  toast: MutableRefObject<Toast | null>
  text: React.MutableRefObject<string>,
  lectureID: LectureID,
}
export type EditTextParams = {
  e: EditorTextChangeEvent,
  button: React.MutableRefObject<HTMLButtonElement>,
  text: React.MutableRefObject<string>
}
export type handeSaveLectureParams = {
  title: string,
  topicIds: TopicID[],
  lectureID: LectureID,
  toast: React.MutableRefObject<Toast | null>,
  dispatch: React.Dispatch<LectureHookAction>,
}

export type handeDeleteLectureParams = {
  lectureID: LectureID,
  toast: React.MutableRefObject<Toast | null>,
  dispatch: React.Dispatch<LectureHookAction>,
}

export type handeDeleteRowParams<RowModel> = {
  rowID: string,
  toast: React.MutableRefObject<Toast | null>,
  dispatch: React.Dispatch<RowHookAction<RowModel>>,
}

export type AdminLectureTableProps = {
  lectures: LectureRow[],
  dispatch: Dispatch<LectureHookAction>,
}

export type AdminRowTableProps<RowModel> = {
  rows: RowModel[],
  dispatch: Dispatch<RowHookAction<RowModel>>,
}

export type LectureActionButtonProps = {
  currentSelectedLecture: LectureRow,
  dispatch: Dispatch<LectureHookAction>,
}
export type handeSaveRowParams<RowModel> = {
  row: RowModel
  toast: React.MutableRefObject<Toast | null>,
  dispatch: React.Dispatch<RowHookAction<RowModel>>,
}
export type RowActionButtonProps<RowModel> = {
  currentSelectedRow: RowModel,
  dispatch: Dispatch<RowHookAction<RowModel>>,
}
export type DialogDeleteLectureBodyProps = LectureActionButtonProps;

export type DialogDeleteRowBodyProps<RowModel> = RowActionButtonProps<RowModel>;

export interface SimpleTimeCountDownProps {
  timeLeftInSecond: number;
  onTimeUp: () => void;
}

export interface DialogQuestionActionProps {
  isVisible: boolean,
  title: string,
  topicList: React.MutableRefObject<Topic[]>,
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
  currentSelectedQuestion: React.MutableRefObject<TreeNode>,
}

export type LectureReduceProps = {
  state: LectureHookState;
  dispatch: Dispatch<LectureHookAction>;
}

export interface UserAnswerSheetProps {
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  ButtonListElement: JSX.Element[],
}

export type UserAnswerSheetReviewProps = {
  dispatch: Dispatch<TestReviewHookAction>,
  state: TestReviewHookState
}

export type TestReviewAreaProps = {
  question: UserAnswerRecord,
  dispatch: Dispatch<TestReviewHookAction>,
}

export interface TestAreaProps {
  testType: TestType,
  question: MultipleChoiceQuestion,
  userAnswerSheet: TestAnswerSheet,
  setTestAnswerSheet: (questionNumber: number, questionID: string, answer: string) => void
  changePage: (offset: number) => void
}

export interface TopicRecord extends DataTableValue {
  topic: string,
  correctCount: number,
  wrongCount: number,
  correctPercent: number,
}

export interface SkillInsightsProps {
  parts: TopicStat[]
}
export type AnswerRecord = AnswerPair & {
  timeSpent: milisecond;
}

export interface QuestionTableProps {
  setContextDialogBody: React.Dispatch<React.SetStateAction<JSX.Element | null>>,
  setResourceDialogBody: React.Dispatch<React.SetStateAction<JSX.Element | null>>,
  setTopicDialogBody: React.Dispatch<React.SetStateAction<JSX.Element | null>>,
}

export interface QuestionActionButtonProps {
  questionNode: TreeNode,
  topicList: React.MutableRefObject<Topic[]>,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
  currentSelectedQuestion: React.MutableRefObject<TreeNode>,
}

export interface UpdateQuestionDialogProps {
  currentSelectedQuestion: React.MutableRefObject<TreeNode>,
  topicList: React.MutableRefObject<Topic[]>,
}

export interface QuestionContext {
  ask?: string
  choices?: string[]
  correctChoice?: string
  transcript?: string
  explanation?: string
}
export type ResourceIndex = Resource & {
  index: number,
  file: File | null,
}
export interface ResourceSectionProps {
  resourseIndexes: ResourceIndex[],
  setResourseIndexes: React.Dispatch<React.SetStateAction<ResourceIndex[]>>,

}
export interface DialogQuestionPageProps {
  setIsDialogVisible: React.Dispatch<React.SetStateAction<JSX.Element | null>>
  dialogBodyVisible: JSX.Element | null,
  title: string
}

export interface ActivityLogProps {
  userResultRows: UserDetailResultRow[]
}
//---------------------------- tên gọi khác
export type TestAnswerSheet = Map<QuestionNumber, AnswerPair>;
export type ResultID = string;
export type QuestionID = string;
export type UserID = string;
export type QuestionNumber = number;
export type milisecond = number;
export type TestID = string;
type RoleID = string;
type PermissionID = string;
export type LectureID = string;
export type PracticeAnswerSheet = Map<QuestionID, string>;
export type TestReviewAnswerSheet = UserAnswerRecord[];
export type CategoryID = string;
export type TopicID = string;
export type ResponseUserResultList = ApiResponse<TableData<UserDetailResultRow>>;
export type UserAnswerTimeCounter = Map<QuestionNumber, milisecond>
export type ResourceType = 'paragraph' | 'image' | 'audio'
export type TestType = 'fulltest' | 'practice' | 'survival';
export type QuestionType = 'single' | 'group' | 'subquestion' | 'ABCD';
export type ExerciseType = "partNum=1" | "partNum=2" | "partNum=3" | "partNum=4" | "partNum=5" | "partNum=6" | "partNum=7" | "TOPIC=grammar" | "TOPIC=vocabulary";
export type DialogLectureJobType = '' | 'CREATE' | 'UPDATE' | 'DELETE' | 'PAGE_DESIGNER' | 'QUESTION_EDITOR';
export type DialogRowJobType = '' | 'CREATE' | 'UPDATE' | 'DELETE';
export type Name_ID<T extends string> = T;

//-----------------------------reducer---------------------
export interface LectureHookState {
  isRefresh: boolean;
  lectures: LectureRow[],
  currentPageIndex: number,
  job: DialogLectureJobType,
  currentSelectedLecture: LectureRow
}
export interface CategoryHookState {
  isRefresh: boolean;
  lectures: CategoryRow[],
  currentPageIndex: number,
  job: DialogRowJobType,
  currentSelectedCategory: CategoryRow
}

export type ProfileHookState = {
  id: UserID,
  avatar: string,
  role: Role,
  target: number,
  overallStat: OverallStat,
  topicStats: TopicStat[],
  skillStats: SkillStat[],
  results: UserDetailResultRow[],
}

export interface TestReviewHookState {
  testReviewAnswerSheet: TestReviewAnswerSheet,
  isUserAnswerSheetVisible: boolean,
  currentPageIndex: number,
  pageMapper: QuestionPage[],
}
export type RowHookState<RowModel> = {
  rows: RowModel[],
  isRefresh: boolean;
  currentPageIndex: number,
  job: DialogRowJobType,
  currentSelectedRow: RowModel,
}

type FetchLecture = {
  lectures: LectureRow[],
  pageIndex: number
}

export type RowHookAction<RowModel> =
  | { type: 'FETCH_ROWS_SUCCESS'; payload: [RowModel[], number] }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'REFRESH_DATA' }
  | { type: 'SET_CURRENT_ROW'; payload: RowModel }
  | { type: 'TOGGLE_DIALOG'; payload: DialogRowJobType }
  | { type: 'OPEN_UPDATE_DIALOG'; payload: RowModel }
  | { type: 'OPEN_DELETE_DIALOG'; payload: RowModel }
  | { type: 'OPEN_CREATE_DIALOG'; payload: RowModel }
export type LectureHookAction =
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


export type TestReviewHookAction =
  | { type: 'FETCH_TEST_REVIEW_SUCCESS'; payload: [TestReviewAnswerSheet, QuestionPage[]] }
  | { type: 'SET_ANSWER_SHEET_VISIBLE'; payload: boolean }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'MOVE_PAGE'; payload: number }
// | { type: 'FETCH_TEST_REVIEW_SUCCESS'; payload: TestReviewAnswerSheet }
