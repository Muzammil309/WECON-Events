'use client';
import { useState, useEffect } from 'react';
import { Building, Plus, Search, Filter, MapPin, Users, DollarSign, Calendar, Phone, Mail, Globe, MoreVertical } from 'lucide-react';

interface Exhibition {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  boothNumber: string;
  boothSize: string;
  category: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'setup' | 'active';
  packageType: 'standard' | 'premium' | 'platinum';
  paymentStatus: 'paid' | 'pending' | 'overdue';
  setupDate: string;
  specialRequirements?: string;
  leadCount: number;
  visitorsCount: number;
  revenue: number;
}

export default function ExhibitionManagement() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchExhibitionsData();
  }, []);

  const fetchExhibitionsData = async () => {
    try {
      const response = await fetch('/api/admin/exhibitions');
      if (response.ok) {
        const data = await response.json();
        setExhibitions(data.exhibitions || []);
      } else {
        // Fallback demo data
        setExhibitions([
          {
            id: '1',
            companyName: 'Tech Solutions Inc.',
            contactPerson: 'John Smith',
            email: 'john.smith@techsolutions.com',
            phone: '+1 (555) 123-4567',
            website: 'www.techsolutions.com',
            boothNumber: 'A-101',
            boothSize: '3x3m',
            category: 'Technology',
            status: 'active',
            packageType: 'platinum',
            paymentStatus: 'paid',
            setupDate: '2025-08-29T08:00:00Z',
            specialRequirements: 'Power outlets, WiFi, demo screens',
            leadCount: 45,
            visitorsCount: 120,
            revenue: 15000
          },
          {
            id: '2',
            companyName: 'Green Energy Corp',
            contactPerson: 'Sarah Johnson',
            email: 'sarah@greenenergy.com',
            phone: '+1 (555) 234-5678',
            website: 'www.greenenergy.com',
            boothNumber: 'B-205',
            boothSize: '6x3m',
            category: 'Sustainability',
            status: 'setup',
            packageType: 'premium',
            paymentStatus: 'paid',
            setupDate: '2025-08-30T09:00:00Z',
            specialRequirements: 'Heavy equipment display area',
            leadCount: 23,
            visitorsCount: 67,
            revenue: 12000
          },
          {
            id: '3',
            companyName: 'Digital Marketing Pro',
            contactPerson: 'Mike Chen',
            email: 'mike@digitalmarketing.com',
            phone: '+1 (555) 345-6789',
            boothNumber: 'C-150',
            boothSize: '3x3m',
            category: 'Marketing',
            status: 'confirmed',
            packageType: 'standard',
            paymentStatus: 'pending',
            setupDate: '2025-08-30T10:00:00Z',
            leadCount: 12,
            visitorsCount: 34,
            revenue: 8000
          },
          {
            id: '4',
            companyName: 'Healthcare Innovations',
            contactPerson: 'Dr. Emily Rodriguez',
            email: 'emily@healthcareinnovations.com',
            phone: '+1 (555) 456-7890',
            website: 'www.healthcareinnovations.com',
            boothNumber: 'D-301',
            boothSize: '6x6m',
            category: 'Healthcare',
            status: 'active',
            packageType: 'platinum',
            paymentStatus: 'paid',
            setupDate: '2025-08-29T07:00:00Z',
            specialRequirements: 'Medical equipment display, sterile environment',
            leadCount: 67,
            visitorsCount: 189,
            revenue: 20000
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch exhibitions data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExhibitions = exhibitions.filter(exhibition => {
    const matchesSearch = exhibition.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exhibition.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exhibition.boothNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || exhibition.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || exhibition.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'setup': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPackageColor = (packageType: string) => {
    switch (packageType) {
      case 'platinum': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'standard': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const exhibitionStats = {
    total: exhibitions.length,
    active: exhibitions.filter(e => e.status === 'active').length,
    setup: exhibitions.filter(e => e.status === 'setup').length,
    confirmed: exhibitions.filter(e => e.status === 'confirmed').length,
    totalRevenue: exhibitions.reduce((sum, e) => sum + e.revenue, 0),
    totalLeads: exhibitions.reduce((sum, e) => sum + e.leadCount, 0),
    totalVisitors: exhibitions.reduce((sum, e) => sum + e.visitorsCount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exhibition Management</h1>
          <p className="text-gray-600 mt-1">Manage exhibitor portal and booth assignments</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="h-4 w-4" />
          Add Exhibitor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Exhibitors</p>
              <p className="text-2xl font-bold text-gray-900">{exhibitionStats.total}</p>
            </div>
            <Building className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Booths</p>
              <p className="text-2xl font-bold text-green-600">{exhibitionStats.active}</p>
            </div>
            <MapPin className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-purple-600">{exhibitionStats.totalLeads}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-orange-600">${exhibitionStats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
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
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="setup">Setup</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Marketing">Marketing</option>
              <option value="Sustainability">Sustainability</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exhibitions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Exhibitors ({filteredExhibitions.length})</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredExhibitions.map((exhibition) => (
            <div key={exhibition.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{exhibition.companyName}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(exhibition.status)}`}>
                      {exhibition.status.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPackageColor(exhibition.packageType)}`}>
                      {exhibition.packageType.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPaymentStatusColor(exhibition.paymentStatus)}`}>
                      {exhibition.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        <strong>Contact:</strong> {exhibition.contactPerson}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {exhibition.email}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {exhibition.phone}
                      </p>
                      {exhibition.website && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {exhibition.website}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        <strong>Booth:</strong> {exhibition.boothNumber} ({exhibition.boothSize})
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Category:</strong> {exhibition.category}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Setup:</strong> {new Date(exhibition.setupDate).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Revenue:</strong> ${exhibition.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {exhibition.leadCount} leads
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {exhibition.visitorsCount} visitors
                    </span>
                    {exhibition.specialRequirements && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Special Requirements
                      </span>
                    )}
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
