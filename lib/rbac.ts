// RBAC (Role-Based Access Control) Utilities for WECON Platform
// Phase 3: Advanced Platform Features

import { createClient } from '@supabase/supabase-js'

// Types for RBAC system
export type UserRole = 
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'EVENT_MANAGER'
  | 'MODERATOR'
  | 'SPEAKER'
  | 'SPONSOR'
  | 'ATTENDEE'
  | 'CHECK_IN_STAFF'

export type PermissionCategory = 
  | 'USER_MANAGEMENT'
  | 'EVENT_MANAGEMENT'
  | 'CONTENT_MANAGEMENT'
  | 'ANALYTICS_ACCESS'
  | 'FINANCIAL_ACCESS'
  | 'SYSTEM_ADMINISTRATION'
  | 'COMMUNICATION'
  | 'CHECK_IN_OPERATIONS'
  | 'SPEAKER_PORTAL'
  | 'SPONSOR_PORTAL'

export type PermissionAction = 
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'APPROVE'
  | 'PUBLISH'
  | 'MODERATE'
  | 'EXPORT'
  | 'IMPORT'
  | 'CONFIGURE'

export interface Permission {
  id: string
  name: string
  description: string
  category: PermissionCategory
  action: PermissionAction
  resource: string
  created_at: string
  updated_at: string
}

export interface RolePermission {
  id: string
  role: UserRole
  permission_id: string
  granted_at: string
  granted_by: string
}

export interface UserPermissionOverride {
  id: string
  user_id: string
  permission_id: string
  granted: boolean
  granted_at: string
  granted_by: string
  expires_at?: string
}

export interface PermissionAuditLog {
  id: string
  user_id: string
  action: string
  resource_type: string
  resource_id?: string
  old_values?: any
  new_values?: any
  ip_address: string
  user_agent: string
  created_at: string
}

// Default permissions for each role
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPER_ADMIN: [
    'user_management.*',
    'event_management.*',
    'content_management.*',
    'analytics_access.*',
    'financial_access.*',
    'system_administration.*',
    'communication.*',
    'check_in_operations.*',
    'speaker_portal.*',
    'sponsor_portal.*'
  ],
  ADMIN: [
    'user_management.read',
    'user_management.update',
    'event_management.*',
    'content_management.*',
    'analytics_access.*',
    'communication.*',
    'check_in_operations.*'
  ],
  EVENT_MANAGER: [
    'event_management.*',
    'content_management.*',
    'analytics_access.read',
    'communication.create',
    'communication.read'
  ],
  MODERATOR: [
    'content_management.moderate',
    'content_management.read',
    'content_management.update',
    'communication.moderate'
  ],
  SPEAKER: [
    'speaker_portal.*',
    'content_management.read',
    'event_management.read'
  ],
  SPONSOR: [
    'sponsor_portal.*',
    'analytics_access.read',
    'event_management.read'
  ],
  CHECK_IN_STAFF: [
    'check_in_operations.*',
    'user_management.read'
  ],
  ATTENDEE: [
    'event_management.read',
    'content_management.read'
  ]
}

// RBAC utility class
export class RBACManager {
  private supabase: any

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient
  }

  // Check if user has specific permission
  async hasPermission(
    userId: string, 
    permission: string, 
    resource?: string
  ): Promise<boolean> {
    try {
      // Get user role
      const { data: user, error: userError } = await this.supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      if (userError || !user) return false

      // Check role-based permissions
      const rolePermissions = DEFAULT_ROLE_PERMISSIONS[user.role as UserRole] || []
      const hasRolePermission = this.checkPermissionMatch(permission, rolePermissions)

      if (hasRolePermission) return true

      // Check user-specific permission overrides
      const { data: userPermissions, error: permError } = await this.supabase
        .from('user_permissions')
        .select(`
          granted,
          expires_at,
          permissions (
            name,
            category,
            action,
            resource
          )
        `)
        .eq('user_id', userId)
        .eq('granted', true)

      if (permError) return false

      // Check if user has explicit permission
      for (const userPerm of userPermissions || []) {
        if (userPerm.expires_at && new Date(userPerm.expires_at) < new Date()) {
          continue // Permission expired
        }

        const permissionString = `${userPerm.permissions.category.toLowerCase()}.${userPerm.permissions.action.toLowerCase()}`
        if (this.checkPermissionMatch(permission, [permissionString])) {
          return true
        }
      }

      return false
    } catch (error) {
      console.error('Error checking permission:', error)
      return false
    }
  }

  // Check if permission matches against permission patterns
  private checkPermissionMatch(permission: string, patterns: string[]): boolean {
    return patterns.some(pattern => {
      if (pattern.endsWith('.*')) {
        const prefix = pattern.slice(0, -2)
        return permission.startsWith(prefix)
      }
      return pattern === permission
    })
  }

  // Grant permission to user
  async grantPermission(
    userId: string,
    permissionId: string,
    grantedBy: string,
    expiresAt?: string
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('user_permissions')
        .upsert({
          user_id: userId,
          permission_id: permissionId,
          granted: true,
          granted_by: grantedBy,
          expires_at: expiresAt,
          granted_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error granting permission:', error)
        return false
      }

      // Log the action
      await this.logPermissionAction(
        grantedBy,
        'GRANT_PERMISSION',
        'user_permission',
        userId,
        null,
        { permission_id: permissionId, granted: true }
      )

      return true
    } catch (error) {
      console.error('Error granting permission:', error)
      return false
    }
  }

  // Revoke permission from user
  async revokePermission(
    userId: string,
    permissionId: string,
    revokedBy: string
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('user_permissions')
        .update({
          granted: false,
          granted_by: revokedBy,
          granted_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('permission_id', permissionId)

      if (error) {
        console.error('Error revoking permission:', error)
        return false
      }

      // Log the action
      await this.logPermissionAction(
        revokedBy,
        'REVOKE_PERMISSION',
        'user_permission',
        userId,
        { permission_id: permissionId, granted: true },
        { permission_id: permissionId, granted: false }
      )

      return true
    } catch (error) {
      console.error('Error revoking permission:', error)
      return false
    }
  }

  // Update user role
  async updateUserRole(
    userId: string,
    newRole: UserRole,
    updatedBy: string
  ): Promise<boolean> {
    try {
      // Get current role for audit log
      const { data: currentUser } = await this.supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      const { error } = await this.supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) {
        console.error('Error updating user role:', error)
        return false
      }

      // Log the action
      await this.logPermissionAction(
        updatedBy,
        'UPDATE_ROLE',
        'user',
        userId,
        { role: currentUser?.role },
        { role: newRole }
      )

      return true
    } catch (error) {
      console.error('Error updating user role:', error)
      return false
    }
  }

  // Get user permissions
  async getUserPermissions(userId: string): Promise<Permission[]> {
    try {
      const { data: user } = await this.supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      if (!user) return []

      // Get role-based permissions
      const { data: rolePermissions } = await this.supabase
        .from('role_permissions')
        .select(`
          permissions (
            id,
            name,
            description,
            category,
            action,
            resource,
            created_at,
            updated_at
          )
        `)
        .eq('role', user.role)

      // Get user-specific permissions
      const { data: userPermissions } = await this.supabase
        .from('user_permissions')
        .select(`
          granted,
          expires_at,
          permissions (
            id,
            name,
            description,
            category,
            action,
            resource,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', userId)
        .eq('granted', true)

      const permissions: Permission[] = []

      // Add role permissions
      rolePermissions?.forEach(rp => {
        if (rp.permissions) {
          permissions.push(rp.permissions)
        }
      })

      // Add user-specific permissions (not expired)
      userPermissions?.forEach(up => {
        if (up.permissions && (!up.expires_at || new Date(up.expires_at) > new Date())) {
          permissions.push(up.permissions)
        }
      })

      // Remove duplicates
      const uniquePermissions = permissions.filter((permission, index, self) =>
        index === self.findIndex(p => p.id === permission.id)
      )

      return uniquePermissions
    } catch (error) {
      console.error('Error getting user permissions:', error)
      return []
    }
  }

  // Log permission-related actions for audit trail
  private async logPermissionAction(
    userId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    oldValues: any,
    newValues: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await this.supabase
        .from('permission_audit_log')
        .insert({
          user_id: userId,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          old_values: oldValues,
          new_values: newValues,
          ip_address: ipAddress,
          user_agent: userAgent,
          created_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error logging permission action:', error)
    }
  }

  // Initialize default permissions in database
  async initializeDefaultPermissions(): Promise<void> {
    try {
      const defaultPermissions: Omit<Permission, 'id' | 'created_at' | 'updated_at'>[] = [
        // User Management
        { name: 'Create Users', description: 'Create new user accounts', category: 'USER_MANAGEMENT', action: 'CREATE', resource: 'users' },
        { name: 'Read Users', description: 'View user information', category: 'USER_MANAGEMENT', action: 'READ', resource: 'users' },
        { name: 'Update Users', description: 'Edit user information', category: 'USER_MANAGEMENT', action: 'UPDATE', resource: 'users' },
        { name: 'Delete Users', description: 'Delete user accounts', category: 'USER_MANAGEMENT', action: 'DELETE', resource: 'users' },

        // Event Management
        { name: 'Create Events', description: 'Create new events', category: 'EVENT_MANAGEMENT', action: 'CREATE', resource: 'events' },
        { name: 'Read Events', description: 'View event information', category: 'EVENT_MANAGEMENT', action: 'READ', resource: 'events' },
        { name: 'Update Events', description: 'Edit event information', category: 'EVENT_MANAGEMENT', action: 'UPDATE', resource: 'events' },
        { name: 'Delete Events', description: 'Delete events', category: 'EVENT_MANAGEMENT', action: 'DELETE', resource: 'events' },

        // Content Management
        { name: 'Create Content', description: 'Create new content', category: 'CONTENT_MANAGEMENT', action: 'CREATE', resource: 'content' },
        { name: 'Read Content', description: 'View content', category: 'CONTENT_MANAGEMENT', action: 'READ', resource: 'content' },
        { name: 'Update Content', description: 'Edit content', category: 'CONTENT_MANAGEMENT', action: 'UPDATE', resource: 'content' },
        { name: 'Moderate Content', description: 'Moderate user content', category: 'CONTENT_MANAGEMENT', action: 'MODERATE', resource: 'content' },

        // Analytics
        { name: 'View Analytics', description: 'Access analytics dashboard', category: 'ANALYTICS_ACCESS', action: 'READ', resource: 'analytics' },
        { name: 'Export Analytics', description: 'Export analytics data', category: 'ANALYTICS_ACCESS', action: 'EXPORT', resource: 'analytics' },

        // Financial
        { name: 'View Financial Data', description: 'Access financial reports', category: 'FINANCIAL_ACCESS', action: 'READ', resource: 'financial_data' },
        { name: 'Export Financial Data', description: 'Export financial reports', category: 'FINANCIAL_ACCESS', action: 'EXPORT', resource: 'financial_data' },

        // System Administration
        { name: 'Configure System', description: 'Configure system settings', category: 'SYSTEM_ADMINISTRATION', action: 'CONFIGURE', resource: 'system_settings' },

        // Communication
        { name: 'Send Communications', description: 'Send emails and notifications', category: 'COMMUNICATION', action: 'CREATE', resource: 'communications' },
        { name: 'Moderate Communications', description: 'Moderate communications', category: 'COMMUNICATION', action: 'MODERATE', resource: 'communications' },

        // Check-in Operations
        { name: 'Check-in Attendees', description: 'Perform attendee check-ins', category: 'CHECK_IN_OPERATIONS', action: 'UPDATE', resource: 'check_ins' },

        // Speaker Portal
        { name: 'Manage Speaker Profile', description: 'Manage speaker information', category: 'SPEAKER_PORTAL', action: 'UPDATE', resource: 'speaker_profile' },

        // Sponsor Portal
        { name: 'Manage Sponsor Profile', description: 'Manage sponsor information', category: 'SPONSOR_PORTAL', action: 'UPDATE', resource: 'sponsor_profile' }
      ]

      for (const permission of defaultPermissions) {
        await this.supabase
          .from('permissions')
          .upsert(permission, { onConflict: 'name' })
      }

      console.log('Default permissions initialized successfully')
    } catch (error) {
      console.error('Error initializing default permissions:', error)
    }
  }
}

// Utility functions for permission checking
export const checkPermission = async (
  userId: string,
  permission: string,
  supabaseClient: any
): Promise<boolean> => {
  const rbac = new RBACManager(supabaseClient)
  return await rbac.hasPermission(userId, permission)
}

export const requirePermission = (permission: string) => {
  return async (req: any, res: any, next: any) => {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const hasPermission = await checkPermission(userId, permission, req.supabase)
    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }

    next()
  }
}

// Role hierarchy for permission inheritance
export const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  SUPER_ADMIN: ['ADMIN', 'EVENT_MANAGER', 'MODERATOR', 'SPEAKER', 'SPONSOR', 'ATTENDEE', 'CHECK_IN_STAFF'],
  ADMIN: ['EVENT_MANAGER', 'MODERATOR', 'CHECK_IN_STAFF'],
  EVENT_MANAGER: ['MODERATOR'],
  MODERATOR: [],
  SPEAKER: [],
  SPONSOR: [],
  CHECK_IN_STAFF: [],
  ATTENDEE: []
}
