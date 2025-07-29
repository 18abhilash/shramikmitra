import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Menu, Bell, User } from 'lucide-react';
import { LanguageSelector } from '../ui/LanguageSelector';
import { TranslatedText } from '../ui/TranslatedText';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <Briefcase className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">LaborConnect</h1>
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              <a href="/jobs" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                <TranslatedText text="Find Work" />
              </a>
              <a href="/workers" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                <TranslatedText text="Find Workers" />
              </a>
              <a href="/messages" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                <TranslatedText text="Messages" />
              </a>
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            {user ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Bell size={20} />
                </motion.button>
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>
                
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  <TranslatedText text="Logout" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <a
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  <TranslatedText text="Login" />
                </a>
                <a
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <TranslatedText text="Sign Up" />
                </a>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};