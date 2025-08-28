'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  UserPlus, 
  MessageCircle, 
  Heart,
  Building,
  Briefcase,
  MapPin,
  Star,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Attendee {
  id: string;
  name: string;
  email: string;
  company?: string;
  jobTitle?: string;
  bio?: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  website?: string;
  attendeeProfile?: {
    interests: string[];
    networkingOptIn: boolean;
  };
  networkingCompatibility: {
    score: number;
    commonInterests: string[];
    totalCommonInterests: number;
  };
}

interface NetworkingDirectoryProps {
  eventId: string;
  currentUserId: string;
}

export default function NetworkingDirectory({ eventId, currentUserId }: NetworkingDirectoryProps) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [jobTitleFilter, setJobTitleFilter] = useState('');
  const [interestFilter, setInterestFilter] = useState('');
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [sendingConnection, setSendingConnection] = useState(false);
  const [companies, setCompanies] = useState<string[]>([]);
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    fetchAttendees();
  }, [eventId, companyFilter, jobTitleFilter, interestFilter]);

  const fetchAttendees = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('eventId', eventId);
      if (searchTerm) params.append('search', searchTerm);
      if (companyFilter) params.append('company', companyFilter);
      if (jobTitleFilter) params.append('jobTitle', jobTitleFilter);
      if (interestFilter) params.append('interests', interestFilter);

      const response = await fetch(`/api/attendees/directory?${params}`);
      if (response.ok) {
        const data = await response.json();
        const filteredAttendees = data.attendees.filter((attendee: Attendee) => 
          attendee.id !== currentUserId
        );
        setAttendees(filteredAttendees);

        // Extract unique values for filters
        const uniqueCompanies = [...new Set(filteredAttendees
          .map((a: Attendee) => a.company)
          .filter(Boolean)
        )];
        const uniqueJobTitles = [...new Set(filteredAttendees
          .map((a: Attendee) => a.jobTitle)
          .filter(Boolean)
        )];
        const uniqueInterests = [...new Set(filteredAttendees
          .flatMap((a: Attendee) => a.attendeeProfile?.interests || [])
        )];

        setCompanies(uniqueCompanies);
        setJobTitles(uniqueJobTitles);
        setInterests(uniqueInterests);
      }
    } catch (error) {
      console.error('Failed to fetch attendees:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendConnectionRequest = async (targetUserId: string, message: string) => {
    try {
      setSendingConnection(true);
      const response = await fetch('/api/attendees/directory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId,
          message
        })
      });

      if (response.ok) {
        setSelectedAttendee(null);
        setConnectionMessage('');
        // Show success message or update UI
      }
    } catch (error) {
      console.error('Failed to send connection request:', error);
    } finally {
      setSendingConnection(false);
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const filteredAttendees = attendees.filter(attendee =>
    attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h2 className="text-2xl font-bold">Networking Directory</h2>
          <p className="text-gray-600">Connect with fellow attendees and expand your network</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredAttendees.length} attendees available
        </Badge>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search attendees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Companies</SelectItem>
            {companies.map(company => (
              <SelectItem key={company} value={company}>
                {company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={jobTitleFilter} onValueChange={setJobTitleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            {jobTitles.map(title => (
              <SelectItem key={title} value={title}>
                {title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={interestFilter} onValueChange={setInterestFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by interest" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Interests</SelectItem>
            {interests.map(interest => (
              <SelectItem key={interest} value={interest}>
                {interest}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Attendees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAttendees.map(attendee => (
          <Card key={attendee.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={attendee.avatarUrl} />
                  <AvatarFallback>
                    {attendee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-1">{attendee.name}</h3>
                  {attendee.jobTitle && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Briefcase className="h-3 w-3" />
                      <span>{attendee.jobTitle}</span>
                    </div>
                  )}
                  {attendee.company && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Building className="h-3 w-3" />
                      <span>{attendee.company}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Compatibility Score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Compatibility</span>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`${getCompatibilityColor(attendee.networkingCompatibility.score)}`}
                >
                  {attendee.networkingCompatibility.score}%
                </Badge>
              </div>

              {/* Common Interests */}
              {attendee.networkingCompatibility.commonInterests.length > 0 && (
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Heart className="h-3 w-3 text-red-500" />
                    <span className="text-xs font-medium text-gray-700">
                      {attendee.networkingCompatibility.totalCommonInterests} shared interests
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {attendee.networkingCompatibility.commonInterests.slice(0, 3).map(interest => (
                      <Badge key={interest} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                    {attendee.networkingCompatibility.commonInterests.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{attendee.networkingCompatibility.commonInterests.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Bio */}
              {attendee.bio && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {attendee.bio}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="flex-1" 
                      onClick={() => setSelectedAttendee(attendee)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Connection Request</DialogTitle>
                    </DialogHeader>
                    {selectedAttendee && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={selectedAttendee.avatarUrl} />
                            <AvatarFallback>
                              {selectedAttendee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{selectedAttendee.name}</h4>
                            <p className="text-sm text-gray-600">
                              {selectedAttendee.jobTitle} {selectedAttendee.company && `at ${selectedAttendee.company}`}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Personal Message (Optional)</label>
                          <textarea
                            value={connectionMessage}
                            onChange={(e) => setConnectionMessage(e.target.value)}
                            placeholder="Hi! I'd love to connect and discuss..."
                            rows={3}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => sendConnectionRequest(selectedAttendee.id, connectionMessage)}
                            disabled={sendingConnection}
                            className="flex-1"
                          >
                            {sendingConnection ? 'Sending...' : 'Send Request'}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedAttendee(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>

              {/* Social Links */}
              {(attendee.linkedinUrl || attendee.twitterUrl || attendee.website) && (
                <div className="flex gap-2 pt-2 border-t">
                  {attendee.linkedinUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={attendee.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {attendee.twitterUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={attendee.twitterUrl} target="_blank" rel="noopener noreferrer">
                        Twitter
                      </a>
                    </Button>
                  )}
                  {attendee.website && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={attendee.website} target="_blank" rel="noopener noreferrer">
                        Website
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAttendees.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No attendees found</h3>
          <p className="text-gray-600">
            {searchTerm || companyFilter || jobTitleFilter || interestFilter 
              ? 'Try adjusting your filters to see more attendees.'
              : 'No attendees have opted in for networking yet.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
