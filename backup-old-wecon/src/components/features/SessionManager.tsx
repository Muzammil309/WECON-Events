'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star,
  Edit,
  Trash2,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Session {
  id: string;
  title: string;
  abstract?: string;
  track?: string;
  startAt: string;
  endAt: string;
  room?: {
    id: string;
    name: string;
    capacity?: number;
  };
  speakers: {
    speaker: {
      id: string;
      user: {
        id: string;
        name: string;
        email: string;
        avatarUrl?: string;
      };
    };
  }[];
  resources: {
    id: string;
    title: string;
    url: string;
  }[];
  averageRating?: number;
  _count: {
    feedback: number;
  };
}

interface SessionManagerProps {
  eventId: string;
  userRole?: string;
  canEdit?: boolean;
}

export default function SessionManager({ eventId, userRole, canEdit = false }: SessionManagerProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [trackFilter, setTrackFilter] = useState<string>('');
  const [roomFilter, setRoomFilter] = useState<string>('');
  const [tracks, setTracks] = useState<string[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchSessions();
    fetchRooms();
  }, [eventId, trackFilter, roomFilter]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('eventId', eventId);
      if (trackFilter) params.append('track', trackFilter);
      if (roomFilter) params.append('roomId', roomFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/sessions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
        
        // Extract unique tracks
        const uniqueTracks = [...new Set(data.sessions
          .map((s: Session) => s.track)
          .filter(Boolean)
        )];
        setTracks(uniqueTracks);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch(`/api/venues?eventId=${eventId}`);
      if (response.ok) {
        const data = await response.json();
        const allRooms = data.venues.flatMap((venue: any) => 
          venue.rooms.map((room: any) => ({
            id: room.id,
            name: `${venue.name} - ${room.name}`
          }))
        );
        setRooms(allRooms);
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSessions(sessions.filter(s => s.id !== sessionId));
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.abstract?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins}m`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
  };

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
        <h2 className="text-2xl font-bold">Session Management</h2>
        {canEdit && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Session
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={trackFilter} onValueChange={setTrackFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by track" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Tracks</SelectItem>
            {tracks.map(track => (
              <SelectItem key={track} value={track}>
                {track}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={roomFilter} onValueChange={setRoomFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by room" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Rooms</SelectItem>
            {rooms.map(room => (
              <SelectItem key={room.id} value={room.id}>
                {room.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map(session => (
          <Card key={session.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">
                  {session.title}
                </CardTitle>
                {canEdit && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      onClick={() => deleteSession(session.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {session.track && (
                <Badge variant="secondary" className="w-fit">
                  {session.track}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {session.abstract && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {session.abstract}
                </p>
              )}

              {/* Time and Duration */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(session.startAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {formatTime(session.startAt)} - {formatTime(session.endAt)}
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Duration: {getDuration(session.startAt, session.endAt)}
              </div>

              {/* Room */}
              {session.room && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{session.room.name}</span>
                  {session.room.capacity && (
                    <span className="text-gray-400">
                      (Capacity: {session.room.capacity})
                    </span>
                  )}
                </div>
              )}

              {/* Speakers */}
              {session.speakers.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Users className="h-4 w-4" />
                    <span>Speakers</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {session.speakers.map(({ speaker }) => (
                      <div key={speaker.id} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={speaker.user.avatarUrl} />
                          <AvatarFallback className="text-xs">
                            {speaker.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{speaker.user.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating and Feedback */}
              {session._count.feedback > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>
                      {session.averageRating?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                  <span className="text-gray-500">
                    {session._count.feedback} reviews
                  </span>
                </div>
              )}

              {/* Resources */}
              {session.resources.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium">Resources: </span>
                  <span className="text-gray-600">
                    {session.resources.length} files
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || trackFilter || roomFilter 
              ? 'Try adjusting your filters to see more sessions.'
              : 'Get started by creating your first session.'
            }
          </p>
          {canEdit && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Session
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
