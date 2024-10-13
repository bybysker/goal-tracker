"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import TaskCard from './common/task-card';

import { Task } from '@/types';

interface TasksProps {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  updateTask?: (id: string, updatedTask: Partial<Task>) => void; // Optional, in case needed
}

const Tasks: React.FC<TasksProps> = ({
  tasks,
  addTask,
  deleteTask,
  toggleTaskCompletion,
  updateTask
}) => {
  return (
    <Card className="bg-gray-900 text-gray-100 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map(task => (
            <TaskCard
              key={task.tuid}
              task={task}
              onToggle={() => toggleTaskCompletion(task.tuid)}
              onDelete={() => deleteTask(task.tuid)}
              // Pass updateTask if editing functionality is implemented
               onUpdate={updateTask ? () => updateTask(task.tuid, {/* updated fields */}) : undefined}
            />
          ))}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-gray-100">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const target = e.target as HTMLFormElement & {
                  title: { value: string };
                  date: { value: string };
                };
                addTask({
                  name: target.title.value,
                  date: target.date.value,
                  guid: target.guid.value,
                });
                target.reset();
              }}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-title" className="text-right">
                      Title
                    </Label>
                    <Input id="task-title" name="title" className="col-span-3 bg-gray-700 text-gray-100" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-date" className="text-right">
                      Date
                    </Label>
                    <Input id="task-date" name="date" type="date" className="col-span-3 bg-gray-700 text-gray-100" required />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">Add Task</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

export default Tasks;
