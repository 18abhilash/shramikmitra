import React from 'react';
import { LaborerDashboard } from '../components/dashboard/LaborerDashboard';
import { useAuth } from '../hooks/useAuth';
import { LaborerProfile } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to access your dashboard
          </h2>
          <a href="/login" className="text-blue-600 hover:text-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (user.role === 'laborer') {
    return <LaborerDashboard user={user as LaborerProfile} />;
  }

  // For employers, we would create an EmployerDashboard component
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Employer Dashboard Coming Soon
        </h2>
        <p className="text-gray-600">
          The employer dashboard is currently under development.
        </p>
      </div>
    </div>
  );
};