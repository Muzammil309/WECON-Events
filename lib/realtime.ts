// WECON Real-time Integration with Supabase
// Handles WebSocket connections for live data updates

import { supabase } from './supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

// Types for real-time events
export interface RealtimeEvent {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new?: any
  old?: any
  table: string
}

export interface AttendanceUpdate {
  sessionId: number
  currentAttendees: number
  maxAttendees: number
  timestamp: string
}

export interface CheckInEvent {
  userId: string
  eventId: number
  sessionId?: number
  timestamp: string
  status: 'CHECKED_IN' | 'CHECKED_OUT'
}

export interface LiveEngagement {
  sessionId: number
  type: 'CHAT' | 'QA' | 'POLL'
  data: any
  userId: string
  timestamp: string
}

// Real-time subscription manager
export class WeconRealtime {
  private channels: Map<string, RealtimeChannel> = new Map()
  private callbacks: Map<string, Function[]> = new Map()

  // Subscribe to attendance updates for a specific session
  subscribeToSessionAttendance(sessionId: number, callback: (data: AttendanceUpdate) => void) {
    const channelName = `session-attendance-${sessionId}`
    
    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'sessions',
            filter: `id=eq.${sessionId}`
          },
          (payload) => {
            const attendanceData: AttendanceUpdate = {
              sessionId: payload.new.id,
              currentAttendees: payload.new.current_attendees,
              maxAttendees: payload.new.max_attendees,
              timestamp: new Date().toISOString()
            }
            callback(attendanceData)
          }
        )
        .subscribe()

      this.channels.set(channelName, channel)
    }

    // Store callback for cleanup
    const callbacks = this.callbacks.get(channelName) || []
    callbacks.push(callback)
    this.callbacks.set(channelName, callbacks)
  }

  // Subscribe to check-in events for an event
  subscribeToCheckIns(eventId: number, callback: (data: CheckInEvent) => void) {
    const channelName = `event-checkins-${eventId}`
    
    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'event_registrations',
            filter: `event_id=eq.${eventId}`
          },
          (payload) => {
            const newRecord = payload.new as any
            if (newRecord?.status === 'CHECKED_IN') {
              const checkInData: CheckInEvent = {
                userId: newRecord.user_id,
                eventId: newRecord.event_id,
                timestamp: newRecord.check_in_time || new Date().toISOString(),
                status: 'CHECKED_IN'
              }
              callback(checkInData)
            }
          }
        )
        .subscribe()

      this.channels.set(channelName, channel)
    }
  }

  // Subscribe to live engagement for a session
  subscribeToLiveEngagement(sessionId: number, callback: (data: LiveEngagement) => void) {
    const channelName = `session-engagement-${sessionId}`
    
    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `data->>sessionId=eq.${sessionId}`
          },
          (payload) => {
            if (payload.new?.type === 'SESSION_ENGAGEMENT') {
              const engagementData: LiveEngagement = {
                sessionId: sessionId,
                type: payload.new.data?.engagementType || 'CHAT',
                data: payload.new.data,
                userId: payload.new.user_id,
                timestamp: payload.new.created_at
              }
              callback(engagementData)
            }
          }
        )
        .subscribe()

      this.channels.set(channelName, channel)
    }
  }

  // Subscribe to admin notifications
  subscribeToAdminNotifications(callback: (notification: any) => void) {
    const channelName = 'admin-notifications'
    
    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `type=eq.SYSTEM_ANNOUNCEMENT`
          },
          (payload) => {
            callback(payload.new)
          }
        )
        .subscribe()

      this.channels.set(channelName, channel)
    }
  }

  // Subscribe to user connections/networking
  subscribeToUserConnections(userId: string, callback: (connection: any) => void) {
    const channelName = `user-connections-${userId}`
    
    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'connections',
            filter: `or(requester_id.eq.${userId},recipient_id.eq.${userId})`
          },
          (payload) => {
            callback(payload.new)
          }
        )
        .subscribe()

      this.channels.set(channelName, channel)
    }
  }

  // Unsubscribe from a specific channel
  unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName)
    if (channel) {
      supabase.removeChannel(channel)
      this.channels.delete(channelName)
      this.callbacks.delete(channelName)
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll() {
    this.channels.forEach((channel, channelName) => {
      supabase.removeChannel(channel)
    })
    this.channels.clear()
    this.callbacks.clear()
  }

  // Get connection status
  getConnectionStatus() {
    return supabase.realtime.isConnected()
  }

  // Manual reconnection
  reconnect() {
    supabase.realtime.disconnect()
    supabase.realtime.connect()
  }
}

// Global realtime instance
export const weconRealtime = new WeconRealtime()

// React hooks for real-time data
export const useRealtimeAttendance = (sessionId: number) => {
  const [attendance, setAttendance] = useState<AttendanceUpdate | null>(null)

  useEffect(() => {
    const callback = (data: AttendanceUpdate) => {
      setAttendance(data)
    }

    weconRealtime.subscribeToSessionAttendance(sessionId, callback)

    return () => {
      weconRealtime.unsubscribe(`session-attendance-${sessionId}`)
    }
  }, [sessionId])

  return attendance
}

export const useRealtimeCheckIns = (eventId: number) => {
  const [checkIns, setCheckIns] = useState<CheckInEvent[]>([])

  useEffect(() => {
    const callback = (data: CheckInEvent) => {
      setCheckIns(prev => [...prev, data])
    }

    weconRealtime.subscribeToCheckIns(eventId, callback)

    return () => {
      weconRealtime.unsubscribe(`event-checkins-${eventId}`)
    }
  }, [eventId])

  return checkIns
}

// Utility functions for real-time updates
export const updateSessionAttendance = async (sessionId: number, increment: boolean = true) => {
  const { data: session } = await supabase
    .from('sessions')
    .select('current_attendees')
    .eq('id', sessionId)
    .single()

  if (session) {
    const newCount = increment 
      ? session.current_attendees + 1 
      : Math.max(0, session.current_attendees - 1)

    await supabase
      .from('sessions')
      .update({ 
        current_attendees: newCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
  }
}

export const broadcastEngagement = async (sessionId: number, type: string, data: any, userId: string) => {
  await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: 'SESSION_ENGAGEMENT',
      title: `Session ${type}`,
      message: `New ${type.toLowerCase()} in session`,
      data: {
        sessionId,
        engagementType: type,
        ...data
      }
    })
}

// Import React hooks
import { useState, useEffect } from 'react'
