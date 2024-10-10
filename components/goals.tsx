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

import axios from 'axios'
import { User as FirebaseUser } from 'firebase/auth'

import GoalCard from './common/goal-card';
import { Goal, Task, Milestone } from '@/types';
import { questionsGoal } from '@/config/questionsGoalConfig'

interface GoalsProps {
  goals: Goal[];
  tasks: Task[];
  addGoal: (goal: Omit<Goal, 'id' | 'progress'>) => void;
  deleteGoal?: (id: string) => void;
  setIsEditing?: (item: Goal | null) => void;
  updateGoal?: (id: string, updatedGoal: Partial<Goal>) => void;
  addMilestone: (milestone: Milestone) => void;
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  user: FirebaseUser | null; 
}

export default function Goals({
  goals,
  tasks,
  addGoal,
  deleteGoal,
  setIsEditing,
  updateGoal,
  addMilestone,
  toggleTaskCompletion,
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

  useEffect(() => {
    setProgress(((currentQuestionIndex + 1) / questionsGoal.length) * 100)
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
    if (currentQuestionIndex < questionsGoal.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1)
    } else {
      setIsLoading(true);
      if (!user) return;
      try {
        console.log('Submitting formData:', formData);
        addGoal(formData as Omit<Goal, 'id' | 'progress'>);
        const response = await axios.post('/api/generate_milestones',  {
          user_id: user.uid,
          goal_data: formData
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = response.data;
        setMilestones(data.milestones);
        setShowMilestonesDialog(true);
      } catch (error) {
        console.error('Error generating milestones:', error);
        // Handle error (e.g., show error message to user)
      } finally {
        setIsLoading(false);
      }
      //showMessage();
      resetForm();
    }
  }
  const handleSaveMilestones = async () => {
    // Here you would implement the logic to save milestones to Firebase
    // This is a placeholder function
    console.log('Saving milestones:', milestones);
    milestones.forEach(milestone => {
      addMilestone({ ...milestone } as Milestone);
    });
    // After saving, you might want to update the local state or fetch updated data
    setShowMilestonesDialog(false);
    showMessage();
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
        return (
          <Slider
            id={currentQuestion.id}
            min={currentQuestion.min}
            max={currentQuestion.max}
            step={1}
            value={[formData[currentQuestion.id] || currentQuestion.min]}
            onValueChange={(value) => handleSliderChange(value)}
            className="w-full white"
          />
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

  return (
    <Card className="bg-gray-900 text-white border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              tasks={tasks.filter(task => task.goalId === goal.id)}
              onDelete={deleteGoal ? () => deleteGoal(goal.id) : undefined}
              toggleTaskCompletion={toggleTaskCompletion}
              deleteTask={deleteTask}
            />
          ))}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-md w-full max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold mb-4">Add New Goal</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[calc(80vh-8rem)] pr-4">
                <form onSubmit={handleNext}>
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
            <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-md w-full">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold mb-4">Generated Milestones</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4">
                {milestones.map((milestone, index) => (
                  <Card key={index} className="mb-4 bg-gray-700">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold">{milestone.name}</h3>
                      <p>Duration: {milestone.duration_weeks} weeks</p>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
              <Button onClick={handleSaveMilestones} className="w-full mt-4">
                Save Milestones
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
      {/* Loading animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader className="w-12 h-12 text-blue-500" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}