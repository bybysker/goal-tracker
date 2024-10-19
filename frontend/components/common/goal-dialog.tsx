'use client'

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Goal, Milestone, Task } from '@/types';
import { db } from '@/db/configFirebase';
import MilestoneAccordion from './milestone-accordion';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Import necessary Firestore functions
import { ScrollArea } from '@/components/ui/scroll-area'; // Import ScrollArea component

interface GoalDialogProps {
  goal: Goal;
  isOpen: boolean;
  onClose: () => void;
  userId: string; // Added userId prop to access the user's milestones
  updateTask: (task: Task, updatedTask: Partial<Task>) => void;
}

const GoalDialog: React.FC<GoalDialogProps> = ({ 
  goal,  
  isOpen, 
  onClose, 
  userId, // Added userId to the component props
  updateTask
}) => {
  const [typedName, setTypedName] = useState('');
  const [typedDescription, setTypedDescription] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchAllTasksForGoal = async () => {
    try {
      // Step 1: Fetch milestones for the goal
      const milestonesSnapshot = await getDocs(collection(db, 'users', userId, 'goals', goal.guid, 'milestones'));
      const milestonesData = milestonesSnapshot.docs.map(doc => ({
        muid: doc.id,
        ...doc.data(),
      } as Milestone));

      // Sort milestones by name in ascending order
      milestonesData.sort((a, b) => a.name.localeCompare(b.name));

      setMilestones(milestonesData);
  
      // Step 2: Fetch tasks for each milestone
      const allTasks = await Promise.all(milestonesData.map(async (milestone) => {
        const tasksSnapshot = await getDocs(collection(db, 'users', userId, 'goals', goal.guid, 'milestones', milestone.muid, 'tasks'));
        const tasksData = tasksSnapshot.docs.map(doc => ({
          tuid: doc.id,
          ...doc.data(),
        } as Task));
        
        // Sort tasks by name in ascending order
        tasksData.sort((a, b) => a.name.localeCompare(b.name));

        return tasksData; // Return sorted tasks for this milestone
      }));

      setTasks(allTasks.flat()); // Set the tasks state
      console.log('All fetched tasks for goal:', allTasks.flat()); // Debug log
    } catch (error) {
      console.error("Error fetching tasks for goal:", error);
    }
  };

  const typeText = (text: string, setter: React.Dispatch<React.SetStateAction<string>>, speed: number, callback?: () => void) => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setter(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        if (callback) callback();
      }
    }, speed);
  };

  useEffect(() => {
    if (isOpen) {
      setTypedName('');
      setTypedDescription('');
      typeText(goal.name, setTypedName, 2, () => {
        typeText('No description available yet.', setTypedDescription, 10);
      });
      fetchAllTasksForGoal();
    }
  }, [isOpen, goal, userId]); 

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none bg-gradient-to-br from-indigo-700 via-purple-900 to-indigo-600 text-white max-w-4xl w-[80dvw] max-h-[80dvh] rounded-lg sm:p-6 md:p-8 overflow-y-auto" >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{goal.name}</DialogTitle>
          <DialogDescription className='text-gray-200'>
            {typedDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Milestones</h3>
          <ScrollArea className="h-[70dvh] w-full pr-4"> {/* Adjust max height as needed */}
            {milestones.map((milestone) => (
              <MilestoneAccordion
                key={milestone.muid}
                milestone={milestone}
                tasks={tasks.filter(task => task.muid === milestone.muid)}
                updateTask={updateTask}
              />
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalDialog;
