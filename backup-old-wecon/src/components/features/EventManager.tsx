'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Edit,
  Trash2,
  Copy,
  Eye,
  MoreHorizontal,
  Settings,
  Play,
  Pause,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import EventCreateForm from './EventCreateForm';

interface Event {
  id: string;
  name: string;
  slug: string;
  description?: string;
  venue?: string;
  startAt: string;
  endAt: string;
  timezone: string;
  status: 'DRAFT' | 'PUBLISHED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  maxAttendees?: number;
  category?: string;
  tags: string[];
  website?: string;
  contactEmail?: string;
  logoUrl?: string;
  bannerUrl?: string;
  isPublic: boolean;
  registrationOpen: boolean;
  registrationDeadline?: string;
  manager: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    sessions: number;
    tickets: number;
    orders: number;
    venues: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface EventManagerProps {
  userRole: string;
  userId: string;
}

const statusConfig = {
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: Edit },
  PUBLISHED: { label: 'Published', color: 'bg-blue-100 text-blue-800', icon: Eye },
  LIVE: { label: 'Live', color: 'bg-green-100 text-green-800', icon: Play },
  COMPLETED: { label: 'Completed', color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle }
};

export default function EventManager({ userRole, userId }: EventManagerProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchEvents();
  }, [statusFilter, categoryFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (categoryFilter) params.append('category', categoryFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/events?${params}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.events
          .map((e: Event) => e.category)
          .filter(Boolean)
        )];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateEventStatus = async (eventId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setEvents(events.map(event => 
          event.id === eventId ? { ...event, status: newStatus as any } : event
        ));
      }
    } catch (error) {
      console.error('Failed to update event status:', error);
    }
  };

  const cloneEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/clone`, {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        setEvents([data.event, ...events]);
      }
    } catch (error) {
      console.error('Failed to clone event:', error);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setEvents(events.filter(e => e.id !== eventId));
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const bulkUpdateStatus = async (newStatus: string) => {
    if (selectedEvents.length === 0) return;

    try {
      const response = await fetch('/api/events/bulk-update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          eventIds: selectedEvents, 
          updates: { status: newStatus } 
        })
      });

      if (response.ok) {
        setEvents(events.map(event => 
          selectedEvents.includes(event.id) 
            ? { ...event, status: newStatus as any } 
            : event
        ));
        setSelectedEvents([]);
      }
    } catch (error) {
      console.error('Failed to bulk update events:', error);
    }
  };

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntil = (dateString: string) => {
    const now = new Date();
    const target = new Date(dateString);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Past';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  const canEdit = ['SUPER_ADMIN', 'ADMIN', 'STAFF_MANAGER', 'ORGANIZER'].includes(userRole);
  const canDelete = ['SUPER_ADMIN', 'ADMIN'].includes(userRole);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Event Management</h2>
          <p className="text-gray-600">Manage your events, sessions, and attendees</p>
        </div>
        {canEdit && (
          <div className="flex gap-2">
            {selectedEvents.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Bulk Actions ({selectedEvents.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => bulkUpdateStatus('PUBLISHED')}>
                    Publish Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => bulkUpdateStatus('LIVE')}>
                    Make Live
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => bulkUpdateStatus('COMPLETED')}>
                    Mark Completed
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedEvents([])}>
                    Clear Selection
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                </DialogHeader>
                <EventCreateForm
                  onSuccess={(event) => {
                    setEvents([event, ...events]);
                    setShowCreateDialog(false);
                  }}
                  onCancel={() => setShowCreateDialog(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            {Object.entries(statusConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => {
          const StatusIcon = statusConfig[event.status].icon;
          const isSelected = selectedEvents.includes(event.id);
          
          return (
            <Card key={event.id} className={`hover:shadow-lg transition-shadow ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEvents([...selectedEvents, event.id]);
                          } else {
                            setSelectedEvents(selectedEvents.filter(id => id !== event.id));
                          }
                        }}
                        className="rounded"
                      />
                      <Badge 
                        variant="secondary" 
                        className={`${statusConfig[event.status].color}`}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[event.status].label}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {event.name}
                    </CardTitle>
                  </div>
                  {canEdit && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Event
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => cloneEvent(event.id)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Clone Event
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => updateEventStatus(event.id, 'PUBLISHED')}>
                          <Eye className="h-4 w-4 mr-2" />
                          Publish
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateEventStatus(event.id, 'LIVE')}>
                          <Play className="h-4 w-4 mr-2" />
                          Make Live
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {canDelete && (
                          <DropdownMenuItem 
                            onClick={() => deleteEvent(event.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.description && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {event.description}
                  </p>
                )}

                {/* Event Details */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.startAt)} - {formatDate(event.endAt)}</span>
                  </div>
                  {event.venue && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.venue}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{getDaysUntil(event.startAt)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{event._count.sessions}</div>
                    <div className="text-xs text-gray-500">Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{event._count.orders}</div>
                    <div className="text-xs text-gray-500">Registrations</div>
                  </div>
                </div>

                {/* Tags */}
                {event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {event.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {event.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{event.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter || categoryFilter 
              ? 'Try adjusting your filters to see more events.'
              : 'Get started by creating your first event.'
            }
          </p>
          {canEdit && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
