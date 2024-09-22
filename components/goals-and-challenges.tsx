// app/components/GoalsAndChallenges/GoalsAndChallenges.tsx
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
import ChallengeCard from './common/challenge-card';

import { Goal, Challenge } from '@/types';

interface GoalsAndChallengesProps {
  goals: Goal[];
  challenges: Challenge[];
  addGoal: (goal: Omit<Goal, 'id' | 'progress'>) => void;
  deleteGoal: (id: number) => void;
  addChallenge: (challenge: Omit<Challenge, 'id'>) => void;
  deleteChallenge: (id: number) => void;
  setIsEditing: (item: Goal | Challenge | null) => void;
}

const GoalsAndChallenges: React.FC<GoalsAndChallengesProps> = ({
  goals,
  challenges,
  addGoal,
  deleteGoal,
  addChallenge,
  deleteChallenge,
  setIsEditing
}) => {
  return (
    <Card className="bg-gray-900 text-gray-100 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Goals and Challenges</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="goals" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>
          
          {/* Goals Tab */}
          <TabsContent value="goals">
            <div className="space-y-4">
              {goals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={() => setIsEditing(goal)}
                  onDelete={() => deleteGoal(goal.id)}
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
                    const target = e.target as typeof e.target & {
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
                        <Input id="title" name="title" className="col-span-3 bg-gray-700 text-gray-100" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="deadline" className="text-right">
                          Deadline
                        </Label>
                        <Input id="deadline" name="deadline" type="date" className="col-span-3 bg-gray-700 text-gray-100" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                          Category
                        </Label>
                        <Select name="category">
                          <SelectTrigger className="col-span-3 bg-gray-700 text-gray-100">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
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
          
          {/* Challenges Tab */}
          <TabsContent value="challenges">
            <div className="space-y-4">
              {challenges.map(challenge => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onEdit={() => setIsEditing(challenge)}
                  onDelete={() => deleteChallenge(challenge.id)}
                />
              ))}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Challenge
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 text-gray-100">
                  <DialogHeader>
                    <DialogTitle>Add New Challenge</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    const target = e.target as typeof e.target & {
                      title: { value: string };
                    };
                    addChallenge({
                      title: target.title.value,
                    });
                    target.reset();
                  }}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="challenge-title" className="text-right">
                          Title
                        </Label>
                        <Input id="challenge-title" name="title" className="col-span-3 bg-gray-700 text-gray-100" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Add Challenge</Button>
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

export default GoalsAndChallenges;
