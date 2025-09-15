'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

// Official AIvent Demo 1 speakers data - showing exactly 3 speakers as in original
const speakers = [
  {
    id: 1,
    name: "Joshua Henry",
    title: "AI Research Lead, DeepTech Labs",
    image: "/aivent-original/images/team/1.webp",
    session: "Opening Keynote – The State of AI 2025"
  },
  {
    id: 2,
    name: "Leila Zhang",
    title: "VP of Machine Learning, Google",
    image: "/aivent-original/images/team/2.webp",
    session: "Building Human-Centered AI Products"
  },
  {
    id: 3,
    name: "Carlos Rivera",
    title: "Founder & CEO, NeuralCore",
    image: "/aivent-original/images/team/3.webp",
    session: "AI Policy & Regulation – A Global Overview"
  }
]

export default function Speakers() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section id="section-speakers" className="section-padding text-white" style={{ backgroundColor: '#101435' }}>
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="container-custom"
      >
        {/* Section Header - Official AIvent Style */}
        <div className="text-center mb-16">
          <motion.div variants={itemVariants} className="subtitle mb-4">
            Speakers
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Meet the <span className="aivent-text-gradient">Visionaries</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Whether it's a quick refresh or a deep clean transformation, our expert touch leaves your home or office shining.
          </motion.p>
        </div>

        {/* Speakers Grid - Official AIvent Design */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker, index) => (
            <motion.div
              key={speaker.id}
              variants={itemVariants}
              className="group relative rounded-lg overflow-hidden hover:scale-105 transition-all duration-300"
            >
              {/* Full-width Speaker Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Radial gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Speaker Info at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 z-10">
                  <div className="bg-black/60 backdrop-blur-sm p-4 m-4 rounded-lg text-center">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {speaker.name}
                    </h3>
                    <span className="text-gray-300 text-sm">
                      {speaker.title}
                    </span>
                  </div>

                  {/* Bottom gradient edge */}
                  <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-black/40 to-transparent opacity-80" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
