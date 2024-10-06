import { DataTableValue } from "primereact/datatable";

export interface TestCategory extends DataTableValue {
    id: string;
    format: string;
    year: number;
    createdAt: Date;
    updatedAt: Date;
    tests: string[];
    isActive:boolean;
}

export interface Lecture {
    title: string;
    content: string;
    description: string;
}

export interface Course {
    id: string;
    name: string;
    topic: string;
    format: string;
    difficulty: string;
    lecture: Lecture;
    content: string;
    description: string;
    questionIds: string[];
    
    // Including BaseEntity properties directly
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

export interface Answer {
    answerOption: string;
    content: string;
    isCorrect: boolean;
}

export interface Question {
    id: string;
    number: string;
    content: string;
    difficulty: string;
    transcript: string;
    answers: Answer[];
    
    // Injecting BaseEntity properties directly
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

export interface Permission {
    name: string;
    apiPath: string;
    method: string;
    module: string;
}

export interface Role {
    id: string;
    name: string;
    description: string;
    permissions: Permission[];
    users: User[];

    // Injecting BaseEntity properties directly
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

export interface QuestionGroup {
    audioUrl: string;
    imageUrls: string[];
    paragraphs: string[];
    questionIds: string[];
    transcript: string;
}

export interface Part {
    number: string;
    questionGroups: QuestionGroup[];
}

export interface Test {
    id: string;
    name: string;
    format: string;
    totalUserAttempt: string;
    totalQuestion: number;
    totalScore: number;
    timeLimit: string;
    fullTestAudioUrl: string;
    parts: Part[];

    // Injecting BaseEntity properties directly
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

export interface TestResult {
    id: string;
    totalScore: number;
    totalTime: string;
    totalReadingScore: number;
    totalListeningScore: number;
    totalCorrectAnswers: number;
    totalIncorrectAnswers: number;
    totalSkipAnswers: number;
    attemptDate: string;
    answers: Answer[];

    // Injecting BaseEntity properties directly
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

export interface User {
    id: string;
    email: string;
    avatar: string;
    refreshToken: string;
    testAttemptHistory: Attempt[];
    learningProgress: Learning[];
    role_id: string;

    // Injecting BaseEntity properties directly
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

export interface Attempt {
    testId: string;
    totalAttempt: number;
    averageScore: number;
    averageTime: number;
    highestScore: number;
    result_id: string;
}

export interface Learning {
    course_id: string;
    isCompleted: boolean;
}
