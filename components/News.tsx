'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function News() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="section-padding bg-dark text-white">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="container-custom text-center"
      >
        <div className="subtitle mb-4">Latest News</div>
        <h2 className="text-4xl md:text-5xl font-bold mb-16">
          Stay <span className="aivent-text-gradient">Updated</span>
        </h2>
        
        {/* Placeholder for news articles */}
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-aivent p-6 text-left">
              <div className="w-full h-48 bg-gray-700 rounded-lg mb-4" />
              <h4 className="text-xl font-bold mb-2">News Article {i}</h4>
              <p className="text-gray-400">Latest updates from AI Summit 2025...</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
