import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { VoiceProfileCreator } from '../components/voice/VoiceProfileCreator';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from '../hooks/useLocation';

export const RegisterPage: React.FC = () => {
  const [step, setStep] = useState<'role' | 'method' | 'voice' | 'form'>('role');
  const [userRole, setUserRole] = useState<'laborer' | 'employer' | null>(null);
  const [registrationMethod, setRegistrationMethod] = useState<'voice' | 'form' | null>(null);
  
  const { register } = useAuth();
  const { getCurrentLocation } = useLocation();

  const handleRoleSelection = (role: 'laborer' | 'employer') => {
    setUserRole(role);
    if (role === 'laborer') {
      setStep('method');
    } else {
      setStep('form');
    }
  };

  const handleMethodSelection = (method: 'voice' | 'form') => {
    setRegistrationMethod(method);
    setStep(method);
  };

  const handleVoiceProfileComplete = async (profileData: any) => {
    const location = await getCurrentLocation();
    
    const userData = {
      name: profileData.name || 'Worker',
      email: 'worker@example.com', // Would be collected separately
      phone: '+1234567890', // Would be collected separately
      role: userRole!,
      location: location || { lat: 40.7128, lng: -74.0060, address: 'New York, NY' },
    };

    const success = await register(userData);
    if (success) {
      window.location.href = '/dashboard';
    }
  };

  if (step === 'role') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-2xl">
          <Card className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Join LaborConnect
              </h2>
              <p className="text-gray-600">
                Choose your role to get started
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  hover
                  onClick={() => handleRoleSelection('laborer')}
                  className="p-8 text-center cursor-pointer border-2 border-transparent hover:border-blue-500"
                >
                  <div className="text-6xl mb-4">👷</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    I'm a Worker
                  </h3>
                  <p className="text-gray-600">
                    Looking for work opportunities in construction, agriculture, household services, and more.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  hover
                  onClick={() => handleRoleSelection('employer')}
                  className="p-8 text-center cursor-pointer border-2 border-transparent hover:border-blue-500"
                >
                  <div className="text-6xl mb-4">💼</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    I'm an Employer
                  </h3>
                  <p className="text-gray-600">
                    Need to hire skilled workers for projects and ongoing work.
                  </p>
                </Card>
              </motion.div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'method') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-2xl">
          <Card className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How would you like to create your profile?
              </h2>
              <p className="text-gray-600">
                Choose the method that works best for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  hover
                  onClick={() => handleMethodSelection('voice')}
                  className="p-8 text-center cursor-pointer border-2 border-transparent hover:border-blue-500"
                >
                  <div className="text-6xl mb-4">🎤</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Voice Setup
                  </h3>
                  <p className="text-gray-600">
                    Create your profile by speaking. Perfect if you prefer talking over typing.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  hover
                  onClick={() => handleMethodSelection('form')}
                  className="p-8 text-center cursor-pointer border-2 border-transparent hover:border-blue-500"
                >
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Fill Out Form
                  </h3>
                  <p className="text-gray-600">
                    Create your profile by filling out a traditional form.
                  </p>
                </Card>
              </motion.div>
            </div>

            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => setStep('role')}
              >
                Back to Role Selection
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'voice') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <VoiceProfileCreator onProfileComplete={handleVoiceProfileComplete} />
      </div>
    );
  }

  // Form registration (simplified for demo)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Create Your Account
            </h2>
            <p className="text-gray-600 mt-2">
              Traditional form registration
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Form registration coming soon!
            </p>
            <Button
              variant="outline"
              onClick={() => setStep(userRole === 'laborer' ? 'method' : 'role')}
            >
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};