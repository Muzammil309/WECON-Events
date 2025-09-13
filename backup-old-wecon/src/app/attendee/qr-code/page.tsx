'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Download, Share2, Smartphone, CheckCircle, Clock, User, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';

interface AttendeeInfo {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  registrationDate: string;
  checkInStatus: 'not_checked_in' | 'checked_in' | 'checked_out';
  lastCheckIn?: string;
  eventAccess: string[];
}

export default function QRCodePage() {
  const [attendeeInfo, setAttendeeInfo] = useState<AttendeeInfo | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendeeInfo();
  }, []);

  const fetchAttendeeInfo = async () => {
    try {
      // Mock data - replace with actual API call
      const mockAttendeeInfo: AttendeeInfo = {
        id: 'ATT-2024-001234',
        name: 'John Doe',
        email: 'john.doe@example.com',
        ticketType: 'VIP Pass',
        registrationDate: '2024-02-15T10:30:00Z',
        checkInStatus: 'checked_in',
        lastCheckIn: '2024-03-15T08:45:00Z',
        eventAccess: ['Main Auditorium', 'VIP Lounge', 'All Workshops', 'Networking Events']
      };

      setAttendeeInfo(mockAttendeeInfo);
      
      // Generate QR code data (in real app, this would be a secure token)
      const qrData = JSON.stringify({
        attendeeId: mockAttendeeInfo.id,
        eventId: 'WECON-2024',
        timestamp: Date.now(),
        checksum: 'abc123' // This would be a real checksum in production
      });
      
      setQrCodeData(qrData);
    } catch (error) {
      console.error('Failed to fetch attendee info:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCodeSVG = (data: string) => {
    // Simple QR code representation - in production, use a proper QR code library
    const size = 200;
    const modules = 25; // QR code grid size
    const moduleSize = size / modules;
    
    // Generate a pattern based on the data (simplified)
    const pattern: boolean[][] = [];
    for (let i = 0; i < modules; i++) {
      pattern[i] = [];
      for (let j = 0; j < modules; j++) {
        // Simple hash-based pattern generation
        const hash = (data.charCodeAt((i * modules + j) % data.length) + i + j) % 2;
        pattern[i][j] = hash === 1;
      }
    }

    return (
      <svg width={size} height={size} className="border rounded-lg">
        {pattern.map((row, i) =>
          row.map((cell, j) => (
            <rect
              key={`${i}-${j}`}
              x={j * moduleSize}
              y={i * moduleSize}
              width={moduleSize}
              height={moduleSize}
              fill={cell ? '#000' : '#fff'}
            />
          ))
        )}
      </svg>
    );
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a proper QR code image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 500;
    
    if (ctx) {
      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 500);
      
      // Add text
      ctx.fillStyle = '#000000';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('WECON Masawat 2024', 200, 40);
      ctx.fillText(attendeeInfo?.name || '', 200, 70);
      ctx.fillText(attendeeInfo?.id || '', 200, 100);
      
      // QR code placeholder
      ctx.fillRect(100, 150, 200, 200);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('QR CODE', 200, 260);
    }
    
    // Download
    const link = document.createElement('a');
    link.download = `wecon-qr-${attendeeInfo?.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My WECON QR Code',
          text: `My QR code for WECON Masawat 2024 - ${attendeeInfo?.name}`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getStatusColor = (status: AttendeeInfo['checkInStatus']) => {
    switch (status) {
      case 'checked_in':
        return 'bg-green-100 text-green-800';
      case 'checked_out':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: AttendeeInfo['checkInStatus']) => {
    switch (status) {
      case 'checked_in':
        return 'Checked In';
      case 'checked_out':
        return 'Checked Out';
      default:
        return 'Not Checked In';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!attendeeInfo) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Unable to load QR code
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please try refreshing the page or contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My QR Code</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Use this QR code for event check-ins and access
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* QR Code Display */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <QrCode className="h-6 w-6" />
              Your Event QR Code
            </CardTitle>
            <CardDescription>
              Present this code at check-in points and session entrances
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              {generateQRCodeSVG(qrCodeData)}
            </motion.div>
            
            <div className="space-y-2">
              <Badge className={getStatusColor(attendeeInfo.checkInStatus)}>
                {getStatusText(attendeeInfo.checkInStatus)}
              </Badge>
              {attendeeInfo.lastCheckIn && (
                <p className="text-sm text-gray-500">
                  Last check-in: {new Date(attendeeInfo.lastCheckIn).toLocaleString()}
                </p>
              )}
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={handleDownload} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleShare} variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Attendee Information */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Attendee Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="font-semibold">{attendeeInfo.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Attendee ID</label>
                  <p className="font-mono text-sm">{attendeeInfo.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm">{attendeeInfo.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ticket Type</label>
                  <Badge variant="secondary">{attendeeInfo.ticketType}</Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Registration Date</label>
                <p className="text-sm">
                  {new Date(attendeeInfo.registrationDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Event Access
              </CardTitle>
              <CardDescription>
                Areas and sessions you have access to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {attendeeInfo.eventAccess.map((access, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{access}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                How to Use
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Event Check-in</h4>
                  <p className="text-sm text-gray-600">Present your QR code at the main entrance for event check-in</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Session Access</h4>
                  <p className="text-sm text-gray-600">Scan at session entrances to confirm attendance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Networking</h4>
                  <p className="text-sm text-gray-600">Share with other attendees to connect quickly</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
