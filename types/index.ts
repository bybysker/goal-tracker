export interface Goal {
  id: string;
  title: string;
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
  title: string;
  completed: boolean;
  date: string;
  goalId: string;
}
export interface Memo {
  id: string;
  text: string;
  createdAt: Date;
}