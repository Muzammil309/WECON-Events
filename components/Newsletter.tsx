'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(true)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log('Newsletter signup:', { email, isSubscribed })
  }

  return (
    <section className="section-padding bg-dark text-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/background/3.webp"
          alt="Background"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-dark/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark" />
      </div>

      <motion.div
        ref={ref}
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
            className="text-xl text-gray-300 max-w-3xl mx-auto"
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
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 text-center md:text-left bg-dark-2 border-gray-600 text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary"
              />
            </div>
            <Button
              type="submit"
              variant="aivent"
              size="lg"
              className="h-14 px-8 font-bold"
            >
              SIGN UP
            </Button>
          </div>

          {/* Checkbox and Terms */}
          <div className="text-center space-y-4">
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center gap-3"
            >
              <Checkbox
                id="updates"
                checked={isSubscribed}
                onCheckedChange={(checked) => setIsSubscribed(checked as boolean)}
                className="border-gray-400 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label 
                htmlFor="updates" 
                className="text-gray-300 cursor-pointer"
              >
                Keep me updated on other news and exclusive offers
              </label>
            </motion.div>

            <motion.p 
              variants={itemVariants}
              className="text-sm text-gray-400"
            >
              Note: You can opt-out at any time. See our{' '}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>{' '}
              and{' '}
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
