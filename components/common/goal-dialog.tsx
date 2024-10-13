'use client'

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Goal, Milestone, Task } from '@/types';
import { db } from '@/db/configFirebase';
import MilestoneAccordion from './milestone-accordion';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Import necessary Firestore functions


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
  useEffect(() => {
    if (isOpen) {
      setTypedName('');
      setTypedDescription('');
      typeText(goal.name, setTypedName, 50, () => {
        typeText('No description available.', setTypedDescription, 30);
      });
      const fetchMilestones = async () => {
        try {
          const snapshot = await getDocs(collection(db, 'users', userId, 'goals', goal.guid, 'milestones')); // Use getDocs and collection
          const milestonesData = snapshot.docs.map(doc => ({
            muid: doc.id,
            ...doc.data(),
          } as Milestone));
          setMilestones(milestonesData);
        } catch (error) {
          console.error("Error fetching milestones: ", error);
        }
      };
  
      fetchMilestones();

        const fetchTasks = async (milestone: Milestone) => {
        const snapshot = await getDocs(collection(db, 'users', userId, 'goals', goal.guid, 'milestones', milestone.muid, 'tasks'));
        const tasksData = snapshot.docs.map(doc => ({
          tuid: doc.id,
          ...doc.data(),
        } as Task));
        setTasks(tasksData);
      };
      milestones.forEach(fetchTasks);
    }
  }, [isOpen, goal, userId]); // Added userId to the dependency array

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{typedName}</DialogTitle>
        </DialogHeader>
        <p className="mt-4 text-gray-300">{typedDescription}</p>
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Milestones</h3>
          {milestones.map((milestone) => (
            <MilestoneAccordion
              key={milestone.muid}
              milestone={milestone}
              tasks={tasks.filter(task => task.muid === milestone.muid)}
              updateTask={updateTask}
              //onTaskComplete={onTaskComplete}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalDialog;
