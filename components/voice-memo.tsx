"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"
import { Textarea } from "@/components/ui/textarea";

interface VoiceMemoProps {
  voiceMemo: string | null;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  transcription: string | null;
  setTranscription: (value: string) => void;
  onSaveReflection: () => void;
}

const VoiceMemo: React.FC<VoiceMemoProps> = ({
  voiceMemo,
  isRecording,
  startRecording,
  stopRecording,
  transcription,
  setTranscription,
  onSaveReflection
}) => {

  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const showMessage = () => {
    setShowSuccessMessage(true)
    // Automatically hide the message after 3 seconds
    setTimeout(() => setShowSuccessMessage(false), 1500)
  }

  //const [reflection, setReflection] = useState(transcription || '');

  //useEffect(() => {
  //  if (transcription) {
  //    setReflection(transcription);
  //  }
  //}, [transcription]);

  return (
    
    <Card className="bg-gray-900 text-gray-100 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Voice Memo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-full ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isRecording ? <StopCircle className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
          {voiceMemo && (
            <div className="bg-gray-800 p-4 rounded-md">
              <audio src={voiceMemo} controls className="w-full" />
            </div>
          )}
          <Textarea 
            placeholder="Transcribe your voice memo here or type your daily reflection" 
            className="w-full bg-gray-800 border-gray-700 text-gray-100 min-h-[100px]"
            value={transcription || ''}
            onChange={(e) => setTranscription(e.target.value)} // Update transcription in parent
          />
          <AnimatePresence>
            {showSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 50 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  duration: 0.5
                }}
                className="fixed inset-0 flex items-center justify-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="bg-green-500 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center space-y-4 opacity-65"
                  style={{ width: '280px', height: '280px' }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.2,
                      duration: 0.6
                    }}
                  >
                    <CheckCircle size={80} strokeWidth={2} />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-2xl font-bold text-center"
                  >
                    Reflection saved successfully!
                  </motion.h2>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <Button 
            onClick={() => { onSaveReflection(); showMessage(); }}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Save Reflection
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default VoiceMemo;
