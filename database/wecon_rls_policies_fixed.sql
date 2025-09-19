-- WECON Event Management System - Row Level Security Policies (CORRECTED)
-- Execute this AFTER running wecon_schema.sql

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_signage ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USERS TABLE POLICIES
-- =============================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Public user profiles are viewable by authenticated users
CREATE POLICY "Public user profiles are viewable" ON users
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    (privacy_level = 'PUBLIC' OR auth.uid() = id)
  );

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('SUPER_ADMIN', 'ADMIN', 'EVENT_MANAGER')
    )
  );

-- =============================================
-- EVENTS TABLE POLICIES
-- =============================================

-- Published events are viewable by all authenticated users
CREATE POLICY "Published events are viewable by all" ON events
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    (status = 'PUBLISHED' OR status = 'LIVE' OR status = 'COMPLETED')
  );

-- Event creators can manage their events
CREATE POLICY "Event creators can manage their events" ON events
  FOR ALL USING (auth.uid() = created_by);

-- Admins can manage all events
CREATE POLICY "Admins can manage all events" ON events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('SUPER_ADMIN', 'ADMIN', 'EVENT_MANAGER')
    )
  );

-- =============================================
-- SESSIONS TABLE POLICIES
-- =============================================

-- Sessions are viewable for published events
CREATE POLICY "Sessions are viewable for published events" ON sessions
  FOR SELECT USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = sessions.event_id 
      AND (status = 'PUBLISHED' OR status = 'LIVE' OR status = 'COMPLETED')
    )
  );

-- Event creators and admins can manage sessions
CREATE POLICY "Event creators and admins can manage sessions" ON sessions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = sessions.event_id 
      AND (
        created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users 
          WHERE id = auth.uid() 
          AND role IN ('SUPER_ADMIN', 'ADMIN', 'EVENT_MANAGER')
        )
      )
    )
  );

-- =============================================
-- EVENT REGISTRATIONS POLICIES
-- =============================================

-- Users can view their own registrations
CREATE POLICY "Users can view their own registrations" ON event_registrations
  FOR SELECT USING (auth.uid() = user_id);

-- Users can register for events
CREATE POLICY "Users can register for events" ON event_registrations
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = event_id 
      AND registration_open = true 
      AND (registration_deadline IS NULL OR registration_deadline > NOW())
    )
  );

-- Users can update their own registrations
CREATE POLICY "Users can update their own registrations" ON event_registrations
  FOR UPDATE USING (auth.uid() = user_id);

-- Event creators and admins can view all registrations for their events
CREATE POLICY "Event creators and admins can view registrations" ON event_registrations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = event_id 
      AND (
        created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users 
          WHERE id = auth.uid() 
          AND role IN ('SUPER_ADMIN', 'ADMIN', 'EVENT_MANAGER')
        )
      )
    )
  );

-- =============================================
-- SESSION REGISTRATIONS POLICIES
-- =============================================

-- Users can view their own session registrations
CREATE POLICY "Users can view their own session registrations" ON session_registrations
  FOR SELECT USING (auth.uid() = user_id);

-- Users can register for sessions
CREATE POLICY "Users can register for sessions" ON session_registrations
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM sessions s
      JOIN events e ON s.event_id = e.id
      WHERE s.id = session_id 
      AND e.registration_open = true
    )
  );

-- =============================================
-- CONNECTIONS POLICIES
-- =============================================

-- Users can view their connections
CREATE POLICY "Users can view their connections" ON connections
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

-- Users can create connection requests
CREATE POLICY "Users can create connection requests" ON connections
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

-- Users can respond to connection requests
CREATE POLICY "Users can respond to connection requests" ON connections
  FOR UPDATE USING (auth.uid() = recipient_id OR auth.uid() = requester_id);

-- =============================================
-- MEETINGS POLICIES
-- =============================================

-- Users can view their meetings
CREATE POLICY "Users can view their meetings" ON meetings
  FOR SELECT USING (auth.uid() = organizer_id OR auth.uid() = participant_id);

-- Users can create meetings
CREATE POLICY "Users can create meetings" ON meetings
  FOR INSERT WITH CHECK (auth.uid() = organizer_id);

-- Users can update their meetings
CREATE POLICY "Users can update their meetings" ON meetings
  FOR UPDATE USING (auth.uid() = organizer_id OR auth.uid() = participant_id);

-- =============================================
-- NOTIFICATIONS POLICIES
-- =============================================

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- System can create notifications for users
CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- =============================================
-- ADMIN TASKS POLICIES
-- =============================================

-- Admins can view all tasks
CREATE POLICY "Admins can view all tasks" ON admin_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('SUPER_ADMIN', 'ADMIN', 'EVENT_MANAGER')
    )
  );

-- Admins can manage tasks
CREATE POLICY "Admins can manage tasks" ON admin_tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('SUPER_ADMIN', 'ADMIN', 'EVENT_MANAGER')
    )
  );

-- =============================================
-- DIGITAL SIGNAGE POLICIES
-- =============================================

-- Everyone can view active digital signage
CREATE POLICY "Everyone can view active digital signage" ON digital_signage
  FOR SELECT USING (
    active = true AND 
    (start_time IS NULL OR start_time <= NOW()) AND 
    (end_time IS NULL OR end_time >= NOW())
  );

-- Admins can manage digital signage
CREATE POLICY "Admins can manage digital signage" ON digital_signage
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('SUPER_ADMIN', 'ADMIN', 'EVENT_MANAGER')
    )
  );

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_registrations_updated_at BEFORE UPDATE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_tasks_updated_at BEFORE UPDATE ON admin_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_digital_signage_updated_at BEFORE UPDATE ON digital_signage
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
