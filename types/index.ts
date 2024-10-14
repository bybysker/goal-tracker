export interface Goal {
  guid: string;
  progress: number;
  name: string;
  measurable: string;
  achievable: string;
  relevance: number;
  timeframe: string;
  bandwidth: number;// time commitment in hours 
}

export interface Milestone {
  muid: string;
  name: string;
  description: string;
  duration: string; // duration is in weeks  
  completed: boolean;
  guid: string;
}

export interface Task {
  tuid: string;
  name: string;
  completed: boolean;
  date: string;
  guid: string;
  muid: string;
}
export interface Memo {
  id: string;
  text: string;
  createdAt: Date;
}
