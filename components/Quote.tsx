'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useRef } from 'react'
import Image from 'next/image'
import { Quote as QuoteIcon } from 'lucide-react'

export default function Quote() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
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

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1, ease: "easeOut" },
    },
  }

  return (
    <section ref={ref} className="relative py-20 text-white overflow-hidden" style={{ backgroundColor: '#101435' }}>
      {/* Background Image with Parallax Effect */}
      <motion.div
        className="absolute inset-0"
        style={{ y }}
      >
        <Image
          src="/aivent-original/images/background/2.webp"
          alt="Background"
          fill
          className="object-cover"
          priority={false}
        />

        {/* Enhanced Gradient Overlays for better background visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101435] via-[#101435]/30 to-[#101435]/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#101435]/40 via-transparent to-[#101435]" />
        <div className="absolute inset-0 bg-[#101435]/50" />
      </motion.div>

      <motion.div
        ref={inViewRef}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative z-10 container-custom"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <motion.div variants={imageVariants} className="relative">
            <div className="relative">
              {/* Quote Icon */}
              <motion.div
                variants={itemVariants}
                className="absolute -top-4 -right-4 w-20 h-20 bg-primary rounded-xl flex items-center justify-center z-10"
              >
                <QuoteIcon className="w-10 h-10 text-white" />
              </motion.div>
              
              {/* Profile Image */}
              <div className="relative w-full max-w-md mx-auto">
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <Image
                    src="/aivent-original/images/misc/s9.webp"
                    alt="Elon Musk"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                
                {/* Decorative Elements */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-8 -left-8 w-16 h-16 bg-primary/30 rounded-full blur-xl"
                />
                
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-6 -right-6 w-20 h-20 bg-secondary/20 rounded-full blur-2xl"
                />
              </div>
            </div>
          </motion.div>

          {/* Quote Content */}
          <motion.div variants={itemVariants} className="space-y-8">
            <motion.blockquote
              variants={itemVariants}
              className="text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed text-white"
            >
              "Artificial intelligence is advancing rapidly, and while it offers immense opportunity, it also poses significant risks. If not properly regulated and aligned with human values, AI could become a fundamental threat to civilization."
            </motion.blockquote>
            
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="text-xl font-semibold text-primary">
                Elon Musk
              </div>
              <div className="text-gray-400">
                CEO of Tesla & SpaceX, Founder of Neuralink
              </div>
            </motion.div>

            {/* Decorative Line */}
            <motion.div
              variants={itemVariants}
              className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
