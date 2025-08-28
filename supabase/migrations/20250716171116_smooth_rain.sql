-- LaborConnect Database Schema
-- Run this SQL in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('laborer', 'employer')) NOT NULL,
    avatar_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.0,
    location_lat DECIMAL(10,8) NOT NULL,
    location_lng DECIMAL(11,8) NOT NULL,
    location_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Laborer profiles table
CREATE TABLE IF NOT EXISTS laborer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skills TEXT[] DEFAULT '{}',
    experience INTEGER DEFAULT 0,
    hourly_rate DECIMAL(8,2) DEFAULT 15.00,
    availability VARCHAR(20) CHECK (availability IN ('available', 'busy', 'offline')) DEFAULT 'available',
    languages TEXT[] DEFAULT '{"English"}',
    description TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) CHECK (category IN ('construction', 'agriculture', 'household', 'transportation', 'other')) NOT NULL,
    employer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    location_lat DECIMAL(10,8) NOT NULL,
    location_lng DECIMAL(11,8) NOT NULL,
    location_address TEXT NOT NULL,
    pay_rate DECIMAL(8,2) NOT NULL,
    pay_type VARCHAR(20) CHECK (pay_type IN ('hourly', 'daily', 'fixed')) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    status VARCHAR(20) CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    urgent BOOLEAN DEFAULT FALSE
);

-- Job applications table
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    laborer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, laborer_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('text', 'voice', 'location')) DEFAULT 'text',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    rater_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rated_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, rater_id, rated_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_laborer_profiles_user_id ON laborer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_laborer_id ON job_applications(laborer_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages(sender_id, receiver_id);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE laborer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Users can read all user profiles but only update their own
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Laborer profiles policies
CREATE POLICY "Anyone can view laborer profiles" ON laborer_profiles FOR SELECT USING (true);
CREATE POLICY "Laborers can manage own profile" ON laborer_profiles FOR ALL USING (auth.uid()::text = user_id::text);

-- Jobs policies
CREATE POLICY "Anyone can view open jobs" ON jobs FOR SELECT USING (true);
CREATE POLICY "Employers can manage own jobs" ON jobs FOR ALL USING (auth.uid()::text = employer_id::text);

- Job applications policies
CREATE POLICY "Users can view applications for their jobs/applications" ON job_applications FOR SELECT USING (
    auth.uid()::text = laborer_id::text OR 
    auth.uid()::text IN (SELECT employer_id::text FROM jobs WHERE id = job_id)
    );
CREATE POLICY "Laborers can apply to jobs" ON job_applications FOR INSERT WITH CHECK (auth.uid()::text = laborer_id::text);
CREATE POLICY "Employers can update application status" ON job_applications FOR UPDATE USING (
    auth.uid()::text IN (SELECT employer_id::text FROM jobs WHERE id = job_id)
);

-- Messages policies
CREATE POLICY "Users can view their messages" ON messages FOR SELECT USING (
    auth.uid()::text = sender_id::text OR auth.uid()::text = receiver_id::text
);

    

