import React from 'react';
import { Goal, Task } from '@/types';
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";
import TaskCard from './task-card'; // Import TaskCard component

interface GoalCardProps {
  goal: Goal;
  tasks: Task[]; // Add tasks prop
  onEdit?: () => void;
  onDelete?: () => void;
  onUpdate?: () => void; // Optional, for editing
  toggleTaskCompletion: (id: string) => void; // Add toggleTaskCompletion prop
  deleteTask: (id: string) => void; // Add deleteTask prop
}

const GoalCard: React.FC<GoalCardProps> = ({ 
  goal, 
  tasks, 
  onEdit, 
  onDelete = () => {}, 
  onUpdate, 
  toggleTaskCompletion = () => {},
  deleteTask = () => {}
}) => {
  return (
    <div className="flex flex-col p-4 bg-gray-800 rounded">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{goal.name}</h3>
          <p className="text-sm text-gray-400">Deadline: {new Date(goal.timeframe).toLocaleDateString()}</p>
          <p className="text-sm text-gray-400">Category: {goal.category}</p>
          <p className="text-sm text-gray-400">Progress: {goal.progress}%</p>
        </div>
        <div className="flex items-center space-x-2">
          {onUpdate && (
            <Button variant="ghost" size="sm" onClick={onUpdate}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={() => toggleTaskCompletion(task.id)}
            onDelete={() => deleteTask(task.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default GoalCard;