import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Clock, FileText, Plus, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TranslatedText } from '../ui/TranslatedText';
import { useLocation } from '../../hooks/useLocation';
import { useAuth } from '../../hooks/useAuth';
import { DatabaseService } from '../../services/database';
import { Job } from '../../types';

interface JobPostFormProps {
  onJobPosted?: (job: Job) => void;
  onCancel?: () => void;
}

export const JobPostForm: React.FC<JobPostFormProps> = ({
  onJobPosted,
  onCancel,
}) => {
  const { user } = useAuth();
  const { getCurrentLocation, geocodeAddress } = useLocation();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'construction' as Job['category'],
    payRate: '',
    payType: 'hourly' as Job['payType'],
    duration: '',
    locationAddress: '',
    requirements: [''],
    urgent: false,
    startDate: new Date().toISOString().split('T')[0],
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  const categories = [
    { value: 'construction', label: 'Construction', icon: '🏗️' },
    { value: 'agriculture', label: 'Agriculture', icon: '🌾' },
    { value: 'household', label: 'Household', icon: '🏠' },
    { value: 'transportation', label: 'Transportation', icon: '🚛' },
    { value: 'other', label: 'Other', icon: '⚡' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({ ...prev, requirements: newRequirements }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, ''],
    }));
  };

  const removeRequirement = (index: number) => {
    if (formData.requirements.length > 1) {
      const newRequirements = formData.requirements.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, requirements: newRequirements }));
    }
  };

  const useCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const location = await getCurrentLocation();
      if (location) {
        setFormData(prev => ({ ...prev, locationAddress: location.address }));
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      // Geocode the address
      const location = await geocodeAddress(formData.locationAddress);
      if (!location) {
        setError('Unable to find the specified location. Please check the address.');
        setLoading(false);
        return;
      }

      const jobData: Partial<Job> = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        employerId: user.id,
        location: {
          lat: location.lat,
          lng: location.lng,
          address: formData.locationAddress,
        },
        payRate: parseFloat(formData.payRate),
        payType: formData.payType,
        duration: formData.duration,
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        urgent: formData.urgent,
        startDate: new Date(formData.startDate),
      };

      const jobId = await DatabaseService.createJob(jobData);
      
      if (jobId) {
        // Create a complete job object for the callback
        const newJob: Job = {
          id: jobId,
          ...jobData as Required<Omit<Job, 'id' | 'employer' | 'applicants' | 'createdAt' | 'assignedTo' | 'endDate'>>,
          employer: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: 'employer',
            verified: user.verified,
            rating: user.rating,
            location: user.location,
            createdAt: user.createdAt,
            lastActive: user.lastActive,
            jobsPosted: 0,
            totalHired: 0,
          },
          applicants: [],
          status: 'open',
          createdAt: new Date(),
        };
        
        onJobPosted?.(newJob);
      } else {
        setError('Failed to post job. Please try again.');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      setError('An error occurred while posting the job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          <TranslatedText text="Post a New Job" />
        </h2>
        <p className="text-gray-600">
          <TranslatedText text="Fill out the details to find the right workers for your project" />
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <TranslatedText text="Job Title" />
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Kitchen Renovation Helper"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <TranslatedText text="Category" />
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInputChange('category', category.value)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  formData.category === category.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="text-sm font-medium">
                  <TranslatedText text={category.label} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <TranslatedText text="Job Description" />
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the work that needs to be done..."
            required
          />
        </div>

        {/* Pay Rate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TranslatedText text="Pay Rate" />
            </label>
            <div className="relative">
              <DollarSign size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="number"
                value={formData.payRate}
                onChange={(e) => handleInputChange('payRate', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="25"
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TranslatedText text="Pay Type" />
            </label>
            <select
              value={formData.payType}
              onChange={(e) => handleInputChange('payType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="hourly">Per Hour</option>
              <option value="daily">Per Day</option>
              <option value="fixed">Fixed Price</option>
            </select>
          </div>
        </div>

        {/* Duration and Start Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TranslatedText text="Duration" />
            </label>
            <div className="relative">
              <Clock size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 3 days, 1 week"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TranslatedText text="Start Date" />
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <TranslatedText text="Job Location" />
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={formData.locationAddress}
                onChange={(e) => handleInputChange('locationAddress', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter job location address"
                required
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={useCurrentLocation}
              loading={locationLoading}
              className="px-4"
            >
              <TranslatedText text="Use Current" />
            </Button>
          </div>
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <TranslatedText text="Requirements" />
          </label>
          <div className="space-y-2">
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => handleRequirementChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Basic tools required"
                />
                {formData.requirements.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeRequirement(index)}
                    className="px-3"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addRequirement}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              <TranslatedText text="Add Requirement" />
            </Button>
          </div>
        </div>

        {/* Urgent Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="urgent"
            checked={formData.urgent}
            onChange={(e) => handleInputChange('urgent', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="urgent" className="ml-2 text-sm text-gray-700">
            <TranslatedText text="This is an urgent job" />
          </label>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3"
          >
            <p className="text-red-700 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            loading={loading}
            className="flex-1"
          >
            <TranslatedText text="Post Job" />
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              <TranslatedText text="Cancel" />
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};