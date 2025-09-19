'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface CommunicationChannel {
  id: string
  name: string
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP' | 'EMERGENCY'
  enabled: boolean
  config: any
}

interface MessageTemplate {
  id: string
  name: string
  subject: string
  content: string
  type: string
  variables: string[]
}

interface Campaign {
  id: string
  name: string
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED'
  channels: string[]
  audience: any
  template: string
  scheduledAt?: string
  sentAt?: string
  stats: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    failed: number
  }
}

interface CommunicationsHubProps {
  eventId: number
}

export default function CommunicationsHub({ eventId }: CommunicationsHubProps) {
  const [activeTab, setActiveTab] = useState('campaigns')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [channels, setChannels] = useState<CommunicationChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewCampaign, setShowNewCampaign] = useState(false)

  useEffect(() => {
    loadData()
  }, [eventId])

  const loadData = async () => {
    try {
      // Load campaigns (mock data - would come from database)
      setCampaigns([
        {
          id: '1',
          name: 'Welcome Email Series',
          status: 'SENT',
          channels: ['EMAIL'],
          audience: { type: 'ALL_ATTENDEES', count: 1234 },
          template: 'welcome_email',
          sentAt: '2024-01-15T10:00:00Z',
          stats: { sent: 1234, delivered: 1198, opened: 856, clicked: 234, failed: 36 }
        },
        {
          id: '2',
          name: 'Session Reminder',
          status: 'SCHEDULED',
          channels: ['EMAIL', 'PUSH'],
          audience: { type: 'SESSION_ATTENDEES', count: 456 },
          template: 'session_reminder',
          scheduledAt: '2024-01-16T08:00:00Z',
          stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0 }
        }
      ])

      // Load templates
      setTemplates([
        {
          id: 'welcome_email',
          name: 'Welcome Email',
          subject: 'Welcome to {{event_name}}!',
          content: 'Dear {{attendee_name}}, welcome to our event...',
          type: 'EMAIL',
          variables: ['event_name', 'attendee_name', 'event_date']
        },
        {
          id: 'session_reminder',
          name: 'Session Reminder',
          subject: 'Your session {{session_name}} starts in 30 minutes',
          content: 'Don\'t forget about {{session_name}} starting at {{session_time}}...',
          type: 'EMAIL',
          variables: ['session_name', 'session_time', 'room_name']
        }
      ])

      // Load channels
      setChannels([
        { id: 'email', name: 'Email', type: 'EMAIL', enabled: true, config: {} },
        { id: 'sms', name: 'SMS', type: 'SMS', enabled: false, config: {} },
        { id: 'push', name: 'Push Notifications', type: 'PUSH', enabled: true, config: {} },
        { id: 'in_app', name: 'In-App Messages', type: 'IN_APP', enabled: true, config: {} },
        { id: 'emergency', name: 'Emergency Alerts', type: 'EMERGENCY', enabled: true, config: {} }
      ])

    } catch (error) {
      console.error('Error loading communications data:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendEmergencyAlert = async () => {
    const message = prompt('Enter emergency message:')
    if (!message) return

    try {
      // Send emergency notification to all attendees
      const { data: attendees } = await supabase
        .from('event_registrations')
        .select('user_id')
        .eq('event_id', eventId)
        .eq('status', 'CHECKED_IN')

      if (attendees) {
        const notifications = attendees.map(attendee => ({
          user_id: attendee.user_id,
          type: 'EMERGENCY_ALERT',
          title: '🚨 Emergency Alert',
          message: message,
          data: { priority: 'high', eventId }
        }))

        await supabase
          .from('notifications')
          .insert(notifications)

        alert('Emergency alert sent to all checked-in attendees')
      }
    } catch (error) {
      console.error('Error sending emergency alert:', error)
      alert('Failed to send emergency alert')
    }
  }

  const sendBroadcast = async () => {
    const title = prompt('Broadcast title:')
    const message = prompt('Broadcast message:')
    if (!title || !message) return

    try {
      const { data: attendees } = await supabase
        .from('event_registrations')
        .select('user_id')
        .eq('event_id', eventId)

      if (attendees) {
        const notifications = attendees.map(attendee => ({
          user_id: attendee.user_id,
          type: 'SYSTEM_ANNOUNCEMENT',
          title: title,
          message: message,
          data: { eventId }
        }))

        await supabase
          .from('notifications')
          .insert(notifications)

        alert('Broadcast sent to all attendees')
      }
    } catch (error) {
      console.error('Error sending broadcast:', error)
      alert('Failed to send broadcast')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SENT': return 'bg-green-100 text-green-800'
      case 'SENDING': return 'bg-blue-100 text-blue-800'
      case 'SCHEDULED': return 'bg-yellow-100 text-yellow-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const calculateEngagementRate = (stats: Campaign['stats']) => {
    return stats.sent > 0 ? Math.round((stats.opened / stats.sent) * 100) : 0
  }

  const tabs = [
    { id: 'campaigns', label: 'Campaigns', icon: '📧' },
    { id: 'templates', label: 'Templates', icon: '📝' },
    { id: 'channels', label: 'Channels', icon: '📡' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ]

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Communications Hub</h2>
          <div className="flex space-x-3">
            <button
              onClick={sendBroadcast}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              📢 Send Broadcast
            </button>
            <button
              onClick={sendEmergencyAlert}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              🚨 Emergency Alert
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Message Campaigns</h3>
            <button
              onClick={() => setShowNewCampaign(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              + New Campaign
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Channels
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Audience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                          <div className="text-sm text-gray-500">
                            {campaign.sentAt ? `Sent ${formatDate(campaign.sentAt)}` :
                             campaign.scheduledAt ? `Scheduled ${formatDate(campaign.scheduledAt)}` :
                             'Draft'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-1">
                          {campaign.channels.map(channel => (
                            <span key={channel} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                              {channel}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.audience.count} recipients
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {campaign.stats.sent > 0 && (
                            <>
                              <div>Sent: {campaign.stats.sent}</div>
                              <div>Opened: {campaign.stats.opened} ({calculateEngagementRate(campaign.stats)}%)</div>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                        <button className="text-green-600 hover:text-green-900 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Message Templates</h3>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              + New Template
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">{template.name}</h4>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {template.type}
                  </span>
                </div>
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-1">Subject:</div>
                  <div className="text-sm text-gray-600">{template.subject}</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-1">Content Preview:</div>
                  <div className="text-sm text-gray-600 line-clamp-3">{template.content}</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-1">Variables:</div>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map(variable => (
                      <span key={variable} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {`{{${variable}}}`}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                    Use Template
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Channels Tab */}
      {activeTab === 'channels' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Communication Channels</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map((channel) => (
              <div key={channel.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">{channel.name}</h4>
                  <div className={`w-3 h-3 rounded-full ${channel.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
                <div className="mb-4">
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {channel.type}
                  </span>
                </div>
                <div className="space-y-2">
                  <button className={`w-full py-2 rounded text-sm transition-colors ${
                    channel.enabled 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}>
                    {channel.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button className="w-full py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Communication Analytics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-blue-600">2,456</div>
              <div className="text-sm text-gray-600">Total Messages Sent</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-green-600">78%</div>
              <div className="text-sm text-gray-600">Delivery Rate</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-purple-600">45%</div>
              <div className="text-sm text-gray-600">Open Rate</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-yellow-600">12%</div>
              <div className="text-sm text-gray-600">Click Rate</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Channel Performance</h4>
            <div className="space-y-4">
              {channels.filter(c => c.enabled).map(channel => (
                <div key={channel.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">{channel.name}</span>
                  <div className="flex space-x-4 text-sm">
                    <span>Sent: 1,234</span>
                    <span>Delivered: 1,198</span>
                    <span>Rate: 97%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
