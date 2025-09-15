'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  
  const [inViewRef, inView] = useInView({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Newsletter signup:', { email, isSubscribed })
  }

  return (
    <section 
      ref={sectionRef}
      className="section-padding text-white relative overflow-hidden"
      style={{ backgroundColor: '#101435' }}
    >
      {/* Background Image with Parallax Effect */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        <Image
          src="/aivent-original/images/background/3.webp"
          alt="Background"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-dark/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark" />
      </motion.div>

      <motion.div
        ref={inViewRef}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="container-custom relative z-10"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div variants={itemVariants} className="subtitle mb-4">
            Stay in the Loop
          </motion.div>
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Join the Future of <span className="aivent-text-gradient">Innovation</span>
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
          >
            Making better things takes time. Drop us your email to stay in the know as we work to reduce our environmental impact. We'll share other exciting news and exclusive offers, too.
          </motion.p>
        </div>

        {/* Newsletter Form */}
        <motion.form 
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-primary"
              required
            />
            <Button 
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 font-semibold"
            >
              SIGN UP
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="newsletter-consent"
                checked={isSubscribed}
                onCheckedChange={(checked) => setIsSubscribed(checked as boolean)}
                className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-1"
              />
              <label htmlFor="newsletter-consent" className="text-sm text-gray-300 leading-relaxed">
                Keep me updated on other news and exclusive offers
              </label>
            </div>
            
            <motion.p 
              variants={itemVariants}
              className="text-sm text-gray-400"
            >
              Note: You can opt-out at any time. See our{' '}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
              {' '}and{' '}
              <a href="#" className="text-primary hover:underline">
                Terms
              </a>
              .
            </motion.p>
          </div>
        </motion.form>
      </motion.div>
    </section>
  )
}
