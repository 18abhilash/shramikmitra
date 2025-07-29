import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Users, Shield, Star, Mic } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { VoiceButton } from '../components/ui/VoiceButton';
import { useVoiceRecording } from '../hooks/useVoiceRecording';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isRecording, startRecording, stopRecording } = useVoiceRecording();

  const features = [
    {
      icon: Search,
      title: 'Smart Job Matching',
      description: 'AI-powered matching system connects you with the perfect opportunities based on your skills and location.',
    },
    {
      icon: Mic,
      title: 'Voice-First Interface',
      description: 'Create profiles and search for work using voice commands. Perfect for users who prefer speaking over typing.',
    },
    {
      icon: MapPin,
      title: 'Location-Based Search',
      description: 'Find work opportunities near you with GPS-enabled search and real-time location tracking.',
    },
    {
      icon: Shield,
      title: 'Verified & Secure',
      description: 'All users are verified with ID checks and secure payment processing for your safety.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join a community of trusted workers and employers with comprehensive rating systems.',
    },
    {
      icon: Star,
      title: 'Build Your Reputation',
      description: 'Earn ratings and build your professional reputation with completed jobs and positive reviews.',
    },
  ];

  const categories = [
    { name: 'Construction', icon: '🏗️', jobs: 245 },
    { name: 'Agriculture', icon: '🌾', jobs: 189 },
    { name: 'Household', icon: '🏠', jobs: 324 },
    { name: 'Transportation', icon: '🚛', jobs: 156 },
    { name: 'Cleaning', icon: '🧹', jobs: 278 },
    { name: 'Gardening', icon: '🌱', jobs: 167 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect. Work. Earn.
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              The smart platform connecting local laborers with employers. 
              Find work or hire skilled workers in your area with AI-powered matching.
            </p>
          </motion.div>

          {/* Search Interface */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Get Started Today
                </h2>
                <p className="text-gray-600">
                  Search for work or use voice commands to create your profile
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for jobs or skills (e.g., construction, farming, cleaning)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
                
                <div className="flex gap-3">
                  <VoiceButton
                    isRecording={isRecording}
                    onStartRecording={startRecording}
                    onStopRecording={stopRecording}
                    size="lg"
                  />
                  <Button size="lg" className="px-8">
                    Search Jobs
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" size="lg" className="h-14">
                  I'm Looking for Work
                </Button>
                <Button variant="outline" size="lg" className="h-14">
                  I Need to Hire Workers
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Job Categories
            </h2>
            <p className="text-xl text-gray-600">
              Explore opportunities across various industries
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover className="p-6 text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.jobs} jobs available</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose LaborConnect?
            </h2>
            <p className="text-xl text-gray-600">
              Built for the modern workforce with cutting-edge technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-8 h-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                    <feature.icon size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10,000+', label: 'Active Workers' },
              { number: '5,000+', label: 'Employers' },
              { number: '50,000+', label: 'Jobs Completed' },
              { number: '4.9', label: 'Average Rating' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of workers and employers who trust LaborConnect
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                Sign Up as Worker
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900 px-8">
                Post a Job
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};