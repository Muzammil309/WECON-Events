'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  Users, 
  Clock, 
  MapPin, 
  Search, 
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  UserCheck,
  Calendar,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface CheckIn {
  id: string;
  checkedInAt: string;
  method: string;
  location?: string;
  user: {
    id: string;
    name: string;
    email: string;
    company?: string;
    jobTitle?: string;
    avatarUrl?: string;
  };
  session: {
    id: string;
    title: string;
    startAt: string;
    endAt: string;
    venue?: string;
    event: {
      id: string;
      name: string;
    };
  };
}

interface CheckInStats {
  totalToday: number;
  uniqueAttendeesToday: number;
  popularSessions: any[];
  hourlyStats: any[];
  totalInRange: number;
}

export default function CheckInPage() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [stats, setStats] = useState<CheckInStats>({
    totalToday: 0,
    uniqueAttendeesToday: 0,
    popularSessions: [],
    hourlyStats: [],
    totalInRange: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [searchTerm, setSearchTerm] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);

  useEffect(() => {
    fetchCheckIns();
    // Auto-refresh every 10 seconds for real-time updates
    const interval = setInterval(fetchCheckIns, 10000);
    return () => clearInterval(interval);
  }, [timeRange, searchTerm]);

  // Real-time updates using polling (can be upgraded to WebSocket)
  useEffect(() => {
    let isActive = true;

    const pollForUpdates = async () => {
      if (!isActive) return;

      try {
        // Check for new check-ins more frequently
        const response = await fetch(`/api/admin/checkin?timeRange=1h&limit=5`);
        if (response.ok && isActive) {
          const data = await response.json();
          // Only update if we have new check-ins
          if (data.checkIns.length > 0) {
            setCheckIns(prevCheckIns => {
              const newCheckInIds = data.checkIns.map((c: any) => c.id);
              const existingIds = prevCheckIns.map(c => c.id);
              const hasNewCheckIns = newCheckInIds.some(id => !existingIds.includes(id));

              if (hasNewCheckIns) {
                // Merge new check-ins with existing ones, avoiding duplicates
                const mergedCheckIns = [...data.checkIns];
                prevCheckIns.forEach(existing => {
                  if (!newCheckInIds.includes(existing.id)) {
                    mergedCheckIns.push(existing);
                  }
                });
                return mergedCheckIns.sort((a, b) =>
                  new Date(b.checkedInAt).getTime() - new Date(a.checkedInAt).getTime()
                );
              }
              return prevCheckIns;
            });
          }
        }
      } catch (error) {
        console.error('Failed to poll for updates:', error);
      }
    };

    // Poll every 5 seconds for real-time feel
    const pollInterval = setInterval(pollForUpdates, 5000);

    return () => {
      isActive = false;
      clearInterval(pollInterval);
    };
  }, []);

  const fetchCheckIns = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('timeRange', timeRange);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/admin/checkin?${params}`);
      if (response.ok) {
        const data = await response.json();
        setCheckIns(data.checkIns);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch check-ins:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'QR_CODE': return <QrCode className="h-4 w-4" />;
      case 'MANUAL': return <UserCheck className="h-4 w-4" />;
      case 'NFC': return <CheckCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'QR_CODE': return 'text-blue-400';
      case 'MANUAL': return 'text-yellow-400';
      case 'NFC': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const exportCheckIns = () => {
    const csvContent = [
      ['Name', 'Email', 'Session', 'Event', 'Check-in Time', 'Method', 'Location'].join(','),
      ...checkIns.map(checkIn => [
        checkIn.user.name,
        checkIn.user.email,
        checkIn.session.title,
        checkIn.session.event.name,
        new Date(checkIn.checkedInAt).toLocaleString(),
        checkIn.method,
        checkIn.location || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checkins-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading check-in data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Check-in Management</h1>
            <p className="text-gray-400">Monitor real-time attendee check-ins and session attendance</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowQRScanner(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <QrCode className="h-5 w-5" />
              QR Scanner
            </button>
            <button
              onClick={exportCheckIns}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Download className="h-5 w-5" />
              Export
            </button>
            <button
              onClick={fetchCheckIns}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Check-ins Today</p>
                <p className="text-2xl font-bold text-white">{stats.totalToday}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-green-400">+12% from yesterday</span>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Unique Attendees</p>
                <p className="text-2xl font-bold text-white">{stats.uniqueAttendeesToday}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">
                {stats.totalToday > 0 ? Math.round((stats.uniqueAttendeesToday / stats.totalToday) * 100) : 0}% unique rate
              </span>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Popular Sessions</p>
                <p className="text-2xl font-bold text-white">{stats.popularSessions.length}</p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {stats.popularSessions[0] && `Top: ${stats.popularSessions[0]._count?.sessionId || 0} check-ins`}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-600 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Peak Hour</p>
                <p className="text-2xl font-bold text-white">
                  {stats.hourlyStats.length > 0 
                    ? `${Math.max(...stats.hourlyStats.map((h: any) => h.hour))}:00`
                    : '--:--'
                  }
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Most active check-in time
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search attendees, sessions, or events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Check-ins List */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Recent Check-ins</h2>
          <p className="text-sm text-gray-400">Real-time attendee check-in activity</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-750 border-b border-gray-700">
              <tr>
                <th className="text-left p-4 font-medium text-gray-300">Attendee</th>
                <th className="text-left p-4 font-medium text-gray-300">Session</th>
                <th className="text-left p-4 font-medium text-gray-300">Event</th>
                <th className="text-left p-4 font-medium text-gray-300">Check-in Time</th>
                <th className="text-left p-4 font-medium text-gray-300">Method</th>
                <th className="text-left p-4 font-medium text-gray-300">Location</th>
              </tr>
            </thead>
            <tbody>
              {checkIns.map((checkIn, index) => (
                <motion.tr
                  key={checkIn.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        {checkIn.user.avatarUrl ? (
                          <img src={checkIn.user.avatarUrl} alt={checkIn.user.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <span className="text-sm font-medium">{checkIn.user.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{checkIn.user.name}</p>
                        <p className="text-sm text-gray-400">{checkIn.user.email}</p>
                        {checkIn.user.company && (
                          <p className="text-xs text-gray-500">{checkIn.user.company}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-white">{checkIn.session.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {new Date(checkIn.session.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                          {new Date(checkIn.session.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {checkIn.session.venue && (
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">{checkIn.session.venue}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-300">{checkIn.session.event.name}</p>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-white">
                        {new Date(checkIn.checkedInAt).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(checkIn.checkedInAt).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`flex items-center gap-2 ${getMethodColor(checkIn.method)}`}>
                      {getMethodIcon(checkIn.method)}
                      <span className="text-sm">{checkIn.method.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-400">{checkIn.location || 'Not specified'}</p>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {checkIns.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Check-ins Found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Check-ins will appear here as attendees scan QR codes or are manually checked in'
              }
            </p>
            <button
              onClick={() => setShowQRScanner(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Start QR Scanner
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
