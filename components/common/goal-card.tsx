"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

import { Goal } from '@/types';

interface GoalCardProps {
  goal: Goal;
  onEdit: () => void;
  onDelete: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="flex justify-between items-center p-4">
        <div>
          <h3 className="font-semibold">{goal.title}</h3>
          <p className="text-sm text-gray-400">Deadline: {goal.deadline}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default GoalCard;
