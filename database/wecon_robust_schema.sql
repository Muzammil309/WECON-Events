-- WECON Database Schema - Robust Implementation with Proper Dependencies
-- Execute this ENTIRE script in your Supabase SQL Editor

-- =============================================
-- STEP 1: INITIAL VERIFICATION
-- =============================================

-- Check current state
SELECT 'Starting WECON schema creation...' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- =============================================
-- STEP 2: UPDATE EXISTING USERS TABLE
-- =============================================

-- Ensure users table has all required columns
DO $$
BEGIN
    RAISE NOTICE 'Updating users table...';
    
    -- Add role column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'ATTENDEE' CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'EVENT_MANAGER', 'MODERATOR', 'SPEAKER', 'SPONSOR', 'ATTENDEE', 'CHECK_IN_STAFF'));
        RAISE NOTICE 'Added role column to users table';
    END IF;
    
    -- Add essential columns
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
    
    RAISE NOTICE 'Users table updated successfully';
END $$;

-- =============================================
-- STEP 3: UPDATE EXISTING EVENTS TABLE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE 'Updating events table...';
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'status') THEN
        ALTER TABLE events ADD COLUMN status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'LIVE', 'COMPLETED', 'CANCELLED'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'registration_open') THEN
        ALTER TABLE events ADD COLUMN registration_open BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'registration_deadline') THEN
        ALTER TABLE events ADD COLUMN registration_deadline TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- CRITICAL: Use UUID for created_by to reference users(id)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'created_by') THEN
        ALTER TABLE events ADD COLUMN created_by UUID REFERENCES users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'created_at') THEN
        ALTER TABLE events ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'updated_at') THEN
        ALTER TABLE events ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    RAISE NOTICE 'Events table updated successfully';
END $$;

-- =============================================
-- STEP 4: CREATE SESSIONS TABLE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE 'Creating sessions table...';
    
    CREATE TABLE IF NOT EXISTS sessions (
      id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
      event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      session_type TEXT DEFAULT 'KEYNOTE' CHECK (session_type IN ('KEYNOTE', 'WORKSHOP', 'PANEL', 'NETWORKING', 'BREAK', 'VIRTUAL', 'HYBRID')),
      status TEXT DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED')),
      speaker_ids UUID[],
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
    
    RAISE NOTICE 'Sessions table created successfully';
END $$;

-- =============================================
-- STEP 5: CREATE EVENT_REGISTRATIONS TABLE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE 'Creating event_registrations table...';
    
    CREATE TABLE IF NOT EXISTS event_registrations (
      id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
      event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    
    RAISE NOTICE 'Event_registrations table created successfully';
END $$;

-- =============================================
-- STEP 6: CREATE SESSION_REGISTRATIONS TABLE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE 'Creating session_registrations table...';
    
    CREATE TABLE IF NOT EXISTS session_registrations (
      id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
      session_id BIGINT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT DEFAULT 'REGISTERED' CHECK (status IN ('REGISTERED', 'ATTENDED', 'NO_SHOW', 'CANCELLED')),
      registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      attended_at TIMESTAMP WITH TIME ZONE,
      UNIQUE(session_id, user_id)
    );
    
    RAISE NOTICE 'Session_registrations table created successfully';
END $$;

-- =============================================
-- STEP 7: CREATE CONNECTIONS TABLE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE 'Creating connections table...';
    
    CREATE TABLE IF NOT EXISTS connections (
      id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
      requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED')),
      message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      responded_at TIMESTAMP WITH TIME ZONE,
      UNIQUE(requester_id, recipient_id),
      CHECK (requester_id != recipient_id)
    );
    
    RAISE NOTICE 'Connections table created successfully';
END $$;

-- =============================================
-- STEP 8: CREATE MEETINGS TABLE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE 'Creating meetings table...';
    
    CREATE TABLE IF NOT EXISTS meetings (
      id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
      event_id BIGINT REFERENCES events(id) ON DELETE CASCADE,
      organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      participant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    
    RAISE NOTICE 'Meetings table created successfully';
END $$;

-- =============================================
-- STEP 9: CREATE NOTIFICATIONS TABLE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE 'Creating notifications table...';
    
    CREATE TABLE IF NOT EXISTS notifications (
      id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL CHECK (type IN ('EVENT_UPDATE', 'SESSION_REMINDER', 'CONNECTION_REQUEST', 'MEETING_SCHEDULED', 'SYSTEM_ANNOUNCEMENT')),
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      data JSONB,
      read BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      expires_at TIMESTAMP WITH TIME ZONE
    );
    
    RAISE NOTICE 'Notifications table created successfully';
END $$;

-- =============================================
-- STEP 10: CREATE ADMIN_TASKS TABLE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE 'Creating admin_tasks table...';
    
    CREATE TABLE IF NOT EXISTS admin_tasks (
      id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
      status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
      assigned_to UUID REFERENCES users(id),
      created_by UUID NOT NULL REFERENCES users(id),
      due_date TIMESTAMP WITH TIME ZONE,
      completed_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    RAISE NOTICE 'Admin_tasks table created successfully';
END $$;

-- =============================================
-- STEP 11: CREATE DIGITAL_SIGNAGE TABLE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE 'Creating digital_signage table...';
    
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
      created_by UUID NOT NULL REFERENCES users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    RAISE NOTICE 'Digital_signage table created successfully';
END $$;

-- =============================================
-- STEP 12: CREATE INDEXES
-- =============================================

DO $$
BEGIN
    RAISE NOTICE 'Creating indexes...';
    
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
    
    RAISE NOTICE 'Indexes created successfully';
END $$;

-- =============================================
-- STEP 13: FINAL VERIFICATION
-- =============================================

-- Show final results
SELECT 'WECON Database Schema Complete!' as status;

SELECT 
  t.table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY t.table_name;

-- Verify we have exactly 10 tables
SELECT 
  CASE 
    WHEN COUNT(*) = 10 THEN '✅ SUCCESS: All 10 WECON tables created!'
    ELSE '❌ ERROR: Expected 10 tables, found ' || COUNT(*)
  END as final_status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
