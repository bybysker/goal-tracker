// Updated questionsUser.ts

import { 
  User, Heart, Flame, Sun,
  Trophy, Rocket, Clock, Target,
  Book, Mountain, Hourglass, Info,
  Flower, Globe, Award, Star,
  Swords
} from 'lucide-react';

export const questionsUser = [
  {
    id: 'name',
    question: "What's your name?",
    type: 'input',
    icon: User,
  },
  {
    id: 'openness',
    question: "When faced with new ideas or challenges, how likely are you to explore them enthusiastically?",
    type: 'radio',
    icon: Globe,
    options: [
      'Very Unlikely',
      'Unlikely',
      'Neutral',
      'Likely',
      'Very Likely',
    ],
  },
  {
    id: 'conscientiousness',
    question: "How often do you plan your tasks in advance and stick to your plans?",
    type: 'radio',
    icon: Trophy,
    options: [
      'Rarely',
      'Sometimes',
      'Often',
      'Always',
    ],
  },
  {
    id: 'extraversion',
    question: "You are in a group setting with new people. How likely are you to initiate a conversation?",
    type: 'radio',
    icon: Flame,
    options: [
      'Very Unlikely',
      'Unlikely',
      'Neutral',
      'Likely',
      'Very Likely',
    ],
  },
  {
    id: 'agreeableness',
    question: "When making decisions, how much do you consider other people’s feelings or preferences?",
    type: 'radio',
    icon: Heart,
    options: [
      'Not at All',
      'A Little',
      'Somewhat',
      'A Lot',
      'Always',
    ],
  },
  {
    id: 'neuroticism',
    question: "How often do you feel stressed or anxious about everyday situations?",
    type: 'radio',
    icon: Flower,
    options: [
      'Rarely',
      'Sometimes',
      'Often',
      'Always',
    ],
  },
  {
    id: 'passions',
    question: "What activities, subjects, or causes are you most passionate about?",
    type: 'textarea',
    icon: Flame,
  },
  {
    id: 'lifeGoals',
    question: "What long-term goals do you aspire to achieve?",
    type: 'textarea',
    icon: Award,
  },
];