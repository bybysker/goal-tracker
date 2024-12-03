import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronsRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { questionsGoal } from '@/config/questionsGoalConfig';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Goal, Task, Milestone } from '@/types';
import axios from 'axios';
import { User } from 'firebase/auth';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from "@/components/ui/alert-dialog";

interface GoalDefinitionProps {
  user: User | null;
  resetForm: () => void;
}

const GoalDefinition = ({ user, resetForm }: GoalDefinitionProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showGoalsDrawer, setShowGoalsDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validatedGoal, setValidatedGoal] = useState<string>('');
  const [showValidationCard, setShowValidationCard] = useState(false);
  const [isEditingSmartGoal, setIsEditingSmartGoal] = useState(false)
  const [tempSmartGoalText, setTempSmartGoalText] = useState(validatedGoal)
  
  const { toast } = useToast();
  

  const currentQuestion = questionsGoal[currentQuestionIndex];

  useEffect(() => {
    setProgress(((currentQuestionIndex + 1) / questionsGoal.length) * 100);
  }, [currentQuestionIndex]);


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

  const handleSmartGoalEdit = () => {
    setIsEditingSmartGoal(true)
    setTempSmartGoalText(validatedGoal)
  }

  const handleCancelEdit = () => {
    setIsEditingSmartGoal(false);
    setTempSmartGoalText(validatedGoal);
  };

  const handleSaveEdit = () => {
    setValidatedGoal(tempSmartGoalText);
    setIsEditingSmartGoal(false);
  };

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
      });
      return;
    }

    if (currentQuestionIndex < questionsGoal.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1)
    } else {
      setIsLoading(true);
      if (!user) return;
      
      try {
        // Step 1: Get SMART goal validation
        const smartGoalResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/smart_goal`, {
          user_id: user.uid,
          pre_goal_data: formData
        });
        
        const validatedGoal = smartGoalResponse.data;
        
        // Step 2: Show the validated goal in a card
        setValidatedGoal(validatedGoal);
        setShowValidationCard(true);        
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to process your goal. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleNext(e);
    }
  };
  

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

  const handleGenerateMilestonesAndTasks = async () => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/generate_milestones_and_tasks`,  
        {
          user_id: user.uid,
          validated_goal: validatedGoal
        }
      );

      toast({
        title: "Success",
        description: "Your goal has been created successfully!",
        duration: 3000,
      });
      
      setShowGoalsDrawer(true);
    } catch (error) {
      console.error('Error generating milestones and tasks:', error);
      toast({
        title: "Error",
        description: "Failed to generate milestones and tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      resetForm();
    }
  };

  return (
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
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-[#150578]/70 backdrop-blur-sm p-8 rounded-lg shadow-xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              <p className="text-white text-lg">Validating your goal...</p>
            </div>
          </div>
        </motion.div>
      )}

      {showValidationCard && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-[#150578]/70 backdrop-blur-sm p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="space-y-4">
              <CardTitle className="text-xl font-bold text-white">Validated SMART Goal</CardTitle>
              <CardContent className="pt-6 px-0">
                {isEditingSmartGoal ? (
                  <Textarea
                    value={tempSmartGoalText}
                    onChange={(e) => setTempSmartGoalText(e.target.value)}
                    className="w-full bg-white/10 text-white"
                  />
                ) : (
                  <p className="text-white/80 whitespace-pre-wrap">{validatedGoal}</p>
                )}
              </CardContent>
              <CardFooter className="px-0 justify-end space-x-4">
                {isEditingSmartGoal ? (
                  <>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="text-white border-white/20">
                          Cancel
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will discard your changes. Are you sure you want to continue?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>No, keep editing</AlertDialogCancel>
                          <AlertDialogAction onClick={handleCancelEdit}>
                            Yes, discard changes
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button onClick={handleSaveEdit} className="bg-[#78C0E0]/40 text-white">
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleSmartGoalEdit}
                      className="text-white border-white/20"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => {
                        setShowValidationCard(false);
                        handleGenerateMilestonesAndTasks();
                      }}
                      className="bg-[#78C0E0]/40 text-white"
                    >
                      Continue
                    </Button>
                  </>
                )}
              </CardFooter>
            </div>
          </div>
        </motion.div>
      )}
    </ScrollArea>
  );
};

export default GoalDefinition;
