'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Star, QrCode, MessageSquare, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Event {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  status: string;
}

interface Session {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  speaker: string;
  room: string;
  isRegistered: boolean;
}

interface NetworkingConnection {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  mutualConnections: number;
}

export default function AttendeeDashboard() {
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [networkingConnections, setNetworkingConnections] = useState<NetworkingConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data - replace with actual API calls
      setCurrentEvent({
        id: '1',
        name: 'WECON Masawat 2024',
        startDate: '2024-03-15T09:00:00Z',
        endDate: '2024-03-17T18:00:00Z',
        location: 'Karachi Expo Center, Pakistan',
        status: 'active'
      });

      setUpcomingSessions([
        {
          id: '1',
          title: 'Opening Keynote: Future of Event Technology',
          startTime: '2024-03-15T09:00:00Z',
          endTime: '2024-03-15T10:00:00Z',
          speaker: 'Dr. Sarah Johnson',
          room: 'Main Auditorium',
          isRegistered: true
        },
        {
          id: '2',
          title: 'Panel: Digital Transformation in Events',
          startTime: '2024-03-15T10:30:00Z',
          endTime: '2024-03-15T12:00:00Z',
          speaker: 'Multiple Speakers',
          room: 'Conference Room A',
          isRegistered: false
        },
        {
          id: '3',
          title: 'Workshop: Event Marketing Strategies',
          startTime: '2024-03-15T14:00:00Z',
          endTime: '2024-03-15T16:00:00Z',
          speaker: 'Mike Chen',
          room: 'Workshop Room 1',
          isRegistered: true
        }
      ]);

      setNetworkingConnections([
        {
          id: '1',
          name: 'Ahmed Khan',
          title: 'Event Manager',
          company: 'EventTech Solutions',
          avatar: '/api/placeholder/40/40',
          mutualConnections: 5
        },
        {
          id: '2',
          name: 'Maria Rodriguez',
          title: 'Marketing Director',
          company: 'Global Events Inc',
          avatar: '/api/placeholder/40/40',
          mutualConnections: 3
        },
        {
          id: '3',
          name: 'David Wilson',
          title: 'Technology Lead',
          company: 'Innovation Labs',
          avatar: '/api/placeholder/40/40',
          mutualConnections: 8
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to {currentEvent?.name}</h1>
        <p className="text-blue-100 mb-4">
          {currentEvent && (
            <>
              {formatDate(currentEvent.startDate)} - {formatDate(currentEvent.endDate)} • {currentEvent.location}
            </>
          )}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/attendee/qr-code">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <QrCode className="h-4 w-4 mr-2" />
              My QR Code
            </Button>
          </Link>
          <Link href="/attendee/map">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <MapPin className="h-4 w-4 mr-2" />
              Event Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/attendee/schedule">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">My Schedule</h3>
              <p className="text-xs text-gray-500">3 sessions</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/attendee/networking">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Networking</h3>
              <p className="text-xs text-gray-500">12 connections</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/attendee/messages">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Messages</h3>
              <p className="text-xs text-gray-500">2 new</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/attendee/tickets">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Ticket className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">My Tickets</h3>
              <p className="text-xs text-gray-500">Active</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription>Your registered and recommended sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-sm">{session.title}</h4>
                  <Badge variant={session.isRegistered ? "default" : "outline"}>
                    {session.isRegistered ? "Registered" : "Available"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {session.speaker} • {session.room}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {formatTime(session.startTime)} - {formatTime(session.endTime)}
                  </span>
                  {!session.isRegistered && (
                    <Button size="sm" variant="outline">Register</Button>
                  )}
                </div>
              </motion.div>
            ))}
            <Link href="/attendee/schedule">
              <Button variant="outline" className="w-full">
                View Full Schedule
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Networking Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Networking Suggestions
            </CardTitle>
            <CardDescription>Connect with other attendees</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {networkingConnections.map((connection, index) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {connection.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{connection.name}</h4>
                    <p className="text-xs text-gray-500">{connection.title} at {connection.company}</p>
                    <p className="text-xs text-gray-400">{connection.mutualConnections} mutual connections</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Connect</Button>
              </motion.div>
            ))}
            <Link href="/attendee/networking">
              <Button variant="outline" className="w-full">
                Explore Networking
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
