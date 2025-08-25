'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageSection } from '@/components/ui/PageSection';
import { Check, Star, Users, Calendar, MapPin, Clock, Ticket, CreditCard, User, Mail, Phone } from 'lucide-react';

interface TicketTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  description: string;
  features: string[];
  available: number;
  total: number;
  popular?: boolean;
  color: string;
}

interface OrderForm {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  tickets: { [key: string]: number };
}

export default function TicketsPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    tickets: {}
  });

  const ticketTiers: TicketTier[] = [
    {
      id: 'early-bird',
      name: 'Early Bird',
      price: 49,
      originalPrice: 99,
      currency: 'USD',
      description: 'Limited time offer for early supporters',
      features: [
        'Full conference access',
        'Welcome kit',
        'Networking sessions',
        'Digital materials',
        'Certificate of attendance'
      ],
      available: 23,
      total: 100,
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: 'general',
      name: 'General Admission',
      price: 99,
      currency: 'USD',
      description: 'Standard access to all conference activities',
      features: [
        'Full conference access',
        'Welcome kit',
        'Networking sessions',
        'Digital materials',
        'Certificate of attendance',
        'Lunch included',
        'Coffee breaks'
      ],
      available: 156,
      total: 300,
      popular: true,
      color: 'from-indigo-500 to-purple-600',
    },
    {
      id: 'vip',
      name: 'VIP Experience',
      price: 199,
      currency: 'USD',
      description: 'Premium experience with exclusive perks',
      features: [
        'Everything in General',
        'VIP seating area',
        'Exclusive speaker meet & greet',
        'Premium welcome kit',
        'Priority Q&A access',
        'VIP networking dinner',
        'Dedicated support'
      ],
      available: 45,
      total: 50,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'sponsor',
      name: 'Sponsor Pass',
      price: 299,
      currency: 'USD',
      description: 'For sponsors and exhibitors',
      features: [
        'Everything in VIP',
        'Exhibition booth space',
        'Logo on materials',
        'Speaking opportunity',
        'Lead generation tools',
        'Sponsor networking event',
        'Marketing package'
      ],
      available: 12,
      total: 20,
      color: 'from-rose-500 to-pink-600',
    }
  ];

  const eventDetails = {
    name: 'WECON Masawat 2025',
    date: 'March 15-17, 2025',
    location: 'Karachi Expo Center, Pakistan',
    duration: '3 Days'
  };

  const handleTicketSelect = (tierId: string) => {
    setSelectedTier(tierId);
    setOrderForm(prev => ({
      ...prev,
      tickets: { ...prev.tickets, [tierId]: (prev.tickets[tierId] || 0) + 1 }
    }));
  };

  const updateTicketQuantity = (tierId: string, quantity: number) => {
    setOrderForm(prev => ({
      ...prev,
      tickets: { ...prev.tickets, [tierId]: Math.max(0, quantity) }
    }));
  };

  const getTotalAmount = () => {
    return Object.entries(orderForm.tickets).reduce((total, [tierId, quantity]) => {
      const tier = ticketTiers.find(t => t.id === tierId);
      return total + (tier ? tier.price * quantity : 0);
    }, 0);
  };

  const getTotalTickets = () => {
    return Object.values(orderForm.tickets).reduce((total, quantity) => total + quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <PageSection>
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-white/70 px-4 py-2 text-sm backdrop-blur-md mb-4"
            >
              <Ticket className="h-4 w-4" />
              Secure your spot today
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-4">
              Get Your Tickets
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join us for an unforgettable experience at {eventDetails.name}. Choose the perfect ticket for your needs.
            </p>
          </div>

          {/* Event Info */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Calendar, label: 'Date', value: eventDetails.date },
              { icon: MapPin, label: 'Location', value: eventDetails.location },
              { icon: Clock, label: 'Duration', value: eventDetails.duration },
              { icon: Users, label: 'Expected', value: '1,200+ Attendees' }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 rounded-xl bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10"
              >
                <item.icon className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                <p className="font-semibold">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </PageSection>

        {/* Ticket Tiers */}
        <PageSection>
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            {ticketTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl ${
                  tier.popular
                    ? 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 scale-105'
                    : 'border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:scale-105'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      <Star className="h-3 w-3" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <div className="mb-2">
                    {tier.originalPrice && (
                      <span className="text-sm text-gray-500 line-through mr-2">
                        ${tier.originalPrice}
                      </span>
                    )}
                    <span className="text-3xl font-extrabold">${tier.price}</span>
                    <span className="text-gray-500 ml-1">USD</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{tier.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Available</span>
                    <span className="font-medium">{tier.available} / {tier.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${tier.color}`}
                      style={{ width: `${(tier.available / tier.total) * 100}%` }}
                    />
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleTicketSelect(tier.id)}
                  disabled={tier.available === 0}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all ${
                    tier.available === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : `bg-gradient-to-r ${tier.color} text-white hover:shadow-lg hover:scale-105`
                  }`}
                >
                  {tier.available === 0 ? 'Sold Out' : 'Select Ticket'}
                </button>
              </motion.div>
            ))}
          </div>
        </PageSection>

        {/* Order Summary */}
        {getTotalTickets() > 0 && (
          <PageSection>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-black/10 dark:border-white/10 shadow-lg"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                {Object.entries(orderForm.tickets).map(([tierId, quantity]) => {
                  if (quantity === 0) return null;
                  const tier = ticketTiers.find(t => t.id === tierId);
                  if (!tier) return null;

                  return (
                    <div key={tierId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium">{tier.name}</p>
                        <p className="text-sm text-gray-500">${tier.price} each</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateTicketQuantity(tierId, quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{quantity}</span>
                        <button
                          onClick={() => updateTicketQuantity(tierId, quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500"
                        >
                          +
                        </button>
                        <span className="w-20 text-right font-medium">${tier.price * quantity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total ({getTotalTickets()} tickets)</span>
                  <span>${getTotalAmount()}</span>
                </div>
              </div>

              <button
                onClick={() => setShowOrderForm(true)}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Proceed to Checkout
              </button>
            </motion.div>
          </PageSection>
        )}

        {/* Checkout Form Modal */}
        {showOrderForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Complete Your Order</h3>
                <button
                  onClick={() => setShowOrderForm(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  ×
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={orderForm.buyerName}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, buyerName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={orderForm.buyerEmail}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, buyerEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={orderForm.buyerPhone}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, buyerPhone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(orderForm.tickets).map(([tierId, quantity]) => {
                      if (quantity === 0) return null;
                      const tier = ticketTiers.find(t => t.id === tierId);
                      if (!tier) return null;
                      return (
                        <div key={tierId} className="flex justify-between">
                          <span>{tier.name} × {quantity}</span>
                          <span>${tier.price * quantity}</span>
                        </div>
                      );
                    })}
                    <div className="border-t pt-2 font-bold flex justify-between">
                      <span>Total</span>
                      <span>${getTotalAmount()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg"
                  >
                    Complete Order
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* FAQ Section */}
        <PageSection>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 dark:text-gray-300">Everything you need to know about tickets</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: "Can I transfer my ticket to someone else?",
                answer: "Yes, tickets can be transferred up to 48 hours before the event. Contact our support team for assistance."
              },
              {
                question: "What's included in the ticket price?",
                answer: "All tickets include access to sessions, networking areas, welcome kit, and digital materials. VIP tickets include additional perks."
              },
              {
                question: "Is there a refund policy?",
                answer: "Full refunds are available up to 30 days before the event. After that, tickets can be transferred but not refunded."
              },
              {
                question: "Do I need to print my ticket?",
                answer: "No, you can show your QR code on your mobile device. We'll send you a digital ticket after purchase."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10"
              >
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </PageSection>
      </div>
    </div>
  );
}
