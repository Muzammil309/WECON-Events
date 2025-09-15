'use client'

import { motion } from 'framer-motion'

const marqueeItems = [
  "Next Intelligence",
  "Future Now",
  "Empowering Innovation",
  "Smarter Tomorrow",
  "Think Forward",
  "Cognitive Shift"
]

export default function MarqueeSection() {
  return (
    <section className="relative py-0 overflow-hidden" style={{ backgroundColor: '#101435' }}>
      {/* First Marquee Row - Enhanced X-formation */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 3 }}
        className="bg-primary text-white py-8 transform rotate-6 relative overflow-hidden"
        style={{ marginTop: '60px', marginBottom: '-30px' }}
      >
        <motion.div
          animate={{ x: [0, -100] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="de-marquee-list-1 flex items-center whitespace-nowrap"
        >
          {[...Array(6)].map((_, setIndex) => (
            <div key={setIndex} className="flex items-center">
              {marqueeItems.map((item, index) => (
                <div key={`${setIndex}-${index}`} className="flex items-center">
                  <span className="text-4xl md:text-6xl font-bold mx-8">
                    {item}
                  </span>
                  <span className="text-4xl md:text-6xl font-bold mx-8 opacity-20">
                    /
                  </span>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Second Marquee Row - Enhanced X-formation */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 3 }}
        className="bg-secondary text-white py-8 transform -rotate-6 relative overflow-hidden"
        style={{ marginTop: '-50px', marginBottom: '60px' }}
      >
        <motion.div
          animate={{ x: [-100, 0] }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          className="de-marquee-list-2 flex items-center whitespace-nowrap"
        >
          {[...Array(6)].map((_, setIndex) => (
            <div key={setIndex} className="flex items-center">
              {marqueeItems.map((item, index) => (
                <div key={`${setIndex}-${index}`} className="flex items-center">
                  <span className="text-4xl md:text-6xl font-bold mx-8">
                    {item}
                  </span>
                  <span className="text-4xl md:text-6xl font-bold mx-8 opacity-20">
                    /
                  </span>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
