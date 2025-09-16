'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Download, 
  Star, 
  MessageSquare, 
  FileText, 
  Video, 
  Image as ImageIcon,
  Link as LinkIcon,
  Calendar,
  Clock,
  Users,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Filter,
  Search,
  Eye,
  Heart,
  Award,
  Award as Certificate,
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Send,
  Edit,
  Trash2,
  Flag,
  MoreVertical,
  Plus,
  Pin
} from 'lucide-react'
import { Session, User } from '@/lib/supabase'

interface PostEventFeaturesProps {
  currentUser: User
  eventSessions: Session[]
  eventCompleted: boolean
}

interface Recording {
  id: string
  sessionId: string
  title: string
  duration: number
  url: string
  thumbnail: string
  views: number
  uploadDate: string
  quality: 'HD' | 'SD'
  size: string
}

interface Resource {
  id: string
  sessionId: string
  title: string
  type: 'pdf' | 'pptx' | 'docx' | 'video' | 'image' | 'link'
  url: string
  size?: string
  downloads: number
  uploadDate: string
}

interface ForumPost {
  id: string
  sessionId?: string
  authorId: string
  author: User
  title: string
  content: string
  likes: number
  replies: number
  isLiked: boolean
  isPinned: boolean
  tags: string[]
  createdAt: string
  lastActivity: string
}

interface SessionFeedback {
  id: string
  sessionId: string
  rating: number
  contentRating: number
  speakerRating: number
  comments: string
  wouldRecommend: boolean
  submittedAt: string
}

export default function PostEventFeatures({ 
  currentUser, 
  eventSessions, 
  eventCompleted 
}: PostEventFeaturesProps) {
  const [activeTab, setActiveTab] = useState('recordings')
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([])
  const [feedback, setFeedback] = useState<SessionFeedback[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedSession, setSelectedSession] = useState<string>('all')
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [showNewPostForm, setShowNewPostForm] = useState(false)

  useEffect(() => {
    loadPostEventData()
  }, [])

  const loadPostEventData = async () => {
    // Mock data for recordings
    const mockRecordings: Recording[] = [
      {
        id: '1',
        sessionId: '1',
        title: 'The Future of AI in Healthcare - Full Recording',
        duration: 3600, // 1 hour in seconds
        url: 'https://example.com/recording1.mp4',
        thumbnail: 'https://example.com/thumb1.jpg',
        views: 1247,
        uploadDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        quality: 'HD',
        size: '2.1 GB'
      },
      {
        id: '2',
        sessionId: '2',
        title: 'Building Scalable Microservices - Workshop Recording',
        duration: 5400, // 1.5 hours
        url: 'https://example.com/recording2.mp4',
        thumbnail: 'https://example.com/thumb2.jpg',
        views: 892,
        uploadDate: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        quality: 'HD',
        size: '3.2 GB'
      }
    ]

    const mockResources: Resource[] = [
      {
        id: '1',
        sessionId: '1',
        title: 'AI in Healthcare - Presentation Slides',
        type: 'pptx',
        url: 'https://example.com/slides1.pptx',
        size: '15.2 MB',
        downloads: 456,
        uploadDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        sessionId: '1',
        title: 'Research Papers and References',
        type: 'pdf',
        url: 'https://example.com/references1.pdf',
        size: '8.7 MB',
        downloads: 234,
        uploadDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        sessionId: '2',
        title: 'Microservices Architecture Guide',
        type: 'pdf',
        url: 'https://example.com/guide2.pdf',
        size: '12.4 MB',
        downloads: 567,
        uploadDate: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
      }
    ]

    const mockForumPosts: ForumPost[] = [
      {
        id: '1',
        sessionId: '1',
        authorId: '2',
        author: {
          id: '2',
          email: 'sarah.chen@techcorp.com',
          role: 'ATTENDEE',
          first_name: 'Sarah',
          last_name: 'Chen',
          job_title: 'Senior Software Engineer',
          company: 'TechCorp',
          networking_available: true,
          privacy_level: 'PUBLIC',
          email_notifications: true,
          push_notifications: true,
          email_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        title: 'Implementing AI Diagnostics in Real-World Healthcare Settings',
        content: 'Great session! I wanted to continue the discussion about practical implementation challenges. In our experience at TechCorp, we\'ve found that data quality and regulatory compliance are the biggest hurdles. What has been your experience?',
        likes: 23,
        replies: 8,
        isLiked: false,
        isPinned: true,
        tags: ['AI', 'Healthcare', 'Implementation'],
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ]

    setRecordings(mockRecordings)
    setResources(mockResources)
    setForumPosts(mockForumPosts)
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const formatFileSize = (size: string) => {
    return size
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText
      case 'pptx': return FileText
      case 'docx': return FileText
      case 'video': return Video
      case 'image': return ImageIcon
      case 'link': return LinkIcon
      default: return FileText
    }
  }

  const getFileColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'text-red-400 bg-red-400/20'
      case 'pptx': return 'text-orange-400 bg-orange-400/20'
      case 'docx': return 'text-blue-400 bg-blue-400/20'
      case 'video': return 'text-purple-400 bg-purple-400/20'
      case 'image': return 'text-green-400 bg-green-400/20'
      case 'link': return 'text-cyan-400 bg-cyan-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const submitForumPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return

    const newPost: ForumPost = {
      id: Date.now().toString(),
      sessionId: selectedSession !== 'all' ? selectedSession : undefined,
      authorId: currentUser.id,
      author: currentUser,
      title: newPostTitle,
      content: newPostContent,
      likes: 0,
      replies: 0,
      isLiked: false,
      isPinned: false,
      tags: [],
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    }

    setForumPosts(prev => [newPost, ...prev])
    setNewPostTitle('')
    setNewPostContent('')
    setShowNewPostForm(false)
  }

  const togglePostLike = (postId: string) => {
    setForumPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    )
  }

  const filteredRecordings = recordings.filter(recording => {
    const matchesSearch = recording.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSession = selectedSession === 'all' || recording.sessionId === selectedSession
    return matchesSearch && matchesSession
  })

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSession = selectedSession === 'all' || resource.sessionId === selectedSession
    const matchesType = filterType === 'all' || resource.type === filterType
    return matchesSearch && matchesSession && matchesType
  })

  const filteredForumPosts = forumPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSession = selectedSession === 'all' || post.sessionId === selectedSession
    return matchesSearch && matchesSession
  })

  const tabs = [
    { id: 'recordings', label: 'Session Recordings', icon: Video, count: recordings.length },
    { id: 'resources', label: 'Resources & Downloads', icon: Download, count: resources.length },
    { id: 'discussions', label: 'Discussion Forums', icon: MessageSquare, count: forumPosts.length },
    { id: 'feedback', label: 'My Feedback', icon: Star, count: feedback.length },
    { id: 'certificates', label: 'Certificates', icon: Award, count: 1 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Post-Event Hub</h2>
            <p className="text-gray-400">Access recordings, resources, and continue discussions</p>
          </div>
          {eventCompleted && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span>Event Completed</span>
            </div>
          )}
        </div>

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
              {tab.count > 0 && (
                <span className="bg-primary/50 text-white text-xs rounded-full px-2 py-0.5">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="all">All Sessions</option>
            {eventSessions.map(session => (
              <option key={session.id} value={session.id}>
                {session.title}
              </option>
            ))}
          </select>

          {activeTab === 'resources' && (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF Documents</option>
              <option value="pptx">Presentations</option>
              <option value="video">Videos</option>
              <option value="image">Images</option>
              <option value="link">Links</option>
            </select>
          )}
        </div>
      </div>

      {/* Session Recordings */}
      {activeTab === 'recordings' && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-6">Session Recordings</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRecordings.map((recording) => (
              <motion.div
                key={recording.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-lg border border-white/10 overflow-hidden hover:border-primary/30 transition-colors"
              >
                <div className="relative aspect-video bg-gray-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-16 h-16 bg-primary/80 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </button>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {recording.quality}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(recording.duration)}
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-white mb-2">{recording.title}</h4>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{recording.views.toLocaleString()} views</span>
                      </div>
                      <span>{recording.size}</span>
                    </div>
                    <span>{new Date(recording.uploadDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors">
                      <Play className="w-4 h-4" />
                      <span>Watch</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-secondary/20 text-secondary border border-secondary/30 rounded-lg hover:bg-secondary/30 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button className="p-2 bg-white/5 text-gray-400 border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Resources & Downloads */}
      {activeTab === 'resources' && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-6">Resources & Downloads</h3>
          
          <div className="space-y-4">
            {filteredResources.map((resource) => {
              const FileIcon = getFileIcon(resource.type)
              
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${getFileColor(resource.type)}`}>
                      <FileIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{resource.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{resource.type.toUpperCase()}</span>
                        {resource.size && <span>{resource.size}</span>}
                        <span>{resource.downloads} downloads</span>
                        <span>{new Date(resource.uploadDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button className="p-2 bg-white/5 text-gray-400 border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Discussion Forums */}
      {activeTab === 'discussions' && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Discussion Forums</h3>
            <button
              onClick={() => setShowNewPostForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Post</span>
            </button>
          </div>

          {/* New Post Form */}
          {showNewPostForm && (
            <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="font-medium text-white mb-3">Create New Discussion</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Post title..."
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                />
                <textarea
                  placeholder="Share your thoughts, questions, or insights..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors resize-none"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={submitForumPost}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    Post Discussion
                  </button>
                  <button
                    onClick={() => setShowNewPostForm(false)}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {filteredForumPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-white/5 rounded-lg border border-white/10 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                      {post.author.first_name[0]}{post.author.last_name[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{post.title}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>{post.author.first_name} {post.author.last_name}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        {post.isPinned && (
                          <>
                            <span>•</span>
                            <div className="flex items-center space-x-1 text-yellow-400">
                              <Pin className="w-3 h-3" />
                              <span>Pinned</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-gray-300 mb-4">{post.content}</p>
                
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => togglePostLike(post.id)}
                      className={`flex items-center space-x-1 transition-colors ${
                        post.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.replies} replies</span>
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <span className="text-xs text-gray-500">
                    Last activity: {new Date(post.lastActivity).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Certificates */}
      {activeTab === 'certificates' && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-6">Certificates & Achievements</h3>
          
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-white mb-2">Congratulations!</h4>
            <p className="text-gray-400 mb-6">You've earned a certificate of attendance for WECON Masawat 2024</p>
            
            <div className="max-w-md mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-xl p-6">
              <div className="text-center">
                <Award className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                <h5 className="text-lg font-semibold text-white mb-2">Certificate of Attendance</h5>
                <p className="text-gray-300 mb-4">WECON Masawat 2024</p>
                <p className="text-sm text-gray-400 mb-4">
                  This certifies that {currentUser.first_name} {currentUser.last_name} has successfully attended the WECON Masawat 2024 conference.
                </p>
                <button className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors mx-auto">
                  <Download className="w-4 h-4" />
                  <span>Download Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
