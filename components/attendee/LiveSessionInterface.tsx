'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Users, 
  MessageCircle, 
  Send, 
  ThumbsUp, 
  Hand, 
  Settings,
  Share2,
  Download,
  Clock,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  MoreVertical,
  Star,
  Heart,
  Flag,
  Eye,
  EyeOff
} from 'lucide-react'
import { Session, User, Question, Poll } from '@/lib/supabase'

interface LiveSessionInterfaceProps {
  session: Session
  currentUser: User
  isLive: boolean
  onJoinSession: () => void
  onLeaveSession: () => void
}

export default function LiveSessionInterface({
  session,
  currentUser,
  isLive,
  onJoinSession,
  onLeaveSession
}: LiveSessionInterfaceProps) {
  const [isJoined, setIsJoined] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')
  const [chatMessage, setChatMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [polls, setPolls] = useState<Poll[]>([])
  const [handRaised, setHandRaised] = useState(false)
  const [sessionRating, setSessionRating] = useState(0)
  const [attendeeCount, setAttendeeCount] = useState(session.current_attendees)

  const videoRef = useRef<HTMLVideoElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll chat to bottom
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  useEffect(() => {
    // Load session data
    loadSessionData()
    
    // Set up real-time subscriptions
    // TODO: Implement WebSocket connections for real-time updates
    
    return () => {
      // Cleanup subscriptions
    }
  }, [session.id])

  const loadSessionData = async () => {
    try {
      // Load chat messages, questions, polls
      // TODO: Implement API calls
      
      // Mock data for demo
      setChatMessages([
        {
          id: '1',
          user: { name: 'Sarah Chen', role: 'speaker' },
          message: 'Welcome everyone! Excited to share insights on AI in healthcare.',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          type: 'message'
        },
        {
          id: '2',
          user: { name: 'Mike Johnson', role: 'attendee' },
          message: 'Great topic! Looking forward to the Q&A session.',
          timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
          type: 'message'
        }
      ])

      setQuestions([
        {
          id: '1',
          session_id: session.id,
          user_id: 'user1',
          question: 'How do you see AI transforming diagnostic accuracy in the next 5 years?',
          is_anonymous: false,
          upvotes: 12,
          is_answered: false,
          created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString()
        }
      ])
    } catch (error) {
      console.error('Error loading session data:', error)
    }
  }

  const handleJoinSession = () => {
    setIsJoined(true)
    setAttendeeCount(prev => prev + 1)
    onJoinSession()
  }

  const handleLeaveSession = () => {
    setIsJoined(false)
    setAttendeeCount(prev => prev - 1)
    onLeaveSession()
  }

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return

    const newMsg = {
      id: Date.now().toString(),
      user: { name: `${currentUser.first_name} ${currentUser.last_name}`, role: 'attendee' },
      message: chatMessage,
      timestamp: new Date().toISOString(),
      type: 'message'
    }

    setChatMessages(prev => [...prev, newMsg])
    setChatMessage('')
  }

  const submitQuestion = () => {
    if (!newQuestion.trim()) return

    const question: Question = {
      id: Date.now().toString(),
      session_id: session.id,
      user_id: currentUser.id,
      question: newQuestion,
      is_anonymous: false,
      upvotes: 0,
      is_answered: false,
      created_at: new Date().toISOString()
    }

    setQuestions(prev => [...prev, question])
    setNewQuestion('')
  }

  const upvoteQuestion = (questionId: string) => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? { ...q, upvotes: q.upvotes + 1 }
          : q
      )
    )
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle, count: chatMessages.length },
    { id: 'qa', label: 'Q&A', icon: Hand, count: questions.length },
    { id: 'polls', label: 'Polls', icon: Star, count: polls.length },
    { id: 'attendees', label: 'Attendees', icon: Users, count: attendeeCount }
  ]

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
              <span className={`text-sm font-medium ${isLive ? 'text-red-400' : 'text-gray-400'}`}>
                {isLive ? 'LIVE' : 'SCHEDULED'}
              </span>
              <span className="text-sm text-gray-400">
                {formatTime(session.start_time)} - {formatTime(session.end_time)}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{session.title}</h2>
            <p className="text-gray-300">{session.description}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              <span>{attendeeCount} attendees</span>
            </div>
            {isLive && (
              <button
                onClick={isJoined ? handleLeaveSession : handleJoinSession}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isJoined
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                    : 'bg-primary text-white hover:bg-primary/80'
                }`}
              >
                {isJoined ? 'Leave Session' : 'Join Session'}
              </button>
            )}
          </div>
        </div>

        {/* Session Controls */}
        {isJoined && (
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  isAudioEnabled 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
              >
                {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  isVideoEnabled 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
              >
                {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  handRaised
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-white/5 text-gray-400 border border-white/20 hover:bg-white/10'
                }`}
              >
                <Hand className="w-4 h-4" />
                <span>Raise Hand</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 bg-white/5 text-gray-400 border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white/5 text-gray-400 border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 bg-white/5 text-gray-400 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Session Interface */}
      {isJoined && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video/Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-xl overflow-hidden aspect-video">
              {session.virtual_url ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                  <div className="text-center">
                    <Video className="w-16 h-16 text-white/50 mx-auto mb-4" />
                    <p className="text-white/70">Video stream will appear here</p>
                    <p className="text-white/50 text-sm mt-2">Connected to: {session.virtual_url}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <div className="text-center">
                    <VideoOff className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No video stream available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Session Resources */}
            {(session.slides_url || session.resources_url) && (
              <div className="mt-4 bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-3">Session Resources</h4>
                <div className="flex space-x-3">
                  {session.slides_url && (
                    <a
                      href={session.slides_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Slides</span>
                    </a>
                  )}
                  {session.resources_url && (
                    <a
                      href={session.resources_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-secondary/20 text-secondary border border-secondary/30 rounded-lg hover:bg-secondary/30 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Additional Resources</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Interaction Panel */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 h-fit">
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/20 text-primary border-b-2 border-primary'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 h-96 overflow-y-auto">
              {/* Chat Tab */}
              {activeTab === 'chat' && (
                <div className="space-y-4">
                  <div ref={chatContainerRef} className="space-y-3 max-h-64 overflow-y-auto">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="flex space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                          {msg.user.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-white">{msg.user.name}</span>
                            <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                            {msg.user.role === 'speaker' && (
                              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                Speaker
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-300">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                      onClick={sendChatMessage}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Q&A Tab */}
              {activeTab === 'qa' && (
                <div className="space-y-4">
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {questions.map((question) => (
                      <div key={question.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <p className="text-sm text-white mb-2">{question.question}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{formatTime(question.created_at)}</span>
                          <button
                            onClick={() => upvoteQuestion(question.id)}
                            className="flex items-center space-x-1 text-xs text-gray-400 hover:text-primary transition-colors"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{question.upvotes}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <textarea
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Ask a question..."
                      rows={3}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                    <button
                      onClick={submitQuestion}
                      className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                    >
                      Submit Question
                    </button>
                  </div>
                </div>
              )}

              {/* Polls Tab */}
              {activeTab === 'polls' && (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">No active polls</p>
                </div>
              )}

              {/* Attendees Tab */}
              {activeTab === 'attendees' && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">{attendeeCount} attendees online</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
