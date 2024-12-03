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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronsRight, ChevronLeft, CheckCircle } from 'lucide-react'
import { collection, addDoc, doc, updateDoc} from 'firebase/firestore';
import { db } from '@/db/configFirebase';
import { useAuth } from '@/hooks/useAuth';

import { questionsUser } from '@/config/questionsUserConfig'
import { OnboardingCard } from '@/components/onboarding/onboarding-card'
import { Mascot } from '@/components/mascot'
import GoalDefinition from '@/components/common/goal-definition'
import { Goal } from '@/types'

const steps = [
  'welcome',
  'explanation',
  'userProfile',
  'transition',
  'goalSetting',
  'complete',
] as const

const FuturisticFirstLoginForm: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<(typeof steps)[number]>('welcome')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [progress, setProgress] = useState(0)
  const router = useRouter();

  useEffect(() => {
    setProgress(((currentQuestionIndex + 1) / questionsUser.length) * 100)
  }, [currentQuestionIndex])

  const addGoal = async (goal: Omit<Goal, 'guid' | 'progress'>): Promise<string> => {
    if (!user) {
      alert("User not authenticated.")
      return ''
    }
    try {
      const docRef = await addDoc(collection(db, 'users', user.uid, 'goals'), { ...goal, progress: 0 })
      return docRef.id
    } catch (error) {
      console.error("Error adding goal:", error)
      return ''
    }
  }

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

  const handleNext = () => {
    const stepIndex = steps.indexOf(currentStep)
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1])
      setCurrentQuestionIndex(0)
    }
  }

  const handleNextQuestion = async (e: React.FormEvent) => {
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

  const resetForm = () => {
    setFormData({});
    setCurrentQuestionIndex(0);
  }

  const showMessage = () => {
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 1500)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      

      <AnimatePresence mode="wait">
          <motion.div
            key={`${currentStep}-${currentQuestionIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {currentStep === 'welcome' && (
                    <div className="text-center space-y-6">
                      <Mascot />
                      <h1 className="text-4xl font-bold text-foreground">Welcome to Goal Tracker!</h1>
                      <p className="text-foreground text-lg">
                        Let's embark on a journey to achieve your goals together.
                      </p>
                      <Button size="lg" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </div>
            )}

            {currentStep === 'explanation' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-center text-foreground">How it works ?</h2>
                <div className="space-y-6">
                  <Card className="">
                    <CardHeader>
                      <CardTitle className="text-lg">1. Build Your Profile</CardTitle>
                      <CardDescription className="">
                        Answer a few questions to help us understand your personality and preferences.
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">2. Set Your Goals</CardTitle>
                      <CardDescription className="">
                        Define clear, actionable goals with our guided process.
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">3. Track Progress</CardTitle>
                      <CardDescription className="">
                        Monitor your progress and get personalized recommendations.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
                <div className="flex justify-center">
                  <Button size="lg" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">Continue</Button>
                </div>
              </div>
            )}

            {currentStep === 'userProfile' && (
              <OnboardingCard
                progress={progress}
                currentQuestionIndex={currentQuestionIndex}
                questionsLength={questionsUser.length}
                formData={formData}
                currentQuestion={currentQuestion}
                getInputComponent={getInputComponent}
                handleBack={handleBack}
                handleNext={handleNextQuestion}
              />
            )}

            {currentStep === 'transition' && (
              <div className="text-center space-y-6">
                <Mascot />
                <h2 className="text-3xl font-bold text-blue-800">Great Job on Your Profile!</h2>
                <p className="text-blue-600 text-lg">
                  Now that we know you better, let's set your first goal and start your journey to success.
                </p>
                <Button size="lg" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">Set Your First Goal</Button>
              </div>
            )}

            {currentStep === 'goalSetting' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center text-blue-800">Set Your First Goal</h2>
                <div className="p-6 bg-white rounded-lg shadow-sm border border-blue-200 space-y-4">
                  <GoalDefinition user={user} resetForm={resetForm} />
                </div>
              </div>
            )}

            {currentStep === 'complete' && (
              <div className="text-center space-y-6">
                <Mascot />
                <h2 className="text-3xl font-bold text-blue-800">You're All Set!</h2>
                <p className="text-blue-600 text-lg">
                  Your profile is complete and your first goal is set. Let's start tracking your progress!
                </p>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">Go to Dashboard</Button>
              </div>
            )}
        </motion.div>
      </AnimatePresence>
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

