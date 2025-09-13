'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ModernDashboardLayout, { 
  DashboardCard, 
  StatsGrid, 
  QuickActions, 
  RecentActivity 
} from '@/components/layout/ModernDashboardLayout';
import { 
  Calendar, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Plus,
  Settings,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function ModernDashboardPage() {
  const mockUser = {
    name: 'John Doe',
    email: 'john@wecon.com',
    role: 'Admin'
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  // Mock data for dashboard
  const stats = [
    {
      label: 'Total Events',
      value: '24',
      change: { value: 12, type: 'increase' as const },
      icon: <Calendar className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    {
      label: 'Total Attendees',
      value: '12,847',
      change: { value: 8, type: 'increase' as const },
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-br from-purple-500 to-pink-500'
    },
    {
      label: 'Revenue',
      value: '$284,590',
      change: { value: 15, type: 'increase' as const },
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-br from-green-500 to-emerald-500'
    },
    {
      label: 'Avg. Rating',
      value: '4.8',
      change: { value: 2, type: 'decrease' as const },
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-br from-orange-500 to-red-500'
    }
  ];

  const quickActions = [
    {
      label: 'Create Event',
      description: 'Set up a new event',
      icon: <Plus className="w-5 h-5" />,
      onClick: () => console.log('Create event'),
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    {
      label: 'Add Attendees',
      description: 'Import or add attendees',
      icon: <Users className="w-5 h-5" />,
      onClick: () => console.log('Add attendees'),
      color: 'bg-gradient-to-br from-purple-500 to-pink-500'
    },
    {
      label: 'View Analytics',
      description: 'Check event performance',
      icon: <BarChart3 className="w-5 h-5" />,
      onClick: () => console.log('View analytics'),
      color: 'bg-gradient-to-br from-green-500 to-emerald-500'
    },
    {
      label: 'Send Message',
      description: 'Communicate with attendees',
      icon: <MessageSquare className="w-5 h-5" />,
      onClick: () => console.log('Send message'),
      color: 'bg-gradient-to-br from-orange-500 to-red-500'
    },
    {
      label: 'Export Data',
      description: 'Download reports',
      icon: <Download className="w-5 h-5" />,
      onClick: () => console.log('Export data'),
      color: 'bg-gradient-to-br from-teal-500 to-blue-500'
    },
    {
      label: 'Settings',
      description: 'Configure platform',
      icon: <Settings className="w-5 h-5" />,
      onClick: () => console.log('Settings'),
      color: 'bg-gradient-to-br from-indigo-500 to-purple-500'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'event_created',
      title: 'New Event Created',
      description: 'Tech Conference 2024 has been created and published',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      user: { name: 'Sarah Johnson' },
      status: 'success' as const
    },
    {
      id: '2',
      type: 'attendee_registered',
      title: 'Bulk Registration',
      description: '45 new attendees registered for AI Summit',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      user: { name: 'Michael Chen' },
      status: 'info' as const
    },
    {
      id: '3',
      type: 'payment_received',
      title: 'Payment Processed',
      description: '$2,450 received for premium tickets',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      user: { name: 'Emily Rodriguez' },
      status: 'success' as const
    },
    {
      id: '4',
      type: 'session_updated',
      title: 'Session Modified',
      description: 'Keynote session time updated',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      user: { name: 'David Kim' },
      status: 'warning' as const
    },
    {
      id: '5',
      type: 'integration_sync',
      title: 'CRM Sync Completed',
      description: 'Salesforce integration synchronized 120 contacts',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      status: 'success' as const
    }
  ];

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Modern Dashboard' }
  ];

  const pageActions = (
    <>
      <button className="btn btn-secondary">
        <Download className="w-4 h-4" />
        Export
      </button>
      <button className="btn btn-primary">
        <Plus className="w-4 h-4" />
        Create Event
      </button>
    </>
  );

  return (
    <ModernDashboardLayout
      user={mockUser}
      onLogout={handleLogout}
      pageTitle="Modern Dashboard"
      pageDescription="Welcome to your modern event management dashboard with real-time insights and powerful tools."
      breadcrumbs={breadcrumbs}
      actions={pageActions}
    >
      {/* Stats Grid */}
      <StatsGrid stats={stats} />

      {/* Quick Actions */}
      <QuickActions actions={quickActions} />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity activities={recentActivities} />
        </div>

        {/* Side Panel */}
        <div className="space-y-8">
          {/* Upcoming Events */}
          <DashboardCard title="Upcoming Events">
            <div className="space-y-4">
              {[
                {
                  title: 'Tech Conference 2024',
                  date: 'Dec 15, 2024',
                  attendees: 1250,
                  status: 'Published'
                },
                {
                  title: 'AI Summit',
                  date: 'Dec 20, 2024',
                  attendees: 890,
                  status: 'Draft'
                },
                {
                  title: 'Startup Pitch Day',
                  date: 'Jan 5, 2025',
                  attendees: 450,
                  status: 'Published'
                }
              ].map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg hover:bg-surface-tertiary transition-colors duration-200"
                >
                  <div>
                    <h4 className="font-medium text-text-primary text-sm">
                      {event.title}
                    </h4>
                    <p className="text-xs text-text-muted mt-1">
                      {event.date} • {event.attendees} attendees
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === 'Published' 
                      ? 'bg-success/20 text-success' 
                      : 'bg-warning/20 text-warning'
                  }`}>
                    {event.status}
                  </div>
                </motion.div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-accent-blue hover:text-accent-blue-light transition-colors duration-200">
              View All Events →
            </button>
          </DashboardCard>

          {/* System Status */}
          <DashboardCard title="System Status">
            <div className="space-y-4">
              {[
                { label: 'API Status', status: 'Operational', color: 'success' },
                { label: 'Database', status: 'Operational', color: 'success' },
                { label: 'Email Service', status: 'Operational', color: 'success' },
                { label: 'File Storage', status: 'Degraded', color: 'warning' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      item.color === 'success' ? 'bg-success' : 
                      item.color === 'warning' ? 'bg-warning' : 'bg-error'
                    }`} />
                    <span className={`text-xs font-medium ${
                      item.color === 'success' ? 'text-success' : 
                      item.color === 'warning' ? 'text-warning' : 'text-error'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Performance Metrics */}
          <DashboardCard title="Performance">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Response Time</span>
                <span className="text-sm font-medium text-text-primary">245ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Uptime</span>
                <span className="text-sm font-medium text-success">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Active Users</span>
                <span className="text-sm font-medium text-text-primary">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Cache Hit Rate</span>
                <span className="text-sm font-medium text-success">87%</span>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </ModernDashboardLayout>
  );
}
