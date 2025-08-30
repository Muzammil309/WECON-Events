'use client';

import { useState, useEffect } from 'react';
import AttendeeDashboard from '@/components/features/AttendeeDashboardNew';

export default function AttendeeDashboardPage() {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      // For demo purposes, use fallback data immediately
      // In production, this would fetch from JWT token or session
      setUserId('demo-attendee-1');
      setUserName('Demo Attendee');
      setUserAvatar('');
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // Fallback for demo purposes
      setUserId('demo-attendee-1');
      setUserName('Demo Attendee');
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
