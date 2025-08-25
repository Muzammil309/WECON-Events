'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Calendar, Ticket, TrendingUp, TrendingDown } from 'lucide-react';
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
          ]
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your event performance and user engagement
        </p>
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
    </div>
  );
}
