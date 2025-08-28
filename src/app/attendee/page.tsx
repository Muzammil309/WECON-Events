'use client';

import { useState, useEffect } from 'react';
import AttendeeDashboard from '@/components/features/AttendeeDashboard';

export default function AttendeeDashboardPage() {
  const [userRole, setUserRole] = useState('ATTENDEE');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      // Fetch user info from profile API
      const response = await fetch('/api/attendees/profile');
      if (response.ok) {
        const data = await response.json();
        const profile = data.profile;

        setUserId(profile.user.id);
        setUserName(profile.user.name);
        setUserAvatar(profile.user.avatarUrl);
        setUserRole('ATTENDEE');
      } else {
        // Fallback for demo purposes
        setUserId('attendee-1');
        setUserName('Demo Attendee');
        setUserRole('ATTENDEE');
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // Fallback for demo purposes
      setUserId('attendee-1');
      setUserName('Demo Attendee');
      setUserRole('ATTENDEE');
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
    <AttendeeDashboard
      userId={userId}
      userName={userName}
      userAvatar={userAvatar}
    />
  );
}
