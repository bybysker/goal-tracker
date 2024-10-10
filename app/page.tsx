"use client"

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/db/configFirebase';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

// Import components
import Sidebar from '@/components/sidebar';
import Dashboard from '@/components/dashboard';
import Goals from '@/components/goals';
import CalendarComponent from '@/components/calendar-component';
import Settings from '@/components/settings';
import Profile from '@/components/profile';

// Import types
import { Goal, Task, Memo, Milestone } from '@/types';
import axios from 'axios';

const GoalTrackerApp: React.FC = () => {
  const { user, handleSignOut } = useAuth();
  const router = useRouter();

  // Application data
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Firestore listeners (goals, tasks, memos)
    const goalsUnsub = onSnapshot(collection(db, 'users', user.uid, 'goals'), (snapshot) => {
      const fetchedGoals: Goal[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
      setGoals(fetchedGoals);
    });

    const tasksUnsub = onSnapshot(collection(db, 'users', user.uid, 'tasks'), (snapshot) => {
      const fetchedTasks: Task[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(fetchedTasks);
    });

    const memosUnsub = onSnapshot(collection(db, 'users', user.uid, 'memos'), (snapshot) => {
      const fetchedMemos: Memo[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Memo));
      setMemos(fetchedMemos);
    });

    return () => {
      goalsUnsub();
      tasksUnsub();
      memosUnsub();
    };
  }, [user, router]);

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

  const addMilestone = async (milestone: Omit<Milestone, 'id'>) => {
    if (!user) {
      alert("User not authenticated.");
      return;
    }
    try {
      await addDoc(collection(db, 'users', user.uid, 'milestones'), milestone);
    } catch (error) {
      console.error("Error adding milestone:", error);
    }
  }

  const updateGoal = async (id: string, updatedGoal: Partial<Goal>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'goals', id), updatedGoal);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  }

  const deleteGoal = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'goals', id));
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  }

  const addMemo = async (memo: Omit<Memo, 'id'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'memos'), memo);
    } catch (error) {
      console.error("Error adding memo:", error);
    }
  }

  const addTask = async (task: Omit<Task, 'id'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'tasks'), task);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'tasks', id), updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
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


  const deleteTask = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'tasks', id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  // Generate/Update today's tasks
  const generateTodaysTasks = async () => {
    // Implement logic to generate or update tasks for today
    console.log("Generating today's tasks");
    if (!user) return;
    const response = await axios.post('/api/generate_tasks',  {
      user_id: user.uid,
      goal_id: user.uid,
      milestone_id: user.uid
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  // Update Profile Function
  const updateProfile = (profile: { name: string; email: string }) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    updateDoc(userDocRef, profile)
      .then(() => console.log("Profile updated:", profile))
      .catch(error => console.error("Error updating profile:", error));
  }

  // Save Settings Function
  const saveSettings = () => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    updateDoc(userDocRef, { darkMode })
      .then(() => console.log("Settings saved"))
      .catch(error => console.error("Error saving settings:", error));
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} flex`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} handleSignOut={handleSignOut} />
      
      <main className="flex-1 p-8">
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
                addMemo={addMemo}
                memos={memos}
                generateTodaysTasks={generateTodaysTasks}
                tasks={tasks}
                updateTask={updateTask}
                deleteTask={deleteTask}
                toggleTaskCompletion={toggleTaskCompletion}
              />
            )}
            {activeTab === 'goals' && (
              <Goals
                goals={goals}
                tasks={tasks}
                addGoal={addGoal}
                updateGoal={updateGoal}
                deleteGoal={deleteGoal}
                setIsEditing={() => {/* function logic here */}}
                addMilestone={addMilestone}
                toggleTaskCompletion={toggleTaskCompletion}
                deleteTask={deleteTask}
                user={user}
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
            {activeTab === 'profile' && (
              <Profile
                user={user}
                updateProfile={updateProfile}
              />
            )}
            {activeTab === 'settings' && (
              <Settings
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                saveSettings={saveSettings}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default GoalTrackerApp;