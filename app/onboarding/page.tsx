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
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/db/configFirebase';
import { useAuth } from '@/hooks/useAuth';

import { questions } from '@/config/questionsConfig'



const FuturisticFirstLoginForm: React.FC = () => {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [progress, setProgress] = useState(0)
  const router = useRouter();

  useEffect(() => {
    setProgress(((currentQuestionIndex + 1) / questions.length) * 100)
  }, [currentQuestionIndex])

  const currentQuestion = questions[currentQuestionIndex]

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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1)
    } else {
      if (!user) {
        alert("User not authenticated.");
        return;
      }
      try {
        console.log('Submitting formData:', formData);
        await addDoc(collection(db, 'users', user.uid, "formResponses"), formData);
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
            className="text-lg bg-white/10 border-white/20 text-white placeholder-white/50"
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
            className="text-lg bg-white/10 border-white/20 text-white placeholder-white/50"
            rows={4}
            placeholder="Type your answer here..."
          />
        )
      case 'slider':
        return (
          <div className="space-y-4">
            <Slider
              defaultValue={[Number(value) || currentQuestion.min || 0]}
              min={currentQuestion.min}
              max={currentQuestion.max}
              step={1}
              onValueChange={handleSliderChange}
              className="[&_[role=slider]]:bg-white"
            />
            <div className="flex justify-between text-sm text-white/60">
              <span>{currentQuestion.min}</span>
              <span>{currentQuestion.max}</span>
            </div>
          </div>
        )
      case 'radio':
        return (
          <RadioGroup onValueChange={handleRadioChange} value={formData[currentQuestion.id] || []} className="space-y-2">
            {currentQuestion.options?.map((option) => (
              <div key={String(option)} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} className="border-white/20 text-white" />
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
                  className="border-white/20 text-white"
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
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-[#0f0f1a]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-5"></div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
      <Card className="w-full max-w-lg bg-black/30 backdrop-blur-xl shadow-2xl rounded-xl overflow-hidden border border-white/10">
        <CardHeader className="text-center relative">
          <div className="absolute top-0 left-0 w-full">
            <Progress value={progress} className="w-full rounded-none h-1" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardTitle className="text-3xl font-bold text-white mt-4">Welcome, {formData.name || 'Explorer'}!</CardTitle>
            <CardDescription className="text-lg text-white/80">Let's embark on a journey of discovery</CardDescription>
          </motion.div>
        </CardHeader>
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
                    <currentQuestion.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <Label htmlFor={currentQuestion.id} className="text-xl font-medium text-white">
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
                className="flex-1 bg-white/10 hover:bg-white/20 text-white"
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit" className="flex-1 text-lg font-semibold group bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600">
                <span className="mr-2">{currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}</span>
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
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% completed</span>
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
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
              <h2 className="text-xl font-bold text-gray-800">Submission successful</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FuturisticFirstLoginForm;
