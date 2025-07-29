import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          phone: string;
          name: string;
          role: 'laborer' | 'employer';
          avatar_url?: string;
          verified: boolean;
          rating: number;
          location_lat: number;
          location_lng: number;
          location_address: string;
          created_at: string;
          last_active: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      laborer_profiles: {
        Row: {
          id: string;
          user_id: string;
          skills: string[];
          experience: number;
          hourly_rate: number;
          availability: 'available' | 'busy' | 'offline';
          languages: string[];
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['laborer_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['laborer_profiles']['Insert']>;
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: 'construction' | 'agriculture' | 'household' | 'transportation' | 'other';
          employer_id: string;
          location_lat: number;
          location_lng: number;
          location_address: string;
          pay_rate: number;
          pay_type: 'hourly' | 'daily' | 'fixed';
          duration: string;
          requirements: string[];
          status: 'open' | 'in_progress' | 'completed' | 'cancelled';
          assigned_to?: string;
          created_at: string;
          start_date: string;
          end_date?: string;
          urgent: boolean;
        };
        Insert: Omit<Database['public']['Tables']['jobs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['jobs']['Insert']>;
      };
      job_applications: {
        Row: {
          id: string;
          job_id: string;
          laborer_id: string;
          status: 'pending' | 'accepted' | 'rejected';
          message?: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['job_applications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['job_applications']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          type: 'text' | 'voice' | 'location';
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      ratings: {
        Row: {
          id: string;
          job_id: string;
          rater_id: string;
          rated_id: string;
          rating: number;
          comment?: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ratings']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['ratings']['Insert']>;
      };
    };
  };
}