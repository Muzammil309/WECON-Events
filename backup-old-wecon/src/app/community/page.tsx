'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageSection } from '@/components/ui/PageSection';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Award, 
  Heart,
  MapPin,
  Clock,
  Star,
  UserPlus,
  Search,
  Filter,
  Linkedin,
  Twitter,
  Github,
  Globe
} from 'lucide-react';

interface CommunityMember {
  id: string;
  name: string;
  role: 'speaker' | 'organizer' | 'volunteer' | 'attendee';
  title: string;
  company: string;
  location: string;
  bio: string;
  avatar: string;
  joinedAt: string;
  contributions: number;
  badges: string[];
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  featured: boolean;
}

interface CommunityEvent {
  id: string;
  title: string;
  type: 'meetup' | 'workshop' | 'networking' | 'webinar';
  date: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  organizer: string;
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'events' | 'discussions'>('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Mock data
  const members: CommunityMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'speaker',
      title: 'Senior Event Manager',
      company: 'EventTech Solutions',
      location: 'Karachi, Pakistan',
      bio: 'Passionate about creating memorable experiences through innovative event technology.',
      avatar: '/avatars/sarah.jpg',
      joinedAt: '2023-06-15',
      contributions: 15,
      badges: ['Expert Speaker', 'Community Leader', 'Mentor'],
      social: {
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        twitter: 'https://twitter.com/sarahjohnson',
        website: 'https://sarahjohnson.com'
      },
      featured: true
    },
    {
      id: '2',
      name: 'Dr. Ahmed Khan',
      role: 'speaker',
      title: 'Professor of Digital Marketing',
      company: 'University of Karachi',
      location: 'Karachi, Pakistan',
      bio: 'Researcher and educator specializing in digital transformation and event marketing.',
      avatar: '/avatars/ahmed.jpg',
      joinedAt: '2023-03-20',
      contributions: 12,
      badges: ['Research Expert', 'Keynote Speaker'],
      social: {
        linkedin: 'https://linkedin.com/in/ahmedkhan',
        github: 'https://github.com/ahmedkhan'
      },
      featured: true
    },
    {
      id: '3',
      name: 'Lisa Chen',
      role: 'organizer',
      title: 'Community Manager',
      company: 'WECON Masawat',
      location: 'Lahore, Pakistan',
      bio: 'Building bridges between event professionals and fostering collaboration.',
      avatar: '/avatars/lisa.jpg',
      joinedAt: '2023-01-10',
      contributions: 25,
      badges: ['Community Builder', 'Organizer', 'Volunteer Champion'],
      social: {
        linkedin: 'https://linkedin.com/in/lisachen',
        twitter: 'https://twitter.com/lisachen'
      },
      featured: false
    }
  ];

  const events: CommunityEvent[] = [
    {
      id: '1',
      title: 'Monthly Event Planners Meetup',
      type: 'meetup',
      date: '2025-01-15T18:00:00Z',
      location: 'Karachi Business Hub',
      attendees: 45,
      maxAttendees: 60,
      organizer: 'Lisa Chen'
    },
    {
      id: '2',
      title: 'Digital Event Marketing Workshop',
      type: 'workshop',
      date: '2025-01-22T14:00:00Z',
      location: 'Online',
      attendees: 120,
      maxAttendees: 150,
      organizer: 'Dr. Ahmed Khan'
    },
    {
      id: '3',
      title: 'New Year Networking Session',
      type: 'networking',
      date: '2025-01-08T19:00:00Z',
      location: 'Lahore Convention Center',
      attendees: 78,
      maxAttendees: 100,
      organizer: 'Sarah Johnson'
    }
  ];

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const featuredMembers = members.filter(m => m.featured);

  const getRoleColor = (role: CommunityMember['role']) => {
    switch (role) {
      case 'speaker':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'organizer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'volunteer':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'attendee':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getEventTypeColor = (type: CommunityEvent['type']) => {
    switch (type) {
      case 'meetup':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'workshop':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'networking':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'webinar':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return Linkedin;
      case 'twitter':
        return Twitter;
      case 'github':
        return Github;
      case 'website':
        return Globe;
      default:
        return Globe;
    }
  };

  return (
    <div className="grid gap-10 sm:gap-12">
      {/* Header */}
      <PageSection>
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 mb-4">
            Community & Team
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with event professionals, speakers, organizers, and volunteers from the WECON Masawat community
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {members.length}
            </div>
            <div className="text-xs sm:text-sm opacity-70 mt-1">Community Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">
              {members.filter(m => m.role === 'speaker').length}
            </div>
            <div className="text-xs sm:text-sm opacity-70 mt-1">Expert Speakers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-green-600 dark:text-green-400">
              {events.length}
            </div>
            <div className="text-xs sm:text-sm opacity-70 mt-1">Upcoming Events</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              {members.reduce((sum, m) => sum + m.contributions, 0)}
            </div>
            <div className="text-xs sm:text-sm opacity-70 mt-1">Total Contributions</div>
          </div>
        </div>
      </PageSection>

      {/* Featured Members */}
      {featuredMembers.length > 0 && (
        <PageSection>
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              Featured Community Leaders
            </h2>
            <p className="opacity-70 text-sm mt-1">Meet our most active and influential community members</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{member.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{member.company}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(member.role)}`}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{member.bio}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {member.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {member.contributions} contributions
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {member.badges.slice(0, 2).map((badge, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-md">
                            {badge}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        {Object.entries(member.social).map(([platform, url]) => {
                          const Icon = getSocialIcon(platform);
                          return (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                              <Icon className="h-4 w-4" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </PageSection>
      )}

      {/* Navigation Tabs */}
      <PageSection>
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
          {[
            { id: 'members', label: 'Members', icon: Users },
            { id: 'events', label: 'Events', icon: Calendar },
            { id: 'discussions', label: 'Discussions', icon: MessageCircle }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div>
            {/* Filters */}
            <div className="bg-white/60 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Roles</option>
                    <option value="speaker">Speakers</option>
                    <option value="organizer">Organizers</option>
                    <option value="volunteer">Volunteers</option>
                    <option value="attendee">Attendees</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Members Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{member.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(member.role)}`}>
                          {member.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{member.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{member.company}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {member.contributions}
                        </span>
                        <div className="flex items-center gap-1">
                          {Object.entries(member.social).slice(0, 2).map(([platform, url]) => {
                            const Icon = getSocialIcon(platform);
                            return (
                              <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                              >
                                <Icon className="h-3 w-3" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(event.type)}`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{event.attendees} / {event.maxAttendees} attendees</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Organized by {event.organizer}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Join Event
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Discussions Tab */}
        {activeTab === 'discussions' && (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Community Discussions
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Discussion forum coming soon! Connect with other members and share insights.
            </p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <UserPlus className="h-4 w-4" />
              Join Community
            </button>
          </div>
        )}
      </PageSection>
    </div>
  );
}
