'use client';
import { useState, useEffect } from 'react';
import { 
  Building, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  DollarSign, 
  Calendar,
  Phone,
  Mail,
  Globe,
  Edit,
  Trash2,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Exhibitor {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  website?: string;
  boothNumber?: string;
  boothSize?: string;
  category?: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'SETUP' | 'ACTIVE';
  packageType: 'STANDARD' | 'PREMIUM' | 'PLATINUM';
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  setupDate?: string;
  specialRequirements?: string;
  eventId: string;
  eventName?: string;
  createdAt: string;
}

interface NewExhibitorForm {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  boothNumber: string;
  boothSize: string;
  category: string;
  packageType: 'STANDARD' | 'PREMIUM' | 'PLATINUM';
  eventId: string;
  setupDate: string;
  specialRequirements: string;
}

interface Event {
  id: string;
  name: string;
  startAt: string;
}

export default function ExhibitionsManagement() {
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPackage, setFilterPackage] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExhibitor, setEditingExhibitor] = useState<Exhibitor | null>(null);
  const [formData, setFormData] = useState<NewExhibitorForm>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    boothNumber: '',
    boothSize: '',
    category: '',
    packageType: 'STANDARD',
    eventId: '',
    setupDate: '',
    specialRequirements: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<NewExhibitorForm>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExhibitorsData();
    fetchEventsData();
  }, []);

  const fetchExhibitorsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/exhibitors');
      if (response.ok) {
        const data = await response.json();
        setExhibitors(data.exhibitors || []);
      } else {
        console.error('Failed to fetch exhibitors data');
        setExhibitors([]);
      }
    } catch (error) {
      console.error('Error fetching exhibitors:', error);
      setExhibitors([]);
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
    const errors: Partial<NewExhibitorForm> = {};
    
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
    if (!formData.contactPerson.trim()) errors.contactPerson = 'Contact person is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.eventId) errors.eventId = 'Please select an event';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const url = editingExhibitor ? `/api/admin/exhibitors` : '/api/admin/exhibitors';
      const method = editingExhibitor ? 'PUT' : 'POST';
      const payload = editingExhibitor 
        ? { ...formData, id: editingExhibitor.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await fetchExhibitorsData(); // Refresh the list
        resetForm();
        setShowAddForm(false);
        setEditingExhibitor(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save exhibitor');
      }
    } catch (error) {
      console.error('Error saving exhibitor:', error);
      alert('Failed to save exhibitor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (exhibitor: Exhibitor) => {
    setEditingExhibitor(exhibitor);
    setFormData({
      companyName: exhibitor.companyName,
      contactPerson: exhibitor.contactPerson,
      email: exhibitor.email,
      phone: exhibitor.phone || '',
      website: exhibitor.website || '',
      boothNumber: exhibitor.boothNumber || '',
      boothSize: exhibitor.boothSize || '',
      category: exhibitor.category || '',
      packageType: exhibitor.packageType,
      eventId: exhibitor.eventId,
      setupDate: exhibitor.setupDate ? exhibitor.setupDate.split('T')[0] : '',
      specialRequirements: exhibitor.specialRequirements || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (exhibitorId: string) => {
    if (!confirm('Are you sure you want to delete this exhibitor?')) return;

    try {
      const response = await fetch(`/api/admin/exhibitors?id=${exhibitorId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchExhibitorsData(); // Refresh the list
      } else {
        alert('Failed to delete exhibitor');
      }
    } catch (error) {
      console.error('Error deleting exhibitor:', error);
      alert('Failed to delete exhibitor');
    }
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      website: '',
      boothNumber: '',
      boothSize: '',
      category: '',
      packageType: 'STANDARD',
      eventId: '',
      setupDate: '',
      specialRequirements: ''
    });
    setFormErrors({});
  };

  const filteredExhibitors = exhibitors.filter(exhibitor => {
    const matchesSearch = exhibitor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exhibitor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exhibitor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (exhibitor.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || exhibitor.status === filterStatus;
    const matchesPackage = filterPackage === 'all' || exhibitor.packageType === filterPackage;
    return matchesSearch && matchesStatus && matchesPackage;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-900/50 text-green-300';
      case 'PENDING': return 'bg-yellow-900/50 text-yellow-300';
      case 'CANCELLED': return 'bg-red-900/50 text-red-300';
      case 'SETUP': return 'bg-blue-900/50 text-blue-300';
      case 'ACTIVE': return 'bg-purple-900/50 text-purple-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle className="h-4 w-4" />;
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'CANCELLED': return <X className="h-4 w-4" />;
      case 'SETUP': return <Building className="h-4 w-4" />;
      case 'ACTIVE': return <Users className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPackageColor = (packageType: string) => {
    switch (packageType) {
      case 'PLATINUM': return 'bg-purple-900/50 text-purple-300';
      case 'PREMIUM': return 'bg-blue-900/50 text-blue-300';
      case 'STANDARD': return 'bg-gray-700 text-gray-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

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
          <h1 className="text-2xl font-bold text-white dark:text-white">Exhibition Management</h1>
          <p className="text-gray-300 dark:text-gray-300 mt-1">Manage exhibitors, booth assignments, and exhibition logistics</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingExhibitor(null);
            setShowAddForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Exhibitor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Total Exhibitors</p>
              <p className="text-2xl font-bold text-white dark:text-white">{exhibitors.length}</p>
            </div>
            <Building className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Confirmed</p>
              <p className="text-2xl font-bold text-white dark:text-white">{exhibitors.filter(e => e.status === 'CONFIRMED').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Pending</p>
              <p className="text-2xl font-bold text-white dark:text-white">{exhibitors.filter(e => e.status === 'PENDING').length}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Premium+</p>
              <p className="text-2xl font-bold text-white dark:text-white">{exhibitors.filter(e => e.packageType === 'PREMIUM' || e.packageType === 'PLATINUM').length}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-400" />
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
              placeholder="Search exhibitors..."
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
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="SETUP">Setup</option>
              <option value="ACTIVE">Active</option>
            </select>
            <select
              value={filterPackage}
              onChange={(e) => setFilterPackage(e.target.value)}
              className="border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Packages</option>
              <option value="STANDARD">Standard</option>
              <option value="PREMIUM">Premium</option>
              <option value="PLATINUM">Platinum</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exhibitor List */}
      <div className="bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-700 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-white dark:text-white">Exhibitors ({filteredExhibitors.length})</h3>
        </div>
        {filteredExhibitors.length === 0 ? (
          <div className="p-8 text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white dark:text-white mb-2">No exhibitors found</h3>
            <p className="text-gray-600 mb-4">
              {exhibitors.length === 0
                ? "Get started by adding your first exhibitor."
                : "Try adjusting your search or filter criteria."
              }
            </p>
            {exhibitors.length === 0 && (
              <button
                onClick={() => {
                  resetForm();
                  setEditingExhibitor(null);
                  setShowAddForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add First Exhibitor
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredExhibitors.map((exhibitor) => (
              <div key={exhibitor.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{exhibitor.companyName}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium flex items-center gap-1 ${getStatusColor(exhibitor.status)}`}>
                        {getStatusIcon(exhibitor.status)}
                        {exhibitor.status}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPackageColor(exhibitor.packageType)}`}>
                        {exhibitor.packageType}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">Contact: {exhibitor.contactPerson}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">{exhibitor.email}</span>
                      </div>
                      {exhibitor.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{exhibitor.phone}</span>
                        </div>
                      )}
                      {exhibitor.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-3 w-3 text-gray-400" />
                          <a href={exhibitor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Website
                          </a>
                        </div>
                      )}
                      {exhibitor.boothNumber && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">Booth {exhibitor.boothNumber}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      {exhibitor.setupDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Setup: {new Date(exhibitor.setupDate).toLocaleDateString()}
                        </span>
                      )}
                      {exhibitor.category && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {exhibitor.category}
                        </span>
                      )}
                      {exhibitor.eventName && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {exhibitor.eventName}
                        </span>
                      )}
                    </div>
                    {exhibitor.specialRequirements && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          <strong>Special Requirements:</strong> {exhibitor.specialRequirements}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(exhibitor)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(exhibitor.id)}
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

      {/* Add/Edit Exhibitor Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white dark:text-white">
                {editingExhibitor ? 'Edit Exhibitor' : 'Add New Exhibitor'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingExhibitor(null);
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
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 ${
                    formErrors.companyName ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter company name"
                />
                {formErrors.companyName && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.companyName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 ${
                    formErrors.contactPerson ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter contact person name"
                />
                {formErrors.contactPerson && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.contactPerson}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 ${
                    formErrors.email ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter email address"
                />
                {formErrors.email && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booth Number
                  </label>
                  <input
                    type="text"
                    value={formData.boothNumber}
                    onChange={(e) => setFormData({ ...formData, boothNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., A-101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booth Size
                  </label>
                  <select
                    value={formData.boothSize}
                    onChange={(e) => setFormData({ ...formData, boothSize: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select size</option>
                    <option value="3x3">3x3 meters</option>
                    <option value="3x6">3x6 meters</option>
                    <option value="6x6">6x6 meters</option>
                    <option value="6x9">6x9 meters</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Technology, Healthcare"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Type
                  </label>
                  <select
                    value={formData.packageType}
                    onChange={(e) => setFormData({ ...formData, packageType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="PLATINUM">Platinum</option>
                  </select>
                </div>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Setup Date
                </label>
                <input
                  type="date"
                  value={formData.setupDate}
                  onChange={(e) => setFormData({ ...formData, setupDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requirements
                </label>
                <textarea
                  value={formData.specialRequirements}
                  onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any special setup requirements, equipment needs, etc."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingExhibitor(null);
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
                      {editingExhibitor ? 'Update' : 'Add'} Exhibitor
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
