import { Target, Calendar, Gauge, Clock, Heart, Sliders } from 'lucide-react';

export const questionsGoal = [
  {
    id: 'name',
    question: 'What is your goal? Please be clear and specific.',
    guidance: 'Avoid vague descriptions. Example: Instead of "I want to get fit," specify "I want to run a 5k race without stopping within 3 months."',
    type: 'textarea',
    icon: Target,
  },
  {
    id: 'measurable',
    question: "How will you measure your progress and know when you've achieved your goal?",
    guidance: 'Use quantifiable indicators to track progress. Example: "I will track my running distance and time weekly."',
    type: 'textarea',
    icon: Gauge,
  },
  {
    id: 'achievable',
    question: 'Is this goal realistic in your current circumstances / setup?',
    guidance: 'Consider whether you have the resources and time, to achieve this goal. Example: "I will start by allocating 30 min to run 2km twice a week and gradually increase my distance over time."',
    type: 'textarea',
    icon: Sliders,
  },
  {
    id: 'relevance',
    question: 'What bigger purpose will this goal serve?',
    guidance: 'Explain why this goal is important. Example: "Running a 5k will improve my health and help me build discipline, which supports my overall fitness journey."',
    type: 'textarea',
    icon: Heart,
  },
  {
    id: 'timeframe',
    question: 'What is your desired timeframe for achieving this goal?',
    guidance: 'Set a realistic deadline. Example: "I want to complete the 5k race within the next 3 months."',
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
    id: 'bandwidth',
    question: 'How many hours per week can you dedicate to this goal?',
    guidance: 'Be honest about your availability. Example: "I can dedicate around 3-5 hours per week to running."',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    icon: Clock,
  },
];
