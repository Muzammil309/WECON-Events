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
      // Fetch real data from multiple endpoints
      const [staffResponse, tasksResponse, ticketsResponse, exhibitorsResponse] = await Promise.all([
        fetch('/api/admin/staff'),
        fetch('/api/admin/tasks'),
        fetch('/api/admin/tickets'),
        fetch('/api/admin/exhibitors')
      ]);

      const staffData = staffResponse.ok ? await staffResponse.json() : { staff: [] };
      const tasksData = tasksResponse.ok ? await tasksResponse.json() : { tasks: [] };
      const ticketsData = ticketsResponse.ok ? await ticketsResponse.json() : { tickets: [] };
      const exhibitorsData = exhibitorsResponse.ok ? await exhibitorsResponse.json() : { exhibitors: [] };

      // Calculate real statistics
      const totalStaff = staffData.staff?.length || 0;
      const activeStaff = staffData.staff?.filter((s: any) => s.status === 'ACTIVE').length || 0;
      const totalTasks = tasksData.tasks?.length || 0;
      const completedTasks = tasksData.tasks?.filter((t: any) => t.status === 'COMPLETED').length || 0;
      const totalRevenue = ticketsData.tickets?.reduce((sum: number, ticket: any) =>
        sum + (ticket.soldQuantity * ticket.price), 0) || 0;
      const totalExhibitors = exhibitorsData.exhibitors?.length || 0;
      const confirmedExhibitors = exhibitorsData.exhibitors?.filter((e: any) => e.status === 'CONFIRMED').length || 0;

      setDashboardStats({
        totalStaff,
        activeStaff,
        totalTasks,
        completedTasks,
        totalRevenue,
        totalExhibitors,
        confirmedExhibitors,
        eventProgress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        recentActivity: [
          { id: 1, type: 'staff', message: `${totalStaff} staff members registered`, time: 'Live data' },
          { id: 2, type: 'task', message: `${completedTasks} tasks completed`, time: 'Live data' },
          { id: 3, type: 'exhibitor', message: `${confirmedExhibitors} exhibitors confirmed`, time: 'Live data' },
          { id: 4, type: 'revenue', message: `$${totalRevenue.toLocaleString()} revenue generated`, time: 'Live data' }
        ],
        upcomingTasks: tasksData.tasks?.filter((t: any) => t.status === 'PENDING' || t.status === 'IN_PROGRESS')
          .slice(0, 3)
          .map((task: any) => ({
            id: task.id,
            title: task.title,
            due: new Date(task.dueDate).toLocaleDateString(),
            priority: task.priority.toLowerCase()
          })) || [],
        systemAlerts: [
          {
            id: 1,
            type: activeStaff === totalStaff ? 'success' : 'warning',
            message: `${activeStaff}/${totalStaff} staff members active`,
            action: 'View'
          },
          {
            id: 2,
            type: 'info',
            message: `${totalExhibitors - confirmedExhibitors} exhibitor applications pending`,
            action: 'Review'
          },
          {
            id: 3,
            type: completedTasks === totalTasks ? 'success' : 'info',
            message: `${completedTasks}/${totalTasks} tasks completed`,
            action: 'View'
          }
        ]
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Use fallback data
      setDashboardStats({
        totalStaff: 0,
        activeStaff: 0,
        totalTasks: 0,
        completedTasks: 0,
        totalRevenue: 0,
        totalExhibitors: 0,
        confirmedExhibitors: 0,
        eventProgress: 0,
        recentActivity: [
          { id: 1, type: 'info', message: 'No data available - Add staff, tasks, and exhibitors to see live statistics', time: 'System' }
        ],
        upcomingTasks: [],
        systemAlerts: [
          { id: 1, type: 'info', message: 'Dashboard ready - Start by adding staff members and creating tasks', action: 'Setup' }
        ]
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
        <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Total Staff</p>
              <p className="text-2xl font-bold text-white dark:text-white">{dashboardStats?.totalStaff?.toLocaleString()}</p>
              <p className="text-xs text-green-400 mt-1">{dashboardStats?.activeStaff} active</p>
            </div>
            <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Total Tasks</p>
              <p className="text-2xl font-bold text-white dark:text-white">{dashboardStats?.totalTasks}</p>
              <p className="text-xs text-green-400 mt-1">{dashboardStats?.completedTasks} completed</p>
            </div>
            <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center">
              <CheckSquare className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Total Revenue</p>
              <p className="text-2xl font-bold text-white dark:text-white">${dashboardStats?.totalRevenue?.toLocaleString()}</p>
              <p className="text-xs text-yellow-400 mt-1">From ticket sales</p>
            </div>
            <div className="w-12 h-12 bg-yellow-900/50 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Exhibitors</p>
              <p className="text-2xl font-bold text-white dark:text-white">{dashboardStats?.totalExhibitors}</p>
              <p className="text-xs text-purple-400 mt-1">{dashboardStats?.confirmedExhibitors} confirmed</p>
            </div>
            <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-white dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {dashboardStats?.recentActivity?.map((activity: any) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-200 dark:text-gray-200">{activity.message}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-white dark:text-white mb-4">Upcoming Tasks</h3>
          <div className="space-y-4">
            {dashboardStats?.upcomingTasks?.length > 0 ? dashboardStats.upcomingTasks.map((task: any) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-700 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-white dark:text-white">{task.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-400">Due: {task.due}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.priority === 'high' ? 'bg-red-900/50 text-red-300' :
                  task.priority === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
                  'bg-green-900/50 text-green-300'
                }`}>
                  {task.priority}
                </span>
              </div>
            )) : (
              <p className="text-gray-400 text-sm">No upcoming tasks</p>
            )}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-white dark:text-white mb-4">System Alerts</h3>
          <div className="space-y-4">
            {dashboardStats?.systemAlerts?.map((alert: any) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-700 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`h-4 w-4 ${
                    alert.type === 'warning' ? 'text-yellow-400' :
                    alert.type === 'info' ? 'text-blue-400' :
                    'text-green-400'
                  }`} />
                  <p className="text-sm text-gray-200 dark:text-gray-200">{alert.message}</p>
                </div>
                <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                  {alert.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enterprise Modules */}
      <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-white dark:text-white mb-6">Enterprise Modules</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <a href="/admin/staff" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors group">
            <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-800/50 transition-colors">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <h4 className="text-sm font-medium text-white dark:text-white text-center">Staff Management</h4>
            <p className="text-xs text-gray-400 dark:text-gray-400 text-center mt-1">Team hierarchy, scheduling, and performance</p>
          </a>

          <a href="/admin/tasks" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors group">
            <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-800/50 transition-colors">
              <CheckSquare className="h-6 w-6 text-green-400" />
            </div>
            <h4 className="text-sm font-medium text-white dark:text-white text-center">Task Management</h4>
            <p className="text-xs text-gray-400 dark:text-gray-400 text-center mt-1">Workflow and task management</p>
          </a>

          <a href="/admin/sessions" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors group">
            <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-800/50 transition-colors">
              <Calendar className="h-6 w-6 text-purple-400" />
            </div>
            <h4 className="text-sm font-medium text-white dark:text-white text-center">Sessions & Locations</h4>
            <p className="text-xs text-gray-400 dark:text-gray-400 text-center mt-1">Schedule builder and venue management</p>
          </a>

          <a href="/admin/exhibitions" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors group">
            <div className="w-12 h-12 bg-orange-900/50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-800/50 transition-colors">
              <Building className="h-6 w-6 text-orange-400" />
            </div>
            <h4 className="text-sm font-medium text-white dark:text-white text-center">Exhibitions</h4>
            <p className="text-xs text-gray-400 dark:text-gray-400 text-center mt-1">Exhibitor portal and booth management</p>
          </a>

          <a href="/admin/analytics" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors group">
            <div className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-800/50 transition-colors">
              <BarChart3 className="h-6 w-6 text-indigo-400" />
            </div>
            <h4 className="text-sm font-medium text-white dark:text-white text-center">Analytics & Logistics</h4>
            <p className="text-xs text-gray-400 dark:text-gray-400 text-center mt-1">Real-time analytics and reporting</p>
          </a>

          <a href="/admin/settings" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors group">
            <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-gray-500 transition-colors">
              <LayoutDashboard className="h-6 w-6 text-gray-300" />
            </div>
            <h4 className="text-sm font-medium text-white dark:text-white text-center">Settings</h4>
            <p className="text-xs text-gray-400 dark:text-gray-400 text-center mt-1">System configuration and preferences</p>
          </a>
        </div>
      </div>
    </div>
  );
}
