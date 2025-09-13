'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Contact() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="section-padding bg-gray-900 text-white">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="container-custom"
      >
        <div className="text-center mb-16">
          <div className="subtitle mb-4">Get in Touch</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Contact <span className="aivent-text-gradient">Us</span>
          </h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="card-aivent p-8">
            <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
            <form className="space-y-6">
              <Input placeholder="Your Name" className="bg-gray-800 border-gray-700" />
              <Input placeholder="Your Email" type="email" className="bg-gray-800 border-gray-700" />
              <Input placeholder="Subject" className="bg-gray-800 border-gray-700" />
              <textarea 
                placeholder="Your Message"
                rows={5}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400"
              />
              <Button variant="aivent" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="card-aivent p-8">
              <h3 className="text-2xl font-bold mb-4">Event Information</h3>
              <div className="space-y-4 text-gray-300">
                <p><strong>Date:</strong> October 1-5, 2025</p>
                <p><strong>Location:</strong> San Francisco, CA</p>
                <p><strong>Venue:</strong> Moscone Center</p>
                <p><strong>Email:</strong> info@aisummit2025.com</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
