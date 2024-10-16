"use client"

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"
import { Mic, StopCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"

import axios from 'axios'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/db/configFirebase';
import { User as FirebaseUser } from 'firebase/auth'



interface VoiceMemoProps {
  voiceMemo: string | null;
  user: FirebaseUser | null;
}

const VoiceMemo: React.FC<VoiceMemoProps> = ({
  voiceMemo,
  user
}) => {

  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const { toast } = useToast()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.start();
  
      const audioChunks: Blob[] = [];
      mediaRecorder.current.addEventListener("dataavailable", (event: BlobEvent) => {
        audioChunks.push(event.data);
      });
  
      mediaRecorder.current.addEventListener("stop", async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        console.log(audioBlob, 'audioBlob')
        const formData = new FormData();
        if (user) {
          formData.append('voice_memo', audioBlob, "voice_memo.wav");
          
          try {
            //const response = await axios.post('/api/transcribe_voice', formData, {
            const response = await axios.post('https://backend-weathered-hill-9485.fly.dev/transcribe_voice', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
    
            setTranscription(response.data.transcription);
    
          } catch (error) {
            console.error("Error transcribing voice memo:", error);
            toast({
              title: "Transcription Error",
              description: "Failed to transcribe the voice memo. Please try again.",
              variant: "destructive",
            })
          }
        }
      });

      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please check your microphone permissions.",
        variant: "destructive",
      })
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  }

  // Save Reflection Handler
  const handleSaveReflection = async () => {
    if (!transcription) {
      toast({
        title: "No Reflection",
        description: "Please record or type a reflection before saving.",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      alert("User not authenticated.");
      return;
    }

    try {
      // **Step 1:** Create a text Blob from the reflection
      const reflectionBlob = new Blob([transcription], { type: 'text/plain' });

      // **Step 2:** Define the storage path
      const storageRefPath = `users/${user.uid}/reflections/${Date.now()}.txt`;
      const storageRefPathEncoded = encodeURI(storageRefPath); // Ensure the path is URL-safe
      const storageRefInstance = ref(storage, storageRefPathEncoded);

      // **Step 3:** Upload the reflection text file to Firebase Storage
      const snapshot = await uploadBytes(storageRefInstance, reflectionBlob);

      // **Step 4:** Get the download URL of the uploaded transcription
      const url = await getDownloadURL(snapshot.ref);
      console.log("Transcription uploaded to:", url);


      // Optionally, reset the transcription state
      setTranscription('');
      // If you want to clear the textarea after saving, you might need to adjust the `VoiceMemo` component accordingly

    } catch (error) {
      console.error("Error uploading transcription:", error);
      toast({
        title: "Save Error",
        description: "Failed to save the reflection. Please try again.",
        variant: "destructive",
      })
    }
  }

  const showMessage = () => {
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 1500)
  }

  return (

    <div >
      <Card className="bg-transparent text-foreground border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Express your thoughts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-center pt-4">
              <Button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-full ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isRecording ? <StopCircle className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
            </div>
            {voiceMemo && (
              <div className="bg-gray-800 p-4 rounded-md">
                <audio src={voiceMemo} controls className="w-full" />
              </div>
            )}
            <Textarea 
              placeholder="Transcribe your voice memo here or type your daily reflection" 
              className="w-full bg-white border-gray-200 text-black min-h-[100px]"
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)} // Update transcription in parent
            />
            <div className="flex justify-center pt-4">
              <Button 
                onClick={() => { handleSaveReflection(); showMessage(); }}
                className="w-1/3 min-w-44 bg-green-600 hover:bg-green-700"
              >
                Save Reflection
              </Button>
            </div>
          </div>
        </CardContent>
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
              <h2 className="text-xl font-bold text-gray-800">Reflection saved successfully!</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VoiceMemo;
