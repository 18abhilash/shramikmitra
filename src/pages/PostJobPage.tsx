import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JobPostForm } from '../components/job/JobPostForm';
import { useAuth } from '../hooks/useAuth';
import { Job } from '../types';

export const PostJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to post a job
          </h2>
          <a href="/login" className="text-blue-600 hover:text-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (user.role !== 'employer') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Only employers can post jobs
          </h2>
          <a href="/dashboard" className="text-blue-600 hover:text-blue-700">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const handleJobPosted = (job: Job) => {
    // Navigate to job details or dashboard
    navigate('/dashboard');
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <JobPostForm onJobPosted={handleJobPosted} onCancel={handleCancel} />
    </div>
  );
};