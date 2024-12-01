import { Target, Calendar, Clock, Heart, Hammer } from 'lucide-react';

export const questionsGoal = [
  {
    id: 'what',
    question: 'What is your goal?',
    guidance: 'Try to be as specific as possible.',
    type: 'textarea',
    icon: Target,
  },
  {
    id: 'why',
    question: 'Why is this goal important to you?',
    guidance: 'Explain your motivation for achieving this goal.',
    type: 'textarea',
    icon: Heart,
  },
  {
    id: 'when',
    question: 'When do you want to achieve this goal?',
    guidance: 'Set a clear and realistic deadline.',
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
  /*
  {
    id: 'resources',
    question: 'What resources or support do you need to achieve this goal?',
    guidance: 'List the tools, skills, or help you require to succeed.',
    type: 'textarea',
    icon: Hammer,
  },
  */
];
