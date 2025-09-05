'use client';
import { useState, useEffect } from 'react';
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
  Clock,
  CheckCircle,
  X,
  Save,
  AlertCircle
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
  eventName?: string;
  status: 'ACTIVE' | 'PAUSED' | 'SOLD_OUT' | 'EXPIRED';
  saleStartDate: string;
  saleEndDate: string;
  createdAt: string;
  features?: string[];
}

interface NewTicketForm {
  name: string;
  description: string;
  price: number;
  currency: string;
  totalQuantity: number;
  eventId: string;
  saleStartDate: string;
  saleEndDate: string;
  features: string;
}

interface Event {
  id: string;
  name: string;
  startAt: string;
}

export default function TicketsManagement() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterEvent, setFilterEvent] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);
  const [formData, setFormData] = useState<NewTicketForm>({
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    totalQuantity: 100,
    eventId: '',
    saleStartDate: '',
    saleEndDate: '',
    features: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<NewTicketForm>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTicketsData();
    fetchEventsData();
  }, []);

  const fetchTicketsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      } else {
        console.error('Failed to fetch tickets data');
        setTickets([]);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventsData = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<NewTicketForm> = {};
    
    if (!formData.name.trim()) errors.name = 'Ticket name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (Number(formData.price) < 0) errors.price = 'Price must be 0 or greater';
    if (Number(formData.totalQuantity) < 1) errors.totalQuantity = 'Quantity must be at least 1';
    if (!formData.eventId) errors.eventId = 'Please select an event';
    if (!formData.saleStartDate) errors.saleStartDate = 'Sale start date is required';
    if (!formData.saleEndDate) errors.saleEndDate = 'Sale end date is required';
    
    // Validate date range
    if (formData.saleStartDate && formData.saleEndDate) {
      if (new Date(formData.saleStartDate) >= new Date(formData.saleEndDate)) {
        errors.saleEndDate = 'End date must be after start date';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const url = editingTicket ? `/api/admin/tickets` : '/api/admin/tickets';
      const method = editingTicket ? 'PUT' : 'POST';
      const payload = editingTicket 
        ? { ...formData, id: editingTicket.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await fetchTicketsData(); // Refresh the list
        resetForm();
        setShowAddForm(false);
        setEditingTicket(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save ticket');
      }
    } catch (error) {
      console.error('Error saving ticket:', error);
      alert('Failed to save ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (ticket: TicketType) => {
    setEditingTicket(ticket);
    setFormData({
      name: ticket.name,
      description: ticket.description,
      price: ticket.price,
      currency: ticket.currency,
      totalQuantity: ticket.totalQuantity,
      eventId: ticket.eventId,
      saleStartDate: ticket.saleStartDate.split('T')[0],
      saleEndDate: ticket.saleEndDate.split('T')[0],
      features: ticket.features?.join(', ') || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (ticketId: string) => {
    if (!confirm('Are you sure you want to delete this ticket type?')) return;

    try {
      const response = await fetch(`/api/admin/tickets?id=${ticketId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchTicketsData(); // Refresh the list
      } else {
        alert('Failed to delete ticket');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      alert('Failed to delete ticket');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      currency: 'USD',
      totalQuantity: 100,
      eventId: '',
      saleStartDate: '',
      saleEndDate: '',
      features: ''
    });
    setFormErrors({});
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ticket.eventName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesEvent = filterEvent === 'all' || ticket.eventId === filterEvent;
    return matchesSearch && matchesStatus && matchesEvent;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-900/50 text-green-300';
      case 'PAUSED': return 'bg-yellow-900/50 text-yellow-300';
      case 'SOLD_OUT': return 'bg-red-900/50 text-red-300';
      case 'EXPIRED': return 'bg-gray-700 text-gray-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="h-4 w-4" />;
      case 'PAUSED': return <Clock className="h-4 w-4" />;
      case 'SOLD_OUT': return <X className="h-4 w-4" />;
      case 'EXPIRED': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const totalRevenue = tickets.reduce((sum, ticket) => sum + (ticket.soldQuantity * ticket.price), 0);
  const totalSold = tickets.reduce((sum, ticket) => sum + ticket.soldQuantity, 0);
  const totalAvailable = tickets.reduce((sum, ticket) => sum + ticket.availableQuantity, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white dark:text-white">Ticket Management</h1>
          <p className="text-gray-300 dark:text-gray-300 mt-1">Create and manage ticket types for your events</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingTicket(null);
            setShowAddForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Ticket Type
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Total Revenue</p>
              <p className="text-2xl font-bold text-white dark:text-white">${totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Tickets Sold</p>
              <p className="text-2xl font-bold text-white dark:text-white">{totalSold.toLocaleString()}</p>
            </div>
            <Ticket className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Available</p>
              <p className="text-2xl font-bold text-white dark:text-white">{totalAvailable.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Ticket Types</p>
              <p className="text-2xl font-bold text-white dark:text-white">{tickets.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="SOLD_OUT">Sold Out</option>
              <option value="EXPIRED">Expired</option>
            </select>
            <select
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value)}
              className="border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Events</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-700 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-white dark:text-white">Ticket Types ({filteredTickets.length})</h3>
        </div>
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center">
            <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white dark:text-white mb-2">No ticket types found</h3>
            <p className="text-gray-300 dark:text-gray-300 mb-4">
              {tickets.length === 0
                ? "Get started by creating your first ticket type."
                : "Try adjusting your search or filter criteria."
              }
            </p>
            {tickets.length === 0 && (
              <button
                onClick={() => {
                  resetForm();
                  setEditingTicket(null);
                  setShowAddForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create First Ticket Type
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-700 dark:divide-gray-700">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="p-6 hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white dark:text-white">{ticket.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium flex items-center gap-1 ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-300 dark:text-gray-300 mb-3">{ticket.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400 dark:text-gray-400">Price:</span>
                        <p className="font-semibold text-white dark:text-white">${ticket.price} {ticket.currency}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Sold:</span>
                        <p className="font-semibold text-gray-900">{ticket.soldQuantity} / {ticket.totalQuantity}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Available:</span>
                        <p className="font-semibold text-gray-900">{ticket.availableQuantity}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Revenue:</span>
                        <p className="font-semibold text-gray-900">${(ticket.soldQuantity * ticket.price).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Sale: {new Date(ticket.saleStartDate).toLocaleDateString()} - {new Date(ticket.saleEndDate).toLocaleDateString()}
                      </span>
                      {ticket.eventName && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {ticket.eventName}
                        </span>
                      )}
                    </div>
                    {ticket.features && ticket.features.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {ticket.features.map((feature, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(ticket)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ticket.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Ticket Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white dark:text-white">
                {editingTicket ? 'Edit Ticket Type' : 'Create New Ticket Type'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingTicket(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1">
                  Ticket Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 ${
                    formErrors.name ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="e.g., Early Bird, VIP, General Admission"
                />
                {formErrors.name && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe what's included with this ticket"
                />
                {formErrors.description && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {formErrors.price && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="PKR">PKR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.totalQuantity}
                  onChange={(e) => setFormData({ ...formData, totalQuantity: parseInt(e.target.value) || 0 })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.totalQuantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="100"
                />
                {formErrors.totalQuantity && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.totalQuantity}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event *
                </label>
                <select
                  value={formData.eventId}
                  onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.eventId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select an event</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
                {formErrors.eventId && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.eventId}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.saleStartDate}
                    onChange={(e) => setFormData({ ...formData, saleStartDate: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.saleStartDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.saleStartDate && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.saleStartDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sale End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.saleEndDate}
                    onChange={(e) => setFormData({ ...formData, saleEndDate: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.saleEndDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.saleEndDate && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.saleEndDate}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Access to all sessions, Lunch included, Networking event"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingTicket(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {editingTicket ? 'Update' : 'Create'} Ticket Type
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
