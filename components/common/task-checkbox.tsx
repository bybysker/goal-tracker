'use client'

import React from 'react';
import { Task } from '@/types';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TaskCheckboxProps {
  task: Task;
  onComplete: (task: Task, completed: boolean) => void;
}

const TaskCheckbox: React.FC<TaskCheckboxProps> = ({ task, onComplete }) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={task.name}
        checked={task.completed}
        onCheckedChange={(checked) => onComplete(task, checked as boolean)}
      />
      <Label
        htmlFor={task.name}
        className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}
      >
        {task.name}
      </Label>
    </div>
  );
};

export default TaskCheckbox;