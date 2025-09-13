'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Star,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  FileText,
  TrendingUp,
  Award,
  Handshake
} from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner';
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  sponsorshipAmount: number;
  benefits: string[];
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  contractStart: Date;
  contractEnd: Date;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  notes: string;
  createdAt: Date;
  lastContact: Date;
}

interface SponsorshipPackage {
  id: string;
  name: string;
  tier: string;
  price: number;
  benefits: string[];
  maxSponsors: number;
  currentSponsors: number;
  isActive: boolean;
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [packages, setPackages] = useState<SponsorshipPackage[]>([]);
  const [activeTab, setActiveTab] = useState<'sponsors' | 'packages' | 'analytics'>('sponsors');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockSponsors: Sponsor[] = [
      {
        id: '1',
        name: 'TechCorp Solutions',
        logo: '/logos/techcorp.png',
        tier: 'platinum',
        contactPerson: 'Sarah Johnson',
        email: 'sarah@techcorp.com',
        phone: '+92 300 1234567',
        website: 'https://techcorp.com',
        address: 'Karachi, Pakistan',
        sponsorshipAmount: 50000,
        benefits: ['Logo on main stage', 'Keynote slot', 'Premium booth space', 'VIP networking'],
        status: 'active',
        contractStart: new Date('2024-01-01'),
        contractEnd: new Date('2024-12-31'),
        paymentStatus: 'paid',
        notes: 'Excellent partner, interested in expanding next year',
        createdAt: new Date('2024-01-01'),
        lastContact: new Date('2024-02-15')
      },
      {
        id: '2',
        name: 'Innovation Labs',
        logo: '/logos/innovation-labs.png',
        tier: 'gold',
        contactPerson: 'Ahmed Khan',
        email: 'ahmed@innovationlabs.pk',
        phone: '+92 321 9876543',
        website: 'https://innovationlabs.pk',
        address: 'Lahore, Pakistan',
        sponsorshipAmount: 25000,
        benefits: ['Logo placement', 'Workshop slot', 'Standard booth', 'Networking access'],
        status: 'active',
        contractStart: new Date('2024-02-01'),
        contractEnd: new Date('2024-12-31'),
        paymentStatus: 'paid',
        notes: 'First-time sponsor, very engaged',
        createdAt: new Date('2024-02-01'),
        lastContact: new Date('2024-02-20')
      },
      {
        id: '3',
        name: 'Digital Dynamics',
        logo: '/logos/digital-dynamics.png',
        tier: 'silver',
        contactPerson: 'Maria Rodriguez',
        email: 'maria@digitaldynamics.com',
        phone: '+92 333 5555555',
        website: 'https://digitaldynamics.com',
        address: 'Islamabad, Pakistan',
        sponsorshipAmount: 15000,
        benefits: ['Logo in materials', 'Small booth space', 'Basic networking'],
        status: 'pending',
        contractStart: new Date('2024-03-01'),
        contractEnd: new Date('2024-12-31'),
        paymentStatus: 'pending',
        notes: 'Contract under review',
        createdAt: new Date('2024-02-25'),
        lastContact: new Date('2024-02-28')
      }
    ];

    const mockPackages: SponsorshipPackage[] = [
      {
        id: '1',
        name: 'Platinum Partnership',
        tier: 'platinum',
        price: 50000,
        benefits: [
          'Logo on main stage backdrop',
          '30-minute keynote slot',
          'Premium booth space (6x6m)',
          'VIP networking dinner access',
          'Logo on all marketing materials',
          'Social media mentions',
          'Press release inclusion'
        ],
        maxSponsors: 2,
        currentSponsors: 1,
        isActive: true
      },
      {
        id: '2',
        name: 'Gold Partnership',
        tier: 'gold',
        price: 25000,
        benefits: [
          'Logo placement on stage',
          '15-minute workshop slot',
          'Standard booth space (4x4m)',
          'Networking session access',
          'Logo in event materials',
          'Social media mentions'
        ],
        maxSponsors: 5,
        currentSponsors: 3,
        isActive: true
      },
      {
        id: '3',
        name: 'Silver Partnership',
        tier: 'silver',
        price: 15000,
        benefits: [
          'Logo in printed materials',
          'Small booth space (3x3m)',
          'Basic networking access',
          'Website listing'
        ],
        maxSponsors: 10,
        currentSponsors: 6,
        isActive: true
      }
    ];

    setSponsors(mockSponsors);
    setPackages(mockPackages);
    setIsLoading(false);
  }, []);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'gold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'silver': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'bronze': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'partner': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'expired': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const filteredSponsors = sponsors.filter(sponsor => {
    const matchesSearch = sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sponsor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'all' || sponsor.tier === filterTier;
    const matchesStatus = filterStatus === 'all' || sponsor.status === filterStatus;
    return matchesSearch && matchesTier && matchesStatus;
  });

  const totalSponsorshipValue = sponsors
    .filter(s => s.status === 'active')
    .reduce((sum, sponsor) => sum + sponsor.sponsorshipAmount, 0);

  const SponsorsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sponsor Management</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage sponsors and partnerships</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Sponsor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Value</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${totalSponsorshipValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Active Sponsors</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {sponsors.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Pending</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {sponsors.filter(s => s.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Platinum</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {sponsors.filter(s => s.tier === 'platinum').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sponsors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={filterTier}
          onChange={(e) => setFilterTier(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Tiers</option>
          <option value="platinum">Platinum</option>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="bronze">Bronze</option>
          <option value="partner">Partner</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Sponsors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSponsors.map((sponsor) => (
          <motion.div
            key={sponsor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{sponsor.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{sponsor.contactPerson}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTierColor(sponsor.tier)}`}>
                  {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sponsor.status)}`}>
                  {sponsor.status.charAt(0).toUpperCase() + sponsor.status.slice(1)}
                </span>
              </div>

              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <DollarSign className="h-3 w-3" />
                  <span>${sponsor.sponsorshipAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{sponsor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Phone className="h-3 w-3" />
                  <span>{sponsor.phone}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Contract: {sponsor.contractStart.toLocaleDateString()} - {sponsor.contractEnd.toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded ${
                    sponsor.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : sponsor.paymentStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {sponsor.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sponsorship Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage sponsors, partnerships, and sponsorship packages</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'sponsors', label: 'Sponsors', icon: Building2 },
              { id: 'packages', label: 'Packages', icon: Award },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'sponsors' && <SponsorsTab />}
        {activeTab === 'packages' && (
          <div className="text-center py-12">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Sponsorship Packages</h3>
            <p className="text-gray-600 dark:text-gray-300">Package management coming soon</p>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Sponsorship Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300">Analytics dashboard coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
