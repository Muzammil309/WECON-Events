'use client'

import React, { useState } from 'react'
import AdvancedAnalytics from '@/components/admin/AdvancedAnalytics'
import CommunicationsHub from '@/components/admin/CommunicationsHub'
import InteractiveVenueMap from '@/components/maps/InteractiveVenueMap'

export default function EnterpriseDashboard() {
  const [activeModule, setActiveModule] = useState('analytics')
  const [selectedEvent, setSelectedEvent] = useState(1) // Mock event ID

  const modules = [
    {
      id: 'analytics',
      name: 'Advanced Analytics',
      icon: '📊',
      description: 'Real-time insights and predictive analytics'
    },
    {
      id: 'communications',
      name: 'Communications Hub',
      icon: '📢',
      description: 'Multi-channel messaging and emergency alerts'
    },
    {
      id: 'maps',
      name: 'Interactive Maps',
      icon: '🗺️',
      description: 'Venue navigation and real-time occupancy'
    },
    {
      id: 'ai-matchmaking',
      name: 'AI Matchmaking',
      icon: '🤖',
      description: 'Smart networking and session recommendations'
    }
  ]

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'analytics':
        return <AdvancedAnalytics eventId={selectedEvent} />
      case 'communications':
        return <CommunicationsHub eventId={selectedEvent} />
      case 'maps':
        return <InteractiveVenueMap eventId={selectedEvent} showRealTimeOccupancy={true} />
      case 'ai-matchmaking':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">AI Matchmaking & Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                <div className="text-2xl mb-3">🤝</div>
                <h4 className="font-semibold text-gray-900 mb-2">Smart Networking</h4>
                <p className="text-gray-600 text-sm mb-4">AI-powered attendee matching based on interests, skills, and goals</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  View Matches
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                <div className="text-2xl mb-3">📚</div>
                <h4 className="font-semibold text-gray-900 mb-2">Session Recommendations</h4>
                <p className="text-gray-600 text-sm mb-4">Personalized session suggestions based on user profiles and behavior</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                  Generate Recommendations
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                <div className="text-2xl mb-3">📅</div>
                <h4 className="font-semibold text-gray-900 mb-2">Schedule Optimization</h4>
                <p className="text-gray-600 text-sm mb-4">Intelligent schedule planning with conflict detection and alternatives</p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                  Optimize Schedules
                </button>
              </div>
            </div>
            
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">AI Insights Dashboard</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1,247</div>
                  <div className="text-sm text-gray-600">Networking Matches Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-gray-600">Recommendation Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">456</div>
                  <div className="text-sm text-gray-600">Optimized Schedules</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">92%</div>
                  <div className="text-sm text-gray-600">User Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">WECON Enterprise Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>WECON 2024 - Main Event</option>
                <option value={2}>WECON 2024 - Workshop Series</option>
                <option value={3}>WECON 2024 - Networking Night</option>
              </select>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Enterprise Modules</h2>
              <nav className="space-y-2">
                {modules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeModule === module.id
                        ? 'bg-blue-50 border border-blue-200 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{module.icon}</span>
                      <div>
                        <div className="font-medium">{module.name}</div>
                        <div className="text-xs text-gray-500">{module.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Attendees</span>
                  <span className="font-semibold text-green-600">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Live Sessions</span>
                  <span className="font-semibold text-blue-600">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Messages Sent</span>
                  <span className="font-semibold text-purple-600">2,456</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">AI Matches</span>
                  <span className="font-semibold text-yellow-600">892</span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Healthy</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Real-time Sync</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">AI Services</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Communications</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderActiveModule()}
          </div>
        </div>
      </div>
    </div>
  )
}
