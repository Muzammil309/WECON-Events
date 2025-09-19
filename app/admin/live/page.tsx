'use client'

import { useState, useEffect } from 'react'
import LiveAttendanceDashboard from '@/components/admin/LiveAttendanceDashboard'
import QRCheckInSystem from '@/components/checkin/QRCheckInSystem'
import { supabase } from '@/lib/supabase'

interface Event {
  id: number
  title: string
  status: string
  start_date: string
  end_date: string
}

export default function LiveDashboard() {
  const [activeTab, setActiveTab] = useState('attendance')
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, status, start_date, end_date')
        .in('status', ['PUBLISHED', 'LIVE'])
        .order('start_date', { ascending: false })

      if (error) throw error

      setEvents(data || [])
      if (data && data.length > 0) {
        setSelectedEventId(data[0].id)
      }
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'attendance', label: 'Live Attendance', icon: '👥', description: 'Real-time session monitoring' },
    { id: 'checkin', label: 'QR Check-in', icon: '📱', description: 'Fast attendee check-in system' },
    { id: 'engagement', label: 'Live Engagement', icon: '💬', description: 'Session chat and Q&A' },
    { id: 'analytics', label: 'Real-time Analytics', icon: '📊', description: 'Live event metrics' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading live dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Live Event Dashboard</h1>
                <p className="mt-1 text-gray-600">Real-time monitoring and management</p>
              </div>
              
              {/* Live indicator */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">LIVE</span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Event Selector */}
            {events.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Event
                </label>
                <select
                  value={selectedEventId || ''}
                  onChange={(e) => setSelectedEventId(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-64"
                >
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.title} ({event.status})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="border-t border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{tab.description}</div>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedEventId ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Events</h3>
            <p className="text-gray-600">Create or publish an event to start monitoring live data.</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Create Event
            </button>
          </div>
        ) : (
          <>
            {/* Live Attendance Tab */}
            {activeTab === 'attendance' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <h3 className="font-medium text-blue-900">Real-time Session Monitoring</h3>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Monitor session capacity, attendance, and receive alerts for overcrowding.
                  </p>
                </div>
                <LiveAttendanceDashboard eventId={selectedEventId} />
              </div>
            )}

            {/* QR Check-in Tab */}
            {activeTab === 'checkin' && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <h3 className="font-medium text-green-900">Fast QR Check-in System</h3>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Scan QR codes or enter codes manually for instant attendee check-in.
                  </p>
                </div>
                <QRCheckInSystem 
                  eventId={selectedEventId}
                  onCheckIn={(result) => {
                    console.log('Check-in result:', result)
                    // You can add additional handling here
                  }}
                />
              </div>
            )}

            {/* Live Engagement Tab */}
            {activeTab === 'engagement' && (
              <div className="space-y-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <h3 className="font-medium text-purple-900">Live Session Engagement</h3>
                  </div>
                  <p className="text-sm text-purple-700 mt-1">
                    Monitor chat, Q&A, and polls in real-time during sessions.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Session Engagement Tools</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">💬 Live Chat</h4>
                      <p className="text-sm text-gray-600 mb-3">Real-time chat moderation and monitoring</p>
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                        Open Chat Monitor
                      </button>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">❓ Q&A Management</h4>
                      <p className="text-sm text-gray-600 mb-3">Moderate questions and answers</p>
                      <button className="w-full bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                        Manage Q&A
                      </button>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">📊 Live Polls</h4>
                      <p className="text-sm text-gray-600 mb-3">Create and monitor live polls</p>
                      <button className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                        Create Poll
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Real-time Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <h3 className="font-medium text-yellow-900">Real-time Event Analytics</h3>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    Live metrics, engagement rates, and attendance patterns.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Live Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Active Sessions</span>
                        <span className="font-semibold text-green-600">3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Online Attendees</span>
                        <span className="font-semibold text-blue-600">247</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Engagement Rate</span>
                        <span className="font-semibold text-purple-600">78%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Check-ins/Hour</span>
                        <span className="font-semibold text-yellow-600">42</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700 transition-colors">
                        🚨 Send Emergency Alert
                      </button>
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                        📢 Broadcast Announcement
                      </button>
                      <button className="w-full bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                        📊 Export Live Data
                      </button>
                      <button className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                        🎥 Start Recording
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
