import { DataTableValue } from "primereact/datatable";

export interface Category extends DataTableValue {
    id: string;  // ObjectId as a string
    format: string;
    year: number;
    testIds: string[];  // Array of test IDs as strings
  }
  
  export interface Test extends DataTableValue {
    id: string;  // ObjectId as a string
    name: string;
    isActive: boolean;
    totalUserAttempt: number;
    totalQuestion: number;
    totalScore: number;
    limitTime: number;
    questions: string[];  // Array of question IDs
  }
  
  export interface Question extends DataTableValue {
    id: string;  // ObjectId as a string
    questionNum: number;
    partNum: number;
    type: 'single' | 'group' | 'subquestion';  // Question types
    subQuestions?: string[];  // Optional array of subquestion IDs
    content: string;
    difficulty: number;
    topic: string[];  // Array of topic names
    resources: Resource[];  // Array of resources
    transcript?: string;
    explanation?: string;
    answers: string[];  // Array of answers
    correctAnswer: string;
  }
  
  export interface Resource extends DataTableValue {
    type: 'paragraph' | 'image' | 'audio';  // Resource types
    content: string;
  }
  
  
  export interface Result extends DataTableValue {
    id: string;  // ObjectId as a string
    testId: string;  // Reference to Test
    userId: string;  // Reference to User
    totalTime: number;
    totalReadingScore: number;
    totalListeningScore: number;
    totalCorrectAnswer: number;
    totalIncorrectAnswer: number;
    totalSkipAnswer: number;
    type: 'practice' | 'fulltest';  // Test type
    parts?: number[];  // Optional array of parts for practice
    userAnswers: UserAnswer[];  // Array of user's answers
  }
  
  export interface UserAnswer extends DataTableValue {
    questionId: string;  // Reference to Question
    answer: string;
    solution: string;
  }
  
  export interface User extends DataTableValue {
    id: string;  // ObjectId as a string
    email: string;
    refreshToken: string;
    roleId: string;  // Reference to Role
    target: number;
    testAttemptHistory: TestAttempt[];  // Array of test attempts
    learningProgress: LearningProgress[];  // Array of learning progress
  }
  
  export interface TestAttempt extends DataTableValue {
    testId: string;  // Reference to Test
    resultIds: string[];  // Array of Result IDs
    totalAttempt: number;
    averageScore: number;
    averageTime: number;
    highestScore: number;
  }
  
  export interface LearningProgress extends DataTableValue {
    courseId: string;  // Reference to Course
    isCompleted: boolean;
  }
  
  
  export interface Role extends DataTableValue {
    id: string;  // ObjectId as a string
    name: string;
    description: string;
    isActive: boolean;
    permissions: Permission[];  // Array of permissions
  }
  
  export interface Permission extends DataTableValue {
    name: string;
    apiPath: string;
    method: string;
    module: string;
  }
  
  
  export interface Course extends DataTableValue {
    id: string;  // ObjectId as a string
    name: string;
    topic: string[];  // Array of topic names
    format: string;
    difficulty: number;
    lecture: Lecture;
    assignment: Assignment;
  }
  
  export interface Lecture extends DataTableValue {
    title: string;
    content: string;
    description: string;
  }
  
  export interface Assignment extends DataTableValue {
    required: number;
    totalQuestion: number;
    questionIds: string[];  // Array of Question IDs
  }
  