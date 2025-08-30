'use client';

import { useState, useEffect } from 'react';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Flag,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Paperclip,
  Target,
  TrendingUp,
  Users,
  Activity,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  assignee?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  creator: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  event?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface TaskManagementProps {
  eventId?: string;
}

export default function TaskManagement({ eventId }: TaskManagementProps) {
  const [activeTab, setActiveTab] = useState('board');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const taskStatuses = [
    { value: 'TODO', label: 'To Do', color: 'gray', icon: Clock },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'blue', icon: Play },
    { value: 'REVIEW', label: 'Review', color: 'yellow', icon: Eye },
    { value: 'COMPLETED', label: 'Completed', color: 'green', icon: CheckCircle },
    { value: 'CANCELLED', label: 'Cancelled', color: 'red', icon: XCircle },
  ];

  const priorityLevels = [
    { value: 'LOW', label: 'Low', color: 'green' },
    { value: 'MEDIUM', label: 'Medium', color: 'yellow' },
    { value: 'HIGH', label: 'High', color: 'orange' },
    { value: 'URGENT', label: 'Urgent', color: 'red' },
  ];

  useEffect(() => {
    fetchTasks();
  }, [eventId, selectedPriority, selectedStatus, searchTerm]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const params = new URLSearchParams();
      if (eventId) params.append('eventId', eventId);
      if (selectedPriority !== 'all') params.append('priority', selectedPriority);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/tasks?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.ok) {
          setTasks(result.tasks);
        }
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchTasks(); // Refresh tasks
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    const level = priorityLevels.find(p => p.value === priority);
    return level?.color || 'gray';
  };

  const getStatusColor = (status: string) => {
    const statusInfo = taskStatuses.find(s => s.value === status);
    return statusInfo?.color || 'gray';
  };

  const renderTaskCard = (task: Task) => (
    <Card key={task.id} className="shadow-sm bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>
            {task.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
            )}
          </div>
          <Button size="sm" variant="ghost">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge 
            variant="secondary" 
            className={`bg-${getPriorityColor(task.priority)}-100 text-${getPriorityColor(task.priority)}-800`}
          >
            <Flag className="h-3 w-3 mr-1" />
            {task.priority}
          </Badge>
          <Badge 
            variant="outline"
            className={`border-${getStatusColor(task.status)}-200 text-${getStatusColor(task.status)}-700`}
          >
            {task.status.replace('_', ' ')}
          </Badge>
        </div>

        {task.assignee && (
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="w-6 h-6">
              <AvatarImage src={task.assignee.avatarUrl} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                {task.assignee.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">{task.assignee.name}</span>
          </div>
        )}

        {task.dueDate && (
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}

        {task.estimatedHours && (
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{task.estimatedHours}h estimated</span>
            {task.actualHours && (
              <span className="text-gray-500">({task.actualHours}h actual)</span>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderKanbanBoard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {taskStatuses.map((status) => {
        const statusTasks = tasks.filter(task => task.status === status.value);
        const StatusIcon = status.icon;
        
        return (
          <div key={status.value} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <StatusIcon className={`h-5 w-5 text-${status.color}-600`} />
                <h3 className="font-semibold text-gray-900">{status.label}</h3>
                <Badge variant="secondary">{statusTasks.length}</Badge>
              </div>
              <Button size="sm" variant="ghost">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {statusTasks.map(task => (
                <div
                  key={task.id}
                  className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => {/* Handle task click */}}
                >
                  <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant="secondary" 
                      className={`bg-${getPriorityColor(task.priority)}-100 text-${getPriorityColor(task.priority)}-800 text-xs`}
                    >
                      {task.priority}
                    </Badge>
                  </div>

                  {task.assignee && (
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={task.assignee.avatarUrl} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                          {task.assignee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600">{task.assignee.name}</span>
                    </div>
                  )}

                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderTaskList = () => (
    <div className="space-y-4">
      {tasks.map(task => renderTaskCard(task))}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Tasks', value: tasks.length, icon: CheckSquare, color: 'blue' },
          { label: 'Completed', value: tasks.filter(t => t.status === 'COMPLETED').length, icon: CheckCircle, color: 'green' },
          { label: 'In Progress', value: tasks.filter(t => t.status === 'IN_PROGRESS').length, icon: Play, color: 'blue' },
          { label: 'Overdue', value: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED').length, icon: AlertTriangle, color: 'red' }
        ].map((stat, idx) => (
          <Card key={idx} className="shadow-sm bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task Completion Progress */}
      <Card className="shadow-sm bg-white border border-gray-200">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-lg font-semibold text-gray-900">Task Completion Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {priorityLevels.map((priority) => {
              const priorityTasks = tasks.filter(task => task.priority === priority.value);
              const completedTasks = priorityTasks.filter(task => task.status === 'COMPLETED');
              const progress = priorityTasks.length > 0 ? (completedTasks.length / priorityTasks.length) * 100 : 0;
              
              return (
                <div key={priority.value} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{priority.label} Priority</span>
                    <span className="text-sm text-gray-600">
                      {completedTasks.length}/{priorityTasks.length} completed
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              {taskStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              {priorityLevels.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="board">Kanban Board</TabsTrigger>
          <TabsTrigger value="list">Task List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderKanbanBoard()
          )}
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderTaskList()
          )}
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          {renderAnalytics()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
