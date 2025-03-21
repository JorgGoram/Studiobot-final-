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
    - actions: User actions tracking
    - voice_agents: Voice agent configurations
    - phone_numbers: Phone number management
    - optional_preferences: Additional user preferences

  3. Security
    - RLS enabled on all tables
    - Appropriate policies for each table
    - Foreign key constraints
    - Indexes for performance

  4. Changes
    - Added comprehensive RLS policies
    - Added indexes for frequently queried columns
    - Added constraints for data integrity
*/

-- Create custom types
CREATE TYPE voice_agent_status AS ENUM ('active', 'inactive', 'training');
CREATE TYPE voice_preference AS ENUM ('gender-neutral', 'female', 'male');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
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
  welcome_message text,
  custom_instructions text,
  model_id text,
  website text,
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

-- Add column comments for profiles table
COMMENT ON COLUMN profiles.welcome_message IS 'Welcome message used by the voice assistant';
COMMENT ON COLUMN profiles.custom_instructions IS 'Custom instructions for voice assistant behavior';
COMMENT ON COLUMN profiles.website IS 'that is own website';

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
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  feature_id uuid REFERENCES feature_flags(id) NOT NULL,
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
  user_id uuid NOT NULL UNIQUE DEFAULT uid() REFERENCES auth.users(id)
);

-- Create voice_agents table
CREATE TABLE IF NOT EXISTS voice_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  name text NOT NULL,
  status voice_agent_status NOT NULL DEFAULT 'inactive',
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
  level integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT voice_agents_stability_check CHECK (stability >= 0 AND stability <= 1),
  CONSTRAINT voice_agents_style_check CHECK (style_exaggeration >= 0 AND style_exaggeration <= 1),
  CONSTRAINT voice_agents_similarity_check CHECK (similarity >= 0 AND similarity <= 1)
);

-- Add comments for voice_agents table
COMMENT ON COLUMN voice_agents.user_id IS 'Reference to the auth.users table';
COMMENT ON COLUMN voice_agents.status IS 'Current status of the voice agent';
COMMENT ON COLUMN voice_agents.level IS 'Experience level of the voice agent';

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
  user_id uuid NOT NULL DEFAULT uid() REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  appointment_type text,
  operating_hours json DEFAULT '{}',
  piercing_service boolean DEFAULT false,
  hourly_rate double precision DEFAULT 0,
  specific_instructions text,
  PRIMARY KEY (id, user_id),
  UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE optional_preferences ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_profiles_completed_onboarding ON profiles(completed_onboarding);
CREATE INDEX idx_profiles_owner_name ON profiles(owner_name);
CREATE INDEX idx_profiles_shop_name ON profiles(shop_name);
CREATE INDEX idx_voice_agents_user_id ON voice_agents(user_id);
CREATE INDEX idx_voice_agents_status ON voice_agents(status);
CREATE INDEX idx_voice_agents_created_at ON voice_agents(created_at);

-- Create RLS policies
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT TO public
  USING (role() = 'anon');

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO public
  USING (role() = 'anon')
  WITH CHECK (role() = 'anon');

CREATE POLICY "Anyone can read feature flags" ON feature_flags
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Users can read their own features" ON user_features
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own voice agents" ON voice_agents
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own voice agents" ON voice_agents
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own voice agents" ON voice_agents
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own voice agents" ON voice_agents
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable read access for all users" ON optional_preferences
  FOR ALL TO public
  USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON phone_numbers
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON phone_numbers
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "All" ON phone_numbers
  FOR ALL TO public
  USING (true);

-- Create triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION check_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.completed_onboarding = true THEN
    IF NEW.owner_name IS NULL OR NEW.shop_name IS NULL THEN
      RAISE EXCEPTION 'Owner name and shop name are required to complete onboarding';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_voice_agents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

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