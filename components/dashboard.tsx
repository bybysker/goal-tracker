"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User as FirebaseUser } from 'firebase/auth';
import { Goal, Task, Memo } from '@/types';
import VoiceMemo from '@/components/voice-memo';
import GoalCard  from '@/components/common/goal-card'
import TaskCard  from '@/components/common/task-card';
import { ScrollArea } from './ui/scroll-area';

interface DashboardProps {
  user: FirebaseUser | null;
  goals: Goal[];
  tasks: Task[];
  generateTodaysTasks: () => void;
  updateTask: (task: Task, modifications: Partial<Task>) => void;
  deleteTask: (task: Task) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  goals,
  tasks,
  generateTodaysTasks,
  updateTask,
  deleteTask,

}) => {
  const [memoText, setMemoText] = useState('');
  const [voiceMemo, setVoiceMemo] = useState<string | null>(null);

  if (!user) {
    return (
      <Card className="bg-background text-foreground border-border">
        <CardContent>
          <p className="text-center">User data is not available.</p>
        </CardContent>
      </Card>
    );
  }


  const todaysTasks = tasks.filter(task => 
    new Date(task.date).toDateString() === new Date().toDateString()
  );

  return (
    <Card className="bg-background text-foreground border-border max-h-screen">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Dashboard</CardTitle>
        <Avatar>
          {user.photoURL ? (
            <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
          ) : (
            <AvatarFallback>
              {user.displayName ? user.displayName.charAt(0) : 'U'}
            </AvatarFallback>
          )}
        </Avatar>
      </CardHeader>
      <CardContent>
        {/* Goal Overview */}
        <Card className="bg-background text-foreground border-border">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Goals Overview</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <ScrollArea className="h-[20dvh] w-full pr-4">
              <div className="space-y-4">
                {goals.length > 0 ? (
                  goals.map(goal => (
                    <GoalCard
                      key={goal.guid}
                      goal={goal}
                      user={user}
                      deleteTask={deleteTask}
                      isGoalsView={false}
                      updateTask={updateTask}
                />
                  ))
                ) : (
                  <p>No goals available.</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        
        {/* Generate/Update Today's Tasks */}
        <Card className="mt-4 bg-background text-foreground border-border">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Today's Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center pt-4">
              <Button onClick={generateTodaysTasks} className="mb-4 w-full">
                Generate/Update Today's Tasks
              </Button>
            </div>
            {todaysTasks.length > 0 ? (
              <ul className="space-y-2">
                {todaysTasks.map((task) => (
                  <li key={task.tuid} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => updateTask(task, { completed: !task.completed })}
                        className="form-checkbox h-4 w-4"
                      />
                      <span className={task.completed ? 'line-through' : ''}>{task.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => deleteTask(task)}>
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks for today.</p>
            )}
          </CardContent>
        </Card>

        {/* Voice Memo */}
        <div className="mt-4">
        <VoiceMemo voiceMemo={voiceMemo} user={user} />
        </div>
      </CardContent>
    </Card>
  )
}

export default Dashboard;