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
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete }) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={onToggle}
          />
          <Label
            htmlFor={`task-${task.id}`}
            className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}
          >
            {task.title}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">{task.date}</span>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default TaskCard;
