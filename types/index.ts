export interface Goal {
  id: string;
  name: string;
  category: string;
  timeframe: string;
  importance: number;
  progress: string;
  obstacles: string[];
  timeCommitment: string;
  approach: string;
}
export interface Task {
  id: string;
  name: string;
  completed: boolean;
  date: string;
  goalId: string;
}
export interface Memo {
  id: string;
  text: string;
  createdAt: Date;
}