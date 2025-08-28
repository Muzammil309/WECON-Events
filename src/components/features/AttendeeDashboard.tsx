'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock,
  Star,
  Bookmark,
  BookmarkCheck,
  UserPlus,
  MessageCircle,
  QrCode,
  Navigation,
  Heart,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AttendeeStats {
  upcomingSessions: {
    id: string;
    title: string;
    startAt: string;
    room?: { name: string; venue?: { name: string } };
    speakers: { speaker: { user: { name: string; avatarUrl?: string } } }[];
  }[];
  bookmarkedSessions: number;
  networkingConnections: number;
  eventsAttending: number;
  checkInsToday: number;
  recommendedSessions: {
    id: string;
    title: string;
    track?: string;
    startAt: string;
    compatibilityScore: number;
  }[];
  networkingSuggestions: {
    id: string;
    name: string;
    company?: string;
    jobTitle?: string;
    avatarUrl?: string;
    compatibilityScore: number;
    commonInterests: string[];
  }[];
}

interface AttendeeDashboardProps {
  userId: string;
  userName: string;
  userAvatar?: string;
}

export default function AttendeeDashboard({ userId, userName, userAvatar }: AttendeeDashboardProps) {
  const [stats, setStats] = useState<AttendeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchAttendeeStats();
    }
  }, [selectedEventId]);

  const fetchEvents = async () => {
    try {
      // Fetch events the user is attending
      const response = await fetch('/api/attendees/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
        if (data.events && data.events.length > 0) {
          setSelectedEventId(data.events[0].id);
        }
      } else {
        // Fallback to demo data
        const demoEvents = [
          {
            id: 'demo-event-1',
            name: 'WECON Masawat 2024'
          }
        ];
        setEvents(demoEvents);
        setSelectedEventId(demoEvents[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // Fallback to demo data
      const demoEvents = [
        {
          id: 'demo-event-1',
          name: 'WECON Masawat 2024'
        }
      ];
      setEvents(demoEvents);
      setSelectedEventId(demoEvents[0].id);
    }
  };

  const fetchAttendeeStats = async () => {
    try {
      setLoading(true);

      // Fetch data with proper error handling
      let agendaData = { agenda: { bookmarkedSessions: [], recommendedSessions: [], totalBookmarked: 0 } };
      let directoryData = { attendees: [] };
      let checkInsData = { checkIns: [] };

      try {
        const agendaRes = await fetch(`/api/attendees/agenda?eventId=${selectedEventId}`);
        if (agendaRes.ok) {
          agendaData = await agendaRes.json();
        }
      } catch (error) {
        console.warn('Failed to fetch agenda data:', error);
      }

      try {
        const directoryRes = await fetch(`/api/attendees/directory?eventId=${selectedEventId}&limit=5`);
        if (directoryRes.ok) {
          directoryData = await directoryRes.json();
        }
      } catch (error) {
        console.warn('Failed to fetch directory data:', error);
      }

      try {
        const checkInsRes = await fetch(`/api/attendees/checkins?eventId=${selectedEventId}&userId=${userId}`);
        if (checkInsRes.ok) {
          checkInsData = await checkInsRes.json();
        }
      } catch (error) {
        console.warn('Failed to fetch check-ins data:', error);
      }

      // Process upcoming sessions from bookmarked sessions
      const now = new Date();
      let upcomingSessions = [];

      if (agendaData.agenda.bookmarkedSessions && agendaData.agenda.bookmarkedSessions.length > 0) {
        upcomingSessions = agendaData.agenda.bookmarkedSessions
          .filter((bookmark: any) => new Date(bookmark.session.startAt) > now)
          .slice(0, 3)
          .map((bookmark: any) => bookmark.session);
      } else {
        // Demo upcoming sessions
        upcomingSessions = [
          {
            id: 'demo-session-1',
            title: 'Opening Keynote: Future of Event Technology',
            startAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
            room: { name: 'Main Auditorium', venue: { name: 'Karachi Expo Center' } },
            speakers: [{ speaker: { user: { name: 'Dr. Sarah Johnson', avatarUrl: null } } }]
          },
          {
            id: 'demo-session-2',
            title: 'Panel: Digital Transformation in Events',
            startAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
            room: { name: 'Conference Room A', venue: { name: 'Karachi Expo Center' } },
            speakers: [{ speaker: { user: { name: 'Multiple Speakers', avatarUrl: null } } }]
          }
        ];
      }

      // Demo recommended sessions
      let recommendedSessions = [];
      if (agendaData.agenda.recommendedSessions && agendaData.agenda.recommendedSessions.length > 0) {
        recommendedSessions = agendaData.agenda.recommendedSessions.slice(0, 3).map((session: any) => ({
          id: session.id,
          title: session.title,
          track: session.track,
          startAt: session.startAt,
          compatibilityScore: Math.floor(Math.random() * 40) + 60
        }));
      } else {
        recommendedSessions = [
          {
            id: 'demo-rec-1',
            title: 'Workshop: Event Marketing Strategies',
            track: 'Marketing',
            startAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            compatibilityScore: 85
          },
          {
            id: 'demo-rec-2',
            title: 'Tech Talk: AI in Event Management',
            track: 'Technology',
            startAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
            compatibilityScore: 78
          }
        ];
      }

      // Demo networking suggestions
      let networkingSuggestions = [];
      if (directoryData.attendees && directoryData.attendees.length > 0) {
        networkingSuggestions = directoryData.attendees.slice(0, 3).map((attendee: any) => ({
          id: attendee.id,
          name: attendee.name,
          company: attendee.company,
          jobTitle: attendee.jobTitle,
          avatarUrl: attendee.avatarUrl,
          compatibilityScore: attendee.networkingCompatibility?.score || 75,
          commonInterests: attendee.networkingCompatibility?.commonInterests || ['Technology', 'Events']
        }));
      } else {
        networkingSuggestions = [
          {
            id: 'demo-person-1',
            name: 'Ahmed Khan',
            company: 'EventTech Solutions',
            jobTitle: 'Event Manager',
            avatarUrl: null,
            compatibilityScore: 85,
            commonInterests: ['Technology', 'Events', 'Marketing']
          },
          {
            id: 'demo-person-2',
            name: 'Maria Rodriguez',
            company: 'Global Events Inc',
            jobTitle: 'Marketing Director',
            avatarUrl: null,
            compatibilityScore: 78,
            commonInterests: ['Marketing', 'Events']
          }
        ];
      }

      const attendeeStats: AttendeeStats = {
        upcomingSessions,
        bookmarkedSessions: agendaData.agenda.totalBookmarked || upcomingSessions.length,
        networkingConnections: 12, // Demo value
        eventsAttending: events.length || 1,
        checkInsToday: checkInsData.checkIns?.filter((checkIn: any) => {
          const checkInDate = new Date(checkIn.checkInAt);
          const today = new Date();
          return checkInDate.toDateString() === today.toDateString();
        }).length || 2, // Demo value
        recommendedSessions,
        networkingSuggestions
      };

      setStats(attendeeStats);
    } catch (error) {
      console.error('Failed to fetch attendee stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeUntil = (dateString: string) => {
    const now = new Date();
    const target = new Date(dateString);
    const diffMs = target.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const days = Math.floor(diffHours / 24);
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMins}m`;
    } else if (diffMins > 0) {
      return `${diffMins}m`;
    } else {
      return 'now';
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
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {userName}!
            </h1>
            <p className="text-blue-100">
              Your personalized event experience awaits
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <QrCode className="h-4 w-4 mr-2" />
              My QR Code
            </Button>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Navigation className="h-4 w-4 mr-2" />
              Venue Map
            </Button>
          </div>
        </div>
      </div>

      {/* Event Selection */}
      {events.length > 1 && (
        <div className="flex items-center gap-4">
          <label htmlFor="event-select" className="text-sm font-medium">
            Current Event:
          </label>
          <select
            id="event-select"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">My Schedule</h3>
            <p className="text-xs text-gray-500">{stats?.bookmarkedSessions || 0} sessions</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Networking</h3>
            <p className="text-xs text-gray-500">{stats?.networkingConnections || 0} connections</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Messages</h3>
            <p className="text-xs text-gray-500">2 new</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <QrCode className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">My QR Code</h3>
            <p className="text-xs text-gray-500">Active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats?.upcomingSessions.map((session, index) => (
              <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-sm line-clamp-2">{session.title}</h4>
                  <Badge variant="outline">
                    {getTimeUntil(session.startAt)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span>{formatTime(session.startAt)}</span>
                  {session.room && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {session.room.venue?.name ?
                          `${session.room.venue.name} - ${session.room.name}` :
                          session.room.name
                        }
                      </span>
                    </div>
                  )}
                </div>
                {session.speakers && session.speakers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={session.speakers[0].speaker.user.avatarUrl} />
                      <AvatarFallback className="text-xs">
                        {session.speakers[0].speaker.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{session.speakers[0].speaker.user.name}</span>
                    {session.speakers.length > 1 && (
                      <span className="text-xs text-gray-500">
                        +{session.speakers.length - 1} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
            {(!stats?.upcomingSessions || stats.upcomingSessions.length === 0) && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
                <p className="text-gray-600 mb-4">Browse sessions to add to your agenda!</p>
                <Button>Browse Sessions</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Networking Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Networking Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats?.networkingSuggestions.map((person, index) => (
              <div key={person.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{person.name}</h4>
                    <p className="text-xs text-gray-500">{person.jobTitle} {person.company && `at ${person.company}`}</p>
                    <p className="text-xs text-gray-400">{person.compatibilityScore}% compatibility</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Connect</Button>
              </div>
            ))}
            {(!stats?.networkingSuggestions || stats.networkingSuggestions.length === 0) && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No networking suggestions</h3>
                <p className="text-gray-600 mb-4">Complete your profile to discover networking opportunities!</p>
                <Button>Complete Profile</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommended Sessions */}
      {stats?.recommendedSessions && stats.recommendedSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Recommended for You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.recommendedSessions.map(session => (
                <div key={session.id} className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-2">{session.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {session.track && (
                          <Badge variant="secondary" className="text-xs">
                            {session.track}
                          </Badge>
                        )}
                        <span className="text-sm text-gray-600">
                          {formatTime(session.startAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">
                          {session.compatibilityScore}% match
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  );
}
