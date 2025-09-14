'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { Check } from 'lucide-react'

export default function About() {
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

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1, ease: "easeOut" },
    },
  }

  const checklistItems = [
    "5 days of keynotes, workshops, and networking",
    "50 world-class speakers",
    "Startup showcase and live demos"
  ]

  return (
    <section id="section-about" className="section-padding text-white" style={{ backgroundColor: '#101435' }}>
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="container-custom"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="space-y-6">
              <motion.div
                variants={itemVariants}
                className="subtitle"
              >
                About the Event
              </motion.div>
              
              <motion.h2
                variants={itemVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              >
                A Global Gathering of{' '}
                <span className="aivent-text-gradient">AI Innovators</span>
              </motion.h2>
              
              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-300 leading-relaxed"
              >
                Join thought leaders, developers, researchers, and founders as we explore how artificial intelligence is reshaping industries, creativity, and the future of work.
              </motion.p>
            </div>

            {/* Checklist */}
            <motion.div variants={itemVariants} className="space-y-4">
              {checklistItems.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg text-gray-300">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            variants={imageVariants}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md lg:max-w-lg">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="relative w-full aspect-square"
              >
                <Image
                  src="/aivent-original/images/misc/c1.webp"
                  alt="AI Innovation Visualization"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </motion.div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-4 -left-4 w-8 h-8 bg-primary/30 rounded-full blur-sm"
              />
              
              <motion.div
                animate={{
                  y: [0, 15, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-6 -right-6 w-12 h-12 bg-secondary/20 rounded-full blur-md"
              />
              
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  x: [0, 10, 0],
                  opacity: [0.4, 0.9, 0.4],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
                className="absolute top-1/2 -right-8 w-6 h-6 bg-primary/40 rounded-full blur-sm"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
