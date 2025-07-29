import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, Star, TrendingUp, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { JobCard } from '../job/JobCard';
import { LaborerProfile, Job } from '../../types';

interface LaborerDashboardProps {
  user: LaborerProfile;
}

export const LaborerDashboard: React.FC<LaborerDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applications'>('overview');

  // Mock data for demonstration
  const stats = {
    totalEarnings: 2840,
    jobsCompleted: 12,
    averageRating: 4.8,
    responseRate: 98,
  };

  const nearbyJobs: Job[] = [
    {
      id: '1',
      title: 'Kitchen Renovation Helper',
      description: 'Need assistance with kitchen renovation project. Basic construction skills required.',
      category: 'construction',
      employerId: 'emp1',
      employer: {
        id: 'emp1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1234567890',
        role: 'employer',
        verified: true,
        rating: 4.9,
        location: { lat: 40.7589, lng: -73.9851, address: 'Manhattan, NY' },
        createdAt: new Date(),
        lastActive: new Date(),
        jobsPosted: 5,
        totalHired: 12,
      },
      location: { lat: 40.7589, lng: -73.9851, address: 'Manhattan, NY' },
      payRate: 28,
      payType: 'hourly',
      duration: '3 days',
      requirements: ['Basic tools', 'Construction experience', 'Reliable'],
      status: 'open',
      applicants: [],
      createdAt: new Date(),
      startDate: new Date(Date.now() + 86400000), // Tomorrow
      urgent: false,
    },
    {
      id: '2',
      title: 'Garden Landscaping',
      description: 'Help with planting and basic landscaping work in residential garden.',
      category: 'agriculture',
      employerId: 'emp2',
      employer: {
        id: 'emp2',
        name: 'Michael Chen',
        email: 'michael@example.com',
        phone: '+1234567891',
        role: 'employer',
        verified: true,
        rating: 4.7,
        location: { lat: 40.7505, lng: -73.9934, address: 'Brooklyn, NY' },
        createdAt: new Date(),
        lastActive: new Date(),
        jobsPosted: 3,
        totalHired: 8,
      },
      location: { lat: 40.7505, lng: -73.9934, address: 'Brooklyn, NY' },
      payRate: 22,
      payType: 'hourly',
      duration: '2 days',
      requirements: ['Garden tools', 'Physical fitness'],
      status: 'open',
      applicants: [],
      createdAt: new Date(),
      startDate: new Date(Date.now() + 172800000), // Day after tomorrow
      urgent: true,
    },
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle }: any) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon size={24} className="text-blue-600" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your work today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button className="h-16 text-lg">
          Find New Work
        </Button>
        <Button variant="outline" className="h-16 text-lg">
          Update Availability
        </Button>
        <Button variant="outline" className="h-16 text-lg">
          View Messages
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={DollarSign}
          title="Total Earnings"
          value={`$${stats.totalEarnings}`}
          subtitle="This month"
        />
        <StatCard
          icon={Calendar}
          title="Jobs Completed"
          value={stats.jobsCompleted}
          subtitle="This month"
        />
        <StatCard
          icon={Star}
          title="Average Rating"
          value={stats.averageRating}
          subtitle="From employers"
        />
        <StatCard
          icon={TrendingUp}
          title="Response Rate"
          value={`${stats.responseRate}%`}
          subtitle="Last 30 days"
        />
      </div>

      {/* Availability Status */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Current Status
            </h3>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                user.availability === 'available' ? 'bg-green-500' :
                user.availability === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-gray-700 capitalize">{user.availability}</span>
            </div>
          </div>
          <Button variant="outline">
            Change Status
          </Button>
        </div>
      </Card>

      {/* Nearby Jobs */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Jobs Near You</h2>
          <Button variant="outline">
            View All Jobs
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {nearbyJobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <JobCard
                job={job}
                showDistance
                distance={Math.random() * 10 + 1} // Mock distance
                onApply={(jobId) => console.log('Apply to job:', jobId)}
                onViewDetails={(jobId) => console.log('View job details:', jobId)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            { action: 'Applied to Kitchen Renovation job', time: '2 hours ago', type: 'application' },
            { action: 'Completed Garden Cleanup job', time: '1 day ago', type: 'completion' },
            { action: 'Received 5-star rating from Sarah J.', time: '2 days ago', type: 'rating' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'application' ? 'bg-blue-500' :
                activity.type === 'completion' ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <div className="flex-1">
                <p className="text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};