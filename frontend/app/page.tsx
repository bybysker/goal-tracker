"use client"

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/db/configFirebase';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

// Import components
import DockNavigation from '@/components/nav-dock';
import Sidebar from '@/components/sidebar';
import Dashboard from '@/components/dashboard';
import Goals from '@/components/goals';
import CalendarComponent from '@/components/calendar-component';
import Settings from '@/components/settings';
import Profile from '@/components/profile';

// Import types
import { Goal, Task, Milestone } from '@/types';
import axios from 'axios';

const GoalTrackerApp: React.FC = () => {
  const { user, handleSignOut } = useAuth();
  const router = useRouter();

  // Application data
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});
  const [milestones, setMilestones] = useState<Record<string, Milestone[]>>({});
  const [activeTab, setActiveTab] = useState<string>('goals');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const tasksArray: Task[] = Object.values(tasks).flat();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Firestore listeners for goals
    const goalsUnsub = onSnapshot(collection(db, 'users', user.uid, 'goals'), (goalsSnapshot) => {
      const fetchedGoals: Goal[] = goalsSnapshot.docs.map(goalDoc => {
        const goalData = { guid: goalDoc.id, ...goalDoc.data() } as Goal;
        return goalData;
      });
      setGoals(fetchedGoals);

      // For each goal, set up listeners for milestones
      const milestonesUnsubs = fetchedGoals.map(goal => {
        return onSnapshot(collection(db, 'users', user.uid, 'goals', goal.guid, 'milestones'), (milestonesSnapshot) => {
          const fetchedMilestones: Milestone[] = milestonesSnapshot.docs.map(milestoneDoc => ({
            muid: milestoneDoc.id,
            ...milestoneDoc.data(),
          } as Milestone));

          // Update the milestones for this specific goal
          setMilestones(prevMilestones => ({
            ...prevMilestones,
            [goal.guid]: fetchedMilestones,
          }));

          // For each milestone, set up listeners for tasks
          const tasksUnsubs = fetchedMilestones.map(milestone => {
            return onSnapshot(collection(db, 'users', user.uid, 'goals', goal.guid, 'milestones', milestone.muid, 'tasks'), (tasksSnapshot) => {
              const fetchedTasks: Task[] = tasksSnapshot.docs.map(taskDoc => ({
                tuid: taskDoc.id,
                ...taskDoc.data(),
              } as Task));

              // Update the tasks for this specific milestone
              setTasks(prevTasks => ({
                ...prevTasks,
                [milestone.muid]: fetchedTasks,
              }));
            });
          });

          // Return function to unsubscribe from tasks listeners
          return () => tasksUnsubs.forEach(unsub => unsub());
        });
      });

      // Cleanup function to unsubscribe from milestones listeners
      return () => milestonesUnsubs.forEach(unsub => unsub());
    });

    // Cleanup function to unsubscribe from goals listener
    return () => {
      goalsUnsub();
    };
  }, [user, router]);

  // CRUD operations for Goals
  const addGoal = async (goal: Omit<Goal, 'guid' | 'progress'>): Promise<string> => {
    if (!user) {
      alert("User not authenticated.")
      return ''
    }
    try {
      const docRef = await addDoc(collection(db, 'users', user.uid, 'goals'), { ...goal, progress: 0 })
      return docRef.id
    } catch (error) {
      console.error("Error adding goal:", error)
      return ''
    }
  }

  const addMilestone = async (milestone: Omit<Milestone, 'id'>): Promise<string> => {
    if (!user) return ''
    try {
      const docRef = await addDoc(collection(db, 'users', user.uid, 'goals', milestone.guid, 'milestones'), milestone)
      return docRef.id
    } catch (error) {
      console.error("Error adding milestone:", error)
      return ''
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
      // Fetch milestones for the goal
      const milestonesSnapshot = await getDocs(collection(db, 'users', user.uid, 'goals', id, 'milestones'));
      
      // Delete each milestone and its tasks
      const deletePromises = milestonesSnapshot.docs.map(async (milestoneDoc) => {
        const milestoneId = milestoneDoc.id;
        
        // Fetch tasks for the milestone
        const tasksSnapshot = await getDocs(collection(db, 'users', user.uid, 'goals', id, 'milestones', milestoneId, 'tasks'));
        
        // Delete each task
        const taskDeletePromises = tasksSnapshot.docs.map(taskDoc => deleteDoc(doc(db, 'users', user.uid, 'goals', id, 'milestones', milestoneId, 'tasks', taskDoc.id)));
        await Promise.all(taskDeletePromises);
        
        // Delete the milestone
        return deleteDoc(doc(db, 'users', user.uid, 'goals', id, 'milestones', milestoneId));
      });

      // Wait for all milestones and their tasks to be deleted
      await Promise.all(deletePromises);
      
      // Finally, delete the goal
      await deleteDoc(doc(db, 'users', user.uid, 'goals', id));
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  }

  const addTask = async (task: Omit<Task, 'id'>): Promise<string> => {
    if (!user) return ''
    try {
      const docRef = await addDoc(collection(db, 'users', user.uid, 'goals', task.guid, 'milestones', task.muid, 'tasks'), task)
      return docRef.id
    } catch (error) {
      console.error("Error adding task:", error)
      return ''
    }
  }

  const updateTask = async (task: Task, updatedTask: Partial<Task>): Promise<void> => {
    if (!user) {
      console.error("User not authenticated.");
      return;
    }
    try {
      const taskDocRef = doc(db, 'users', user.uid, 'goals', task.guid, 'milestones', task.muid, 'tasks', task.tuid);
      await updateDoc(taskDocRef, updatedTask);
      console.log("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
    }
}
  
  const toggleTaskCompletion = async (task: Omit<Task, 'id'>) => {
    if (!user) return;
    try {
      const taskDocRef = doc(db, 'users', user.uid, 'goals', task.guid, 'milestones', task.muid, 'tasks', task.tuid);
      const newCompletionStatus = !task.completed;
      await updateDoc(taskDocRef, { completed: newCompletionStatus });
      console.log(`Task completion status updated to ${newCompletionStatus}`);
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };


  const deleteTask = async (task: Omit<Task, 'id'>) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'goals', task.guid, 'milestones', task.muid, 'tasks', task.tuid));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  // Generate/Update today's tasks
  const generateTodaysTasks = async () => {
    // Implement logic to generate or update tasks for today
    console.log("Generating today's tasks");
    
    if (!user) return;

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/generate_tasks`, {
        user_id: user.uid,
        guid: user.uid,
        muid: user.uid
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Handle the response as needed
      console.log("Tasks generated successfully:", response.data);
    } catch (error) {
      console.error("Error generating tasks:", error);
    }
  };

  // Update Profile Function
  const updateProfile = (profile: { name: string; email: string }) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    updateDoc(userDocRef, profile)
      .then(() => console.log("Profile updated:", profile))
      .catch(error => console.error("Error updating profile:", error));
  }


  return (
    <div className="bg-gradient-to-b from-[#150578] via-[#192BC2] to-[#0E0E52] flex">
      
      {/* Enhanced Particle Effect Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0"
        />
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              backgroundColor: '#78C0E0',
            }}
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Animated Lines */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M0 100 Q250 50 500 100 T1000 100"
          fill="none"
          stroke="#78C0E0"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.path
          d="M0 200 Q250 150 500 200 T1000 200"
          fill="none"
          stroke="#449DD1"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
        />
      </svg>

      {/* Glowing Orbs */}
      <motion.div
        className="fixed top-1/4 left-1/4 w-32 h-32 rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${hexToRGBA('#78C0E0', 0.4)} 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="fixed bottom-1/4 right-1/4 w-48 h-48 rounded-full"
        style={{
          background: `radial-gradient(circle at 70% 70%, ${hexToRGBA('#449DD1', 0.3)} 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} handleSignOut={handleSignOut} /> */}
      <DockNavigation activeTab={activeTab} setActiveTab={setActiveTab} handleSignOut={handleSignOut} />
      <main className="min-h-screen relative flex-1 px-8 py-16">
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
                generateTodaysTasks={generateTodaysTasks}
                tasks={tasksArray}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            )}
            {activeTab === 'goals' && (
              <Goals
                goals={goals}
                addGoal={addGoal}
                updateGoal={updateGoal}
                deleteGoal={deleteGoal}
                setIsEditing={() => {/* function logic here */}}
                addMilestone={addMilestone}
                updateTask={updateTask}
                addTask={addTask}
                toggleTaskCompletion={toggleTaskCompletion}
                deleteTask={deleteTask}
                user={user}
              />
            )}
            {activeTab === 'calendar' && (
              <CalendarComponent
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                tasks={tasksArray.filter(task => new Date(task.date).toDateString() === selectedDate.toDateString())}
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
                saveSettings={() => {/* function logic here */}}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// Helper function to convert hex to rgba
const hexToRGBA = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default GoalTrackerApp;
