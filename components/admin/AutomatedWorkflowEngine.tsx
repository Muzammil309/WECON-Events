'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Play, 
  Pause, 
  Stop, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Settings, 
  Clock, 
  Mail, 
  MessageSquare, 
  Bell, 
  Calendar, 
  Users, 
  Target, 
  Filter, 
  Search, 
  Download, 
  Upload, 
  Save, 
  X, 
  Check, 
  AlertTriangle, 
  Activity, 
  BarChart3, 
  TrendingUp, 
  Eye, 
  MoreVertical,
  ArrowRight,
  ArrowDown,
  GitBranch,
  Timer,
  Send,
  CheckCircle,
  XCircle,
  RefreshCw,
  Database,
  Code,
  Smartphone,
  Globe,
  Webhook,
  FileText,
  Image as ImageIcon,
  Video,
  Link as LinkIcon
} from 'lucide-react'

interface WorkflowTrigger {
  id: string
  type: 'event_registration' | 'payment_completed' | 'session_start' | 'session_end' | 'check_in' | 'time_based' | 'user_action' | 'api_webhook'
  name: string
  description: string
  conditions: Record<string, any>
  enabled: boolean
}

interface WorkflowAction {
  id: string
  type: 'send_email' | 'send_sms' | 'push_notification' | 'update_user' | 'create_task' | 'webhook_call' | 'wait_delay' | 'conditional_branch'
  name: string
  description: string
  parameters: Record<string, any>
  delay?: number
  conditions?: Record<string, any>
}

interface WorkflowStep {
  id: string
  action: WorkflowAction
  position: { x: number; y: number }
  connections: string[]
}

interface Workflow {
  id: string
  name: string
  description: string
  trigger: WorkflowTrigger
  steps: WorkflowStep[]
  status: 'draft' | 'active' | 'paused' | 'completed'
  created_at: string
  updated_at: string
  last_run: string
  total_runs: number
  success_rate: number
  tags: string[]
}

interface WorkflowExecution {
  id: string
  workflow_id: string
  trigger_data: any
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  started_at: string
  completed_at?: string
  current_step?: string
  error_message?: string
  execution_log: Array<{
    step_id: string
    status: 'pending' | 'running' | 'completed' | 'failed'
    started_at: string
    completed_at?: string
    output?: any
    error?: string
  }>
}

export default function AutomatedWorkflowEngine() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [executions, setExecutions] = useState<WorkflowExecution[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [activeTab, setActiveTab] = useState<'workflows' | 'executions' | 'templates' | 'analytics'>('workflows')
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWorkflowData()
  }, [])

  const loadWorkflowData = async () => {
    try {
      // Mock workflow data - In production, this would come from Supabase
      const mockWorkflows: Workflow[] = [
        {
          id: 'workflow-1',
          name: 'Welcome Email Sequence',
          description: 'Automated welcome emails for new registrants',
          trigger: {
            id: 'trigger-1',
            type: 'event_registration',
            name: 'Event Registration',
            description: 'Triggered when a user registers for an event',
            conditions: { event_type: 'any' },
            enabled: true
          },
          steps: [
            {
              id: 'step-1',
              action: {
                id: 'action-1',
                type: 'send_email',
                name: 'Welcome Email',
                description: 'Send welcome email to new registrant',
                parameters: {
                  template: 'welcome_email',
                  subject: 'Welcome to WECON Masawat 2024!',
                  personalized: true
                }
              },
              position: { x: 100, y: 100 },
              connections: ['step-2']
            },
            {
              id: 'step-2',
              action: {
                id: 'action-2',
                type: 'wait_delay',
                name: 'Wait 24 Hours',
                description: 'Wait 24 hours before next action',
                parameters: {},
                delay: 86400
              },
              position: { x: 100, y: 200 },
              connections: ['step-3']
            },
            {
              id: 'step-3',
              action: {
                id: 'action-3',
                type: 'send_email',
                name: 'Event Details Email',
                description: 'Send detailed event information',
                parameters: {
                  template: 'event_details',
                  subject: 'Your WECON Masawat 2024 Event Details',
                  include_calendar: true
                }
              },
              position: { x: 100, y: 300 },
              connections: []
            }
          ],
          status: 'active',
          created_at: '2024-03-01T10:00:00Z',
          updated_at: '2024-03-10T14:30:00Z',
          last_run: '2024-03-15T09:15:00Z',
          total_runs: 156,
          success_rate: 98.7,
          tags: ['email', 'onboarding', 'registration']
        },
        {
          id: 'workflow-2',
          name: 'Session Reminder Notifications',
          description: 'Automated reminders for upcoming sessions',
          trigger: {
            id: 'trigger-2',
            type: 'time_based',
            name: 'Session Start - 30 minutes',
            description: 'Triggered 30 minutes before session start',
            conditions: { time_before: 1800 },
            enabled: true
          },
          steps: [
            {
              id: 'step-4',
              action: {
                id: 'action-4',
                type: 'push_notification',
                name: 'Session Reminder',
                description: 'Send push notification reminder',
                parameters: {
                  title: 'Session Starting Soon',
                  body: 'Your session {{session_name}} starts in 30 minutes',
                  action_url: '/attendee/sessions/{{session_id}}'
                }
              },
              position: { x: 100, y: 100 },
              connections: ['step-5']
            },
            {
              id: 'step-5',
              action: {
                id: 'action-5',
                type: 'conditional_branch',
                name: 'Check User Preference',
                description: 'Check if user wants email reminders',
                parameters: {},
                conditions: { user_email_notifications: true }
              },
              position: { x: 100, y: 200 },
              connections: ['step-6']
            },
            {
              id: 'step-6',
              action: {
                id: 'action-6',
                type: 'send_email',
                name: 'Email Reminder',
                description: 'Send email reminder if enabled',
                parameters: {
                  template: 'session_reminder',
                  subject: 'Session Reminder: {{session_name}}',
                  include_join_link: true
                }
              },
              position: { x: 200, y: 300 },
              connections: []
            }
          ],
          status: 'active',
          created_at: '2024-02-15T08:00:00Z',
          updated_at: '2024-03-12T11:20:00Z',
          last_run: '2024-03-15T14:30:00Z',
          total_runs: 423,
          success_rate: 99.2,
          tags: ['notifications', 'sessions', 'reminders']
        },
        {
          id: 'workflow-3',
          name: 'Post-Event Follow-up',
          description: 'Automated follow-up sequence after event completion',
          trigger: {
            id: 'trigger-3',
            type: 'session_end',
            name: 'Session Completed',
            description: 'Triggered when a session ends',
            conditions: { session_type: 'keynote' },
            enabled: false
          },
          steps: [
            {
              id: 'step-7',
              action: {
                id: 'action-7',
                type: 'wait_delay',
                name: 'Wait 2 Hours',
                description: 'Wait 2 hours after session end',
                parameters: {},
                delay: 7200
              },
              position: { x: 100, y: 100 },
              connections: ['step-8']
            },
            {
              id: 'step-8',
              action: {
                id: 'action-8',
                type: 'send_email',
                name: 'Feedback Request',
                description: 'Request feedback on the session',
                parameters: {
                  template: 'feedback_request',
                  subject: 'How was your experience at {{session_name}}?',
                  include_survey_link: true
                }
              },
              position: { x: 100, y: 200 },
              connections: []
            }
          ],
          status: 'draft',
          created_at: '2024-03-05T16:00:00Z',
          updated_at: '2024-03-08T10:45:00Z',
          last_run: '',
          total_runs: 0,
          success_rate: 0,
          tags: ['feedback', 'post-event', 'survey']
        }
      ]

      const mockExecutions: WorkflowExecution[] = [
        {
          id: 'exec-1',
          workflow_id: 'workflow-1',
          trigger_data: {
            user_id: 'user-123',
            event_id: 'event-456',
            registration_time: '2024-03-15T09:15:00Z'
          },
          status: 'completed',
          started_at: '2024-03-15T09:15:00Z',
          completed_at: '2024-03-16T09:15:00Z',
          execution_log: [
            {
              step_id: 'step-1',
              status: 'completed',
              started_at: '2024-03-15T09:15:00Z',
              completed_at: '2024-03-15T09:15:30Z',
              output: { email_sent: true, message_id: 'msg-123' }
            },
            {
              step_id: 'step-2',
              status: 'completed',
              started_at: '2024-03-15T09:15:30Z',
              completed_at: '2024-03-16T09:15:30Z',
              output: { delay_completed: true }
            },
            {
              step_id: 'step-3',
              status: 'completed',
              started_at: '2024-03-16T09:15:30Z',
              completed_at: '2024-03-16T09:15:45Z',
              output: { email_sent: true, message_id: 'msg-124' }
            }
          ]
        },
        {
          id: 'exec-2',
          workflow_id: 'workflow-2',
          trigger_data: {
            user_id: 'user-456',
            session_id: 'session-789',
            session_start: '2024-03-15T15:00:00Z'
          },
          status: 'running',
          started_at: '2024-03-15T14:30:00Z',
          current_step: 'step-5',
          execution_log: [
            {
              step_id: 'step-4',
              status: 'completed',
              started_at: '2024-03-15T14:30:00Z',
              completed_at: '2024-03-15T14:30:15Z',
              output: { notification_sent: true, notification_id: 'notif-456' }
            },
            {
              step_id: 'step-5',
              status: 'running',
              started_at: '2024-03-15T14:30:15Z'
            }
          ]
        }
      ]

      setWorkflows(mockWorkflows)
      setExecutions(mockExecutions)
    } catch (error) {
      console.error('Error loading workflow data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20'
      case 'draft': return 'text-yellow-400 bg-yellow-400/20'
      case 'paused': return 'text-orange-400 bg-orange-400/20'
      case 'completed': return 'text-blue-400 bg-blue-400/20'
      case 'running': return 'text-blue-400 bg-blue-400/20'
      case 'failed': return 'text-red-400 bg-red-400/20'
      case 'cancelled': return 'text-gray-400 bg-gray-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return Play
      case 'draft': return Edit
      case 'paused': return Pause
      case 'completed': return CheckCircle
      case 'running': return RefreshCw
      case 'failed': return XCircle
      case 'cancelled': return Stop
      default: return Clock
    }
  }

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'event_registration': return Users
      case 'payment_completed': return CheckCircle
      case 'session_start': return Play
      case 'session_end': return Stop
      case 'check_in': return CheckCircle
      case 'time_based': return Clock
      case 'user_action': return Target
      case 'api_webhook': return Webhook
      default: return Zap
    }
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'send_email': return Mail
      case 'send_sms': return MessageSquare
      case 'push_notification': return Bell
      case 'update_user': return Users
      case 'create_task': return Plus
      case 'webhook_call': return Webhook
      case 'wait_delay': return Timer
      case 'conditional_branch': return GitBranch
      default: return Zap
    }
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
    return `${Math.floor(seconds / 86400)}d`
  }

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || workflow.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading workflow engine...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Automated Workflow Engine</h2>
          <p className="text-gray-400">Create email sequences, trigger-based notifications, and conditional logic for event automation</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-secondary/20 text-secondary border border-secondary/30 rounded-lg hover:bg-secondary/30 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button
            onClick={() => setShowWorkflowBuilder(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Workflow</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
        {[
          { id: 'workflows', label: 'Workflows', icon: Zap },
          { id: 'executions', label: 'Executions', icon: Activity },
          { id: 'templates', label: 'Templates', icon: FileText },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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

      {/* Workflows Tab */}
      {activeTab === 'workflows' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Workflows Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredWorkflows.map((workflow) => {
              const StatusIcon = getStatusIcon(workflow.status)
              const TriggerIcon = getTriggerIcon(workflow.trigger.type)
              
              return (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedWorkflow(workflow)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{workflow.name}</h3>
                        <p className="text-gray-400 text-sm">{workflow.steps.length} steps</p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(workflow.status)}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span className="capitalize">{workflow.status}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{workflow.description}</p>

                  <div className="flex items-center space-x-2 mb-4">
                    <TriggerIcon className="w-4 h-4 text-secondary" />
                    <span className="text-secondary text-sm">{workflow.trigger.name}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {workflow.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-400/20 text-blue-400 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Total Runs</div>
                      <div className="text-white font-medium">{workflow.total_runs.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Success Rate</div>
                      <div className="text-white font-medium">{workflow.success_rate}%</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Last run: {formatDateTime(workflow.last_run)}</span>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:text-white transition-colors" title="Edit">
                          <Edit className="w-3 h-3" />
                        </button>
                        <button className="p-1 hover:text-white transition-colors" title="Copy">
                          <Copy className="w-3 h-3" />
                        </button>
                        <button className="p-1 hover:text-white transition-colors" title="More">
                          <MoreVertical className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {filteredWorkflows.length === 0 && (
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-white mb-2">No workflows found</h4>
              <p className="text-gray-400 mb-6">Create your first automated workflow to get started</p>
              <button
                onClick={() => setShowWorkflowBuilder(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Workflow</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Executions Tab */}
      {activeTab === 'executions' && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Workflow Executions</h3>
            <p className="text-gray-400 text-sm">Monitor real-time workflow execution status</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Workflow</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Progress</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Started</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {executions.map((execution) => {
                  const workflow = workflows.find(w => w.id === execution.workflow_id)
                  const StatusIcon = getStatusIcon(execution.status)
                  const completedSteps = execution.execution_log.filter(log => log.status === 'completed').length
                  const totalSteps = workflow?.steps.length || 0
                  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0
                  
                  const duration = execution.completed_at 
                    ? new Date(execution.completed_at).getTime() - new Date(execution.started_at).getTime()
                    : Date.now() - new Date(execution.started_at).getTime()
                  
                  return (
                    <motion.tr
                      key={execution.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{workflow?.name || 'Unknown Workflow'}</div>
                          <div className="text-gray-400 text-sm">{execution.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(execution.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span className="capitalize">{execution.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2 transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-400 text-xs">{completedSteps}/{totalSteps}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300">{formatDateTime(execution.started_at)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300">{formatDuration(Math.floor(duration / 1000))}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-white transition-colors" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          {execution.status === 'running' && (
                            <button className="p-1 text-gray-400 hover:text-white transition-colors" title="Cancel">
                              <Stop className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-white mb-2">Workflow Templates</h4>
          <p className="text-gray-400">Pre-built workflow templates coming soon</p>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-white mb-2">Workflow Analytics</h4>
          <p className="text-gray-400">Detailed workflow performance analytics coming soon</p>
        </div>
      )}
    </div>
  )
}
