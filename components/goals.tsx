// app/components/Goals/Goals.tsx
"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import GoalCard from './common/goal-card';

import { Goal, Task } from '@/types';

interface GoalsProps {
  goals: Goal[];
  tasks: Task[];
  addGoal: (goal: Omit<Goal, 'id' | 'progress'>) => void;
  deleteGoal?: (id: string) => void;
  setIsEditing?: (item: Goal | null) => void;
  updateGoal?: (id: string, updatedGoal: Partial<Goal>) => void;
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
}

const Goals: React.FC<GoalsProps> = ({
  goals,
  tasks,
  addGoal,
  deleteGoal,
  setIsEditing,
  updateGoal,
  toggleTaskCompletion,
  deleteTask
}) => {

  return (
    <Card className="bg-gray-900 text-gray-100 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="goals" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>
          
          {/* Goals Tab */}
          <TabsContent value="goals">
            <div className="space-y-4">
              {goals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  tasks={tasks.filter(task => task.goalId === goal.id)}
                  //onEdit={() => setIsEditing(goal)}
                  onDelete={deleteGoal ? () => deleteGoal(goal.id) : undefined}
                  //onUpdate={updateGoal ? () => updateGoal(goal.id, { /* updated fields */ }) : undefined}
                  toggleTaskCompletion={toggleTaskCompletion}
                  deleteTask={deleteTask}
                />
              ))}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 text-gray-100">
                  <DialogHeader>
                    <DialogTitle>Add New Goal</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    const target = e.target as HTMLFormElement & {
                      title: { value: string };
                      deadline: { value: string };
                      category: { value: string };
                    };
                    addGoal({
                      title: target.title.value,
                      deadline: target.deadline.value,
                      category: target.category.value
                    });
                    target.reset();
                  }}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title
                        </Label>
                        <Input id="title" name="title" className="col-span-3 bg-gray-700 text-gray-100" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="deadline" className="text-right">
                          Deadline
                        </Label>
                        <Input id="deadline" name="deadline" type="date" className="col-span-3 bg-gray-700 text-gray-100" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                          Category
                        </Label>
                        <Select name="category" required>
                          <SelectTrigger className="col-span-3 bg-gray-700 text-gray-100">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                            {/* Add more categories as needed */}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add Goal</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
          
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default Goals;
