import { useState, useEffect } from 'react';
import { DatabaseService } from '../services/database';
import { User, LaborerProfile, EmployerProfile } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('labor_connect_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try to get user from database
      const dbUser = await DatabaseService.getUserByEmail(email);
      
      if (dbUser) {
        // If laborer, get additional profile data
        if (dbUser.role === 'laborer') {
          const laborerProfile = await DatabaseService.getLaborerProfile(dbUser.id);
          if (laborerProfile) {
            const fullProfile: LaborerProfile = {
              ...dbUser,
              role: 'laborer',
              skills: laborerProfile.skills,
              experience: laborerProfile.experience,
              hourlyRate: laborerProfile.hourly_rate,
              availability: laborerProfile.availability,
              languages: laborerProfile.languages,
              description: laborerProfile.description,
              workHistory: []
            };
            setUser(fullProfile);
            localStorage.setItem('labor_connect_user', JSON.stringify(fullProfile));
            return true;
          }
        }
        
        setUser(dbUser);
        localStorage.setItem('labor_connect_user', JSON.stringify(dbUser));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = await DatabaseService.createUser(userData);
      
      if (newUser) {
        setUser(newUser);
        localStorage.setItem('labor_connect_user', JSON.stringify(newUser));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('labor_connect_user');
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};