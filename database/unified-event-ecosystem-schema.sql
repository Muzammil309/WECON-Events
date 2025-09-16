-- WECON Unified Event Ecosystem - Enhanced Database Schema
-- Building upon existing supabase-setup.sql with advanced features

-- Enable additional extensions for advanced features
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For advanced indexing

-- Enhanced custom types
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EVENT_MANAGER', 'MODERATOR', 'SPEAKER', 'SPONSOR', 'ATTENDEE', 'CHECK_IN_STAFF');
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'LIVE', 'COMPLETED', 'CANCELLED');
CREATE TYPE "SessionType" AS ENUM ('KEYNOTE', 'WORKSHOP', 'PANEL', 'NETWORKING', 'BREAK', 'VIRTUAL', 'HYBRID');
CREATE TYPE "ConnectionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED');
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'SESSION_REMINDER', 'NETWORKING', 'ANNOUNCEMENT', 'EMERGENCY');
CREATE TYPE "MeetingStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
CREATE TYPE "PrivacyLevel" AS ENUM ('PUBLIC', 'ATTENDEES_ONLY', 'CONNECTIONS_ONLY', 'PRIVATE');

-- Enhanced Users table with comprehensive profile management
CREATE TABLE IF NOT EXISTS "users" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    role "UserRole" NOT NULL DEFAULT 'ATTENDEE',
    
    -- Basic Profile
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    display_name TEXT,
    bio TEXT CHECK (char_length(bio) <= 500),
    profile_photo_url TEXT,
    
    -- Professional Information
    job_title TEXT,
    company TEXT,
    industry TEXT,
    location TEXT,
    
    -- Social Media Links
    linkedin_url TEXT,
    twitter_url TEXT,
    website_url TEXT,
    
    -- Privacy & Preferences
    privacy_level "PrivacyLevel" DEFAULT 'PUBLIC',
    networking_available BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    
    -- System Fields
    email_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Professional Interests (many-to-many with users)
CREATE TABLE IF NOT EXISTS "interests" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "user_interests" (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    interest_id UUID REFERENCES interests(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, interest_id)
);

-- Enhanced Events table with multi-tenant support
CREATE TABLE IF NOT EXISTS "events" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT CHECK (char_length(short_description) <= 200),
    
    -- Event Details
    venue_name TEXT,
    venue_address TEXT,
    venue_coordinates POINT,
    timezone TEXT DEFAULT 'UTC',
    
    -- Dates & Status
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    registration_start TIMESTAMP WITH TIME ZONE,
    registration_end TIMESTAMP WITH TIME ZONE,
    status "EventStatus" DEFAULT 'DRAFT',
    
    -- Branding & Customization
    logo_url TEXT,
    banner_url TEXT,
    primary_color TEXT DEFAULT '#764DF0',
    secondary_color TEXT DEFAULT '#442490',
    custom_css TEXT,
    
    -- Capacity & Limits
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    
    -- Features Enabled
    networking_enabled BOOLEAN DEFAULT true,
    qa_enabled BOOLEAN DEFAULT true,
    chat_enabled BOOLEAN DEFAULT true,
    virtual_enabled BOOLEAN DEFAULT false,
    
    -- Organizer
    organizer_id UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Staff/Team Management
CREATE TABLE IF NOT EXISTS "event_staff" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role "UserRole" NOT NULL,
    permissions JSONB DEFAULT '{}',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id),
    UNIQUE(event_id, user_id)
);

-- Enhanced Sessions table
CREATE TABLE IF NOT EXISTS "sessions" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    
    -- Session Details
    title TEXT NOT NULL,
    description TEXT,
    abstract TEXT,
    session_type "SessionType" DEFAULT 'WORKSHOP',
    track TEXT,
    difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    
    -- Scheduling
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    room_id UUID,
    
    -- Capacity & Registration
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    requires_registration BOOLEAN DEFAULT false,
    
    -- Virtual/Hybrid Support
    virtual_url TEXT,
    recording_url TEXT,
    live_stream_url TEXT,
    
    -- Resources
    slides_url TEXT,
    resources_url TEXT,
    
    -- Engagement
    qa_enabled BOOLEAN DEFAULT true,
    chat_enabled BOOLEAN DEFAULT true,
    polling_enabled BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms/Venues table
CREATE TABLE IF NOT EXISTS "rooms" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 0,
    location TEXT,
    floor TEXT,
    equipment JSONB DEFAULT '[]',
    layout_map_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session-Speaker relationships
CREATE TABLE IF NOT EXISTS "session_speakers" (
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'speaker', -- speaker, moderator, panelist
    bio_override TEXT,
    PRIMARY KEY (session_id, user_id)
);

-- Session Registration (for sessions requiring registration)
CREATE TABLE IF NOT EXISTS "session_registrations" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    attended BOOLEAN DEFAULT false,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(session_id, user_id)
);

-- Networking System
CREATE TABLE IF NOT EXISTS "connections" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status "ConnectionStatus" DEFAULT 'PENDING',
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(requester_id, recipient_id),
    CHECK (requester_id != recipient_id)
);

-- Meeting Scheduler
CREATE TABLE IF NOT EXISTS "meetings" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    organizer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL,
    
    location TEXT,
    virtual_url TEXT,
    
    status "MeetingStatus" DEFAULT 'SCHEDULED',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CHECK (organizer_id != participant_id),
    CHECK (end_time > start_time)
);

-- Q&A System
CREATE TABLE IF NOT EXISTS "questions" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    question TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    upvotes INTEGER DEFAULT 0,
    is_answered BOOLEAN DEFAULT false,
    answer TEXT,
    answered_by UUID REFERENCES users(id),
    answered_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Q&A Upvotes
CREATE TABLE IF NOT EXISTS "question_upvotes" (
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (question_id, user_id)
);

-- Live Polling System
CREATE TABLE IF NOT EXISTS "polls" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,

    question TEXT NOT NULL,
    poll_type TEXT DEFAULT 'multiple_choice', -- multiple_choice, single_choice, text, rating
    options JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    is_anonymous BOOLEAN DEFAULT true,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ends_at TIMESTAMP WITH TIME ZONE
);

-- Poll Responses
CREATE TABLE IF NOT EXISTS "poll_responses" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    response JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(poll_id, user_id)
);

-- Chat System
CREATE TABLE IF NOT EXISTS "chat_messages" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    message TEXT NOT NULL,
    is_moderated BOOLEAN DEFAULT false,
    is_hidden BOOLEAN DEFAULT false,
    moderated_by UUID REFERENCES users(id),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications System
CREATE TABLE IF NOT EXISTS "notifications" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    type "NotificationType" NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',

    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Session Feedback
CREATE TABLE IF NOT EXISTS "session_feedback" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    content_rating INTEGER CHECK (content_rating >= 1 AND content_rating <= 5),
    speaker_rating INTEGER CHECK (speaker_rating >= 1 AND speaker_rating <= 5),

    comments TEXT,
    would_recommend BOOLEAN,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(session_id, user_id)
);

-- Event Analytics
CREATE TABLE IF NOT EXISTS "analytics_events" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    session_id UUID REFERENCES sessions(id),

    event_type TEXT NOT NULL, -- page_view, session_join, session_leave, connection_made, etc.
    properties JSONB DEFAULT '{}',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources & Downloads
CREATE TABLE IF NOT EXISTS "resources" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id),
    uploaded_by UUID REFERENCES users(id) ON DELETE CASCADE,

    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,

    is_public BOOLEAN DEFAULT true,
    download_count INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sponsors Management
CREATE TABLE IF NOT EXISTS "sponsors" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,

    name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    description TEXT,

    tier TEXT DEFAULT 'bronze', -- platinum, gold, silver, bronze
    booth_number TEXT,
    contact_email TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sponsor Leads (for lead retrieval)
CREATE TABLE IF NOT EXISTS "sponsor_leads" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sponsor_id UUID REFERENCES sponsors(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    collected_by UUID REFERENCES users(id),

    notes TEXT,
    interest_level INTEGER CHECK (interest_level >= 1 AND interest_level <= 5),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PHASE 3: ADVANCED PLATFORM FEATURES - RBAC SYSTEM
-- ============================================================================

-- Permission Categories for granular access control
CREATE TYPE "PermissionCategory" AS ENUM (
  'USER_MANAGEMENT',
  'EVENT_MANAGEMENT',
  'CONTENT_MANAGEMENT',
  'ANALYTICS_ACCESS',
  'FINANCIAL_ACCESS',
  'SYSTEM_ADMINISTRATION',
  'COMMUNICATION',
  'CHECK_IN_OPERATIONS',
  'SPEAKER_PORTAL',
  'SPONSOR_PORTAL'
);

-- Permission Actions for CRUD and special operations
CREATE TYPE "PermissionAction" AS ENUM (
  'CREATE',
  'READ',
  'UPDATE',
  'DELETE',
  'APPROVE',
  'PUBLISH',
  'MODERATE',
  'EXPORT',
  'IMPORT',
  'CONFIGURE'
);

-- Permissions Table - Defines all available permissions in the system
CREATE TABLE IF NOT EXISTS "permissions" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  category "PermissionCategory" NOT NULL,
  action "PermissionAction" NOT NULL,
  resource VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role Permissions Junction Table - Maps roles to permissions
CREATE TABLE IF NOT EXISTS "role_permissions" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role "UserRole" NOT NULL,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  granted_by UUID REFERENCES users(id),
  UNIQUE(role, permission_id)
);

-- User Custom Permissions - For granular user-specific permission overrides
CREATE TABLE IF NOT EXISTS "user_permissions" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  granted BOOLEAN NOT NULL DEFAULT true,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  granted_by UUID REFERENCES users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, permission_id)
);

-- Permission Audit Log - Track all permission-related actions for compliance
CREATE TABLE IF NOT EXISTS "permission_audit_log" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session Management for enhanced security
CREATE TABLE IF NOT EXISTS "user_sessions" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  refresh_token TEXT UNIQUE,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Keys for third-party integrations
CREATE TABLE IF NOT EXISTS "api_keys" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  permissions JSONB DEFAULT '[]',
  rate_limit INTEGER DEFAULT 1000,
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- ============================================================================
-- AUTOMATED WORKFLOW ENGINE SCHEMA
-- ============================================================================

-- Workflow Trigger Types
CREATE TYPE "WorkflowTriggerType" AS ENUM (
  'event_registration',
  'payment_completed',
  'session_start',
  'session_end',
  'check_in',
  'time_based',
  'user_action',
  'api_webhook'
);

-- Workflow Action Types
CREATE TYPE "WorkflowActionType" AS ENUM (
  'send_email',
  'send_sms',
  'push_notification',
  'update_user',
  'create_task',
  'webhook_call',
  'wait_delay',
  'conditional_branch'
);

-- Workflow Status
CREATE TYPE "WorkflowStatus" AS ENUM (
  'draft',
  'active',
  'paused',
  'completed'
);

-- Execution Status
CREATE TYPE "ExecutionStatus" AS ENUM (
  'pending',
  'running',
  'completed',
  'failed',
  'cancelled'
);

-- Workflows Table
CREATE TABLE IF NOT EXISTS "workflows" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  trigger_type "WorkflowTriggerType" NOT NULL,
  trigger_conditions JSONB DEFAULT '{}',
  status "WorkflowStatus" DEFAULT 'draft',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_run TIMESTAMP WITH TIME ZONE,
  total_runs INTEGER DEFAULT 0,
  success_runs INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  is_template BOOLEAN DEFAULT false
);

-- Workflow Steps Table
CREATE TABLE IF NOT EXISTS "workflow_steps" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  action_type "WorkflowActionType" NOT NULL,
  action_parameters JSONB DEFAULT '{}',
  conditions JSONB DEFAULT '{}',
  delay_seconds INTEGER DEFAULT 0,
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workflow_id, step_order)
);

-- Workflow Step Connections Table
CREATE TABLE IF NOT EXISTS "workflow_step_connections" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_step_id UUID NOT NULL REFERENCES workflow_steps(id) ON DELETE CASCADE,
  to_step_id UUID NOT NULL REFERENCES workflow_steps(id) ON DELETE CASCADE,
  condition_type VARCHAR(50) DEFAULT 'always',
  condition_value JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(from_step_id, to_step_id)
);

-- Workflow Executions Table
CREATE TABLE IF NOT EXISTS "workflow_executions" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  trigger_data JSONB DEFAULT '{}',
  status "ExecutionStatus" DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  current_step_id UUID REFERENCES workflow_steps(id),
  error_message TEXT,
  execution_context JSONB DEFAULT '{}'
);

-- Workflow Step Executions Table
CREATE TABLE IF NOT EXISTS "workflow_step_executions" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES workflow_steps(id) ON DELETE CASCADE,
  status "ExecutionStatus" DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  UNIQUE(execution_id, step_id)
);

-- Email Templates Table
CREATE TABLE IF NOT EXISTS "email_templates" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL UNIQUE,
  subject VARCHAR(500) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables JSONB DEFAULT '[]',
  category VARCHAR(100),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Notification Templates Table
CREATE TABLE IF NOT EXISTS "notification_templates" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  action_url VARCHAR(500),
  icon_url VARCHAR(500),
  variables JSONB DEFAULT '[]',
  category VARCHAR(100),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
