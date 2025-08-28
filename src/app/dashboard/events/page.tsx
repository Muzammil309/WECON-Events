'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EventManager from '@/components/features/EventManager';

export default function EventsPage() {
  const [userRole, setUserRole] = useState('ADMIN');
  const [userName, setUserName] = useState('John Doe');
  const [userId, setUserId] = useState('user-1');

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      // This would fetch actual user info from JWT or API
      // For now using mock data
      setUserRole('ADMIN');
      setUserName('John Doe');
      setUserId('user-1');
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  return (
    <DashboardLayout userRole={userRole} userName={userName}>
      <EventManager userRole={userRole} userId={userId} />
    </DashboardLayout>
  );
}
