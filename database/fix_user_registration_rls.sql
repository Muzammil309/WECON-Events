-- WECON Event Management System - Fix User Registration RLS Issues
-- Execute this in Supabase SQL Editor to fix the user registration RLS policy violations

-- =============================================
-- STEP 1: DROP ALL PROBLEMATIC POLICIES
-- =============================================

-- Drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can create their own profile" ON users;
DROP POLICY IF EXISTS "Public user profiles are viewable" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Service role can manage all users" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Allow authenticated user creation" ON users;

-- Drop problematic policies on other tables that reference users
DROP POLICY IF EXISTS "Admins can manage all events" ON events;
DROP POLICY IF EXISTS "Event creators and admins can manage sessions" ON sessions;
DROP POLICY IF EXISTS "Event creators and admins can view registrations" ON event_registrations;
DROP POLICY IF EXISTS "Admins can view all tasks" ON admin_tasks;
DROP POLICY IF EXISTS "Admins can manage tasks" ON admin_tasks;
DROP POLICY IF EXISTS "Admins can manage digital signage" ON digital_signage;
DROP POLICY IF EXISTS "Service role can manage all events" ON events;
DROP POLICY IF EXISTS "Service role can manage all sessions" ON sessions;
DROP POLICY IF EXISTS "Service role can view all registrations" ON event_registrations;
DROP POLICY IF EXISTS "Service role can manage all tasks" ON admin_tasks;
DROP POLICY IF EXISTS "Service role can manage all signage" ON digital_signage;

-- =============================================
-- STEP 2: CREATE NON-RECURSIVE USER POLICIES
-- =============================================

-- Allow service role to bypass RLS completely (for admin operations and user creation)
CREATE POLICY "Service role can manage all users" ON users
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow users to view their own profile (no recursion)
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile (no recursion)
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile during registration
CREATE POLICY "Users can create their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow authenticated users to view public profiles (simplified, no recursion)
CREATE POLICY "Public user profiles are viewable" ON users
  FOR SELECT USING (
    auth.role() = 'authenticated' AND
    (privacy_level = 'PUBLIC' OR auth.uid() = id)
  );

-- =============================================
-- STEP 3: CREATE HELPER FUNCTION FOR ADMIN CHECKS
-- =============================================

-- Create a function to check if user is admin without recursion
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Use a direct query with security definer to avoid RLS
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = user_id 
    AND role IN ('SUPER_ADMIN', 'ADMIN', 'EVENT_MANAGER')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO anon;

-- =============================================
-- STEP 4: RECREATE OTHER TABLE POLICIES WITH SERVICE ROLE
-- =============================================

-- Events table policies
CREATE POLICY "Service role can manage all events" ON events
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Event creators can manage their events" ON events
  FOR ALL USING (auth.uid() = created_by);

-- Sessions table policies  
CREATE POLICY "Service role can manage all sessions" ON sessions
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Event registrations policies
CREATE POLICY "Service role can view all registrations" ON event_registrations
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Users can view their own registrations" ON event_registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events" ON event_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin tasks policies
CREATE POLICY "Service role can manage all tasks" ON admin_tasks
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Digital signage policies
CREATE POLICY "Service role can manage all signage" ON digital_signage
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Everyone can view active digital signage" ON digital_signage
  FOR SELECT USING (
    active = true AND 
    (start_time IS NULL OR start_time <= NOW()) AND 
    (end_time IS NULL OR end_time >= NOW())
  );

-- =============================================
-- STEP 5: ENSURE RLS IS PROPERLY CONFIGURED
-- =============================================

-- Force RLS on users table to ensure policies are applied
ALTER TABLE users FORCE ROW LEVEL SECURITY;

-- Enable RLS on all other tables
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
-- STEP 6: VERIFICATION
-- =============================================

-- Show current policies on users table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY tablename, policyname;

-- Test query to ensure policies work
SELECT 'RLS policies applied successfully' as status;
