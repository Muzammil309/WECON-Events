'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TaskBoard from '@/components/features/TaskBoard';

export default function TasksPage() {
  const [userRole, setUserRole] = useState('ADMIN');
  const [userName, setUserName] = useState('John Doe');
  const [userId, setUserId] = useState('user-1');
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchUserInfo();
    fetchEvents();
  }, []);

  const fetchUserInfo = async () => {
    try {
      // This would fetch actual user info from JWT or API
      setUserRole('ADMIN');
      setUserName('John Doe');
      setUserId('user-1');
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
        if (data.events && data.events.length > 0) {
          setSelectedEventId(data.events[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  return (
    <DashboardLayout userRole={userRole} userName={userName}>
      <div className="space-y-6">
        {/* Event Selection */}
        {events.length > 1 && (
          <div className="flex items-center gap-4">
            <label htmlFor="event-select" className="text-sm font-medium">
              Event:
            </label>
            <select
              id="event-select"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Task Board */}
        {selectedEventId && (
          <TaskBoard 
            eventId={selectedEventId}
            userRole={userRole}
            userId={userId}
          />
        )}

        {!selectedEventId && events.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              Create an event first to start managing tasks.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
