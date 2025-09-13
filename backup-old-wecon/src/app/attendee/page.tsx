'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, Map, MessageSquare, QrCode, Star, Clock, CheckCircle, MapPin, Bell } from 'lucide-react';

export default function AttendeeOverview() {
  const [attendeeData, setAttendeeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendeeData();
  }, []);

  const fetchAttendeeData = async () => {
    try {
      const response = await fetch('/api/attendee/dashboard');
      if (response.ok) {
        const data = await response.json();
        setAttendeeData(data);
      } else {
        // Fallback demo data
        setAttendeeData({
          userName: 'Demo Attendee',
          userId: 'demo-attendee-1',
          upcomingSessions: [
            { id: 1, title: 'AI in Healthcare', time: '10:00 AM', location: 'Main Hall', speaker: 'Dr. Sarah Johnson' },
            { id: 2, title: 'Future of Work', time: '2:00 PM', location: 'Conference Room A', speaker: 'Mike Chen' },
            { id: 3, title: 'Networking Lunch', time: '12:30 PM', location: 'Exhibition Hall', speaker: 'Multiple Speakers' }
          ],
          recentMessages: [
            { id: 1, from: 'Event Organizer', message: 'Welcome to WECON Masawat 2025!', time: '9:00 AM' },
            { id: 2, from: 'Sarah Johnson', message: 'Looking forward to connecting!', time: '8:45 AM' },
            { id: 3, from: 'Tech Solutions Inc.', message: 'Visit our booth A-101 for demos', time: '8:30 AM' }
          ],
          networkingConnections: 12,
          sessionsAttended: 3,
          totalSessions: 8,
          feedbackSubmitted: 2,
          qrScans: 15,
          eventProgress: 65
        });
      }
    } catch (error) {
      console.error('Failed to fetch attendee data:', error);
    } finally {
      setLoading(false);
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
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome to WECON Masawat 2025!</h1>
            <p className="text-blue-100 mt-1">Hello, {attendeeData?.userName || 'Attendee'}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Event Day 1 - Saturday, August 30, 2025
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Status: Checked In
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              View Schedule
            </button>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Network
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sessions Attended</p>
              <p className="text-2xl font-bold text-gray-900">{attendeeData?.sessionsAttended}/{attendeeData?.totalSessions}</p>
              <p className="text-xs text-blue-600 mt-1">{Math.round((attendeeData?.sessionsAttended / attendeeData?.totalSessions) * 100)}% complete</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Network Connections</p>
              <p className="text-2xl font-bold text-gray-900">{attendeeData?.networkingConnections}</p>
              <p className="text-xs text-green-600 mt-1">+3 today</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">QR Scans</p>
              <p className="text-2xl font-bold text-gray-900">{attendeeData?.qrScans}</p>
              <p className="text-xs text-purple-600 mt-1">Booth visits & check-ins</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <QrCode className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Feedback Given</p>
              <p className="text-2xl font-bold text-gray-900">{attendeeData?.feedbackSubmitted}</p>
              <p className="text-xs text-orange-600 mt-1">Help improve events</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Star className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
            <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors">
              Smart Recommendations
            </button>
          </div>
          <div className="space-y-4">
            {attendeeData?.upcomingSessions?.map((session: any) => (
              <div key={session.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{session.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">by {session.speaker}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {session.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {session.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
            View Full Schedule →
          </button>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
          <div className="space-y-4">
            {attendeeData?.recentMessages?.map((message: any) => (
              <div key={message.id} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{message.from}</h4>
                    <span className="text-xs text-gray-500">{message.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All Messages →
          </button>
        </div>

        {/* Staff Assistance Hub */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Staff Assistance</h3>
            <span className="flex items-center gap-1 text-xs text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              12 staff online
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">Registration Help</h4>
                <p className="text-xs text-gray-600">Sarah Johnson - Main Lobby</p>
              </div>
              <button className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200">
                Contact
              </button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">Technical Support</h4>
                <p className="text-xs text-gray-600">Mike Chen - IT Desk</p>
              </div>
              <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200">
                Contact
              </button>
            </div>
            <button className="w-full mt-3 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <Bell className="h-4 w-4" />
              Report Issue
            </button>
          </div>
        </div>
      </div>

      {/* Event Progress */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Event Progress</h3>
          <span className="text-sm text-gray-600">{attendeeData?.eventProgress}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${attendeeData?.eventProgress}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
          <span>Keep exploring sessions and networking!</span>
          <span className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            On track
          </span>
        </div>
      </div>
    </div>
  );
}
