export interface Question {
    _id: string;
    title: string;
    description: string;
    categories: string[];
    complexity: 'Easy' | 'Medium' | 'Hard';
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
    complexity: 'Easy' | 'Medium' | 'Hard';
}