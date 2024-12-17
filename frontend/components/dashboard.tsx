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
import { MotivationalQuotes } from '@/components/motivational-quotes';
import { TaskList } from '@/components/tasks-list';

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

  return (
    <div className="max-h-full max-w-screen-lg mx-auto space-y-6">
      <header className="flex justify-center items-center pb-1">
        <h1 className="text-lg sm:text-xl font-bold text-center">Hello {user.displayName} 👋🏽</h1>
      </header>

      <MotivationalQuotes />

      <TaskList user={user} />


      <section className="mt-4">
        <VoiceMemo voiceMemo={voiceMemo} user={user} />
      </section>
    </div>
  );
}

export default Dashboard;