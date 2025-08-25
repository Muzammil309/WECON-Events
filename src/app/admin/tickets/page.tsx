'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Ticket, 
  DollarSign, 
  Users, 
  Calendar,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle
} from 'lucide-react';

interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  totalQuantity: number;
  soldQuantity: number;
  availableQuantity: number;
  eventId: string;
  eventName: string;
  status: 'active' | 'paused' | 'sold_out' | 'expired';
  saleStartDate: string;
  saleEndDate: string;
  createdAt: string;
  features: string[];
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      // Mock data - replace with actual API call
      const mockTickets: TicketType[] = [
        {
          id: '1',
          name: 'Early Bird',
          description: 'Limited time early bird pricing',
          price: 150,
          currency: 'USD',
          totalQuantity: 200,
          soldQuantity: 180,
          availableQuantity: 20,
          eventId: '1',
          eventName: 'WECON Masawat 2025',
          status: 'active',
          saleStartDate: '2024-12-01T00:00:00Z',
          saleEndDate: '2025-01-31T23:59:59Z',
          createdAt: '2024-11-15T10:00:00Z',
          features: ['Conference Access', 'Welcome Kit', 'Networking Lunch']
        },
        {
          id: '2',
          name: 'VIP Pass',
          description: 'Premium access with exclusive benefits',
          price: 350,
          currency: 'USD',
          totalQuantity: 50,
          soldQuantity: 42,
          availableQuantity: 8,
          eventId: '1',
          eventName: 'WECON Masawat 2025',
          status: 'active',
          saleStartDate: '2024-12-01T00:00:00Z',
          saleEndDate: '2025-03-10T23:59:59Z',
          createdAt: '2024-11-15T10:00:00Z',
          features: ['All Early Bird Features', 'VIP Lounge Access', 'Priority Seating', 'Meet & Greet']
        },
        {
          id: '3',
          name: 'Student Discount',
          description: 'Special pricing for students',
          price: 75,
          currency: 'USD',
          totalQuantity: 100,
          soldQuantity: 100,
          availableQuantity: 0,
          eventId: '1',
          eventName: 'WECON Masawat 2025',
          status: 'sold_out',
          saleStartDate: '2024-12-01T00:00:00Z',
          saleEndDate: '2025-03-10T23:59:59Z',
          createdAt: '2024-11-20T14:30:00Z',
          features: ['Conference Access', 'Student Kit']
        },
        {
          id: '4',
          name: 'Regular Pass',
          description: 'Standard conference access',
          price: 200,
          currency: 'USD',
          totalQuantity: 500,
          soldQuantity: 234,
          availableQuantity: 266,
          eventId: '2',
          eventName: 'Tech Summit 2025',
          status: 'active',
          saleStartDate: '2024-11-01T00:00:00Z',
          saleEndDate: '2025-04-15T23:59:59Z',
          createdAt: '2024-10-25T09:00:00Z',
          features: ['Conference Access', 'Welcome Kit', 'Lunch']
        }
      ];

      setTickets(mockTickets);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.eventName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesEvent = eventFilter === 'all' || ticket.eventId === eventFilter;
    return matchesSearch && matchesStatus && matchesEvent;
  });

  const getStatusColor = (status: TicketType['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'sold_out':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'expired':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getSalesPercentage = (sold: number, total: number) => {
    return total > 0 ? (sold / total) * 100 : 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const totalRevenue = tickets.reduce((sum, ticket) => sum + (ticket.soldQuantity * ticket.price), 0);
  const totalSold = tickets.reduce((sum, ticket) => sum + ticket.soldQuantity, 0);
  const totalAvailable = tickets.reduce((sum, ticket) => sum + ticket.availableQuantity, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tickets
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage ticket types and track sales performance
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Ticket Type
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalRevenue, 'USD')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Ticket className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSold}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Tickets Sold</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalAvailable}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Available</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
              <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{tickets.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Ticket Types</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="sold_out">Sold Out</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Event Filter */}
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Events</option>
            <option value="1">WECON Masawat 2025</option>
            <option value="2">Tech Summit 2025</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 text-center">
            <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tickets found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchQuery || statusFilter !== 'all' || eventFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first ticket type.'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && eventFilter === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create Ticket Type
              </button>
            )}
          </div>
        ) : (
          filteredTickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {ticket.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.replace('_', ' ').slice(1)}
                    </span>
                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(ticket.price, ticket.currency)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {ticket.description}
                  </p>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Event: {ticket.eventName}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ticket.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Sales Progress */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{ticket.soldQuantity}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Sold</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{ticket.availableQuantity}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Available</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(ticket.soldQuantity * ticket.price, ticket.currency)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Revenue</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Sales Progress</span>
                  <span>{Math.round(getSalesPercentage(ticket.soldQuantity, ticket.totalQuantity))}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getSalesPercentage(ticket.soldQuantity, ticket.totalQuantity)}%` }}
                  />
                </div>
              </div>

              {/* Sale Period */}
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Sale Period:</span>
                </div>
                <span>{formatDate(ticket.saleStartDate)} - {formatDate(ticket.saleEndDate)}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Ticket Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create New Ticket Type
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Ticket creation form will be implemented here.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
