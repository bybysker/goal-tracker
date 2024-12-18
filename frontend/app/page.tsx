"use client"

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/db/configFirebase';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";

// Import components
import DockNavigation from '@/components/nav-dock';
import Sidebar from '@/components/sidebar';
import Dashboard from '@/components/dashboard';
import Goals from '@/components/goals';
import CalendarComponent from '@/components/calendar-component';
import Settings from '@/components/settings';

// Import types
import { Goal, Task, Milestone } from '@/types';
import axios from 'axios';
import BackgroundAnimation from '@/components/common/bg-animation';

const GoalTrackerApp: React.FC = () => {
  const { user, handleSignOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

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
  const updateProfile = async (profile: { 
    name: string; 
    passions?: string;
    life_goals?: string;
  }) => {
    if (!user) return;
    
    try {
      // Update auth profile (for name and email)
      if (profile.name !== user.displayName) {
        await updateAuthProfile(user, {
          displayName: profile.name,
        });
      }
      
      // Update Firestore document
      const userDocRef = doc(db, 'users', user.uid);
      const userProfileSnapshot = await getDocs(collection(db, 'users', user.uid, 'userProfile'));
      const userProfileRef = userProfileSnapshot.docs[0].ref;
      const userProfileData = userProfileSnapshot.docs[0].data();
      
      await updateDoc(userProfileRef, {
        passions: profile.passions,
        life_goals: profile.life_goals
      });

      // Call profile definition API using the actual Firestore data
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/profile_definition`, {
          user_id: user.uid,
          profile_data: {
            ...userProfileData,  // Use all existing profile data from Firestore
            name: user.displayName  // Use the updated display name from Auth
          }
        });
      } catch (error) {
        console.error("Error calling profile definition API:", error);
        toast({
          title: "Warning",
          description: "Profile updated but failed to update AI analysis. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
        duration: 3000,
      });

    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="flex">
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
            {activeTab === 'settings' && (
              <Settings
              user={user}
              updateProfile={updateProfile}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default GoalTrackerApp;
