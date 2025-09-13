'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, Search, Plus, User, Clock, Check, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isFromMe: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantTitle: string;
  participantCompany: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      // Mock data - replace with actual API call
      const mockConversations: Conversation[] = [
        {
          id: '1',
          participantId: 'user1',
          participantName: 'Ahmed Khan',
          participantTitle: 'Event Manager',
          participantCompany: 'EventTech Solutions',
          participantAvatar: '/api/placeholder/40/40',
          lastMessage: 'Great meeting you at the networking session!',
          lastMessageTime: '2024-03-15T14:30:00Z',
          unreadCount: 2,
          isOnline: true,
          messages: [
            {
              id: 'm1',
              senderId: 'user1',
              senderName: 'Ahmed Khan',
              senderAvatar: '/api/placeholder/40/40',
              content: 'Hi! I enjoyed your presentation on event technology.',
              timestamp: '2024-03-15T14:00:00Z',
              isRead: true,
              isFromMe: false
            },
            {
              id: 'm2',
              senderId: 'me',
              senderName: 'You',
              senderAvatar: '/api/placeholder/40/40',
              content: 'Thank you! I\'d love to discuss potential collaboration opportunities.',
              timestamp: '2024-03-15T14:15:00Z',
              isRead: true,
              isFromMe: true
            },
            {
              id: 'm3',
              senderId: 'user1',
              senderName: 'Ahmed Khan',
              senderAvatar: '/api/placeholder/40/40',
              content: 'Great meeting you at the networking session!',
              timestamp: '2024-03-15T14:30:00Z',
              isRead: false,
              isFromMe: false
            }
          ]
        },
        {
          id: '2',
          participantId: 'user2',
          participantName: 'Maria Rodriguez',
          participantTitle: 'Marketing Director',
          participantCompany: 'Global Events Inc',
          participantAvatar: '/api/placeholder/40/40',
          lastMessage: 'Would you like to connect on LinkedIn?',
          lastMessageTime: '2024-03-15T13:45:00Z',
          unreadCount: 0,
          isOnline: false,
          messages: [
            {
              id: 'm4',
              senderId: 'user2',
              senderName: 'Maria Rodriguez',
              senderAvatar: '/api/placeholder/40/40',
              content: 'Would you like to connect on LinkedIn?',
              timestamp: '2024-03-15T13:45:00Z',
              isRead: true,
              isFromMe: false
            }
          ]
        },
        {
          id: '3',
          participantId: 'user3',
          participantName: 'David Wilson',
          participantTitle: 'Technology Lead',
          participantCompany: 'Innovation Labs',
          participantAvatar: '/api/placeholder/40/40',
          lastMessage: 'Thanks for the session recommendation!',
          lastMessageTime: '2024-03-15T12:20:00Z',
          unreadCount: 1,
          isOnline: true,
          messages: [
            {
              id: 'm5',
              senderId: 'user3',
              senderName: 'David Wilson',
              senderAvatar: '/api/placeholder/40/40',
              content: 'Thanks for the session recommendation!',
              timestamp: '2024-03-15T12:20:00Z',
              isRead: false,
              isFromMe: false
            }
          ]
        }
      ];

      setConversations(mockConversations);
      if (mockConversations.length > 0) {
        setSelectedConversation(mockConversations[0]);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'You',
      senderAvatar: '/api/placeholder/40/40',
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: true,
      isFromMe: true
    };

    // Update conversations
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { 
            ...conv, 
            messages: [...conv.messages, message],
            lastMessage: newMessage,
            lastMessageTime: message.timestamp
          }
        : conv
    ));

    // Update selected conversation
    setSelectedConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: newMessage,
      lastMessageTime: message.timestamp
    } : null);

    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participantCompany.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect and communicate with fellow attendees
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversations
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 cursor-pointer border-l-4 transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-l-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {conversation.participantName.split(' ').map(n => n[0]).join('')}
                      </div>
                      {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm truncate">{conversation.participantName}</h4>
                        <span className="text-xs text-gray-500">{formatTime(conversation.lastMessageTime)}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {conversation.participantTitle} at {conversation.participantCompany}
                      </p>
                      <p className="text-sm text-gray-500 truncate mt-1">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-blue-500 text-white text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedConversation.participantName.split(' ').map(n => n[0]).join('')}
                    </div>
                    {selectedConversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedConversation.participantName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedConversation.participantTitle} at {selectedConversation.participantCompany}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.isFromMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${message.isFromMe ? 'order-2' : 'order-1'}`}>
                        <div className={`p-3 rounded-lg ${
                          message.isFromMe 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                          message.isFromMe ? 'justify-end' : 'justify-start'
                        }`}>
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(message.timestamp)}</span>
                          {message.isFromMe && (
                            message.isRead ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
