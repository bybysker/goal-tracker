'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, ChevronsRight, ChevronLeft, CheckCircle, Loader } from "lucide-react";

import axios from 'axios'
import { User as FirebaseUser } from 'firebase/auth'

import GoalCard from '@/components/common/goal-card';
import GoalDrawer from '@/components/common/goal-drawer';
import { Goal, Task, Milestone } from '@/types';
import { questionsGoal } from '@/config/questionsGoalConfig'
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import LoadingAnimation from '@/components/loading-animation';
import GoalDefinition from '@/components/common/goal-definition';

interface GoalsProps {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'guid' | 'progress'>) => Promise<string>;
  deleteGoal?: (id: string) => void;
  setIsEditing?: (item: Goal | null) => void;
  updateGoal?: (id: string, updatedGoal: Partial<Goal>) => void;
  addMilestone: (milestone: Milestone) => Promise<string>;
  addTask: (task: Omit<Task, 'id'>) => Promise<string>;
  toggleTaskCompletion: (task: Task) => void
  updateTask: (task: Task, modifications: Partial<Task>) => void;
  deleteTask: (task: Task) => void;
  user: FirebaseUser | null; 
}

export default function Goals({
  goals,
  addGoal,
  deleteGoal,
  setIsEditing,
  updateGoal,
  addMilestone,
  addTask,
  toggleTaskCompletion,
  updateTask,
  deleteTask,
  user
}: GoalsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [formData, setFormData] =  useState<Record<string, any>>({})
  const [progress, setProgress] = useState(0)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showMilestonesDrawer, setShowMilestonesDrawer] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showGoalDrawer, setShowGoalDrawer] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    setProgress(((currentQuestionIndex) / questionsGoal.length) * 100)
  }, [currentQuestionIndex])

  const currentQuestion = questionsGoal[currentQuestionIndex]

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const currentAnswer = formData[currentQuestion.id];
    if (!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)) {
      console.log("Triggering toast for incomplete answer");
      toast({
        title: "Incomplete Answer",
        description: "Please answer the current question before proceeding.",
        variant: "destructive",
        duration: 1500,
      });;
      return;
    }
    if (currentQuestionIndex < questionsGoal.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1)
    } else {
      setIsLoading(true);
      if (!user) return;
      try {
        console.log('Submitting formData:', formData);
        // Step 1: Save the goal and get the ID
        const guid = await addGoal(formData as Omit<Goal, 'guid' | 'progress'>);
        if (!guid) throw new Error("Failed to create goal");
        resetForm();

        const milestonesResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/generate_milestones`,  {
          user_id: user.uid,
          goal_data: { ...formData, guid: guid }
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const generatedMilestones = milestonesResponse.data.milestones;

        setMilestones(generatedMilestones);
        setShowMilestonesDrawer(true);
      } catch (error) {
        console.error('Error generating milestones:', error);
        // Handle error (e.g., show error message to user)
      } finally {
        setIsLoading(false);
      }
    }
  }

  const resetForm = () => {
    setFormData({});
    setCurrentQuestionIndex(0);
    setIsDrawerOpen(false);
  }


  const showMessage = () => {
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 1500)
  }

  // New function to handle goal card click
  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setTypedText('');
    setIsTyping(true);
    setShowGoalDrawer(true);
  };

  // Effect for typing animation
  useEffect(() => {
    if (isTyping && selectedGoal) {
      const text = "Description"//`${selectedGoal.name}\n${selectedGoal.description}`;
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setTypedText((prev) => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 50);
      return () => clearInterval(typingInterval);
    }
  }, [isTyping, selectedGoal]);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleNext(e); // Call the function to go to the next question
    }
  };

  return (
    <div className="max-h-full max-w-screen-lg mx-auto space-y-6">
      <Card className="bg-[#150578]/70 backdrop-blur-sm text-foreground shadow-xl border-none">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-semibold">Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[70vh] sm:max-h-[80vh] overflow-y-auto w-full">
            <div className="space-y-4">
              {goals.map(goal => (
                <GoalCard
                  key={goal.guid}
                  goal={goal}
                  user={user}
                  onDelete={deleteGoal ? () => deleteGoal(goal.guid) : undefined}
                  deleteTask={deleteTask}
                  isGoalsView={true}
                  updateTask={updateTask}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <div className="flex justify-center pt-4">
                <Button className="w-1/3 min-w-44 bg-[#78C0E0]/40 shadow-xl hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4"/> Add Goal
                </Button>
              </div>
            </DrawerTrigger>
          <DrawerContent className="backdrop-blur-md bg-[#150578]/70 text-white border-gray-700 mx-auto max-h-full max-w-screen-lg rounded-lg pb-12 z-[60]">
              <DrawerHeader>
                <DrawerTitle className="text-xl font-bold text-center">ADD A NEW GOAL</DrawerTitle>
              </DrawerHeader>
              <GoalDefinition user={user} addGoal={addGoal} resetForm={resetForm} />
            </DrawerContent>
          </Drawer>
        </CardFooter>
      </Card>
      {/* Loading animation */}
      <AnimatePresence>
        {isLoading && (
          <LoadingAnimation/>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 text-center">Goals and milestones saved successfully!</h2>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}