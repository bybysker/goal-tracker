'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, ChevronsRight, ChevronLeft, CheckCircle, Loader } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

import axios from 'axios'
import { User as FirebaseUser } from 'firebase/auth'

import GoalCard from '@/components/common/goal-card';
import GoalDrawer from '@/components/common/goal-drawer';
import { Goal, Task, Milestone } from '@/types';
import { questionsGoal } from '@/config/questionsGoalConfig'
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import LoadingAnimation from '@/components/loading-animation';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSliderChange = (value: number[]) => {
    setFormData(prevData => ({ ...prevData, [currentQuestion.id]: value[0] }))
  }

  const handleRadioChange = (value: string) => {
    setFormData(prevData => ({ ...prevData, [currentQuestion.id]: value }))
  }

  const handleCheckboxChange = (value: string) => {
    setFormData(prevData => {
      const currentValues = prevData[currentQuestion.id] || []
      if (currentValues.includes(value)) {
        return {
          ...prevData,
          [currentQuestion.id]: currentValues.filter((item: string) => item !== value)
        }
      } else {
        return {
          ...prevData,
          [currentQuestion.id]: [...currentValues, value]
        }
      }
    })
  }

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
  const handleSaveMilestones = async () => {

    if (!user) return;
    try {
      console.log('Saving milestones:', milestones);
      //Save milestones and generate tasks

      setShowMilestonesDrawer(false); // Close the milestone drawer
      setIsLoading(true); // Start loading animation
  
      let i = 0;
      for (const milestone of milestones) {
        const milestoneId = await addMilestone({ ...milestone } as Milestone);
        if (!milestoneId) continue;

        // Update progress
        setProgress(((i) / milestones.length) * 100);

        // Generate tasks for each milestone
        const tasksResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/generate_tasks`, {
          user_id: user.uid,
          guid: milestone.guid,
          muid: milestoneId
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const generatedTasks = tasksResponse.data.tasks;

        // Save tasks
        for (const task of generatedTasks) {
          const taskID = await addTask({ ...task } as Task);
          task.tuid = taskID;
          await updateTask(task, { tuid: taskID }); 
        }
        i+=1;
      }
      console.log('isLoading', isLoading);

    } catch (error) {
      console.error('Error generating tasks:', error);
    }finally {
      console.log('isLoading', isLoading);
      setIsLoading(false);
      console.log('isLoading', isLoading);
      showMessage();
    }
  }
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1)
    }
  }

  const resetForm = () => {
    setFormData({});
    setCurrentQuestionIndex(0);
    setIsDrawerOpen(false);
  }

  const getInputComponent = () => {
    const value = formData[currentQuestion.id as keyof typeof formData]
    switch (currentQuestion.type) {
      case 'textarea':
        return (
          <Textarea
            id={currentQuestion.id}
            name={currentQuestion.id}
            value={formData[currentQuestion.id] || ''}
            onChange={handleInputChange}
            className="w-full bg-[#78C0E0]/10 border-none shadow-md text-white placeholder-white/50"
            placeholder="Type your answer here..."
          />
        )
      case 'radio':
        return (
          <RadioGroup onValueChange={handleRadioChange} value={formData[currentQuestion.id] || ''} className="space-y-2">
            {currentQuestion.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${currentQuestion.id}-${option}`} className="border-white/20 text-white" />
                <Label htmlFor={`${currentQuestion.id}-${option}`} className="text-white">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case 'checkbox':
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox 
                  id={`${currentQuestion.id}-${option}`} 
                  checked={formData[currentQuestion.id]?.includes(option)}
                  onCheckedChange={() => handleCheckboxChange(option)}
                  className="border-gray-600 text-blue-500"
                />
                <Label htmlFor={`${currentQuestion.id}-${option}`} className="text-white">{option}</Label>
              </div>
            ))}
          </div>
        )
      default:
        return null
    }
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
              <ScrollArea className="max-h-[70vh] sm:h-[80vh]">
                <form onSubmit={handleNext} onKeyDown={handleKeyDown}>
                  <CardContent className="space-y-4 p-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="flex gap-4 items-center">
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 15 }}
                            className="bg-[#78C0E0]/40 shadow-xl rounded-full p-2"
                          >
                            {React.createElement(currentQuestion.icon, { className: "w-6 h-6 text-white" })}
                          </motion.div>
                          <Label htmlFor={currentQuestion.id} className="text-xl text-center item-center font-medium text-white">
                            {currentQuestion.question}
                          </Label>
                        </div>
                        <p className="text-sm text-center italic text-white/80">
                          {currentQuestion.guidance}
                        </p>
                        {getInputComponent()}
                      </motion.div>
                    </AnimatePresence>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <div className="flex w-full space-x-4">
                      <Button 
                        type="button" 
                        onClick={handleBack} 
                        className="flex-1 bg-muted hover:bg-gray-600 text-white"
                        disabled={currentQuestionIndex === 0}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button type="submit" className="flex-1 text-lg font-semibold group bg-[#78C0E0]/40 shadow-xl text-white hover:from-blue-600 hover:to-purple-600">
                        <span className="mr-2">{currentQuestionIndex < questionsGoal.length - 1 ? 'Next' : 'Submit'}</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="inline-block"
                        >
                          <ChevronsRight className="w-5 h-5 inline" />
                        </motion.div>
                      </Button>
                    </div>
                    <div className="text-sm text-gray-400 flex justify-between w-full">
                      <span className="text-xs">Question {currentQuestionIndex + 1} of {questionsGoal.length}</span>
                      <span className="text-xs">{Math.round(progress)}% done</span>
                    </div>
                    <Progress value={progress} className="w-full h-2 bg-gray-700 text-white" />
                  </CardFooter>
                </form>
              </ScrollArea>
            </DrawerContent>
          </Drawer>
          {/* New drawer for displaying milestones */}
          <Drawer open={showMilestonesDrawer} onOpenChange={setShowMilestonesDrawer}>
            <DrawerContent className="backdrop-blur-md bg-[#192BC2]/70 text-white border-gray-700 mx-auto max-h-full max-w-screen-lg rounded-lg pb-12 z-[60]">
              <DrawerHeader>
                <DrawerTitle className="text-xl font-bold mb-4">Generated Milestones</DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="h-[60vh]">
                {milestones.map((milestone, index) => (
                  <Card key={index} className="mb-4 bg-purple-700 backdrop-blur-3xl border-none text-white">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold">{milestone.name}</h3>
                      <p>Duration: {milestone.duration} weeks</p>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
              <Button onClick={handleSaveMilestones} className="w-full mt-4">
                Save Milestones
              </Button>
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