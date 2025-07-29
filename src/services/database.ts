import { supabase } from '../lib/supabase';
import { User, LaborerProfile, Job, Message } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class DatabaseService {
  // User operations
  static async createUser(userData: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: uuidv4(),
          email: userData.email!,
          phone: userData.phone!,
          name: userData.name!,
          role: userData.role!,
          verified: false,
          rating: 0,
          location_lat: userData.location?.lat || 0,
          location_lng: userData.location?.lng || 0,
          location_address: userData.location?.address || '',
          last_active: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return this.mapUserFromDB(data);
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      return this.mapUserFromDB(data);
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: updates.name,
          phone: updates.phone,
          location_lat: updates.location?.lat,
          location_lng: updates.location?.lng,
          location_address: updates.location?.address,
          last_active: new Date().toISOString(),
        })
        .eq('id', userId);

      return !error;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  // Laborer profile operations
  static async createLaborerProfile(profile: Partial<LaborerProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('laborer_profiles')
        .insert({
          id: uuidv4(),
          user_id: profile.id!,
          skills: profile.skills || [],
          experience: profile.experience || 0,
          hourly_rate: profile.hourlyRate || 15,
          availability: profile.availability || 'available',
          languages: profile.languages || ['English'],
          description: profile.description || '',
          updated_at: new Date().toISOString(),
        });

      return !error;
    } catch (error) {
      console.error('Error creating laborer profile:', error);
      return false;
    }
  }

  static async getLaborerProfile(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('laborer_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting laborer profile:', error);
      return null;
    }
  }

  // Job operations
  static async createJob(jobData: Partial<Job>): Promise<string | null> {
    try {
      const jobId = uuidv4();
      const { error } = await supabase
        .from('jobs')
        .insert({
          id: jobId,
          title: jobData.title!,
          description: jobData.description!,
          category: jobData.category!,
          employer_id: jobData.employerId!,
          location_lat: jobData.location?.lat || 0,
          location_lng: jobData.location?.lng || 0,
          location_address: jobData.location?.address || '',
          pay_rate: jobData.payRate!,
          pay_type: jobData.payType!,
          duration: jobData.duration!,
          requirements: jobData.requirements || [],
          status: 'open',
          start_date: jobData.startDate?.toISOString() || new Date().toISOString(),
          urgent: jobData.urgent || false,
        });

      if (error) throw error;
      return jobId;
    } catch (error) {
      console.error('Error creating job:', error);
      return null;
    }
  }

  static async getJobsNearLocation(lat: number, lng: number, radius: number = 50): Promise<Job[]> {
    try {
      // For demo purposes, we'll get all jobs and filter by distance client-side
      // In production, use PostGIS for proper geospatial queries
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          users!jobs_employer_id_fkey (
            id, name, email, phone, rating, verified
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(job => this.mapJobFromDB(job)).filter(job => {
        const distance = this.calculateDistance(lat, lng, job.location.lat, job.location.lng);
        return distance <= radius;
      });
    } catch (error) {
      console.error('Error getting nearby jobs:', error);
      return [];
    }
  }

  static async searchJobs(query: string, category?: string): Promise<Job[]> {
    try {
      let queryBuilder = supabase
        .from('jobs')
        .select(`
          *,
          users!jobs_employer_id_fkey (
            id, name, email, phone, rating, verified
          )
        `)
        .eq('status', 'open');

      if (category) {
        queryBuilder = queryBuilder.eq('category', category);
      }

      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }

      const { data, error } = await queryBuilder.order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(job => this.mapJobFromDB(job));
    } catch (error) {
      console.error('Error searching jobs:', error);
      return [];
    }
  }

  static async applyToJob(jobId: string, laborerId: string, message?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          id: uuidv4(),
          job_id: jobId,
          laborer_id: laborerId,
          status: 'pending',
          message: message || '',
        });

      return !error;
    } catch (error) {
      console.error('Error applying to job:', error);
      return false;
    }
  }

  // Message operations
  static async sendMessage(senderId: string, receiverId: string, content: string, type: 'text' | 'voice' = 'text'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          id: uuidv4(),
          sender_id: senderId,
          receiver_id: receiverId,
          content,
          type,
          read: false,
        });

      return !error;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  static async getMessages(userId1: string, userId2: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data.map(msg => this.mapMessageFromDB(msg));
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  // Helper methods
  private static mapUserFromDB(data: any): User {
    return {
      id: data.id,
      email: data.email,
      phone: data.phone,
      name: data.name,
      role: data.role,
      avatar: data.avatar_url,
      verified: data.verified,
      rating: data.rating,
      location: {
        lat: data.location_lat,
        lng: data.location_lng,
        address: data.location_address,
      },
      createdAt: new Date(data.created_at),
      lastActive: new Date(data.last_active),
    };
  }

  private static mapJobFromDB(data: any): Job {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      employerId: data.employer_id,
      employer: {
        id: data.users.id,
        name: data.users.name,
        email: data.users.email,
        phone: data.users.phone,
        role: 'employer',
        verified: data.users.verified,
        rating: data.users.rating,
        location: { lat: 0, lng: 0, address: '' },
        createdAt: new Date(),
        lastActive: new Date(),
        jobsPosted: 0,
        totalHired: 0,
      },
      location: {
        lat: data.location_lat,
        lng: data.location_lng,
        address: data.location_address,
      },
      payRate: data.pay_rate,
      payType: data.pay_type,
      duration: data.duration,
      requirements: data.requirements,
      status: data.status,
      applicants: [],
      assignedTo: data.assigned_to,
      createdAt: new Date(data.created_at),
      startDate: new Date(data.start_date),
      endDate: data.end_date ? new Date(data.end_date) : undefined,
      urgent: data.urgent,
    };
  }

  private static mapMessageFromDB(data: any): Message {
    return {
      id: data.id,
      senderId: data.sender_id,
      receiverId: data.receiver_id,
      content: data.content,
      type: data.type,
      timestamp: new Date(data.created_at),
      read: data.read,
    };
  }

  private static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}