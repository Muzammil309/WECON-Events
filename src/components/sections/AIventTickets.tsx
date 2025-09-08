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
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, 0.03, 0.28, 0.98]
      }
    }
  };

  return (
    <section id="tickets" className="section bg-primary-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-surface-primary border border-border-primary rounded-full text-sm font-medium text-text-secondary mb-6">
            Ticket Options
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Choose Your Pass
          </h2>

          <p className="text-lg text-text-secondary leading-relaxed">
            Select the perfect ticket for your needs and gain access to exclusive sessions, workshops, and more.
          </p>
        </motion.div>

        {/* Tickets Grid */}
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
              {/* Popular Badge */}
              {ticket.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-accent-blue to-accent-purple text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`bg-surface-primary border border-border-primary rounded-2xl p-8 h-full transition-all duration-300 hover:bg-surface-secondary hover:border-border-secondary hover:transform hover:scale-105 ${
                ticket.popular ? 'border-accent-blue shadow-xl' : ''
              }`}>
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${ticket.gradient} rounded-2xl flex items-center justify-center text-white mb-6`}>
                  {ticket.icon}
                </div>

                {/* Ticket Name */}
                <h3 className="text-2xl font-bold text-text-primary mb-2">
                  {ticket.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-4xl font-bold text-text-primary">
                    ${ticket.price}
                  </span>
                </div>

                {/* Description */}
                <p className="text-text-muted text-sm mb-6">
                  {ticket.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {ticket.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-text-secondary text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  ticket.popular
                    ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white hover:shadow-lg hover:scale-105'
                    : 'bg-surface-secondary border border-border-primary text-text-primary hover:bg-surface-tertiary hover:border-border-secondary'
                }`}>
                  Buy Ticket
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-surface-primary border border-border-primary rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-text-primary mb-4">
              Group Discounts Available
            </h3>
            <p className="text-text-secondary mb-6">
              Bring your team and save! Contact us for special pricing on groups of 5 or more attendees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-surface-secondary border border-border-primary text-text-primary rounded-lg hover:bg-surface-tertiary transition-colors duration-200">
                Contact Sales
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-lg hover:shadow-lg transition-all duration-200">
                View Group Pricing
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
