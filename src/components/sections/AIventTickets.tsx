'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Crown, Zap, GraduationCap, Monitor } from 'lucide-react';

interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  gradient: string;
}

const ticketTiers: TicketTier[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: 299,
    description: 'October 1 to 5 - 10:00 AM',
    features: [
      'Access to keynotes and sessions.',
      'Admission to exhibitions and demos.',
      'Networking opportunities.',
      'Digital materials and session recordings.'
    ],
    icon: <Star className="w-6 h-6" />,
    gradient: 'from-gray-500 to-gray-600'
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 699,
    description: 'October 1 to 5 - 10:00 AM',
    features: [
      'All Standard benefits.',
      'VIP lounge access and exclusive events.',
      'Front-row seating and priority workshop access.',
      'VIP swag bag and exclusive content.'
    ],
    popular: true,
    icon: <Zap className="w-6 h-6" />,
    gradient: 'from-accent-blue to-accent-purple'
  },
  {
    id: 'full-access',
    name: 'Full Access',
    price: 1199,
    description: 'October 1 to 5 - 10:00 AM',
    features: [
      'All VIP benefits.',
      'Access to all workshops and breakout sessions.',
      'Personalized session scheduling.',
      'Speaker meet-and-greet and after-party access.'
    ],
    icon: <Crown className="w-6 h-6" />,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'exclusive',
    name: 'Exclusive Access',
    price: 2499,
    description: 'October 1 to 5 - 10:00 AM',
    features: [
      'All Full Access Pass benefits.',
      'Private one-on-one sessions with speakers.',
      'Priority access to all events and workshops.',
      'Exclusive VIP gala and after-party invitations.'
    ],
    icon: <Crown className="w-6 h-6" />,
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'student',
    name: 'Student',
    price: 149,
    description: 'October 1 to 5 - 10:00 AM',
    features: [
      'Access to keynotes and workshops.',
      'Student-specific networking events.',
      'Discounted online resources post-event.',
      'Special student meetups for networking.'
    ],
    icon: <GraduationCap className="w-6 h-6" />,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'virtual',
    name: 'Virtual',
    price: 99,
    description: 'October 1 to 5 - 10:00 AM',
    features: [
      'Live-streamed keynotes and workshops.',
      'On-demand access to recorded sessions.',
      'Interactive Q&A with speakers.',
      'Virtual networking and digital swag.'
    ],
    icon: <Monitor className="w-6 h-6" />,
    gradient: 'from-cyan-500 to-blue-500'
  }
];

export default function AIventTickets() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.03, 0.28, 0.98]
      }
    }
  };

  return (
    <section
      id="tickets"
      className="relative py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0F0B1F 0%, #1A1B3A 50%, #0F0B1F 100%)',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Complex Background Pattern - Exact AIvent Style */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px),
              linear-gradient(180deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-32 left-32 w-20 h-20 border border-white/10 rotate-12"
          animate={{
            rotate: [12, 102, 12],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
            backdropFilter: 'blur(10px)'
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 right-1/5 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/5 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header - Exact AIvent Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div
            className="inline-flex items-center px-5 py-2 rounded-full text-sm font-medium mb-8"
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              color: '#A5B4FC'
            }}
          >
            Ticket Options
          </div>

          <h2
            className="text-white font-black mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Choose Your{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Pass
            </span>
          </h2>

          <p
            className="text-white/80 leading-relaxed"
            style={{
              fontSize: '18px',
              lineHeight: 1.7,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Select the perfect ticket for your needs and gain access to exclusive sessions, workshops, and more.
          </p>
        </motion.div>

        {/* Tickets Grid - Exact AIvent Style */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {ticketTiers.map((ticket) => (
            <motion.div
              key={ticket.id}
              variants={itemVariants}
              className="relative group"
            >
              {/* Popular Badge - Exact AIvent Style */}
              {ticket.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div
                    className="text-white px-4 py-2 rounded-full text-sm font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                      boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    Most Popular
                  </div>
                </div>
              )}

              <motion.div
                className={`p-8 h-full rounded-2xl transition-all duration-500 hover:scale-105 cursor-pointer ${
                  ticket.popular ? 'ring-2 ring-blue-400/50' : ''
                }`}
                style={{
                  background: ticket.popular
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: ticket.popular
                    ? '1px solid rgba(99, 102, 241, 0.3)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: ticket.popular
                    ? '0 12px 40px rgba(99, 102, 241, 0.2)'
                    : '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
                whileHover={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(99, 102, 241, 0.4)',
                  boxShadow: '0 16px 48px rgba(99, 102, 241, 0.3)'
                }}
              >
                {/* Icon - Exact AIvent Style */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${ticket.gradient.includes('gray') ? '#6B7280, #4B5563' : ticket.gradient.includes('cyan') ? '#06B6D4, #3B82F6' : '#6366F1, #8B5CF6'})`,
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  {ticket.icon}
                </div>

                {/* Ticket Name - Exact AIvent Style */}
                <h3
                  className="text-white font-bold mb-2"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: 1.3
                  }}
                >
                  {ticket.name}
                </h3>

                {/* Price - Exact AIvent Style */}
                <div className="mb-4">
                  <span
                    className="text-white font-black"
                    style={{
                      fontSize: '40px',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 900
                    }}
                  >
                    ${ticket.price}
                  </span>
                </div>

                {/* Description - Exact AIvent Style */}
                <p
                  className="text-white/70 mb-6"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    lineHeight: 1.5
                  }}
                >
                  {ticket.description}
                </p>

                {/* Features - Exact AIvent Style */}
                <ul className="space-y-3 mb-8">
                  {ticket.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                        }}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span
                        className="text-white/80 leading-relaxed"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
                          lineHeight: 1.6
                        }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button - Exact AIvent Style */}
                <motion.button
                  className="w-full px-6 py-4 rounded-xl font-bold transition-all duration-300"
                  style={{
                    fontSize: '14px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    background: ticket.popular
                      ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: ticket.popular
                      ? 'none'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: ticket.popular
                      ? '0 8px 24px rgba(99, 102, 241, 0.3)'
                      : 'none'
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: ticket.popular
                      ? '0 12px 32px rgba(99, 102, 241, 0.4)'
                      : '0 4px 16px rgba(255, 255, 255, 0.1)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Buy Ticket
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info - Exact AIvent Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-20"
        >
          <div
            className="p-8 rounded-2xl max-w-2xl mx-auto"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h3
              className="text-white font-bold mb-4"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: 1.3
              }}
            >
              Group Discounts Available
            </h3>
            <p
              className="text-white/80 mb-6"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                lineHeight: 1.6
              }}
            >
              Bring your team and save! Contact us for special pricing on groups of 5 or more attendees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-6 py-3 text-white font-bold rounded-xl transition-all duration-300"
                style={{
                  fontSize: '14px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                whileHover={{
                  scale: 1.05,
                  background: 'rgba(255, 255, 255, 0.15)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Sales
              </motion.button>
              <motion.button
                className="px-6 py-3 text-white font-bold rounded-xl transition-all duration-300"
                style={{
                  fontSize: '14px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 12px 32px rgba(99, 102, 241, 0.4)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                View Group Pricing
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
