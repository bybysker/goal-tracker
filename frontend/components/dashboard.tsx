"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User as FirebaseUser } from 'firebase/auth';
import { Goal, Task } from '@/types';
import VoiceMemo from '@/components/voice-memo';
import GoalCard from '@/components/common/goal-card'
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
  const [voiceMemo, setVoiceMemo] = useState<string | null>(null);

  if (!user) {
    return <p className="text-center">User data is not available.</p>;
  }

  const todaysTasks = tasks.filter(task => 
    new Date(task.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="max-h-full max-w-screen-lg mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row items-center justify-between pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 mt-4 sm:mt-0">
          {user.photoURL ? (
            <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
          ) : (
            <AvatarFallback className="text-lg">
              {user.displayName ? user.displayName.charAt(0) : 'U'}
            </AvatarFallback>
          )}
        </Avatar>
      </header>

      <section>
        <Card className="bg-transparent border-none">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-semibold">Goals Overview</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <ScrollArea className="h-60 sm:h-80 w-full pr-4">
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
                  <p className="text-center text-gray-500">No goals available.</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="mt-4 bg-transparent text-foreground border-border">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-bold">Today's Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center pt-4">
              <Button onClick={generateTodaysTasks} className="mb-4 w-full sm:w-auto">
                Generate/Update Today's Tasks
              </Button>
            </div>
            {todaysTasks.length > 0 ? (
              <ul className="space-y-2">
                {todaysTasks.map((task) => (
                  <li key={task.tuid} className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => updateTask(task, { completed: !task.completed })}
                        className="form-checkbox h-4 w-4"
                      />
                      <span className={`${task.completed ? 'line-through' : ''} text-sm sm:text-base`}>{task.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => deleteTask(task)} className="mt-2 sm:mt-0">
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No tasks for today.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mt-4">
        <VoiceMemo voiceMemo={voiceMemo} user={user} />
      </section>
    </div>
  );
}

export default Dashboard;