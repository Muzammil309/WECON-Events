'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Ticket, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  Activity
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalTicketsSold: number;
  totalRevenue: number;
  totalSessions: number;
  checkInRate: number;
  avgSessionDuration: number;
  activeEvents: number;
  pendingApprovals: number;
}

interface RecentActivity {
  id: string;
  type: 'registration' | 'ticket_sale' | 'check_in' | 'session_created';
  message: string;
  timestamp: string;
  user?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
    totalSessions: 0,
    checkInRate: 0,
    avgSessionDuration: 0,
    activeEvents: 0,
    pendingApprovals: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls - replace with actual API endpoints
      const mockStats: DashboardStats = {
        totalUsers: 1247,
        totalTicketsSold: 892,
        totalRevenue: 124750,
        totalSessions: 45,
        checkInRate: 89.2,
        avgSessionDuration: 45,
        activeEvents: 3,
        pendingApprovals: 12
      };

      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'registration',
          message: 'New user registered',
          timestamp: '2 minutes ago',
          user: 'john.doe@example.com'
        },
        {
          id: '2',
          type: 'ticket_sale',
          message: 'VIP ticket purchased',
          timestamp: '5 minutes ago',
          user: 'jane.smith@example.com'
        },
        {
          id: '3',
          type: 'check_in',
          message: 'Attendee checked in',
          timestamp: '8 minutes ago',
          user: 'mike.wilson@example.com'
        },
        {
          id: '4',
          type: 'session_created',
          message: 'New session "AI in Events" created',
          timestamp: '15 minutes ago',
          user: 'admin'
        }
      ];

      setStats(mockStats);
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12.5%',
      trend: 'up' as const,
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Tickets Sold',
      value: stats.totalTicketsSold.toLocaleString(),
      change: '+8.2%',
      trend: 'up' as const,
      icon: Ticket,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: '+18.7%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Sessions',
      value: stats.totalSessions.toString(),
      change: '+5.1%',
      trend: 'up' as const,
      icon: Calendar,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Check-in Rate',
      value: `${stats.checkInRate}%`,
      change: '+2.3%',
      trend: 'up' as const,
      icon: Eye,
      color: 'from-teal-500 to-teal-600'
    },
    {
      title: 'Avg Session Duration',
      value: `${stats.avgSessionDuration} min`,
      change: '+3 min',
      trend: 'up' as const,
      icon: Clock,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'registration':
        return Users;
      case 'ticket_sale':
        return Ticket;
      case 'check_in':
        return CheckCircle;
      case 'session_created':
        return Calendar;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'registration':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'ticket_sale':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'check_in':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'session_created':
        return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Welcome back! Here's what's happening with your events.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
            <Calendar className="h-6 w-6 text-indigo-600 mb-2" />
            <div className="text-sm font-medium text-gray-900 dark:text-white">Create Event</div>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
            <Ticket className="h-6 w-6 text-green-600 mb-2" />
            <div className="text-sm font-medium text-gray-900 dark:text-white">Add Ticket Type</div>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
            <Users className="h-6 w-6 text-purple-600 mb-2" />
            <div className="text-sm font-medium text-gray-900 dark:text-white">Manage Users</div>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
            <AlertCircle className="h-6 w-6 text-orange-600 mb-2" />
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              Pending ({stats.pendingApprovals})
            </div>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{stat.change}</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {stat.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
            View all
          </button>
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);
            
            return (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.message}
                  </p>
                  {activity.user && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.user}
                    </p>
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.timestamp}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
