'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreVertical,
  UserPlus,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Star,
  Award,
  Target,
  TrendingUp,
  Activity,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Shield,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  avatarUrl?: string;
  isActive: boolean;
  lastLoginAt?: string;
  staffShifts: any[];
  assignedTasks: any[];
  _count: {
    assignedTasks: number;
    staffShifts: number;
  };
}

interface StaffManagementProps {
  eventId?: string;
}

export default function StaffManagement({ eventId }: StaffManagementProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [staffData, setStaffData] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddStaff, setShowAddStaff] = useState(false);

  const staffRoles = [
    { value: 'all', label: 'All Staff', count: 0 },
    { value: 'STAFF_MANAGER', label: 'Staff Managers', count: 0 },
    { value: 'ORGANIZER', label: 'Organizers', count: 0 },
    { value: 'STAFF', label: 'Staff', count: 0 },
    { value: 'VOLUNTEER', label: 'Volunteers', count: 0 },
  ];

  useEffect(() => {
    fetchStaffData();
  }, [eventId, selectedRole, searchTerm]);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const params = new URLSearchParams();
      if (eventId) params.append('eventId', eventId);
      if (selectedRole !== 'all') params.append('role', selectedRole);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/staff?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.ok) {
          setStaffData(result.staff);
        }
      }
    } catch (error) {
      console.error('Error fetching staff data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Staff Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Staff', value: staffData.length, icon: Users, color: 'blue', change: '+5 this week' },
          { label: 'Active Today', value: Math.floor(staffData.length * 0.8), icon: Activity, color: 'green', change: '+12% from yesterday' },
          { label: 'Tasks Assigned', value: staffData.reduce((sum, staff) => sum + staff._count.assignedTasks, 0), icon: Target, color: 'purple', change: '23 completed today' },
          { label: 'Shifts Scheduled', value: staffData.reduce((sum, staff) => sum + staff._count.staffShifts, 0), icon: Clock, color: 'orange', change: '8 shifts today' }
        ].map((stat, idx) => (
          <Card key={idx} className="shadow-sm bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Staff Hierarchy */}
      <Card className="shadow-sm bg-white border border-gray-200">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">Team Hierarchy</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {staffRoles.filter(role => role.value !== 'all').map((role, idx) => {
              const roleStaff = staffData.filter(staff => staff.role === role.value);
              return (
                <div key={role.value} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        role.value === 'STAFF_MANAGER' ? 'bg-red-500' :
                        role.value === 'ORGANIZER' ? 'bg-blue-500' :
                        role.value === 'STAFF' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <h4 className="font-semibold text-gray-900">{role.label}</h4>
                      <Badge variant="secondary">{roleStaff.length} members</Badge>
                    </div>
                    <Button size="sm" variant="outline">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add {role.label.slice(0, -1)}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {roleStaff.slice(0, 6).map((staff) => (
                      <div key={staff.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={staff.avatarUrl} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                            {staff.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{staff.name}</p>
                          <p className="text-xs text-gray-500 truncate">{staff.jobTitle || staff.email}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${staff.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      </div>
                    ))}
                    {roleStaff.length > 6 && (
                      <div className="flex items-center justify-center p-3 border rounded-lg border-dashed text-gray-500">
                        +{roleStaff.length - 6} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-sm bg-white border border-gray-200">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            <span className="text-lg font-semibold text-gray-900">Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[
              { user: 'Sarah Johnson', action: 'completed task', target: 'Setup Registration Desk', time: '5 minutes ago', type: 'success' },
              { user: 'Mike Chen', action: 'checked in for shift', target: 'Main Hall Security', time: '12 minutes ago', type: 'info' },
              { user: 'Lisa Wang', action: 'requested time off', target: 'Tomorrow 2-4 PM', time: '1 hour ago', type: 'warning' },
              { user: 'David Kim', action: 'submitted feedback', target: 'Event Setup Process', time: '2 hours ago', type: 'info' }
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStaffDirectory = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="shadow-sm bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {staffRoles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <Button onClick={() => setShowAddStaff(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Staff
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staff Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className="shadow-sm bg-white border border-gray-200 animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          staffData.map((staff) => (
            <Card key={staff.id} className="shadow-sm bg-white border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={staff.avatarUrl} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      staff.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{staff.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{staff.jobTitle || staff.role}</p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {staff.role.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Button size="sm" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{staff.email}</span>
                  </div>
                  {staff.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{staff.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tasks: {staff._count.assignedTasks}</span>
                    <span className="text-gray-600">Shifts: {staff._count.staffShifts}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="directory">Staff Directory</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="directory" className="mt-6">
          {renderStaffDirectory()}
        </TabsContent>

        <TabsContent value="scheduling" className="mt-6">
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Staff Scheduling</h3>
            <p className="text-gray-600 mb-4">Drag-and-drop scheduling interface coming soon</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Schedule
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Analytics</h3>
            <p className="text-gray-600 mb-4">Staff performance tracking and analytics</p>
            <Button>
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
