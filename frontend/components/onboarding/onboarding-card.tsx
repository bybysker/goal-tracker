import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronsRight, ChevronLeft } from 'lucide-react'

interface OnboardingCardProps {
  progress: number
  currentQuestionIndex: number
  questionsLength: number
  formData: Record<string, any>
  currentQuestion: any
  getInputComponent: () => React.ReactNode
  handleBack: () => void
  handleNext: (e: React.FormEvent) => Promise<void>
}

export const OnboardingCard: React.FC<OnboardingCardProps> = ({
  progress,
  currentQuestionIndex,
  questionsLength,
  formData,
  currentQuestion,
  getInputComponent,
  handleBack,
  handleNext,
}) => {
  return (
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
          <CardTitle className="text-3xl font-bold text-white mt-4">
            Welcome, {formData.name || 'Explorer'}!
          </CardTitle>
          <CardDescription className="text-lg text-white/80">
            Let&apos;s embark on a journey of discovery
          </CardDescription>
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
                <Label htmlFor={currentQuestion.id} className="text-md text-center font-medium text-white">
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
              <span className="mr-2">
                {currentQuestionIndex < questionsLength - 1 ? 'Next' : 'Submit'}
              </span>
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
            <span>Question {currentQuestionIndex + 1} of {questionsLength}</span>
            <span>{Math.round(progress)}% completed</span>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
