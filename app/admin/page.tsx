'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
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
  MapPin
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { label: 'Total Attendees', value: '1,247', change: '+12%', icon: Users },
    { label: 'Active Sessions', value: '24', change: '+3', icon: Calendar },
    { label: 'Revenue', value: '$89,420', change: '+18%', icon: TrendingUp },
    { label: 'Check-ins Today', value: '892', change: '+5%', icon: UserCheck },
  ]

  const recentActivities = [
    { action: 'New attendee registered', user: 'John Smith', time: '2 min ago' },
    { action: 'Session "AI Ethics" started', user: 'Dr. Sarah Chen', time: '15 min ago' },
    { action: 'Venue capacity updated', user: 'Admin', time: '1 hour ago' },
    { action: 'New sponsor added', user: 'Marketing Team', time: '2 hours ago' },
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
                onClick={() => window.location.href = '/'}
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
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'attendees', label: 'Attendees', icon: Users },
                { id: 'sessions', label: 'Sessions', icon: Calendar },
                { id: 'venues', label: 'Venues', icon: MapPin },
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome back, Admin!</h2>
                <p className="text-gray-400">Here's what's happening with your event today.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center space-x-3 p-4 bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors">
                    <Plus className="w-5 h-5 text-primary" />
                    <span className="text-white">Add New Session</span>
                  </button>
                  <button className="flex items-center space-x-3 p-4 bg-secondary/10 border border-secondary/20 rounded-lg hover:bg-secondary/20 transition-colors">
                    <Users className="w-5 h-5 text-secondary" />
                    <span className="text-white">Manage Attendees</span>
                  </button>
                  <button className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    <span className="text-white">View Reports</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs content would go here */}
          {activeTab !== 'overview' && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
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
