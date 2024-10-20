'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import GoalDialog from '@/components/common/goal-dialog';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showMilestonesDialog, setShowMilestonesDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
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
        setShowMilestonesDialog(true);
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

      setShowMilestonesDialog(false); // Close the milestone dialog
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
      //setShowGoalDialog(true); // Open the goal dialog
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
    setIsDialogOpen(false);
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
            className="w-full bg-gray-800 text-white border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type your answer here..."
            autoFocus
          />
        )
      case 'radio':
        return (
          <RadioGroup onValueChange={handleRadioChange} value={formData[currentQuestion.id] || ''} className="space-y-2">
            {currentQuestion.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${currentQuestion.id}-${option}`} className="border-gray-600 text-blue-500" />
                <Label htmlFor={`${currentQuestion.id}-${option}`} className="text-white">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )
        case 'slider':
          const sliderValue = formData[currentQuestion.id] || currentQuestion.min
          return (
            <div className="space-y-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Slider
                      id={currentQuestion.id}
                      min={currentQuestion.min}
                      max={currentQuestion.max}
                      step={1}
                      value={[sliderValue]}
                      onValueChange={(value) => handleSliderChange(value)}
                      className="w-full"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{sliderValue}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="text-center text-sm text-white">
                Current value: {sliderValue}
              </div>
            </div>
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
    setShowGoalDialog(true);
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
    <div>
      <Card className="bg-transparent text-foreground border-border max-h-full max-w-screen-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[70dvh] w-full pr-4">
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <div className="flex justify-center pt-4">
                <Button className="w-1/3 min-w-44 bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add Goal
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="bg-gradient-to-br from-indigo-700 via-purple-900 to-indigo-600 text-white border-none max-w-4xl w-[80dvw] h-[80dvh] rounded-lg sm:p-6 md:p-8 overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold mb-4 text-center">ADD A NEW GOAL</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[calc(80vh-8rem)] pr-4">
                <form onSubmit={handleNext} onKeyDown={handleKeyDown}>
                  <CardContent className="space-y-6 p-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-3">
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 15 }}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2"
                          >
                            {React.createElement(currentQuestion.icon, { className: "w-6 h-6 text-white" })}
                          </motion.div>
                          <Label htmlFor={currentQuestion.id} className="text-xl font-medium text-white">
                            {currentQuestion.question}
                          </Label>
                        </div>
                        <p className="text-sm italic text-white/80">
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
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
                        disabled={currentQuestionIndex === 0}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button type="submit" className="flex-1 text-lg font-semibold group bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600">
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
                      <span>Question {currentQuestionIndex + 1} of {questionsGoal.length}</span>
                      <span>{Math.round(progress)}% completed</span>
                    </div>
                    <Progress value={progress} className="w-full h-2 bg-gray-700 text-white" />
                  </CardFooter>
                </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
          {/* New dialog for displaying milestones */}
          <Dialog open={showMilestonesDialog} onOpenChange={setShowMilestonesDialog}>
            <DialogContent className="border-none bg-gradient-to-br from-indigo-700 via-purple-900 to-indigo-600 text-white max-w-4xl w-[80dvw] h-[80dvh] rounded-lg sm:p-6 md:p-8 overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold mb-4">Generated Milestones</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4">
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
            </DialogContent>
          </Dialog>
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