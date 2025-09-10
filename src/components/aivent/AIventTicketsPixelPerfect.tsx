'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Crown, Zap } from 'lucide-react';

export default function AIventTicketsPixelPerfect() {
  const [selectedPlan, setSelectedPlan] = useState('vip');

  const ticketPlans = [
    {
      id: 'early-bird',
      name: 'Early Bird',
      price: 299,
      originalPrice: 399,
      icon: <Zap className="w-8 h-8" />,
      popular: false,
      description: 'Perfect for students and early adopters',
      features: [
        'Access to all sessions',
        'Digital conference materials',
        'Networking opportunities',
        'Welcome kit',
        'Coffee breaks included',
        'Certificate of attendance'
      ],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'vip',
      name: 'VIP Experience',
      price: 599,
      originalPrice: 799,
      icon: <Crown className="w-8 h-8" />,
      popular: true,
      description: 'The ultimate AI Summit experience',
      features: [
        'All Early Bird features',
        'VIP seating in front rows',
        'Exclusive speaker meet & greet',
        'Premium welcome kit',
        'VIP networking dinner',
        'Priority Q&A access',
        'Exclusive workshops',
        'One-on-one mentoring session'
      ],
      color: 'from-purple-500 to-pink-500',
      bgColor: 'rgba(168, 85, 247, 0.1)',
      borderColor: 'border-purple-500/30'
    },
    {
      id: 'premium',
      name: 'Premium Access',
      price: 999,
      originalPrice: 1299,
      icon: <Star className="w-8 h-8" />,
      popular: false,
      description: 'For professionals and enterprises',
      features: [
        'All VIP features',
        'Private executive lounge access',
        'Dedicated concierge service',
        'Premium gift package',
        'Exclusive after-party invitation',
        'Video recordings of all sessions',
        'Priority booking for next year',
        'Custom networking introductions',
        'Private meeting rooms access'
      ],
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'border-yellow-500/30'
    }
  ];

  return (
    <section 
      id="section-tickets"
      className="relative py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0F0B1F 0%, #101435 50%, #1A1C26 100%)',
        fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(118, 77, 240, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)
            `
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block px-6 py-2 mb-6 rounded-full border border-purple-500/30"
            style={{
              background: 'rgba(118, 77, 240, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <span className="text-purple-300 text-sm font-medium tracking-wider uppercase">
              Secure Your Spot
            </span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Choose Your
            <br />
            <span 
              className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Experience
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join the most influential AI event of 2025. Select the perfect ticket 
            that matches your goals and networking needs.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {ticketPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`relative group cursor-pointer ${
                plan.popular ? 'lg:scale-105 lg:-mt-4' : ''
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div
                    className="px-6 py-2 rounded-full text-white font-bold text-sm"
                    style={{
                      background: 'linear-gradient(135deg, #764DF0 0%, #E879F9 100%)',
                      boxShadow: '0 8px 25px rgba(118, 77, 240, 0.4)'
                    }}
                  >
                    Most Popular
                  </div>
                </motion.div>
              )}

              <div
                className={`relative h-full p-8 rounded-3xl border transition-all duration-500 ${
                  selectedPlan === plan.id 
                    ? 'border-purple-400/60 shadow-2xl' 
                    : plan.borderColor
                } ${plan.popular ? 'border-purple-500/50' : ''}`}
                style={{
                  background: selectedPlan === plan.id 
                    ? 'rgba(118, 77, 240, 0.15)' 
                    : plan.bgColor,
                  backdropFilter: 'blur(20px)'
                }}
              >
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-r ${plan.color}`}
                  >
                    <div className="text-white">
                      {plan.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mb-2">
                    {plan.name}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-6">
                    {plan.description}
                  </p>
                  
                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <span className="text-4xl font-black text-white">
                        ${plan.price}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        ${plan.originalPrice}
                      </span>
                    </div>
                    <div className="text-sm text-purple-400 font-medium">
                      Save ${plan.originalPrice - plan.price}
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: featureIndex * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-r ${plan.color}`}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-300 text-sm">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    selectedPlan === plan.id
                      ? 'text-white'
                      : 'text-white hover:text-white'
                  }`}
                  style={{
                    background: selectedPlan === plan.id
                      ? `linear-gradient(135deg, #764DF0 0%, #E879F9 100%)`
                      : `linear-gradient(135deg, ${plan.color.split(' ')[1]} 0%, ${plan.color.split(' ')[3]} 100%)`,
                    boxShadow: selectedPlan === plan.id
                      ? '0 15px 40px rgba(118, 77, 240, 0.4)'
                      : '0 10px 30px rgba(0, 0, 0, 0.2)'
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 20px 50px rgba(118, 77, 240, 0.5)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </motion.button>

                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${plan.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Money Back Guarantee</h4>
              <p className="text-gray-400 text-sm">
                Not satisfied? Get a full refund within 30 days.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Secure Payment</h4>
              <p className="text-gray-400 text-sm">
                Your payment information is encrypted and secure.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Instant Access</h4>
              <p className="text-gray-400 text-sm">
                Get your tickets and materials immediately after purchase.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
