'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart3,
  Users,
  Calendar,
  Ticket,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Building2,
  Award,
  Clock,
  MapPin,
  Wifi,
  AlertTriangle,
  DollarSign,
  Eye,
  MessageSquare,
  Star,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyticsData {
  totalUsers: number;
  totalEvents: number;
  totalTickets: number;
  revenue: number;
  userGrowth: number;
  eventGrowth: number;
  ticketSales: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
  // Phase 3 Advanced Analytics
  realTimeMetrics: {
    activeUsers: number;
    liveStreams: number;
    digitalSignageViews: number;
    mobileAppSessions: number;
  };
  sponsorshipMetrics: {
    totalValue: number;
    activeSponsors: number;
    conversionRate: number;
    avgDealSize: number;
  };
  staffMetrics: {
    totalStaff: number;
    activeNow: number;
    taskCompletion: number;
    avgResponseTime: number;
  };
  contentMetrics: {
    totalContent: number;
    publishedToday: number;
    totalViews: number;
    engagementRate: number;
  };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - replace with actual API call
    const fetchAnalytics = async () => {
      try {
        // Mock data for now
        const mockData: AnalyticsData = {
          totalUsers: 1247,
          totalEvents: 12,
          totalTickets: 3456,
          revenue: 125000,
          userGrowth: 12.5,
          eventGrowth: 8.3,
          ticketSales: 23.7,
          recentActivity: [
            {
              id: '1',
              type: 'user_registration',
              description: 'New user registered: john@example.com',
              timestamp: '2024-01-15T10:30:00Z'
            },
            {
              id: '2',
              type: 'ticket_purchase',
              description: 'Ticket purchased for WECON Masawat 2024',
              timestamp: '2024-01-15T09:15:00Z'
            },
            {
              id: '3',
              type: 'event_created',
              description: 'New event created: Tech Workshop',
              timestamp: '2024-01-14T16:45:00Z'
            }
          ],
          // Phase 3 Advanced Analytics
          realTimeMetrics: {
            activeUsers: 342,
            liveStreams: 3,
            digitalSignageViews: 1250,
            mobileAppSessions: 89
          },
          sponsorshipMetrics: {
            totalValue: 90000,
            activeSponsors: 8,
            conversionRate: 65.5,
            avgDealSize: 11250
          },
          staffMetrics: {
            totalStaff: 35,
            activeNow: 28,
            taskCompletion: 87.5,
            avgResponseTime: 4.2
          },
          contentMetrics: {
            totalContent: 156,
            publishedToday: 12,
            totalViews: 8950,
            engagementRate: 73.8
          }
        };
        
        setAnalytics(mockData);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load analytics data</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: analytics.totalUsers.toLocaleString(),
      icon: Users,
      growth: analytics.userGrowth,
      color: 'text-blue-600'
    },
    {
      title: 'Total Events',
      value: analytics.totalEvents.toString(),
      icon: Calendar,
      growth: analytics.eventGrowth,
      color: 'text-green-600'
    },
    {
      title: 'Tickets Sold',
      value: analytics.totalTickets.toLocaleString(),
      icon: Ticket,
      growth: analytics.ticketSales,
      color: 'text-purple-600'
    },
    {
      title: 'Revenue',
      value: `$${(analytics.revenue / 1000).toFixed(0)}K`,
      icon: BarChart3,
      growth: 15.2,
      color: 'text-orange-600'
    }
  ];

  // Phase 3 Advanced Analytics Stats
  const realTimeStats = [
    {
      title: 'Active Users',
      value: analytics.realTimeMetrics.activeUsers.toString(),
      icon: Activity,
      color: 'text-green-600',
      description: 'Currently online'
    },
    {
      title: 'Live Streams',
      value: analytics.realTimeMetrics.liveStreams.toString(),
      icon: Zap,
      color: 'text-red-600',
      description: 'Active sessions'
    },
    {
      title: 'Signage Views',
      value: analytics.realTimeMetrics.digitalSignageViews.toLocaleString(),
      icon: Monitor,
      color: 'text-blue-600',
      description: 'Today'
    },
    {
      title: 'Mobile Sessions',
      value: analytics.realTimeMetrics.mobileAppSessions.toString(),
      icon: Smartphone,
      color: 'text-purple-600',
      description: 'Active now'
    }
  ];

  const sponsorshipStats = [
    {
      title: 'Total Value',
      value: `$${(analytics.sponsorshipMetrics.totalValue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Sponsors',
      value: analytics.sponsorshipMetrics.activeSponsors.toString(),
      icon: Building2,
      color: 'text-blue-600'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.sponsorshipMetrics.conversionRate}%`,
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Avg Deal Size',
      value: `$${analytics.sponsorshipMetrics.avgDealSize.toLocaleString()}`,
      icon: Award,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Advanced Analytics</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time insights across all platform components and user engagement metrics
          </p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                  {stat.growth > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={stat.growth > 0 ? 'text-green-500' : 'text-red-500'}>
                    {stat.growth > 0 ? '+' : ''}{stat.growth}%
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest events and user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-xs text-gray-400 capitalize">
                  {activity.type.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-time Metrics
          </CardTitle>
          <CardDescription>Live platform activity and engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {realTimeStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sponsorship Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Sponsorship Performance
          </CardTitle>
          <CardDescription>Revenue and partnership metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsorshipStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Staff & Content Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Staff Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Staff</span>
                <span className="font-semibold">{analytics.staffMetrics.totalStaff}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Now</span>
                <span className="font-semibold text-green-600">{analytics.staffMetrics.activeNow}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Task Completion</span>
                <span className="font-semibold">{analytics.staffMetrics.taskCompletion}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</span>
                <span className="font-semibold">{analytics.staffMetrics.avgResponseTime}min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Content</span>
                <span className="font-semibold">{analytics.contentMetrics.totalContent}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Published Today</span>
                <span className="font-semibold text-blue-600">{analytics.contentMetrics.publishedToday}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Views</span>
                <span className="font-semibold">{analytics.contentMetrics.totalViews.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</span>
                <span className="font-semibold">{analytics.contentMetrics.engagementRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
