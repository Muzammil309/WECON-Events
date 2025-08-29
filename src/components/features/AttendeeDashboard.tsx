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
  TrendingUp,
  Bell,
  Settings,
  BarChart3,
  Ticket,
  Map,
  Wifi,
  Coffee,
  Award,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Share2,
  Download,
  Filter,
  Search,
  ChevronRight,
  Building2,
  Globe,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  MapPin as LocationIcon,
  Users as NetworkIcon,
  Zap,
  Target,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

interface AttendeeStats {
  upcomingSessions: {
    id: string;
    title: string;
    startAt: string;
    endAt: string;
    room?: { name: string; venue?: { name: string } };
    speakers: { speaker: { user: { name: string; avatarUrl?: string } } }[];
    track?: string;
    isBookmarked?: boolean;
    attendeeCount?: number;
  }[];
  bookmarkedSessions: number;
  networkingConnections: number;
  eventsAttending: number;
  checkInsToday: number;
  totalSessions: number;
  completedSessions: number;
  engagementScore: number;
  recommendedSessions: {
    id: string;
    title: string;
    track?: string;
    startAt: string;
    endAt: string;
    compatibilityScore: number;
    room?: { name: string; venue?: { name: string } };
    speakers: { speaker: { user: { name: string; avatarUrl?: string } } }[];
    description?: string;
  }[];
  networkingSuggestions: {
    id: string;
    name: string;
    company?: string;
    jobTitle?: string;
    avatarUrl?: string;
    compatibilityScore: number;
    commonInterests: string[];
    location?: string;
    isOnline?: boolean;
  }[];
  recentActivity: {
    id: string;
    type: 'session_joined' | 'connection_made' | 'feedback_given' | 'session_bookmarked';
    title: string;
    timestamp: string;
    details?: string;
  }[];
  exhibitors: {
    id: string;
    name: string;
    booth: string;
    category: string;
    logoUrl?: string;
    description: string;
    isVisited?: boolean;
  }[];
  notifications: {
    id: string;
    type: 'session_reminder' | 'networking_match' | 'event_update' | 'feedback_request';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    actionUrl?: string;
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
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchEvents();
    // Update current time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
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

      // Enhanced demo data for upcoming sessions
      const now = new Date();
      let upcomingSessions = [];

      if (agendaData.agenda.bookmarkedSessions && agendaData.agenda.bookmarkedSessions.length > 0) {
        upcomingSessions = agendaData.agenda.bookmarkedSessions
          .filter((bookmark: any) => new Date(bookmark.session.startAt) > now)
          .slice(0, 4)
          .map((bookmark: any) => ({
            ...bookmark.session,
            isBookmarked: true,
            attendeeCount: Math.floor(Math.random() * 200) + 50
          }));
      } else {
        // Enhanced demo upcoming sessions
        upcomingSessions = [
          {
            id: 'demo-session-1',
            title: 'Opening Keynote: Future of Event Technology',
            startAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            endAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
            room: { name: 'Main Auditorium', venue: { name: 'Karachi Expo Center' } },
            speakers: [{ speaker: { user: { name: 'Dr. Sarah Johnson', avatarUrl: null } } }],
            track: 'Technology',
            isBookmarked: true,
            attendeeCount: 245
          },
          {
            id: 'demo-session-2',
            title: 'Panel: Digital Transformation in Events',
            startAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
            endAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
            room: { name: 'Conference Room A', venue: { name: 'Karachi Expo Center' } },
            speakers: [{ speaker: { user: { name: 'Ahmed Khan', avatarUrl: null } } }],
            track: 'Business',
            isBookmarked: false,
            attendeeCount: 156
          },
          {
            id: 'demo-session-3',
            title: 'Workshop: Event Marketing Strategies',
            startAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            endAt: new Date(Date.now() + 7.5 * 60 * 60 * 1000).toISOString(),
            room: { name: 'Workshop Room B', venue: { name: 'Karachi Expo Center' } },
            speakers: [{ speaker: { user: { name: 'Maria Rodriguez', avatarUrl: null } } }],
            track: 'Marketing',
            isBookmarked: true,
            attendeeCount: 89
          }
        ];
      }

      // Enhanced demo recommended sessions
      let recommendedSessions = [];
      if (agendaData.agenda.recommendedSessions && agendaData.agenda.recommendedSessions.length > 0) {
        recommendedSessions = agendaData.agenda.recommendedSessions.slice(0, 4).map((session: any) => ({
          id: session.id,
          title: session.title,
          track: session.track,
          startAt: session.startAt,
          endAt: session.endAt,
          compatibilityScore: Math.floor(Math.random() * 40) + 60,
          room: session.room,
          speakers: session.speakers,
          description: session.description
        }));
      } else {
        recommendedSessions = [
          {
            id: 'demo-rec-1',
            title: 'AI-Powered Event Analytics Workshop',
            track: 'Technology',
            startAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            endAt: new Date(Date.now() + 7.5 * 60 * 60 * 1000).toISOString(),
            compatibilityScore: 92,
            room: { name: 'Tech Lab', venue: { name: 'Karachi Expo Center' } },
            speakers: [{ speaker: { user: { name: 'Dr. Ali Hassan', avatarUrl: null } } }],
            description: 'Learn how AI is revolutionizing event analytics and attendee engagement.'
          },
          {
            id: 'demo-rec-2',
            title: 'Sustainable Event Management Practices',
            track: 'Sustainability',
            startAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
            endAt: new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString(),
            compatibilityScore: 87,
            room: { name: 'Green Room', venue: { name: 'Karachi Expo Center' } },
            speakers: [{ speaker: { user: { name: 'Fatima Sheikh', avatarUrl: null } } }],
            description: 'Discover eco-friendly approaches to event planning and execution.'
          },
          {
            id: 'demo-rec-3',
            title: 'Virtual Reality in Event Experiences',
            track: 'Innovation',
            startAt: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
            endAt: new Date(Date.now() + 11 * 60 * 60 * 1000).toISOString(),
            compatibilityScore: 84,
            room: { name: 'VR Studio', venue: { name: 'Karachi Expo Center' } },
            speakers: [{ speaker: { user: { name: 'Omar Malik', avatarUrl: null } } }],
            description: 'Explore cutting-edge VR technologies transforming event experiences.'
          }
        ];
      }

      // Enhanced demo networking suggestions
      let networkingSuggestions = [];
      if (directoryData.attendees && directoryData.attendees.length > 0) {
        networkingSuggestions = directoryData.attendees.slice(0, 5).map((attendee: any) => ({
          id: attendee.id,
          name: attendee.name,
          company: attendee.company,
          jobTitle: attendee.jobTitle,
          avatarUrl: attendee.avatarUrl,
          compatibilityScore: attendee.networkingCompatibility?.score || 75,
          commonInterests: attendee.networkingCompatibility?.commonInterests || ['Technology', 'Events'],
          location: attendee.location,
          isOnline: attendee.isOnline
        }));
      } else {
        networkingSuggestions = [
          {
            id: 'demo-person-1',
            name: 'Ahmed Khan',
            company: 'EventTech Solutions',
            jobTitle: 'Senior Event Manager',
            avatarUrl: null,
            compatibilityScore: 94,
            commonInterests: ['Technology', 'Events', 'AI', 'Innovation'],
            location: 'Karachi, Pakistan',
            isOnline: true
          },
          {
            id: 'demo-person-2',
            name: 'Maria Rodriguez',
            company: 'Global Events Inc',
            jobTitle: 'Marketing Director',
            avatarUrl: null,
            compatibilityScore: 89,
            commonInterests: ['Marketing', 'Events', 'Digital Strategy'],
            location: 'Dubai, UAE',
            isOnline: true
          },
          {
            id: 'demo-person-3',
            name: 'Dr. Sarah Chen',
            company: 'Tech Innovations Ltd',
            jobTitle: 'CTO',
            avatarUrl: null,
            compatibilityScore: 87,
            commonInterests: ['Technology', 'AI', 'Startups'],
            location: 'Singapore',
            isOnline: false
          },
          {
            id: 'demo-person-4',
            name: 'Hassan Ali',
            company: 'Creative Events Co',
            jobTitle: 'Creative Director',
            avatarUrl: null,
            compatibilityScore: 82,
            commonInterests: ['Design', 'Events', 'Branding'],
            location: 'Lahore, Pakistan',
            isOnline: true
          }
        ];
      }

      // Enhanced demo data for additional features
      const recentActivity = [
        {
          id: 'activity-1',
          type: 'session_joined' as const,
          title: 'Joined "AI in Event Management"',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          details: 'Tech Lab - 2 hours ago'
        },
        {
          id: 'activity-2',
          type: 'connection_made' as const,
          title: 'Connected with Ahmed Khan',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          details: 'EventTech Solutions'
        },
        {
          id: 'activity-3',
          type: 'session_bookmarked' as const,
          title: 'Bookmarked "Sustainable Events"',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          details: 'Green Room - Tomorrow 2:00 PM'
        }
      ];

      const exhibitors = [
        {
          id: 'exhibitor-1',
          name: 'EventTech Solutions',
          booth: 'A-12',
          category: 'Technology',
          logoUrl: null,
          description: 'Leading provider of event management software and digital solutions.',
          isVisited: true
        },
        {
          id: 'exhibitor-2',
          name: 'Creative Events Co',
          booth: 'B-08',
          category: 'Design & Production',
          logoUrl: null,
          description: 'Full-service event production and creative design agency.',
          isVisited: false
        },
        {
          id: 'exhibitor-3',
          name: 'Global Catering Services',
          booth: 'C-15',
          category: 'Catering',
          logoUrl: null,
          description: 'Premium catering and hospitality services for events of all sizes.',
          isVisited: false
        }
      ];

      const notifications = [
        {
          id: 'notif-1',
          type: 'session_reminder' as const,
          title: 'Session Starting Soon',
          message: 'Opening Keynote starts in 30 minutes',
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          isRead: false,
          actionUrl: '/attendee/schedule'
        },
        {
          id: 'notif-2',
          type: 'networking_match' as const,
          title: 'New Networking Match',
          message: 'You have 3 new networking suggestions',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          actionUrl: '/attendee/networking'
        }
      ];

      const attendeeStats: AttendeeStats = {
        upcomingSessions,
        bookmarkedSessions: agendaData.agenda.totalBookmarked || upcomingSessions.filter(s => s.isBookmarked).length,
        networkingConnections: 18, // Demo value
        eventsAttending: events.length || 1,
        checkInsToday: checkInsData.checkIns?.filter((checkIn: any) => {
          const checkInDate = new Date(checkIn.checkInAt);
          const today = new Date();
          return checkInDate.toDateString() === today.toDateString();
        }).length || 3, // Demo value
        totalSessions: 24,
        completedSessions: 8,
        engagementScore: 87,
        recommendedSessions,
        networkingSuggestions,
        recentActivity,
        exhibitors,
        notifications
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
      {/* Enhanced Welcome Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={userAvatar} />
                  <AvatarFallback className="bg-white/30 text-white text-lg font-bold">
                    {userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  Welcome back, {userName}!
                </h1>
                <p className="text-blue-100 text-lg">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm">Engagement Score: {stats?.engagementScore || 87}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">{stats?.checkInsToday || 3} check-ins today</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/attendee/qr-code">
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                  <QrCode className="h-4 w-4 mr-2" />
                  My QR Code
                </Button>
              </Link>
              <Link href="/attendee/map">
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                  <Map className="h-4 w-4 mr-2" />
                  Venue Map
                </Button>
              </Link>
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                {stats?.notifications?.filter(n => !n.isRead).length > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white">
                    {stats.notifications.filter(n => !n.isRead).length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Selection */}
      {events.length > 1 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <label htmlFor="event-select" className="text-sm font-medium text-gray-700">
                Current Event:
              </label>
              <select
                id="event-select"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/attendee/schedule">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500 hover:scale-[1.02] bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Schedule</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.bookmarkedSessions || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats?.totalSessions || 24} total sessions
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress
                  value={(stats?.bookmarkedSessions || 0) / (stats?.totalSessions || 24) * 100}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/attendee/networking">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-green-500 hover:scale-[1.02] bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Networking</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.networkingConnections || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats?.networkingSuggestions?.length || 0} new suggestions
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {stats?.networkingSuggestions?.slice(0, 3).map((person, idx) => (
                    <div key={idx} className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-semibold">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-gray-500">Active now</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/attendee/messages">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-purple-500 hover:scale-[1.02] bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Messages</p>
                  <p className="text-3xl font-bold text-gray-900">2</p>
                  <p className="text-xs text-gray-500 mt-1">New messages</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center relative">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">2</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-600">Last message 5 min ago</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-orange-500 hover:scale-[1.02] bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.engagementScore || 87}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats?.completedSessions || 8} sessions completed
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={stats?.engagementScore || 87} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 mt-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-8 bg-transparent gap-1">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100 data-[state=active]:hover:bg-blue-600"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100 data-[state=active]:hover:bg-blue-600"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Schedule</span>
            </TabsTrigger>
            <TabsTrigger
              value="networking"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100 data-[state=active]:hover:bg-blue-600"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Networking</span>
            </TabsTrigger>
            <TabsTrigger
              value="exhibitors"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100 data-[state=active]:hover:bg-blue-600"
            >
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Exhibitors</span>
            </TabsTrigger>
            <TabsTrigger
              value="sessions"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100 data-[state=active]:hover:bg-blue-600"
            >
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Sessions</span>
            </TabsTrigger>
            <TabsTrigger
              value="maps"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100 data-[state=active]:hover:bg-blue-600"
            >
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Maps</span>
            </TabsTrigger>
            <TabsTrigger
              value="feedback"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100 data-[state=active]:hover:bg-blue-600"
            >
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Feedback</span>
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100 data-[state=active]:hover:bg-blue-600"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upcoming Sessions */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-lg font-semibold text-gray-900">Upcoming Sessions</span>
                  </div>
                  <Link href="/attendee/schedule">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats?.upcomingSessions.slice(0, 3).map((session, index) => (
                  <div key={session.id} className="border rounded-xl p-4 hover:bg-blue-50 transition-all duration-200 hover:border-blue-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 line-clamp-2">{session.title}</h4>
                          {session.isBookmarked && (
                            <BookmarkCheck className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        {session.track && (
                          <Badge variant="secondary" className="text-xs mb-2">
                            {session.track}
                          </Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        {getTimeUntil(session.startAt)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        <span>{formatTime(session.startAt)} - {formatTime(session.endAt)}</span>
                      </div>
                      {session.room && (
                        <div className="flex items-center gap-1">
                          <LocationIcon className="h-3 w-3" />
                          <span className="truncate">
                            {session.room.venue?.name ?
                              `${session.room.venue.name} - ${session.room.name}` :
                              session.room.name
                            }
                          </span>
                        </div>
                      )}
                      {session.attendeeCount && (
                        <div className="flex items-center gap-1">
                          <NetworkIcon className="h-3 w-3" />
                          <span>{session.attendeeCount} attending</span>
                        </div>
                      )}
                    </div>

                    {session.speakers && session.speakers.length > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={session.speakers[0].speaker.user.avatarUrl} />
                            <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              {session.speakers[0].speaker.user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="text-sm font-medium">{session.speakers[0].speaker.user.name}</span>
                            {session.speakers.length > 1 && (
                              <span className="text-xs text-gray-500 ml-1">
                                +{session.speakers.length - 1} more
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!session.isBookmarked && (
                            <Button size="sm" variant="outline" className="h-8">
                              <Bookmark className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                          )}
                          <Button size="sm" className="h-8">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Join
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {(!stats?.upcomingSessions || stats.upcomingSessions.length === 0) && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
                    <p className="text-gray-600 mb-6">Browse sessions to add to your agenda!</p>
                    <Link href="/attendee/schedule">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Browse Sessions
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Networking Suggestions */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="text-lg font-semibold text-gray-900">Networking Suggestions</span>
                  </div>
                  <Link href="/attendee/networking">
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats?.networkingSuggestions.slice(0, 3).map((person, index) => (
                  <div key={person.id} className="border rounded-xl p-4 hover:bg-green-50 transition-all duration-200 hover:border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          {person.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{person.name}</h4>
                            {person.isOnline && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                Online
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {person.jobTitle} {person.company && `at ${person.company}`}
                          </p>
                          {person.location && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Globe className="h-3 w-3" />
                              {person.location}
                            </p>
                          )}
                          <div className="flex items-center gap-1 mt-2">
                            <Target className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">
                              {person.compatibilityScore}% compatibility
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {person.commonInterests.slice(0, 3).map((interest, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <UserPlus className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {(!stats?.networkingSuggestions || stats.networkingSuggestions.length === 0) && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No networking suggestions</h3>
                    <p className="text-gray-600 mb-6">Complete your profile to discover networking opportunities!</p>
                    <Link href="/attendee/profile">
                      <Button className="bg-green-600 hover:bg-green-700">
                        Complete Profile
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Notifications */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <span className="text-lg font-semibold text-gray-900">Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats?.recentActivity.map((activity, index) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {activity.type === 'session_joined' && <Calendar className="h-4 w-4 text-purple-600" />}
                      {activity.type === 'connection_made' && <Users className="h-4 w-4 text-purple-600" />}
                      {activity.type === 'session_bookmarked' && <Bookmark className="h-4 w-4 text-purple-600" />}
                      {activity.type === 'feedback_given' && <Star className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      {activity.details && (
                        <p className="text-xs text-gray-500">{activity.details}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-orange-600" />
                    <span className="text-lg font-semibold text-gray-900">Notifications</span>
                  </div>
                  {stats?.notifications?.filter(n => !n.isRead).length > 0 && (
                    <Badge className="bg-red-500 text-white">
                      {stats.notifications.filter(n => !n.isRead).length} new
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats?.notifications.slice(0, 4).map((notification, index) => (
                  <div key={notification.id} className={`p-3 rounded-lg border transition-colors ${
                    !notification.isRead ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        !notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {notification.type === 'session_reminder' && <Clock className="h-4 w-4 text-blue-600" />}
                        {notification.type === 'networking_match' && <Users className="h-4 w-4 text-green-600" />}
                        {notification.type === 'event_update' && <Bell className="h-4 w-4 text-orange-600" />}
                        {notification.type === 'feedback_request' && <Star className="h-4 w-4 text-yellow-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          {/* Recommended Sessions */}
          {stats?.recommendedSessions && stats.recommendedSessions.length > 0 && (
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-lg font-semibold text-gray-900">Recommended for You</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.recommendedSessions.map(session => (
                    <div key={session.id} className="border rounded-xl p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 line-clamp-2 mb-2">{session.title}</h4>
                          <div className="flex items-center gap-2 mb-2">
                            {session.track && (
                              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                                {session.track}
                              </Badge>
                            )}
                            <span className="text-sm text-gray-600">
                              {formatTime(session.startAt)} - {formatTime(session.endAt)}
                            </span>
                          </div>
                          {session.room && (
                            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                              <LocationIcon className="h-3 w-3" />
                              {session.room.venue?.name} - {session.room.name}
                            </p>
                          )}
                          {session.description && (
                            <p className="text-xs text-gray-600 line-clamp-2 mb-2">{session.description}</p>
                          )}
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">
                              {session.compatibilityScore}% match
                            </span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="bg-white hover:bg-yellow-50">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                      {session.speakers && session.speakers.length > 0 && (
                        <div className="flex items-center justify-between pt-3 border-t border-yellow-200">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={session.speakers[0].speaker.user.avatarUrl} />
                              <AvatarFallback className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                {session.speakers[0].speaker.user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">{session.speakers[0].speaker.user.name}</span>
                          </div>
                          <Button size="sm" className="h-7 bg-yellow-600 hover:bg-yellow-700">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Networking Tab */}
        <TabsContent value="networking" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* All Networking Suggestions */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="text-lg font-semibold text-gray-900">All Networking Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats?.networkingSuggestions.map((person, index) => (
                  <div key={person.id} className="border rounded-xl p-4 hover:bg-green-50 transition-all duration-200 hover:border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          {person.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{person.name}</h4>
                            {person.isOnline && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                Online
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {person.jobTitle} {person.company && `at ${person.company}`}
                          </p>
                          {person.location && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Globe className="h-3 w-3" />
                              {person.location}
                            </p>
                          )}
                          <div className="flex items-center gap-1 mt-2">
                            <Target className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">
                              {person.compatibilityScore}% compatibility
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {person.commonInterests.map((interest, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <UserPlus className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Networking Stats */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-900">Networking Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{stats?.networkingConnections || 18}</div>
                  <p className="text-gray-600">Total Connections</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Profile Completeness</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Networking Activity</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Response Rate</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Link href="/attendee/profile">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Settings className="h-4 w-4 mr-2" />
                      Update Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Learning Labs */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-900">Learning Labs</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { title: "AI & Machine Learning Workshop", time: "10:00 AM - 12:00 PM", instructor: "Dr. Sarah Ahmed", level: "Intermediate", spots: "8/20" },
                    { title: "Digital Marketing Strategies", time: "2:00 PM - 4:00 PM", instructor: "Mark Johnson", level: "Beginner", spots: "15/25" },
                    { title: "Data Analytics Bootcamp", time: "3:00 PM - 5:00 PM", instructor: "Prof. Ali Khan", level: "Advanced", spots: "5/15" }
                  ].map((lab, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{lab.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {lab.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {lab.instructor}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={lab.level === 'Beginner' ? 'secondary' : lab.level === 'Intermediate' ? 'default' : 'destructive'}>
                              {lab.level}
                            </Badge>
                            <span className="text-sm text-gray-500">Spots: {lab.spots}</span>
                          </div>
                        </div>
                        <Button size="sm" className="ml-4">Register</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skill Clinics */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  <span className="text-lg font-semibold text-gray-900">Skill Clinics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { title: "Public Speaking Mastery", time: "11:00 AM - 12:30 PM", duration: "90 min", type: "Interactive" },
                    { title: "Leadership in Tech", time: "1:00 PM - 2:30 PM", duration: "90 min", type: "Panel" },
                    { title: "Networking Skills", time: "4:00 PM - 5:00 PM", duration: "60 min", type: "Workshop" }
                  ].map((clinic, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{clinic.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {clinic.time}
                            </div>
                            <span>({clinic.duration})</span>
                          </div>
                          <Badge variant="outline">{clinic.type}</Badge>
                        </div>
                        <Button size="sm" variant="outline">Join</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Story Circles */}
          <Card className="shadow-sm bg-white border border-gray-200">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold text-gray-900">Story Circles</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "Startup Success Stories", time: "12:00 PM", participants: 8, maxParticipants: 12, topic: "Entrepreneurship" },
                  { title: "Career Transition Tales", time: "2:30 PM", participants: 6, maxParticipants: 10, topic: "Career Growth" },
                  { title: "Innovation Journeys", time: "4:30 PM", participants: 10, maxParticipants: 15, topic: "Technology" }
                ].map((circle, idx) => (
                  <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h4 className="font-semibold text-gray-900 mb-2">{circle.title}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {circle.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {circle.participants}/{circle.maxParticipants} participants
                      </div>
                      <Badge variant="secondary" className="text-xs">{circle.topic}</Badge>
                    </div>
                    <Button size="sm" className="w-full mt-3">Join Circle</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exhibitors Tab */}
        <TabsContent value="exhibitors" className="space-y-6">
          <Card className="shadow-sm bg-white border border-gray-200">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                <span className="text-lg font-semibold text-gray-900">Event Exhibitors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats?.exhibitors.map((exhibitor, index) => (
                  <div key={exhibitor.id} className={`border rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
                    exhibitor.isVisited ? 'bg-green-50 border-green-200' : 'hover:bg-purple-50 hover:border-purple-200'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {exhibitor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{exhibitor.name}</h4>
                          <p className="text-sm text-gray-600">Booth {exhibitor.booth}</p>
                        </div>
                      </div>
                      {exhibitor.isVisited && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>

                    <Badge variant="secondary" className="mb-3">
                      {exhibitor.category}
                    </Badge>

                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {exhibitor.description}
                    </p>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        Locate
                      </Button>
                      <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maps Tab */}
        <TabsContent value="maps" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Interactive Floor Plan */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-900">Interactive Floor Plan</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive venue map will load here</p>
                    <p className="text-sm text-gray-500">Click on areas to get directions</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    Get Directions
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Map
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Location Directory */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <LocationIcon className="h-5 w-5 text-green-600" />
                  <span className="text-lg font-semibold text-gray-900">Location Directory</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {[
                    { name: "Main Conference Hall", floor: "Ground Floor", capacity: "500 seats", amenities: ["WiFi", "AC", "Projector"] },
                    { name: "Learning Lab A", floor: "1st Floor", capacity: "25 seats", amenities: ["WiFi", "Whiteboard", "Computers"] },
                    { name: "Learning Lab B", floor: "1st Floor", capacity: "20 seats", amenities: ["WiFi", "Flipchart", "Projector"] },
                    { name: "Exhibition Hall", floor: "Ground Floor", capacity: "50 booths", amenities: ["WiFi", "Power", "Storage"] },
                    { name: "Networking Lounge", floor: "2nd Floor", capacity: "100 people", amenities: ["WiFi", "Refreshments", "Seating"] }
                  ].map((location, idx) => (
                    <div key={idx} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{location.name}</h4>
                          <p className="text-sm text-gray-600">{location.floor} • {location.capacity}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {location.amenities.map((amenity, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{amenity}</Badge>
                            ))}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Navigation className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Access */}
          <Card className="shadow-sm bg-white border border-gray-200">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                <span className="text-lg font-semibold text-gray-900">Quick Access</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Coffee, label: "Food Court", location: "Ground Floor" },
                  { icon: Wifi, label: "WiFi Zones", location: "All Floors" },
                  { icon: Users, label: "Registration", location: "Main Entrance" },
                  { icon: Phone, label: "Help Desk", location: "Ground Floor" }
                ].map((item, idx) => (
                  <div key={idx} className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <item.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 text-sm">{item.label}</h4>
                    <p className="text-xs text-gray-600">{item.location}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Session Feedback */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-lg font-semibold text-gray-900">Session Feedback</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { session: "Future of Event Technology", speaker: "Dr. Sarah Ahmed", attended: true, rated: false },
                    { session: "Digital Transformation in Events", speaker: "Mark Johnson", attended: true, rated: true },
                    { session: "Panel: Digital Transformation in Events", speaker: "Multiple Speakers", attended: false, rated: false }
                  ].map((session, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{session.session}</h4>
                          <p className="text-sm text-gray-600 mb-2">Speaker: {session.speaker}</p>
                          <div className="flex items-center gap-2">
                            {session.attended ? (
                              <Badge className="bg-green-100 text-green-800">Attended</Badge>
                            ) : (
                              <Badge variant="secondary">Not Attended</Badge>
                            )}
                            {session.rated && (
                              <Badge className="bg-yellow-100 text-yellow-800">Rated</Badge>
                            )}
                          </div>
                        </div>
                        {session.attended && !session.rated && (
                          <Button size="sm">Rate Session</Button>
                        )}
                        {session.rated && (
                          <Button size="sm" variant="outline">View Rating</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Event Feedback */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-lg font-semibold text-gray-900">Event Feedback</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Share Your Experience</h3>
                    <p className="text-gray-600 mb-4">Help us improve future events with your feedback</p>
                    <Button className="w-full">Provide Event Feedback</Button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Quick Polls</h4>
                    {[
                      { question: "How would you rate the venue?", answered: false },
                      { question: "Was the content relevant to your interests?", answered: true },
                      { question: "How likely are you to recommend this event?", answered: false }
                    ].map((poll, idx) => (
                      <div key={idx} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{poll.question}</p>
                          {poll.answered ? (
                            <Badge className="bg-green-100 text-green-800">Answered</Badge>
                          ) : (
                            <Button size="sm" variant="outline">Answer</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Profile Information */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-900">Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={userAvatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-bold">
                        {userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{userName}</h3>
                      <p className="text-gray-600">attendee@wecon-masawat.com</p>
                      <Button size="sm" variant="outline" className="mt-2">Edit Profile</Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Company</label>
                      <p className="text-gray-900">Tech Solutions Inc.</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Job Title</label>
                      <p className="text-gray-900">Software Developer</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Interests</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {["AI/ML", "Web Development", "Cloud Computing", "DevOps"].map((interest, idx) => (
                          <Badge key={idx} variant="secondary">{interest}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Preferences */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  <span className="text-lg font-semibold text-gray-900">Event Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Notification Settings</h4>
                    {[
                      { label: "Session reminders", enabled: true },
                      { label: "Networking suggestions", enabled: true },
                      { label: "Event updates", enabled: false },
                      { label: "Exhibitor messages", enabled: true }
                    ].map((setting, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{setting.label}</span>
                        <div className={`w-10 h-6 rounded-full ${setting.enabled ? 'bg-blue-600' : 'bg-gray-300'} relative cursor-pointer transition-colors`}>
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${setting.enabled ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Privacy Settings</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Show profile to other attendees</span>
                        <div className="w-10 h-6 rounded-full bg-blue-600 relative cursor-pointer">
                          <div className="w-4 h-4 bg-white rounded-full absolute top-1 translate-x-5 transition-transform"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Allow networking requests</span>
                        <div className="w-10 h-6 rounded-full bg-blue-600 relative cursor-pointer">
                          <div className="w-4 h-4 bg-white rounded-full absolute top-1 translate-x-5 transition-transform"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My QR Code */}
          <Card className="shadow-sm bg-white border border-gray-200">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-purple-600" />
                <span className="text-lg font-semibold text-gray-900">My QR Code</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="bg-gray-100 p-8 rounded-lg">
                  <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="font-semibold text-gray-900 mb-2">Your Personal QR Code</h3>
                  <p className="text-gray-600 mb-4">
                    Use this QR code for quick check-ins, networking, and accessing event features.
                    Other attendees can scan this to connect with you instantly.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
