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
    <section className="relative py-0 overflow-hidden">
      {/* First Marquee Row */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 3 }}
        className="bg-primary text-white py-6 transform rotate-2 relative"
      >
        <div className="de-marquee-list-1 flex items-center whitespace-nowrap">
          {[...Array(3)].map((_, setIndex) => (
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
        </div>
      </motion.div>

      {/* Second Marquee Row */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 3 }}
        className="bg-secondary text-white py-6 transform -rotate-1 -mt-5 relative"
      >
        <div className="de-marquee-list-2 flex items-center whitespace-nowrap">
          {[...Array(3)].map((_, setIndex) => (
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
        </div>
      </motion.div>
    </section>
  )
}
