'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageSection } from '@/components/ui/PageSection';
import { 
  Download, 
  FileText, 
  Video, 
  Image, 
  Link as LinkIcon, 
  Search, 
  Filter,
  Calendar,
  User,
  Clock,
  Eye,
  Star
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'image' | 'link' | 'presentation';
  url: string;
  sessionId?: string;
  sessionTitle?: string;
  speaker?: string;
  uploadedAt: string;
  downloads: number;
  size?: string;
  duration?: string;
  featured: boolean;
}

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sessionFilter, setSessionFilter] = useState('all');

  // Mock data - replace with actual API call
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Event Management Best Practices Guide',
      description: 'Comprehensive guide covering all aspects of successful event management',
      type: 'pdf',
      url: '/resources/event-management-guide.pdf',
      sessionId: '1',
      sessionTitle: 'Modern Event Management Strategies',
      speaker: 'Sarah Johnson',
      uploadedAt: '2024-12-20T10:00:00Z',
      downloads: 245,
      size: '2.4 MB',
      featured: true
    },
    {
      id: '2',
      title: 'Digital Transformation in Events',
      description: 'Keynote presentation on how technology is reshaping the events industry',
      type: 'presentation',
      url: '/resources/digital-transformation.pptx',
      sessionId: '2',
      sessionTitle: 'Future of Event Technology',
      speaker: 'Dr. Ahmed Khan',
      uploadedAt: '2024-12-19T14:30:00Z',
      downloads: 189,
      size: '15.7 MB',
      featured: true
    },
    {
      id: '3',
      title: 'Event ROI Calculator Template',
      description: 'Excel template for calculating return on investment for events',
      type: 'link',
      url: 'https://example.com/roi-calculator',
      sessionId: '3',
      sessionTitle: 'Measuring Event Success',
      speaker: 'Mike Wilson',
      uploadedAt: '2024-12-18T09:15:00Z',
      downloads: 156,
      featured: false
    },
    {
      id: '4',
      title: 'Networking Session Recording',
      description: 'Full recording of the networking strategies workshop',
      type: 'video',
      url: '/resources/networking-session.mp4',
      sessionId: '4',
      sessionTitle: 'Effective Networking Strategies',
      speaker: 'Lisa Chen',
      uploadedAt: '2024-12-17T16:45:00Z',
      downloads: 98,
      duration: '45 min',
      featured: false
    },
    {
      id: '5',
      title: 'Event Floor Plan Template',
      description: 'Customizable floor plan template for event venues',
      type: 'image',
      url: '/resources/floor-plan-template.png',
      uploadedAt: '2024-12-16T11:20:00Z',
      downloads: 67,
      size: '1.2 MB',
      featured: false
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.speaker?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || resource.type === typeFilter;
    const matchesSession = sessionFilter === 'all' || resource.sessionId === sessionFilter;
    return matchesSearch && matchesType && matchesSession;
  });

  const featuredResources = resources.filter(r => r.featured);

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'pdf':
      case 'presentation':
        return FileText;
      case 'video':
        return Video;
      case 'image':
        return Image;
      case 'link':
        return LinkIcon;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'video':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'image':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'link':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'presentation':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="grid gap-10 sm:gap-12">
      {/* Header */}
      <PageSection>
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 mb-4">
            Event Resources
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Access presentations, guides, templates, and recordings from WECON Masawat sessions
          </p>
        </div>
      </PageSection>

      {/* Featured Resources */}
      {featuredResources.length > 0 && (
        <PageSection>
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              Featured Resources
            </h2>
            <p className="opacity-70 text-sm mt-1">Most popular and recommended downloads</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredResources.map((resource, index) => {
              const TypeIcon = getTypeIcon(resource.type);
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20">
                      <TypeIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {resource.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(resource.type)}`}>
                          {resource.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {resource.description}
                      </p>
                      {resource.sessionTitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          From: {resource.sessionTitle}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                          {resource.speaker && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {resource.speaker}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {resource.downloads}
                          </span>
                        </div>
                        <span>{formatDate(resource.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </PageSection>
      )}

      {/* Filters */}
      <PageSection>
        <div className="bg-white/60 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="link">Link</option>
                <option value="presentation">Presentation</option>
              </select>
            </div>

            {/* Session Filter */}
            <select
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Sessions</option>
              <option value="1">Modern Event Management Strategies</option>
              <option value="2">Future of Event Technology</option>
              <option value="3">Measuring Event Success</option>
              <option value="4">Effective Networking Strategies</option>
            </select>
          </div>
        </div>
      </PageSection>

      {/* All Resources */}
      <PageSection>
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">All Resources</h2>
          <p className="opacity-70 text-sm mt-1">
            {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No resources found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredResources.map((resource, index) => {
              const TypeIcon = getTypeIcon(resource.type);
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20">
                      <TypeIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {resource.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {resource.description}
                          </p>
                          {resource.sessionTitle && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              From: {resource.sessionTitle}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(resource.type)}`}>
                            {resource.type.toUpperCase()}
                          </span>
                          {resource.featured && (
                            <Star className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                          {resource.speaker && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {resource.speaker}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {resource.downloads}
                          </span>
                          {resource.size && (
                            <span>{resource.size}</span>
                          )}
                          {resource.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {resource.duration}
                            </span>
                          )}
                        </div>
                        <span>{formatDate(resource.uploadedAt)}</span>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </PageSection>
    </div>
  );
}
