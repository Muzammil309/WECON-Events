'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Bell, 
  Send, 
  Search, 
  Filter,
  Users,
  User,
  Phone,
  Video,
  MoreVertical,
  Pin,
  Archive,
  Trash2,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Megaphone,
  HeadphonesIcon,
  Settings,
  Minimize,
  Maximize,
  X,
  Plus,
  Paperclip,
  Smile,
  Image as ImageIcon,
  File,
  Download
} from 'lucide-react'
import { User as UserType, Notification } from '@/lib/supabase'

interface CommunicationHubProps {
  currentUser: UserType
  notifications: Notification[]
  onMarkNotificationRead: (notificationId: string) => void
}

interface Message {
  id: string
  senderId: string
  recipientId: string
  content: string
  type: 'text' | 'image' | 'file'
  timestamp: string
  isRead: boolean
  isDelivered: boolean
}

interface Conversation {
  id: string
  participants: UserType[]
  lastMessage?: Message
  unreadCount: number
  isPinned: boolean
  isArchived: boolean
}

export default function CommunicationHub({ 
  currentUser, 
  notifications, 
  onMarkNotificationRead 
}: CommunicationHubProps) {
  const [activeTab, setActiveTab] = useState('notifications')
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [supportChatOpen, setSupportChatOpen] = useState(false)
  const [filterType, setFilterType] = useState('all')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadConversations()
    loadMessages()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadConversations = async () => {
    // Mock conversations data
    const mockConversations: Conversation[] = [
      {
        id: '1',
        participants: [
          {
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
          }
        ],
        lastMessage: {
          id: '1',
          senderId: '2',
          recipientId: currentUser.id,
          content: 'Thanks for connecting! Looking forward to our discussion about AI in healthcare.',
          type: 'text',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isRead: false,
          isDelivered: true
        },
        unreadCount: 1,
        isPinned: false,
        isArchived: false
      },
      {
        id: '2',
        participants: [
          {
            id: '3',
            email: 'mike.johnson@startup.io',
            role: 'ATTENDEE',
            first_name: 'Mike',
            last_name: 'Johnson',
            job_title: 'Product Manager',
            company: 'StartupIO',
            networking_available: true,
            privacy_level: 'PUBLIC',
            email_notifications: true,
            push_notifications: true,
            email_verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        lastMessage: {
          id: '2',
          senderId: currentUser.id,
          recipientId: '3',
          content: 'Great session on microservices! Would love to continue the conversation.',
          type: 'text',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          isDelivered: true
        },
        unreadCount: 0,
        isPinned: true,
        isArchived: false
      }
    ]
    setConversations(mockConversations)
  }

  const loadMessages = async () => {
    if (!selectedConversation) return

    // Mock messages for selected conversation
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: '2',
        recipientId: currentUser.id,
        content: 'Hi! I saw your profile and noticed we both work in healthcare AI. Would love to connect!',
        type: 'text',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        isDelivered: true
      },
      {
        id: '2',
        senderId: currentUser.id,
        recipientId: '2',
        content: 'Absolutely! I\'d be happy to connect. Your work at TechCorp sounds fascinating.',
        type: 'text',
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        isRead: true,
        isDelivered: true
      },
      {
        id: '3',
        senderId: '2',
        recipientId: currentUser.id,
        content: 'Thanks for connecting! Looking forward to our discussion about AI in healthcare.',
        type: 'text',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isRead: false,
        isDelivered: true
      }
    ]
    setMessages(mockMessages)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      recipientId: selectedConversation,
      content: newMessage,
      type: 'text',
      timestamp: new Date().toISOString(),
      isRead: false,
      isDelivered: true
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Update conversation last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation 
          ? { ...conv, lastMessage: message }
          : conv
      )
    )
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SYSTEM': return Settings
      case 'SESSION_REMINDER': return Clock
      case 'NETWORKING': return Users
      case 'ANNOUNCEMENT': return Megaphone
      case 'EMERGENCY': return AlertCircle
      default: return Info
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'SYSTEM': return 'text-blue-400 bg-blue-400/20'
      case 'SESSION_REMINDER': return 'text-green-400 bg-green-400/20'
      case 'NETWORKING': return 'text-purple-400 bg-purple-400/20'
      case 'ANNOUNCEMENT': return 'text-yellow-400 bg-yellow-400/20'
      case 'EMERGENCY': return 'text-red-400 bg-red-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filterType === 'unread') return !notification.is_read
    if (filterType === 'read') return notification.is_read
    return true
  })

  const filteredConversations = conversations.filter(conv => {
    const participant = conv.participants[0]
    const searchLower = searchQuery.toLowerCase()
    return (
      participant.first_name.toLowerCase().includes(searchLower) ||
      participant.last_name.toLowerCase().includes(searchLower) ||
      participant.company?.toLowerCase().includes(searchLower) ||
      conv.lastMessage?.content.toLowerCase().includes(searchLower)
    )
  })

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell, count: notifications.filter(n => !n.is_read).length },
    { id: 'messages', label: 'Messages', icon: MessageCircle, count: conversations.reduce((sum, conv) => sum + conv.unreadCount, 0) },
    { id: 'support', label: 'Support', icon: HeadphonesIcon, count: 0 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Communication Hub</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 bg-white/5 text-gray-400 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isMinimized ? <Maximize className="w-4 h-4" /> : <Minimize className="w-4 h-4" />}
            </button>
            <button className="p-2 bg-white/5 text-gray-400 border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
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
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredNotifications.map((notification) => {
                  const NotificationIcon = getNotificationIcon(notification.type)
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                        notification.is_read 
                          ? 'bg-white/5 border-white/10' 
                          : 'bg-primary/10 border-primary/30'
                      }`}
                      onClick={() => onMarkNotificationRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                          <NotificationIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-white">{notification.title}</h4>
                            <span className="text-xs text-gray-500">{formatTime(notification.created_at)}</span>
                          </div>
                          <p className="text-sm text-gray-300">{notification.message}</p>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Conversations List */}
              <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white">Messages</h3>
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {filteredConversations.map((conversation) => {
                    const participant = conversation.participants[0]
                    
                    return (
                      <button
                        key={conversation.id}
                        onClick={() => {
                          setSelectedConversation(conversation.id)
                          loadMessages()
                        }}
                        className={`w-full p-4 text-left border-b border-white/10 hover:bg-white/5 transition-colors ${
                          selectedConversation === conversation.id ? 'bg-primary/10' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                              {participant.first_name[0]}{participant.last_name[0]}
                            </div>
                            {conversation.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {conversation.unreadCount}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-white truncate">
                                {participant.first_name} {participant.last_name}
                              </h4>
                              {conversation.lastMessage && (
                                <span className="text-xs text-gray-500">
                                  {formatTime(conversation.lastMessage.timestamp)}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 truncate">
                              {conversation.lastMessage?.content || 'No messages yet'}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Chat Interface */}
              <div className="lg:col-span-2 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                            SC
                          </div>
                          <div>
                            <h4 className="font-medium text-white">Sarah Chen</h4>
                            <p className="text-sm text-gray-400">Senior Software Engineer at TechCorp</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-white transition-colors">
                            <Phone className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-white transition-colors">
                            <Video className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-white transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === currentUser.id
                                ? 'bg-primary text-white'
                                : 'bg-white/10 text-white'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-white/10">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          multiple
                        />
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Type a message..."
                          className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                        />
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                          <Smile className="w-4 h-4" />
                        </button>
                        <button
                          onClick={sendMessage}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-white mb-2">Select a conversation</h4>
                      <p className="text-gray-400">Choose a conversation to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Support Tab */}
          {activeTab === 'support' && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="text-center py-12">
                <HeadphonesIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">24/7 Support</h3>
                <p className="text-gray-400 mb-6">Get help from our support team anytime during the event</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setSupportChatOpen(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Start Live Chat</span>
                  </button>
                  <button className="flex items-center space-x-2 px-6 py-3 bg-secondary/20 text-secondary border border-secondary/30 rounded-lg hover:bg-secondary/30 transition-colors">
                    <Phone className="w-4 h-4" />
                    <span>Call Support</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
