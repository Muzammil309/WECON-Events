'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Mail,
  MessageSquare,
  Bell,
  Users,
  Calendar,
  Filter,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Download
} from 'lucide-react';
import ComposeModal from '@/components/admin/communications/ComposeModal';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
  sentAt?: string;
  scheduledFor?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  event?: {
    id: string;
    name: string;
  };
}

interface NotificationStats {
  total: number;
  sent: number;
  pending: number;
  failed: number;
  byType: {
    email: number;
    sms: number;
    push: number;
  };
  sentToday: number;
}

export default function CommunicationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    sent: 0,
    pending: 0,
    failed: 0,
    byType: { email: 0, sms: 0, push: 0 },
    sentToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showComposeModal, setShowComposeModal] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [typeFilter, statusFilter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/admin/notifications?${params}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SENT': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'PENDING': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'FAILED': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'SCHEDULED': return <Calendar className="h-4 w-4 text-blue-400" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'EMAIL': return <Mail className="h-4 w-4" />;
      case 'SMS': return <MessageSquare className="h-4 w-4" />;
      case 'PUSH': return <Bell className="h-4 w-4" />;
      case 'ANNOUNCEMENT': return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-400 bg-red-900/20';
      case 'HIGH': return 'text-orange-400 bg-orange-900/20';
      case 'NORMAL': return 'text-blue-400 bg-blue-900/20';
      case 'LOW': return 'text-gray-400 bg-gray-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async (messageData: any) => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        // Refresh notifications list
        await fetchNotifications();
        return Promise.resolve();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading communications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Communication Hub</h1>
            <p className="text-gray-400">Send mass notifications and manage communications</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowComposeModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Compose Message
            </button>
            <button
              onClick={fetchNotifications}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Send className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-gray-400">Total Sent</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">{stats.sent}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Pending</span>
            </div>
            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-red-400" />
              <span className="text-sm text-gray-400">Failed</span>
            </div>
            <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-5 w-5 text-green-400" />
              <span className="text-sm text-gray-400">Emails</span>
            </div>
            <p className="text-2xl font-bold text-green-400">{stats.byType.email}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              <span className="text-sm text-gray-400">SMS</span>
            </div>
            <p className="text-2xl font-bold text-purple-400">{stats.byType.sms}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-5 w-5 text-orange-400" />
              <span className="text-sm text-gray-400">Push</span>
            </div>
            <p className="text-2xl font-bold text-orange-400">{stats.byType.push}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="push">Push</option>
            <option value="announcement">Announcement</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="sent">Sent</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Communication History</h2>
          <p className="text-sm text-gray-400">Recent notifications and messages sent to attendees</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-750 border-b border-gray-700">
              <tr>
                <th className="text-left p-4 font-medium text-gray-300">Message</th>
                <th className="text-left p-4 font-medium text-gray-300">Recipient</th>
                <th className="text-left p-4 font-medium text-gray-300">Type</th>
                <th className="text-left p-4 font-medium text-gray-300">Status</th>
                <th className="text-left p-4 font-medium text-gray-300">Priority</th>
                <th className="text-left p-4 font-medium text-gray-300">Sent</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.map((notification, index) => (
                <motion.tr
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-white">{notification.title}</p>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{notification.message}</p>
                      {notification.event && (
                        <p className="text-xs text-blue-400 mt-1">Event: {notification.event.name}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-white">{notification.user.name}</p>
                      <p className="text-xs text-gray-400">{notification.user.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      {getTypeIcon(notification.type)}
                      <span className="text-sm">{notification.type}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(notification.status)}
                      <span className="text-sm text-gray-300">{notification.status}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                      {notification.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      {notification.sentAt ? (
                        <>
                          <p className="text-sm text-white">
                            {new Date(notification.sentAt).toLocaleTimeString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(notification.sentAt).toLocaleDateString()}
                          </p>
                        </>
                      ) : notification.scheduledFor ? (
                        <>
                          <p className="text-sm text-blue-400">Scheduled</p>
                          <p className="text-xs text-gray-400">
                            {new Date(notification.scheduledFor).toLocaleString()}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">Not sent</p>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Send className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Communications Found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start by composing your first message to attendees'
              }
            </p>
            <button
              onClick={() => setShowComposeModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Compose Message
            </button>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      <ComposeModal
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        onSend={handleSendMessage}
      />
    </div>
  );
}
