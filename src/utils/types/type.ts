import { DataTableValue } from "primereact/datatable";


export interface Category extends CategoryRow {
  tests: Test[];
}

// Course Collection
export interface Course extends DataTableValue {
  id: string;
  name: string;
  topic: string[];
  format: string;
  difficulty: number;
  lecture: Lecture[];
  assignment: Assignment;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface Lecture extends DataTableValue {
  title: string;
  content: string;
}

export interface Assignment extends DataTableValue {
  required: number;
  totalQuestion: number;
  questionIds: string[];  // List of Question IDs
}

// Question Collection
export interface Question extends DataTableValue {
  id: string;
  testId: string;  // Reference to Test
  questionNum: number;
  partNum: number;
  type: 'single' | 'group' | 'subquestion';
  subQuestions: Question[];  // List of subquestions
  content: string;
  difficulty: number;
  topic: string[];  // Array of topics
  resources: Resource[];
  transcript?: string;
  explanation?: string;
  answers: string[];  // Array of answers
  correctAnswer: string;
  isActive: boolean;
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
  userAnswers: UserAnswer[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAnswer extends DataTableValue {
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
  courses: Course[];  // List of Courses
  isCompleted: boolean;
}

//-------------------------------------------------REQUEST RESPONE OBJECT----------------------------------------------------------------
export interface RandomQutote {
  content: string,
  author: string,
}
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

export interface CourseOutLine {
  lectureTitles: string[];
  practiceTitles: PracticeTitle[];
}

export interface PracticeTitle {
  title: string;
  isCompleted: boolean
}

export interface CategoryLabel {
  format: string;
  year: number[];
}

export interface CourseCard {
  id: string,
  name: string,
  topic: string[],
  format: string,
  difficulty: number
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

export interface MultipleChoiceQuest {
  type: 'single' | 'group' | 'subquestion';
  subQuestions: MultipleChoiceQuest[];
  content: string;
  resources: Resource[];
  answers: string[];
}

export interface UserResultRow {
  id: ResultID,
  createdAt: Date,
  totalCorrectAnswer: number,
  totalTime: number,
  type: 'practice' | 'fulltest';
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



export interface TestResultSummary {
  createdAt: Date;
  totalTime: number;
  totalReadingScore: number;
  totalListeningScore: number;
  totalCorrectAnswer: number;
  totalIncorrectAnswer: number;
  totalSkipAnswer: number;
  type: TestType;
  parts: number[];
  questionRecords: QuestionDetailRecord[];
}

export interface PracticePaper {
  totalQuestions: number,
  practiceQuestions: PracticeQuestion[]
}

export interface PracticeQuestion {
  id: QuestionID;
  type: 'single' | 'group' | 'subquestion' | 'ABCD';
  subQuestions: PracticeQuestion[];
  content: string;
  resources: Resource[];
  transcript: string;
  explanation: string;
  answers: string[];
  correctAnswer: string;
}

export interface QuestionDetailRecord {
  type: 'single' | 'group' | 'subquestion';
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
// ------------------------- tham số truyền
export interface SimpleTimeCountDownProps {
  timeLeftInSecond: number;
  onTimeUp: () => void;
}

export interface UserAnswerSheetProps {
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  ButtonListElement: JSX.Element[],
}

export interface TestAreaProps {
  parts: string,
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

//---------------------------- tên gọi khác
export type TestAnswerSheet = Map<QuestionNumber, AnswerPair>;
export type ResultID = string;
export type QuestionID = string;
export type QuestionNumber = number;
export type milisecond = number;
export type TestID = string;
export type CourseID = string;
export type PracticeAnswerSheet = Map<QuestionID, string>;
export type CategoryID = string;
export type ResponseUserResultList = ApiResponse<TableData<UserDetailResultRow>>;
export type UserAnswerTimeCounter = Map<QuestionNumber, milisecond>
export type TestType = 'fulltest' | 'practice' | 'survival'