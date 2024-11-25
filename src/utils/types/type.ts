import { DataTableValue } from "primereact/datatable";
import { TreeNode } from "primereact/treenode";
import { Dispatch } from "react";


export interface Category extends CategoryRow {
  tests: Test[];
}

// Lecture Collection
export interface Lecture extends DataTableValue {
  id: string;
  name: string;
  topic: string[];
  format: string;
  difficulty: number;
  doctrine: Doctrine;
  assignment: Assignment;
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

export interface Doctrine extends DataTableValue {
  title: string;
  content: string;
}

export interface Assignment extends DataTableValue {
  required: number;
  totalQuestion: number;
  questionIds: string[];  // List of Question IDs
}

// Question Collection
export interface QuestionRow extends DataTableValue {
  id: QuestionID;
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
  type: 'paragraph' | 'image' | 'audio';  // Resource type
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
}

// Role Collection
export interface Role extends DataTableValue {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  users: User[];  // List of Users
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission extends DataTableValue {
  name: string;
  apiPath: string;
  method: string;
  module: string;
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
  message: any,
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
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User Collection
export interface UserRow extends DataTableValue {
  id: string;
  email: string;
  avatar: string;
  roleName: string;
  target: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface UserResultRow {
  id: ResultID,
  createdAt: Date,
  totalCorrectAnswer: number,
  totalTime: number,
  type: TestType;
  parts: number[];  // Practice parts
}

export type UserDetailResultRow = UserResultRow & {
  testFormatAndYear: string,
  totalReadingScore: number,
  totalListeningScore: number,
  totalIncorrectAnswer: number,
  totalSkipAnswer: number,

}

export interface TestPaper {
  totalQuestion: number,
  listMultipleChoiceQuestions: MultipleChoiceQuestion[]
}

export interface QuestionPage {
  questionNum: QuestionNumber,
  page: number,
}

export interface UserAnswerResult {
  questionId: QuestionID;
  answer: string;
  solution: string;
  timeSpent: number;
  correct: boolean;
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



export type TestResultSummary = {
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

export interface QuestionDetailRecord {
  type: QuestionType;
  subQuestions: QuestionDetailRecord[];
  content: string;
  resources: Resource[];
  transcript: string;
  explanation: string;
  answers: string[];
  correctAnswer: string;
  userAnswer: string;
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



// ------------------------- tham số truyền
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

export interface DialogLectureActionProps {
  state: LectureHookState;
  dispatch: Dispatch<LectureHookAction>;
}

export interface UserAnswerSheetProps {
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  ButtonListElement: JSX.Element[],
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
  parts: TopicRecord[][]
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

export interface LectureActionButtonProps {
  currentSelectedLecture: LectureRow,
  dispatch: Dispatch<LectureHookAction>
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

export interface DialogQuestionPageProps {
  setIsDialogVisible: React.Dispatch<React.SetStateAction<JSX.Element | null>>
  dialogBodyVisible: JSX.Element | null,
  title: string
}
//---------------------------- tên gọi khác
export type TestAnswerSheet = Map<QuestionNumber, AnswerPair>;
export type ResultID = string;
export type QuestionID = string;
export type QuestionNumber = number;
export type milisecond = number;
export type TestID = string;
export type LectureID = string;
export type PracticeAnswerSheet = Map<QuestionID, string>;
export type CategoryID = string;
export type TopicID = string;
export type ResponseUserResultList = ApiResponse<TableData<UserDetailResultRow>>;
export type UserAnswerTimeCounter = Map<QuestionNumber, milisecond>
export type TestType = 'fulltest' | 'practice' | 'survival';
export type QuestionType = 'single' | 'group' | 'subquestion' | 'ABCD';
export type ExerciseType = "partNum=1" | "partNum=2" | "partNum=3" | "partNum=4" | "partNum=5" | "partNum=6" | "partNum=7" | "TOPIC=grammar" | "TOPIC=vocabulary";

export type Name_ID<T extends string> = T;

//-----------------------------reducer---------------------
export interface LectureHookState {
  lectures: LectureRow[],
  currentPageIndex: number,
  title: string,

}

export type LectureHookAction =
  | { type: 'FETCH_SUCCESS'; payload: LectureRow[] }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_CURRENT_LECTURE'; payload: LectureRow }
  | { type: 'TOGGLE_DIALOG'; payload: string }
