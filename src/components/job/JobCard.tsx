import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, User, Star } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Job } from '../../types';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
  showDistance?: boolean;
  distance?: number;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onApply,
  onViewDetails,
  showDistance = false,
  distance,
}) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      construction: 'bg-orange-100 text-orange-800',
      agriculture: 'bg-green-100 text-green-800',
      household: 'bg-blue-100 text-blue-800',
      transportation: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const formatPayRate = (rate: number, type: string) => {
    return `$${rate}/${type === 'hourly' ? 'hr' : type === 'daily' ? 'day' : 'job'}`;
  };

  return (
    <Card hover className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            {job.urgent && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                Urgent
              </span>
            )}
          </div>
          
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(job.category)}`}>
            {job.category.charAt(0).toUpperCase() + job.category.slice(1)}
          </span>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-green-600">
            {formatPayRate(job.payRate, job.payType)}
          </div>
          {showDistance && distance && (
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <MapPin size={14} className="mr-1" />
              {distance.toFixed(1)} km away
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <MapPin size={16} className="mr-2" />
          {job.location.address}
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Clock size={16} className="mr-2" />
          Duration: {job.duration}
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <User size={16} className="mr-2" />
          {job.employer.name}
          {job.employer.rating > 0 && (
            <div className="flex items-center ml-2">
              <Star size={14} className="text-yellow-400 fill-current mr-1" />
              <span>{job.employer.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {job.requirements.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
          <div className="flex flex-wrap gap-2">
            {job.requirements.slice(0, 3).map((req, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {req}
              </span>
            ))}
            {job.requirements.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                +{job.requirements.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={() => onViewDetails?.(job.id)}
          variant="outline"
          className="flex-1"
        >
          View Details
        </Button>
        
        {job.status === 'open' && (
          <Button
            onClick={() => onApply?.(job.id)}
            className="flex-1"
          >
            Apply Now
          </Button>
        )}
      </div>
    </Card>
  );
};