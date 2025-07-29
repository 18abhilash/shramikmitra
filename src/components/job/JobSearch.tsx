import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Briefcase } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TranslatedText } from '../ui/TranslatedText';
import { JobCard } from './JobCard';
import { JobMap } from '../maps/JobMap';
import { useLocation } from '../../hooks/useLocation';
import { DatabaseService } from '../../services/database';
import { Job } from '../../types';

export const JobSearch: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  const { location, getCurrentLocation } = useLocation();

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'construction', label: 'Construction' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'household', label: 'Household' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    loadJobs();
  }, [location]);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchQuery, selectedCategory]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      let jobList: Job[] = [];
      
      if (location) {
        // Get jobs near user's location
        jobList = await DatabaseService.getJobsNearLocation(location.lat, location.lng, 50);
      } else {
        // Get all jobs if no location
        jobList = await DatabaseService.searchJobs('');
      }
      
      setJobs(jobList);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.requirements.some(req => req.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    setFilteredJobs(filtered);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await DatabaseService.searchJobs(searchQuery, selectedCategory || undefined);
      setJobs(results);
    } catch (error) {
      console.error('Error searching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToJob = async (jobId: string) => {
    // This would typically open an application modal or navigate to application page
    console.log('Apply to job:', jobId);
    // For demo, we'll just show an alert
    alert('Application submitted! The employer will be notified.');
  };

  const handleGetDirections = (job: Job) => {
    if (location) {
      const url = `https://www.google.com/maps/dir/${location.lat},${location.lng}/${job.location.lat},${job.location.lng}`;
      window.open(url, '_blank');
    }
  };

  const calculateDistance = (job: Job): number => {
    if (!location) return 0;
    const R = 6371; // Earth's radius in kilometers
    const dLat = (job.location.lat - location.lat) * Math.PI / 180;
    const dLng = (job.location.lng - location.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(location.lat * Math.PI / 180) * Math.cos(job.location.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <TranslatedText text="Find Work Opportunities" />
        </h1>
        <p className="text-gray-600">
          <TranslatedText text="Discover jobs near you and apply instantly" />
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 mb-8">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search for jobs, skills, or keywords..."
              />
            </div>
            <Button onClick={handleSearch} loading={loading}>
              <TranslatedText text="Search" />
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                <TranslatedText text="Category:" />
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <TranslatedText text={category.label} />
                </button>
              ))}
            </div>

            <div className="ml-auto flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <Briefcase size={16} className="mr-1" />
                <TranslatedText text="List" />
              </Button>
              <Button
                variant={viewMode === 'map' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
              >
                <MapPin size={16} className="mr-1" />
                <TranslatedText text="Map" />
              </Button>
            </div>
          </div>

          {/* Location Status */}
          {!location && (
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  <TranslatedText text="Enable location to see jobs near you" />
                </span>
              </div>
              <Button size="sm" onClick={getCurrentLocation}>
                <TranslatedText text="Enable Location" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            <TranslatedText text="Loading jobs..." />
          </p>
        </div>
      ) : (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              <TranslatedText text={`${filteredJobs.length} jobs found`} />
            </h2>
          </div>

          {/* Results Content */}
          {viewMode === 'list' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <JobCard
                    job={job}
                    showDistance={!!location}
                    distance={location ? calculateDistance(job) : undefined}
                    onApply={handleApplyToJob}
                    onViewDetails={(jobId) => console.log('View details:', jobId)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <JobMap
              jobs={filteredJobs}
              userLocation={location ? { lat: location.lat, lng: location.lng } : undefined}
              selectedJob={selectedJob}
              onJobSelect={setSelectedJob}
              onGetDirections={handleGetDirections}
            />
          )}

          {filteredJobs.length === 0 && !loading && (
            <Card className="p-12 text-center">
              <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                <TranslatedText text="No jobs found" />
              </h3>
              <p className="text-gray-600 mb-4">
                <TranslatedText text="Try adjusting your search criteria or check back later for new opportunities." />
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                loadJobs();
              }}>
                <TranslatedText text="Clear Filters" />
              </Button>
            </Card>
          )}
        </>
      )}
    </div>
  );
};