'use client';
import { useState, useEffect } from 'react';
import { 
  Monitor, 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Upload, 
  Calendar, 
  AlertTriangle, 
  Eye,
  Edit,
  Trash2,
  X,
  Save,
  AlertCircle,
  Wifi,
  WifiOff,
  Image,
  Video,
  FileText,
  Clock,
  Settings
} from 'lucide-react';

interface Display {
  id: string;
  name: string;
  location: string;
  status: 'ONLINE' | 'OFFLINE' | 'ERROR';
  currentContent: string;
  lastUpdate: string;
  resolution: string;
  orientation: 'LANDSCAPE' | 'PORTRAIT';
}

interface Content {
  id: string;
  name: string;
  type: 'IMAGE' | 'VIDEO' | 'TEXT';
  url?: string;
  content?: string;
  duration: number;
  status: 'ACTIVE' | 'DRAFT' | 'SCHEDULED';
  createdAt: string;
}

interface Playlist {
  id: string;
  name: string;
  contentItems: string[];
  duration: number;
  loop: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

interface DigitalSignageData {
  displays: Display[];
  content: Content[];
  playlists: Playlist[];
  stats: {
    totalDisplays: number;
    onlineDisplays: number;
    totalContent: number;
    activeContent: number;
    totalPlaylists: number;
  };
}

export default function DigitalSignageManagement() {
  const [data, setData] = useState<DigitalSignageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'displays' | 'content' | 'playlists' | 'schedule'>('displays');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formType, setFormType] = useState<'display' | 'content' | 'playlist'>('display');
  const [selectedDisplay, setSelectedDisplay] = useState<Display | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [formErrors, setFormErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSignageData();
  }, []);

  const fetchSignageData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/digital-signage');
      if (response.ok) {
        const signageData = await response.json();
        setData(signageData);
      } else {
        console.error('Failed to fetch digital signage data');
      }
    } catch (error) {
      console.error('Error fetching digital signage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: any = {};

    if (formType === 'display') {
      if (!formData.name?.trim()) errors.name = 'Display name is required';
      if (!formData.location?.trim()) errors.location = 'Location is required';
    } else if (formType === 'content') {
      if (!formData.name?.trim()) errors.name = 'Content name is required';
      if (!formData.type) errors.type = 'Content type is required';
      if (!formData.duration || formData.duration < 1) errors.duration = 'Duration must be at least 1 second';
    } else if (formType === 'playlist') {
      if (!formData.name?.trim()) errors.name = 'Playlist name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/digital-signage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: formType, ...formData })
      });

      if (response.ok) {
        await fetchSignageData();
        setShowAddForm(false);
        setFormData({});
        setFormErrors({});
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save item');
      }
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const response = await fetch(`/api/admin/digital-signage?type=${type}&id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchSignageData();
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const handleEmergencyBroadcast = async () => {
    const message = prompt('Enter emergency message:');
    if (!message) return;

    try {
      const response = await fetch('/api/admin/digital-signage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'emergency-broadcast',
          message,
          priority: 'HIGH'
        })
      });

      if (response.ok) {
        alert('Emergency broadcast initiated successfully!');
        fetchSignageData();
      } else {
        alert('Failed to initiate emergency broadcast');
      }
    } catch (error) {
      console.error('Error initiating emergency broadcast:', error);
      alert('Failed to initiate emergency broadcast');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return <Wifi className="h-4 w-4 text-green-400" />;
      case 'OFFLINE':
        return <WifiOff className="h-4 w-4 text-red-400" />;
      case 'ERROR':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return <Monitor className="h-4 w-4 text-gray-400" />;
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'IMAGE':
        return <Image className="h-4 w-4 text-blue-400" />;
      case 'VIDEO':
        return <Video className="h-4 w-4 text-purple-400" />;
      case 'TEXT':
        return <FileText className="h-4 w-4 text-green-400" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Digital Signage Management</h1>
          <p className="text-gray-300 mt-2">Control displays, manage content, and schedule media across your venue</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleEmergencyBroadcast}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <AlertTriangle className="h-4 w-4" />
            Emergency Broadcast
          </button>
          <button
            onClick={() => {
              setShowAddForm(true);
              setFormType('display');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add New
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Displays</p>
                <p className="text-2xl font-bold text-white">{data.stats.totalDisplays}</p>
              </div>
              <Monitor className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Online Displays</p>
                <p className="text-2xl font-bold text-green-400">{data.stats.onlineDisplays}</p>
              </div>
              <Wifi className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Content</p>
                <p className="text-2xl font-bold text-white">{data.stats.totalContent}</p>
              </div>
              <Image className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Content</p>
                <p className="text-2xl font-bold text-blue-400">{data.stats.activeContent}</p>
              </div>
              <Play className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Playlists</p>
                <p className="text-2xl font-bold text-white">{data.stats.totalPlaylists}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'displays', label: 'Displays', icon: Monitor },
          { id: 'content', label: 'Content', icon: Image },
          { id: 'playlists', label: 'Playlists', icon: Calendar },
          { id: 'schedule', label: 'Schedule', icon: Clock }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
          />
        </div>
        <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-gray-800 rounded-lg p-6">
        {activeTab === 'displays' && data && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Display Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.displays.map((display) => (
                <div key={display.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(display.status)}
                      <h3 className="font-semibold text-white">{display.name}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedDisplay(display);
                          setShowPreview(true);
                        }}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-white transition-colors">
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Location:</span>
                      <span className="text-white">{display.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Content:</span>
                      <span className="text-white">{display.currentContent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Resolution:</span>
                      <span className="text-white">{display.resolution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Update:</span>
                      <span className="text-white">{new Date(display.lastUpdate).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                      Assign Content
                    </button>
                    <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition-colors">
                      Configure
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && data && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Content Library</h2>
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setFormType('content');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Upload className="h-4 w-4" />
                Upload Content
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.content.map((content) => (
                <div key={content.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getContentTypeIcon(content.type)}
                      <h3 className="font-semibold text-white">{content.name}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      content.status === 'ACTIVE' ? 'bg-green-600 text-white' :
                      content.status === 'DRAFT' ? 'bg-yellow-600 text-white' :
                      'bg-blue-600 text-white'
                    }`}>
                      {content.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white">{content.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{content.duration}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created:</span>
                      <span className="text-white">{new Date(content.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                      Preview
                    </button>
                    <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'playlists' && data && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Playlist Management</h2>
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setFormType('playlist');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create Playlist
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.playlists.map((playlist) => (
                <div key={playlist.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white">{playlist.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      playlist.status === 'ACTIVE' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                    }`}>
                      {playlist.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Content Items:</span>
                      <span className="text-white">{playlist.contentItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Duration:</span>
                      <span className="text-white">{playlist.duration}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Loop:</span>
                      <span className="text-white">{playlist.loop ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
                      Deploy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Content Scheduling</h2>
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Content scheduling interface will be implemented here</p>
              <p className="text-gray-500 text-sm mt-2">Schedule content to play at specific times across different displays</p>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedDisplay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">
                Preview: {selectedDisplay.name}
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-12">
                <Monitor className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Live preview of {selectedDisplay.currentContent}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Resolution: {selectedDisplay.resolution} | {selectedDisplay.orientation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
