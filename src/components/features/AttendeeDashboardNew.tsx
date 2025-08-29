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
  LayoutDashboard,
  Menu,
  X,
  ChevronLeft,
  Sparkles,
  GraduationCap,
  Building,
  MessageSquare,
  LogOut,
  Activity,
  Target,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

interface AttendeeDashboardProps {
  userId: string;
  userName: string;
  userAvatar?: string;
}

export default function AttendeeDashboard({ userId, userName, userAvatar }: AttendeeDashboardProps) {
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigationItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'schedule', name: 'Schedule', icon: Calendar },
    { id: 'networking', name: 'Networking', icon: Users },
    { id: 'exhibitors', name: 'Exhibitors', icon: Building },
    { id: 'sessions', name: 'Sessions', icon: GraduationCap },
    { id: 'maps', name: 'Maps', icon: Map },
    { id: 'feedback', name: 'Feedback', icon: Star },
    { id: 'profile', name: 'Profile', icon: Settings },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Header */}
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
                          <span className="text-sm">Engagement Score: 87%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">3 check-ins today</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button 
                      variant="secondary" 
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                      onClick={() => setActiveView('profile')}
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      My QR Code
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                      onClick={() => setActiveView('maps')}
                    >
                      <Map className="h-4 w-4 mr-2" />
                      Venue Map
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Events Attending', value: '2', icon: Calendar, color: 'blue' },
                { label: 'Sessions Booked', value: '8', icon: Bookmark, color: 'green' },
                { label: 'Connections Made', value: '12', icon: Users, color: 'purple' },
                { label: 'Feedback Given', value: '5', icon: Star, color: 'orange' }
              ].map((stat, idx) => (
                <Card key={idx} className="shadow-sm bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                        <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Upcoming Sessions */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-900">Upcoming Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { title: 'Future of Event Technology', time: '10:00 AM', speaker: 'Dr. Sarah Ahmed', room: 'Main Hall' },
                    { title: 'Digital Marketing Workshop', time: '2:00 PM', speaker: 'Mark Johnson', room: 'Lab A' },
                    { title: 'Networking Session', time: '4:30 PM', speaker: 'Multiple Speakers', room: 'Lounge' }
                  ].map((session, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{session.title}</h4>
                        <p className="text-sm text-gray-600">{session.speaker} • {session.room}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-blue-600">{session.time}</p>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Schedule</h2>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Today's Schedule */}
              <div className="lg:col-span-2">
                <Card className="shadow-sm bg-white border border-gray-200">
                  <CardHeader className="pb-3 border-b border-gray-100">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="text-lg font-semibold text-gray-900">Today's Schedule</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[
                        { time: '09:00 AM', title: 'Registration & Welcome Coffee', location: 'Main Lobby', type: 'event', status: 'completed' },
                        { time: '10:00 AM', title: 'Future of Event Technology', location: 'Main Hall', type: 'session', status: 'current' },
                        { time: '11:30 AM', title: 'Coffee Break & Networking', location: 'Networking Lounge', type: 'break', status: 'upcoming' },
                        { time: '12:00 PM', title: 'AI Workshop - Hands-on Lab', location: 'Learning Lab A', type: 'workshop', status: 'upcoming' },
                        { time: '01:30 PM', title: 'Lunch & Exhibition Tour', location: 'Exhibition Hall', type: 'break', status: 'upcoming' },
                        { time: '02:30 PM', title: 'Digital Marketing Strategies', location: 'Learning Lab B', type: 'session', status: 'upcoming' }
                      ].map((item, idx) => (
                        <div key={idx} className={`flex items-center gap-4 p-4 rounded-lg border ${
                          item.status === 'current' ? 'bg-blue-50 border-blue-200' :
                          item.status === 'completed' ? 'bg-gray-50 border-gray-200' :
                          'bg-white border-gray-200'
                        }`}>
                          <div className="text-center min-w-[80px]">
                            <p className="font-semibold text-gray-900">{item.time}</p>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.location}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              item.type === 'session' ? 'default' :
                              item.type === 'workshop' ? 'secondary' :
                              item.type === 'break' ? 'outline' : 'default'
                            }>
                              {item.type}
                            </Badge>
                            {item.status === 'current' && (
                              <Badge className="bg-green-100 text-green-800">Live</Badge>
                            )}
                            {item.status === 'completed' && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <Card className="shadow-sm bg-white border border-gray-200">
                  <CardHeader className="pb-3 border-b border-gray-100">
                    <CardTitle className="flex items-center gap-2">
                      <Bookmark className="h-5 w-5 text-green-600" />
                      <span className="text-lg font-semibold text-gray-900">Bookmarked Sessions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {[
                        { title: 'Leadership in Tech Panel', time: 'Tomorrow 10:00 AM' },
                        { title: 'Data Analytics Bootcamp', time: 'Tomorrow 2:00 PM' },
                        { title: 'Startup Pitch Competition', time: 'Day 2, 11:00 AM' }
                      ].map((session, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h5 className="font-medium text-gray-900 text-sm">{session.title}</h5>
                            <p className="text-xs text-gray-600">{session.time}</p>
                          </div>
                          <BookmarkCheck className="h-4 w-4 text-green-600" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm bg-white border border-gray-200">
                  <CardHeader className="pb-3 border-b border-gray-100">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      <span className="text-lg font-semibold text-gray-900">Recommended</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {[
                        { title: 'Cloud Computing Workshop', match: '95%' },
                        { title: 'UX Design Principles', match: '88%' },
                        { title: 'Blockchain Fundamentals', match: '82%' }
                      ].map((rec, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h5 className="font-medium text-gray-900 text-sm">{rec.title}</h5>
                            <p className="text-xs text-green-600">{rec.match} match</p>
                          </div>
                          <Button size="sm" variant="outline">Add</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 'networking':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Networking</h2>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Networking Suggestions */}
              <Card className="shadow-sm bg-white border border-gray-200">
                <CardHeader className="pb-3 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-blue-600" />
                    <span className="text-lg font-semibold text-gray-900">Networking Suggestions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { name: 'Ahmed Khan', company: 'Tech Solutions Inc.', role: 'Senior Developer', compatibility: 92, interests: ['AI/ML', 'Web Dev'], status: 'online' },
                      { name: 'Maria Rodriguez', company: 'Digital Marketing Co.', role: 'Marketing Director', compatibility: 88, interests: ['Marketing', 'Analytics'], status: 'offline' },
                      { name: 'Dr. Sarah Chen', company: 'Innovation Labs', role: 'Research Scientist', compatibility: 85, interests: ['Research', 'AI/ML'], status: 'online' }
                    ].map((person, idx) => (
                      <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {person.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${person.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{person.name}</h4>
                              <p className="text-sm text-gray-600">{person.role}</p>
                              <p className="text-sm text-gray-500">{person.company}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {person.interests.map((interest, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">{interest}</Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-1 mt-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-green-600">{person.compatibility}% compatibility</span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm">Connect</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* My Connections */}
              <Card className="shadow-sm bg-white border border-gray-200">
                <CardHeader className="pb-3 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="text-lg font-semibold text-gray-900">My Connections</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { name: 'John Smith', company: 'StartupXYZ', connected: '2 hours ago', mutual: 3 },
                      { name: 'Lisa Wang', company: 'Data Corp', connected: '1 day ago', mutual: 5 },
                      { name: 'Mike Johnson', company: 'Cloud Systems', connected: '2 days ago', mutual: 2 }
                    ].map((connection, idx) => (
                      <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-green-100 text-green-600">
                                {connection.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-gray-900">{connection.name}</h4>
                              <p className="text-sm text-gray-600">{connection.company}</p>
                              <p className="text-xs text-gray-500">Connected {connection.connected}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">{connection.mutual} mutual</p>
                            <Button size="sm" variant="outline">Message</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Networking Stats */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <span className="text-lg font-semibold text-gray-900">Networking Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Connections', value: '12', change: '+3 today' },
                    { label: 'Messages Sent', value: '28', change: '+5 today' },
                    { label: 'Profile Views', value: '45', change: '+8 today' },
                    { label: 'Meeting Requests', value: '6', change: '+2 today' }
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-xs text-green-600">{stat.change}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'exhibitors':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Exhibitors</h2>

            {/* Search and Filter */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search exhibitors..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter by Category
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Exhibitor Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'TechCorp Solutions',
                  booth: 'A-12',
                  category: 'Software Development',
                  description: 'Leading provider of enterprise software solutions and cloud services.',
                  website: 'techcorp.com',
                  contact: 'info@techcorp.com',
                  visited: false,
                  featured: true
                },
                {
                  name: 'DataFlow Analytics',
                  booth: 'B-08',
                  category: 'Data & Analytics',
                  description: 'Advanced data analytics and business intelligence platforms.',
                  website: 'dataflow.io',
                  contact: 'hello@dataflow.io',
                  visited: true,
                  featured: false
                },
                {
                  name: 'CloudSecure Systems',
                  booth: 'C-15',
                  category: 'Cybersecurity',
                  description: 'Comprehensive cybersecurity solutions for modern enterprises.',
                  website: 'cloudsecure.net',
                  contact: 'sales@cloudsecure.net',
                  visited: false,
                  featured: false
                },
                {
                  name: 'AI Innovations Lab',
                  booth: 'A-05',
                  category: 'Artificial Intelligence',
                  description: 'Cutting-edge AI and machine learning research and development.',
                  website: 'ailab.tech',
                  contact: 'research@ailab.tech',
                  visited: false,
                  featured: true
                },
                {
                  name: 'DevTools Pro',
                  booth: 'B-22',
                  category: 'Developer Tools',
                  description: 'Professional development tools and productivity software.',
                  website: 'devtools.pro',
                  contact: 'support@devtools.pro',
                  visited: true,
                  featured: false
                },
                {
                  name: 'GreenTech Solutions',
                  booth: 'C-03',
                  category: 'Sustainability',
                  description: 'Sustainable technology solutions for environmental impact.',
                  website: 'greentech.eco',
                  contact: 'info@greentech.eco',
                  visited: false,
                  featured: false
                }
              ].map((exhibitor, idx) => (
                <Card key={idx} className={`shadow-sm border transition-all hover:shadow-md ${
                  exhibitor.featured ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200 bg-white'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{exhibitor.name}</h3>
                          {exhibitor.featured && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">Featured</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">Booth {exhibitor.booth}</Badge>
                          <Badge variant="secondary" className="text-xs">{exhibitor.category}</Badge>
                        </div>
                      </div>
                      {exhibitor.visited && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{exhibitor.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{exhibitor.website}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{exhibitor.contact}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <MapPin className="h-4 w-4 mr-2" />
                        Visit Booth
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Exhibition Stats */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <span className="text-lg font-semibold text-gray-900">Exhibition Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Booths Visited', value: '8', total: '50' },
                    { label: 'Materials Downloaded', value: '12', total: '∞' },
                    { label: 'Contacts Made', value: '15', total: '∞' },
                    { label: 'Demos Attended', value: '3', total: '∞' }
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      {stat.total !== '∞' && (
                        <p className="text-xs text-gray-500">of {stat.total}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'sessions':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Learning Sessions</h2>

            {/* Learning Labs */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-900">Learning Labs</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  {[
                    { title: 'AI & Machine Learning Workshop', level: 'Intermediate', capacity: '8/20', duration: '2 hours', instructor: 'Dr. Sarah Chen' },
                    { title: 'Digital Marketing Strategies', level: 'Beginner', capacity: '15/25', duration: '90 mins', instructor: 'Mark Rodriguez' },
                    { title: 'Data Analytics Bootcamp', level: 'Advanced', capacity: '5/15', duration: '3 hours', instructor: 'Lisa Wang' }
                  ].map((lab, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{lab.title}</h4>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="secondary">{lab.level}</Badge>
                            <Badge variant="outline">{lab.duration}</Badge>
                            <Badge className="bg-green-100 text-green-800">{lab.capacity} spots</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Instructor: {lab.instructor}</p>
                        </div>
                        <Button size="sm">Register</Button>
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
                  <Target className="h-5 w-5 text-green-600" />
                  <span className="text-lg font-semibold text-gray-900">Skill Clinics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  {[
                    { title: 'Public Speaking Mastery', format: 'Interactive', duration: '90 mins', participants: '12/15' },
                    { title: 'Leadership in Tech', format: 'Panel Discussion', duration: '60 mins', participants: '8/20' },
                    { title: 'Networking Skills Workshop', format: 'Workshop', duration: '60 mins', participants: '18/25' }
                  ].map((clinic, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{clinic.title}</h4>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="secondary">{clinic.format}</Badge>
                            <Badge variant="outline">{clinic.duration}</Badge>
                            <Badge className="bg-blue-100 text-blue-800">{clinic.participants}</Badge>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Join</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Story Circles */}
            <Card className="shadow-sm bg-white border border-gray-200">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <span className="text-lg font-semibold text-gray-900">Story Circles</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  {[
                    { title: 'Startup Success Stories', theme: 'Entrepreneurship', participants: '6/8', host: 'Alex Thompson' },
                    { title: 'Career Transition Tales', theme: 'Career Growth', participants: '4/6', host: 'Maria Garcia' },
                    { title: 'Innovation Journeys', theme: 'Technology', participants: '7/10', host: 'David Kim' }
                  ].map((circle, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{circle.title}</h4>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="secondary">{circle.theme}</Badge>
                            <Badge className="bg-purple-100 text-purple-800">{circle.participants}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Host: {circle.host}</p>
                        </div>
                        <Button size="sm" variant="outline">Join Circle</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'maps':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Venue Maps</h2>

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
                    <MapPin className="h-5 w-5 text-green-600" />
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
          </div>
        );

      case 'feedback':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Feedback</h2>

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
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile & Settings</h2>

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
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'fixed' : 'hidden'} lg:relative lg:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
      } w-64 h-screen overflow-hidden z-50 lg:z-auto`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className={`flex items-center gap-2 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  WECON
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:block p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-6 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors group ${
                  sidebarCollapsed ? 'justify-center' : ''
                } ${
                  activeView === item.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={sidebarCollapsed ? item.name : ''}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* User menu */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {!sidebarCollapsed ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={userAvatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">attendee@wecon-masawat.com</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={userAvatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <button
                  className="p-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group relative"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    Sign out
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
