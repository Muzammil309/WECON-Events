'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Crown } from 'lucide-react';

export default function ExactAIventTickets() {
  const tickets = [
    {
      name: 'Standard',
      price: '$299',
      description: 'October 1 to 5 - 10:00 AM',
      features: [
        'Access to keynotes and sessions.',
        'Admission to exhibitions and demos.',
        'Networking opportunities.',
        'Digital materials and session recordings.'
      ],
      popular: false,
      icon: <Star className="w-6 h-6" />
    },
    {
      name: 'VIP',
      price: '$699',
      description: 'October 1 to 5 - 10:00 AM',
      features: [
        'All Standard benefits.',
        'VIP lounge access and exclusive events.',
        'Front-row seating and priority workshop access.',
        'VIP swag bag and exclusive content.'
      ],
      popular: true,
      icon: <Crown className="w-6 h-6" />
    },
    {
      name: 'Full Access',
      price: '$1199',
      description: 'October 1 to 5 - 10:00 AM',
      features: [
        'All VIP benefits.',
        'Access to all workshops and breakout sessions.',
        'Personalized session scheduling.',
        'Speaker meet-and-greet and after-party access.'
      ],
      popular: false,
      icon: <Star className="w-6 h-6" />
    }
  ];

  return (
    <section 
      id="section-tickets"
      className="relative py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
      }}
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 mb-6 rounded-full glass-effect border border-white/20"
          >
            <span className="text-indigo-300 text-sm font-medium tracking-wider uppercase">
              Ticket Options
            </span>
          </motion.div>
          
          <h2 className="text-display text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your <span className="gradient-text">Pass</span>
          </h2>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Select the perfect ticket for your needs and gain access to exclusive sessions, workshops, and more.
          </p>
        </motion.div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tickets.map((ticket, index) => (
            <motion.div
              key={index}
              className={`relative group ${ticket.popular ? 'lg:scale-105' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              {/* Popular Badge */}
              {ticket.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`glass-effect p-8 rounded-2xl border h-full transition-all duration-500 ${
                ticket.popular 
                  ? 'border-indigo-400/60 bg-white/10' 
                  : 'border-white/10 group-hover:border-indigo-400/40'
              }`}>
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mb-6">
                  <div className="text-white">
                    {ticket.icon}
                  </div>
                </div>

                {/* Ticket Info */}
                <h3 className="text-2xl font-bold text-white mb-2">{ticket.name}</h3>
                <div className="text-4xl font-bold text-white mb-2">{ticket.price}</div>
                <p className="text-white/60 text-sm mb-6">{ticket.description}</p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {ticket.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  className="w-full btn-primary py-4 rounded-full font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Buy Ticket
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
