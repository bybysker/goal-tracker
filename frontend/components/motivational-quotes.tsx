'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Quote } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
]

export function MotivationalQuotes() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])
  const [key, setKey] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setKey(prevKey => prevKey + 1)
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)])
    }, 15000) // Change quote every 15 seconds

    return () => clearInterval(intervalId)
  }, [])

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="py-2 px-4">
        <div className="relative">
          <Quote className="absolute top-0 left-0 h-4 w-4 text-white opacity-20" />
          <AnimatePresence mode="wait">
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="pt-8"
            >
              <blockquote className="text-md text-center italic text-white mb-4">
                {currentQuote.text}
              </blockquote>
              <footer className="text-right text-sm text-white opacity-75">
                — {currentQuote.author}
              </footer>
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}

