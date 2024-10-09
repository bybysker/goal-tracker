// app/components/Common/TaskCard.tsx
"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate?: () => void; // Optional, for editing
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete, onUpdate }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded">
      <div className="flex items-center">
        <Checkbox checked={task.completed} onCheckedChange={onToggle} />
        <span className={`ml-2 ${task.completed ? 'line-through text-gray-500' : 'text-gray-100'}`}>
          {task.name} - {new Date(task.date).toLocaleDateString()}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {/* Add edit button if onUpdate is provided */}
        {onUpdate && (
          <Button variant="ghost" size="sm" onClick={onUpdate}>
            Edit
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
