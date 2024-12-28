import { DataTableValue } from "primereact/datatable";
import { Dispatch, SetStateAction } from "react";
import { NavigateFunction } from "react-router-dom";


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

export interface UserComment {
  id: UserCommentID;
  text: string;
  email: string;
  userId: UserID;
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
  meta: Meta;
  result: T[];
}

export interface Meta {
  current: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface WorkerResponse<T> {
  status: 'success' | 'error';
  data: T;
  message: string;
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
  active: boolean;
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

export interface QuestionAnswerRecord {
  id: string;
  questionNum: number;
  type: string;
  partNum: number;
  subQuestions: QuestionAnswerRecord[];
  content: string;
  resources: Resource[];
  answers: string[];
  pageIndex: number;
  userAnswer: string;
}

export interface TestPaperRecord {
  totalQuestion: number,
  listMultipleChoiceQuestions: QuestionAnswerRecord[]
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

export interface AnswerData {
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
export interface ResultOverview {
  createdAt: Date; // Use ISO string for Instant in Java
  result: ResultID; // e.g., "x/200", "x/30"
  totalTime: number;
  totalReadingScore: number;
  totalListeningScore: number;
  totalCorrectAnswer: number;
  totalIncorrectAnswer: number;
  totalSkipAnswer: number;
  type: TestType;
  parts: string; // "Practice parts"
}

export interface TopicOverview {
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
  type: TestType;
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


export interface DoTestFunction {
  updateTimeSpentOnEachQuestionInCurrentPage: () => void;
  setIsOnTest: Dispatch<SetStateAction<boolean>>;
  changePage: (offset: number) => void;
  startTest: () => void;
  navigate: NavigateFunction;
}



export interface TopicRecord extends DataTableValue {
  topic: string,
  correctCount: number,
  wrongCount: number,
  correctPercent: number,
}


export type AnswerRecord = AnswerData & {
  timeSpent: milisecond;
}


export type RenderTestRefType = {
  pageMapper: QuestionPage[]
  timeSpentList: UserAnswerTimeCounter
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

export interface QuestionListByPart {
  questionList: QuestionAnswerRecord[],
  totalQuestions: number,
}
//---------------------------- tên gọi khác
export type TestAnswerSheet = Map<QuestionNumber, AnswerData>;
export type ResultID = string;
export type QuestionID = string;
export type UserID = string;
export type QuestionNumber = number;
export type milisecond = number;
export type TestID = string;
type RoleID = string;
export type PermissionID = string;
export type LectureID = string;
export type UserCommentID = string;
export type PracticeAnswerSheet = Map<QuestionID, string>;
export type TestReviewAnswerSheet = UserAnswerRecord[];
export type CategoryID = string;
export type TopicID = string;
export type ResponseUserResultList = ApiResponse<TableData<UserDetailResultRow>>;
export type UserAnswerTimeCounter = Map<QuestionNumber, milisecond>
export type ResourceType = 'paragraph' | 'image' | 'audio'
export type TestType = 'fulltest' | 'practice' | 'exercise' | 'thi thử' | 'làm 1 phần' | 'luyện tập';
export type QuestionType = 'single' | 'group' | 'subquestion' | 'ABCD';
export type ExerciseType = "partNum=1" | "partNum=2" | "partNum=3" | "partNum=4" | "partNum=5" | "partNum=6" | "partNum=7" | "topic=Câu hỏi ngữ pháp" | "topic=Câu hỏi từ vựng";
export type DialogLectureJobType = '' | 'CREATE' | 'UPDATE' | 'DELETE' | 'PAGE_DESIGNER' | 'QUESTION_EDITOR';
export type DialogRowJobType = '' | 'CREATE' | 'UPDATE' | 'DELETE';
export type ColorString = "success" | "info" | "warning" | "danger" | 'secondary' | 'help';
export type Name_ID<T extends string> = T;
export type TestDocument = QuestionListByPart[]
export type TestSheet = QuestionListByPart
//-----------------------------reducer---------------------



export interface MultiQuestionRef {
  lastTimeStampRef: number,
  timeDoTest: number,
  timeSpentListRef: UserAnswerTimeCounter,
  abortControllerRef: AbortController | null,
  totalQuestions: number
}




