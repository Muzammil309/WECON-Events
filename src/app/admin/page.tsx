'use client';
import { useState, useEffect } from 'react';
import EnterpriseAdminDashboard from '@/components/features/EnterpriseAdminDashboard';

export default function AdminDashboard() {
  const [userRole, setUserRole] = useState('ADMIN');
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
      setUserId('demo-admin-1');
      setUserName('Admin User');
      setUserRole('SUPER_ADMIN');
      setUserAvatar('');
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // Fallback for demo purposes
      setUserId('demo-admin-1');
      setUserName('Admin User');
      setUserRole('ADMIN');
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
    <EnterpriseAdminDashboard
      userId={userId}
      userName={userName}
      userAvatar={userAvatar}
      userRole={userRole}
    />
  );
}
