'use client';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, CheckSquare, Calendar, Building, BarChart3, TrendingUp, AlertTriangle, Clock } from 'lucide-react';

export default function AdminOverview() {
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
      } else {
        // Fallback data for demo
        setDashboardStats({
          totalAttendees: 1247,
          staffMembers: 45,
          totalRevenue: 324500,
          eventProgress: 78,
          recentActivity: [
            { id: 1, type: 'registration', message: 'Sarah Johnson completed booth setup task', time: '2 min ago' },
            { id: 2, type: 'task', message: 'New VIP registration: Tech Solutions Inc.', time: '5 min ago' },
            { id: 3, type: 'session', message: 'AI Workshop session capacity reached', time: '12 min ago' },
            { id: 4, type: 'analytics', message: 'DataFlow Analytics uploaded materials', time: '18 min ago' }
          ],
          upcomingTasks: [
            { id: 1, title: 'Final venue setup check', due: '2 hours', priority: 'high' },
            { id: 2, title: 'Speaker briefing', due: '4 hours', priority: 'medium' },
            { id: 3, title: 'Catering confirmation', due: '1 day', priority: 'low' }
          ],
          systemAlerts: [
            { id: 1, type: 'warning', message: 'Main hall capacity at 95%', action: 'Review' },
            { id: 2, type: 'info', message: '3 new exhibitor applications pending', action: 'Review' },
            { id: 3, type: 'success', message: 'All staff check-ins completed', action: 'View' }
          ]
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Use fallback data
      setDashboardStats({
        totalAttendees: 1247,
        staffMembers: 45,
        totalRevenue: 324500,
        eventProgress: 78,
        recentActivity: [],
        upcomingTasks: [],
        systemAlerts: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Admin User!</h1>
            <p className="text-blue-100 mt-1">Saturday, August 30, 2025</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Role: SUPER_ADMIN
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                System Status: Online
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              View Analytics
            </button>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Manage Tasks
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Attendees</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats?.totalAttendees?.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">+12% from last event</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Staff Members</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats?.staffMembers}</p>
              <p className="text-xs text-green-600 mt-1">All active today</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${dashboardStats?.totalRevenue?.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">+8% from target</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Event Progress</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats?.eventProgress}%</p>
              <p className="text-xs text-blue-600 mt-1">On schedule</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {dashboardStats?.recentActivity?.map((activity: any) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
          <div className="space-y-4">
            {dashboardStats?.upcomingTasks?.map((task: any) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">Due in {task.due}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
          <div className="space-y-4">
            {dashboardStats?.systemAlerts?.map((alert: any) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`h-4 w-4 ${
                    alert.type === 'warning' ? 'text-yellow-500' :
                    alert.type === 'info' ? 'text-blue-500' :
                    'text-green-500'
                  }`} />
                  <p className="text-sm text-gray-900">{alert.message}</p>
                </div>
                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                  {alert.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enterprise Modules */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Enterprise Modules</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <a href="/admin/staff" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="text-sm font-medium text-gray-900 text-center">Staff Management</h4>
            <p className="text-xs text-gray-500 text-center mt-1">Team hierarchy, scheduling, and performance</p>
          </a>

          <a href="/admin/tasks" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
              <CheckSquare className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="text-sm font-medium text-gray-900 text-center">Task Management</h4>
            <p className="text-xs text-gray-500 text-center mt-1">Workflow and task management</p>
          </a>

          <a href="/admin/sessions" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="text-sm font-medium text-gray-900 text-center">Sessions & Locations</h4>
            <p className="text-xs text-gray-500 text-center mt-1">Schedule builder and venue management</p>
          </a>

          <a href="/admin/exhibitions" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
              <Building className="h-6 w-6 text-orange-600" />
            </div>
            <h4 className="text-sm font-medium text-gray-900 text-center">Exhibitions</h4>
            <p className="text-xs text-gray-500 text-center mt-1">Exhibitor portal and booth management</p>
          </a>

          <a href="/admin/analytics" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
            </div>
            <h4 className="text-sm font-medium text-gray-900 text-center">Analytics & Logistics</h4>
            <p className="text-xs text-gray-500 text-center mt-1">Real-time analytics and reporting</p>
          </a>

          <a href="/admin/settings" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-gray-200 transition-colors">
              <LayoutDashboard className="h-6 w-6 text-gray-600" />
            </div>
            <h4 className="text-sm font-medium text-gray-900 text-center">Settings</h4>
            <p className="text-xs text-gray-500 text-center mt-1">System configuration and preferences</p>
          </a>
        </div>
      </div>
    </div>
  );
}
