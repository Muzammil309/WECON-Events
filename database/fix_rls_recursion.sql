-- Fix RLS Infinite Recursion Issue
-- Execute this in Supabase SQL Editor to fix the users table policies

-- =============================================
-- DROP PROBLEMATIC POLICIES
-- =============================================

-- Drop the recursive policies on users table
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Public user profiles are viewable" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- =============================================
-- CREATE NON-RECURSIVE POLICIES
-- =============================================

-- Allow users to view their own profile (no recursion)
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile (no recursion)
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to view public profiles (simplified)
CREATE POLICY "Public user profiles are viewable" ON users
  FOR SELECT USING (
    auth.role() = 'authenticated' AND
    (privacy_level = 'PUBLIC' OR auth.uid() = id)
  );

-- Allow service role to manage all users (for admin operations)
CREATE POLICY "Service role can manage all users" ON users
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can create their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
-- FIX OTHER RECURSIVE POLICIES
-- =============================================

-- Drop and recreate admin policies that reference users table
DROP POLICY IF EXISTS "Admins can manage all events" ON events;
DROP POLICY IF EXISTS "Event creators and admins can manage sessions" ON sessions;
DROP POLICY IF EXISTS "Event creators and admins can view registrations" ON event_registrations;
DROP POLICY IF EXISTS "Admins can view all tasks" ON admin_tasks;
DROP POLICY IF EXISTS "Admins can manage tasks" ON admin_tasks;
DROP POLICY IF EXISTS "Admins can manage digital signage" ON digital_signage;

-- Recreate with service role check instead of user role lookup
CREATE POLICY "Service role can manage all events" ON events
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all sessions" ON sessions
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can view all registrations" ON event_registrations
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all tasks" ON admin_tasks
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all signage" ON digital_signage
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================
-- ENABLE BYPASS FOR SUPER ADMIN CREATION
-- =============================================

-- Temporarily allow service role to bypass RLS for initial setup
ALTER TABLE users FORCE ROW LEVEL SECURITY;

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

-- =============================================
-- VERIFICATION
-- =============================================

-- Show current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY tablename, policyname;
