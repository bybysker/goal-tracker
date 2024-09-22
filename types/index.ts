
export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
  }
  
  export interface Goal {
    id: number;
    title: string;
    deadline: string;
    category: string;
    progress: number;
  }
  
  export interface Challenge {
    id: number;
    title: string;
  }
  
  export interface Task {
    id: number;
    title: string;
    completed: boolean;
    date: string;
  }
  