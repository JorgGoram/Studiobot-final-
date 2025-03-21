/*
  # Initial Database Schema Migration
  
  1. New Types
    - voice_agent_status: Enum for voice agent status (active, inactive, training)
    - voice_preference: Enum for voice preferences (gender-neutral, female, male)
  
  2. New Tables
    - profiles: User profiles and settings
    - webhook: Webhook data storage
    - feature_flags: Feature management
    - user_features: User-specific feature settings
    - actions: User action tracking
    - voice_agents: Voice agent configurations
    - phone_numbers: Phone number management
    - optional_preferences: Additional user preferences
  
  3. Security
    - Row Level Security (RLS) enabled on all tables
    - Policies for authenticated users
    - Policies for public access where needed
  
  4. Indexes
    - Performance optimized indexes on frequently queried columns
    - Unique constraints where needed
*/

-- Create custom types
CREATE TYPE voice_agent_status AS ENUM ('active', 'inactive', 'training');
CREATE TYPE voice_preference AS ENUM ('gender-neutral', 'female', 'male');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id),
  assistant_name text NOT NULL DEFAULT 'My Voice Assistant',
  timezone text NOT NULL DEFAULT 'UTC',
  patience_level text NOT NULL DEFAULT 'medium',
  pause_before_speaking integer NOT NULL DEFAULT 0,
  ring_duration integer NOT NULL DEFAULT 1,
  idle_reminders_enabled boolean NOT NULL DEFAULT false,
  idle_reminder_time integer NOT NULL DEFAULT 6,
  reminder_message text NOT NULL DEFAULT 'I''m still here. Do you have any questions?',
  speaker_boost boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  owner_name text,
  shop_name text,
  completed_onboarding boolean NOT NULL DEFAULT false,
  welcome_message text COMMENT 'Welcome message used by the voice assistant',
  custom_instructions text COMMENT 'Custom instructions for voice assistant behavior',
  model_id text,
  website text COMMENT 'that is own website',
  phone_number text,
  support_email text,
  daily_call_limit bigint,
  voicemail_management boolean,
  automatic_reminders boolean,
  waitlist_management boolean,
  plan text DEFAULT 'TRIAL',
  plan_start date,
  plan_end date,
  total_usage_minutes bigint DEFAULT 15,
  voice_agent_active boolean DEFAULT true
);

-- Create webhook table
CREATE TABLE IF NOT EXISTS webhook (
  id bigint PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  data json
);

-- Create feature_flags table
CREATE TABLE IF NOT EXISTS feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  is_pro boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create user_features table
CREATE TABLE IF NOT EXISTS user_features (
  user_id uuid NOT NULL REFERENCES auth.users(id),
  feature_id uuid NOT NULL REFERENCES feature_flags(id),
  enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, feature_id)
);

-- Create actions table
CREATE TABLE IF NOT EXISTS actions (
  id bigint PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  action_type text,
  action_id text NOT NULL UNIQUE,
  user_id uuid NOT NULL UNIQUE DEFAULT uid()
);

-- Create voice_agents table
CREATE TABLE IF NOT EXISTS voice_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) COMMENT 'Reference to the auth.users table',
  name text NOT NULL,
  status voice_agent_status NOT NULL DEFAULT 'inactive' COMMENT 'Current status of the voice agent',
  voice_preference voice_preference NOT NULL DEFAULT 'gender-neutral',
  voice_engine text NOT NULL DEFAULT 'v2',
  stability numeric NOT NULL DEFAULT 0.5,
  style_exaggeration numeric NOT NULL DEFAULT 0,
  similarity numeric NOT NULL DEFAULT 0.75,
  latency_optimization integer NOT NULL DEFAULT 0,
  welcome_message text NOT NULL DEFAULT 'Hello! How can I assist you today?',
  specific_instructions text,
  communication_tone text NOT NULL DEFAULT 'professional',
  enhanced_emotional_intelligence boolean NOT NULL DEFAULT true,
  language text NOT NULL DEFAULT 'en-US',
  daily_call_limit integer,
  call_handling text NOT NULL DEFAULT 'inbound',
  voicemail_management boolean NOT NULL DEFAULT false,
  automatic_reminders boolean NOT NULL DEFAULT false,
  waitlist_management boolean NOT NULL DEFAULT false,
  total_calls integer NOT NULL DEFAULT 0,
  successful_calls integer NOT NULL DEFAULT 0,
  average_call_duration interval,
  last_active_at timestamptz,
  level integer NOT NULL DEFAULT 1 COMMENT 'Experience level of the voice agent',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  -- Add constraints for numeric ranges
  CONSTRAINT voice_agents_stability_check CHECK (stability >= 0 AND stability <= 1),
  CONSTRAINT voice_agents_style_check CHECK (style_exaggeration >= 0 AND style_exaggeration <= 1),
  CONSTRAINT voice_agents_similarity_check CHECK (similarity >= 0 AND similarity <= 1)
);

-- Create phone_numbers table
CREATE TABLE IF NOT EXISTS phone_numbers (
  id bigint PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  phone_number varchar,
  is_active boolean,
  model_id text
);

-- Create optional_preferences table
CREATE TABLE IF NOT EXISTS optional_preferences (
  id bigint NOT NULL,
  user_id uuid NOT NULL DEFAULT uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  appointment_type text,
  operating_hours json DEFAULT '{}',
  piercing_service boolean DEFAULT false,
  hourly_rate double precision DEFAULT 0,
  specific_instructions text,
  PRIMARY KEY (id, user_id),
  UNIQUE (user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_completed_onboarding ON profiles(completed_onboarding);
CREATE INDEX IF NOT EXISTS idx_profiles_owner_name ON profiles(owner_name);
CREATE INDEX IF NOT EXISTS idx_profiles_shop_name ON profiles(shop_name);
CREATE INDEX IF NOT EXISTS idx_voice_agents_created_at ON voice_agents(created_at);
CREATE INDEX IF NOT EXISTS idx_voice_agents_status ON voice_agents(status);
CREATE INDEX IF NOT EXISTS idx_voice_agents_user_id ON voice_agents(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE optional_preferences ENABLE ROW LEVEL SECURITY;

-- Create security policies
-- Profiles
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (uid() = user_id);

CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT TO public
  USING (role() = 'anon');

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO public
  USING (role() = 'anon')
  WITH CHECK (role() = 'anon');

-- Feature flags
CREATE POLICY "Anyone can read feature flags" ON feature_flags
  FOR SELECT TO public
  USING (true);

-- User features
CREATE POLICY "Users can read their own features" ON user_features
  FOR SELECT TO authenticated
  USING (uid() = user_id);

-- Voice agents
CREATE POLICY "Users can create own voice agents" ON voice_agents
  FOR INSERT TO authenticated
  WITH CHECK (uid() = user_id);

CREATE POLICY "Users can read own voice agents" ON voice_agents
  FOR SELECT TO authenticated
  USING (uid() = user_id);

CREATE POLICY "Users can update own voice agents" ON voice_agents
  FOR UPDATE TO authenticated
  USING (uid() = user_id)
  WITH CHECK (uid() = user_id);

CREATE POLICY "Users can delete own voice agents" ON voice_agents
  FOR DELETE TO authenticated
  USING (uid() = user_id);

-- Phone numbers
CREATE POLICY "All" ON phone_numbers
  FOR ALL TO public
  USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON phone_numbers
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON phone_numbers
  FOR SELECT TO authenticated
  USING (true);

-- Optional preferences
CREATE POLICY "Enable read access for all users" ON optional_preferences
  FOR ALL TO public
  USING (true);

-- Create triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Add your profile completion check logic here
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_voice_agents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER check_profile_completion_trigger
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_profile_completion();

CREATE TRIGGER update_voice_agents_updated_at
  BEFORE UPDATE ON voice_agents
  FOR EACH ROW
  EXECUTE FUNCTION update_voice_agents_updated_at();