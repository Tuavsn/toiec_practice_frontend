import { DataTableValue } from "primereact/datatable";

// Category Collection
export interface CategoryRow extends DataTableValue {
  id: string;
  format: string;
  year: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category extends CategoryRow {
  tests: Test[];
}

// Course Collection
export interface Course extends DataTableValue {
  id: string;
  name: string;
  topic: string[];  // Array of topic names
  format: string;
  difficulty: number;
  lecture: Lecture;
  assignment: Assignment;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lecture extends DataTableValue {
  title: string;
  content: string;
  description: string;
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

// Test Collection
export interface TestRow extends DataTableValue {
  id: string;
  name: string;
  totalUserAttempt: number;
  totalQuestion: number;
  totalScore: number;
  limitTime: number;
  questions: Question[];  // List of questions
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Test extends TestRow {
  category: Category;  // Reference to Category
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
