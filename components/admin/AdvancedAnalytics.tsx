'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface AnalyticsData {
  registrationVelocity: {
    daily: number[]
    labels: string[]
    total: number
    trend: 'up' | 'down' | 'stable'
  }
  engagementMetrics: {
    sessionAttendance: number
    averageSessionTime: number
    qnaParticipation: number
    networkingConnections: number
  }
  revenueAnalytics: {
    totalRevenue: number
    ticketsSold: number
    averageTicketPrice: number
    refundRate: number
  }
  attendeeInsights: {
    demographics: {
      companies: { name: string; count: number }[]
      jobTitles: { title: string; count: number }[]
      industries: { industry: string; count: number }[]
    }
    behavior: {
      checkInTimes: number[]
      sessionPreferences: { type: string; count: number }[]
      networkingActivity: number
    }
  }
  predictiveInsights: {
    expectedAttendance: number
    peakHours: string[]
    capacityAlerts: { sessionId: number; sessionTitle: string; riskLevel: 'high' | 'medium' | 'low' }[]
    recommendations: string[]
  }
}

interface AdvancedAnalyticsProps {
  eventId: number
}

export default function AdvancedAnalytics({ eventId }: AdvancedAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadAnalytics()
  }, [eventId, timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      
      // Load registration data
      const registrationData = await loadRegistrationVelocity()
      const engagementData = await loadEngagementMetrics()
      const revenueData = await loadRevenueAnalytics()
      const attendeeData = await loadAttendeeInsights()
      const predictiveData = await generatePredictiveInsights()

      setAnalytics({
        registrationVelocity: registrationData,
        engagementMetrics: engagementData,
        revenueAnalytics: revenueData,
        attendeeInsights: attendeeData,
        predictiveInsights: predictiveData
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRegistrationVelocity = async () => {
    const { data } = await supabase
      .from('event_registrations')
      .select('registered_at')
      .eq('event_id', eventId)
      .order('registered_at')

    // Process data into daily counts
    const dailyCounts: { [key: string]: number } = {}
    data?.forEach(reg => {
      const date = new Date(reg.registered_at).toISOString().split('T')[0]
      dailyCounts[date] = (dailyCounts[date] || 0) + 1
    })

    const labels = Object.keys(dailyCounts).sort()
    const daily = labels.map(date => dailyCounts[date])
    
    // Calculate trend
    const recent = daily.slice(-3).reduce((a, b) => a + b, 0)
    const previous = daily.slice(-6, -3).reduce((a, b) => a + b, 0)
    const trend: 'up' | 'down' | 'stable' = recent > previous ? 'up' : recent < previous ? 'down' : 'stable'

    return {
      daily,
      labels,
      total: data?.length || 0,
      trend
    }
  }

  const loadEngagementMetrics = async () => {
    // Session attendance
    const { data: sessionData } = await supabase
      .from('session_registrations')
      .select('session_id, status')
      .eq('sessions.event_id', eventId)

    const attendanceRate = sessionData ? 
      sessionData.filter(s => s.status === 'ATTENDED').length / sessionData.length * 100 : 0

    // Q&A participation (mock data - would come from actual engagement tracking)
    const qnaParticipation = 65

    // Networking connections
    const { data: connections } = await supabase
      .from('connections')
      .select('id')
      .eq('status', 'ACCEPTED')

    return {
      sessionAttendance: Math.round(attendanceRate),
      averageSessionTime: 45, // Mock data
      qnaParticipation,
      networkingConnections: connections?.length || 0
    }
  }

  const loadRevenueAnalytics = async () => {
    const { data } = await supabase
      .from('event_registrations')
      .select('payment_amount, payment_status')
      .eq('event_id', eventId)

    const paidRegistrations = data?.filter(r => r.payment_status === 'PAID') || []
    const totalRevenue = paidRegistrations.reduce((sum, reg) => sum + (reg.payment_amount || 0), 0)
    const refunds = data?.filter(r => r.payment_status === 'REFUNDED').length || 0
    const refundRate = data ? (refunds / data.length) * 100 : 0

    return {
      totalRevenue,
      ticketsSold: paidRegistrations.length,
      averageTicketPrice: paidRegistrations.length > 0 ? totalRevenue / paidRegistrations.length : 0,
      refundRate: Math.round(refundRate)
    }
  }

  const loadAttendeeInsights = async () => {
    const { data } = await supabase
      .from('event_registrations')
      .select(`
        users (company, job_title)
      `)
      .eq('event_id', eventId)

    const users = data?.map(reg => reg.users).filter(Boolean) || []

    // Company distribution
    const companyCounts: { [key: string]: number } = {}
    users.forEach((user: any) => {
      if (user?.company) {
        companyCounts[user.company] = (companyCounts[user.company] || 0) + 1
      }
    })

    // Job title distribution
    const titleCounts: { [key: string]: number } = {}
    users.forEach((user: any) => {
      if (user?.job_title) {
        titleCounts[user.job_title] = (titleCounts[user.job_title] || 0) + 1
      }
    })

    return {
      demographics: {
        companies: Object.entries(companyCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        jobTitles: Object.entries(titleCounts)
          .map(([title, count]) => ({ title, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        industries: [] // Would be derived from company data
      },
      behavior: {
        checkInTimes: [8, 12, 25, 45, 67, 89, 76, 54, 32, 21, 15, 8], // Mock hourly data
        sessionPreferences: [
          { type: 'KEYNOTE', count: 89 },
          { type: 'WORKSHOP', count: 67 },
          { type: 'PANEL', count: 45 },
          { type: 'NETWORKING', count: 78 }
        ],
        networkingActivity: 156
      }
    }
  }

  const generatePredictiveInsights = async () => {
    // Mock predictive analytics - in production, use ML models
    const { data: sessions } = await supabase
      .from('sessions')
      .select('id, title, max_attendees, current_attendees')
      .eq('event_id', eventId)

    const capacityAlerts = sessions?.map(session => {
      const ratio = session.current_attendees / session.max_attendees
      const riskLevel: 'high' | 'medium' | 'low' = ratio > 0.8 ? 'high' : ratio > 0.6 ? 'medium' : 'low'
      return {
        sessionId: session.id,
        sessionTitle: session.title,
        riskLevel
      }
    }).filter(alert => alert.riskLevel !== 'low') || []

    return {
      expectedAttendance: 847, // Predicted final attendance
      peakHours: ['09:00-10:00', '14:00-15:00', '16:30-17:30'],
      capacityAlerts,
      recommendations: [
        'Consider opening overflow rooms for high-demand sessions',
        'Schedule networking breaks during predicted low-activity periods',
        'Increase catering for peak hours',
        'Deploy additional check-in staff during morning rush'
      ]
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'engagement', label: 'Engagement', icon: '💬' },
    { id: 'revenue', label: 'Revenue', icon: '💰' },
    { id: 'attendees', label: 'Attendees', icon: '👥' },
    { id: 'predictions', label: 'Predictions', icon: '🔮' }
  ]

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="text-gray-400 text-4xl mb-4">📊</div>
        <p className="text-gray-600">No analytics data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Advanced Analytics</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">📈</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Registrations</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {analytics.registrationVelocity.total}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      analytics.registrationVelocity.trend === 'up' ? 'text-green-600' :
                      analytics.registrationVelocity.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {analytics.registrationVelocity.trend === 'up' ? '↗' : 
                       analytics.registrationVelocity.trend === 'down' ? '↘' : '→'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">💰</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(analytics.revenueAnalytics.totalRevenue)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">💬</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Engagement Rate</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {analytics.engagementMetrics.sessionAttendance}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">🔮</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Predicted Attendance</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {analytics.predictiveInsights.expectedAttendance}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Capacity Alerts</h3>
            <div className="space-y-3">
              {analytics.predictiveInsights.capacityAlerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  alert.riskLevel === 'high' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{alert.sessionTitle}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      alert.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {alert.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">AI Recommendations</h3>
            <div className="space-y-2">
              {analytics.predictiveInsights.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">💡</span>
                  <span className="text-gray-700">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
