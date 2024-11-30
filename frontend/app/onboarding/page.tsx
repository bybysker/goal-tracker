'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Mascot } from '@/components/mascot'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronsRight, ChevronLeft, CheckCircle } from 'lucide-react'
import { collection, addDoc, doc, updateDoc} from 'firebase/firestore';
import { db } from '@/db/configFirebase';
import { useAuth } from '@/hooks/useAuth';
import LoadingAnimation from '@/components/loading-animation'
import { questionsUser } from '@/config/questionsUserConfig'
import { questionsGoal } from '@/config/questionsGoalConfig'
import type { UserProfile, GoalConfig } from '@/types'

const steps = [
  'welcome',
  'explanation',
  'userProfile',
  'transition',
  'goalSetting',
  'complete',
  'loading',
] as const

const FuturisticFirstLoginForm: React.FC = () => {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<(typeof steps)[number]>('welcome')
  const [questionProgress, setQuestionProgress] = useState(0)

  const progress = (() => {
    switch (currentStep) {
      case 'welcome':
        return 0
      case 'explanation':
        return 20
      case 'userProfile':
        return 20 + (currentQuestionIndex / questionsUser.length) * 30
      case 'transition':
        return 50
      case 'goalSetting':
        return 50 + (currentQuestionIndex / questionsGoal.length) * 45
      case 'complete':
      case 'loading':
        return 100
      default:
        return 0
    }
  })()

  useEffect(() => {
    setQuestionProgress(((currentQuestionIndex + 1) / questionsUser.length) * 100)
  }, [currentQuestionIndex])

  const currentQuestion = questionsUser[currentQuestionIndex]

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
        // Remove the value
        return {
          ...prevData,
          [currentQuestion.id]: currentValues.filter((item: string) => item !== value)
        }
      } else {
        // Add the value
        return {
          ...prevData,
          [currentQuestion.id]: [...currentValues, value]
        }
      }
    })
  }

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentQuestionIndex < questionsUser.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1)
    } else {
      if (!user) {
        alert("User not authenticated.");
        return;
      }
      try {
        console.log('Submitting formData:', formData);
        await addDoc(collection(db, 'users', user.uid, "userProfile"), formData);

        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { firstLogin: false });

        showMessage();
        setTimeout(() => {
          router.push('/'); // Redirect to the main page after the animation
        }, 1500);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1)
    }
  }

  const getInputComponent = () => {
    const value = formData[currentQuestion.id as keyof typeof formData]
    switch (currentQuestion.type) {
      case 'input':
        return (
          <Input
            id={currentQuestion.id}
            name={currentQuestion.id}
            value={formData[currentQuestion.id] || ''}
            onChange={handleInputChange}
            required
            className="text-lg bg-[#78C0E0]/10 border-none shadow-md text-white placeholder-white/50"
            placeholder="Type your answer here..."
          />
        )
      case 'textarea':
        return (
          <Textarea
            id={currentQuestion.id}
            name={currentQuestion.id}
            value={formData[currentQuestion.id] || ''}
            onChange={handleInputChange}
            required
            className="text-lg bg-[#78C0E0]/10 border-none shadow-md text-white placeholder-white/50"
            rows={4}
            placeholder="Type your answer here..."
          />
        )
      case 'radio':
        return (
          <RadioGroup onValueChange={handleRadioChange} value={formData[currentQuestion.id] || []} className="space-y-2 p-3">
            {currentQuestion.options?.map((option) => (
              <div key={String(option)} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} className="border-[#78C0E0]/40 text-white" />
                <Label htmlFor={option} className="text-white">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case 'checkbox':
        const currentValues = value || []
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={option}
                  name={currentQuestion.id}
                  value={option}
                  checked={currentValues.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                  className="border-[#78C0E0]/40 text-white"
                />
                <Label htmlFor={option} className="text-white">{option}</Label>
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
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-[#192BC2]/70 backdrop-blur-md text-white border-gray-700">
        <CardHeader className="text-center relative">
          <div className="absolute top-0 left-0 w-full">
            <Progress value={progress} className="w-full rounded-none h-1" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >

            {currentStep === 'welcome' && (
              <div className="text-center space-y-6">
                <Mascot />
                <h1 className="text-4xl font-bold text-blue-800">Welcome to Goal Tracker!</h1>
                <p className="text-blue-600 text-lg">
                  Let's embark on a journey to achieve your goals together.
                </p>
                <Button size="lg" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </div>
            )}

            {currentStep === 'explanation' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-center text-blue-800">How it works?</h2>
                <div className="space-y-6">
                  <div className="p-6 bg-white rounded-lg shadow-sm border border-blue-200">
                    <h3 className="font-semibold text-xl mb-2 text-blue-700">1. Build Your Profile</h3>
                    <p className="text-blue-600">
                      Answer a few questions to help us understand your personality and preferences.
                    </p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow-sm border border-blue-200">
                    <h3 className="font-semibold text-xl mb-2 text-blue-700">2. Set Your Goals</h3>
                    <p className="text-blue-600">
                      Define clear, actionable goals with our guided process.
                    </p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow-sm border border-blue-200">
                    <h3 className="font-semibold text-xl mb-2 text-blue-700">3. Track Progress</h3>
                    <p className="text-blue-600">
                      Monitor your progress and get personalized recommendations.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button size="lg" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">Continue</Button>
                </div>
              </div>
            )}
            
            <CardTitle className="text-3xl font-bold text-white mt-4">Welcome, {formData.name || 'Explorer'}!</CardTitle>
            <CardDescription className="text-lg text-white/80">Let&apos;s embark on a journey of discovery</CardDescription>
          </motion.div>
        </CardHeader>
        <form onSubmit={handleNext}>
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
                <div className="flex items-center space-x-3">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 15 }}
                    className="bg-[#78C0E0]/40 shadow-xl rounded-full p-2"
                  >
                    <currentQuestion.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <Label htmlFor={currentQuestion.id} className=" text-md text-center font-medium text-white">
                    {currentQuestion.question}
                  </Label>
                </div>
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
              <Button type="submit" className="flex-1 text-lg font-semibold group bg-[#78C0E0]/40 shadow-xl text-white hover:bg-blue-700">
                <span className="mr-2">{currentQuestionIndex < questionsUser.length - 1 ? 'Next' : 'Submit'}</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="inline-block"
                >
                  <ChevronsRight className="w-5 h-5 inline" />
                </motion.div>
              </Button>
            </div>
            <div className="text-sm text-white/60 flex justify-between w-full">
              <span>Question {currentQuestionIndex + 1} of {questionsUser.length}</span>
              <span>{Math.round(questionProgress)}% completed</span>
            </div>
          </CardFooter>
        </form>
      </Card>
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50"
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
              <h2 className="text-xl font-bold text-gray-800 text-center">Submission successful</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FuturisticFirstLoginForm;

