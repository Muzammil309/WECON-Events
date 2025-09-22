'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

import {
  Users,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus,
  TrendingUp,
  UserCheck,
  MapPin,
  Activity,
  DollarSign,
  MessageCircle,
  Video,
  FileText,
  Award,
  Shield,
  Zap,
  Monitor,
  Megaphone,
  CreditCard,
  Building,
  UserPlus,
  Mail,
  QrCode,
  PieChart,
  Download,
  Database
} from 'lucide-react'
import dynamic from 'next/dynamic'

// Import Supabase client and types
import { supabase, api, type User } from '@/lib/supabase'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics')

  // Add navigation to new features
  const navigateToLiveDashboard = () => {
    window.location.href = '/admin/live'
  }
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalAttendees: 0,
    activeSessions: 0,
    revenue: 0,
    checkInsToday: 0
  })
  const [recentActivities, setRecentActivities] = useState<any[]>([])

  // Import components dynamically
  const RealTimeAnalytics = dynamic(() => import('@/components/admin/RealTimeAnalytics'), { ssr: false })
  const EventManager = dynamic(() => import('@/components/admin/EventManager'), { ssr: false })
  const AdvancedTicketing = dynamic(() => import('@/components/admin/AdvancedTicketing'), { ssr: false })
  const ContentManagement = dynamic(() => import('@/components/admin/ContentManagement'), { ssr: false })
  const AttendeeManagement = dynamic(() => import('@/components/admin/AttendeeManagement'), { ssr: false })
  const RoleBasedAccessControl = dynamic(() => import('@/components/admin/RoleBasedAccessControl'), { ssr: false })
  const AutomatedWorkflowEngine = dynamic(() => import('@/components/admin/AutomatedWorkflowEngine'), { ssr: false })
  const AdvancedDataManagement = dynamic(() => import('@/components/admin/AdvancedDataManagement'), { ssr: false })
  const AdminAccountCreation = dynamic(() => import('@/components/admin/AdminAccountCreation'), { ssr: false })

  // Check authentication and load user data
  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        const isAuthenticated = localStorage.getItem('isAuthenticated')
        const userRole = localStorage.getItem('userRole')
        const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'EVENT_MANAGER']

        if (!isAuthenticated || !allowedRoles.includes(userRole || '')) {
          window.location.href = '/login'
          return
        }

        // Load admin user profile
        const currentUser = await api.getCurrentUser()
        if (currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'EVENT_MANAGER')) {
          setUser(currentUser)

          // Load dashboard data
          await loadDashboardData()
        } else {
          console.error('User does not have admin privileges')
          localStorage.clear()
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('Error initializing admin:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAdmin()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load event statistics
      const eventStats = await api.getEventStats('wecon-masawat-2024')
      setStats(eventStats)

      // Load recent activities
      const activities = await api.getRecentActivities(10)
      setRecentActivities(activities)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Unable to load admin data</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  const statsDisplay = [
    {
      label: 'Total Attendees',
      value: stats.totalAttendees.toLocaleString(),
      change: '+12%',
      icon: Users
    },
    {
      label: 'Active Sessions',
      value: stats.activeSessions.toString(),
      change: '+3',
      icon: Calendar
    },
    {
      label: 'Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      change: '+18%',
      icon: TrendingUp
    },
    {
      label: 'Check-ins Today',
      value: stats.checkInsToday.toLocaleString(),
      change: '+5%',
      icon: UserCheck
    },
  ]

  return (
    <div className="min-h-screen bg-[#101435]">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/wecon-logo.svg"
                alt="WECON Movement"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                />
              </div>
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/5 backdrop-blur-lg border-r border-white/10 min-h-screen">
          <nav className="p-6">
            <div className="space-y-2">
              {[
                { id: 'analytics', label: 'Real-Time Analytics', icon: Activity },
                { id: 'events', label: 'Event Management', icon: Calendar },
                { id: 'tickets', label: 'Ticketing System', icon: CreditCard },
                { id: 'content', label: 'Content Management', icon: FileText },
                { id: 'attendees', label: 'Attendee Management', icon: Users },
                { id: 'communications', label: 'Communications', icon: Mail },
                { id: 'workflows', label: 'Workflow Engine', icon: Zap },
                { id: 'data', label: 'Data Management', icon: Database },
                { id: 'onsite', label: 'On-Site Tools', icon: QrCode },
                { id: 'reports', label: 'Analytics & Reports', icon: PieChart },
                { id: 'rbac', label: 'Access Control', icon: Shield },
                { id: 'admin-creation', label: 'Create Admin', icon: UserPlus },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Real-Time Analytics */}
          {activeTab === 'analytics' && (
            <RealTimeAnalytics
              eventId="wecon-masawat-2024"
              refreshInterval={30000}
            />
          )}

          {/* Event Management */}
          {activeTab === 'events' && (
            <EventManager />
          )}

          {/* Ticketing System */}
          {activeTab === 'tickets' && (
            <AdvancedTicketing />
          )}

          {/* Content Management */}
          {activeTab === 'content' && (
            <ContentManagement />
          )}

          {/* Attendee Management */}
          {activeTab === 'attendees' && (
            <AttendeeManagement />
          )}

          {/* Communications */}
          {activeTab === 'communications' && (
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">Communication & Engagement Suite</h2>
                <p className="text-gray-400 mb-6">Email campaigns, push notifications, and Q&A moderation.</p>

                <div className="text-center py-12">
                  <Megaphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">Communication Tools</h4>
                  <p className="text-gray-400">Advanced communication features coming soon</p>
                </div>
              </div>
            </div>
          )}

          {/* On-Site Tools */}
          {activeTab === 'onsite' && (
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">On-Site Management Tools</h2>
                <p className="text-gray-400 mb-6">Check-in dashboard, badge printing, and digital signage.</p>

                <div className="text-center py-12">
                  <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">On-Site Management</h4>
                  <p className="text-gray-400">On-site management tools coming soon</p>
                </div>
              </div>
            </div>
          )}

          {/* Reports */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">Analytics & Reporting</h2>
                <p className="text-gray-400 mb-6">Registration analytics, session metrics, and automated reports.</p>

                <div className="text-center py-12">
                  <Download className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">Advanced Reporting</h4>
                  <p className="text-gray-400">Comprehensive reporting tools coming soon</p>
                </div>
              </div>
            </div>
          )}

          {/* Legacy Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome back, Admin!</h2>
                <p className="text-gray-400">Here's what's happening with your event today.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsDisplay.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon className="w-8 h-8 text-primary" />
                      <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activities */}
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Recent Activities</h3>
                  <button className="text-primary hover:text-primary/80 transition-colors">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                      <div>
                        <p className="text-white font-medium">{activity.action}</p>
                        <p className="text-gray-400 text-sm">{activity.user}</p>
                      </div>
                      <span className="text-gray-500 text-sm">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={navigateToLiveDashboard}
                    className="flex items-center space-x-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
                  >
                    <Activity className="w-5 h-5 text-blue-400" />
                    <span className="text-white">Live Dashboard</span>
                  </button>
                  <button className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">Communications</span>
                  </button>
                  <button className="flex items-center space-x-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <span className="text-white">Venue Map</span>
                  </button>
                  <button className="flex items-center space-x-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/20 transition-colors">
                    <Plus className="w-5 h-5 text-yellow-400" />
                    <span className="text-white">Add Session</span>
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* Role-Based Access Control */}
          {activeTab === 'rbac' && (
            <RoleBasedAccessControl />
          )}

          {/* Admin Account Creation */}
          {activeTab === 'admin-creation' && (
            <AdminAccountCreation />
          )}


          {/* Automated Workflow Engine */}
          {activeTab === 'workflows' && (
            <AutomatedWorkflowEngine />
          )}

          {/* Advanced Data Management */}
          {activeTab === 'data' && (
            <AdvancedDataManagement />
          )}



          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">System Settings</h3>
              <p className="text-gray-400 mb-6">System configuration and preferences coming soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
