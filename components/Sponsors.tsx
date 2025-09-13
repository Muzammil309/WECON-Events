'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function Sponsors() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="section-padding bg-gray-900 text-white">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="container-custom text-center"
      >
        <div className="subtitle mb-4">Our Partners</div>
        <h2 className="text-4xl md:text-5xl font-bold mb-16">
          Trusted by <span className="aivent-text-gradient">Industry Leaders</span>
        </h2>
        
        {/* Placeholder for sponsor logos */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-700 h-16 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Logo {i}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
