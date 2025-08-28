'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Clock,
  Shield,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Badge as BadgeIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  Crown,
  Star,
  Settings
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'super_admin' | 'staff_manager' | 'sponsor_manager' | 'staff' | 'volunteer';
  department: string;
  position: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'on_break' | 'checked_out';
  permissions: string[];
  assignedTasks: number;
  completedTasks: number;
  currentLocation?: string;
  shiftStart?: string;
  shiftEnd?: string;
  lastSeen: Date;
  joinedAt: Date;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes: string;
}

interface Department {
  id: string;
  name: string;
  manager: string;
  staffCount: number;
  color: string;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [activeTab, setActiveTab] = useState<'staff' | 'hierarchy' | 'shifts' | 'tasks'>('staff');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockStaff: StaffMember[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@wecon-masawat.com',
        phone: '+92 300 1234567',
        role: 'staff_manager',
        department: 'Operations',
        position: 'Operations Manager',
        status: 'active',
        permissions: ['manage_staff', 'view_analytics', 'manage_tasks'],
        assignedTasks: 12,
        completedTasks: 8,
        currentLocation: 'Main Hall',
        shiftStart: '08:00',
        shiftEnd: '18:00',
        lastSeen: new Date(),
        joinedAt: new Date('2024-01-15'),
        emergencyContact: {
          name: 'John Johnson',
          phone: '+92 300 9876543',
          relationship: 'Spouse'
        },
        notes: 'Excellent team leader, very reliable'
      },
      {
        id: '2',
        name: 'Ahmed Khan',
        email: 'ahmed@wecon-masawat.com',
        phone: '+92 321 9876543',
        role: 'sponsor_manager',
        department: 'Partnerships',
        position: 'Sponsor Relations Manager',
        status: 'active',
        permissions: ['manage_sponsors', 'view_analytics'],
        assignedTasks: 8,
        completedTasks: 6,
        currentLocation: 'VIP Lounge',
        shiftStart: '09:00',
        shiftEnd: '17:00',
        lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        joinedAt: new Date('2024-02-01'),
        emergencyContact: {
          name: 'Fatima Khan',
          phone: '+92 321 1111111',
          relationship: 'Sister'
        },
        notes: 'Great with sponsor relationships'
      },
      {
        id: '3',
        name: 'Maria Rodriguez',
        email: 'maria@wecon-masawat.com',
        phone: '+92 333 5555555',
        role: 'staff',
        department: 'Registration',
        position: 'Registration Assistant',
        status: 'active',
        permissions: ['manage_attendees', 'check_in'],
        assignedTasks: 15,
        completedTasks: 12,
        currentLocation: 'Registration Desk',
        shiftStart: '07:00',
        shiftEnd: '15:00',
        lastSeen: new Date(),
        joinedAt: new Date('2024-02-10'),
        emergencyContact: {
          name: 'Carlos Rodriguez',
          phone: '+92 333 7777777',
          relationship: 'Father'
        },
        notes: 'Very efficient with attendee check-ins'
      },
      {
        id: '4',
        name: 'David Chen',
        email: 'david@wecon-masawat.com',
        phone: '+92 345 1111111',
        role: 'volunteer',
        department: 'Support',
        position: 'Event Volunteer',
        status: 'on_break',
        permissions: ['basic_access'],
        assignedTasks: 6,
        completedTasks: 4,
        currentLocation: 'Break Room',
        shiftStart: '10:00',
        shiftEnd: '16:00',
        lastSeen: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        joinedAt: new Date('2024-02-20'),
        emergencyContact: {
          name: 'Lisa Chen',
          phone: '+92 345 2222222',
          relationship: 'Mother'
        },
        notes: 'Enthusiastic volunteer, always helpful'
      }
    ];

    const mockDepartments: Department[] = [
      { id: '1', name: 'Operations', manager: 'Sarah Johnson', staffCount: 8, color: 'bg-blue-500' },
      { id: '2', name: 'Partnerships', manager: 'Ahmed Khan', staffCount: 4, color: 'bg-green-500' },
      { id: '3', name: 'Registration', manager: 'Maria Rodriguez', staffCount: 6, color: 'bg-purple-500' },
      { id: '4', name: 'Support', manager: 'David Chen', staffCount: 12, color: 'bg-orange-500' },
      { id: '5', name: 'Technical', manager: 'Alex Thompson', staffCount: 5, color: 'bg-red-500' }
    ];

    setStaff(mockStaff);
    setDepartments(mockDepartments);
    setIsLoading(false);
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="h-4 w-4" />;
      case 'staff_manager': return <Shield className="h-4 w-4" />;
      case 'sponsor_manager': return <Star className="h-4 w-4" />;
      case 'staff': return <Users className="h-4 w-4" />;
      case 'volunteer': return <BadgeIcon className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'staff_manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'sponsor_manager': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'staff': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'volunteer': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'on_break': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'checked_out': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <XCircle className="h-4 w-4" />;
      case 'on_break': return <AlertCircle className="h-4 w-4" />;
      case 'checked_out': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  const StaffTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Management</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage staff members, roles, and permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Staff Member
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Staff</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{staff.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Active Now</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {staff.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">On Break</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {staff.filter(s => s.status === 'on_break').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Managers</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {staff.filter(s => s.role.includes('manager')).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="staff_manager">Staff Manager</option>
          <option value="sponsor_manager">Sponsor Manager</option>
          <option value="staff">Staff</option>
          <option value="volunteer">Volunteer</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="on_break">On Break</option>
          <option value="checked_out">Checked Out</option>
        </select>

        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.name}>{dept.name}</option>
          ))}
        </select>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{member.position}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                  {getRoleIcon(member.role)}
                  {member.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                  {getStatusIcon(member.status)}
                  {member.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>

              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Phone className="h-3 w-3" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <MapPin className="h-3 w-3" />
                  <span>{member.department}</span>
                </div>
                {member.currentLocation && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <MapPin className="h-3 w-3" />
                    <span>Currently: {member.currentLocation}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Tasks: {member.completedTasks}/{member.assignedTasks}</span>
                  <span>
                    {member.shiftStart && member.shiftEnd 
                      ? `${member.shiftStart} - ${member.shiftEnd}`
                      : 'No shift assigned'
                    }
                  </span>
                </div>
                <div className="mt-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-indigo-600 h-1.5 rounded-full" 
                      style={{ width: `${(member.completedTasks / member.assignedTasks) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage staff hierarchy, roles, and assignments</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'staff', label: 'Staff Members', icon: Users },
              { id: 'hierarchy', label: 'Hierarchy', icon: Shield },
              { id: 'shifts', label: 'Shifts', icon: Clock },
              { id: 'tasks', label: 'Tasks', icon: CheckCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'staff' && <StaffTab />}
        {activeTab === 'hierarchy' && (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Staff Hierarchy</h3>
            <p className="text-gray-600 dark:text-gray-300">Organizational chart coming soon</p>
          </div>
        )}
        {activeTab === 'shifts' && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Shift Management</h3>
            <p className="text-gray-600 dark:text-gray-300">Shift scheduling coming soon</p>
          </div>
        )}
        {activeTab === 'tasks' && (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Task Management</h3>
            <p className="text-gray-600 dark:text-gray-300">Task assignment coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
