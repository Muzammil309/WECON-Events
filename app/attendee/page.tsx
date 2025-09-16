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
  Share2
} from 'lucide-react'

export default function AttendeeDashboard() {
  const [activeTab, setActiveTab] = useState('schedule')
  const [userEmail, setUserEmail] = useState('')

  // Check authentication on component mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    const email = localStorage.getItem('userEmail')

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login'
      return
    }

    setUserEmail(email || 'user@wecon.com')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    window.location.href = '/'
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
              <h1 className="text-xl font-bold text-white">My Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search sessions..."
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
                { id: 'schedule', label: 'My Schedule', icon: Calendar },
                { id: 'tickets', label: 'My Tickets', icon: QrCode },
                { id: 'networking', label: 'Networking', icon: Users },
                { id: 'favorites', label: 'Favorites', icon: Heart },
                { id: 'venue', label: 'Venue Map', icon: MapPin },
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
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              {/* Welcome */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to AI Summit 2025!</h2>
                <p className="text-gray-400">Manage your personalized event experience.</p>
              </div>

              {/* Today's Schedule */}
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Today's Sessions</h3>
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
