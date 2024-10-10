export interface Goal {
  id: string;
  progress: string;
  name: string;
  measurable: string;
  achievable: string;
  relevance: number;
  timeframe: string;
  time_commitment: number;// sorry for not respecting the convention (its to ensure iso with api
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

export interface Milestone {
  id: string;
  name: string;
  description: string;
  duration_weeks: string; // sorry for not respecting the convention 
  completed: boolean;
  goalId: string;
}