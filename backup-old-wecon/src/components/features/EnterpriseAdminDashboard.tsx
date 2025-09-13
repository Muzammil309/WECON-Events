'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Building,
  CheckSquare,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  Bell,
  Search,
  Plus,
  Activity,
  TrendingUp,
  DollarSign,
  Target,
  Award,
  Clock,
  MapPin,
  MessageSquare,
  Star,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

// Import all enterprise modules
import StaffManagement from './StaffManagement';
import TaskManagement from './TaskManagement';
import SessionLocationManagement from './SessionLocationManagement';
import ExhibitionManagement from './ExhibitionManagement';
import LogisticsAnalytics from './LogisticsAnalytics';

interface EnterpriseAdminDashboardProps {
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole: string;
}

export default function EnterpriseAdminDashboard({ 
  userId, 
  userName, 
  userAvatar, 
  userRole 
}: EnterpriseAdminDashboardProps) {
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const navigationItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard, description: 'Dashboard overview and key metrics' },
    { id: 'staff', name: 'Staff Management', icon: Users, description: 'Team hierarchy, scheduling, and performance' },
    { id: 'tasks', name: 'Task Management', icon: CheckSquare, description: 'Project tasks and workflow management' },
    { id: 'sessions', name: 'Sessions & Locations', icon: Calendar, description: 'Schedule builder and venue management' },
    { id: 'exhibitions', name: 'Exhibitions', icon: Building, description: 'Exhibitor portal and booth management' },
    { id: 'analytics', name: 'Analytics & Logistics', icon: BarChart3, description: 'Real-time analytics and reporting' },
    { id: 'settings', name: 'Settings', icon: Settings, description: 'System configuration and preferences' },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock comprehensive dashboard data
      const mockStats = {
        totalAttendees: 1247,
        totalStaff: 45,
        totalSessions: 67,
        totalExhibitors: 28,
        totalRevenue: 324500,
        engagementRate: 87.5,
        taskCompletion: 92.3,
        eventProgress: 78,
        recentActivity: [
          { type: 'staff', message: 'Sarah Johnson completed booth setup task', time: '5 min ago' },
          { type: 'attendee', message: 'New VIP registration: Tech Solutions Inc.', time: '12 min ago' },
          { type: 'session', message: 'AI Workshop session capacity reached', time: '18 min ago' },
          { type: 'exhibitor', message: 'DataFlow Analytics uploaded materials', time: '25 min ago' },
        ],
        upcomingTasks: [
          { title: 'Final venue setup check', priority: 'high', dueIn: '2 hours' },
          { title: 'Speaker briefing session', priority: 'medium', dueIn: '4 hours' },
          { title: 'Catering confirmation', priority: 'low', dueIn: '1 day' },
        ],
        systemAlerts: [
          { type: 'warning', message: 'Main Hall capacity at 95%', action: 'Review' },
          { type: 'info', message: '3 new exhibitor applications pending', action: 'Approve' },
          { type: 'success', message: 'All staff check-ins completed', action: 'View' },
        ]
      };
      setDashboardStats(mockStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={userAvatar} />
                  <AvatarFallback className="bg-white/30 text-white text-lg font-bold">
                    {userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  Welcome back, {userName}!
                </h1>
                <p className="text-blue-100 text-lg">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">Role: {userRole}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm">System Status: Online</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                onClick={() => setActiveView('analytics')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                onClick={() => setActiveView('tasks')}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Manage Tasks
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Attendees', value: dashboardStats?.totalAttendees?.toLocaleString() || '0', icon: Users, color: 'blue', change: '+12% from last event' },
          { label: 'Staff Members', value: dashboardStats?.totalStaff || '0', icon: Users, color: 'green', change: '45 active today' },
          { label: 'Total Revenue', value: `$${(dashboardStats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'purple', change: '+18% from target' },
          { label: 'Event Progress', value: `${dashboardStats?.eventProgress || 0}%`, icon: Target, color: 'orange', change: 'On track for completion' }
        ].map((metric, idx) => (
          <Card key={idx} className="shadow-sm bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-xs text-green-600 mt-1">{metric.change}</p>
                </div>
                <div className={`p-3 rounded-full bg-${metric.color}-100`}>
                  <metric.icon className={`h-6 w-6 text-${metric.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="shadow-sm bg-white border border-gray-200">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {dashboardStats?.recentActivity?.map((activity, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'staff' ? 'bg-blue-500' :
                    activity.type === 'attendee' ? 'bg-green-500' :
                    activity.type === 'session' ? 'bg-purple-500' : 'bg-orange-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="shadow-sm bg-white border border-gray-200">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">Upcoming Tasks</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {dashboardStats?.upcomingTasks?.map((task, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                    <p className="text-xs text-gray-500">Due in {task.dueIn}</p>
                  </div>
                  <Badge variant={
                    task.priority === 'high' ? 'destructive' :
                    task.priority === 'medium' ? 'default' : 'secondary'
                  } className="text-xs">
                    {task.priority}
                  </Badge>
                </div>
              ))}
              <Button size="sm" className="w-full" onClick={() => setActiveView('tasks')}>
                <Plus className="h-4 w-4 mr-2" />
                View All Tasks
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="shadow-sm bg-white border border-gray-200">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              <span className="text-lg font-semibold text-gray-900">System Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {dashboardStats?.systemAlerts?.map((alert, idx) => (
                <div key={idx} className={`p-3 border rounded-lg ${
                  alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                  alert.type === 'success' ? 'border-green-200 bg-green-50' :
                  'border-blue-200 bg-blue-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-900">{alert.message}</p>
                    <Button size="sm" variant="outline" className="text-xs">
                      {alert.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Quick Access */}
      <Card className="shadow-sm bg-white border border-gray-200">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            <span className="text-lg font-semibold text-gray-900">Enterprise Modules</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {navigationItems.filter(item => item.id !== 'overview').map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveView(module.id)}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center group"
              >
                <module.icon className="h-8 w-8 text-gray-600 group-hover:text-blue-600 mx-auto mb-2 transition-colors" />
                <h4 className="font-medium text-gray-900 text-sm mb-1">{module.name}</h4>
                <p className="text-xs text-gray-500">{module.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeView) {
      case 'overview':
        return renderOverview();
      case 'staff':
        return <StaffManagement />;
      case 'tasks':
        return <TaskManagement />;
      case 'sessions':
        return <SessionLocationManagement />;
      case 'exhibitions':
        return <ExhibitionManagement />;
      case 'analytics':
        return <LogisticsAnalytics />;
      case 'settings':
        return (
          <div className="text-center py-12">
            <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">System Settings</h3>
            <p className="text-gray-600 mb-4">Configure system preferences and integrations</p>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Open Settings
            </Button>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'fixed' : 'hidden'} lg:relative lg:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
      } w-64 h-screen overflow-hidden z-50 lg:z-auto`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className={`flex items-center gap-2 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    WECON
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Enterprise</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:block p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-6 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors group ${
                  sidebarCollapsed ? 'justify-center' : ''
                } ${
                  activeView === item.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={sidebarCollapsed ? item.name : ''}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* User menu */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {!sidebarCollapsed ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={userAvatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userRole}</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={userAvatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <button
                  className="p-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group relative"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    Sign out
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              <Button size="sm" variant="outline">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
