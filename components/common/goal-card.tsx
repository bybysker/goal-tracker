import React, { useState } from 'react';
import { Goal, Task } from '@/types';
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
import GoalDialog from '@/components/common/goal-dialog';
import { User as FirebaseUser } from 'firebase/auth';


interface GoalCardProps {
  goal: Goal;
  user: FirebaseUser | null;
  onDelete?: () => void;
  deleteTask: (task: Task) => void;
  updateTask: (task: Task, updatedTask: Partial<Task>) => void;
  isGoalsView: boolean; // New prop to determine if we're in the Goals view
}

const GoalCard: React.FC<GoalCardProps> = ({ 
  goal, 
  user,
  onDelete, 
  deleteTask,
  updateTask,
  isGoalsView
}) => {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <Card
        className="w-full cursor-pointer hover:bg-gray-200 "
        onClick={() => setIsDialogOpen(true)}
        >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{goal.name}</CardTitle>
              <CardDescription>Deadline: {new Date(goal.timeframe).toLocaleDateString()}</CardDescription>
            </div>
            {isGoalsView && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this goal?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the goal and all associated tasks.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="w-full" />
          </div>
          <div className="mt-4 space-y-2 text-sm text-gray-500">
         Click to show related tasks
          </div>
        </CardContent>
      </Card>
      <GoalDialog 
      goal={goal}
      isOpen={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      userId={user?.uid || ''}
      updateTask={updateTask}
      />
    </>
  );
};

export default GoalCard;