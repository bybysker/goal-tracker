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
    id: 'coreValues',
    question: "List your top five personal values that guide your decisions and actions.",
    guidance: 'Values are fundamental beliefs like integrity, creativity, compassion, etc.',
    type: 'textarea',
    icon: Heart,
  },
  {
    id: 'passions',
    question: "What activities, subjects, or causes are you most passionate about?",
    guidance: 'Consider hobbies, interests, or issues that excite you.',
    type: 'textarea',
    icon: Flame,
  },
  /*  
  {
    id: 'purposeAndFulfillment',
    question: "Describe moments when you felt the most fulfilled or found deep meaning in what you were doing.",
    type: 'textarea',
    icon: Sun,
  },
  {
    id: 'productivityLevel',
    question: "How productive are you when focused on a task?",
    type: 'slider',
    min: 1,
    max: 5,
    icon: Target,
  },
  */
  {
    id: 'topStrengths',
    question: "What are your key strengths, talents, or skills?",
    guidance: 'Think about abilities you excel at or qualities others appreciate in you.',
    type: 'textarea',
    icon: Star,
  },
  /*
  {
    id: 'pastAchievements',
    question: "List accomplishments you're proud of and explain why they are significant to you.",
    type: 'textarea',
    icon: Trophy,
  },
  */
  {
    id: 'developmentOpportunities',
    question: "What skills or areas would you like to improve?",
    type: 'textarea',
    icon: Rocket,
  },
  {
    id: 'mainChallenges',
    question: "What limitations or obstacles have held you back, and how do you wish to overcome them?",
    type: 'checkbox',
    options: [
      'Time management',
      'Lack of motivation',
      'Limited resources',
      'Unclear planning',
      'Procrastination',
      'Other',
    ],
    icon: Swords
  },
  /*
  {
    id: 'envisionFuture',
    question: "Where do you see yourself in the next 5 to 10 years?",
    type: 'textarea',
    icon: Mountain,
  },
  */
  {
    id: 'lifeGoals',
    question: "What long-term goals do you aspire to achieve?",
    type: 'textarea',
    icon: Award,
  },
  /*
  {
    id: 'desiredImpact',
    question: "What positive impact do you want to make in your life, community, or the world?",
    type: 'textarea',
    icon: Globe,
  },
  {
    id: 'availableTime',
    question: "How much free time can you dedicate to your objectives each week?",
    type: 'radio',
    icon: Clock,
    options: [
      'Less than 5 hour',
      '5-10 hours',
      '10-20 hours',
      'More than 20 hours'
    ]
  },
  {
    id: 'learningStyle',
    question: "Which of the following best describes your learning style?",
    type: 'radio',
    icon: Book,
    options: ['Visual (seeing)', 'Auditory (hearing)', 'Reading/Writing', 'Kinesthetic (doing)', 'Multimodal'],
  },
  {
    id: 'procrastinationHabit',
    question: "Do you tend to procrastinate on tasks?",
    type: 'radio',
    icon: Hourglass,
    options: ['Never', 'Sometimes', 'Often', 'Always'],
  },
  {
    id: 'stressManagement',
    question: "How do you handle stress when working towards a goal?",
    type: 'radio',
    icon: Flower,
    options: ['Manage it well', 'Sometimes overwhelmed', 'Often stressed', 'Not sure'],
  },
  {
    id: 'furtherInfo',
    question: "Do you have any further information you'd like to share?",
    type: 'textarea',
    icon: Info,
  },
  */
];