'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Globe, 
  Palette, 
  Upload, 
  Settings, 
  Building, 
  Wifi, 
  Car, 
  Coffee, 
  Shield, 
  Zap,
  Copy,
  Eye,
  EyeOff,
  Star,
  Archive,
  MoreVertical,
  Search,
  Filter,
  Download,
  Share2
} from 'lucide-react'

interface Event {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  timezone: string
  status: 'draft' | 'published' | 'live' | 'completed' | 'archived'
  venue: Venue
  branding: EventBranding
  settings: EventSettings
  attendeeCount: number
  maxAttendees: number
  createdAt: string
  updatedAt: string
}

interface Venue {
  id: string
  name: string
  address: string
  city: string
  country: string
  capacity: number
  amenities: string[]
  coordinates: {
    lat: number
    lng: number
  }
  floorPlan?: string
  contactInfo: {
    phone: string
    email: string
    website?: string
  }
}

interface EventBranding {
  primaryColor: string
  secondaryColor: string
  logo?: string
  backgroundImage?: string
  customCSS?: string
  emailTemplate?: string
  certificateTemplate?: string
}

interface EventSettings {
  registrationEnabled: boolean
  maxRegistrations: number
  requireApproval: boolean
  allowWaitlist: boolean
  enableNetworking: boolean
  enableQA: boolean
  enablePolling: boolean
  enableChat: boolean
  enableRecording: boolean
  timezone: string
  language: string
  currency: string
}

export default function EventConfiguration() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showVenueForm, setShowVenueForm] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      // Mock events data
      const mockEvents: Event[] = [
        {
          id: 'wecon-masawat-2024',
          name: 'WECON Masawat 2024',
          description: 'The premier technology and innovation conference in the region',
          startDate: '2024-03-15T09:00:00Z',
          endDate: '2024-03-17T18:00:00Z',
          timezone: 'Asia/Dubai',
          status: 'live',
          venue: {
            id: 'venue-1',
            name: 'Dubai World Trade Centre',
            address: 'Sheikh Zayed Road',
            city: 'Dubai',
            country: 'UAE',
            capacity: 5000,
            amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment', 'Security'],
            coordinates: { lat: 25.2285, lng: 55.3273 },
            contactInfo: {
              phone: '+971-4-308-6888',
              email: 'info@dwtc.com',
              website: 'https://www.dwtc.com'
            }
          },
          branding: {
            primaryColor: '#764DF0',
            secondaryColor: '#442490',
            logo: '/wecon-logo.png'
          },
          settings: {
            registrationEnabled: true,
            maxRegistrations: 3000,
            requireApproval: false,
            allowWaitlist: true,
            enableNetworking: true,
            enableQA: true,
            enablePolling: true,
            enableChat: true,
            enableRecording: true,
            timezone: 'Asia/Dubai',
            language: 'en',
            currency: 'USD'
          },
          attendeeCount: 1247,
          maxAttendees: 3000,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-03-10T14:30:00Z'
        },
        {
          id: 'wecon-tech-summit-2024',
          name: 'WECON Tech Summit 2024',
          description: 'Annual technology summit focusing on emerging technologies',
          startDate: '2024-06-20T09:00:00Z',
          endDate: '2024-06-22T18:00:00Z',
          timezone: 'Asia/Dubai',
          status: 'draft',
          venue: {
            id: 'venue-2',
            name: 'Abu Dhabi National Exhibition Centre',
            address: 'Khaleej Al Arabi Street',
            city: 'Abu Dhabi',
            country: 'UAE',
            capacity: 8000,
            amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment', 'Security', 'Translation'],
            coordinates: { lat: 24.4539, lng: 54.6077 },
            contactInfo: {
              phone: '+971-2-444-6900',
              email: 'info@adnec.ae',
              website: 'https://www.adnec.ae'
            }
          },
          branding: {
            primaryColor: '#764DF0',
            secondaryColor: '#442490',
            logo: '/wecon-logo.png'
          },
          settings: {
            registrationEnabled: false,
            maxRegistrations: 5000,
            requireApproval: true,
            allowWaitlist: true,
            enableNetworking: true,
            enableQA: true,
            enablePolling: true,
            enableChat: true,
            enableRecording: true,
            timezone: 'Asia/Dubai',
            language: 'en',
            currency: 'USD'
          },
          attendeeCount: 0,
          maxAttendees: 5000,
          createdAt: '2024-02-01T10:00:00Z',
          updatedAt: '2024-02-15T16:20:00Z'
        }
      ]

      setEvents(mockEvents)
      if (mockEvents.length > 0) {
        setSelectedEvent(mockEvents[0])
      }
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-400 bg-gray-400/20'
      case 'published': return 'text-blue-400 bg-blue-400/20'
      case 'live': return 'text-green-400 bg-green-400/20'
      case 'completed': return 'text-purple-400 bg-purple-400/20'
      case 'archived': return 'text-red-400 bg-red-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return Edit
      case 'published': return Eye
      case 'live': return Zap
      case 'completed': return Star
      case 'archived': return Archive
      default: return Settings
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const duplicateEvent = (event: Event) => {
    const newEvent: Event = {
      ...event,
      id: `${event.id}-copy-${Date.now()}`,
      name: `${event.name} (Copy)`,
      status: 'draft',
      attendeeCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setEvents(prev => [newEvent, ...prev])
  }

  const archiveEvent = (eventId: string) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, status: 'archived' as const, updatedAt: new Date().toISOString() }
          : event
      )
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Event Configuration Management</h2>
          <p className="text-gray-400">Manage multiple events, branding, and venue configurations</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowVenueForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-secondary/20 text-secondary border border-secondary/30 rounded-lg hover:bg-secondary/30 transition-colors"
          >
            <Building className="w-4 h-4" />
            <span>Add Venue</span>
          </button>
          <button
            onClick={() => setShowEventForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>

          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const StatusIcon = getStatusIcon(event.status)
          
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden hover:border-primary/30 transition-colors"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{event.name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{event.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(event.status)}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span className="capitalize">{event.status}</span>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{event.venue.name}, {event.venue.city}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{event.attendeeCount.toLocaleString()} / {event.maxAttendees.toLocaleString()} attendees</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded text-sm hover:bg-primary/30 transition-colors"
                    >
                      Configure
                    </button>
                    <button
                      onClick={() => duplicateEvent(event)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      title="Duplicate Event"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => archiveEvent(event.id)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      title="Archive Event"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="w-16 bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(event.attendeeCount / event.maxAttendees) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Event Configuration Panel */}
      {selectedEvent && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Configure: {selectedEvent.name}</h3>
            <button
              onClick={() => setSelectedEvent(null)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Configuration Tabs */}
          <div className="flex space-x-1 bg-white/5 rounded-lg p-1 mb-6">
            {[
              { id: 'overview', label: 'Overview', icon: Settings },
              { id: 'branding', label: 'Branding', icon: Palette },
              { id: 'venue', label: 'Venue', icon: Building },
              { id: 'settings', label: 'Settings', icon: Shield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Event Name</label>
                  <input
                    type="text"
                    value={selectedEvent.name}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={selectedEvent.status}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={selectedEvent.description}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="datetime-local"
                    value={selectedEvent.startDate.slice(0, 16)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <input
                    type="datetime-local"
                    value={selectedEvent.endDate.slice(0, 16)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={selectedEvent.branding.primaryColor}
                      className="w-12 h-10 rounded border border-white/20 bg-transparent"
                    />
                    <input
                      type="text"
                      value={selectedEvent.branding.primaryColor}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={selectedEvent.branding.secondaryColor}
                      className="w-12 h-10 rounded border border-white/20 bg-transparent"
                    />
                    <input
                      type="text"
                      value={selectedEvent.branding.secondaryColor}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Logo</label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Click to upload or drag and drop</p>
                  <p className="text-gray-500 text-xs">PNG, JPG up to 2MB</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'venue' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Venue Name</label>
                  <input
                    type="text"
                    value={selectedEvent.venue.name}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Capacity</label>
                  <input
                    type="number"
                    value={selectedEvent.venue.capacity}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                <input
                  type="text"
                  value={selectedEvent.venue.address}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                  <input
                    type="text"
                    value={selectedEvent.venue.city}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                  <input
                    type="text"
                    value={selectedEvent.venue.country}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.venue.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                  <button className="px-3 py-1 border border-dashed border-white/30 text-gray-400 rounded-full text-sm hover:border-primary hover:text-primary transition-colors">
                    + Add Amenity
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-white mb-4">Registration Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Enable Registration</label>
                      <p className="text-gray-400 text-sm">Allow attendees to register for this event</p>
                    </div>
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        selectedEvent.settings.registrationEnabled ? 'bg-primary' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          selectedEvent.settings.registrationEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Max Registrations</label>
                      <input
                        type="number"
                        value={selectedEvent.settings.maxRegistrations}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                      <select
                        value={selectedEvent.settings.currency}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="AED">AED - UAE Dirham</option>
                        <option value="GBP">GBP - British Pound</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-white mb-4">Feature Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'enableNetworking', label: 'Networking', description: 'Allow attendee networking' },
                    { key: 'enableQA', label: 'Q&A', description: 'Enable session Q&A' },
                    { key: 'enablePolling', label: 'Polling', description: 'Enable live polling' },
                    { key: 'enableChat', label: 'Chat', description: 'Enable session chat' },
                    { key: 'enableRecording', label: 'Recording', description: 'Enable session recording' },
                    { key: 'allowWaitlist', label: 'Waitlist', description: 'Allow waitlist when full' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <label className="text-white font-medium">{setting.label}</label>
                        <p className="text-gray-400 text-sm">{setting.description}</p>
                      </div>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          selectedEvent.settings[setting.key as keyof EventSettings] ? 'bg-primary' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            selectedEvent.settings[setting.key as keyof EventSettings] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end mt-6 pt-6 border-t border-white/10">
            <button className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
