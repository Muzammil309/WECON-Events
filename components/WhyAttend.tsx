'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

const features = [
  {
    id: 1,
    title: "Cutting-Edge Knowledge",
    description: "Stay ahead of the curve with insights from AI leaders shaping tomorrow's technology.",
    image: "/assets/images/misc/s3.webp"
  },
  {
    id: 2,
    title: "Hands-On Learning",
    description: "Join live workshops and labs to build practical skills in AI and machine learning.",
    image: "/assets/images/misc/s4.webp"
  },
  {
    id: 3,
    title: "Global Networking",
    description: "Meet developers, founders, and researchers from around the world to collaborate and grow.",
    image: "/assets/images/misc/s5.webp"
  },
  {
    id: 4,
    title: "Startup Showcase",
    description: "Explore the latest AI tools and ideas from promising startups and research labs.",
    image: "/assets/images/misc/s6.webp"
  },
  {
    id: 5,
    title: "AI Career Boost",
    description: "Access exclusive job fairs, mentorship sessions, and recruiting events to grow your career.",
    image: "/assets/images/misc/s7.webp"
  },
  {
    id: 6,
    title: "Ethics & Future",
    description: "Engage in vital conversations around AI ethics, policy, and the future of intelligence.",
    image: "/assets/images/misc/s8.webp"
  }
]

export default function WhyAttend() {
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

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section id="section-why-attend" className="section-padding bg-dark text-white">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="container-custom"
      >
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div variants={itemVariants} className="subtitle mb-4">
            Why Attend
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            What You'll <span className="aivent-text-gradient">Gain</span>
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Hear from global AI pioneers, industry disruptors, and bold thinkers shaping the future across every domain.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              className="group relative overflow-hidden rounded-xl bg-gray-900/50 hover:bg-transparent transition-all duration-500"
            >
              {/* Background Image */}
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
                
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <h4 className="text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-gray-300 group-hover:text-white/90 transition-colors leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-xl transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
