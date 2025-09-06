'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Wifi, WifiOff, Play, Clock, MapPin } from 'lucide-react';

interface SignageDisplay {
  id: string;
  name: string;
  location?: string;
  status: 'ONLINE' | 'OFFLINE' | 'ERROR';
  currentContent?: {
    id: string;
    name: string;
    type: 'IMAGE' | 'VIDEO' | 'TEXT';
    url?: string;
    contentText?: string;
    duration: number;
  };
  playlist?: {
    id: string;
    name: string;
    items: Array<{
      content: {
        id: string;
        name: string;
        type: 'IMAGE' | 'VIDEO' | 'TEXT';
        url?: string;
        contentText?: string;
        duration: number;
      };
    }>;
  };
}

export default function SignagePage() {
  const [displays, setDisplays] = useState<SignageDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchDisplays();
    // Set up real-time updates
    const interval = setInterval(fetchDisplays, 30000); // Refresh every 30 seconds
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  const fetchDisplays = async () => {
    try {
      const response = await fetch('/api/signage/displays');
      if (response.ok) {
        const data = await response.json();
        setDisplays(data.displays || []);
      }
    } catch (error) {
      console.error('Failed to fetch displays:', error);
      // Fallback data for demo
      setDisplays([
        {
          id: '1',
          name: 'Main Lobby Display',
          location: 'Main Entrance',
          status: 'ONLINE',
          currentContent: {
            id: 'welcome',
            name: 'Welcome Message',
            type: 'TEXT',
            contentText: 'Welcome to WECON Masawat 2024!\n\nJoin us for an amazing conference experience.\n\n🎯 Innovation • 🤝 Networking • 🚀 Growth',
            duration: 10
          }
        },
        {
          id: '2',
          name: 'Conference Hall A',
          location: 'Hall A Entrance',
          status: 'ONLINE',
          currentContent: {
            id: 'schedule',
            name: 'Today\'s Schedule',
            type: 'TEXT',
            contentText: '📅 Today\'s Agenda\n\n🕘 9:00 AM - Opening Keynote\n🕘 10:30 AM - Tech Innovation Panel\n🕘 12:00 PM - Networking Lunch\n🕘 1:30 PM - Workshops\n🕘 3:00 PM - Startup Showcase\n🕘 4:30 PM - Closing Ceremony',
            duration: 15
          }
        },
        {
          id: '3',
          name: 'Exhibition Area',
          location: 'Exhibition Hall',
          status: 'ONLINE',
          currentContent: {
            id: 'sponsors',
            name: 'Sponsor Showcase',
            type: 'TEXT',
            contentText: '🏢 Our Amazing Sponsors\n\n💎 Platinum: TechCorp, InnovateLab\n🥇 Gold: StartupHub, DevTools Inc\n🥈 Silver: CloudSoft, DataFlow\n\nThank you for making WECON possible!',
            duration: 12
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (content: SignageDisplay['currentContent']) => {
    if (!content) return null;

    switch (content.type) {
      case 'TEXT':
        return (
          <div className="h-full flex items-center justify-center p-6 sm:p-8">
            <div className="text-center max-w-4xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">{content.name}</h2>
              <div className="text-lg sm:text-xl lg:text-2xl text-gray-200 whitespace-pre-line leading-relaxed">
                {content.contentText}
              </div>
            </div>
          </div>
        );
      case 'IMAGE':
        return (
          <div className="h-full flex items-center justify-center p-4">
            <img
              src={content.url}
              alt={content.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        );
      case 'VIDEO':
        return (
          <div className="h-full">
            <video
              src={content.url}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-400 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">Loading digital signage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Monitor className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">WECON Digital Signage</h1>
              <p className="text-sm text-gray-300 hidden sm:block">Live Event Information</p>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Live Updates
            </div>
            <div className="text-sm sm:text-base text-gray-300 font-mono">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">
              {displays.filter(d => d.status === 'ONLINE').length}/{displays.length} online
            </div>
          </div>
        </div>
      </div>

      {/* Display Grid */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {displays.map((display, index) => (
            <motion.div
              key={display.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-black/40 backdrop-blur-sm rounded-xl border-2 overflow-hidden ${
                display.status === 'ONLINE' ? 'border-green-400/50 shadow-lg shadow-green-400/20' :
                display.status === 'ERROR' ? 'border-red-400/50 shadow-lg shadow-red-400/20' :
                'border-gray-600/50'
              }`}
            >
              {/* Display Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{display.name}</h3>
                    {display.location && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <p className="text-sm text-gray-400 truncate">{display.location}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {display.status === 'ONLINE' ? (
                      <Wifi className="h-4 w-4 text-green-400" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-red-400" />
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      display.status === 'ONLINE' ? 'bg-green-400/20 text-green-300' :
                      display.status === 'ERROR' ? 'bg-red-400/20 text-red-300' :
                      'bg-gray-400/20 text-gray-300'
                    }`}>
                      {display.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Display Content */}
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative">
                {display.status === 'ONLINE' && display.currentContent ? (
                  <>
                    {renderContent(display.currentContent)}
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{display.currentContent.name} • {display.currentContent.duration}s</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Monitor className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm font-medium">
                        {display.status === 'OFFLINE' ? 'Display Offline' : 'No Content'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Playlist Info */}
              {display.playlist && (
                <div className="p-3 bg-black/20 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Play className="h-3 w-3 text-blue-400" />
                    <span className="truncate">Playlist: {display.playlist.name}</span>
                    <span className="text-gray-500 text-xs">({display.playlist.items.length})</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {displays.length === 0 && (
          <div className="text-center py-16">
            <Monitor className="h-20 w-20 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-400 mb-3">No Displays Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Digital signage displays will appear here when configured by administrators.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
