"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User as FirebaseUser } from 'firebase/auth';
import { Goal, Challenge, Task } from '@/types';

interface DashboardProps {
  user: FirebaseUser | null; // Updated to allow null
  goals: Goal[];
  challenges: Challenge[];
  streak: number;
  tasks: Task[];
  aiInsights: string[];
  simulateAiInsights: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  goals,
  challenges,
  streak,
  tasks,
  aiInsights,
  simulateAiInsights
}) => {
  // If user is null, display a fallback UI
  if (!user) {
    return (
      <Card className="bg-gray-900 text-gray-100 border-gray-700">
        <CardContent>
          <p className="text-center">User data is not available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 text-gray-100 border-gray-700">
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
          {/* Goals Overview */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Goals Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {goals.length > 0 ? (
                goals.map(goal => (
                  <div key={goal.id} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span>{goal.title}</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2 bg-gray-700" />
                  </div>
                ))
              ) : (
                <p>No goals available.</p>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Challenges */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Recent Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              {challenges.length > 0 ? (
                <ul className="space-y-2">
                  {challenges.slice(0, 5).map(challenge => (
                    <li key={challenge.id} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      <span>{challenge.title}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No recent challenges.</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Progress Tracking */}
        <Card className="mt-4 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Progress Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{streak} day streak!</p>
                <p className="text-sm text-gray-400">Keep it up!</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">Total Tasks Completed</p>
                <p className="text-3xl font-bold text-green-500">{tasks.filter(task => task.completed).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* AI Insights */}
        <Card className="mt-4 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-bold">AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            {aiInsights.length > 0 ? (
              <ul className="space-y-2">
                {aiInsights.map((insight, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No AI insights available.</p>
            )}
            <Button onClick={simulateAiInsights} className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
              Generate New Insight
            </Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

export default Dashboard;
