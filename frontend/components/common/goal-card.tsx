import React, { useState } from 'react';
import { Goal, Milestone, Task } from '@/types';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import TaskCard from './task-card';
import GoalDrawer from '@/components/common/goal-drawer';
import { User as FirebaseUser } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/db/configFirebase';


interface GoalCardProps {
  goal: Goal;
  user: FirebaseUser | null;
  onDelete?: () => void;
  deleteTask: (task: Task) => void;
  updateTask: (task: Task, updatedTask: Partial<Task>) => void;
  isGoalsView: boolean;
}

const GoalCard: React.FC<GoalCardProps> = ({ 
  goal, 
  user,
  onDelete, 
  deleteTask,
  updateTask,
  isGoalsView,
}) => {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchAllTasksForGoal = async () => {
    try {
      // Step 1: Fetch milestones for the goal
      const milestonesSnapshot = await getDocs(collection(db, 'users', user?.uid || '', 'goals', goal.guid, 'milestones'));
      const milestonesData = milestonesSnapshot.docs.map(doc => ({
        muid: doc.id,
        ...doc.data(),
      } as Milestone));

      // Sort milestones by name in ascending order
      milestonesData.sort((a, b) => a.name.localeCompare(b.name));

      setMilestones(milestonesData);
  
      // Step 2: Fetch tasks for each milestone
      const allTasks = await Promise.all(milestonesData.map(async (milestone) => {
        const tasksSnapshot = await getDocs(collection(db, 'users', user?.uid || '', 'goals', goal.guid, 'milestones', milestone.muid, 'tasks'));
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

  // Calculate progress based on completed tasks
  const calculateProgress = (tasks: Task[]) => {
    fetchAllTasksForGoal();
    if (tasks.length === 0) return goal.progress || 0;
    
    const completedTasks = tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const progress = calculateProgress(tasks);

  return (
    <>
      <Card
        className="w-full cursor-pointer border shadow-lg hover:bg-[#150578]/90 "
        onClick={() => setIsDrawerOpen(true)}
        >
        <CardHeader>
          <div className="flex items-center justify-between relative">
            <div className="shrink w-4/5 break-words">
              <CardTitle className="pb-2">{goal.name}</CardTitle>
              <CardDescription>Deadline: {new Date(goal.deadline).toLocaleDateString()}</CardDescription>
            </div>
            {isGoalsView && (
              <div className="flex-none absolute top-0 right-0">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                      className="p-0"
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className='rounded-md w-[80vw]'>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to delete this goal?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the goal and all associated tasks.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={(e) => {e.stopPropagation(); onDelete && onDelete()}}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
          <div className="mt-4 space-y-2 text-sm text-gray-300">
         Click to show related tasks
          </div>
        </CardContent>
      </Card>
      <GoalDrawer 
      goal={goal}
      isOpen={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      userId={user?.uid || ''}
      updateTask={updateTask}
      />
    </>
  );
};

export default GoalCard;
