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
  Clock,
  Users,
  MapPin,
  Mic,
  Star,
  Upload,
  Download,
  Search,
  Filter,
  Settings,
  Eye,
  Copy,
  Move,
  GripVertical,
  FileText,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  Award,
  Building,
  Globe,
  Mail,
  Phone,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  XCircle,
  Zap,
  Target,
  TrendingUp,
  DollarSign
} from 'lucide-react'

interface Session {
  id: string
  title: string
  description: string
  type: 'keynote' | 'workshop' | 'panel' | 'networking' | 'break'
  track: string
  startTime: string
  endTime: string
  duration: number
  venue: string
  capacity: number
  speakers: Speaker[]
  materials: SessionMaterial[]
  status: 'draft' | 'published' | 'live' | 'completed'
  tags: string[]
  level: 'beginner' | 'intermediate' | 'advanced'
  language: string
  recordingEnabled: boolean
  liveStreamEnabled: boolean
}

interface Speaker {
  id: string
  firstName: string
  lastName: string
  title: string
  company: string
  bio: string
  avatar?: string
  email: string
  phone?: string
  website?: string
  social: {
    twitter?: string
    linkedin?: string
    instagram?: string
    facebook?: string
    youtube?: string
    github?: string
  }
  expertise: string[]
  sessions: string[]
  status: 'pending' | 'confirmed' | 'declined'
  travelRequired: boolean
  accommodationRequired: boolean
  speakerFee?: number
  notes?: string
}

interface SessionMaterial {
  id: string
  name: string
  type: 'presentation' | 'document' | 'video' | 'audio' | 'link' | 'image'
  url: string
  size?: string
  uploadDate: string
  isPublic: boolean
  downloadCount: number
}

interface Sponsor {
  id: string
  name: string
  tier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'startup'
  logo: string
  website: string
  description: string
  contactPerson: {
    name: string
    email: string
    phone: string
    title: string
  }
  benefits: string[]
  sponsorshipValue: number
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled'
  materials: {
    booth?: {
      size: string
      location: string
      requirements: string[]
    }
    marketing: {
      logoUsage: boolean
      websiteListing: boolean
      emailMention: boolean
      socialMedia: boolean
    }
    speaking?: {
      keynoteSlots: number
      panelSlots: number
      workshopSlots: number
    }
  }
  contractSigned: boolean
  paymentReceived: boolean
  notes?: string
}

interface Track {
  id: string
  name: string
  description: string
  color: string
  venue: string
  sessions: string[]
}

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState('agenda')
  const [eventId, setEventId] = useState<string | number | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null)
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null)
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [showSpeakerForm, setShowSpeakerForm] = useState(false)
  const [showSponsorForm, setShowSponsorForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [loading, setLoading] = useState(true)

  // Session form state (minimal CRUD wired to Supabase)
  const [sessionForm, setSessionForm] = useState<{ id?: string | number; title: string; description: string; type: Session['type']; track?: string; start: string; end: string; venue?: string; capacity?: number }>({
    title: '', description: '', type: 'keynote', start: '', end: ''
  })

  useEffect(() => {
    loadContentData()
  }, [])

  const loadContentData = async () => {
    try {
      // Load events and pick first as context for sessions
      const { api } = await import('@/lib/supabase')
      const events: any[] = await api.getEvents()
      if (events && events.length > 0) {
        setEventId(events[0].id)
        try {
          const realSessions: any[] = await api.getEventSessions(events[0].id)
          // Normalize to local Session shape
          const normalized: Session[] = realSessions.map((s: any) => ({
            id: s.id,
            title: s.title ?? s.name ?? 'Untitled Session',
            description: s.description ?? '',
            type: (s.session_type?.toLowerCase?.() ?? 'keynote') as Session['type'],
            track: s.track ?? '',
            startTime: s.start_time ?? s.start ?? s.startDate ?? s.start_date,
            endTime: s.end_time ?? s.end ?? s.endDate ?? s.end_date,
            duration: s.duration_minutes ?? s.duration ?? 60,
            venue: s.room_name ?? s.venue ?? '',
            capacity: s.room_capacity ?? s.max_attendees ?? 0,
            speakers: [],
            materials: [],
            status: (s.status?.toLowerCase?.() ?? 'draft') as Session['status'],
            tags: [],
            level: (s.difficulty_level?.toLowerCase?.() ?? 'beginner') as Session['level'],
            language: s.language ?? 'English',
            recordingEnabled: s.recording_enabled ?? !!s.recording_url,
            liveStreamEnabled: s.live_stream_enabled ?? !!s.live_stream_url,
          }))
          setSessions(normalized)
        } catch (e) {
          console.warn('Sessions load failed; falling back to mock for now:', e)
        }
      }

      // Mock tracks
      const mockTracks: Track[] = [
        {
          id: 'track-1',
          name: 'AI & Machine Learning',
          description: 'Latest developments in artificial intelligence and machine learning',
          color: '#764DF0',
          venue: 'Main Hall',
          sessions: ['session-1', 'session-2']
        },
        {
          id: 'track-2',
          name: 'Web Development',
          description: 'Modern web development technologies and frameworks',
          color: '#442490',
          venue: 'Tech Theater',
          sessions: ['session-3']
        }
      ]

      // Mock sessions
      const mockSessions: Session[] = [
        {
          id: 'session-1',
          title: 'The Future of AI in Healthcare',
          description: 'Exploring how artificial intelligence is revolutionizing healthcare delivery and patient outcomes.',
          type: 'keynote',
          track: 'track-1',
          startTime: '2024-03-15T09:00:00Z',
          endTime: '2024-03-15T10:00:00Z',
          duration: 60,
          venue: 'Main Hall',
          capacity: 500,
          speakers: [],
          materials: [],
          status: 'published',
          tags: ['AI', 'Healthcare', 'Innovation'],
          level: 'intermediate',
          language: 'English',
          recordingEnabled: true,
          liveStreamEnabled: true
        },
        {
          id: 'session-2',
          title: 'Building Scalable ML Pipelines',
          description: 'Best practices for creating robust and scalable machine learning pipelines in production.',
          type: 'workshop',
          track: 'track-1',
          startTime: '2024-03-15T11:00:00Z',
          endTime: '2024-03-15T12:30:00Z',
          duration: 90,
          venue: 'Workshop Room A',
          capacity: 50,
          speakers: [],
          materials: [],
          status: 'draft',
          tags: ['ML', 'DevOps', 'Scalability'],
          level: 'advanced',
          language: 'English',
          recordingEnabled: true,
          liveStreamEnabled: false
        }
      ]

      // Mock speakers
      const mockSpeakers: Speaker[] = [
        {
          id: 'speaker-1',
          firstName: 'Dr. Sarah',
          lastName: 'Chen',
          title: 'Chief AI Officer',
          company: 'HealthTech Innovations',
          bio: 'Dr. Sarah Chen is a leading expert in AI applications for healthcare with over 15 years of experience in machine learning and medical technology.',
          avatar: '/speakers/sarah-chen.jpg',
          email: 'sarah.chen@healthtech.com',
          phone: '+1-555-0123',
          website: 'https://sarahchen.ai',
          social: {
            twitter: '@sarahchen_ai',
            linkedin: 'sarah-chen-ai',
            instagram: 'sarahchen.ai'
          },
          expertise: ['Artificial Intelligence', 'Healthcare Technology', 'Machine Learning', 'Medical Imaging'],
          sessions: ['session-1'],
          status: 'confirmed',
          travelRequired: true,
          accommodationRequired: true,
          speakerFee: 5000,
          notes: 'Requires vegetarian meals and early check-in'
        },
        {
          id: 'speaker-2',
          firstName: 'Michael',
          lastName: 'Rodriguez',
          title: 'Senior ML Engineer',
          company: 'DataFlow Systems',
          bio: 'Michael Rodriguez specializes in building production-ready machine learning systems and has led ML infrastructure teams at several Fortune 500 companies.',
          avatar: '/speakers/michael-rodriguez.jpg',
          email: 'michael@dataflow.com',
          social: {
            linkedin: 'michael-rodriguez-ml',
            github: 'mrodriguez-ml'
          },
          expertise: ['MLOps', 'Data Engineering', 'Kubernetes', 'Python'],
          sessions: ['session-2'],
          status: 'confirmed',
          travelRequired: false,
          accommodationRequired: false,
          notes: 'Local speaker, no travel required'
        }
      ]

      // Mock sponsors
      const mockSponsors: Sponsor[] = [
        {
          id: 'sponsor-1',
          name: 'TechCorp Global',
          tier: 'platinum',
          logo: '/sponsors/techcorp-logo.png',
          website: 'https://techcorp.com',
          description: 'Leading technology solutions provider specializing in enterprise software and cloud infrastructure.',
          contactPerson: {
            name: 'Jennifer Walsh',
            email: 'jennifer.walsh@techcorp.com',
            phone: '+1-555-0456',
            title: 'Director of Marketing'
          },
          benefits: [
            'Keynote speaking slot',
            'Premium booth location',
            'Logo on all materials',
            'VIP networking access',
            'Social media promotion'
          ],
          sponsorshipValue: 50000,
          status: 'confirmed',
          materials: {
            booth: {
              size: '20x20',
              location: 'Main Entrance',
              requirements: ['Power outlets', 'Internet connection', 'Display screens']
            },
            marketing: {
              logoUsage: true,
              websiteListing: true,
              emailMention: true,
              socialMedia: true
            },
            speaking: {
              keynoteSlots: 1,
              panelSlots: 2,
              workshopSlots: 1
            }
          },
          contractSigned: true,
          paymentReceived: true
        },
        {
          id: 'sponsor-2',
          name: 'InnovateLab',
          tier: 'gold',
          logo: '/sponsors/innovatelab-logo.png',
          website: 'https://innovatelab.io',
          description: 'Startup accelerator and innovation hub supporting emerging technology companies.',
          contactPerson: {
            name: 'David Kim',
            email: 'david@innovatelab.io',
            phone: '+1-555-0789',
            title: 'Partnership Manager'
          },
          benefits: [
            'Workshop speaking slot',

            'Standard booth space',
            'Logo on website',
            'Networking access'
          ],
          sponsorshipValue: 25000,
          status: 'pending',
          materials: {
            booth: {
              size: '10x10',
              location: 'Innovation Zone',
              requirements: ['Power outlets', 'Internet connection']
            },
            marketing: {
              logoUsage: true,
              websiteListing: true,
              emailMention: false,
              socialMedia: true
            },
            speaking: {
              keynoteSlots: 0,
              panelSlots: 1,
              workshopSlots: 1
            }
          },
          contractSigned: false,
          paymentReceived: false,
          notes: 'Waiting for contract signature'
        }
      ]

      setTracks(mockTracks)
      setSessions(mockSessions)
      setSpeakers(mockSpeakers)
      setSponsors(mockSponsors)
    } catch (error) {
      console.error('Error loading content data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'keynote': return 'text-purple-400 bg-purple-400/20'
      case 'workshop': return 'text-blue-400 bg-blue-400/20'
      case 'panel': return 'text-green-400 bg-green-400/20'
      case 'networking': return 'text-orange-400 bg-orange-400/20'
      case 'break': return 'text-gray-400 bg-gray-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-400 bg-gray-400/20'
      case 'published': return 'text-blue-400 bg-blue-400/20'
      case 'confirmed': return 'text-green-400 bg-green-400/20'
      case 'pending': return 'text-yellow-400 bg-yellow-400/20'
      case 'declined': return 'text-red-400 bg-red-400/20'
      case 'cancelled': return 'text-red-400 bg-red-400/20'
      case 'paid': return 'text-green-400 bg-green-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return CheckCircle
      case 'pending': return AlertCircle
      case 'declined': return XCircle
      case 'cancelled': return XCircle
      case 'paid': return CheckCircle
      default: return Settings
    }
  }

  const getSponsorTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'text-purple-400 bg-purple-400/20'
      case 'gold': return 'text-yellow-400 bg-yellow-400/20'
      case 'silver': return 'text-gray-400 bg-gray-400/20'
      case 'bronze': return 'text-orange-400 bg-orange-400/20'
      case 'startup': return 'text-green-400 bg-green-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  async function handleSaveSession() {
    try {
      const { api } = await import('@/lib/supabase')
      if (!eventId) {
        alert('No event selected for sessions')
        return
      }
      const payload: any = {
        title: sessionForm.title,
        description: sessionForm.description,
        session_type: sessionForm.type.toUpperCase(),
        start_time: sessionForm.start ? new Date(sessionForm.start).toISOString() : undefined,
        end_time: sessionForm.end ? new Date(sessionForm.end).toISOString() : undefined,
        room_name: sessionForm.venue,
        room_capacity: sessionForm.capacity,
        track: sessionForm.track,
      }
      if (selectedSession) {
        await api.updateSession(sessionForm.id!, payload)
      } else {
        await api.createSession({ event_id: eventId, ...payload })
      }
      // Reload
      const real = await api.getEventSessions(eventId)
      const normalized: Session[] = real.map((s: any) => ({
        id: s.id,
        title: s.title ?? s.name ?? 'Untitled Session',
        description: s.description ?? '',
        type: (s.session_type?.toLowerCase?.() ?? 'keynote') as Session['type'],
        track: s.track ?? '',
        startTime: s.start_time ?? s.start ?? s.startDate ?? s.start_date,
        endTime: s.end_time ?? s.end ?? s.endDate ?? s.end_date,
        duration: s.duration_minutes ?? s.duration ?? 60,
        venue: s.room_name ?? s.venue ?? '',
        capacity: s.room_capacity ?? s.max_attendees ?? 0,
        speakers: [],
        materials: [],
        status: (s.status?.toLowerCase?.() ?? 'draft') as Session['status'],
        tags: [],
        level: (s.difficulty_level?.toLowerCase?.() ?? 'beginner') as Session['level'],
        language: s.language ?? 'English',
        recordingEnabled: s.recording_enabled ?? !!s.recording_url,
        liveStreamEnabled: s.live_stream_enabled ?? !!s.live_stream_url,
      }))
      setSessions(normalized)
      setShowSessionForm(false)
    } catch (e) {
      alert('Failed to save session')
      console.error(e)
    }
  }


  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading content management...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Content Management System</h2>
          <p className="text-gray-400">Drag-and-drop agenda builder, speaker portal, and sponsor management</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-secondary/20 text-secondary border border-secondary/30 rounded-lg hover:bg-secondary/30 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => {
              if (activeTab === 'agenda') {
                setSelectedSession(null)
                setSessionForm({ title: '', description: '', type: 'keynote', start: '', end: '', venue: '', capacity: 0 })
                setShowSessionForm(true)
              } else if (activeTab === 'speakers') setShowSpeakerForm(true)
              else if (activeTab === 'sponsors') setShowSponsorForm(true)
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>
              {activeTab === 'agenda' && 'Add Session'}
              {activeTab === 'speakers' && 'Add Speaker'}
              {activeTab === 'sponsors' && 'Add Sponsor'}
            </span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1 mb-6">
          {[
            { id: 'agenda', label: 'Agenda Builder', icon: Calendar, count: sessions.length },
            { id: 'speakers', label: 'Speaker Portal', icon: Mic, count: speakers.length },
            { id: 'sponsors', label: 'Sponsor Management', icon: Building, count: sponsors.length },
            { id: 'materials', label: 'Materials', icon: FileText, count: 0 }
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
              {tab.count > 0 && (
                <span className="bg-primary/50 text-white text-xs rounded-full px-2 py-0.5">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Agenda Builder Tab */}
        {activeTab === 'agenda' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              >
                <option value="all">All Types</option>
                <option value="keynote">Keynote</option>
                <option value="workshop">Workshop</option>
                <option value="panel">Panel</option>
                <option value="networking">Networking</option>
                <option value="break">Break</option>
              </select>

              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
              </div>
            </div>

            {/* Sessions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden hover:border-primary/30 transition-colors"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getSessionTypeColor(session.type)}`}>
                            <span className="capitalize">{session.type}</span>
                          </div>
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(session.status)}`}>
                            <span className="capitalize">{session.status}</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">{session.title}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2">{session.description}</p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <GripVertical className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{formatDateTime(session.startTime)} - {formatDateTime(session.endTime)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{session.venue}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>Capacity: {session.capacity}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {session.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedSession(session)
                            setSessionForm({
                              id: session.id,
                              title: session.title,
                              description: session.description,
                              type: session.type,
                              start: session.startTime?.slice(0,16) || '',
                              end: session.endTime?.slice(0,16) || '',
                              venue: session.venue,
                              capacity: session.capacity,
                            })
                            setShowSessionForm(true)
                          }}
                          className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded text-sm hover:bg-primary/30 transition-colors"
                        >
                          Edit
                        </button>
                        <button className="p-1 text-gray-400 hover:text-white transition-colors" title="Duplicate">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-white transition-colors" title="Move">
                          <Move className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete"
                          onClick={async () => {
                            if (!confirm('Delete this session?')) return
                            try {
                              const { api } = await import('@/lib/supabase')
                              await api.deleteSession(session.id)
                              // reload sessions
                              if (eventId != null) {
                                const real = await api.getEventSessions(eventId)
                                const normalized: Session[] = real.map((s: any) => ({
                                  id: s.id,
                                  title: s.title ?? s.name ?? 'Untitled Session',
                                  description: s.description ?? '',
                                  type: (s.session_type?.toLowerCase?.() ?? 'keynote') as Session['type'],
                                  track: s.track ?? '',
                                  startTime: s.start_time ?? s.start ?? s.startDate ?? s.start_date,
                                  endTime: s.end_time ?? s.end ?? s.endDate ?? s.end_date,
                                  duration: s.duration_minutes ?? s.duration ?? 60,
                                  venue: s.room_name ?? s.venue ?? '',
                                  capacity: s.room_capacity ?? s.max_attendees ?? 0,
                                  speakers: [],
                                  materials: [],
                                  status: (s.status?.toLowerCase?.() ?? 'draft') as Session['status'],
                                  tags: [],
                                  level: (s.difficulty_level?.toLowerCase?.() ?? 'beginner') as Session['level'],
                                  language: s.language ?? 'English',
                                  recordingEnabled: s.recording_enabled ?? !!s.recording_url,
                                  liveStreamEnabled: s.live_stream_enabled ?? !!s.live_stream_url,
                                }))
                                setSessions(normalized)
                              }
                            } catch (e) {
                              alert('Failed to delete')
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        {session.recordingEnabled && <Video className="w-3 h-3" />}
                        {session.liveStreamEnabled && <Zap className="w-3 h-3" />}
                        <span>{session.duration}min</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Speaker Portal Tab */}
        {activeTab === 'speakers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {speakers.map((speaker) => {
                const StatusIcon = getStatusIcon(speaker.status)

                return (
                  <motion.div
                    key={speaker.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden hover:border-primary/30 transition-colors"
                  >
                    <div className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                          {speaker.firstName[0]}{speaker.lastName[0]}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">
                            {speaker.firstName} {speaker.lastName}
                          </h3>
                          <p className="text-gray-400 text-sm">{speaker.title}</p>
                          <p className="text-gray-500 text-sm">{speaker.company}</p>
                          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs mt-2 ${getStatusColor(speaker.status)}`}>
                            <StatusIcon className="w-3 h-3" />
                            <span className="capitalize">{speaker.status}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm line-clamp-3 mb-4">{speaker.bio}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span>{speaker.email}</span>
                        </div>
                        {speaker.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <Phone className="w-4 h-4" />
                            <span>{speaker.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{speaker.sessions.length} session(s)</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {speaker.expertise.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {speaker.expertise.length > 3 && (
                          <span className="px-2 py-1 bg-gray-400/20 text-gray-400 text-xs rounded-full">
                            +{speaker.expertise.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedSpeaker(speaker)}
                            className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded text-sm hover:bg-primary/30 transition-colors"
                          >
                            Edit
                          </button>
                          <button className="p-1 text-gray-400 hover:text-white transition-colors" title="Contact">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-white transition-colors" title="View Profile">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-1">
                          {speaker.social.twitter && (
                            <a href={`https://twitter.com/${speaker.social.twitter}`} target="_blank" rel="noopener noreferrer" className="p-1 text-gray-400 hover:text-blue-400 transition-colors">
                              <Twitter className="w-3 h-3" />
                            </a>
                          )}
                          {speaker.social.linkedin && (
                            <a href={`https://linkedin.com/in/${speaker.social.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                              <Linkedin className="w-3 h-3" />
                            </a>
                          )}
                          {speaker.website && (
                            <a href={speaker.website} target="_blank" rel="noopener noreferrer" className="p-1 text-gray-400 hover:text-white transition-colors">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Sponsor Management Tab */}
        {activeTab === 'sponsors' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sponsors.map((sponsor) => {
                const StatusIcon = getStatusIcon(sponsor.status)

                return (
                  <motion.div
                    key={sponsor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden hover:border-primary/30 transition-colors"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                            <Building className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{sponsor.name}</h3>
                            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getSponsorTierColor(sponsor.tier)}`}>
                              <Star className="w-3 h-3" />
                              <span className="capitalize">{sponsor.tier}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(sponsor.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span className="capitalize">{sponsor.status}</span>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">{sponsor.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <DollarSign className="w-4 h-4" />
                          <span>Value: {formatCurrency(sponsor.sponsorshipValue)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>Contact: {sponsor.contactPerson.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span>{sponsor.contactPerson.email}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {sponsor.benefits.slice(0, 3).map((benefit, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-400/20 text-green-400 text-xs rounded-full"
                          >
                            {benefit}
                          </span>
                        ))}
                        {sponsor.benefits.length > 3 && (
                          <span className="px-2 py-1 bg-gray-400/20 text-gray-400 text-xs rounded-full">
                            +{sponsor.benefits.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedSponsor(sponsor)}
                            className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded text-sm hover:bg-primary/30 transition-colors"
                          >
                            Manage
                          </button>
                          <button className="p-1 text-gray-400 hover:text-white transition-colors" title="Contact">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-white transition-colors" title="View Website">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-2 text-xs">
                          {sponsor.contractSigned && (
                            <div className="flex items-center space-x-1 text-green-400">
                              <CheckCircle className="w-3 h-3" />
                              <span>Contract</span>
                            </div>
                          )}
                          {sponsor.paymentReceived && (
                            <div className="flex items-center space-x-1 text-green-400">
                              <DollarSign className="w-3 h-3" />
                              <span>Paid</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-white mb-2">Materials Management</h4>
              <p className="text-gray-400">Session materials and resource management coming soon</p>
            </div>
          </div>
        )}
      </div>

      {showSessionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background border border-white/10 rounded-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg text-white font-semibold">{selectedSession ? 'Edit Session' : 'Add Session'}</h3>
              <button onClick={() => setShowSessionForm(false)} className="p-2 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form
              onSubmit={async (e) => { e.preventDefault(); await handleSaveSession(); }}
              className="p-4 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Title</label>
                  <input value={sessionForm.title} onChange={(e)=>setSessionForm(f=>({...f,title:e.target.value}))} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Type</label>
                  <select value={sessionForm.type} onChange={(e)=>setSessionForm(f=>({...f,type:e.target.value as any}))} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white">
                    <option value="keynote">Keynote</option>
                    <option value="workshop">Workshop</option>
                    <option value="panel">Panel</option>
                    <option value="networking">Networking</option>
                    <option value="break">Break</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Start</label>
                  <input type="datetime-local" value={sessionForm.start} onChange={(e)=>setSessionForm(f=>({...f,start:e.target.value}))} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">End</label>
                  <input type="datetime-local" value={sessionForm.end} onChange={(e)=>setSessionForm(f=>({...f,end:e.target.value}))} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Venue</label>
                  <input value={sessionForm.venue || ''} onChange={(e)=>setSessionForm(f=>({...f,venue:e.target.value}))} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Capacity</label>
                  <input type="number" value={sessionForm.capacity || 0} onChange={(e)=>setSessionForm(f=>({...f,capacity:parseInt(e.target.value||'0',10)}))} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Description</label>
                  <textarea value={sessionForm.description} onChange={(e)=>setSessionForm(f=>({...f,description:e.target.value}))} rows={3} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={()=>setShowSessionForm(false)} className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 flex items-center gap-2">
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
