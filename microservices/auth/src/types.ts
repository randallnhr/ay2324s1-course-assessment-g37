export interface User {
  username: string;
  displayName: string;
  password: string;
  role: "basic" | "admin";
}

export type Question = {
  title: string;
  categories: string[];
  complexity: "Easy" | "Medium" | "Hard";
  description: string;
};
