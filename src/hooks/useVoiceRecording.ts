import { useState, useRef, useCallback } from 'react';
import { VoiceRecording } from '../types';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const recording: VoiceRecording = {
          id: Date.now().toString(),
          audioBlob,
          duration: 0, // Will be calculated
          timestamp: new Date(),
        };
        setRecordings(prev => [...prev, recording]);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access to use voice features.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const clearRecordings = useCallback(() => {
    setRecordings([]);
  }, []);

  // Mock function to simulate AI transcription
  const transcribeAudio = useCallback(async (audioBlob: Blob): Promise<string> => {
    // In production, this would integrate with OpenAI Whisper or Google Speech-to-Text
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
    
    // Mock responses for demo
    const mockResponses = [
      "I am a construction worker with 5 years experience in masonry and concrete work.",
      "Looking for daily wage work in farming or agriculture. I have experience with crops.",
      "I am available for household work like cleaning, cooking, and general maintenance.",
      "Skilled electrician seeking work. I can handle residential and commercial projects.",
      "I need workers for a construction project lasting 2 weeks. Good pay offered."
    ];
    
    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  }, []);

  return {
    isRecording,
    recordings,
    error,
    startRecording,
    stopRecording,
    clearRecordings,
    transcribeAudio,
  };
};