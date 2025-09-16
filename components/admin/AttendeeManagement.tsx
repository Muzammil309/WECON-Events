'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  UserPlus, 
  UserMinus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Star, 
  Award, 
  Building, 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Target, 
  Zap, 
  Send, 
  MessageSquare, 
  Bell, 
  Settings, 
  Plus, 
  X, 
  Save,
  RefreshCw,
  FileText,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  Tag,
  Heart,
  Share2,
  Copy
} from 'lucide-react'
import { User } from '@/lib/supabase'

interface AttendeeProfile extends User {
  registrationDate: string
  ticketType: string
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed'
  checkInStatus: 'not_checked_in' | 'checked_in' | 'checked_out'
  checkInTime?: string
  sessionsAttended: string[]
  networkingConnections: number
  engagementScore: number
  lastActivity: string
  preferences: {
    dietaryRestrictions?: string[]
    accessibility?: string[]
    interests?: string[]
    communicationPreferences: {
      email: boolean
      sms: boolean
      push: boolean
    }
  }
  journey: AttendeeJourneyEvent[]
  tags: string[]
  notes: string
  customFields: Record<string, any>
}

interface AttendeeJourneyEvent {
  id: string
  type: 'registration' | 'payment' | 'check_in' | 'session_join' | 'networking' | 'feedback' | 'check_out'
  timestamp: string
  details: string
  metadata?: Record<string, any>
}

interface BulkAction {
  id: string
  name: string
  description: string
  icon: any
  action: (attendeeIds: string[]) => void
}

interface AttendeeFilter {
  search: string
  ticketType: string
  paymentStatus: string
  checkInStatus: string
  engagementLevel: string
  registrationDate: string
  tags: string[]
}

export default function AttendeeManagement() {
  const [attendees, setAttendees] = useState<AttendeeProfile[]>([])
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([])
  const [selectedAttendee, setSelectedAttendee] = useState<AttendeeProfile | null>(null)
  const [showAttendeeDetails, setShowAttendeeDetails] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [filters, setFilters] = useState<AttendeeFilter>({
    search: '',
    ticketType: 'all',
    paymentStatus: 'all',
    checkInStatus: 'all',
    engagementLevel: 'all',
    registrationDate: 'all',
    tags: []
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'analytics'>('list')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAttendees()
  }, [])

  const loadAttendees = async () => {
    try {
      // Mock attendee data
      const mockAttendees: AttendeeProfile[] = [
        {
          id: 'attendee-1',
          email: 'sarah.johnson@techcorp.com',
          role: 'ATTENDEE',
          first_name: 'Sarah',
          last_name: 'Johnson',
          job_title: 'Senior Software Engineer',
          company: 'TechCorp Solutions',
          networking_available: true,
          privacy_level: 'PUBLIC',
          email_notifications: true,
          push_notifications: true,
          email_verified: true,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-03-10T14:30:00Z',
          registrationDate: '2024-01-15T10:00:00Z',
          ticketType: 'VIP Experience',
          paymentStatus: 'paid',
          checkInStatus: 'checked_in',
          checkInTime: '2024-03-15T08:30:00Z',
          sessionsAttended: ['session-1', 'session-2', 'session-3'],
          networkingConnections: 23,
          engagementScore: 87,
          lastActivity: '2024-03-15T16:45:00Z',
          preferences: {
            dietaryRestrictions: ['Vegetarian'],
            accessibility: [],
            interests: ['AI', 'Machine Learning', 'Healthcare'],
            communicationPreferences: {
              email: true,
              sms: false,
              push: true
            }
          },
          journey: [
            {
              id: 'journey-1',
              type: 'registration',
              timestamp: '2024-01-15T10:00:00Z',
              details: 'Registered for WECON Masawat 2024'
            },
            {
              id: 'journey-2',
              type: 'payment',
              timestamp: '2024-01-15T10:15:00Z',
              details: 'Payment completed - VIP Experience ticket'
            },
            {
              id: 'journey-3',
              type: 'check_in',
              timestamp: '2024-03-15T08:30:00Z',
              details: 'Checked in at main entrance'
            }
          ],
          tags: ['VIP', 'Early Bird', 'Tech Leader'],
          notes: 'Highly engaged attendee, interested in speaking opportunities',
          customFields: {
            emergencyContact: 'John Johnson - +1-555-0123',
            tshirtSize: 'M',
            specialRequests: 'None'
          }
        },
        {
          id: 'attendee-2',
          email: 'mike.chen@startup.io',
          role: 'ATTENDEE',
          first_name: 'Mike',
          last_name: 'Chen',
          job_title: 'CTO',
          company: 'InnovateLab',
          networking_available: true,
          privacy_level: 'ATTENDEES_ONLY',
          email_notifications: true,
          push_notifications: false,
          email_verified: true,
          created_at: '2024-02-01T14:20:00Z',
          updated_at: '2024-03-10T09:15:00Z',
          registrationDate: '2024-02-01T14:20:00Z',
          ticketType: 'Early Bird',
          paymentStatus: 'paid',
          checkInStatus: 'not_checked_in',
          sessionsAttended: [],
          networkingConnections: 8,
          engagementScore: 45,
          lastActivity: '2024-03-14T20:30:00Z',
          preferences: {
            dietaryRestrictions: [],
            accessibility: [],
            interests: ['Startups', 'Funding', 'Product Development'],
            communicationPreferences: {
              email: true,
              sms: true,
              push: false
            }
          },
          journey: [
            {
              id: 'journey-4',
              type: 'registration',
              timestamp: '2024-02-01T14:20:00Z',
              details: 'Registered for WECON Masawat 2024'
            },
            {
              id: 'journey-5',
              type: 'payment',
              timestamp: '2024-02-01T14:35:00Z',
              details: 'Payment completed - Early Bird ticket'
            }
          ],
          tags: ['Startup', 'CTO', 'First Time'],
          notes: 'New to the event, interested in networking',
          customFields: {
            emergencyContact: 'Lisa Chen - +1-555-0456',
            tshirtSize: 'L',
            specialRequests: 'Lactose intolerant'
          }
        }
      ]

      setAttendees(mockAttendees)
    } catch (error) {
      console.error('Error loading attendees:', error)
    } finally {
      setLoading(false)
    }
  }

  const bulkActions: BulkAction[] = [
    {
      id: 'send_email',
      name: 'Send Email',
      description: 'Send email to selected attendees',
      icon: Mail,
      action: (ids) => console.log('Send email to:', ids)
    },
    {
      id: 'send_sms',
      name: 'Send SMS',
      description: 'Send SMS to selected attendees',
      icon: MessageSquare,
      action: (ids) => console.log('Send SMS to:', ids)
    },
    {
      id: 'add_tag',
      name: 'Add Tag',
      description: 'Add tag to selected attendees',
      icon: Tag,
      action: (ids) => console.log('Add tag to:', ids)
    },
    {
      id: 'export_data',
      name: 'Export Data',
      description: 'Export attendee data',
      icon: Download,
      action: (ids) => console.log('Export data for:', ids)
    },
    {
      id: 'check_in',
      name: 'Bulk Check-in',
      description: 'Check in selected attendees',
      icon: CheckCircle,
      action: (ids) => console.log('Check in:', ids)
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400 bg-green-400/20'
      case 'pending': return 'text-yellow-400 bg-yellow-400/20'
      case 'failed': return 'text-red-400 bg-red-400/20'
      case 'refunded': return 'text-gray-400 bg-gray-400/20'
      case 'checked_in': return 'text-green-400 bg-green-400/20'
      case 'checked_out': return 'text-blue-400 bg-blue-400/20'
      case 'not_checked_in': return 'text-gray-400 bg-gray-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle
      case 'pending': return Clock
      case 'failed': return XCircle
      case 'refunded': return XCircle
      case 'checked_in': return CheckCircle
      case 'checked_out': return CheckCircle
      case 'not_checked_in': return AlertCircle
      default: return AlertCircle
    }
  }

  const getEngagementLevel = (score: number) => {
    if (score >= 80) return { level: 'High', color: 'text-green-400' }
    if (score >= 60) return { level: 'Medium', color: 'text-yellow-400' }
    if (score >= 40) return { level: 'Low', color: 'text-orange-400' }
    return { level: 'Very Low', color: 'text-red-400' }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = 
      attendee.first_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      attendee.last_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      attendee.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      attendee.company?.toLowerCase().includes(filters.search.toLowerCase())

    const matchesTicketType = filters.ticketType === 'all' || attendee.ticketType === filters.ticketType
    const matchesPaymentStatus = filters.paymentStatus === 'all' || attendee.paymentStatus === filters.paymentStatus
    const matchesCheckInStatus = filters.checkInStatus === 'all' || attendee.checkInStatus === filters.checkInStatus

    return matchesSearch && matchesTicketType && matchesPaymentStatus && matchesCheckInStatus
  })

  const handleSelectAttendee = (attendeeId: string) => {
    setSelectedAttendees(prev => 
      prev.includes(attendeeId) 
        ? prev.filter(id => id !== attendeeId)
        : [...prev, attendeeId]
    )
  }

  const handleSelectAll = () => {
    if (selectedAttendees.length === filteredAttendees.length) {
      setSelectedAttendees([])
    } else {
      setSelectedAttendees(filteredAttendees.map(a => a.id))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading attendee data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Attendee Relationship Management</h2>
          <p className="text-gray-400">Advanced search, bulk operations, and journey tracking</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'analytics' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <PieChart className="w-4 h-4" />
            </button>
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-secondary/20 text-secondary border border-secondary/30 rounded-lg hover:bg-secondary/30 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search attendees..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <select
            value={filters.ticketType}
            onChange={(e) => setFilters(prev => ({ ...prev, ticketType: e.target.value }))}
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="all">All Ticket Types</option>
            <option value="Early Bird">Early Bird</option>
            <option value="VIP Experience">VIP Experience</option>
            <option value="Student">Student</option>
            <option value="Standard">Standard</option>
          </select>

          <select
            value={filters.paymentStatus}
            onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="all">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            value={filters.checkInStatus}
            onChange={(e) => setFilters(prev => ({ ...prev, checkInStatus: e.target.value }))}
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="all">All Check-in Status</option>
            <option value="checked_in">Checked In</option>
            <option value="not_checked_in">Not Checked In</option>
            <option value="checked_out">Checked Out</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedAttendees.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-white font-medium">
                {selectedAttendees.length} attendee(s) selected
              </span>
              <button
                onClick={() => setSelectedAttendees([])}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              {bulkActions.slice(0, 3).map((action) => (
                <button
                  key={action.id}
                  onClick={() => action.action(selectedAttendees)}
                  className="flex items-center space-x-2 px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded text-sm hover:bg-primary/30 transition-colors"
                  title={action.description}
                >
                  <action.icon className="w-3 h-3" />
                  <span>{action.name}</span>
                </button>
              ))}
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Attendee List */}
      {viewMode === 'list' && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedAttendees.length === filteredAttendees.length && filteredAttendees.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Attendee</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Ticket Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Check-in</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Engagement</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredAttendees.map((attendee) => {
                  const PaymentIcon = getStatusIcon(attendee.paymentStatus)
                  const CheckInIcon = getStatusIcon(attendee.checkInStatus)
                  const engagement = getEngagementLevel(attendee.engagementScore)
                  
                  return (
                    <motion.tr
                      key={attendee.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedAttendees.includes(attendee.id)}
                          onChange={() => handleSelectAttendee(attendee.id)}
                          className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                            {attendee.first_name[0]}{attendee.last_name[0]}
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {attendee.first_name} {attendee.last_name}
                            </div>
                            <div className="text-gray-400 text-sm">{attendee.email}</div>
                            <div className="text-gray-500 text-xs">{attendee.company}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-400/20 text-blue-400 rounded-full text-xs">
                          {attendee.ticketType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(attendee.paymentStatus)}`}>
                          <PaymentIcon className="w-3 h-3" />
                          <span className="capitalize">{attendee.paymentStatus}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(attendee.checkInStatus)}`}>
                          <CheckInIcon className="w-3 h-3" />
                          <span className="capitalize">{attendee.checkInStatus.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className={`text-sm font-medium ${engagement.color}`}>
                            {engagement.level}
                          </div>
                          <div className="text-xs text-gray-500">({attendee.engagementScore})</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedAttendee(attendee)
                              setShowAttendeeDetails(true)
                            }}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-white transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-white transition-colors" title="Send Message">
                            <Mail className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics View */}
      {viewMode === 'analytics' && (
        <div className="space-y-6">
          <div className="text-center py-12">
            <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-white mb-2">Attendee Analytics</h4>
            <p className="text-gray-400">Advanced analytics and reporting coming soon</p>
          </div>
        </div>
      )}

      {/* Attendee Details Modal */}
      {showAttendeeDetails && selectedAttendee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-white/10 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  {selectedAttendee.first_name} {selectedAttendee.last_name}
                </h3>
                <button
                  onClick={() => setShowAttendeeDetails(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-4">Profile Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <p className="text-white">{selectedAttendee.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Company</label>
                        <p className="text-white">{selectedAttendee.company}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Job Title</label>
                        <p className="text-white">{selectedAttendee.job_title}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Registration Date</label>
                        <p className="text-white">{formatDateTime(selectedAttendee.registrationDate)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Journey Timeline */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-4">Journey Timeline</h4>
                    <div className="space-y-3">
                      {selectedAttendee.journey.map((event, index) => (
                        <div key={event.id} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-white text-sm">{event.details}</p>
                            <p className="text-gray-400 text-xs">{formatDateTime(event.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-4">Quick Stats</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sessions Attended</span>
                        <span className="text-white">{selectedAttendee.sessionsAttended.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Connections</span>
                        <span className="text-white">{selectedAttendee.networkingConnections}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Engagement Score</span>
                        <span className="text-white">{selectedAttendee.engagementScore}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-4">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAttendee.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors">
                      <Mail className="w-4 h-4" />
                      <span>Send Email</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-secondary/20 text-secondary border border-secondary/30 rounded-lg hover:bg-secondary/30 transition-colors">
                      <Edit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
