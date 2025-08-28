'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Image, 
  Video, 
  Calendar,
  Clock,
  Eye,
  Edit,
  Trash2,
  Upload,
  Download,
  Share2,
  Globe,
  Smartphone,
  Monitor,
  Wifi,
  WifiOff,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Zap,
  Activity
} from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: 'announcement' | 'schedule' | 'emergency' | 'promotion' | 'wayfinding';
  format: 'text' | 'image' | 'video' | 'html';
  content: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: string[];
  channels: string[];
  publishedAt?: Date;
  scheduledFor?: Date;
  expiresAt?: Date;
  views: number;
  engagement: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Channel {
  id: string;
  name: string;
  type: 'digital_signage' | 'mobile_app' | 'website' | 'email' | 'sms';
  status: 'active' | 'inactive' | 'error';
  reach: number;
  lastSync: Date;
}

export default function ContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'channels' | 'analytics' | 'realtime'>('content');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockContent: ContentItem[] = [
      {
        id: '1',
        title: 'Welcome to WECON Masawat 2024',
        type: 'announcement',
        format: 'text',
        content: 'Welcome to the premier technology conference in Pakistan! Join us for three days of innovation, networking, and learning.',
        status: 'published',
        priority: 'high',
        targetAudience: ['all'],
        channels: ['digital_signage', 'mobile_app', 'website'],
        publishedAt: new Date(),
        views: 1250,
        engagement: 85,
        createdBy: 'Admin User',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'Emergency: Fire Drill at 2:00 PM',
        type: 'emergency',
        format: 'text',
        content: 'ATTENTION: Mandatory fire drill scheduled for 2:00 PM today. Please evacuate the building when the alarm sounds and gather at the designated assembly points.',
        status: 'published',
        priority: 'urgent',
        targetAudience: ['all'],
        channels: ['digital_signage', 'mobile_app', 'sms'],
        publishedAt: new Date(Date.now() - 30 * 60 * 1000),
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
        views: 890,
        engagement: 95,
        createdBy: 'Safety Manager',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        title: 'Today\'s Schedule Highlights',
        type: 'schedule',
        format: 'html',
        content: '<div>9:00 AM - Opening Keynote<br/>11:00 AM - AI Panel Discussion<br/>2:00 PM - Networking Lunch<br/>4:00 PM - Startup Showcase</div>',
        status: 'published',
        priority: 'medium',
        targetAudience: ['attendees'],
        channels: ['digital_signage', 'mobile_app'],
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        views: 650,
        engagement: 70,
        createdBy: 'Event Coordinator',
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date()
      },
      {
        id: '4',
        title: 'Sponsor Spotlight: TechCorp Solutions',
        type: 'promotion',
        format: 'image',
        content: '/images/sponsors/techcorp-spotlight.jpg',
        status: 'scheduled',
        priority: 'medium',
        targetAudience: ['attendees'],
        channels: ['digital_signage', 'website'],
        scheduledFor: new Date(Date.now() + 60 * 60 * 1000),
        views: 0,
        engagement: 0,
        createdBy: 'Marketing Team',
        createdAt: new Date('2024-03-14'),
        updatedAt: new Date('2024-03-14')
      }
    ];

    const mockChannels: Channel[] = [
      {
        id: '1',
        name: 'Digital Signage Network',
        type: 'digital_signage',
        status: 'active',
        reach: 2500,
        lastSync: new Date()
      },
      {
        id: '2',
        name: 'Mobile App Push',
        type: 'mobile_app',
        status: 'active',
        reach: 1800,
        lastSync: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        id: '3',
        name: 'Event Website',
        type: 'website',
        status: 'active',
        reach: 3200,
        lastSync: new Date(Date.now() - 2 * 60 * 1000)
      },
      {
        id: '4',
        name: 'Email Notifications',
        type: 'email',
        status: 'active',
        reach: 1500,
        lastSync: new Date(Date.now() - 10 * 60 * 1000)
      },
      {
        id: '5',
        name: 'SMS Alerts',
        type: 'sms',
        status: 'inactive',
        reach: 800,
        lastSync: new Date(Date.now() - 30 * 60 * 1000)
      }
    ];

    setContent(mockContent);
    setChannels(mockChannels);
    setIsLoading(false);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'schedule': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'emergency': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'promotion': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'wayfinding': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'archived': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'text': return <FileText className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'html': return <Globe className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const ContentTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Content Management</h2>
          <p className="text-gray-600 dark:text-gray-300">Create and manage real-time content across all channels</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Content
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Content</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{content.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Published</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {content.filter(c => c.status === 'published').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Scheduled</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {content.filter(c => c.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Views</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {content.reduce((sum, c) => sum + c.views, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="announcement">Announcement</option>
          <option value="schedule">Schedule</option>
          <option value="emergency">Emergency</option>
          <option value="promotion">Promotion</option>
          <option value="wayfinding">Wayfinding</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredContent.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {getFormatIcon(item.format)}
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.title}</h3>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-300">
                {item.format === 'text' || item.format === 'html' ? (
                  <p className="line-clamp-3">{item.content.replace(/<[^>]*>/g, '')}</p>
                ) : (
                  <p className="italic">Media content: {item.content}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {item.views}
                  </span>
                  <span>{item.engagement}% engagement</span>
                </div>
                <span>{item.channels.length} channels</span>
              </div>

              {item.scheduledFor && (
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  Scheduled for: {item.scheduledFor.toLocaleString()}
                </div>
              )}

              {item.expiresAt && (
                <div className="text-xs text-orange-600 dark:text-orange-400">
                  Expires: {item.expiresAt.toLocaleString()}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Real-time content distribution across all channels</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'content', label: 'Content', icon: FileText },
              { id: 'channels', label: 'Channels', icon: Share2 },
              { id: 'analytics', label: 'Analytics', icon: Activity },
              { id: 'realtime', label: 'Real-time', icon: Zap }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'content' && <ContentTab />}
        {activeTab === 'channels' && (
          <div className="text-center py-12">
            <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Channel Management</h3>
            <p className="text-gray-600 dark:text-gray-300">Multi-channel distribution coming soon</p>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Content Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300">Engagement analytics coming soon</p>
          </div>
        )}
        {activeTab === 'realtime' && (
          <div className="text-center py-12">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Real-time Dashboard</h3>
            <p className="text-gray-600 dark:text-gray-300">Live content monitoring coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
