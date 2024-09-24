export interface Goal {
  id: string;
  title: string;
  deadline: string;
  category: string;
  progress: number;
}

export interface Challenge {
  id: string;
  title: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string;
}
  