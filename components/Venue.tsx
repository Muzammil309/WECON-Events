'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function Venue() {
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

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      content: "121 AI Blvd, San Francisco, CA 94107"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "Call: +1 123 456 789"
    },
    {
      icon: Mail,
      title: "Email",
      content: "contact@aivent.com"
    }
  ]

  return (
    <section id="section-venue" className="section-padding bg-dark text-white">
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
            Event Location
          </motion.div>
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Location & <span className="aivent-text-gradient">Venue</span>
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Join us in the heart of innovation at San Francisco Tech Pavilion—surrounded by top hotels, transit, and culture.
          </motion.p>
        </div>

        {/* Venue Images */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-xl">
            <Image
              src="/aivent-original/images/misc/l1.webp"
              alt="Venue Interior"
              width={600}
              height={400}
              className="w-full h-80 object-cover hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-xl">
            <Image
              src="/aivent-original/images/misc/l2.webp"
              alt="Venue Exterior"
              width={600}
              height={400}
              className="w-full h-80 object-cover hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>

        {/* Contact Information */}
        <div className="grid lg:grid-cols-3 gap-8">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-center justify-center gap-4 p-6 card-aivent hover:scale-105 transition-all duration-300"
            >
              <div className="flex-shrink-0">
                <info.icon className="w-12 h-12 text-primary" />
              </div>
              <div className="text-center lg:text-left">
                <h4 className="text-xl font-bold mb-2">{info.title}</h4>
                <p className="text-gray-300">{info.content}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Venue Images */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[3, 4, 5].map((num) => (
            <motion.div
              key={num}
              variants={itemVariants}
              className="relative overflow-hidden rounded-xl"
            >
              <Image
                src={`/aivent-original/images/misc/l${num}.webp`}
                alt={`Venue Image ${num}`}
                width={400}
                height={300}
                className="w-full h-60 object-cover hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
