-- WECON Database Schema - Mixed Data Types (UUID + BIGINT)
-- Handles Supabase's mixed environment: UUID for users, BIGINT for other tables

-- =============================================
-- STEP 1: VERIFY EXISTING TABLE STRUCTURE
-- =============================================

-- Check current table structure first
SELECT 'Current table structure check:' as info;
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('users', 'events') 
AND column_name = 'id'
ORDER BY table_name;

-- =============================================
-- STEP 2: UPDATE EXISTING TABLES
-- =============================================

-- Add missing columns to users table (UUID primary key)
DO $$
BEGIN
    -- Add role column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'ATTENDEE' CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'EVENT_MANAGER', 'MODERATOR', 'SPEAKER', 'SPONSOR', 'ATTENDEE', 'CHECK_IN_STAFF'));
    END IF;
    
    -- Add essential user profile columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'first_name') THEN
        ALTER TABLE users ADD COLUMN first_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_name') THEN
        ALTER TABLE users ADD COLUMN last_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'display_name') THEN
        ALTER TABLE users ADD COLUMN display_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'bio') THEN
        ALTER TABLE users ADD COLUMN bio TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'company') THEN
        ALTER TABLE users ADD COLUMN company TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'job_title') THEN
        ALTER TABLE users ADD COLUMN job_title TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone') THEN
        ALTER TABLE users ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'privacy_level') THEN
        ALTER TABLE users ADD COLUMN privacy_level TEXT DEFAULT 'PUBLIC' CHECK (privacy_level IN ('PUBLIC', 'ATTENDEES_ONLY', 'CONNECTIONS_ONLY', 'PRIVATE'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'networking_available') THEN
        ALTER TABLE users ADD COLUMN networking_available BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_notifications') THEN
        ALTER TABLE users ADD COLUMN email_notifications BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'push_notifications') THEN
        ALTER TABLE users ADD COLUMN push_notifications BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_verified') THEN
        ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'created_at') THEN
        ALTER TABLE users ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at') THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Add missing columns to events table (BIGINT primary key)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'status') THEN
        ALTER TABLE events ADD COLUMN status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'LIVE', 'COMPLETED', 'CANCELLED'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'registration_open') THEN
        ALTER TABLE events ADD COLUMN registration_open BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'registration_deadline') THEN
        ALTER TABLE events ADD COLUMN registration_deadline TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- CRITICAL FIX: Use UUID for created_by to reference users(id)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'created_by') THEN
        ALTER TABLE events ADD COLUMN created_by UUID REFERENCES users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'created_at') THEN
        ALTER TABLE events ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'updated_at') THEN
        ALTER TABLE events ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- =============================================
-- STEP 3: CREATE MISSING TABLES
-- =============================================

-- Create sessions table (BIGINT PK, UUID for user references)
CREATE TABLE IF NOT EXISTS sessions (
  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  session_type TEXT DEFAULT 'KEYNOTE' CHECK (session_type IN ('KEYNOTE', 'WORKSHOP', 'PANEL', 'NETWORKING', 'BREAK', 'VIRTUAL', 'HYBRID')),
  status TEXT DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED')),
  speaker_ids UUID[], -- UUID array for user references
  track TEXT,
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  room_name TEXT,
  room_capacity INTEGER,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  requires_registration BOOLEAN DEFAULT false,
  virtual_url TEXT,
  recording_url TEXT,
  live_stream_url TEXT,
  slides_url TEXT,
  resources_url TEXT,
  qa_enabled BOOLEAN DEFAULT true,
  chat_enabled BOOLEAN DEFAULT true,
  polling_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_registrations table (BIGINT PK, UUID for user_id)
CREATE TABLE IF NOT EXISTS event_registrations (
  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- UUID for user reference
  registration_type TEXT DEFAULT 'ATTENDEE' CHECK (registration_type IN ('ATTENDEE', 'SPEAKER', 'SPONSOR', 'VOLUNTEER', 'VIP')),
  status TEXT DEFAULT 'REGISTERED' CHECK (status IN ('REGISTERED', 'CONFIRMED', 'CHECKED_IN', 'NO_SHOW', 'CANCELLED')),
  ticket_type TEXT,
  payment_status TEXT DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'REFUNDED', 'FAILED')),
  payment_amount DECIMAL(10,2),
  special_requirements TEXT,
  dietary_restrictions TEXT,
  emergency_contact TEXT,
  qr_code TEXT UNIQUE,
  check_in_time TIMESTAMP WITH TIME ZONE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create session_registrations table (BIGINT PK, UUID for user_id)
CREATE TABLE IF NOT EXISTS session_registrations (
  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  session_id BIGINT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- UUID for user reference
  status TEXT DEFAULT 'REGISTERED' CHECK (status IN ('REGISTERED', 'ATTENDED', 'NO_SHOW', 'CANCELLED')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attended_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(session_id, user_id)
);

-- Create connections table (BIGINT PK, UUID for user references)
CREATE TABLE IF NOT EXISTS connections (
  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- UUID for user reference
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- UUID for user reference
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(requester_id, recipient_id),
  CHECK (requester_id != recipient_id)
);

-- Create meetings table (BIGINT PK, UUID for user references)
CREATE TABLE IF NOT EXISTS meetings (
  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  event_id BIGINT REFERENCES events(id) ON DELETE CASCADE,
  organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- UUID for user reference
  participant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- UUID for user reference
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  location TEXT,
  virtual_url TEXT,
  status TEXT DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table (BIGINT PK, UUID for user_id)
CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- UUID for user reference
  type TEXT NOT NULL CHECK (type IN ('EVENT_UPDATE', 'SESSION_REMINDER', 'CONNECTION_REQUEST', 'MEETING_SCHEDULED', 'SYSTEM_ANNOUNCEMENT')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create admin_tasks table (BIGINT PK, UUID for user references)
CREATE TABLE IF NOT EXISTS admin_tasks (
  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  assigned_to UUID REFERENCES users(id), -- UUID for user reference
  created_by UUID NOT NULL REFERENCES users(id), -- UUID for user reference
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create digital_signage table (BIGINT PK, UUID for created_by)
CREATE TABLE IF NOT EXISTS digital_signage (
  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'TEXT' CHECK (content_type IN ('TEXT', 'IMAGE', 'VIDEO', 'HTML')),
  display_duration INTEGER DEFAULT 10,
  priority INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT true,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES users(id), -- UUID for user reference
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- STEP 4: CREATE INDEXES
-- =============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);

-- Sessions indexes
CREATE INDEX IF NOT EXISTS idx_sessions_event_id ON sessions(event_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);

-- Registrations indexes
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_session_registrations_session_id ON session_registrations(session_id);
CREATE INDEX IF NOT EXISTS idx_session_registrations_user_id ON session_registrations(user_id);

-- Connections indexes
CREATE INDEX IF NOT EXISTS idx_connections_requester_id ON connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_recipient_id ON connections(recipient_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Meetings indexes
CREATE INDEX IF NOT EXISTS idx_meetings_organizer_id ON meetings(organizer_id);
CREATE INDEX IF NOT EXISTS idx_meetings_participant_id ON meetings(participant_id);

-- Admin tasks indexes
CREATE INDEX IF NOT EXISTS idx_admin_tasks_assigned_to ON admin_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_admin_tasks_created_by ON admin_tasks(created_by);

-- Digital signage indexes
CREATE INDEX IF NOT EXISTS idx_digital_signage_created_by ON digital_signage(created_by);

-- =============================================
-- STEP 5: COMPREHENSIVE VERIFICATION
-- =============================================

-- Show all created tables with column counts and data types
SELECT 'WECON Database Schema Complete! Tables created:' as message;

SELECT 
  t.table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count,
  (SELECT data_type FROM information_schema.columns WHERE table_name = t.table_name AND column_name = 'id') as id_type
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY t.table_name;

-- Verify foreign key relationships
SELECT 'Foreign Key Relationships:' as info;
SELECT 
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name, kcu.column_name;
