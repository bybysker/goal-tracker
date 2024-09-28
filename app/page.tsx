"use client"

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import axios from 'axios';


import Header from '@/components/header';
import Dashboard from '@/components/dashboard';
import GoalsAndChallenges from '@/components/goals-and-challenges';
import Tasks from '@/components/tasks';
import CalendarComponent from '@/components/calendar-component';
import VoiceMemo from '@/components/voice-memo';
import Settings from '@/components/settings';
import Profile from '@/components/profile';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

import { Goal, Challenge, Task } from '@/types';
//import { User as FirebaseUser } from 'firebase/auth';

import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db, storage } from '@/db/configFirebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const GoalTrackerApp: React.FC = () => {
  const { user, handleSignOut } = useAuth();

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
  const [transcription, setTranscription] = useState<string | null>(null);
  const [reflection, setReflection] = useState<string | null>(null);

  // Voice Memo state
  const [voiceMemo, setVoiceMemo] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Listen to Goals collection
    const goalsRef = collection(db, 'users', user.uid, 'goals');
    const goalsUnsub = onSnapshot(goalsRef, (snapshot) => {
      const fetchedGoals: Goal[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          deadline: data.deadline,
          category: data.category,
          progress: data.progress,
        } as Goal;
      });
      setGoals(fetchedGoals);
    });

    // Listen to Challenges collection
    const challengesRef = collection(db, 'users', user.uid, 'challenges');
    const challengesUnsub = onSnapshot(challengesRef, (snapshot) => {
      const fetchedChallenges: Challenge[] = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
      } as Challenge));
      setChallenges(fetchedChallenges);
    });

    // Listen to Tasks collection
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    const tasksUnsub = onSnapshot(tasksRef, (snapshot) => {
      const fetchedTasks: Task[] = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        completed: doc.data().completed,
        date: doc.data().date,
      } as Task));
      setTasks(fetchedTasks);
    });

    // Listen to User document for streak and AI insights
    const userDocRef = doc(db, 'users', user.uid);
    const userUnsub = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setStreak(data.streak || 0);
        setAiInsights(data.aiInsights || []);
      }
    });

    return () => {
      goalsUnsub();
      challengesUnsub();
      tasksUnsub();
      userUnsub();
    };
  }, [user]);

  // CRUD operations for Goals
  const addGoal = async (goal: Omit<Goal, 'id' | 'progress'>) => {
    if (!user) {
      alert("User not authenticated.");
      return;
    }
    try {
      await addDoc(collection(db, 'users', user.uid, 'goals'), { ...goal, progress: 0 });
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  }

  const updateGoal = async (id: string, updatedGoal: Partial<Goal>) => {
    if (!user) {
      alert("User not authenticated.");
      return;
    }
    try {
      const goalRef = doc(db, 'users', user.uid, 'goals', id);
      await updateDoc(goalRef, updatedGoal);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  }

  const deleteGoal = async (id: string) => {
    if (!user) {
      alert("User not authenticated.");
      return;
    }
    try {
      const goalRef = doc(db, 'users', user.uid, 'goals', id);
      await deleteDoc(goalRef);
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  }

  // CRUD operations for Challenges
  const addChallenge = async (challenge: Omit<Challenge, 'id'>) => {
    if (!user) {
      alert("User not authenticated.");
      return;
    }
    try {
      await addDoc(collection(db, 'users', user.uid, 'challenges'), challenge);
    } catch (error) {
      console.error("Error adding challenge:", error);
    }
  }

  const updateChallenge = async (id: string, updatedChallenge: Partial<Challenge>) => {
    if (!user) {
      alert("User not authenticated.");
      return;
    }
    try {
      const challengeRef = doc(db, 'users', user.uid, 'challenges', id);
      await updateDoc(challengeRef, updatedChallenge);
    } catch (error) {
      console.error("Error updating challenge:", error);
    }
  }

  const deleteChallenge = async (id: string) => {
    if (!user) {
      alert("User not authenticated.");
      return;
    }
    try {
      const challengeRef = doc(db, 'users', user.uid, 'challenges', id);
      await deleteDoc(challengeRef);
    } catch (error) {
      console.error("Error deleting challenge:", error);
    }
  }

  // CRUD operations for Tasks
  const addTask = async (task: Omit<Task, 'id' | 'completed'>) => {
    if (!user) {
      alert("User not authenticated.");
      return;
    }
    try {
      await addDoc(collection(db, 'users', user.uid, 'tasks'), { ...task, completed: false });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    if (!user) return;
    try {
      const taskRef = doc(db, 'users', user.uid, 'tasks', id);
      await updateDoc(taskRef, updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  const deleteTask = async (id: string) => {
    if (!user) {
      alert("User not authenticated.");
      return;
    }
    try {
      const taskRef = doc(db, 'users', user.uid, 'tasks', id);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || !user) return;
    try {
      await updateTask(id, { completed: !task.completed });
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  }

  // AI Insights Simulation (could be enhanced with actual AI integration)
  const simulateAiInsights = () => {
    // In a real app, this would make an API call to OpenAI or another AI service
    const newInsight = "Based on your recent activities, you might want to focus more on your health goals.";
    setAiInsights([...aiInsights, newInsight]);

    // Optionally, save AI insights to Firestore
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      updateDoc(userDocRef, {
        aiInsights: [...aiInsights, newInsight]
      }).catch(error => console.error("Error updating AI insights:", error));
    }
  }

  // Save Settings Function
  const saveSettings = () => {
    if (!user) {
      alert("User not authenticated.");
      return;
    }
    // Implement settings save logic here (e.g., update user preferences in Firestore)
    const userDocRef = doc(db, 'users', user.uid);
    updateDoc(userDocRef, { darkMode, openaiApiKey })
      .then(() => console.log("Settings saved"))
      .catch(error => console.error("Error saving settings:", error));
  }

  // Update Profile Function
  const updateProfile = (profile: { name: string; email: string }) => {
    if (!user) {
      alert("User not authenticated.");
      return;
    }
    // Update Firebase Auth profile
    // Assuming you have additional user info stored in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    updateDoc(userDocRef, profile)
      .then(() => {
        console.log("Profile updated:", profile);
        // Optionally update Firebase Auth user profile
        // import { updateProfile as firebaseUpdateProfile } from 'firebase/auth';
        // firebaseUpdateProfile(user, { displayName: profile.name, email: profile.email })
        //   .then(() => console.log("Auth profile updated"))
        //   .catch(error => console.error("Error updating auth profile:", error));
      })
      .catch(error => console.error("Error updating profile:", error));
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-100 text-black'} flex flex-col items-center justify-start p-4`}>
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
              {activeTab === 'dashboard' && user && (
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
                  updateGoal={updateGoal} // Pass update functions if needed
                  updateChallenge={updateChallenge}
                />
              )}
              {activeTab === 'tasks' && (
                <Tasks
                  tasks={tasks}
                  addTask={addTask}
                  deleteTask={deleteTask}
                  toggleTaskCompletion={toggleTaskCompletion}
                  updateTask={updateTask} // Pass update functions if needed
                />
              )}
              {activeTab === 'calendar' && (
                <CalendarComponent
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  tasks={tasks.filter(task => new Date(task.date).toDateString() === selectedDate.toDateString())}
                  toggleTaskCompletion={toggleTaskCompletion}
                  deleteTask={deleteTask}
                />
              )}
              {activeTab === 'voice-memo' && (
                <VoiceMemo
                  voiceMemo={voiceMemo}
                  user={user}
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
