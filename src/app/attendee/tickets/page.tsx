'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ticket, Download, Share2, QrCode, Calendar, MapPin, User, CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface TicketInfo {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  ticketType: string;
  ticketNumber: string;
  purchaseDate: string;
  price: number;
  currency: string;
  status: 'active' | 'used' | 'expired' | 'cancelled';
  qrCode: string;
  benefits: string[];
  transferable: boolean;
  refundable: boolean;
  refundDeadline?: string;
}

interface PaymentInfo {
  id: string;
  method: string;
  last4: string;
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketInfo[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      // Mock data - replace with actual API call
      const mockTickets: TicketInfo[] = [
        {
          id: 'TKT-2024-001234',
          eventId: 'wecon-2024',
          eventName: 'WECON Masawat 2024',
          eventDate: '2024-03-15T09:00:00Z',
          eventLocation: 'Karachi Expo Center, Pakistan',
          ticketType: 'VIP Pass',
          ticketNumber: 'VIP-001234',
          purchaseDate: '2024-02-15T10:30:00Z',
          price: 299,
          currency: 'USD',
          status: 'active',
          qrCode: 'QR_CODE_DATA_HERE',
          benefits: [
            'Access to all sessions',
            'VIP networking lounge',
            'Premium lunch',
            'Welcome gift bag',
            'Priority seating',
            'Meet & greet with speakers'
          ],
          transferable: true,
          refundable: true,
          refundDeadline: '2024-03-01T23:59:59Z'
        },
        {
          id: 'TKT-2024-001235',
          eventId: 'tech-summit-2024',
          eventName: 'Tech Summit 2024',
          eventDate: '2024-04-20T09:00:00Z',
          eventLocation: 'Lahore Convention Center',
          ticketType: 'Standard Pass',
          ticketNumber: 'STD-001235',
          purchaseDate: '2024-03-01T14:20:00Z',
          price: 199,
          currency: 'USD',
          status: 'active',
          qrCode: 'QR_CODE_DATA_HERE_2',
          benefits: [
            'Access to main sessions',
            'Networking breaks',
            'Standard lunch',
            'Digital materials'
          ],
          transferable: false,
          refundable: true,
          refundDeadline: '2024-04-05T23:59:59Z'
        }
      ];

      const mockPayments: PaymentInfo[] = [
        {
          id: 'PAY-001',
          method: 'Credit Card',
          last4: '4242',
          amount: 299,
          currency: 'USD',
          date: '2024-02-15T10:30:00Z',
          status: 'completed'
        },
        {
          id: 'PAY-002',
          method: 'Credit Card',
          last4: '4242',
          amount: 199,
          currency: 'USD',
          date: '2024-03-01T14:20:00Z',
          status: 'completed'
        }
      ];

      setTickets(mockTickets);
      setPaymentHistory(mockPayments);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: TicketInfo['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: TicketInfo['status']) => {
    switch (status) {
      case 'active':
        return CheckCircle;
      case 'used':
        return CheckCircle;
      case 'expired':
        return Clock;
      case 'cancelled':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadTicket = (ticket: TicketInfo) => {
    // In a real app, this would generate and download a PDF ticket
    console.log('Downloading ticket:', ticket.id);
    alert('Ticket download started!');
  };

  const handleShareTicket = async (ticket: TicketInfo) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ticket for ${ticket.eventName}`,
          text: `I'll be attending ${ticket.eventName}!`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Tickets</h1>
          <p className="text-gray-600 dark:text-gray-300">
            View and manage your event tickets
          </p>
        </div>
        <Link href="/events">
          <Button>
            <Ticket className="h-4 w-4 mr-2" />
            Browse Events
          </Button>
        </Link>
      </div>

      {/* Active Tickets */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Tickets</h2>
        {tickets.filter(ticket => ticket.status === 'active').map((ticket, index) => {
          const StatusIcon = getStatusIcon(ticket.status);
          return (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{ticket.eventName}</CardTitle>
                      <div className="space-y-1 text-blue-100">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(ticket.eventDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{ticket.eventLocation}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(ticket.status)} mb-2`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {ticket.status.toUpperCase()}
                      </Badge>
                      <div className="text-blue-100">
                        <div className="text-lg font-semibold">{ticket.ticketType}</div>
                        <div className="text-sm">{ticket.ticketNumber}</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Ticket Benefits</h4>
                      <ul className="space-y-2">
                        {ticket.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Ticket Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ticket ID:</span>
                          <span className="font-mono">{ticket.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Purchase Date:</span>
                          <span>{new Date(ticket.purchaseDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-semibold">{ticket.currency} {ticket.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transferable:</span>
                          <span>{ticket.transferable ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Refundable:</span>
                          <span>{ticket.refundable ? 'Yes' : 'No'}</span>
                        </div>
                        {ticket.refundDeadline && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Refund Deadline:</span>
                            <span>{new Date(ticket.refundDeadline).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                    <Link href="/attendee/qr-code">
                      <Button variant="outline">
                        <QrCode className="h-4 w-4 mr-2" />
                        View QR Code
                      </Button>
                    </Link>
                    <Button variant="outline" onClick={() => handleDownloadTicket(ticket)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Ticket
                    </Button>
                    <Button variant="outline" onClick={() => handleShareTicket(ticket)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    {ticket.transferable && (
                      <Button variant="outline">
                        <User className="h-4 w-4 mr-2" />
                        Transfer Ticket
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>Your ticket purchase history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{payment.method} ending in {payment.last4}</h4>
                    <p className="text-sm text-gray-600">{formatDate(payment.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{payment.currency} {payment.amount}</div>
                  <Badge className={payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {tickets.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No tickets found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You haven't purchased any tickets yet
            </p>
            <Link href="/events">
              <Button>
                Browse Events
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
