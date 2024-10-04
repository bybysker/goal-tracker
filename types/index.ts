export interface Goal {
  id: string;
  title: string;
  deadline: string;
  category: string;
  progress: number;
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