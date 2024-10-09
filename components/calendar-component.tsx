// app/components/Calendar/CalendarComponent.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { format, isValid, parseISO } from 'date-fns';

import { Task } from '@/types';

interface CalendarComponentProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  tasks: Task[];
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  selectedDate,
  setSelectedDate,
  tasks,
  toggleTaskCompletion,
  deleteTask
}) => {
  const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
  const tasksForSelectedDate = tasks.filter(task => task.date === formattedSelectedDate);

  return (
    <Card className="bg-gray-900 text-gray-100 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border border-gray-700"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Tasks for {format(selectedDate, 'MMMM d, yyyy')}</h3>
            <ul className="space-y-2">
              {tasksForSelectedDate.map(task => (
                <li key={task.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`calendar-task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                  />
                  <Label
                    htmlFor={`calendar-task-${task.id}`}
                    className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}
                  >
                    {task.name}
                  </Label>
                  <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CalendarComponent;
