'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function Speakers() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="section-speakers" className="section-padding bg-dark text-white">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="container-custom text-center"
      >
        <div className="subtitle mb-4">Our Speakers</div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          World-Class <span className="aivent-text-gradient">Experts</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Learn from the brightest minds in artificial intelligence, machine learning, and technology innovation.
        </p>
        
        {/* Placeholder for speakers grid */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card-aivent p-6 text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Speaker {i}</h4>
              <p className="text-gray-400">AI Expert</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
