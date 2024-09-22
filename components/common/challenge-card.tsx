"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

import { Challenge } from '@/types';

interface ChallengeCardProps {
  challenge: Challenge;
  onEdit: () => void;
  onDelete: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onEdit, onDelete }) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="flex justify-between items-center p-4">
        <div>
          <h3 className="font-semibold">{challenge.title}</h3>
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

export default ChallengeCard;
