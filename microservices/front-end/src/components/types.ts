export interface Question {
    id: number;
    title: string;
    description: string;
    category: string[];
    complexity: 'Easy' | 'Medium' | 'Hard';
}

export interface User {
    username: string;
    displayName: string;
    role: "basic" | "admin";
}