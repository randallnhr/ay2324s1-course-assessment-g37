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

export type FindMatchRequest = {
    userId: string
    complexity: QuestionComplexity
}

export type CancelMatchRequest = {
    userId: string
    complexity: null
}

export type MatchRequest = FindMatchRequest | CancelMatchRequest

export type MatchResponse = FindMatchRequest & {
  roomId:  string
}

export type SocketEventHandlers = {
    [event: string]: () => void
}