'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  Plus, 
  Minus,
  Filter,
  Search,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle,
  Heart,
  BookOpen,
  Video,
  Coffee,
  Mic,
  Award,
  Zap
} from 'lucide-react'
import { Session, User } from '@/lib/supabase'

interface AgendaBuilderProps {
  currentUser: User
  sessions: Session[]
  userSessions: Session[]
  onSessionToggle: (sessionId: string, add: boolean) => void
}

export default function AgendaBuilder({ 
  currentUser, 
  sessions, 
  userSessions,
  onSessionToggle 
}: AgendaBuilderProps) {
  const [activeTab, setActiveTab] = useState('browse')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTrack, setFilterTrack] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const [selectedDay, setSelectedDay] = useState('all')
  const [conflicts, setConflicts] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  // Mock session data with enhanced details
  const mockSessions: Session[] = [
    {
      id: '1',
      event_id: 'wecon-masawat-2024',
      title: 'The Future of AI in Healthcare',
      description: 'Explore how artificial intelligence is revolutionizing healthcare delivery, from diagnostic tools to personalized treatment plans.',
      abstract: 'This session will cover the latest developments in AI-powered healthcare solutions, including machine learning algorithms for medical imaging, natural language processing for clinical documentation, and predictive analytics for patient outcomes.',
      session_type: 'KEYNOTE',
      track: 'Healthcare Innovation',
      difficulty_level: 2,
      start_time: '2024-12-15T09:00:00Z',
      end_time: '2024-12-15T10:00:00Z',
      room_id: 'main-hall',
      max_attendees: 500,
      current_attendees: 247,
      requires_registration: false,
      virtual_url: 'https://zoom.us/j/123456789',
      slides_url: 'https://example.com/slides/ai-healthcare.pdf',
      qa_enabled: true,
      chat_enabled: true,
      polling_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      event_id: 'wecon-masawat-2024',
      title: 'Building Scalable Microservices',
      description: 'Learn best practices for designing and implementing microservices architecture that can scale to millions of users.',
      abstract: 'This hands-on workshop will guide you through the process of breaking down monolithic applications into microservices, implementing proper service communication patterns, and ensuring system reliability at scale.',
      session_type: 'WORKSHOP',
      track: 'Software Architecture',
      difficulty_level: 4,
      start_time: '2024-12-15T10:30:00Z',
      end_time: '2024-12-15T12:00:00Z',
      room_id: 'workshop-a',
      max_attendees: 50,
      current_attendees: 42,
      requires_registration: true,
      slides_url: 'https://example.com/slides/microservices.pdf',
      qa_enabled: true,
      chat_enabled: true,
      polling_enabled: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      event_id: 'wecon-masawat-2024',
      title: 'Sustainable Technology Panel',
      description: 'Industry leaders discuss the role of technology in creating a more sustainable future.',
      abstract: 'Join our panel of experts as they explore how emerging technologies can address climate change, reduce environmental impact, and create sustainable business models for the future.',
      session_type: 'PANEL',
      track: 'Sustainability',
      difficulty_level: 1,
      start_time: '2024-12-15T14:00:00Z',
      end_time: '2024-12-15T15:00:00Z',
      room_id: 'conference-b',
      max_attendees: 200,
      current_attendees: 156,
      requires_registration: false,
      qa_enabled: true,
      chat_enabled: true,
      polling_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  useEffect(() => {
    // Check for scheduling conflicts
    checkConflicts()
  }, [userSessions])

  const checkConflicts = () => {
    const conflictingSessions: string[] = []
    
    for (let i = 0; i < userSessions.length; i++) {
      for (let j = i + 1; j < userSessions.length; j++) {
        const session1 = userSessions[i]
        const session2 = userSessions[j]
        
        const start1 = new Date(session1.start_time)
        const end1 = new Date(session1.end_time)
        const start2 = new Date(session2.start_time)
        const end2 = new Date(session2.end_time)
        
        if ((start1 < end2 && end1 > start2)) {
          conflictingSessions.push(session1.id, session2.id)
        }
      }
    }
    
    setConflicts([...new Set(conflictingSessions)])
  }

  const filteredSessions = mockSessions.filter(session => {
    const matchesSearch = 
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.track?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTrack = filterTrack === 'all' || session.track === filterTrack
    const matchesType = filterType === 'all' || session.session_type === filterType
    const matchesDifficulty = filterDifficulty === 'all' || session.difficulty_level?.toString() === filterDifficulty
    
    return matchesSearch && matchesTrack && matchesType && matchesDifficulty
  })

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'KEYNOTE': return Award
      case 'WORKSHOP': return BookOpen
      case 'PANEL': return Users
      case 'NETWORKING': return Coffee
      case 'VIRTUAL': return Video
      default: return Mic
    }
  }

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'KEYNOTE': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30'
      case 'WORKSHOP': return 'text-blue-400 bg-blue-400/20 border-blue-400/30'
      case 'PANEL': return 'text-green-400 bg-green-400/20 border-green-400/30'
      case 'NETWORKING': return 'text-purple-400 bg-purple-400/20 border-purple-400/30'
      case 'VIRTUAL': return 'text-pink-400 bg-pink-400/20 border-pink-400/30'
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30'
    }
  }

  const getDifficultyLabel = (level?: number) => {
    switch (level) {
      case 1: return 'Beginner'
      case 2: return 'Intermediate'
      case 3: return 'Advanced'
      case 4: return 'Expert'
      case 5: return 'Master'
      default: return 'All Levels'
    }
  }

  const isSessionInAgenda = (sessionId: string) => {
    return userSessions.some(session => session.id === sessionId)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
  }

  const tabs = [
    { id: 'browse', label: 'Browse Sessions', icon: Search },
    { id: 'agenda', label: 'My Agenda', icon: Calendar },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'conflicts', label: 'Conflicts', icon: AlertTriangle }
  ]

  const tracks = ['all', 'Healthcare Innovation', 'Software Architecture', 'Sustainability', 'AI & Machine Learning', 'Cybersecurity']
  const sessionTypes = ['all', 'KEYNOTE', 'WORKSHOP', 'PANEL', 'NETWORKING', 'VIRTUAL']
  const difficultyLevels = ['all', '1', '2', '3', '4', '5']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Personalized Agenda Builder</h2>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-secondary/20 text-secondary border border-secondary/30 rounded-lg hover:bg-secondary/30 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-primary">{userSessions.length}</div>
            <div className="text-sm text-gray-400">Sessions Added</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-yellow-400">{conflicts.length / 2}</div>
            <div className="text-sm text-gray-400">Conflicts</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-green-400">{favorites.length}</div>
            <div className="text-sm text-gray-400">Favorites</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-blue-400">
              {userSessions.reduce((total, session) => {
                const start = new Date(session.start_time)
                const end = new Date(session.end_time)
                return total + (end.getTime() - start.getTime()) / (1000 * 60)
              }, 0)} min
            </div>
            <div className="text-sm text-gray-400">Total Duration</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1 mt-4">
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
              {tab.id === 'conflicts' && conflicts.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {conflicts.length / 2}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Browse Sessions */}
      {activeTab === 'browse' && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
              value={filterTrack}
              onChange={(e) => setFilterTrack(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
            >
              {tracks.map(track => (
                <option key={track} value={track}>
                  {track === 'all' ? 'All Tracks' : track}
                </option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
            >
              {sessionTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
            >
              {difficultyLevels.map(level => (
                <option key={level} value={level}>
                  {level === 'all' ? 'All Levels' : getDifficultyLabel(parseInt(level))}
                </option>
              ))}
            </select>
          </div>

          {/* Sessions List */}
          <div className="space-y-4">
            {filteredSessions.map((session) => {
              const SessionIcon = getSessionTypeIcon(session.session_type)
              const isInAgenda = isSessionInAgenda(session.id)
              const hasConflict = conflicts.includes(session.id)
              const isFavorite = favorites.includes(session.id)
              
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white/5 rounded-lg p-6 border transition-colors ${
                    hasConflict 
                      ? 'border-red-500/50 bg-red-500/5' 
                      : isInAgenda 
                      ? 'border-green-500/50 bg-green-500/5'
                      : 'border-white/10 hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getSessionTypeColor(session.session_type)}`}>
                          <SessionIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">{session.session_type}</span>
                        </div>
                        <span className="text-sm text-gray-400">{session.track}</span>
                        <span className="text-sm text-gray-400">
                          {getDifficultyLabel(session.difficulty_level)}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-2">{session.title}</h3>
                      <p className="text-gray-300 mb-3">{session.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(session.start_time)} - {formatTime(session.end_time)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>Room {session.room_id}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{session.current_attendees}/{session.max_attendees}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setFavorites(prev => 
                          isFavorite 
                            ? prev.filter(id => id !== session.id)
                            : [...prev, session.id]
                        )}
                        className={`p-2 rounded-lg transition-colors ${
                          isFavorite 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-white/5 text-gray-400 border border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      
                      <button
                        onClick={() => onSessionToggle(session.id, !isInAgenda)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          isInAgenda
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                            : 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'
                        }`}
                      >
                        {isInAgenda ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        <span>{isInAgenda ? 'Remove' : 'Add to Agenda'}</span>
                      </button>
                    </div>
                  </div>
                  
                  {hasConflict && (
                    <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-red-400">
                        This session conflicts with another session in your agenda
                      </span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* My Agenda */}
      {activeTab === 'agenda' && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-6">My Personal Agenda</h3>
          
          {userSessions.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-white mb-2">No sessions added yet</h4>
              <p className="text-gray-400 mb-4">Start building your personalized agenda by browsing available sessions</p>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
              >
                Browse Sessions
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userSessions
                .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                .map((session) => {
                  const SessionIcon = getSessionTypeIcon(session.session_type)
                  const hasConflict = conflicts.includes(session.id)
                  
                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`bg-white/5 rounded-lg p-4 border ${
                        hasConflict ? 'border-red-500/50' : 'border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-white">
                              {formatTime(session.start_time)}
                            </div>
                            <div className="text-sm text-gray-400">
                              {formatTime(session.end_time)}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <SessionIcon className="w-4 h-4 text-primary" />
                              <h4 className="font-semibold text-white">{session.title}</h4>
                              {hasConflict && (
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>{session.track}</span>
                              <span>Room {session.room_id}</span>
                              <span>{getDifficultyLabel(session.difficulty_level)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => onSessionToggle(session.id, false)}
                          className="p-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
