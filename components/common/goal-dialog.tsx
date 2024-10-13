'use client'

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Goal } from '@/types';

interface GoalDialogProps {
  goal: Goal;
  isOpen: boolean;
  onClose: () => void;
}

const GoalDialog: React.FC<GoalDialogProps> = ({ goal, isOpen, onClose }) => {
  const [typedName, setTypedName] = useState('');
  const [typedDescription, setTypedDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTypedName('');
      setTypedDescription('');
      typeText(goal.name, setTypedName, 50, () => {
        typeText('No description available.', setTypedDescription, 30);
      });
    }
  }, [isOpen, goal]);

  const typeText = (text: string, setter: React.Dispatch<React.SetStateAction<string>>, speed: number, callback?: () => void) => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setter(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        if (callback) callback();
      }
    }, speed);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{typedName}</DialogTitle>
        </DialogHeader>
        <p className="mt-4 text-gray-300">{typedDescription}</p>
      </DialogContent>
    </Dialog>
  );
};

export default GoalDialog;