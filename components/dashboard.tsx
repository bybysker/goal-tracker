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

interface DashboardProps {
  user: FirebaseUser | null;
  goals: Goal[];
  tasks: Task[];
  memos: Memo[];
  addMemo: (memo: Omit<Memo, 'id'>) => Promise<void>;
  generateTodaysTasks: () => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  goals,
  tasks,
  memos,
  addMemo,
  generateTodaysTasks,
  updateTask,
  deleteTask
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

  const handleAddMemo = () => {
    if (memoText.trim()) {
      addMemo({ text: memoText, createdAt: new Date() });
      setMemoText('');
    }
  };

  const todaysTasks = tasks.filter(task => 
    new Date(task.date).toDateString() === new Date().toDateString()
  );

  return (
    <Card className="bg-background text-foreground border-border">
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
        <div className="grid gap-4 md:grid-cols-2">
          {/* Goal Overview */}
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Goal Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {goals.length > 0 ? (
                goals.map(goal => (
                  <div key={goal.id} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span>{goal.title}</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                ))
              ) : (
                <p>No goals available.</p>
              )}
            </CardContent>
          </Card>
          
          {/* Add a Memo */}
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Add a Memo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  type="text"
                  value={memoText}
                  onChange={(e) => setMemoText(e.target.value)}
                  placeholder="Enter your memo..."
                  className="flex-grow"
                />
                <Button onClick={handleAddMemo}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              {memos.slice(0, 5).map((memo) => (
                <div key={memo.id} className="bg-muted p-2 rounded mb-2">
                  {memo.text}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        {/* Generate/Update Today's Tasks */}
        <Card className="mt-4 bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Today's Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={generateTodaysTasks} className="mb-4 w-full">
              Generate/Update Today's Tasks
            </Button>
            {todaysTasks.length > 0 ? (
              <ul className="space-y-2">
                {todaysTasks.map((task) => (
                  <li key={task.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => updateTask(task.id, { completed: !task.completed })}
                        className="form-checkbox h-4 w-4"
                      />
                      <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
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
        <Card className="mt-4 bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Voice Memo</CardTitle>
          </CardHeader>
          <CardContent>
            <VoiceMemo voiceMemo={voiceMemo} user={user} />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

export default Dashboard;