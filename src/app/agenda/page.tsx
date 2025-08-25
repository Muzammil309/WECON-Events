'use client';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { mockSessions, type Session } from '@/data/agenda';
import { PageSection } from '@/components/ui/PageSection';
import { Calendar, Clock, MapPin, Users, Filter, Grid, List, Search, Star, Download, Share2 } from 'lucide-react';

type ViewMode = 'list' | 'grid' | 'timeline';

export default function AgendaPage() {
  const [day, setDay] = useState('All');
  const [track, setTrack] = useState('All');
  const [room, setRoom] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const days = useMemo(() => ['All', ...Array.from(new Set(mockSessions.map(s => s.day)))], []);
  const tracks = useMemo(() => ['All', ...Array.from(new Set((mockSessions.map(s => s.track).filter(Boolean) as string[])))], []);
  const rooms = useMemo(() => ['All', ...Array.from(new Set((mockSessions.map(s => s.room).filter(Boolean) as string[])))], []);

  const filtered = useMemo(() => {
    return mockSessions.filter(s => {
      const matchesDay = day === 'All' || s.day === day;
      const matchesTrack = track === 'All' || s.track === track;
      const matchesRoom = room === 'All' || s.room === room;
      const matchesSearch = searchQuery === '' ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.abstract?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.speakers.some(speaker => speaker.name.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesDay && matchesTrack && matchesRoom && matchesSearch;
    });
  }, [day, track, room, searchQuery]);

  const toggleFavorite = (sessionId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(sessionId)) {
        newFavorites.delete(sessionId);
      } else {
        newFavorites.add(sessionId);
      }
      return newFavorites;
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const SessionCard = ({ session, index }: { session: Session; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">
              {session.track || 'General'}
            </span>
            {session.room && (
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                {session.room}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            {session.title}
          </h3>
          {session.abstract && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {session.abstract}
            </p>
          )}
        </div>
        <button
          onClick={() => toggleFavorite(session.id)}
          className={`p-2 rounded-full transition-colors ${
            favorites.has(session.id)
              ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
              : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
          }`}
        >
          <Star className={`h-4 w-4 ${favorites.has(session.id) ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{formatTime(session.startAt)} - {formatTime(session.endAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{session.day}</span>
        </div>
        {session.room && (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{session.room}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {session.speakers.map(s => s.name).join(', ')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <Share2 className="h-4 w-4" />
          </button>
          <button className="px-3 py-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors">
            Add to Calendar
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <PageSection>
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-white/70 px-4 py-2 text-sm backdrop-blur-md mb-4"
            >
              <Calendar className="h-4 w-4" />
              Conference Schedule
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-4">
              Event Agenda
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover amazing sessions, workshops, and networking opportunities across multiple tracks and days.
            </p>
          </div>
        </PageSection>

        {/* Filters and Controls */}
        <PageSection>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sessions, speakers, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
                </div>

                <select
                  className="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={day}
                  onChange={e => setDay(e.target.value)}
                >
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <select
                  className="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={track}
                  onChange={e => setTrack(e.target.value)}
                >
                  {tracks.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <select
                  className="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={room}
                  onChange={e => setRoom(e.target.value)}
                >
                  {rooms.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                {favorites.size > 0 && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-3 py-2 text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                  >
                    My Favorites ({favorites.size})
                  </button>
                )}
              </div>

              {/* View Mode Controls */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  {[
                    { mode: 'list' as ViewMode, icon: List, label: 'List' },
                    { mode: 'grid' as ViewMode, icon: Grid, label: 'Grid' },
                  ].map(({ mode, icon: Icon, label }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm transition-colors ${
                        viewMode === mode
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>

                <button className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Showing {filtered.length} of {mockSessions.length} sessions
                {searchQuery && ` for "${searchQuery}"`}
                {day !== 'All' && ` on ${day}`}
                {track !== 'All' && ` in ${track} track`}
                {room !== 'All' && ` in ${room}`}
              </p>
            </div>
          </div>
        </PageSection>

        {/* Sessions Display */}
        <PageSection>
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No sessions found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your filters or search terms to find more sessions.
              </p>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filtered.map((session, index) => (
                <SessionCard key={session.id} session={session} index={index} />
              ))}
            </div>
          )}
        </PageSection>
      </div>
    </div>
  );
}
