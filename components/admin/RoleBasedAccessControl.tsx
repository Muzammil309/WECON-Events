'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Users, 
  Key, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Save, 
  X, 
  Check, 
  AlertTriangle, 
  Clock, 
  Activity, 
  Lock, 
  Unlock, 
  UserCheck, 
  UserX, 
  Crown, 
  Star, 
  Building, 
  Megaphone, 
  CheckCircle, 
  XCircle, 
  MoreVertical,
  Copy,
  RefreshCw,
  Calendar,
  Globe,
  Database,
  FileText,
  Mail,
  MessageSquare,
  BarChart3,
  DollarSign,
  Zap,
  Monitor,
  Smartphone,
  QrCode
} from 'lucide-react'

interface Permission {
  id: string
  name: string
  description: string
  category: 'USER_MANAGEMENT' | 'EVENT_MANAGEMENT' | 'CONTENT_MANAGEMENT' | 'ANALYTICS_ACCESS' | 'FINANCIAL_ACCESS' | 'SYSTEM_ADMINISTRATION' | 'COMMUNICATION' | 'CHECK_IN_OPERATIONS' | 'SPEAKER_PORTAL' | 'SPONSOR_PORTAL'
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'PUBLISH' | 'MODERATE' | 'EXPORT' | 'IMPORT' | 'CONFIGURE'
  resource: string
}

interface RolePermission {
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EVENT_MANAGER' | 'MODERATOR' | 'SPEAKER' | 'SPONSOR' | 'ATTENDEE' | 'CHECK_IN_STAFF'
  permissions: Permission[]
}

interface UserPermissionOverride {
  id: string
  userId: string
  userName: string
  userEmail: string
  permission: Permission
  granted: boolean
  grantedAt: string
  grantedBy: string
  expiresAt?: string
}

interface AuditLogEntry {
  id: string
  userId: string
  userName: string
  action: string
  resourceType: string
  resourceId?: string
  oldValues?: any
  newValues?: any
  ipAddress: string
  userAgent: string
  createdAt: string
}

export default function RoleBasedAccessControl() {
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions' | 'users' | 'audit'>('roles')
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [userOverrides, setUserOverrides] = useState<UserPermissionOverride[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [selectedRole, setSelectedRole] = useState<string>('ADMIN')
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [showUserOverrideModal, setShowUserOverrideModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRBACData()
  }, [])

  const loadRBACData = async () => {
    try {
      // Mock RBAC data - In production, this would come from Supabase
      const mockPermissions: Permission[] = [
        {
          id: 'perm-1',
          name: 'Create Users',
          description: 'Ability to create new user accounts',
          category: 'USER_MANAGEMENT',
          action: 'CREATE',
          resource: 'users'
        },
        {
          id: 'perm-2',
          name: 'View Analytics',
          description: 'Access to analytics dashboard and reports',
          category: 'ANALYTICS_ACCESS',
          action: 'READ',
          resource: 'analytics'
        },
        {
          id: 'perm-3',
          name: 'Manage Events',
          description: 'Create, edit, and delete events',
          category: 'EVENT_MANAGEMENT',
          action: 'CREATE',
          resource: 'events'
        },
        {
          id: 'perm-4',
          name: 'Moderate Content',
          description: 'Moderate user-generated content and discussions',
          category: 'CONTENT_MANAGEMENT',
          action: 'MODERATE',
          resource: 'content'
        },
        {
          id: 'perm-5',
          name: 'Financial Reports',
          description: 'Access to financial data and revenue reports',
          category: 'FINANCIAL_ACCESS',
          action: 'READ',
          resource: 'financial_data'
        },
        {
          id: 'perm-6',
          name: 'System Configuration',
          description: 'Configure system settings and integrations',
          category: 'SYSTEM_ADMINISTRATION',
          action: 'CONFIGURE',
          resource: 'system_settings'
        },
        {
          id: 'perm-7',
          name: 'Send Communications',
          description: 'Send emails and notifications to attendees',
          category: 'COMMUNICATION',
          action: 'CREATE',
          resource: 'communications'
        },
        {
          id: 'perm-8',
          name: 'Check-in Operations',
          description: 'Perform attendee check-in and badge printing',
          category: 'CHECK_IN_OPERATIONS',
          action: 'UPDATE',
          resource: 'check_ins'
        }
      ]

      const mockRolePermissions: RolePermission[] = [
        {
          role: 'SUPER_ADMIN',
          permissions: mockPermissions // Super admin has all permissions
        },
        {
          role: 'ADMIN',
          permissions: mockPermissions.filter(p => 
            p.category !== 'SYSTEM_ADMINISTRATION' && p.category !== 'FINANCIAL_ACCESS'
          )
        },
        {
          role: 'EVENT_MANAGER',
          permissions: mockPermissions.filter(p => 
            ['EVENT_MANAGEMENT', 'CONTENT_MANAGEMENT', 'ANALYTICS_ACCESS', 'COMMUNICATION'].includes(p.category)
          )
        },
        {
          role: 'MODERATOR',
          permissions: mockPermissions.filter(p => 
            ['CONTENT_MANAGEMENT', 'COMMUNICATION'].includes(p.category)
          )
        },
        {
          role: 'CHECK_IN_STAFF',
          permissions: mockPermissions.filter(p => 
            p.category === 'CHECK_IN_OPERATIONS'
          )
        },
        {
          role: 'SPEAKER',
          permissions: mockPermissions.filter(p => 
            p.category === 'SPEAKER_PORTAL'
          )
        },
        {
          role: 'SPONSOR',
          permissions: mockPermissions.filter(p => 
            p.category === 'SPONSOR_PORTAL'
          )
        },
        {
          role: 'ATTENDEE',
          permissions: [] // Attendees have basic access through UI, no special permissions
        }
      ]

      const mockUserOverrides: UserPermissionOverride[] = [
        {
          id: 'override-1',
          userId: 'user-1',
          userName: 'Sarah Johnson',
          userEmail: 'sarah.johnson@techcorp.com',
          permission: mockPermissions[1],
          granted: true,
          grantedAt: '2024-03-10T14:30:00Z',
          grantedBy: 'admin-1',
          expiresAt: '2024-06-10T14:30:00Z'
        }
      ]

      const mockAuditLog: AuditLogEntry[] = [
        {
          id: 'audit-1',
          userId: 'admin-1',
          userName: 'Admin User',
          action: 'GRANT_PERMISSION',
          resourceType: 'user_permission',
          resourceId: 'user-1',
          oldValues: null,
          newValues: { permission: 'View Analytics', granted: true },
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0...',
          createdAt: '2024-03-10T14:30:00Z'
        },
        {
          id: 'audit-2',
          userId: 'admin-1',
          userName: 'Admin User',
          action: 'UPDATE_ROLE',
          resourceType: 'user',
          resourceId: 'user-2',
          oldValues: { role: 'ATTENDEE' },
          newValues: { role: 'MODERATOR' },
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0...',
          createdAt: '2024-03-09T10:15:00Z'
        }
      ]

      setPermissions(mockPermissions)
      setRolePermissions(mockRolePermissions)
      setUserOverrides(mockUserOverrides)
      setAuditLog(mockAuditLog)
    } catch (error) {
      console.error('Error loading RBAC data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return Crown
      case 'ADMIN': return Shield
      case 'EVENT_MANAGER': return Calendar
      case 'MODERATOR': return UserCheck
      case 'SPEAKER': return Megaphone
      case 'SPONSOR': return Building
      case 'CHECK_IN_STAFF': return QrCode
      case 'ATTENDEE': return Users
      default: return Users
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'USER_MANAGEMENT': return Users
      case 'EVENT_MANAGEMENT': return Calendar
      case 'CONTENT_MANAGEMENT': return FileText
      case 'ANALYTICS_ACCESS': return BarChart3
      case 'FINANCIAL_ACCESS': return DollarSign
      case 'SYSTEM_ADMINISTRATION': return Settings
      case 'COMMUNICATION': return Mail
      case 'CHECK_IN_OPERATIONS': return QrCode
      case 'SPEAKER_PORTAL': return Megaphone
      case 'SPONSOR_PORTAL': return Building
      default: return Key
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'text-purple-400 bg-purple-400/20'
      case 'ADMIN': return 'text-blue-400 bg-blue-400/20'
      case 'EVENT_MANAGER': return 'text-green-400 bg-green-400/20'
      case 'MODERATOR': return 'text-yellow-400 bg-yellow-400/20'
      case 'SPEAKER': return 'text-orange-400 bg-orange-400/20'
      case 'SPONSOR': return 'text-pink-400 bg-pink-400/20'
      case 'CHECK_IN_STAFF': return 'text-cyan-400 bg-cyan-400/20'
      case 'ATTENDEE': return 'text-gray-400 bg-gray-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const selectedRolePermissions = rolePermissions.find(rp => rp.role === selectedRole)?.permissions || []

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || permission.category === filterCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading RBAC configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Role-Based Access Control</h2>
          <p className="text-gray-400">Manage roles, permissions, and user access across the platform</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-secondary/20 text-secondary border border-secondary/30 rounded-lg hover:bg-secondary/30 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Config</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Permission</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
        {[
          { id: 'roles', label: 'Role Management', icon: Shield },
          { id: 'permissions', label: 'Permissions', icon: Key },
          { id: 'users', label: 'User Overrides', icon: Users },
          { id: 'audit', label: 'Audit Log', icon: Activity }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Role Management Tab */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Role Selection */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">System Roles</h3>
            <div className="space-y-2">
              {rolePermissions.map((rolePermission) => {
                const RoleIcon = getRoleIcon(rolePermission.role)
                return (
                  <button
                    key={rolePermission.role}
                    onClick={() => setSelectedRole(rolePermission.role)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      selectedRole === rolePermission.role
                        ? 'bg-primary/20 border border-primary/30'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <RoleIcon className="w-5 h-5 text-primary" />
                    <div className="flex-1 text-left">
                      <div className="text-white font-medium">
                        {rolePermission.role.replace('_', ' ')}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {rolePermission.permissions.length} permissions
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${getRoleColor(rolePermission.role)}`}>
                      {rolePermission.role}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Role Permissions */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {selectedRole.replace('_', ' ')} Permissions
              </h3>
              <button className="flex items-center space-x-2 px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded text-sm hover:bg-primary/30 transition-colors">
                <Edit className="w-3 h-3" />
                <span>Edit Role</span>
              </button>
            </div>

            <div className="space-y-3">
              {selectedRolePermissions.length > 0 ? (
                selectedRolePermissions.map((permission) => {
                  const CategoryIcon = getCategoryIcon(permission.category)
                  return (
                    <div
                      key={permission.id}
                      className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <CategoryIcon className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <div className="text-white font-medium">{permission.name}</div>
                        <div className="text-gray-400 text-sm">{permission.description}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-green-400/20 text-green-400 rounded-full text-xs">
                          {permission.action}
                        </span>
                        <span className="px-2 py-1 bg-blue-400/20 text-blue-400 rounded-full text-xs">
                          {permission.category.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <Key className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">No permissions assigned to this role</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              >
                <option value="all">All Categories</option>
                <option value="USER_MANAGEMENT">User Management</option>
                <option value="EVENT_MANAGEMENT">Event Management</option>
                <option value="CONTENT_MANAGEMENT">Content Management</option>
                <option value="ANALYTICS_ACCESS">Analytics Access</option>
                <option value="FINANCIAL_ACCESS">Financial Access</option>
                <option value="SYSTEM_ADMINISTRATION">System Administration</option>
                <option value="COMMUNICATION">Communication</option>
                <option value="CHECK_IN_OPERATIONS">Check-in Operations</option>
                <option value="SPEAKER_PORTAL">Speaker Portal</option>
                <option value="SPONSOR_PORTAL">Sponsor Portal</option>
              </select>
            </div>
          </div>

          {/* Permissions List */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Permission</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Action</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Resource</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredPermissions.map((permission) => {
                    const CategoryIcon = getCategoryIcon(permission.category)
                    return (
                      <motion.tr
                        key={permission.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <CategoryIcon className="w-5 h-5 text-primary" />
                            <div>
                              <div className="text-white font-medium">{permission.name}</div>
                              <div className="text-gray-400 text-sm">{permission.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-400/20 text-blue-400 rounded-full text-xs">
                            {permission.category.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-green-400/20 text-green-400 rounded-full text-xs">
                            {permission.action}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-300">{permission.resource}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-white transition-colors" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-white transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* User Overrides Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">User Permission Overrides</h3>
              <button
                onClick={() => setShowUserOverrideModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Override</span>
              </button>
            </div>

            <div className="space-y-3">
              {userOverrides.length > 0 ? (
                userOverrides.map((override) => (
                  <div
                    key={override.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {override.userName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-white font-medium">{override.userName}</div>
                        <div className="text-gray-400 text-sm">{override.userEmail}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-white font-medium">{override.permission.name}</div>
                        <div className="text-gray-400 text-sm">{override.permission.category.replace('_', ' ')}</div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        override.granted 
                          ? 'bg-green-400/20 text-green-400' 
                          : 'bg-red-400/20 text-red-400'
                      }`}>
                        {override.granted ? 'Granted' : 'Revoked'}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-gray-400 text-sm">
                          {override.expiresAt ? `Expires ${formatDateTime(override.expiresAt)}` : 'No expiration'}
                        </div>
                        <div className="text-gray-500 text-xs">
                          Granted {formatDateTime(override.grantedAt)}
                        </div>
                      </div>
                      
                      <button className="p-1 text-gray-400 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">No user permission overrides configured</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Permission Audit Log</h3>
            <p className="text-gray-400 text-sm">Track all permission-related changes for compliance</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Action</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Resource</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Changes</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {auditLog.map((entry) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">{entry.userName}</div>
                        <div className="text-gray-400 text-sm">{entry.ipAddress}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-400/20 text-blue-400 rounded-full text-xs">
                        {entry.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white">{entry.resourceType.replace('_', ' ')}</div>
                        {entry.resourceId && (
                          <div className="text-gray-400 text-sm">{entry.resourceId}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {entry.oldValues && (
                          <div className="text-red-400">
                            Old: {JSON.stringify(entry.oldValues)}
                          </div>
                        )}
                        {entry.newValues && (
                          <div className="text-green-400">
                            New: {JSON.stringify(entry.newValues)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300">{formatDateTime(entry.createdAt)}</div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
