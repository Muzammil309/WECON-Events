'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  CheckSquare,
  TrendingUp,
  Clock,
  MapPin,
  Bell,
  Activity,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface DashboardStats {
  overview: {
    totalEvents: number;
    activeEvents: number;
    completedEvents: number;
    totalSessions: number;
    activeSessions: number;
    totalTasks: number;
    pendingTasks: number;
    completedTasks: number;
    totalAttendees: number;
    todayRegistrations: number;
    weeklyRegistrations: number;
    totalStaff: number;
    activeStaff: number;
    totalVenues: number;
    totalSponsors: number;
  };
  performance: {
    taskCompletionRate: number;
    eventCompletionRate: number;
    averageSessionsPerEvent: number;
    averageAttendeesPerEvent: number;
  };
  upcoming: {
    sessions: {
      id: string;
      title: string;
      startAt: string;
      eventName: string;
      roomName?: string;
      venueName?: string;
    }[];
  };
  recent: {
    tasks: {
      id: string;
      title: string;
      status: string;
      priority: string;
      dueDate?: string;
      assigneeName?: string;
      eventName: string;
    }[];
    notifications: {
      id: string;
      title: string;
      message: string;
      type: string;
      createdAt: string;
      isRead: boolean;
    }[];
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('ATTENDEE');
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    fetchDashboardData();
    fetchUserInfo();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch comprehensive dashboard statistics
      const response = await fetch('/api/dashboard/stats');

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        console.error('Failed to fetch dashboard stats:', response.statusText);
        // Fallback to empty stats structure
        setStats({
          overview: {
            totalEvents: 0,
            activeEvents: 0,
            completedEvents: 0,
            totalSessions: 0,
            activeSessions: 0,
            totalTasks: 0,
            pendingTasks: 0,
            completedTasks: 0,
            totalAttendees: 0,
            todayRegistrations: 0,
            weeklyRegistrations: 0,
            totalStaff: 0,
            activeStaff: 0,
            totalVenues: 0,
            totalSponsors: 0
          },
          performance: {
            taskCompletionRate: 0,
            eventCompletionRate: 0,
            averageSessionsPerEvent: 0,
            averageAttendeesPerEvent: 0
          },
          upcoming: {
            sessions: []
          },
          recent: {
            tasks: [],
            notifications: []
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set empty stats on error
      setStats({
        overview: {
          totalEvents: 0,
          activeEvents: 0,
          completedEvents: 0,
          totalSessions: 0,
          activeSessions: 0,
          totalTasks: 0,
          pendingTasks: 0,
          completedTasks: 0,
          totalAttendees: 0,
          todayRegistrations: 0,
          weeklyRegistrations: 0,
          totalStaff: 0,
          activeStaff: 0,
          totalVenues: 0,
          totalSponsors: 0
        },
        performance: {
          taskCompletionRate: 0,
          eventCompletionRate: 0,
          averageSessionsPerEvent: 0,
          averageAttendeesPerEvent: 0
        },
        upcoming: {
          sessions: []
        },
        recent: {
          tasks: [],
          notifications: []
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      // This would fetch actual user info from JWT or API
      setUserRole('ADMIN');
      setUserName('John Doe');
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeUntil = (dateString: string) => {
    const now = new Date();
    const target = new Date(dateString);
    const diffMs = target.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `in ${diffHours}h ${diffMins}m`;
    } else if (diffMins > 0) {
      return `in ${diffMins}m`;
    } else {
      return 'now';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'REVIEW': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole={userRole} userName={userName}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole={userRole} userName={userName}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your events today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.overview.totalEvents || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.overview.activeEvents || 0} active, {stats?.overview.completedEvents || 0} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.overview.activeSessions || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.overview.totalSessions || 0} total sessions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.overview.pendingTasks || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.performance.taskCompletionRate || 0}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.overview.totalAttendees || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{stats?.overview.todayRegistrations || 0} today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.overview.totalStaff || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.overview.activeStaff || 0} currently active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Venues</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.overview.totalVenues || 0}</div>
              <p className="text-xs text-muted-foreground">
                Across all events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sponsors</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.overview.totalSponsors || 0}</div>
              <p className="text-xs text-muted-foreground">
                Partnership opportunities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats?.overview.weeklyRegistrations || 0}</div>
              <p className="text-xs text-muted-foreground">
                New registrations this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats?.upcoming.sessions.map(session => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium line-clamp-1">{session.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span>{formatTime(session.startAt)}</span>
                      <span className="text-blue-600">{session.eventName}</span>
                      {session.roomName && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{session.venueName ? `${session.venueName} - ${session.roomName}` : session.roomName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline">
                    {getTimeUntil(session.startAt)}
                  </Badge>
                </div>
              ))}
              {stats?.upcoming.sessions.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No upcoming sessions
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Recent Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats?.recent.tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium line-clamp-1">{task.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getStatusColor(task.status)}`}
                      >
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </Badge>
                      <span className="text-xs text-blue-600">{task.eventName}</span>
                      {task.assigneeName && (
                        <span className="text-xs text-gray-500">→ {task.assigneeName}</span>
                      )}
                    </div>
                  </div>
                  {task.dueDate && (
                    <div className="text-sm text-gray-600">
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
              {stats?.recent.tasks.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No recent tasks
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recent.notifications.map(notification => (
                <div key={notification.id} className={`flex items-start gap-3 p-3 rounded-lg ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'}`}>
                  <div className="flex-1">
                    <h4 className={`font-medium ${!notification.isRead ? 'text-blue-900' : ''}`}>
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant="outline" className="text-xs">
                      {notification.type}
                    </Badge>
                    {!notification.isRead && (
                      <Badge variant="default" className="text-xs bg-blue-600">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              {stats?.recent.notifications.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No recent notifications
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
