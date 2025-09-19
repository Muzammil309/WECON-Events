'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { weconRealtime } from '@/lib/realtime'

interface AttendeePortalProps {
  userId: string
  eventId: number
}

interface Session {
  id: number
  title: string
  description: string
  start_time: string
  end_time: string
  room_name: string
  session_type: string
  speaker_ids: string[]
  current_attendees: number
  max_attendees: number
  requires_registration: boolean
  is_registered?: boolean
}

interface UserRegistration {
  id: number
  status: string
  qr_code: string
  ticket_type: string
}

export default function AttendeePortal({ userId, eventId }: AttendeePortalProps) {
  const [activeTab, setActiveTab] = useState('agenda')
  const [sessions, setSessions] = useState<Session[]>([])
  const [mySessions, setMySessions] = useState<Session[]>([])
  const [registration, setRegistration] = useState<UserRegistration | null>(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    loadData()
    subscribeToNotifications()
  }, [userId, eventId])

  const loadData = async () => {
    try {
      // Load user registration
      const { data: regData } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .single()

      setRegistration(regData)

      // Load all sessions
      const { data: sessionsData } = await supabase
        .from('sessions')
        .select('*')
        .eq('event_id', eventId)
        .order('start_time')

      if (sessionsData) {
        // Check which sessions user is registered for
        const { data: userSessions } = await supabase
          .from('session_registrations')
          .select('session_id')
          .eq('user_id', userId)

        const registeredSessionIds = userSessions?.map(s => s.session_id) || []
        
        const sessionsWithRegistration = sessionsData.map(session => ({
          ...session,
          is_registered: registeredSessionIds.includes(session.id)
        }))

        setSessions(sessionsWithRegistration)
        setMySessions(sessionsWithRegistration.filter(s => s.is_registered))
      }

      // Load notifications
      const { data: notifData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(10)

      setNotifications(notifData || [])

    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToNotifications = () => {
    weconRealtime.subscribeToUserConnections(userId, (connection) => {
      // Handle new connection requests
      loadData() // Refresh data when connections change
    })
  }

  const registerForSession = async (sessionId: number) => {
    try {
      const { error } = await supabase
        .from('session_registrations')
        .insert({
          session_id: sessionId,
          user_id: userId,
          status: 'REGISTERED'
        })

      if (error) throw error

      // Update local state
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, is_registered: true } : s
      ))
      
      const session = sessions.find(s => s.id === sessionId)
      if (session) {
        setMySessions(prev => [...prev, { ...session, is_registered: true }])
      }

    } catch (error) {
      console.error('Error registering for session:', error)
      alert('Failed to register for session')
    }
  }

  const unregisterFromSession = async (sessionId: number) => {
    try {
      const { error } = await supabase
        .from('session_registrations')
        .delete()
        .eq('session_id', sessionId)
        .eq('user_id', userId)

      if (error) throw error

      // Update local state
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, is_registered: false } : s
      ))
      
      setMySessions(prev => prev.filter(s => s.id !== sessionId))

    } catch (error) {
      console.error('Error unregistering from session:', error)
      alert('Failed to unregister from session')
    }
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'KEYNOTE': return 'bg-purple-100 text-purple-800'
      case 'WORKSHOP': return 'bg-blue-100 text-blue-800'
      case 'PANEL': return 'bg-green-100 text-green-800'
      case 'NETWORKING': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold text-gray-900">WECON Event</h1>
          {registration && (
            <div className="text-sm text-gray-600">
              Status: <span className="font-medium text-green-600">{registration.status}</span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t">
          {[
            { id: 'agenda', label: 'Agenda', icon: '📅' },
            { id: 'my-schedule', label: 'My Schedule', icon: '⭐' },
            { id: 'qr-code', label: 'QR Code', icon: '📱' },
            { id: 'notifications', label: 'Alerts', icon: '🔔' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-2 text-xs font-medium text-center ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div>{tab.icon}</div>
              <div className="mt-1">{tab.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Agenda Tab */}
        {activeTab === 'agenda' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Event Agenda</h2>
            {sessions.map(session => (
              <div key={session.id} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{session.title}</h3>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(session.start_time)} • {formatTime(session.start_time)} - {formatTime(session.end_time)}
                    </div>
                    {session.room_name && (
                      <div className="text-xs text-gray-500">📍 {session.room_name}</div>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSessionTypeColor(session.session_type)}`}>
                    {session.session_type}
                  </span>
                </div>

                {session.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{session.description}</p>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {session.current_attendees} attendees
                    {session.max_attendees && ` / ${session.max_attendees} max`}
                  </div>
                  
                  {session.requires_registration && (
                    <button
                      onClick={() => session.is_registered 
                        ? unregisterFromSession(session.id)
                        : registerForSession(session.id)
                      }
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        session.is_registered
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      {session.is_registered ? '✓ Registered' : 'Register'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Schedule Tab */}
        {activeTab === 'my-schedule' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">My Schedule</h2>
            {mySessions.length > 0 ? (
              mySessions.map(session => (
                <div key={session.id} className="bg-white rounded-lg shadow-sm border p-4 border-l-4 border-l-blue-500">
                  <h3 className="font-medium text-gray-900 text-sm">{session.title}</h3>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(session.start_time)} • {formatTime(session.start_time)} - {formatTime(session.end_time)}
                  </div>
                  {session.room_name && (
                    <div className="text-xs text-gray-500 mt-1">📍 {session.room_name}</div>
                  )}
                  <div className="mt-2 flex space-x-2">
                    <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Add to Calendar
                    </button>
                    <button className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      Get Directions
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📅</div>
                <div>No sessions in your schedule yet</div>
                <div className="text-sm">Register for sessions from the Agenda tab</div>
              </div>
            )}
          </div>
        )}

        {/* QR Code Tab */}
        {activeTab === 'qr-code' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Your QR Code</h2>
            {registration?.qr_code ? (
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  {/* QR Code would be generated here */}
                  <div className="text-gray-400">
                    <div className="text-4xl mb-2">📱</div>
                    <div className="text-sm">QR Code</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Show this QR code at check-in stations
                </div>
                <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                  {registration.qr_code}
                </div>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                  Save to Wallet
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">❌</div>
                <div>QR Code not available</div>
                <div className="text-sm">Please complete your registration</div>
              </div>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div key={notification.id} className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{notification.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(notification.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🔔</div>
                <div>No new notifications</div>
                <div className="text-sm">You're all caught up!</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
