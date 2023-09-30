export type QuestionComplexity = 'Easy' | 'Medium' | 'Hard'

export interface Question {
    _id: string;
    title: string;
    description: string;
    categories: string[];
    complexity: QuestionComplexity
}

export interface User {
    username: string;
    displayName: string;
    role: "basic" | "admin";
}

export interface NewQuestion {
    title: string;
    description: string;
    categories: string[];
    complexity: QuestionComplexity
}
