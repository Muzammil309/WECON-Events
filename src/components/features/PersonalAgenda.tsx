'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star,
  Bookmark,
  BookmarkCheck,
  Download,
  Filter,
  Search,
  Plus,
  Heart,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BookmarkedSession {
  id: string;
  session: {
    id: string;
    title: string;
    abstract?: string;
    track?: string;
    startAt: string;
    endAt: string;
    room?: {
      name: string;
      venue?: {
        name: string;
        address?: string;
      };
    };
    speakers: {
      speaker: {
        user: {
          name: string;
          avatarUrl?: string;
          company?: string;
          jobTitle?: string;
        };
      };
    }[];
    resources: {
      id: string;
      title: string;
      url: string;
    }[];
    averageRating?: number;
    userFeedback?: {
      rating: number;
      comment: string;
    };
    _count: {
      feedback: number;
    };
  };
  createdAt: string;
}

interface RecommendedSession {
  id: string;
  title: string;
  track?: string;
  startAt: string;
  endAt: string;
  room?: {
    name: string;
    venue?: { name: string };
  };
  speakers: {
    speaker: {
      user: {
        name: string;
        avatarUrl?: string;
      };
    };
  }[];
  _count: {
    feedback: number;
  };
}

interface PersonalAgendaProps {
  eventId: string;
  userId: string;
}

export default function PersonalAgenda({ eventId, userId }: PersonalAgendaProps) {
  const [bookmarkedSessions, setBookmarkedSessions] = useState<BookmarkedSession[]>([]);
  const [recommendedSessions, setRecommendedSessions] = useState<RecommendedSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [trackFilter, setTrackFilter] = useState('');
  const [tracks, setTracks] = useState<string[]>([]);
  const [userInterests, setUserInterests] = useState<string[]>([]);

  useEffect(() => {
    fetchAgenda();
  }, [eventId, selectedDate]);

  const fetchAgenda = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('eventId', eventId);
      if (selectedDate) params.append('date', selectedDate);

      const response = await fetch(`/api/attendees/agenda?${params}`);
      if (response.ok) {
        const data = await response.json();
        setBookmarkedSessions(data.agenda.bookmarkedSessions || []);
        setRecommendedSessions(data.agenda.recommendedSessions || []);
        setUserInterests(data.agenda.userInterests || []);

        // Extract unique tracks
        const allSessions = [
          ...data.agenda.bookmarkedSessions.map((b: BookmarkedSession) => b.session),
          ...data.agenda.recommendedSessions
        ];
        const uniqueTracks = [...new Set(allSessions
          .map((s: any) => s.track)
          .filter(Boolean)
        )];
        setTracks(uniqueTracks);
      }
    } catch (error) {
      console.error('Failed to fetch agenda:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (sessionId: string, isBookmarked: boolean) => {
    try {
      const response = await fetch('/api/attendees/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action: isBookmarked ? 'unbookmark' : 'bookmark'
        })
      });

      if (response.ok) {
        if (isBookmarked) {
          // Remove from bookmarked sessions
          setBookmarkedSessions(bookmarkedSessions.filter(b => b.session.id !== sessionId));
        } else {
          // Add to bookmarked sessions (would need to fetch the session details)
          fetchAgenda();
        }
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const exportToCalendar = () => {
    // Generate ICS file for calendar export
    const sessions = bookmarkedSessions.map(b => b.session);
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//WECON//Masawat//EN\n';
    
    sessions.forEach(session => {
      const startDate = new Date(session.startAt).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const endDate = new Date(session.endAt).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      icsContent += `BEGIN:VEVENT\n`;
      icsContent += `UID:${session.id}@wecon-masawat.com\n`;
      icsContent += `DTSTART:${startDate}\n`;
      icsContent += `DTEND:${endDate}\n`;
      icsContent += `SUMMARY:${session.title}\n`;
      icsContent += `DESCRIPTION:${session.abstract || ''}\n`;
      icsContent += `LOCATION:${session.room?.venue?.name || ''} - ${session.room?.name || ''}\n`;
      icsContent += `END:VEVENT\n`;
    });
    
    icsContent += 'END:VCALENDAR';
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wecon-agenda.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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

  const filteredBookmarkedSessions = bookmarkedSessions.filter(bookmark => {
    const session = bookmark.session;
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.abstract?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrack = !trackFilter || session.track === trackFilter;
    return matchesSearch && matchesTrack;
  });

  const filteredRecommendedSessions = recommendedSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrack = !trackFilter || session.track === trackFilter;
    return matchesSearch && matchesTrack;
  });

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
          <h2 className="text-2xl font-bold">My Personal Agenda</h2>
          <p className="text-gray-600">
            {bookmarkedSessions.length} sessions bookmarked
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCalendar}>
            <Download className="h-4 w-4 mr-2" />
            Export Calendar
          </Button>
        </div>
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
        <Select value={selectedDate} onValueChange={setSelectedDate}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Days</SelectItem>
            {/* Add actual event dates here */}
            <SelectItem value="2024-03-15">Day 1 - March 15</SelectItem>
            <SelectItem value="2024-03-16">Day 2 - March 16</SelectItem>
            <SelectItem value="2024-03-17">Day 3 - March 17</SelectItem>
          </SelectContent>
        </Select>
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
      </div>

      {/* User Interests */}
      {userInterests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Your Interests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userInterests.map(interest => (
                <Badge key={interest} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bookmarked Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookmarkCheck className="h-5 w-5" />
            My Bookmarked Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredBookmarkedSessions.map(bookmark => {
            const session = bookmark.session;
            return (
              <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-2">{session.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(session.startAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(session.startAt)} - {formatTime(session.endAt)}</span>
                      </div>
                      <span className="text-blue-600">
                        {getDuration(session.startAt, session.endAt)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBookmark(session.id, true)}
                  >
                    <BookmarkCheck className="h-4 w-4 text-blue-600" />
                  </Button>
                </div>

                {session.abstract && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {session.abstract}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {session.track && (
                      <Badge variant="secondary">{session.track}</Badge>
                    )}
                    {session.room && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
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
                  
                  {session.averageRating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{session.averageRating.toFixed(1)}</span>
                      <span className="text-xs text-gray-500">
                        ({session._count.feedback} reviews)
                      </span>
                    </div>
                  )}
                </div>

                {session.speakers.length > 0 && (
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t">
                    <Users className="h-4 w-4 text-gray-400" />
                    <div className="flex items-center gap-2">
                      {session.speakers.slice(0, 3).map((speaker, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={speaker.speaker.user.avatarUrl} />
                            <AvatarFallback className="text-xs">
                              {speaker.speaker.user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{speaker.speaker.user.name}</span>
                        </div>
                      ))}
                      {session.speakers.length > 3 && (
                        <span className="text-sm text-gray-500">
                          +{session.speakers.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {filteredBookmarkedSessions.length === 0 && (
            <div className="text-center py-8">
              <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarked sessions</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || trackFilter 
                  ? 'No sessions match your current filters.'
                  : 'Start building your agenda by bookmarking sessions you want to attend.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended Sessions */}
      {filteredRecommendedSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Recommended for You
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredRecommendedSessions.slice(0, 3).map(session => (
              <div key={session.id} className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium line-clamp-2">{session.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span>{formatTime(session.startAt)} - {formatTime(session.endAt)}</span>
                      {session.track && (
                        <Badge variant="secondary" className="text-xs">
                          {session.track}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => toggleBookmark(session.id, false)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                
                {session.speakers.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
