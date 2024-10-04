"use client"

import React from 'react';
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Plus } from "lucide-react";
import GoalCard from './common/goal-card';

import { Goal, Task } from '@/types';
import { questionsGoal } from '@/config/questionsGoalConfig'

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
  const { register, handleSubmit, setValue, reset } = useForm()

  const onSubmit = (data: any) => {
    const formattedData: Omit<Goal, 'id' | 'progress'> = {
      title: data.goal,
      category: data.category,
      timeframe: data.timeframe,
      importance: data.importance,
      obstacles: data.obstacles,
      timeCommitment: data.time_commitment,
      approach: data.approach
    };
    addGoal(formattedData);
    reset();
  }

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
          
          <TabsContent value="goals">
            <div className="space-y-4">
              {goals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  tasks={tasks.filter(task => task.goalId === goal.id)}
                  onDelete={deleteGoal ? () => deleteGoal(goal.id) : undefined}
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
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {questionsGoal.map((q) => (
                      <div key={q.id} className="space-y-4">
                        <div className="flex items-center space-x-2">
                          {React.createElement(q.icon, { className: "w-5 h-5 text-primary" })}
                          <Label htmlFor={q.id} className="text-lg font-medium text-foreground">
                            {q.question}
                          </Label>
                        </div>
                        {q.type === 'textarea' && (
                          <Textarea 
                            id={q.id} 
                            {...register(q.id)} 
                            className="w-full bg-gray-700 text-gray-100 border-gray-600"
                          />
                        )}
                        {q.type === 'radio' && (
                          <RadioGroup onValueChange={(value) => setValue(q.id, value)} className="space-y-2">
                            {q.options?.map((option) => (
                              <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                                <Label htmlFor={`${q.id}-${option}`} className="text-gray-100">{option}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}
                        {q.type === 'slider' && (
                          <Slider
                            id={q.id}
                            min={q.min}
                            max={q.max}
                            step={1}
                            onValueChange={(value) => setValue(q.id, value[0])}
                            className="w-full"
                          />
                        )}
                        {q.type === 'checkbox' && (
                          <div className="space-y-2">
                            {q.options?.map((option) => (
                              <div key={option} className="flex items-center space-x-2">
                                <Checkbox id={`${q.id}-${option}`} {...register(q.id)} value={option} />
                                <Label htmlFor={`${q.id}-${option}`} className="text-gray-100">{option}</Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                      Submit Goal
                    </Button>
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