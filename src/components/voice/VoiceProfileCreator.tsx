import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Check, RotateCcw, Volume2 } from 'lucide-react';
import { VoiceButton } from '../ui/VoiceButton';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useVoiceRecording } from '../../hooks/useVoiceRecording';

interface ProfileData {
  name?: string;
  skills?: string[];
  experience?: number;
  availability?: string;
  hourlyRate?: number;
  description?: string;
}

interface VoiceProfileCreatorProps {
  onProfileComplete: (data: ProfileData) => void;
}

export const VoiceProfileCreator: React.FC<VoiceProfileCreatorProps> = ({
  onProfileComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    isRecording,
    recordings,
    error,
    startRecording,
    stopRecording,
    transcribeAudio,
  } = useVoiceRecording();

  const steps = [
    {
      title: "What's your name?",
      prompt: "Please say your full name clearly",
      field: 'name',
    },
    {
      title: "What skills do you have?",
      prompt: "Tell me about your work skills and experience",
      field: 'skills',
    },
    {
      title: "How many years of experience?",
      prompt: "Say how many years you've been working",
      field: 'experience',
    },
    {
      title: "When are you available?",
      prompt: "Tell me when you can work",
      field: 'availability',
    },
    {
      title: "What's your expected hourly rate?",
      prompt: "Say how much you charge per hour",
      field: 'hourlyRate',
    },
  ];

  const currentStepData = steps[currentStep];

  const handleRecordingComplete = async () => {
    if (recordings.length === 0) return;

    setIsProcessing(true);
    try {
      const latestRecording = recordings[recordings.length - 1];
      const transcript = await transcribeAudio(latestRecording.audioBlob);
      
      // Process transcript based on current step
      let processedValue: any = transcript;
      
      if (currentStepData.field === 'skills') {
        // Extract skills from transcript
        processedValue = transcript.toLowerCase().split(/[,\s]+/).filter(Boolean);
      } else if (currentStepData.field === 'experience') {
        // Extract number from transcript
        const match = transcript.match(/(\d+)/);
        processedValue = match ? parseInt(match[1]) : 0;
      } else if (currentStepData.field === 'hourlyRate') {
        // Extract hourly rate
        const match = transcript.match(/(\d+)/);
        processedValue = match ? parseInt(match[1]) : 15;
      }

      setProfileData(prev => ({
        ...prev,
        [currentStepData.field]: processedValue,
      }));

      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Profile complete
        const completeProfile = {
          ...profileData,
          [currentStepData.field]: processedValue,
          description: transcript,
        };
        onProfileComplete(completeProfile);
      }
    } catch (err) {
      console.error('Error processing recording:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Create Your Profile with Voice
          </h2>
          <p className="text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </p>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {currentStepData.title}
          </h3>
          <p className="text-gray-600 mb-6">
            {currentStepData.prompt}
          </p>

          {/* Voice recording interface */}
          <div className="flex flex-col items-center space-y-4">
            <VoiceButton
              isRecording={isRecording}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              size="lg"
              disabled={isProcessing}
            />
            
            {isRecording && (
              <motion.p
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-red-600 font-medium"
              >
                Recording... Speak clearly
              </motion.p>
            )}

            {recordings.length > 0 && !isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4 w-full"
              >
                <div className="flex items-center justify-center space-x-2 text-green-700">
                  <Check size={20} />
                  <span>Recording captured!</span>
                </div>
              </motion.div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full">
                <p className="text-red-700 text-center">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          <div className="flex space-x-3">
            {recordings.length > 0 && (
              <Button
                onClick={handleRecordingComplete}
                loading={isProcessing}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Continue'}
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={goToNextStep}
              disabled={currentStep === steps.length - 1}
            >
              Skip
            </Button>
          </div>
        </div>

        {/* Profile preview */}
        {Object.keys(profileData).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-gray-50 rounded-lg"
          >
            <h4 className="font-semibold text-gray-900 mb-2">Profile Preview:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              {profileData.name && <p>Name: {profileData.name}</p>}
              {profileData.skills && <p>Skills: {profileData.skills.join(', ')}</p>}
              {profileData.experience && <p>Experience: {profileData.experience} years</p>}
              {profileData.availability && <p>Availability: {profileData.availability}</p>}
              {profileData.hourlyRate && <p>Hourly Rate: ${profileData.hourlyRate}</p>}
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
};