export interface Question {
    id: number;
    title: string;
    description: string;
    category: string[];
    complexity: 'Easy' | 'Medium' | 'Hard';
}