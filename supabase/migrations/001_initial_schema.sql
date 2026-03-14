-- lumis/supabase/migrations/001_initial_schema.sql

-- 1. Create Entries table
CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  mood INT NOT NULL CHECK (mood >= 1 AND mood <= 10),
  energy INT NOT NULL CHECK (energy >= 1 AND energy <= 10),
  stress INT NOT NULL CHECK (stress >= 1 AND stress <= 10),
  emoji TEXT NOT NULL,
  free_text TEXT,
  tags TEXT[] DEFAULT '{}',
  prompt_responses JSONB DEFAULT '[]',
  personal_statement JSONB DEFAULT '[]',
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  deleted INT DEFAULT 0
);

-- 2. Create Reflections table
CREATE TABLE reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL, -- 'weekly' or 'monthly'
  content TEXT NOT NULL,
  advice TEXT,
  created_at BIGINT NOT NULL
);

-- 3. Create Trusted Devices table
CREATE TABLE trusted_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  device_id TEXT NOT NULL,
  last_login TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Push Subscriptions table
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  subscription JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies (Ensure users can only see their own data)
CREATE POLICY "Users can only access their own entries" ON entries 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own reflections" ON reflections 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own devices" ON trusted_devices 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own subscriptions" ON push_subscriptions 
  USING (auth.uid() = user_id);
