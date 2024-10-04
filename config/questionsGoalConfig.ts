// questionsConfig.ts

import { Target, List, Calendar, Star, Gauge, AlertTriangle, Clock, Heart, Sliders } from 'lucide-react';

export const questionsGoal = [
  {
    id: 'goal',
    question: 'What is the goal that you want to achieve?',
    type: 'textarea',
    icon: Target,
  },
  {
    id: 'category',
    question: 'Which category best describes your goal?',
    type: 'radio',
    options: [
      'Health & Fitness',
      'Career & Professional Development',
      'Education & Learning',
      'Personal Finance',
      'Relationships & Social',
      'Hobbies & Interests',
      'Other',
    ],
    icon: List,
  },
  {
    id: 'timeframe',
    question: 'What is your desired timeframe for achieving this goal?',
    type: 'radio',
    options: [
      'Less than 1 month',
      '1-3 months',
      '3-6 months',
      'Over 6 months',
      'No specific timeframe',
    ],
    icon: Calendar,
  },
  {
    id: 'importance',
    question: 'On a scale of 1-5, how important is this goal to you?',
    type: 'slider',
    min: 1,
    max: 5,
    icon: Star,
  },
  {
    id: 'progress',
    question: 'How would you rate your current progress toward this goal?',
    type: 'radio',
    options: [
      'Just starting out',
      'Made some progress',
      'Halfway there',
      'Nearly complete',
    ],
    icon: Gauge,
  },
  {
    id: 'obstacles',
    question: 'What obstacles do you anticipate in reaching your goal?',
    type: 'checkbox',
    options: [
      'Time management',
      'Lack of motivation',
      'Limited resources',
      'Unclear planning',
      'Procrastination',
      'Other',
    ],
    icon: AlertTriangle,
  },
  {
    id: 'time_commitment',
    question: 'How much time can you commit to working on this goal each week?',
    type: 'radio',
    options: [
      'Less than 1 hour',
      '1-3 hours',
      '3-5 hours',
      'More than 5 hours',
    ],
    icon: Clock,
  },
  {
    id: 'motivation',
    question: 'What motivates you to achieve this goal?',
    type: 'radio',
    options: [
      'Personal growth',
      'Career advancement',
      'Financial gain',
      'Health improvement',
      'Family & friends',
      'Other',
    ],
    icon: Heart,
  },
  {
    id: 'approach',
    question: 'Do you prefer a structured plan or a flexible approach?',
    type: 'radio',
    options: [
      'Highly structured',
      'Moderately structured',
      'Flexible',
      'Very flexible',
    ],
    icon: Sliders,
  },
];
