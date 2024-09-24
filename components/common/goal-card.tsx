// components/ui/common/goal-card.tsx
"use client"

import React from 'react';
import { Goal } from '@/types';
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";

interface GoalCardProps {
  goal: Goal;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate?: () => void; // Optional, for editing
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete, onUpdate }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded">
      <div>
        <h3 className="text-lg font-semibold">{goal.title}</h3>
        <p className="text-sm text-gray-400">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
        <p className="text-sm text-gray-400">Category: {goal.category}</p>
        <p className="text-sm text-gray-400">Progress: {goal.progress}%</p>
      </div>
      <div className="flex items-center space-x-2">
        {onUpdate && (
          <Button variant="ghost" size="sm" onClick={onUpdate}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default GoalCard;
