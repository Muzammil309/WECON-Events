'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  MessageCircle, 
  Calendar,
  MapPin,
  Briefcase,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Video,
  Phone,
  Coffee,
  Star,
  Heart,
  MoreVertical
} from 'lucide-react'
import { User, Connection, Meeting, api } from '@/lib/supabase'

interface NetworkingSystemProps {
  currentUser: User
  connections: Connection[]
  onConnectionUpdate: () => void
}

export default function NetworkingSystem({ 
  currentUser, 
  connections, 
  onConnectionUpdate 
}: NetworkingSystemProps) {
  const [activeTab, setActiveTab] = useState('directory')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterIndustry, setFilterIndustry] = useState('all')
  const [attendees, setAttendees] = useState<User[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [connectionMessage, setConnectionMessage] = useState('')
  const [showMeetingScheduler, setShowMeetingScheduler] = useState(false)

  // Load attendees directory
  useEffect(() => {
    loadAttendees()
    loadMeetings()
  }, [])

  const loadAttendees = async () => {
    setLoading(true)
    try {
      // TODO: Implement attendees directory API
      // For now, using mock data
      const mockAttendees: User[] = [
        {
          id: '1',
          email: 'sarah.chen@techcorp.com',
          role: 'ATTENDEE',
          first_name: 'Sarah',
          last_name: 'Chen',
          job_title: 'Senior Software Engineer',
          company: 'TechCorp',
          industry: 'Technology',
          location: 'San Francisco, CA',
          bio: 'Passionate about AI and machine learning. Building the future of healthcare technology.',
          networking_available: true,
          privacy_level: 'PUBLIC',
          email_notifications: true,
          push_notifications: true,
          email_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          email: 'mike.johnson@startup.io',
          role: 'ATTENDEE',
          first_name: 'Mike',
          last_name: 'Johnson',
          job_title: 'Product Manager',
          company: 'StartupIO',
          industry: 'Technology',
          location: 'New York, NY',
          bio: 'Product leader focused on user experience and growth. Love connecting with fellow innovators.',
          networking_available: true,
          privacy_level: 'PUBLIC',
          email_notifications: true,
          push_notifications: true,
          email_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      setAttendees(mockAttendees)
    } catch (error) {
      console.error('Error loading attendees:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMeetings = async () => {
    try {
      // TODO: Implement meetings API
      // For now, using mock data
      const mockMeetings: Meeting[] = [
        {
          id: '1',
          event_id: 'wecon-masawat-2024',
          organizer_id: currentUser.id,
          participant_id: '1',
          title: 'Coffee Chat about AI in Healthcare',
          description: 'Discuss latest trends in AI applications for healthcare',
          start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
          duration_minutes: 30,
          location: 'Coffee Corner, Level 2',
          status: 'SCHEDULED',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      setMeetings(mockMeetings)
    } catch (error) {
      console.error('Error loading meetings:', error)
    }
  }

  const sendConnectionRequest = async (recipientId: string) => {
    try {
      await api.sendConnectionRequest(currentUser.id, recipientId, connectionMessage)
      setConnectionMessage('')
      setSelectedUser(null)
      onConnectionUpdate()
    } catch (error) {
      console.error('Error sending connection request:', error)
    }
  }

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = 
      attendee.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.job_title?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesIndustry = filterIndustry === 'all' || attendee.industry === filterIndustry
    
    return matchesSearch && matchesIndustry && attendee.id !== currentUser.id
  })

  const getConnectionStatus = (userId: string) => {
    return connections.find(conn => 
      (conn.requester_id === userId || conn.recipient_id === userId) &&
      (conn.requester_id === currentUser.id || conn.recipient_id === currentUser.id)
    )
  }

  const tabs = [
    { id: 'directory', label: 'Attendee Directory', icon: Users },
    { id: 'connections', label: 'My Connections', icon: UserPlus },
    { id: 'meetings', label: 'Scheduled Meetings', icon: Calendar },
    { id: 'requests', label: 'Connection Requests', icon: MessageCircle }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4">Networking Hub</h2>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
          {tabs.map((tab) => (
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
      </div>

      {/* Attendee Directory */}
      {activeTab === 'directory' && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search attendees by name, company, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <select
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="all">All Industries</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
            </select>
          </div>

          {/* Attendees Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAttendees.map((attendee) => {
              const connectionStatus = getConnectionStatus(attendee.id)
              
              return (
                <motion.div
                  key={attendee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {attendee.first_name[0]}{attendee.last_name[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {attendee.first_name} {attendee.last_name}
                        </h3>
                        <p className="text-sm text-gray-400">{attendee.job_title}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Briefcase className="w-3 h-3" />
                      <span>{attendee.company}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span>{attendee.location}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                    {attendee.bio}
                  </p>

                  <div className="flex space-x-2">
                    {!connectionStatus ? (
                      <button
                        onClick={() => setSelectedUser(attendee)}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Connect</span>
                      </button>
                    ) : (
                      <div className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg ${
                        connectionStatus.status === 'ACCEPTED' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : connectionStatus.status === 'PENDING'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {connectionStatus.status === 'ACCEPTED' && <CheckCircle className="w-4 h-4" />}
                        {connectionStatus.status === 'PENDING' && <Clock className="w-4 h-4" />}
                        {connectionStatus.status === 'DECLINED' && <XCircle className="w-4 h-4" />}
                        <span>
                          {connectionStatus.status === 'ACCEPTED' ? 'Connected' : 
                           connectionStatus.status === 'PENDING' ? 'Pending' : 'Declined'}
                        </span>
                      </div>
                    )}
                    
                    {connectionStatus?.status === 'ACCEPTED' && (
                      <button
                        onClick={() => {
                          setSelectedUser(attendee)
                          setShowMeetingScheduler(true)
                        }}
                        className="px-3 py-2 bg-secondary/20 text-secondary border border-secondary/30 rounded-lg hover:bg-secondary/30 transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* My Connections */}
      {activeTab === 'connections' && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">My Connections</h3>
          <div className="space-y-4">
            {connections.filter(conn => conn.status === 'ACCEPTED').map((connection) => {
              const otherUserId = connection.requester_id === currentUser.id
                ? connection.recipient_id
                : connection.requester_id

              // In a real app, you would fetch the user details by ID
              const otherUser = {
                first_name: 'User',
                last_name: otherUserId.slice(-4),
                job_title: 'Event Attendee',
                company: 'WECON'
              }

              return (
                <div key={connection.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                      {otherUser?.first_name?.[0]}{otherUser?.last_name?.[0]}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">
                        {otherUser?.first_name} {otherUser?.last_name}
                      </h4>
                      <p className="text-sm text-gray-400">{otherUser?.job_title} at {otherUser?.company}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-secondary/20 text-secondary rounded-lg hover:bg-secondary/30 transition-colors">
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Connection Request Modal */}
      {selectedUser && !showMeetingScheduler && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background border border-white/20 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Connect with {selectedUser.first_name} {selectedUser.last_name}
            </h3>
            <textarea
              value={connectionMessage}
              onChange={(e) => setConnectionMessage(e.target.value)}
              placeholder="Add a personal message (optional)..."
              rows={3}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors resize-none mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => sendConnectionRequest(selectedUser.id)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send Request</span>
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
