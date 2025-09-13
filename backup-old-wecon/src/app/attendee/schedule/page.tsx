'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, User, Star, Plus, Check, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface Session {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  speaker: {
    name: string;
    title: string;
    company: string;
    avatar: string;
  };
  room: string;
  category: string;
  capacity: number;
  registered: number;
  isRegistered: boolean;
  rating?: number;
  tags: string[];
}

interface ScheduleDay {
  date: string;
  sessions: Session[];
}

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, []);

  useEffect(() => {
    if (schedule.length > 0 && !selectedDay) {
      setSelectedDay(schedule[0].date);
    }
  }, [schedule, selectedDay]);

  const fetchSchedule = async () => {
    try {
      // Mock data - replace with actual API call
      const mockSchedule: ScheduleDay[] = [
        {
          date: '2024-03-15',
          sessions: [
            {
              id: '1',
              title: 'Opening Keynote: Future of Event Technology',
              description: 'Explore the cutting-edge technologies shaping the future of events and conferences.',
              startTime: '2024-03-15T09:00:00Z',
              endTime: '2024-03-15T10:00:00Z',
              speaker: {
                name: 'Dr. Sarah Johnson',
                title: 'Chief Technology Officer',
                company: 'EventTech Innovations',
                avatar: '/api/placeholder/60/60'
              },
              room: 'Main Auditorium',
              category: 'Keynote',
              capacity: 1500,
              registered: 1247,
              isRegistered: true,
              rating: 4.9,
              tags: ['Technology', 'Innovation', 'Future Trends']
            },
            {
              id: '2',
              title: 'Panel: Digital Transformation in Events',
              description: 'Industry leaders discuss how digital transformation is revolutionizing the events industry.',
              startTime: '2024-03-15T10:30:00Z',
              endTime: '2024-03-15T12:00:00Z',
              speaker: {
                name: 'Multiple Speakers',
                title: 'Industry Panel',
                company: 'Various Companies',
                avatar: '/api/placeholder/60/60'
              },
              room: 'Conference Room A',
              category: 'Panel',
              capacity: 200,
              registered: 156,
              isRegistered: false,
              tags: ['Digital Transformation', 'Industry Insights', 'Panel Discussion']
            },
            {
              id: '3',
              title: 'Workshop: Event Marketing Strategies',
              description: 'Hands-on workshop covering modern marketing strategies for successful events.',
              startTime: '2024-03-15T14:00:00Z',
              endTime: '2024-03-15T16:00:00Z',
              speaker: {
                name: 'Mike Chen',
                title: 'Marketing Director',
                company: 'Global Events Marketing',
                avatar: '/api/placeholder/60/60'
              },
              room: 'Workshop Room 1',
              category: 'Workshop',
              capacity: 50,
              registered: 42,
              isRegistered: true,
              rating: 4.7,
              tags: ['Marketing', 'Strategy', 'Hands-on']
            }
          ]
        },
        {
          date: '2024-03-16',
          sessions: [
            {
              id: '4',
              title: 'AI in Event Management',
              description: 'Discover how artificial intelligence is transforming event planning and execution.',
              startTime: '2024-03-16T09:00:00Z',
              endTime: '2024-03-16T10:30:00Z',
              speaker: {
                name: 'Dr. Alex Rodriguez',
                title: 'AI Research Lead',
                company: 'TechCorp AI',
                avatar: '/api/placeholder/60/60'
              },
              room: 'Conference Room B',
              category: 'Technology',
              capacity: 150,
              registered: 89,
              isRegistered: false,
              tags: ['AI', 'Automation', 'Technology']
            },
            {
              id: '5',
              title: 'Sustainable Event Practices',
              description: 'Learn about eco-friendly approaches to event planning and management.',
              startTime: '2024-03-16T11:00:00Z',
              endTime: '2024-03-16T12:30:00Z',
              speaker: {
                name: 'Emma Green',
                title: 'Sustainability Consultant',
                company: 'EcoEvents',
                avatar: '/api/placeholder/60/60'
              },
              room: 'Conference Room A',
              category: 'Sustainability',
              capacity: 100,
              registered: 67,
              isRegistered: true,
              rating: 4.8,
              tags: ['Sustainability', 'Environment', 'Best Practices']
            }
          ]
        }
      ];

      setSchedule(mockSchedule);
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (sessionId: string) => {
    try {
      // TODO: Implement actual API call
      setSchedule(prev => prev.map(day => ({
        ...day,
        sessions: day.sessions.map(session =>
          session.id === sessionId
            ? { ...session, isRegistered: true, registered: session.registered + 1 }
            : session
        )
      })));
    } catch (error) {
      console.error('Failed to register for session:', error);
    }
  };

  const handleUnregister = async (sessionId: string) => {
    try {
      // TODO: Implement actual API call
      setSchedule(prev => prev.map(day => ({
        ...day,
        sessions: day.sessions.map(session =>
          session.id === sessionId
            ? { ...session, isRegistered: false, registered: session.registered - 1 }
            : session
        )
      })));
    } catch (error) {
      console.error('Failed to unregister from session:', error);
    }
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

  const currentDay = schedule.find(day => day.date === selectedDay);
  const filteredSessions = currentDay?.sessions.filter(session =>
    filterCategory === 'all' || session.category.toLowerCase() === filterCategory.toLowerCase()
  ) || [];

  const categories = ['all', ...Array.from(new Set(schedule.flatMap(day => day.sessions.map(s => s.category))))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Schedule</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your event sessions and build your personalized agenda
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Event Day</label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {schedule.map((day) => (
                    <SelectItem key={day.date} value={day.date}>
                      {formatDate(day.date)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions */}
      <div className="space-y-4">
        {filteredSessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`hover:shadow-lg transition-shadow ${session.isRegistered ? 'ring-2 ring-blue-500 ring-opacity-20' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{session.title}</CardTitle>
                      <Badge variant={session.isRegistered ? "default" : "outline"}>
                        {session.category}
                      </Badge>
                      {session.isRegistered && (
                        <Badge className="bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Registered
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-base mb-3">
                      {session.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {session.room}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {session.registered}/{session.capacity} registered
                      </div>
                      {session.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {session.rating}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    {session.isRegistered ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnregister(session.id)}
                      >
                        Unregister
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleRegister(session.id)}
                        disabled={session.registered >= session.capacity}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {session.registered >= session.capacity ? 'Full' : 'Register'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {session.speaker.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold">{session.speaker.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {session.speaker.title} at {session.speaker.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {session.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No sessions found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try selecting a different day or category filter
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
