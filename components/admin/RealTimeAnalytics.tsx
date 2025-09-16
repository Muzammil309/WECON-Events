'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Wifi,
  WifiOff,
  Eye,
  MessageCircle,
  ThumbsUp,
  Share2,
  Download,
  RefreshCw,
  Filter,
  Settings,
  Bell,
  Zap,
  Target,
  Award,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'

interface AnalyticsData {
  totalAttendees: number
  checkedInAttendees: number
  activeSessions: number
  totalRevenue: number
  engagementRate: number
  networkingConnections: number
  qnaQuestions: number
  chatMessages: number
  liveViewers: number
  deviceBreakdown: {
    mobile: number
    desktop: number
    tablet: number
  }
  topSessions: Array<{
    id: string
    title: string
    attendees: number
    engagement: number
  }>
  recentActivity: Array<{
    id: string
    type: 'registration' | 'checkin' | 'session_join' | 'networking' | 'feedback'
    message: string
    timestamp: string
    user?: string
  }>
  alerts: Array<{
    id: string
    type: 'warning' | 'error' | 'info' | 'success'
    title: string
    message: string
    timestamp: string
    isRead: boolean
  }>
}

interface RealTimeAnalyticsProps {
  eventId: string
  refreshInterval?: number
}

export default function RealTimeAnalytics({ 
  eventId, 
  refreshInterval = 30000 
}: RealTimeAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h')

  useEffect(() => {
    loadAnalyticsData()
    
    if (autoRefresh) {
      const interval = setInterval(loadAnalyticsData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [eventId, autoRefresh, refreshInterval])

  const loadAnalyticsData = async () => {
    try {
      // Mock real-time analytics data
      const mockData: AnalyticsData = {
        totalAttendees: 1247,
        checkedInAttendees: 892,
        activeSessions: 8,
        totalRevenue: 89420,
        engagementRate: 78.5,
        networkingConnections: 456,
        qnaQuestions: 234,
        chatMessages: 1567,
        liveViewers: 342,
        deviceBreakdown: {
          mobile: 45,
          desktop: 35,
          tablet: 20
        },
        topSessions: [
          {
            id: '1',
            title: 'The Future of AI in Healthcare',
            attendees: 456,
            engagement: 92.3
          },
          {
            id: '2',
            title: 'Building Scalable Microservices',
            attendees: 234,
            engagement: 87.1
          },
          {
            id: '3',
            title: 'Sustainable Technology Panel',
            attendees: 189,
            engagement: 84.7
          }
        ],
        recentActivity: [
          {
            id: '1',
            type: 'registration',
            message: 'New attendee registered',
            timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
            user: 'John Smith'
          },
          {
            id: '2',
            type: 'checkin',
            message: 'Attendee checked in',
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            user: 'Sarah Chen'
          },
          {
            id: '3',
            type: 'session_join',
            message: 'Joined AI Healthcare session',
            timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
            user: 'Mike Johnson'
          },
          {
            id: '4',
            type: 'networking',
            message: 'New connection made',
            timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
            user: 'Lisa Wang'
          }
        ],
        alerts: [
          {
            id: '1',
            type: 'warning',
            title: 'High Session Capacity',
            message: 'AI Healthcare session is at 95% capacity',
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            isRead: false
          },
          {
            id: '2',
            type: 'info',
            title: 'Network Performance',
            message: 'All systems operating normally',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            isRead: true
          }
        ]
      }

      setAnalyticsData(mockData)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration': return Users
      case 'checkin': return CheckCircle
      case 'session_join': return Calendar
      case 'networking': return MessageCircle
      case 'feedback': return ThumbsUp
      default: return Activity
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle
      case 'error': return AlertTriangle
      case 'info': return CheckCircle
      case 'success': return CheckCircle
      default: return Bell
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30'
      case 'error': return 'text-red-400 bg-red-400/20 border-red-400/30'
      case 'info': return 'text-blue-400 bg-blue-400/20 border-blue-400/30'
      case 'success': return 'text-green-400 bg-green-400/20 border-green-400/30'
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30'
    }
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return Smartphone
      case 'desktop': return Monitor
      case 'tablet': return Tablet
      default: return Monitor
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No Analytics Data</h3>
        <p className="text-gray-400">Unable to load analytics data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Real-Time Analytics</h2>
          <p className="text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="15m">Last 15 minutes</option>
            <option value="1h">Last hour</option>
            <option value="6h">Last 6 hours</option>
            <option value="24h">Last 24 hours</option>
          </select>
          
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              autoRefresh 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-white/5 text-gray-400 border border-white/20 hover:bg-white/10'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Auto Refresh</span>
          </button>
          
          <button
            onClick={loadAnalyticsData}
            className="flex items-center space-x-2 px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {analyticsData.checkedInAttendees.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                of {analyticsData.totalAttendees.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Check-in Rate</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">
                {((analyticsData.checkedInAttendees / analyticsData.totalAttendees) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {formatCurrency(analyticsData.totalRevenue)}
              </div>
              <div className="text-sm text-gray-400">Total Revenue</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Revenue Growth</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">+18%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {analyticsData.engagementRate}%
              </div>
              <div className="text-sm text-gray-400">Engagement Rate</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">vs. Last Event</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">+12%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Eye className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {analyticsData.liveViewers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Live Viewers</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Active Sessions</span>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm">{analyticsData.activeSessions}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sessions */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Sessions</h3>
          <div className="space-y-4">
            {analyticsData.topSessions.map((session, index) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{session.title}</h4>
                    <p className="text-sm text-gray-400">{session.attendees} attendees</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-medium">{session.engagement}%</div>
                  <div className="text-xs text-gray-500">engagement</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Device Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(analyticsData.deviceBreakdown).map(([device, percentage]) => {
              const DeviceIcon = getDeviceIcon(device)
              return (
                <div key={device} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <DeviceIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-white capitalize">{device}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-400 text-sm w-8">{percentage}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {analyticsData.recentActivity.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type)
              return (
                <div key={activity.id} className="flex items-center space-x-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <ActivityIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.message}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      {activity.user && <span>{activity.user}</span>}
                      <span>•</span>
                      <span>{formatTime(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">System Alerts</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {analyticsData.alerts.map((alert) => {
              const AlertIcon = getAlertIcon(alert.type)
              return (
                <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                  <div className="flex items-start space-x-3">
                    <AlertIcon className="w-5 h-5 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{alert.title}</h4>
                      <p className="text-sm opacity-80">{alert.message}</p>
                      <p className="text-xs opacity-60 mt-1">{formatTime(alert.timestamp)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
