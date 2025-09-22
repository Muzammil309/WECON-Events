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
        email: 'admin@wecon.events', // Use a real domain format for better compatibility
        password: 'SuperAdmin123!',
        options: {
          emailRedirectTo: undefined, // Disable email confirmation for admin setup
        }
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
    // Avoid ordering by a column that may not exist across schema variants
    const { data, error } = await supabase
      .from('events')
      .select('*')

    if (error) throw error
    return data as any[]
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

  async createEvent(input: Partial<Event>) {
    // Some deployments use start_date/end_date, others use start_time/end_time and name/title
    const now = new Date().toISOString()
    const base: any = {
      slug: input.slug,
      // Intentionally omitting 'description' to avoid schema mismatches across deployments
      timezone: input.timezone || 'UTC',
      status: input.status || 'DRAFT',
      created_at: now,
      updated_at: now,
    }

    const variants: any[] = [
      { ...base, name: input.name, start_date: input.start_date, end_date: input.end_date },
      { ...base, title: (input as any).title ?? input.name, start_date: input.start_date, end_date: input.end_date },
      { ...base, name: input.name, start_time: input.start_date, end_time: input.end_date },
      { ...base, title: (input as any).title ?? input.name, start_time: input.start_date, end_time: input.end_date },
    ]

    const errors: string[] = []
    for (const payload of variants) {
      const { data, error } = await supabase
        .from('events')
        .insert(payload)
        .select('*')
        .single()
      if (!error) return data as Event
      errors.push(error.message)
    }
    throw new Error(`Failed to create event due to schema mismatch: ${errors.join(' | ')}`)
  },

  async updateEvent(eventId: string | number, updates: Partial<Event>) {
    const now = new Date().toISOString()
    const base: any = { updated_at: now }

    const variants: any[] = [
      { ...base, name: updates.name, start_date: updates.start_date, end_date: updates.end_date, timezone: updates.timezone, status: updates.status },
      { ...base, title: (updates as any).title ?? updates.name, start_date: updates.start_date, end_date: updates.end_date, timezone: updates.timezone, status: updates.status },
      { ...base, name: updates.name, start_time: updates.start_date, end_time: updates.end_date, timezone: updates.timezone, status: updates.status },
      { ...base, title: (updates as any).title ?? updates.name, start_time: updates.start_date, end_time: updates.end_date, timezone: updates.timezone, status: updates.status },
    ]

    const errors: string[] = []
    for (const payload of variants) {
      const { data, error } = await supabase
        .from('events')
        .update(payload)
        .eq('id', eventId)
        .select('*')
        .single()
      if (!error) return data as Event
      errors.push(error.message)
    }
    throw new Error(`Failed to update event due to schema mismatch: ${errors.join(' | ')}`)
  },

  async deleteEvent(eventId: string | number) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)
    if (error) throw error
  },

  async createSession(input: Partial<Session> & { event_id: string | number; title: string; start_time: string; end_time: string }) {
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        event_id: input.event_id,
        title: input.title,
        description: input.description,
        session_type: input.session_type || 'KEYNOTE',
        track: input.track,
        difficulty_level: input.difficulty_level,
        start_time: input.start_time,
        end_time: input.end_time,
        room_name: (input as any).room_name,
        room_capacity: (input as any).room_capacity,
        max_attendees: input.max_attendees,
        current_attendees: input.current_attendees || 0,
        requires_registration: input.requires_registration ?? false,
        virtual_url: input.virtual_url,
        recording_url: input.recording_url,
        live_stream_url: input.live_stream_url,
        slides_url: input.slides_url,
        resources_url: input.resources_url,
        qa_enabled: input.qa_enabled ?? true,
        chat_enabled: input.chat_enabled ?? true,
        polling_enabled: input.polling_enabled ?? false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single()
    if (error) throw error
    return data as Session
  },

  async updateSession(sessionId: string | number, updates: Partial<Session>) {
    const { data, error } = await supabase
      .from('sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .select('*')
      .single()
    if (error) throw error
    return data as Session
  },

  async deleteSession(sessionId: string | number) {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', sessionId)
    if (error) throw error
  },

  // Sessions (schema: sessions table with speaker_ids[] and room fields)
  async getEventSessions(eventId: string | number) {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('event_id', eventId)
      .order('start_time', { ascending: true })
    if (error) throw error
    return data
  },

  async getUserSessions(userId: string, eventId: string | number) {
    const { data, error } = await supabase
      .from('session_registrations')
      .select(`*, sessions(*)`)
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


  // Ticketing (flexible across snake_case 'ticket_types' and camelCase 'TicketType')
  async getTicketTypes(params?: { eventId?: string | number; search?: string; limit?: number; offset?: number; status?: string }) {
    const mapRows = (rows: any[], variant: 'snake' | 'camel') => {
      return (rows || []).map((r: any) => ({
        id: r.id,
        event_id: variant === 'snake' ? r.event_id : r.eventId,
        name: r.name,
        description: r.description ?? '',
        price_cents: variant === 'snake' ? (r.price_cents ?? (r.price ? Math.round(parseFloat(r.price) * 100) : 0)) : r.priceCents,
        currency: r.currency ?? 'USD',
        quantity_total: variant === 'snake' ? (r.quantity_total ?? r.totalQuantity) : r.quantityTotal,
        quantity_sold: variant === 'snake' ? (r.quantity_sold ?? r.soldQuantity ?? 0) : (r.quantitySold ?? 0),
        sales_start: variant === 'snake' ? (r.sales_start ?? r.saleStart) : r.salesStart,
        sales_end: variant === 'snake' ? (r.sales_end ?? r.saleEnd) : r.salesEnd,
        features: Array.isArray(r.features) ? r.features : (typeof r.features === 'string' ? r.features.split(',').map((s: string)=>s.trim()).filter(Boolean) : []),
        status: r.status || 'active',
      }))
    }

    const limit = params?.limit ?? 20
    const offset = params?.offset ?? 0

    // Try snake_case table first
    let { data, error, count } = await supabase
      .from('ticket_types')
      .select('*', { count: 'exact' })
      .ilike(params?.search ? 'name' : 'id', params?.search ? `%${params?.search}%` : undefined as any)
      .range(offset, offset + limit - 1)

    if (!error) {
      return { data: mapRows(data as any[], 'snake'), count: count || 0 }
    }

    // Fallback to camelCase table name
    const camel = await supabase
      .from('TicketType')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
    if (camel.error) throw camel.error
    return { data: mapRows(camel.data as any[], 'camel'), count: camel.count || 0 }
  },

  async createTicketType(input: Partial<{ id: string; event_id: string | number; name: string; description?: string; price_cents?: number; currency?: string; quantity_total?: number; quantity_sold?: number; sales_start?: string; sales_end?: string; features?: string[]; status?: string }>) {
    const now = new Date().toISOString()
    const snakePayload: any = {
      event_id: input.event_id,
      name: input.name,
      description: input.description,
      price_cents: input.price_cents,
      currency: input.currency || 'USD',
      quantity_total: input.quantity_total ?? 0,
      quantity_sold: input.quantity_sold ?? 0,
      sales_start: input.sales_start,
      sales_end: input.sales_end,
      features: input.features,
      status: input.status || 'active',
      created_at: now,
      updated_at: now,
    }
    let ins = await supabase.from('ticket_types').insert(snakePayload).select('*').single()
    if (!ins.error) return ins.data

    // Fallback camelCase
    const camelPayload: any = {
      eventId: input.event_id,
      name: input.name,
      description: input.description,
      priceCents: input.price_cents,
      currency: input.currency || 'USD',
      quantityTotal: input.quantity_total ?? 0,
      quantitySold: input.quantity_sold ?? 0,
      salesStart: input.sales_start,
      salesEnd: input.sales_end,
      features: input.features,
      status: input.status || 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    }
    const ins2 = await supabase.from('TicketType').insert(camelPayload).select('*').single()
    if (ins2.error) throw ins2.error
    return ins2.data
  },

  async updateTicketType(id: string, updates: Partial<{ name: string; description?: string; price_cents?: number; currency?: string; quantity_total?: number; quantity_sold?: number; sales_start?: string; sales_end?: string; features?: string[]; status?: string }>) {
    const now = new Date().toISOString()
    let up = await supabase
      .from('ticket_types')
      .update({ ...updates, updated_at: now })
      .eq('id', id)
      .select('*')
      .single()
    if (!up.error) return up.data

    // Fallback camelCase mapping
    const camelMap: any = {
      ...(updates.name !== undefined ? { name: updates.name } : {}),
      ...(updates.description !== undefined ? { description: updates.description } : {}),
      ...(updates.price_cents !== undefined ? { priceCents: updates.price_cents } : {}),
      ...(updates.currency !== undefined ? { currency: updates.currency } : {}),
      ...(updates.quantity_total !== undefined ? { quantityTotal: updates.quantity_total } : {}),
      ...(updates.quantity_sold !== undefined ? { quantitySold: updates.quantity_sold } : {}),
      ...(updates.sales_start !== undefined ? { salesStart: updates.sales_start } : {}),
      ...(updates.sales_end !== undefined ? { salesEnd: updates.sales_end } : {}),
      ...(updates.features !== undefined ? { features: updates.features } : {}),
      ...(updates.status !== undefined ? { status: updates.status } : {}),
      updatedAt: now,
    }
    const up2 = await supabase
      .from('TicketType')
      .update(camelMap)
      .eq('id', id)
      .select('*')
      .single()
    if (up2.error) throw up2.error
    return up2.data
  },

  async deleteTicketType(id: string) {
    let del = await supabase.from('ticket_types').delete().eq('id', id)
    if (!del.error) return
    const del2 = await supabase.from('TicketType').delete().eq('id', id)
    if (del2.error) throw del2.error
  },

  async getTicketingAnalytics(eventId?: string | number) {
    // Revenue = sum(payment_amount) for PAID registrations; tickets sold = count registrations
    const regQuery = supabase
      .from('event_registrations')
      .select('payment_amount, payment_status, event_id')
    const { data, error } = await regQuery
    if (error) return { revenue: 0, sold: 0 }
    const filtered = eventId ? (data || []).filter((r: any) => r.event_id === eventId) : (data || [])
    const revenue = filtered.filter((r: any) => (r.payment_status || '').toUpperCase() === 'PAID').reduce((sum: number, r: any) => sum + (parseFloat(r.payment_amount) || 0), 0)
    const sold = filtered.length
    return { revenue, sold }
  },

  subscribeTicketing(eventId: string | number | undefined, onChange: () => void) {
    const ch1 = supabase
      .channel('ticketing-types')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ticket_types' }, (_payload) => onChange())
      .subscribe()

    const ch2 = supabase
      .channel('ticketing-registrations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_registrations' }, (_payload) => onChange())
      .subscribe()

    return () => {
      try { supabase.removeChannel(ch1) } catch {}
      try { supabase.removeChannel(ch2) } catch {}
    }
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

  // Attendees
  async getAttendees(limit: number = 100, offset: number = 0) {
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('role', 'ATTENDEE')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    if (error) throw error
    return { data: data as User[], count: count || 0 }
  },

  async getEventAttendees(eventId: string | number, limit: number = 100, offset: number = 0) {
    const { data, error, count } = await supabase
      .from('event_registrations')
      .select('*, users(*)', { count: 'exact' })
      .eq('event_id', eventId)
      .order('registered_at', { ascending: false })
      .range(offset, offset + limit - 1)
    if (error) throw error
    return { data, count: count || 0 }
  },

  async updateEventRegistration(registrationId: number, updates: Partial<{ status: string; payment_status: string; ticket_type: string }>) {
    const { data, error } = await supabase
      .from('event_registrations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', registrationId)
      .select('*')
      .single()
    if (error) throw error
    return data
  },

  async checkInAttendee(registrationId: number) {
    const { data, error } = await supabase
      .from('event_registrations')
      .update({ status: 'CHECKED_IN', check_in_time: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', registrationId)
      .select('*')
      .single()
    if (error) throw error
    return data
  },

  async markNotificationRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId)

    if (error) throw error
  }
}
