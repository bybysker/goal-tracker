import { LucideIcon } from "lucide-react";
export type QuestionType = 'input' | 'textarea' | 'radio'


export interface Goal {
  guid: string;
  progress: number;
  name: string;
  deadline: string;
  description: string;
  measurable: string;
  achievable: string;
  relevance: number;
  timeframe: string;
  bandwidth: number;// time commitment in hours 
}

export interface GoalConfig {
  what: string
  why: string
  when: string
  resources: string
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
export interface Question {
  id: string
  question: string
  guidance?: string
  type: QuestionType
  icon: LucideIcon
  options?: string[]
}

export interface UserProfile {
  name: string
  openness: string
  conscientiousness: string
  extraversion: string
  agreeableness: string
  neuroticism: string
  passions: string
  lifeGoals: string
}
