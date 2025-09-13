'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Copy,
  Download,
  Upload,
  Settings,
  Map,
  Building,
  Mic,
  Video,
  Wifi,
  Coffee,
  Car,
  Accessibility,
  Star,
  BookOpen,
  GraduationCap,
  Presentation,
  MessageSquare,
  FileText,
  Link,
  QrCode,
  Share2,
  Bell,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Session {
  id: string;
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  sessionType?: string;
  track?: string;
  maxAttendees?: number;
  room?: {
    id: string;
    name: string;
    capacity: number;
    venue?: {
      id: string;
      name: string;
    };
  };
  speakers: {
    speaker: {
      user: {
        id: string;
        name: string;
        avatarUrl?: string;
      };
    };
  }[];
  _count: {
    checkIns: number;
    bookmarks: number;
  };
}

interface Room {
  id: string;
  name: string;
  capacity: number;
  description?: string;
  amenities: string[];
  venue?: {
    id: string;
    name: string;
  };
}

interface SessionLocationManagementProps {
  eventId?: string;
}

export default function SessionLocationManagement({ eventId }: SessionLocationManagementProps) {
  const [activeTab, setActiveTab] = useState('schedule');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const sessionTypes = [
    { value: 'KEYNOTE', label: 'Keynote', icon: Mic, color: 'purple' },
    { value: 'WORKSHOP', label: 'Workshop', icon: GraduationCap, color: 'blue' },
    { value: 'PANEL', label: 'Panel Discussion', icon: MessageSquare, color: 'green' },
    { value: 'PRESENTATION', label: 'Presentation', icon: Presentation, color: 'orange' },
    { value: 'NETWORKING', label: 'Networking', icon: Users, color: 'pink' },
    { value: 'BREAK', label: 'Break', icon: Coffee, color: 'gray' },
  ];

  const amenityIcons = {
    'WiFi': Wifi,
    'Projector': Video,
    'Microphone': Mic,
    'Whiteboard': FileText,
    'Coffee': Coffee,
    'Parking': Car,
    'Accessibility': Accessibility,
  };

  useEffect(() => {
    fetchSessions();
    fetchRooms();
  }, [eventId, selectedDate, selectedTrack, searchTerm]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const params = new URLSearchParams();
      if (eventId) params.append('eventId', eventId);
      if (selectedDate) params.append('date', selectedDate);
      if (selectedTrack !== 'all') params.append('track', selectedTrack);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/sessions?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.ok) {
          setSessions(result.sessions);
        }
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/venues', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.ok) {
          setRooms(result.rooms || []);
        }
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const getSessionTypeInfo = (type: string) => {
    return sessionTypes.find(t => t.value === type) || sessionTypes[0];
  };

  const renderScheduleBuilder = () => (
    <div className="space-y-6">
      {/* Schedule Controls */}
      <Card className="shadow-sm bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Tracks</option>
              <option value="technology">Technology</option>
              <option value="business">Business</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
            </select>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Session
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline View */}
      <Card className="shadow-sm bg-white border border-gray-200">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">Daily Schedule</span>
            <Badge variant="secondary">{sessions.length} sessions</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-20 h-16 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : sessions.length > 0 ? (
              sessions.map((session) => {
                const typeInfo = getSessionTypeInfo(session.sessionType || 'PRESENTATION');
                const TypeIcon = typeInfo.icon;
                
                return (
                  <div key={session.id} className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-center min-w-[80px]">
                      <div className="text-sm font-semibold text-gray-900">
                        {new Date(session.startAt).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((new Date(session.endAt).getTime() - new Date(session.startAt).getTime()) / (1000 * 60))}m
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{session.title}</h4>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant="secondary" 
                              className={`bg-${typeInfo.color}-100 text-${typeInfo.color}-800`}
                            >
                              <TypeIcon className="h-3 w-3 mr-1" />
                              {typeInfo.label}
                            </Badge>
                            {session.track && (
                              <Badge variant="outline">{session.track}</Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {session.room && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{session.room.name}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{session._count.checkIns}/{session.maxAttendees || 'Unlimited'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              <span>{session._count.bookmarks} bookmarks</span>
                            </div>
                          </div>
                          
                          {session.speakers.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-gray-600">Speakers:</span>
                              <div className="flex -space-x-2">
                                {session.speakers.slice(0, 3).map((speaker, idx) => (
                                  <Avatar key={idx} className="w-6 h-6 border-2 border-white">
                                    <AvatarImage src={speaker.speaker.user.avatarUrl} />
                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                      {speaker.speaker.user.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                                {session.speakers.length > 3 && (
                                  <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                                    +{session.speakers.length - 3}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sessions Scheduled</h3>
                <p className="text-gray-600 mb-4">Create your first session to get started</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Session
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFloorPlans = () => (
    <div className="space-y-6">
      {/* Floor Plan Controls */}
      <Card className="shadow-sm bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Interactive Floor Plans</h3>
            <div className="flex gap-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Plan
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Room
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Directory */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="shadow-sm bg-white border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{room.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{room.venue?.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      <Users className="h-3 w-3 mr-1" />
                      {room.capacity} capacity
                    </Badge>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>

              {room.description && (
                <p className="text-sm text-gray-600 mb-4">{room.description}</p>
              )}

              {room.amenities && room.amenities.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, idx) => {
                      const AmenityIcon = amenityIcons[amenity as keyof typeof amenityIcons] || Info;
                      return (
                        <div key={idx} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          <AmenityIcon className="h-3 w-3" />
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Map className="h-4 w-4 mr-2" />
                  View on Map
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Map Placeholder */}
      <Card className="shadow-sm bg-white border border-gray-200">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-green-600" />
            <span className="text-lg font-semibold text-gray-900">Interactive Venue Map</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Floor Plan</h3>
              <p className="text-gray-600 mb-4">Upload floor plans and create interactive maps</p>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Floor Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSpeakerPortal = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Mic className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Speaker Portal</h3>
        <p className="text-gray-600 mb-4">Manage speaker profiles, session materials, and communication</p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Speaker
        </Button>
      </div>
    </div>
  );

  const renderMaterials = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Materials</h3>
        <p className="text-gray-600 mb-4">Upload and distribute session materials, presentations, and resources</p>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Materials
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Session & Location Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Schedule
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Schedule Builder</TabsTrigger>
          <TabsTrigger value="floorplans">Floor Plans</TabsTrigger>
          <TabsTrigger value="speakers">Speaker Portal</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-6">
          {renderScheduleBuilder()}
        </TabsContent>

        <TabsContent value="floorplans" className="mt-6">
          {renderFloorPlans()}
        </TabsContent>

        <TabsContent value="speakers" className="mt-6">
          {renderSpeakerPortal()}
        </TabsContent>

        <TabsContent value="materials" className="mt-6">
          {renderMaterials()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
