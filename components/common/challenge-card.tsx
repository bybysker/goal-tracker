// components/ui/common/challenge-card.tsx
"use client"

import React from 'react';
import { Challenge } from '@/types';
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";

interface ChallengeCardProps {
  challenge: Challenge;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate?: () => void; // Optional, for editing
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onEdit, onDelete, onUpdate }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded">
      <div>
        <h3 className="text-lg font-semibold">{challenge.title}</h3>
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

export default ChallengeCard;
