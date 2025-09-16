'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Database, 
  Filter, 
  Search, 
  Download, 
  Upload, 
  RefreshCw, 
  Settings, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Save, 
  X, 
  Check, 
  AlertTriangle, 
  Clock, 
  Activity, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  Mail, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Link as LinkIcon, 
  Code, 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Server, 
  Cloud, 
  Shield, 
  Key, 
  Lock, 
  Unlock, 
  Copy, 
  Share2, 
  ExternalLink, 
  Zap, 
  Target, 
  Layers, 
  Grid, 
  List, 
  Table, 
  PieChart, 
  LineChart, 
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Archive,
  Trash,
  Star,
  Tag,
  Flag
} from 'lucide-react'

interface DataSource {
  id: string
  name: string
  type: 'database' | 'api' | 'file' | 'webhook' | 'integration'
  description: string
  connection_status: 'connected' | 'disconnected' | 'error' | 'syncing'
  last_sync: string
  record_count: number
  size_mb: number
  schema: Record<string, any>
  permissions: string[]
  tags: string[]
}

interface DataFilter {
  id: string
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in' | 'is_null' | 'is_not_null'
  value: any
  data_type: 'string' | 'number' | 'date' | 'boolean' | 'array'
}

interface DataExport {
  id: string
  name: string
  description: string
  data_source_id: string
  filters: DataFilter[]
  fields: string[]
  format: 'csv' | 'json' | 'xlsx' | 'pdf' | 'xml'
  schedule: 'manual' | 'daily' | 'weekly' | 'monthly'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  last_run: string
  file_url?: string
  file_size?: number
}

interface APIEndpoint {
  id: string
  name: string
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  description: string
  data_source_id: string
  authentication: 'none' | 'api_key' | 'bearer_token' | 'oauth'
  rate_limit: number
  is_public: boolean
  documentation_url?: string
  last_accessed: string
  total_requests: number
  avg_response_time: number
}

export default function AdvancedDataManagement() {
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const [dataExports, setDataExports] = useState<DataExport[]>([])
  const [apiEndpoints, setAPIEndpoints] = useState<APIEndpoint[]>([])
  const [activeTab, setActiveTab] = useState<'sources' | 'exports' | 'apis' | 'analytics'>('sources')
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null)
  const [showFilterBuilder, setShowFilterBuilder] = useState(false)
  const [showExportBuilder, setShowExportBuilder] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDataManagementData()
  }, [])

  const loadDataManagementData = async () => {
    try {
      // Mock data management data - In production, this would come from Supabase
      const mockDataSources: DataSource[] = [
        {
          id: 'source-1',
          name: 'User Registrations',
          type: 'database',
          description: 'All user registration data including profiles and preferences',
          connection_status: 'connected',
          last_sync: '2024-03-15T16:30:00Z',
          record_count: 2847,
          size_mb: 45.2,
          schema: {
            id: 'UUID',
            email: 'STRING',
            first_name: 'STRING',
            last_name: 'STRING',
            company: 'STRING',
            job_title: 'STRING',
            registration_date: 'TIMESTAMP',
            ticket_type: 'STRING',
            payment_status: 'ENUM'
          },
          permissions: ['read', 'export', 'filter'],
          tags: ['users', 'registration', 'core']
        },
        {
          id: 'source-2',
          name: 'Session Analytics',
          type: 'database',
          description: 'Session attendance, engagement metrics, and feedback data',
          connection_status: 'connected',
          last_sync: '2024-03-15T16:25:00Z',
          record_count: 15623,
          size_mb: 128.7,
          schema: {
            session_id: 'UUID',
            user_id: 'UUID',
            join_time: 'TIMESTAMP',
            leave_time: 'TIMESTAMP',
            engagement_score: 'FLOAT',
            questions_asked: 'INTEGER',
            polls_answered: 'INTEGER',
            feedback_rating: 'INTEGER'
          },
          permissions: ['read', 'export', 'analyze'],
          tags: ['sessions', 'analytics', 'engagement']
        },
        {
          id: 'source-3',
          name: 'Payment Transactions',
          type: 'api',
          description: 'Payment processing data from Stripe integration',
          connection_status: 'syncing',
          last_sync: '2024-03-15T16:20:00Z',
          record_count: 1892,
          size_mb: 23.4,
          schema: {
            transaction_id: 'STRING',
            user_id: 'UUID',
            amount: 'DECIMAL',
            currency: 'STRING',
            status: 'ENUM',
            payment_method: 'STRING',
            created_at: 'TIMESTAMP',
            metadata: 'JSON'
          },
          permissions: ['read', 'export'],
          tags: ['payments', 'financial', 'stripe']
        },
        {
          id: 'source-4',
          name: 'Email Campaign Data',
          type: 'integration',
          description: 'Email marketing metrics from SendGrid integration',
          connection_status: 'connected',
          last_sync: '2024-03-15T16:15:00Z',
          record_count: 8456,
          size_mb: 67.8,
          schema: {
            campaign_id: 'STRING',
            recipient_email: 'STRING',
            sent_at: 'TIMESTAMP',
            opened_at: 'TIMESTAMP',
            clicked_at: 'TIMESTAMP',
            bounced: 'BOOLEAN',
            unsubscribed: 'BOOLEAN'
          },
          permissions: ['read', 'analyze'],
          tags: ['email', 'marketing', 'sendgrid']
        }
      ]

      const mockDataExports: DataExport[] = [
        {
          id: 'export-1',
          name: 'Daily Registration Report',
          description: 'Daily export of new registrations with contact details',
          data_source_id: 'source-1',
          filters: [
            {
              id: 'filter-1',
              field: 'registration_date',
              operator: 'greater_than',
              value: '2024-03-14T00:00:00Z',
              data_type: 'date'
            }
          ],
          fields: ['email', 'first_name', 'last_name', 'company', 'ticket_type'],
          format: 'csv',
          schedule: 'daily',
          status: 'completed',
          created_at: '2024-03-01T10:00:00Z',
          last_run: '2024-03-15T09:00:00Z',
          file_url: '/exports/daily-registrations-2024-03-15.csv',
          file_size: 2.4
        },
        {
          id: 'export-2',
          name: 'Session Engagement Analysis',
          description: 'Weekly export of session engagement metrics for analysis',
          data_source_id: 'source-2',
          filters: [
            {
              id: 'filter-2',
              field: 'engagement_score',
              operator: 'greater_than',
              value: 0.5,
              data_type: 'number'
            }
          ],
          fields: ['session_id', 'user_id', 'engagement_score', 'questions_asked', 'feedback_rating'],
          format: 'xlsx',
          schedule: 'weekly',
          status: 'processing',
          created_at: '2024-02-15T14:00:00Z',
          last_run: '2024-03-11T10:00:00Z'
        }
      ]

      const mockAPIEndpoints: APIEndpoint[] = [
        {
          id: 'api-1',
          name: 'User Registration API',
          path: '/api/v1/users',
          method: 'GET',
          description: 'Retrieve user registration data with filtering and pagination',
          data_source_id: 'source-1',
          authentication: 'api_key',
          rate_limit: 1000,
          is_public: false,
          documentation_url: '/docs/api/users',
          last_accessed: '2024-03-15T15:45:00Z',
          total_requests: 15847,
          avg_response_time: 245
        },
        {
          id: 'api-2',
          name: 'Session Analytics API',
          path: '/api/v1/sessions/analytics',
          method: 'GET',
          description: 'Access session engagement and attendance analytics',
          data_source_id: 'source-2',
          authentication: 'bearer_token',
          rate_limit: 500,
          is_public: false,
          documentation_url: '/docs/api/sessions',
          last_accessed: '2024-03-15T16:20:00Z',
          total_requests: 8923,
          avg_response_time: 387
        },
        {
          id: 'api-3',
          name: 'Public Event Data',
          path: '/api/public/events',
          method: 'GET',
          description: 'Public access to basic event information and schedules',
          data_source_id: 'source-1',
          authentication: 'none',
          rate_limit: 10000,
          is_public: true,
          documentation_url: '/docs/api/public',
          last_accessed: '2024-03-15T16:30:00Z',
          total_requests: 45672,
          avg_response_time: 156
        }
      ]

      setDataSources(mockDataSources)
      setDataExports(mockDataExports)
      setAPIEndpoints(mockAPIEndpoints)
    } catch (error) {
      console.error('Error loading data management data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400 bg-green-400/20'
      case 'disconnected': return 'text-gray-400 bg-gray-400/20'
      case 'error': return 'text-red-400 bg-red-400/20'
      case 'syncing': return 'text-blue-400 bg-blue-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getConnectionStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return Check
      case 'disconnected': return X
      case 'error': return AlertTriangle
      case 'syncing': return RefreshCw
      default: return Clock
    }
  }

  const getDataSourceIcon = (type: string) => {
    switch (type) {
      case 'database': return Database
      case 'api': return Globe
      case 'file': return FileText
      case 'webhook': return Zap
      case 'integration': return Link as any
      default: return Database
    }
  }

  const getExportStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20'
      case 'processing': return 'text-blue-400 bg-blue-400/20'
      case 'pending': return 'text-yellow-400 bg-yellow-400/20'
      case 'failed': return 'text-red-400 bg-red-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1) return `${(sizeInMB * 1024).toFixed(0)} KB`
    if (sizeInMB < 1024) return `${sizeInMB.toFixed(1)} MB`
    return `${(sizeInMB / 1024).toFixed(1)} GB`
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

  const filteredDataSources = dataSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = filterType === 'all' || source.type === filterType
    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading data management system...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Advanced Data Management</h2>
          <p className="text-gray-400">Complex filtering, real-time export capabilities, and comprehensive API endpoints</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-secondary/20 text-secondary border border-secondary/30 rounded-lg hover:bg-secondary/30 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Import Data</span>
          </button>
          <button
            onClick={() => setShowExportBuilder(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Export</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
        {[
          { id: 'sources', label: 'Data Sources', icon: Database },
          { id: 'exports', label: 'Data Exports', icon: Download },
          { id: 'apis', label: 'API Endpoints', icon: Globe },
          { id: 'analytics', label: 'Usage Analytics', icon: BarChart3 }
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

      {/* Data Sources Tab */}
      {activeTab === 'sources' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search data sources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              >
                <option value="all">All Types</option>
                <option value="database">Database</option>
                <option value="api">API</option>
                <option value="file">File</option>
                <option value="webhook">Webhook</option>
                <option value="integration">Integration</option>
              </select>
            </div>
          </div>

          {/* Data Sources Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDataSources.map((source) => {
              const SourceIcon = getDataSourceIcon(source.type)
              const StatusIcon = getConnectionStatusIcon(source.connection_status)
              
              return (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedSource(source)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <SourceIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{source.name}</h3>
                        <p className="text-gray-400 text-sm capitalize">{source.type}</p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getConnectionStatusColor(source.connection_status)}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span className="capitalize">{source.connection_status}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{source.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-gray-400 text-xs">Records</div>
                      <div className="text-white font-medium">{source.record_count.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Size</div>
                      <div className="text-white font-medium">{formatFileSize(source.size_mb)}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {source.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-400/20 text-blue-400 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Last sync: {formatDateTime(source.last_sync)}</span>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:text-white transition-colors" title="View Details">
                        <Eye className="w-3 h-3" />
                      </button>
                      <button className="p-1 hover:text-white transition-colors" title="Export Data">
                        <Download className="w-3 h-3" />
                      </button>
                      <button className="p-1 hover:text-white transition-colors" title="Settings">
                        <Settings className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {filteredDataSources.length === 0 && (
            <div className="text-center py-12">
              <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-white mb-2">No data sources found</h4>
              <p className="text-gray-400 mb-6">Connect your first data source to get started</p>
              <button className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add Data Source</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Data Exports Tab */}
      {activeTab === 'exports' && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Data Exports</h3>
                <p className="text-gray-400 text-sm">Scheduled and on-demand data exports</p>
              </div>
              <button
                onClick={() => setShowExportBuilder(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Export</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Export Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Data Source</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Format</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Schedule</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Last Run</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {dataExports.map((exportItem) => {
                  const dataSource = dataSources.find(s => s.id === exportItem.data_source_id)
                  
                  return (
                    <motion.tr
                      key={exportItem.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{exportItem.name}</div>
                          <div className="text-gray-400 text-sm">{exportItem.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{dataSource?.name || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-400/20 text-blue-400 rounded-full text-xs uppercase">
                          {exportItem.format}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300 capitalize">{exportItem.schedule}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs capitalize ${getExportStatusColor(exportItem.status)}`}>
                          {exportItem.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300">{formatDateTime(exportItem.last_run)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {exportItem.file_url && (
                            <button className="p-1 text-gray-400 hover:text-white transition-colors" title="Download">
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          <button className="p-1 text-gray-400 hover:text-white transition-colors" title="Run Now">
                            <Play className="w-4 h-4" />
                          </button>
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
      )}

      {/* API Endpoints Tab */}
      {activeTab === 'apis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {apiEndpoints.map((endpoint) => (
              <motion.div
                key={endpoint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      endpoint.method === 'GET' ? 'bg-green-400/20 text-green-400' :
                      endpoint.method === 'POST' ? 'bg-blue-400/20 text-blue-400' :
                      endpoint.method === 'PUT' ? 'bg-yellow-400/20 text-yellow-400' :
                      endpoint.method === 'DELETE' ? 'bg-red-400/20 text-red-400' :
                      'bg-gray-400/20 text-gray-400'
                    }`}>
                      {endpoint.method}
                    </div>
                    {endpoint.is_public && (
                      <span className="px-2 py-1 bg-purple-400/20 text-purple-400 rounded text-xs">
                        Public
                      </span>
                    )}
                  </div>
                  
                  <button className="p-1 text-gray-400 hover:text-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-white font-semibold mb-2">{endpoint.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{endpoint.description}</p>
                
                <div className="bg-black/20 rounded p-2 mb-4">
                  <code className="text-green-400 text-sm">{endpoint.path}</code>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="text-gray-400">Rate Limit</div>
                    <div className="text-white">{endpoint.rate_limit}/hour</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Avg Response</div>
                    <div className="text-white">{endpoint.avg_response_time}ms</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{endpoint.total_requests.toLocaleString()} requests</span>
                  <div className="flex items-center space-x-2">
                    {endpoint.documentation_url && (
                      <button className="p-1 hover:text-white transition-colors" title="Documentation">
                        <FileText className="w-3 h-3" />
                      </button>
                    )}
                    <button className="p-1 hover:text-white transition-colors" title="Test API">
                      <Zap className="w-3 h-3" />
                    </button>
                    <button className="p-1 hover:text-white transition-colors" title="Copy URL">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-white mb-2">Data Usage Analytics</h4>
          <p className="text-gray-400">Detailed analytics on data access patterns and API usage coming soon</p>
        </div>
      )}
    </div>
  )
}
