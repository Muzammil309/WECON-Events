'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Check, Star, Zap, Crown, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PricingTier } from '@/types'

const pricingTiers: PricingTier[] = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    price: 299,
    originalPrice: 399,
    description: 'Perfect for students and individual developers',
    buttonText: 'Get Early Bird',
    features: [
      'Access to all sessions',
      'Digital conference materials',
      'Basic networking opportunities',
      'Live streaming access',
      'Q&A participation',
      'Certificate of attendance'
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 599,
    originalPrice: 799,
    popular: true,
    description: 'Ideal for professionals and small teams',
    buttonText: 'Choose Standard',
    features: [
      'Everything in Early Bird',
      'Priority seating',
      'Workshop materials included',
      'Networking lunch access',
      'Speaker meet & greet',
      'Premium swag bag',
      'Recording access (30 days)',
      'Community Discord access'
    ]
  },
  {
    id: 'vip',
    name: 'VIP Experience',
    price: 1299,
    originalPrice: 1599,
    description: 'Ultimate experience for executives and enterprises',
    buttonText: 'Go VIP',
    features: [
      'Everything in Standard',
      'VIP lounge access',
      'Private dinner with speakers',
      'One-on-one mentoring session',
      'Exclusive workshop access',
      'Premium accommodation',
      'Airport transfer included',
      'Lifetime recording access',
      'Priority support',
      'Custom networking introductions'
    ]
  }
]

export default function Pricing() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const getIcon = (tierId: string) => {
    switch (tierId) {
      case 'early-bird':
        return Ticket
      case 'standard':
        return Zap
      case 'vip':
        return Crown
      default:
        return Star
    }
  }

  const getGradient = (tierId: string) => {
    switch (tierId) {
      case 'early-bird':
        return 'from-blue-500 to-cyan-500'
      case 'standard':
        return 'from-purple-500 to-indigo-500'
      case 'vip':
        return 'from-yellow-500 to-orange-500'
      default:
        return 'from-gray-500 to-slate-500'
    }
  }

  return (
    <section id="pricing" className="section-padding relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="container-custom relative z-10"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-white/20 mb-6"
          >
            <Ticket className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Event Tickets</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            Choose Your{' '}
            <span className="aivent-text-gradient">Experience</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Select the perfect ticket tier for your needs. All tickets include access 
            to world-class content and networking opportunities.
          </p>
          
          {/* Early Bird Notice */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="inline-flex items-center gap-2 mt-8 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full"
          >
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-orange-300">
              Early Bird pricing ends in 15 days!
            </span>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => {
            const Icon = getIcon(tier.id)
            const gradientClass = getGradient(tier.id)
            
            return (
              <motion.div
                key={tier.id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative ${tier.popular ? 'md:-mt-4' : ''}`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -10 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </div>
                  </motion.div>
                )}

                <Card className={`glass-effect border-white/10 hover:border-purple-500/50 transition-all duration-300 h-full ${
                  tier.popular ? 'border-purple-500/30 shadow-2xl shadow-purple-500/20' : ''
                }`}>
                  <CardHeader className="text-center pb-8">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 bg-gradient-to-r ${gradientClass} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <CardTitle className="text-2xl font-bold text-white mb-2">
                      {tier.name}
                    </CardTitle>
                    
                    <p className="text-gray-400 mb-6">
                      {tier.description}
                    </p>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-4xl font-bold aivent-text-gradient">
                          ${tier.price}
                        </span>
                        {tier.originalPrice && (
                          <span className="text-lg text-gray-500 line-through">
                            ${tier.originalPrice}
                          </span>
                        )}
                      </div>
                      {tier.originalPrice && (
                        <div className="text-sm text-green-400 font-medium">
                          Save ${tier.originalPrice - tier.price}!
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Features List */}
                    <ul className="space-y-3">
                      {tier.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ x: -20, opacity: 0 }}
                          animate={inView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 + featureIndex * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <div className={`w-5 h-5 bg-gradient-to-r ${gradientClass} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-300 text-sm leading-relaxed">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={tier.popular ? "aivent" : "outline"}
                        size="lg"
                        className={`w-full font-semibold ${
                          tier.popular 
                            ? '' 
                            : 'border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        {tier.buttonText}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-16 space-y-6"
        >
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: '🔒',
                title: 'Secure Payment',
                description: 'SSL encrypted checkout with multiple payment options'
              },
              {
                icon: '🎫',
                title: 'Instant Confirmation',
                description: 'Receive your tickets immediately via email'
              },
              {
                icon: '💰',
                title: 'Money Back Guarantee',
                description: 'Full refund available up to 30 days before event'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-gray-500 text-sm"
          >
            All prices are in USD. Group discounts available for 5+ tickets.{' '}
            <span className="text-purple-400 hover:text-purple-300 cursor-pointer">
              Contact us for enterprise pricing.
            </span>
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  )
}
