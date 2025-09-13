'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Clock,
  Target,
  Award,
  Activity,
  MessageSquare,
  Mail,
  Phone,
  Bell,
  Settings,
  Download,
  Upload,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Share2,
  FileText,
  PieChart,
  LineChart,
  BarChart,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Heart,
  MessageCircle,
  Send,
  Paperclip,
  Image,
  Video,
  Mic,
  Globe,
  Wifi,
  Database,
  Server,
  Shield,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AnalyticsData {
  totalAttendees: number;
  totalSessions: number;
  totalExhibitors: number;
  totalRevenue: number;
  engagementRate: number;
  satisfactionScore: number;
  networkingConnections: number;
  feedbackCount: number;
}

interface CommunicationMessage {
  id: string;
  type: 'email' | 'sms' | 'push' | 'announcement';
  title: string;
  content: string;
  recipients: number;
  sentAt: string;
  openRate?: number;
  clickRate?: number;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
}

interface BudgetItem {
  id: string;
  category: string;
  description: string;
  budgeted: number;
  actual: number;
  variance: number;
  status: 'under' | 'on-track' | 'over';
}

interface LogisticsAnalyticsProps {
  eventId?: string;
}

export default function LogisticsAnalytics({ eventId }: LogisticsAnalyticsProps) {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [communications, setCommunications] = useState<CommunicationMessage[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
    fetchCommunications();
    fetchBudgetData();
  }, [eventId]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // Mock analytics data
      const mockData: AnalyticsData = {
        totalAttendees: 1247,
        totalSessions: 45,
        totalExhibitors: 28,
        totalRevenue: 124500,
        engagementRate: 87.5,
        satisfactionScore: 4.6,
        networkingConnections: 3421,
        feedbackCount: 892,
      };
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunications = async () => {
    try {
      // Mock communications data
      const mockCommunications: CommunicationMessage[] = [
        {
          id: '1',
          type: 'email',
          title: 'Welcome to WECON Masawat 2024',
          content: 'Thank you for registering for our premier event...',
          recipients: 1247,
          sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          openRate: 78.5,
          clickRate: 23.4,
          status: 'sent',
        },
        {
          id: '2',
          type: 'push',
          title: 'Session Starting Soon',
          content: 'Your bookmarked session "Future of AI" starts in 15 minutes',
          recipients: 342,
          sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          openRate: 92.1,
          status: 'sent',
        },
      ];
      setCommunications(mockCommunications);
    } catch (error) {
      console.error('Error fetching communications:', error);
    }
  };

  const fetchBudgetData = async () => {
    try {
      // Mock budget data
      const mockBudget: BudgetItem[] = [
        {
          id: '1',
          category: 'Venue',
          description: 'Main conference hall rental',
          budgeted: 25000,
          actual: 24500,
          variance: -500,
          status: 'under',
        },
        {
          id: '2',
          category: 'Catering',
          description: 'Breakfast, lunch, and coffee breaks',
          budgeted: 15000,
          actual: 15800,
          variance: 800,
          status: 'over',
        },
        {
          id: '3',
          category: 'Technology',
          description: 'AV equipment and streaming setup',
          budgeted: 8000,
          actual: 7950,
          variance: -50,
          status: 'on-track',
        },
      ];
      setBudgetItems(mockBudget);
    } catch (error) {
      console.error('Error fetching budget data:', error);
    }
  };

  const renderAnalyticsDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Attendees', 
            value: analyticsData?.totalAttendees?.toLocaleString() || '0', 
            icon: Users, 
            color: 'blue',
            change: '+12% from last event'
          },
          { 
            label: 'Total Revenue', 
            value: `$${(analyticsData?.totalRevenue || 0).toLocaleString()}`, 
            icon: DollarSign, 
            color: 'green',
            change: '+18% from target'
          },
          { 
            label: 'Engagement Rate', 
            value: `${analyticsData?.engagementRate || 0}%`, 
            icon: Activity, 
            color: 'purple',
            change: '+5.2% from last event'
          },
          { 
            label: 'Satisfaction Score', 
            value: `${analyticsData?.satisfactionScore || 0}/5`, 
            icon: Star, 
            color: 'orange',
            change: '4.6/5 average rating'
          }
        ].map((metric, idx) => (
          <Card key={idx} className="shadow-sm bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-xs text-green-600 mt-1">{metric.change}</p>
                </div>
                <div className={`p-3 rounded-full bg-${metric.color}-100`}>
                  <metric.icon className={`h-6 w-6 text-${metric.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Attendance Over Time */}
        <Card className="shadow-sm bg-white border border-gray-200">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">Attendance Over Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Real-time attendance tracking chart</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Popularity */}
        <Card className="shadow-sm bg-white border border-gray-200">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">Session Popularity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { name: 'Future of AI Technology', attendees: 245, capacity: 250, percentage: 98 },
                { name: 'Digital Marketing Trends', attendees: 189, capacity: 200, percentage: 94.5 },
                { name: 'Startup Pitch Competition', attendees: 156, capacity: 180, percentage: 86.7 },
                { name: 'Networking Lunch', attendees: 312, capacity: 400, percentage: 78 },
              ].map((session, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 text-sm">{session.name}</span>
                    <span className="text-sm text-gray-600">{session.attendees}/{session.capacity}</span>
                  </div>
                  <Progress value={session.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Networking Stats */}
        <Card className="shadow-sm bg-white border border-gray-200">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-lg font-semibold text-gray-900">Networking</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{analyticsData?.networkingConnections || 0}</p>
                <p className="text-sm text-gray-600">Total Connections Made</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Connection Requests</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Accepted Connections</span>
                  <span className="font-medium">1,089</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Messages Exchanged</span>
                  <span className="font-medium">2,341</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Summary */}
        <Card className="shadow-sm bg-white border border-gray-200">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              <span className="text-lg font-semibold text-gray-900">Feedback</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">{analyticsData?.feedbackCount || 0}</p>
                <p className="text-sm text-gray-600">Total Feedback Responses</p>
              </div>
              <div className="space-y-2">
                {[
                  { rating: 5, count: 456, percentage: 51 },
                  { rating: 4, count: 298, percentage: 33 },
                  { rating: 3, count: 89, percentage: 10 },
                  { rating: 2, count: 34, percentage: 4 },
                  { rating: 1, count: 15, percentage: 2 },
                ].map((item) => (
                  <div key={item.rating} className="flex items-center gap-2">
                    <span className="text-sm w-8">{item.rating}★</span>
                    <Progress value={item.percentage} className="flex-1 h-2" />
                    <span className="text-sm text-gray-600 w-12">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ROI Tracking */}
        <Card className="shadow-sm bg-white border border-gray-200">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">ROI Tracking</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">312%</p>
                <p className="text-sm text-gray-600">Return on Investment</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Investment</span>
                  <span className="font-medium">$89,500</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Revenue Generated</span>
                  <span className="font-medium">$279,200</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Net Profit</span>
                  <span className="font-medium text-green-600">$189,700</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCommunicationHub = () => (
    <div className="space-y-6">
      {/* Communication Controls */}
      <Card className="shadow-sm bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Communication Center</h3>
            <div className="flex gap-2">
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email Campaign
              </Button>
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                SMS Blast
              </Button>
              <Button>
                <Bell className="h-4 w-4 mr-2" />
                Push Notification
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Communications */}
      <div className="space-y-4">
        {communications.map((comm) => (
          <Card key={comm.id} className="shadow-sm bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{comm.title}</h4>
                    <Badge variant={comm.type === 'email' ? 'default' : comm.type === 'sms' ? 'secondary' : 'outline'}>
                      {comm.type.toUpperCase()}
                    </Badge>
                    <Badge variant={comm.status === 'sent' ? 'default' : 'secondary'}>
                      {comm.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{comm.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{comm.recipients.toLocaleString()} recipients</span>
                    <span>Sent {new Date(comm.sentAt).toLocaleDateString()}</span>
                    {comm.openRate && <span>{comm.openRate}% open rate</span>}
                    {comm.clickRate && <span>{comm.clickRate}% click rate</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderProjectManagement = () => (
    <div className="space-y-6">
      {/* Budget Overview */}
      <Card className="shadow-sm bg-white border border-gray-200">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-lg font-semibold text-gray-900">Budget Tracking</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {budgetItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{item.category}</h4>
                  <Badge variant={
                    item.status === 'under' ? 'default' :
                    item.status === 'on-track' ? 'secondary' : 'destructive'
                  }>
                    {item.status === 'under' ? 'Under Budget' :
                     item.status === 'on-track' ? 'On Track' : 'Over Budget'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Budgeted</p>
                    <p className="font-semibold">${item.budgeted.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Actual</p>
                    <p className="font-semibold">${item.actual.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Variance</p>
                    <p className={`font-semibold ${item.variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.variance < 0 ? '-' : '+'}${Math.abs(item.variance).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReporting = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Reporting</h3>
        <p className="text-gray-600 mb-4">Generate detailed reports for stakeholders and sponsors</p>
        <div className="flex gap-2 justify-center">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Attendee Report
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Financial Report
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Executive Summary
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Logistics & Analytics</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Share2 className="h-4 w-4 mr-2" />
            Share Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="project">Project Management</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderAnalyticsDashboard()
          )}
        </TabsContent>

        <TabsContent value="communication" className="mt-6">
          {renderCommunicationHub()}
        </TabsContent>

        <TabsContent value="project" className="mt-6">
          {renderProjectManagement()}
        </TabsContent>

        <TabsContent value="reporting" className="mt-6">
          {renderReporting()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
