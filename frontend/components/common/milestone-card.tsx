"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";

import { Milestone } from '@/types';

interface MilestoneCardProps {
  milestone: Milestone;
  onEdit?: () => void;
  onDelete: () => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded">
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-gray-100">{milestone.name}</span>
        <span className="text-sm text-gray-400">Duration: {milestone.duration} weeks</span>
        <span className={`text-sm ${milestone.completed ? 'text-green-500' : 'text-red-500'}`}>
          {milestone.completed ? 'Completed' : 'In Progress'}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
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

export default MilestoneCard;