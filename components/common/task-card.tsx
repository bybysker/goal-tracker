import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox";
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
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`task-${task.tuid}`}
              checked={task.completed}
              onCheckedChange={onToggle}
            />
            <label
              htmlFor={`task-${task.tuid}`}
              className={`${task.completed ? 'line-through text-muted-foreground' : ''}`}
            >
              {task.name}
            </label>
          </div>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash className="h-4 w-4 text-destructive" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          Due: {new Date(task.date).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default TaskCard;