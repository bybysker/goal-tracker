"use client"

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from "framer-motion";

import Header from '@/components/header';
import Dashboard from '@/components/dashboard';
import GoalsAndChallenges from '@/components/goals-and-challenges';
import Tasks from '@/components/tasks';
import CalendarComponent from '@/components/calendar-component';
import VoiceMemo from '@/components/voice-memo';
import Settings from '@/components/settings';
import Profile from '@/components/profile';
import { useAuth } from '@/hooks/useAuth';

import { User, Goal, Challenge, Task } from '@/types';

const GoalTrackerApp: React.FC = () => {
  // User data
  const [user, setUser] = useState<User | null>(null);
  const { handleSignOut } = useAuth();
  
  // Application data
  const [goals, setGoals] = useState<Goal[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [streak, setStreak] = useState<number>(0);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [openaiApiKey, setOpenaiApiKey] = useState<string>('');

  // Voice Memo state
  const [voiceMemo, setVoiceMemo] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    // Fetch user data (replace with real data fetching logic)
    const fetchedUser: User = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '/avatar.png',
    };
    setUser(fetchedUser);

    // Initialize application data
    setGoals([
      { id: 1, title: 'Learn React', deadline: '2024-12-31', category: 'professional', progress: 60 },
      { id: 2, title: 'Exercise regularly', deadline: '2024-12-31', category: 'health', progress: 40 },
    ]);
    setChallenges([
      { id: 1, title: 'Meditate for 10 minutes daily' },
      { id: 2, title: 'Read a book every month' },
    ]);
    setTasks([
      { id: 1, title: 'Complete React tutorial', completed: false, date: '2024-06-15' },
      { id: 2, title: 'Go for a 30-minute run', completed: true, date: '2024-06-15' },
    ]);
    setStreak(5); // Simulating a 5-day streak
    setAiInsights([
      "You've been consistently working on your professional goals. Keep it up!",
      "Consider increasing your focus on health-related tasks to maintain a good work-life balance.",
    ]);
  }, []);

  // CRUD operations for Goals
  const addGoal = (goal: Omit<Goal, 'id' | 'progress'>) => {
    setGoals([...goals, { ...goal, id: Date.now(), progress: 0 }]);
  }

  const updateGoal = (id: number, updatedGoal: Partial<Goal>) => {
    setGoals(goals.map(goal => goal.id === id ? { ...goal, ...updatedGoal } : goal));
  }

  const deleteGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
  }

  // CRUD operations for Challenges
  const addChallenge = (challenge: Omit<Challenge, 'id'>) => {
    setChallenges([...challenges, { ...challenge, id: Date.now() }]);
  }

  const updateChallenge = (id: number, updatedChallenge: Partial<Challenge>) => {
    setChallenges(challenges.map(challenge => challenge.id === id ? { ...challenge, ...updatedChallenge } : challenge));
  }

  const deleteChallenge = (id: number) => {
    setChallenges(challenges.filter(challenge => challenge.id !== id));
  }

  // CRUD operations for Tasks
  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    setTasks([...tasks, { ...task, id: Date.now(), completed: false }]);
  }

  const updateTask = (id: number, updatedTask: Partial<Task>) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, ...updatedTask } : task));
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  }

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }

  // Voice Memo Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.start();

      const audioChunks: Blob[] = [];
      mediaRecorder.current.addEventListener("dataavailable", (event: BlobEvent) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setVoiceMemo(URL.createObjectURL(audioBlob));
      });

      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  }

  // AI Insights Simulation
  const simulateAiInsights = () => {
    // In a real app, this would make an API call to OpenAI
    const newInsight = "Based on your recent activities, you might want to focus more on your health goals.";
    setAiInsights([...aiInsights, newInsight]);
  }

  // Save Settings Function
  const saveSettings = () => {
    // Implement settings save logic here (e.g., update user preferences)
    console.log("Settings saved:", { darkMode, openaiApiKey });
  }

  // Update Profile Function
  const updateProfile = (profile: { name: string; email: string }) => {
    if (user) {
      setUser({ ...user, ...profile });
      // Implement additional profile update logic here (e.g., API call)
      console.log("Profile updated:", profile);
    }
  }


  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-100'} flex flex-col items-center justify-start p-4`}>
      {user ? (
        <div className="w-full max-w-4xl">
          {/* Header with Tabs and Sign Out */}
          <Header activeTab={activeTab} setActiveTab={setActiveTab} SignOut={handleSignOut} />

          {/* Animated Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && (
                <Dashboard
                  user={user}
                  goals={goals}
                  challenges={challenges}
                  streak={streak}
                  tasks={tasks}
                  aiInsights={aiInsights}
                  simulateAiInsights={simulateAiInsights}
                />
              )}
              {activeTab === 'goals' && (
                <GoalsAndChallenges
                  goals={goals}
                  challenges={challenges}
                  addGoal={addGoal}
                  deleteGoal={deleteGoal}
                  addChallenge={addChallenge}
                  deleteChallenge={deleteChallenge}
                  setIsEditing={() => { /* Implement editing logic */ }}
                />
              )}
              {activeTab === 'tasks' && (
                <Tasks
                  tasks={tasks}
                  addTask={addTask}
                  deleteTask={deleteTask}
                  toggleTaskCompletion={toggleTaskCompletion}
                />
              )}
              {activeTab === 'calendar' && (
                <CalendarComponent
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  tasks={tasks}
                  toggleTaskCompletion={toggleTaskCompletion}
                  deleteTask={deleteTask}
                />
              )}
              {activeTab === 'voice-memo' && (
                <VoiceMemo
                  voiceMemo={voiceMemo}
                  isRecording={isRecording}
                  startRecording={startRecording}
                  stopRecording={stopRecording}
                />
              )}
              {activeTab === 'settings' && (
                <Settings
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  openaiApiKey={openaiApiKey}
                  setOpenaiApiKey={setOpenaiApiKey}
                  saveSettings={saveSettings}
                />
              )}
              {activeTab === 'profile' && (
                <Profile
                  user={user}
                  updateProfile={updateProfile}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        // User is not logged in; handle accordingly
        <p>Loading...</p>
      )}
    </div>
  )
}

export default GoalTrackerApp;
