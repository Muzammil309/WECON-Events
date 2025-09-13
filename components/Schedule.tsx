'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function Schedule() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="section-schedule" className="section-padding bg-gray-900 text-white">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="container-custom text-center"
      >
        <div className="subtitle mb-4">Event Schedule</div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          5 Days of <span className="aivent-text-gradient">Innovation</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-16">
          Comprehensive agenda featuring keynotes, workshops, panels, and networking sessions.
        </p>
        
        {/* Placeholder for schedule content */}
        <div className="card-aivent p-8">
          <p className="text-gray-400">Schedule details coming soon...</p>
        </div>
      </motion.div>
    </section>
  )
}
