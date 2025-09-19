import { createClient } from '@supabase/supabase-js'

// Environment variables with fallbacks for build process
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' &&
         supabaseAnonKey !== 'placeholder-anon-key' &&
         supabaseUrl.includes('.supabase.co')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
  id: string
  email: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EVENT_MANAGER' | 'MODERATOR' | 'SPEAKER' | 'SPONSOR' | 'ATTENDEE' | 'CHECK_IN_STAFF'
  first_name: string
  last_name: string
  display_name?: string
  bio?: string
  profile_photo_url?: string
  job_title?: string
  company?: string
  industry?: string
  location?: string
  linkedin_url?: string
  twitter_url?: string
  website_url?: string
  privacy_level: 'PUBLIC' | 'ATTENDEES_ONLY' | 'CONNECTIONS_ONLY' | 'PRIVATE'
  networking_available: boolean
  email_notifications: boolean
  push_notifications: boolean
  email_verified: boolean
  last_login_at?: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  name: string
  slug: string
  description?: string
  short_description?: string
  venue_name?: string
  venue_address?: string
  timezone: string
  start_date: string
  end_date: string
  registration_start?: string
  registration_end?: string
  status: 'DRAFT' | 'PUBLISHED' | 'LIVE' | 'COMPLETED' | 'CANCELLED'
  logo_url?: string
  banner_url?: string
  primary_color: string
  secondary_color: string
  custom_css?: string
  max_attendees?: number
  current_attendees: number
  networking_enabled: boolean
  qa_enabled: boolean
  chat_enabled: boolean
  virtual_enabled: boolean
  organizer_id?: string
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  event_id: string
  title: string
  description?: string
  abstract?: string
  session_type: 'KEYNOTE' | 'WORKSHOP' | 'PANEL' | 'NETWORKING' | 'BREAK' | 'VIRTUAL' | 'HYBRID'
  track?: string
  difficulty_level?: number
  start_time: string
  end_time: string
  room_id?: string
  max_attendees?: number
  current_attendees: number
  requires_registration: boolean
  virtual_url?: string
  recording_url?: string
  live_stream_url?: string
  slides_url?: string
  resources_url?: string
  qa_enabled: boolean
  chat_enabled: boolean
  polling_enabled: boolean
  created_at: string
  updated_at: string
}

export interface Connection {
  id: string
  requester_id: string
  recipient_id: string
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED'
  message?: string
  created_at: string
  responded_at?: string
}

export interface Meeting {
  id: string
  event_id: string
  organizer_id: string
  participant_id: string
  title: string
  description?: string
  start_time: string
  end_time: string
  duration_minutes: number
  location?: string
  virtual_url?: string
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  session_id: string
  user_id: string
  question: string
  is_anonymous: boolean
  upvotes: number
  is_answered: boolean
  answer?: string
  answered_by?: string
  answered_at?: string
  created_at: string
}

export interface Poll {
  id: string
  session_id: string
  created_by: string
  question: string
  poll_type: string
  options: any[]
  is_active: boolean
  is_anonymous: boolean
  created_at: string
  ends_at?: string
}

export interface Notification {
  id: string
  user_id: string
  type: 'SYSTEM' | 'SESSION_REMINDER' | 'NETWORKING' | 'ANNOUNCEMENT' | 'EMERGENCY'
  title: string
  message: string
  data: any
  is_read: boolean
  read_at?: string
  created_at: string
  expires_at?: string
}

// API Functions
export const api = {
  // Authentication
  async signUp(email: string, password: string, userData: Partial<User>) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set up your Supabase project credentials in .env.local')
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    if (data.user) {
      // Create user profile in users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          role: userData.role || 'ATTENDEE',
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          privacy_level: 'PUBLIC',
          networking_available: true,
          email_notifications: true,
          push_notifications: true,
          email_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) throw profileError
    }

    return data
  },

  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set up your Supabase project credentials in .env.local')
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // User Management
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
    return data as User
  },

  async createSuperAdmin() {
    try {
      // Check if super admin already exists
      const { data: existingSuperAdmin, error: checkError } = await supabase
        .from('users')
        .select('id, email, role')
        .eq('role', 'SUPER_ADMIN')
        .maybeSingle()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking for existing super admin:', checkError)
        throw checkError
      }

      if (existingSuperAdmin) {
        console.log('Super admin already exists:', existingSuperAdmin.email)
        return { user: existingSuperAdmin, session: null }
      }

      // Create super admin account with valid email format
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@wecon.events',
        password: 'SuperAdmin123!',
      })

      if (error) {
        console.error('Auth signup error:', error)
        throw error
      }

      if (data.user) {
        // Insert user profile with proper error handling
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: 'admin@wecon.events',
            role: 'SUPER_ADMIN',
            first_name: 'Super',
            last_name: 'Admin',
            display_name: 'WECON Super Administrator',
            privacy_level: 'PRIVATE',
            networking_available: false,
            email_notifications: true,
            push_notifications: true,
            email_verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          throw profileError
        }

        console.log('Super admin created successfully')
      }

      return data
    } catch (error) {
      console.error('Super admin creation failed:', error)
      throw error
    }
  },

  async createAdminAccount(email: string, password: string, adminData: Partial<User>, createdBy: string) {
    // Only super admin can create admin accounts
    const currentUser = await this.getCurrentUser()
    if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
      throw new Error('Only super administrators can create admin accounts')
    }

    // Create admin account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          role: adminData.role || 'ADMIN',
          first_name: adminData.first_name || '',
          last_name: adminData.last_name || '',
          display_name: adminData.display_name || '',
          privacy_level: 'PRIVATE',
          networking_available: false,
          email_notifications: true,
          push_notifications: true,
          email_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) throw profileError

      // Log admin creation
      console.log(`Admin account created: ${email} by ${createdBy}`)
    }

    return data
  },

  // Analytics and Statistics
  async getEventStats(eventId: string) {
    try {
      // Get total attendees
      const { count: totalAttendees } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'ATTENDEE')

      // Get active sessions today
      const today = new Date().toISOString().split('T')[0]
      const { count: activeSessions } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .gte('start_time', today)
        .lte('start_time', today + 'T23:59:59')

      // Get check-ins today
      const { count: checkInsToday } = await supabase
        .from('session_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('checked_in', true)
        .gte('checked_in_at', today)

      // Calculate revenue (mock for now)
      const revenue = (totalAttendees || 0) * 150 // $150 per ticket

      return {
        totalAttendees: totalAttendees || 0,
        activeSessions: activeSessions || 0,
        revenue: revenue,
        checkInsToday: checkInsToday || 0
      }
    } catch (error) {
      console.error('Error fetching event stats:', error)
      return {
        totalAttendees: 0,
        activeSessions: 0,
        revenue: 0,
        checkInsToday: 0
      }
    }
  },

  async getRecentActivities(limit: number = 10) {
    try {
      // Get recent user registrations
      const { data: recentUsers } = await supabase
        .from('users')
        .select('first_name, last_name, created_at, role')
        .order('created_at', { ascending: false })
        .limit(limit)

      const activities = (recentUsers || []).map(user => ({
        action: user.role === 'SPEAKER' ? 'New speaker registered' : 'New attendee registered',
        user: `${user.first_name} ${user.last_name}`,
        time: this.formatTimeAgo(user.created_at)
      }))

      return activities
    } catch (error) {
      console.error('Error fetching recent activities:', error)
      return []
    }
  },

  formatTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`
    return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`
  },

  async updateUserProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data as User
  },

  // Events
  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true })
    
    if (error) throw error
    return data as Event[]
  },

  async getEvent(eventId: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()
    
    if (error) throw error
    return data as Event
  },

  // Sessions
  async getEventSessions(eventId: string) {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        session_speakers (
          user_id,
          role,
          users (first_name, last_name, job_title, company)
        ),
        rooms (name, capacity)
      `)
      .eq('event_id', eventId)
      .order('start_time', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getUserSessions(userId: string, eventId: string) {
    const { data, error } = await supabase
      .from('session_registrations')
      .select(`
        *,
        sessions (
          *,
          session_speakers (
            users (first_name, last_name, job_title, company)
          ),
          rooms (name)
        )
      `)
      .eq('user_id', userId)
      .eq('sessions.event_id', eventId)
    
    if (error) throw error
    return data
  },

  // Networking
  async getConnections(userId: string) {
    const { data, error } = await supabase
      .from('connections')
      .select(`
        *,
        requester:users!requester_id (first_name, last_name, job_title, company, profile_photo_url),
        recipient:users!recipient_id (first_name, last_name, job_title, company, profile_photo_url)
      `)
      .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async sendConnectionRequest(requesterId: string, recipientId: string, message?: string) {
    const { data, error } = await supabase
      .from('connections')
      .insert({
        requester_id: requesterId,
        recipient_id: recipientId,
        message,
        status: 'PENDING'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Notifications
  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (error) throw error
    return data as Notification[]
  },

  async markNotificationRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId)
    
    if (error) throw error
  }
}
