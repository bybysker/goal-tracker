"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Mic, StopCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface VoiceMemoProps {
  voiceMemo: string | null;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  transcription: string | null;
  onSaveReflection: () => void;
}

const VoiceMemo: React.FC<VoiceMemoProps> = ({
  voiceMemo,
  isRecording,
  startRecording,
  stopRecording,
  transcription,
  onSaveReflection
}) => {

  const [currentTranscription, setCurrentTranscription] = useState(transcription || '');

  useEffect(() => {
    if (transcription) {
      setCurrentTranscription(transcription);
    }
  }, [transcription]);

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
            value={currentTranscription}
            onChange={(e) => setCurrentTranscription(e.target.value)}
          />
          <Button 
            onClick={onSaveReflection}
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
