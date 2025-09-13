'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { MapPin, Car, Train, Plane, Wifi, Coffee, Users, Shield } from 'lucide-react'

const venueFeatures = [
  {
    icon: Users,
    title: 'Large Capacity',
    description: '5,000+ attendee capacity across multiple halls'
  },
  {
    icon: Wifi,
    title: 'High-Speed WiFi',
    description: 'Complimentary high-speed internet throughout'
  },
  {
    icon: Coffee,
    title: 'Food & Beverage',
    description: 'Multiple dining options and coffee stations'
  },
  {
    icon: Shield,
    title: 'Security',
    description: '24/7 security and professional event management'
  }
]

const transportationOptions = [
  {
    icon: Plane,
    title: 'By Air',
    description: 'San Francisco International Airport (SFO) - 20 minutes',
    details: 'Direct flights from major cities worldwide'
  },
  {
    icon: Train,
    title: 'By Train',
    description: 'Powell Street BART Station - 5 minutes walk',
    details: 'Direct connection from SFO and East Bay'
  },
  {
    icon: Car,
    title: 'By Car',
    description: 'Multiple parking garages nearby',
    details: 'Valet parking available for VIP ticket holders'
  }
]

export default function Venue() {
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
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section id="venue" className="section-padding relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl" />
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
            <MapPin className="w-5 h-5 text-orange-400" />
            <span className="text-sm font-medium text-gray-300">Event Venue</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            Moscone{' '}
            <span className="aivent-text-gradient">Center</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Located in the heart of San Francisco, Moscone Center provides the perfect 
            setting for AI Summit 2025 with world-class facilities and accessibility.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Venue Info */}
            <div className="card-aivent p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Venue Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Address</h4>
                    <p className="text-gray-400">
                      747 Howard Street<br />
                      San Francisco, CA 94103<br />
                      United States
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Capacity</h4>
                    <p className="text-gray-400">
                      5,000+ attendees across multiple exhibition halls and meeting rooms
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Venue Features */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Venue Features</h3>
              <div className="grid grid-cols-2 gap-4">
                {venueFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="card-aivent p-6 text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Content - Map */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Map */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-700">
              <div className="aspect-[4/3] bg-slate-800 relative">
                {/* Placeholder for map */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0197!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjYiTiAxMjLCsDI1JzA5LjgiVw!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-300"
                />
                
                {/* Map Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />
                
                {/* Location Pin */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center"
                  >
                    <MapPin className="w-5 h-5 text-white" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Transportation */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Getting There</h3>
              <div className="space-y-4">
                {transportationOptions.map((option, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                    className="card-aivent p-6 hover:border-orange-500/50 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <option.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{option.title}</h4>
                        <p className="text-gray-300 mb-2">{option.description}</p>
                        <p className="text-gray-400 text-sm">{option.details}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hotel Recommendations */}
        <motion.div variants={itemVariants} className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Recommended Hotels</h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            We've partnered with nearby hotels to offer special rates for AI Summit 2025 attendees. 
            Book early to secure the best prices and availability.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-aivent-secondary"
          >
            View Hotel Partners
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}
