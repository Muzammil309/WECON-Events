'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AttendeePortal from '@/components/attendee/AttendeePortal'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  email: string
  role: string
  first_name?: string
  last_name?: string
  display_name?: string
}

interface Event {
  id: number
  title: string
  description: string
  start_date: string
  end_date: string
  status: string
}

interface EventRegistration {
  event_id: number
  events: Event | null
}

export default function AttendeePortalPage() {
  const [user, setUser] = useState<User | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Get current user from Supabase Auth
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser) {
        router.push('/login')
        return
      }

      // Get user profile from database
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profileError) {
        console.error('Error loading user profile:', profileError)
        setError('Failed to load user profile')
        return
      }

      // Check if user has attendee access
      if (!['ATTENDEE', 'SPEAKER', 'SPONSOR'].includes(userProfile.role)) {
        router.push('/admin')
        return
      }

      setUser(userProfile)

      // Load available events for this user
      await loadUserEvents(authUser.id)

    } catch (error) {
      console.error('Authentication error:', error)
      setError('Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const loadUserEvents = async (userId: string) => {
    try {
      // Get events the user is registered for
      const { data: registrations, error: regError } = await supabase
        .from('event_registrations')
        .select(`
          event_id,
          events (
            id,
            title,
            description,
            start_date,
            end_date,
            status
          )
        `)
        .eq('user_id', userId)
        .in('status', ['REGISTERED', 'CONFIRMED', 'CHECKED_IN'])

      if (regError) throw regError

      // Extract events from registrations with proper type safety
      // Note: reg.events is a single event object from the nested Supabase query
      const userEvents: Event[] = []
      if (registrations) {
        for (const reg of registrations as any[]) {
          if (reg.events && typeof reg.events === 'object' && 'id' in reg.events) {
            userEvents.push(reg.events as unknown as Event)
          }
        }
      }

      // Also get published events that user can register for
      const { data: publicEvents, error: publicError } = await supabase
        .from('events')
        .select('id, title, description, start_date, end_date, status')
        .eq('status', 'PUBLISHED')
        .eq('registration_open', true)

      if (publicError) throw publicError

      // Ensure publicEvents is an array and has proper type
      const publicEventsArray: Event[] = Array.isArray(publicEvents) ? publicEvents : (publicEvents ? [publicEvents] : [])

      // Combine and deduplicate events with type safety
      const allEvents: Event[] = [...userEvents, ...publicEventsArray]
      const uniqueEvents = allEvents.filter((event, index, self) =>
        event && typeof event === 'object' && 'id' in event &&
        index === self.findIndex(e => e && typeof e === 'object' && 'id' in e && e.id === event.id)
      )

      setEvents(uniqueEvents)

      // Set the first event as selected if available
      if (uniqueEvents.length > 0) {
        setSelectedEventId(uniqueEvents[0].id)
      }

    } catch (error) {
      console.error('Error loading events:', error)
      setError('Failed to load events')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please log in to access your dashboard.</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Welcome!</h1>
                <p className="text-sm text-gray-600">{user.display_name || user.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* No Events State */}
        <div className="max-w-md mx-auto px-4 py-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Events Available</h2>
          <p className="text-gray-600 mb-6">
            You're not registered for any events yet. Check back later or contact the event organizer.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
            <button 
              onClick={handleLogout}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden md:block bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Welcome, {user.display_name || `${user.first_name} ${user.last_name}` || user.email}
                </h1>
                <p className="text-sm text-gray-600">Attendee Dashboard</p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Event Selector */}
                {events.length > 1 && (
                  <select
                    value={selectedEventId || ''}
                    onChange={(e) => setSelectedEventId(Number(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {events.map(event => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {selectedEventId && user ? (
        <AttendeePortal 
          userId={user.id} 
          eventId={selectedEventId} 
        />
      ) : (
        <div className="max-w-md mx-auto px-4 py-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Event Selected</h2>
          <p className="text-gray-600">Please select an event to continue.</p>
        </div>
      )}
    </div>
  )
}
