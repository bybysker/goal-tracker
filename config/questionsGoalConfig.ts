import { Target, Calendar, Gauge, Clock, Heart, Sliders } from 'lucide-react';

export const questionsGoal = [
  {
    id: 'name',
    question: 'What is your goal? Please be as specific as possible.',
    guidance: 'Avoid being vague. Example: Instead of "I want to get fit," say "I want to run a 5k without stopping in 3 months."',
    type: 'textarea',
    icon: Target,
  },
  {
    id: 'measurable',
    question: "How will you track your progress and know when you've reached your goal?",
    guidance: 'Use clear measurements. Example: "I’ll track how far and how fast I run each week."',
    type: 'textarea',
    icon: Gauge,
  },
  {
    id: 'achievable',
    question: 'Is this goal achievable given your current situation?',
    guidance: 'Think about if you have the time and resources to achieve it. Example: "I’ll start by running 30 minutes twice a week and gradually increase."',
    type: 'textarea',
    icon: Sliders,
  },
  {
    id: 'relevance',
    question: 'Why is this goal important to you?',
    guidance: 'Explain how it fits into your bigger plans. Example: "Running a 5k will improve my health and help me stay disciplined in my fitness journey."',
    type: 'textarea',
    icon: Heart,
  },
  {
    id: 'timeframe',
    question: 'By when do you want to achieve this goal?',
    guidance: 'Pick a realistic deadline. Example: "I want to run the 5k in the next 3 months."',
    type: 'radio',
    options: [
      'Less than 1 month',
      '1-3 months',
      '3-6 months',
      'Over 6 months',
      'No specific deadline',
    ],
    icon: Calendar,
  },
  {
    id: 'bandwidth',
    question: 'How many hours per week can you spend working on this goal?',
    guidance: 'Be realistic about how much time you have. Example: "I can spend 3-5 hours a week running."',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    icon: Clock,
  },
];