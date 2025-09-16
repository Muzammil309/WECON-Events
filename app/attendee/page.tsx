'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Star,
  Bell,
  Search,
  QrCode,
  Download,
  Heart,
  Share2,
  User,
  Settings,
  MessageCircle,
  Video,
  FileText,
  Network,
  Plus,
  Edit,
  Camera,
  Globe,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  Filter,
  SortAsc,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ThumbsUp,
  Send,
  MoreVertical
} from 'lucide-react'

// Import Supabase client and types
import { supabase, api, type User, type Session, type Connection, type Meeting, type Notification } from '@/lib/supabase'
import dynamic from 'next/dynamic'

export default function AttendeeDashboard() {
  const [activeTab, setActiveTab] = useState('schedule')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<Session[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTrack, setFilterTrack] = useState('all')

  // Profile Management State
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    job_title: '',
    company: '',
    industry: '',
    location: '',
    linkedin_url: '',
    twitter_url: '',
    website_url: '',
    networking_available: true,
    privacy_level: 'PUBLIC' as const
  })

  // Check authentication and load user data
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const isAuthenticated = localStorage.getItem('isAuthenticated')
        if (!isAuthenticated) {
          window.location.href = '/login'
          return
        }

        // Load user profile
        const currentUser = await api.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          setProfileForm({
            first_name: currentUser.first_name || '',
            last_name: currentUser.last_name || '',
            bio: currentUser.bio || '',
            job_title: currentUser.job_title || '',
            company: currentUser.company || '',
            industry: currentUser.industry || '',
            location: currentUser.location || '',
            linkedin_url: currentUser.linkedin_url || '',
            twitter_url: currentUser.twitter_url || '',
            website_url: currentUser.website_url || '',
            networking_available: currentUser.networking_available,
            privacy_level: currentUser.privacy_level
          })

          // Load user's sessions, connections, and notifications
          await Promise.all([
            loadUserSessions(currentUser.id),
            loadConnections(currentUser.id),
            loadNotifications(currentUser.id)
          ])
        }
      } catch (error) {
        console.error('Error initializing user:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeUser()
  }, [])

  const loadUserSessions = async (userId: string) => {
    try {
      // For demo, we'll use a default event ID
      const eventId = 'wecon-masawat-2024'
      const userSessions = await api.getUserSessions(userId, eventId)
      setSessions(userSessions?.map(reg => reg.sessions) || [])
    } catch (error) {
      console.error('Error loading sessions:', error)
    }
  }

  const loadConnections = async (userId: string) => {
    try {
      const userConnections = await api.getConnections(userId)
      setConnections(userConnections || [])
    } catch (error) {
      console.error('Error loading connections:', error)
    }
  }

  const loadNotifications = async (userId: string) => {
    try {
      const userNotifications = await api.getNotifications(userId)
      setNotifications(userNotifications || [])
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    window.location.href = '/'
  }

  const handleProfileUpdate = async () => {
    if (!user) return

    try {
      const updatedUser = await api.updateUserProfile(user.id, profileForm)
      setUser(updatedUser)
      setIsEditingProfile(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  // Import components
  const ProfileManagement = dynamic(() => import('@/components/attendee/ProfileManagement'), { ssr: false })
  const NetworkingSystem = dynamic(() => import('@/components/attendee/NetworkingSystem'), { ssr: false })
  const AgendaBuilder = dynamic(() => import('@/components/attendee/AgendaBuilder'), { ssr: false })
  const LiveSessionInterface = dynamic(() => import('@/components/attendee/LiveSessionInterface'), { ssr: false })
  const CommunicationHub = dynamic(() => import('@/components/attendee/CommunicationHub'), { ssr: false })
  const PostEventFeatures = dynamic(() => import('@/components/attendee/PostEventFeatures'), { ssr: false })

  const handleProfileFormChange = (field: string, value: any) => {
    setProfileForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSessionToggle = async (sessionId: string, add: boolean) => {
    try {
      if (add) {
        // Add session to user's agenda
        // TODO: Implement session registration API
        console.log('Adding session to agenda:', sessionId)
      } else {
        // Remove session from user's agenda
        // TODO: Implement session removal API
        console.log('Removing session from agenda:', sessionId)
      }

      // Reload user sessions
      if (user) {
        await loadUserSessions(user.id)
      }
    } catch (error) {
      console.error('Error toggling session:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Unable to load user data</p>
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

  const upcomingSessions = [
    {
      id: 1,
      title: 'The Future of AI in Healthcare',
      speaker: 'Dr. Sarah Chen',
      time: '10:00 AM - 11:00 AM',
      location: 'Main Auditorium',
      status: 'upcoming',
      favorite: true
    },
    {
      id: 2,
      title: 'Machine Learning Ethics Panel',
      speaker: 'Multiple Speakers',
      time: '2:00 PM - 3:30 PM',
      location: 'Conference Room A',
      status: 'registered',
      favorite: false
    },
    {
      id: 3,
      title: 'AI Startup Showcase',
      speaker: 'Various Founders',
      time: '4:00 PM - 5:30 PM',
      location: 'Exhibition Hall',
      status: 'available',
      favorite: false
    }
  ]

  const myTickets = [
    {
      id: 'WECON2025-001',
      type: 'Full Access Pass',
      status: 'Active',
      qrCode: true
    }
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
              <h1 className="text-xl font-bold text-white">Attendee Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => !n.is_read).length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>
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
                { id: 'profile', label: 'My Profile', icon: User },
                { id: 'agenda', label: 'Agenda Builder', icon: Calendar },
                { id: 'networking', label: 'Networking Hub', icon: Network },
                { id: 'sessions', label: 'Live Sessions', icon: Video },
                { id: 'tickets', label: 'My Tickets', icon: QrCode },
                { id: 'communications', label: 'Messages', icon: MessageCircle },
                { id: 'resources', label: 'Resources', icon: FileText },
                { id: 'feedback', label: 'Feedback', icon: Star },
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
          {/* Profile Management */}
          {activeTab === 'profile' && (
            <ProfileManagement
              user={user}
              isEditing={isEditingProfile}
              profileForm={profileForm}
              onEdit={() => setIsEditingProfile(true)}
              onCancel={() => {
                setIsEditingProfile(false)
                // Reset form to current user data
                setProfileForm({
                  first_name: user.first_name || '',
                  last_name: user.last_name || '',
                  bio: user.bio || '',
                  job_title: user.job_title || '',
                  company: user.company || '',
                  industry: user.industry || '',
                  location: user.location || '',
                  linkedin_url: user.linkedin_url || '',
                  twitter_url: user.twitter_url || '',
                  website_url: user.website_url || '',
                  networking_available: user.networking_available,
                  privacy_level: user.privacy_level
                })
              }}
              onSave={handleProfileUpdate}
              onFormChange={handleProfileFormChange}
            />
          )}

          {/* Agenda Builder */}
          {activeTab === 'agenda' && (
            <AgendaBuilder
              currentUser={user}
              sessions={sessions}
              userSessions={sessions} // TODO: Filter to user's actual sessions
              onSessionToggle={handleSessionToggle}
            />
          )}

          {/* Networking Hub */}
          {activeTab === 'networking' && (
            <NetworkingSystem
              currentUser={user}
              connections={connections}
              onConnectionUpdate={() => loadConnections(user.id)}
            />
          )}

          {/* Live Sessions */}
          {activeTab === 'sessions' && (
            <div className="space-y-6">
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <LiveSessionInterface
                    key={session.id}
                    session={session}
                    currentUser={user}
                    isLive={new Date() >= new Date(session.start_time) && new Date() <= new Date(session.end_time)}
                    onJoinSession={() => console.log('Joining session:', session.id)}
                    onLeaveSession={() => console.log('Leaving session:', session.id)}
                  />
                ))
              ) : (
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                  <div className="text-center py-12">
                    <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-white mb-2">No sessions in your agenda</h4>
                    <p className="text-gray-400 mb-4">Add sessions to your agenda to see them here</p>
                    <button
                      onClick={() => setActiveTab('agenda')}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                    >
                      Browse Sessions
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Communications */}
          {activeTab === 'communications' && (
            <CommunicationHub
              currentUser={user}
              notifications={notifications}
              onMarkNotificationRead={async (notificationId) => {
                await api.markNotificationRead(notificationId)
                await loadNotifications(user.id)
              }}
            />
          )}

          {/* Resources */}
          {activeTab === 'resources' && (
            <PostEventFeatures
              currentUser={user}
              eventSessions={sessions}
              eventCompleted={false} // TODO: Determine if event is completed
            />
          )}

          {/* Feedback */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">Session Feedback</h2>
                <p className="text-gray-400 mb-6">Share your feedback to help improve future events.</p>

                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">No feedback submitted yet</h4>
                  <p className="text-gray-400">Feedback forms will be available after attending sessions</p>
                </div>
              </div>
            </div>
          )}

          {/* My Tickets */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">My Tickets</h2>
                <p className="text-gray-400">Access your event tickets and QR codes.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Event Tickets</h3>
                  <span className="text-primary text-sm">October 1, 2025</span>
                </div>
                
                <div className="space-y-4">
                  {upcomingSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-white font-medium">{session.title}</h4>
                            {session.favorite && (
                              <Heart className="w-4 h-4 text-red-400 fill-current" />
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mb-2">{session.speaker}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{session.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{session.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-white transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              session.status === 'registered'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : session.status === 'upcoming'
                                ? 'bg-primary/20 text-primary border border-primary/30'
                                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                            }`}
                          >
                            {session.status === 'registered' ? 'Registered' : 
                             session.status === 'upcoming' ? 'Starting Soon' : 'Register'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center">
                  <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white mb-1">8</p>
                  <p className="text-gray-400 text-sm">Sessions Registered</p>
                </div>
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center">
                  <Users className="w-8 h-8 text-secondary mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white mb-1">24</p>
                  <p className="text-gray-400 text-sm">Network Connections</p>
                </div>
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center">
                  <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white mb-1">12</p>
                  <p className="text-gray-400 text-sm">Favorite Sessions</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">My Tickets</h2>
              
              {myTickets.map((ticket) => (
                <div key={ticket.id} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{ticket.type}</h3>
                      <p className="text-gray-400">Ticket ID: {ticket.id}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                        {ticket.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors">
                        <QrCode className="w-4 h-4" />
                        <span>Show QR</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Other tabs content */}
          {!['schedule', 'tickets'].includes(activeTab) && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h3>
              <p className="text-gray-400 mb-6">
                This section is under development. Full functionality will be available soon.
              </p>
              <Link 
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Back to Main Site
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
