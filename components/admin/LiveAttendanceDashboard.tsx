'use client'

import React, { useState, useEffect } from 'react'
import { weconRealtime, useRealtimeCheckIns, AttendanceUpdate } from '@/lib/realtime'
import { supabase } from '@/lib/supabase'

interface Session {
  id: number
  title: string
  start_time: string
  end_time: string
  room_name: string
  current_attendees: number
  max_attendees: number
  status: string
}

interface LiveAttendanceDashboardProps {
  eventId: number
}

export default function LiveAttendanceDashboard({ eventId }: LiveAttendanceDashboardProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [totalAttendees, setTotalAttendees] = useState(0)
  const [totalCapacity, setTotalCapacity] = useState(0)
  const checkIns = useRealtimeCheckIns(eventId)

  // Load initial session data
  useEffect(() => {
    loadSessions()
  }, [eventId])

  // Subscribe to real-time attendance updates for all sessions
  useEffect(() => {
    sessions.forEach(session => {
      weconRealtime.subscribeToSessionAttendance(session.id, (data: AttendanceUpdate) => {
        setSessions(prev => prev.map(s => 
          s.id === data.sessionId 
            ? { ...s, current_attendees: data.currentAttendees }
            : s
        ))
      })
    })

    return () => {
      sessions.forEach(session => {
        weconRealtime.unsubscribe(`session-attendance-${session.id}`)
      })
    }
  }, [sessions])

  // Update totals when sessions change
  useEffect(() => {
    const total = sessions.reduce((sum, session) => sum + session.current_attendees, 0)
    const capacity = sessions.reduce((sum, session) => sum + (session.max_attendees || 0), 0)
    setTotalAttendees(total)
    setTotalCapacity(capacity)
  }, [sessions])

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('event_id', eventId)
        .order('start_time')

      if (error) throw error
      setSessions(data || [])
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE': return 'bg-green-500'
      case 'SCHEDULED': return 'bg-blue-500'
      case 'COMPLETED': return 'bg-gray-500'
      case 'CANCELLED': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getCapacityColor = (current: number, max: number) => {
    const percentage = max > 0 ? (current / max) * 100 : 0
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with live stats */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Live Attendance Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalAttendees}</div>
              <div className="text-sm text-gray-500">Total Attendees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{totalCapacity}</div>
              <div className="text-sm text-gray-500">Total Capacity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{checkIns.length}</div>
              <div className="text-sm text-gray-500">Recent Check-ins</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions list */}
      <div className="p-6">
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`}></div>
                    <h3 className="font-medium text-gray-900">{session.title}</h3>
                    <span className="text-sm text-gray-500">
                      {formatTime(session.start_time)} - {formatTime(session.end_time)}
                    </span>
                    {session.room_name && (
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {session.room_name}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Attendance count */}
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${getCapacityColor(session.current_attendees, session.max_attendees || 0)}`}>
                      {session.current_attendees}
                      {session.max_attendees && (
                        <span className="text-gray-400">/{session.max_attendees}</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">Attendees</div>
                  </div>

                  {/* Capacity bar */}
                  {session.max_attendees && (
                    <div className="w-24">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            session.current_attendees / session.max_attendees >= 0.9 
                              ? 'bg-red-500' 
                              : session.current_attendees / session.max_attendees >= 0.75 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ 
                            width: `${Math.min(100, (session.current_attendees / session.max_attendees) * 100)}%` 
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        {Math.round((session.current_attendees / session.max_attendees) * 100)}%
                      </div>
                    </div>
                  )}

                  {/* Status badge */}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    session.status === 'LIVE' ? 'bg-green-100 text-green-800' :
                    session.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                    session.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {session.status}
                  </span>
                </div>
              </div>

              {/* Capacity warning */}
              {session.max_attendees && session.current_attendees / session.max_attendees >= 0.9 && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  ⚠️ Session is near capacity! Consider opening overflow room or waitlist.
                </div>
              )}
            </div>
          ))}
        </div>

        {sessions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No sessions found for this event.
          </div>
        )}
      </div>

      {/* Recent check-ins sidebar */}
      {checkIns.length > 0 && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Recent Check-ins</h3>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {checkIns.slice(-5).reverse().map((checkIn, index) => (
              <div key={index} className="text-xs text-gray-600 flex justify-between">
                <span>User checked in</span>
                <span>{new Date(checkIn.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
