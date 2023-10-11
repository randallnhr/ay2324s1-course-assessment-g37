export interface User {
  username: string;
  displayName: string;
  password: string;
  role: "basic" | "admin";
}

export interface UserWithoutPassword {
  username: string;
  displayName: string;
  role: "basic" | "admin";
}

export type Complexity = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  _id: string;
  title: string;
  categories: string[];
  complexity: Complexity;
  description: string;
}

export type MatchRequest = {
  userId: string
  complexity: Complexity
}

export type MatchResponse = MatchRequest & {
  roomId: string
}
