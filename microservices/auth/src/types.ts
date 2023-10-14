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

export interface Question {
  _id: string;
  title: string;
  categories: string[];
  complexity: "Easy" | "Medium" | "Hard";
  description: string;
}

export interface HistoryItem {
  username: string;
  timestamp: string;
  questionId: string;
  text: string;
}
