'use client';

import { useState, useEffect } from 'react';
import {
  Building,
  MapPin,
  Users,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Settings,
  Star,
  Award,
  Target,
  BarChart3,
  Activity,
  Mail,
  Phone,
  Globe,
  Package,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  FileText,
  Image,
  Link,
  QrCode,
  Share2,
  MessageSquare,
  Calendar,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Exhibitor {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    company?: string;
    avatarUrl?: string;
    website?: string;
  };
  boothNumber?: string;
  category?: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: string;
  products?: string;
  services?: string;
  specialOffers?: string;
  isApproved: boolean;
  isPremium: boolean;
  setupComplete: boolean;
  createdAt: string;
}

interface BoothSpace {
  id: string;
  number: string;
  size: string;
  location: string;
  price: number;
  amenities: string[];
  isAvailable: boolean;
  exhibitor?: Exhibitor;
}

interface ExhibitionManagementProps {
  eventId?: string;
}

export default function ExhibitionManagement({ eventId }: ExhibitionManagementProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([]);
  const [boothSpaces, setBoothSpaces] = useState<BoothSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const exhibitorCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'technology', label: 'Technology' },
    { value: 'software', label: 'Software' },
    { value: 'hardware', label: 'Hardware' },
    { value: 'services', label: 'Services' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'education', label: 'Education' },
    { value: 'nonprofit', label: 'Non-Profit' },
  ];

  const boothSizes = [
    { value: 'small', label: 'Small (3x3m)', price: 500 },
    { value: 'medium', label: 'Medium (3x6m)', price: 800 },
    { value: 'large', label: 'Large (6x6m)', price: 1200 },
    { value: 'premium', label: 'Premium (6x9m)', price: 1800 },
  ];

  useEffect(() => {
    fetchExhibitors();
    fetchBoothSpaces();
  }, [eventId, selectedCategory, selectedStatus, searchTerm]);

  const fetchExhibitors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      // Mock data for demonstration
      const mockExhibitors: Exhibitor[] = [
        {
          id: '1',
          user: {
            id: '1',
            name: 'TechCorp Solutions',
            email: 'contact@techcorp.com',
            company: 'TechCorp Solutions',
            avatarUrl: '',
            website: 'https://techcorp.com',
          },
          boothNumber: 'A-12',
          category: 'technology',
          description: 'Leading provider of enterprise software solutions and cloud services.',
          contactEmail: 'booth@techcorp.com',
          contactPhone: '+1-555-0123',
          isApproved: true,
          isPremium: true,
          setupComplete: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          user: {
            id: '2',
            name: 'DataFlow Analytics',
            email: 'info@dataflow.io',
            company: 'DataFlow Analytics',
            avatarUrl: '',
            website: 'https://dataflow.io',
          },
          boothNumber: 'B-08',
          category: 'software',
          description: 'Advanced data analytics and business intelligence platforms.',
          contactEmail: 'hello@dataflow.io',
          contactPhone: '+1-555-0456',
          isApproved: true,
          isPremium: false,
          setupComplete: false,
          createdAt: new Date().toISOString(),
        },
      ];

      setExhibitors(mockExhibitors);
    } catch (error) {
      console.error('Error fetching exhibitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBoothSpaces = async () => {
    try {
      // Mock booth spaces data
      const mockBoothSpaces: BoothSpace[] = [
        {
          id: '1',
          number: 'A-12',
          size: 'large',
          location: 'Main Hall - Section A',
          price: 1200,
          amenities: ['Power', 'WiFi', 'Storage'],
          isAvailable: false,
          exhibitor: exhibitors[0],
        },
        {
          id: '2',
          number: 'A-13',
          size: 'medium',
          location: 'Main Hall - Section A',
          price: 800,
          amenities: ['Power', 'WiFi'],
          isAvailable: true,
        },
      ];

      setBoothSpaces(mockBoothSpaces);
    } catch (error) {
      console.error('Error fetching booth spaces:', error);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Exhibition Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Exhibitors', value: exhibitors.length, icon: Building, color: 'blue', change: '+3 this week' },
          { label: 'Booth Spaces', value: boothSpaces.length, icon: MapPin, color: 'green', change: '85% occupied' },
          { label: 'Revenue', value: '$24,500', icon: DollarSign, color: 'purple', change: '+12% from last event' },
          { label: 'Leads Generated', value: '1,247', icon: Target, color: 'orange', change: '156 today' }
        ].map((stat, idx) => (
          <Card key={idx} className="shadow-sm bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booth Layout */}
      <Card className="shadow-sm bg-white border border-gray-200">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <span className="text-lg font-semibold text-gray-900">Exhibition Floor Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Floor Plan</h3>
              <p className="text-gray-600 mb-4">Drag and drop booth assignments on the interactive floor plan</p>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Floor Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-sm bg-white border border-gray-200">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[
              { company: 'TechCorp Solutions', action: 'completed booth setup', time: '2 hours ago', type: 'success' },
              { company: 'DataFlow Analytics', action: 'uploaded company materials', time: '4 hours ago', type: 'info' },
              { company: 'CloudSecure Systems', action: 'registered for exhibition', time: '1 day ago', type: 'info' },
              { company: 'AI Innovations Lab', action: 'requested premium booth upgrade', time: '2 days ago', type: 'warning' }
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.company}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderExhibitorDirectory = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="shadow-sm bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search exhibitors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {exhibitorCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="setup">Setup Complete</option>
            </select>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Exhibitor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exhibitor Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exhibitors.map((exhibitor) => (
          <Card key={exhibitor.id} className={`shadow-sm border transition-all hover:shadow-md ${
            exhibitor.isPremium ? 'border-yellow-200 bg-yellow-50/30' : 'border-gray-200 bg-white'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{exhibitor.user.name}</h3>
                    {exhibitor.isPremium && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">Premium</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">Booth {exhibitor.boothNumber}</Badge>
                    <Badge variant="secondary" className="text-xs">{exhibitor.category}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {exhibitor.isApproved ? (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approved
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                    {exhibitor.setupComplete && (
                      <Badge className="bg-blue-100 text-blue-800 text-xs">Setup Complete</Badge>
                    )}
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{exhibitor.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{exhibitor.contactEmail || exhibitor.user.email}</span>
                </div>
                {exhibitor.contactPhone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{exhibitor.contactPhone}</span>
                  </div>
                )}
                {exhibitor.user.website && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe className="h-4 w-4" />
                    <span className="truncate">{exhibitor.user.website}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderBoothAssignment = () => (
    <div className="space-y-6">
      {/* Booth Management */}
      <Card className="shadow-sm bg-white border border-gray-200">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">Booth Space Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {boothSizes.map((size) => (
              <div key={size.value} className="border rounded-lg p-4 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">{size.label}</h4>
                <p className="text-2xl font-bold text-blue-600 mb-2">${size.price}</p>
                <Button size="sm" variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Booth
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Booths */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boothSpaces.map((booth) => (
          <Card key={booth.id} className={`shadow-sm border ${
            booth.isAvailable ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-white'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Booth {booth.number}</h3>
                  <p className="text-sm text-gray-600 mb-2">{booth.location}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">{booth.size}</Badge>
                    <Badge variant="outline" className="text-xs">${booth.price}</Badge>
                  </div>
                  <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                    booth.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      booth.isAvailable ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    {booth.isAvailable ? 'Available' : 'Occupied'}
                  </div>
                </div>
              </div>

              {booth.amenities && booth.amenities.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {booth.amenities.map((amenity, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {booth.exhibitor ? (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Assigned to:</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={booth.exhibitor.user.avatarUrl} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                        {booth.exhibitor.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-900">{booth.exhibitor.user.name}</span>
                  </div>
                </div>
              ) : (
                <Button size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Exhibitor
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Exhibition Analytics</h3>
        <p className="text-gray-600 mb-4">Lead generation, booth performance, and ROI tracking</p>
        <Button>
          <TrendingUp className="h-4 w-4 mr-2" />
          View Analytics
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Exhibition & Stall Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Exhibitor
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="exhibitors">Exhibitors</TabsTrigger>
          <TabsTrigger value="booths">Booth Assignment</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="exhibitors" className="mt-6">
          {renderExhibitorDirectory()}
        </TabsContent>

        <TabsContent value="booths" className="mt-6">
          {renderBoothAssignment()}
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          {renderAnalytics()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
