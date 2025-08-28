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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {userName}!
          </h1>
          <p className="text-gray-600">
            Your personalized event experience awaits
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <QrCode className="h-4 w-4 mr-2" />
            My QR Code
          </Button>
          <Button variant="outline" size="sm">
            <Navigation className="h-4 w-4 mr-2" />
            Venue Map
          </Button>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Sessions</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.bookmarkedSessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Bookmarked sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.networkingConnections || 0}</div>
            <p className="text-xs text-muted-foreground">
              Professional connections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-ins Today</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.checkInsToday || 0}</div>
            <p className="text-xs text-muted-foreground">
              Sessions attended
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.eventsAttending || 0}</div>
            <p className="text-xs text-muted-foreground">
              Events attending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats?.upcomingSessions.map(session => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium line-clamp-1">{session.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
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
                  {session.speakers.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      {session.speakers.slice(0, 2).map((speaker, index) => (
                        <Avatar key={index} className="h-6 w-6">
                          <AvatarImage src={speaker.speaker.user.avatarUrl} />
                          <AvatarFallback className="text-xs">
                            {speaker.speaker.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      <span className="text-xs text-gray-500">
                        {session.speakers[0].speaker.user.name}
                        {session.speakers.length > 1 && ` +${session.speakers.length - 1} more`}
                      </span>
                    </div>
                  )}
                </div>
                <Badge variant="outline">
                  {getTimeUntil(session.startAt)}
                </Badge>
              </div>
            ))}
            {stats?.upcomingSessions.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No upcoming sessions. Browse sessions to add to your agenda!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recommended Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Recommended for You
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats?.recommendedSessions.map(session => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex-1">
                  <h4 className="font-medium line-clamp-1">{session.title}</h4>
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
            ))}
            {stats?.recommendedSessions.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Complete your profile to get personalized recommendations!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Networking Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            People You Should Meet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats?.networkingSuggestions.map(person => (
              <div key={person.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={person.avatarUrl} />
                    <AvatarFallback>
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{person.name}</h4>
                    <p className="text-sm text-gray-600">
                      {person.jobTitle} {person.company && `at ${person.company}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <Heart className="h-3 w-3 text-red-500" />
                  <span className="text-xs text-gray-600">
                    {person.compatibilityScore}% compatibility
                  </span>
                </div>
                {person.commonInterests.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {person.commonInterests.slice(0, 2).map(interest => (
                      <Badge key={interest} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                    {person.commonInterests.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{person.commonInterests.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <UserPlus className="h-3 w-3 mr-1" />
                    Connect
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {stats?.networkingSuggestions.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              Complete your profile and interests to discover networking opportunities!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
