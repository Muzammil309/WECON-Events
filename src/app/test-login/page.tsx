'use client';
import { useState } from 'react';

export default function TestLoginPage() {
  const [email, setEmail] = useState('admin@wecon-masawat.com');
  const [password, setPassword] = useState('admin123');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testLogin = async () => {
    setIsLoading(true);
    setResult('Testing login...');

    try {
      console.log('🔍 Testing login with:', { email, password: '***' });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📦 Response data:', data);

      if (response.ok && data.ok) {
        setResult(`✅ LOGIN SUCCESS!\n\nUser: ${data.user.name}\nEmail: ${data.user.email}\nRole: ${data.user.role}\n\nRedirecting to admin dashboard...`);
        
        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = '/admin';
        }, 2000);
      } else {
        setResult(`❌ LOGIN FAILED\n\nStatus: ${response.status}\nError: ${data.error || 'Unknown error'}\n\nFull response:\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error: any) {
      console.error('🚨 Login error:', error);
      setResult(`🚨 NETWORK ERROR\n\nError: ${error.message}\n\nThis indicates a connection problem.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">🔍 Login Test</h1>
        <p className="text-gray-600 text-center mb-6">
          This page tests the login functionality to identify any issues.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={testLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '🔄 Testing...' : '🚀 Test Login'}
          </button>
        </div>
        
        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <a href="/login" className="text-blue-600 hover:underline">
            ← Back to Main Login
          </a>
        </div>
      </div>
    </div>
  );
}
