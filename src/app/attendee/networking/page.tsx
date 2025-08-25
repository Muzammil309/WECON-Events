'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Filter, MessageSquare, UserPlus, Building, MapPin, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Attendee {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  bio: string;
  interests: string[];
  avatar: string;
  isConnected: boolean;
  connectionStatus: 'none' | 'pending' | 'connected';
  mutualConnections: number;
  rating: number;
}

export default function NetworkingPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendees();
  }, []);

  useEffect(() => {
    filterAttendees();
  }, [attendees, searchTerm, filterBy]);

  const fetchAttendees = async () => {
    try {
      // Mock data - replace with actual API call
      const mockAttendees: Attendee[] = [
        {
          id: '1',
          name: 'Ahmed Khan',
          title: 'Senior Event Manager',
          company: 'EventTech Solutions',
          location: 'Karachi, Pakistan',
          bio: 'Passionate about creating memorable experiences through innovative event technology.',
          interests: ['Event Technology', 'Digital Marketing', 'Sustainability'],
          avatar: '/api/placeholder/60/60',
          isConnected: false,
          connectionStatus: 'none',
          mutualConnections: 5,
          rating: 4.8
        },
        {
          id: '2',
          name: 'Maria Rodriguez',
          title: 'Marketing Director',
          company: 'Global Events Inc',
          location: 'Dubai, UAE',
          bio: 'Leading marketing strategies for international events and conferences.',
          interests: ['Marketing', 'Brand Strategy', 'International Events'],
          avatar: '/api/placeholder/60/60',
          isConnected: false,
          connectionStatus: 'pending',
          mutualConnections: 3,
          rating: 4.9
        },
        {
          id: '3',
          name: 'David Wilson',
          title: 'Technology Lead',
          company: 'Innovation Labs',
          location: 'London, UK',
          bio: 'Building the future of event technology with AI and immersive experiences.',
          interests: ['AI', 'VR/AR', 'Event Tech', 'Innovation'],
          avatar: '/api/placeholder/60/60',
          isConnected: true,
          connectionStatus: 'connected',
          mutualConnections: 8,
          rating: 4.7
        },
        {
          id: '4',
          name: 'Sarah Chen',
          title: 'UX Designer',
          company: 'Design Studio Pro',
          location: 'Singapore',
          bio: 'Designing user-centered experiences for digital event platforms.',
          interests: ['UX Design', 'User Research', 'Digital Events'],
          avatar: '/api/placeholder/60/60',
          isConnected: false,
          connectionStatus: 'none',
          mutualConnections: 2,
          rating: 4.6
        },
        {
          id: '5',
          name: 'Michael Brown',
          title: 'Event Producer',
          company: 'Creative Events Co',
          location: 'New York, USA',
          bio: 'Producing large-scale events and conferences worldwide.',
          interests: ['Event Production', 'Live Streaming', 'Hybrid Events'],
          avatar: '/api/placeholder/60/60',
          isConnected: false,
          connectionStatus: 'none',
          mutualConnections: 6,
          rating: 4.5
        },
        {
          id: '6',
          name: 'Lisa Zhang',
          title: 'Business Development Manager',
          company: 'TechCorp Asia',
          location: 'Hong Kong',
          bio: 'Connecting businesses through strategic partnerships and events.',
          interests: ['Business Development', 'Partnerships', 'Tech Innovation'],
          avatar: '/api/placeholder/60/60',
          isConnected: false,
          connectionStatus: 'none',
          mutualConnections: 4,
          rating: 4.8
        }
      ];

      setAttendees(mockAttendees);
    } catch (error) {
      console.error('Failed to fetch attendees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAttendees = () => {
    let filtered = attendees;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(attendee =>
        attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.interests.some(interest => 
          interest.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by connection status
    if (filterBy !== 'all') {
      filtered = filtered.filter(attendee => attendee.connectionStatus === filterBy);
    }

    setFilteredAttendees(filtered);
  };

  const handleConnect = async (attendeeId: string) => {
    try {
      // TODO: Implement actual API call
      setAttendees(prev => prev.map(attendee =>
        attendee.id === attendeeId
          ? { ...attendee, connectionStatus: 'pending' as const }
          : attendee
      ));
    } catch (error) {
      console.error('Failed to send connection request:', error);
    }
  };

  const handleMessage = (attendeeId: string) => {
    // TODO: Navigate to messages page with specific user
    console.log('Message user:', attendeeId);
  };

  const getConnectionButton = (attendee: Attendee) => {
    switch (attendee.connectionStatus) {
      case 'connected':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleMessage(attendee.id)}
            className="w-full"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Button>
        );
      case 'pending':
        return (
          <Button size="sm" variant="outline" disabled className="w-full">
            Request Sent
          </Button>
        );
      default:
        return (
          <Button
            size="sm"
            onClick={() => handleConnect(attendee.id)}
            className="w-full"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Connect
          </Button>
        );
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Networking</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect with fellow attendees and expand your professional network
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, company, title, or interests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Attendees</SelectItem>
                  <SelectItem value="connected">Connected</SelectItem>
                  <SelectItem value="pending">Pending Requests</SelectItem>
                  <SelectItem value="none">Not Connected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendees Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAttendees.map((attendee, index) => (
          <motion.div
            key={attendee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                  {attendee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <CardTitle className="text-lg">{attendee.name}</CardTitle>
                <CardDescription className="space-y-1">
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <Building className="h-3 w-3" />
                    {attendee.title} at {attendee.company}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <MapPin className="h-3 w-3" />
                    {attendee.location}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {attendee.rating}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {attendee.bio}
                </p>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Interests</h4>
                  <div className="flex flex-wrap gap-1">
                    {attendee.interests.map((interest) => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                {attendee.mutualConnections > 0 && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users className="h-3 w-3" />
                    {attendee.mutualConnections} mutual connections
                  </div>
                )}

                {getConnectionButton(attendee)}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredAttendees.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No attendees found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
