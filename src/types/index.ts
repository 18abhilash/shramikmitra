export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: 'laborer' | 'employer';
  avatar?: string;
  verified: boolean;
  rating: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: Date;
  lastActive: Date;
}

export interface LaborerProfile extends User {
  role: 'laborer';
  skills: string[];
  experience: number;
  hourlyRate: number;
  availability: 'available' | 'busy' | 'offline';
  languages: string[];
  description: string;
  workHistory: WorkHistory[];
}

export interface EmployerProfile extends User {
  role: 'employer';
  companyName?: string;
  jobsPosted: number;
  totalHired: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: 'construction' | 'agriculture' | 'household' | 'transportation' | 'other';
  employerId: string;
  employer: EmployerProfile;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  payRate: number;
  payType: 'hourly' | 'daily' | 'fixed';
  duration: string;
  requirements: string[];
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  applicants: string[];
  assignedTo?: string;
  createdAt: Date;
  startDate: Date;
  endDate?: Date;
  urgent: boolean;
}

export interface WorkHistory {
  jobId: string;
  jobTitle: string;
  employerName: string;
  completedAt: Date;
  rating: number;
  earnings: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'voice' | 'location';
  timestamp: Date;
  read: boolean;
}

export interface VoiceRecording {
  id: string;
  audioBlob: Blob;
  transcript?: string;
  duration: number;
  timestamp: Date;
}