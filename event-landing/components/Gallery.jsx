import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { X, ZoomIn } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'

const Gallery = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [selectedImage, setSelectedImage] = useState(null)

  const galleryImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Conference Main Stage',
      category: 'Keynotes'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Networking Event',
      category: 'Networking'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Workshop Session',
      category: 'Workshops'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Panel Discussion',
      category: 'Panels'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Tech Expo',
      category: 'Exhibition'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Startup Showcase',
      category: 'Startups'
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Innovation Lab',
      category: 'Innovation'
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Team Collaboration',
      category: 'Collaboration'
    },
    {
      id: 9,
      src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Evening Gala',
      category: 'Social'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  }

  return (
    <section id="gallery" className="section-padding">
      <div className="container-custom">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="text-purple-400 font-semibold text-lg">Event Highlights</span>
            <h2 className="text-4xl md:text-5xl font-bold font-heading mt-2 mb-6">
              Moments of <span className="gradient-text">Innovation</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore highlights from previous events and get a glimpse of the 
              incredible experiences waiting for you.
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className={`relative group cursor-pointer overflow-hidden rounded-lg ${
                  index % 3 === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                } ${
                  index === 4 ? 'lg:col-span-2' : ''
                }`}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative aspect-square lg:aspect-auto lg:h-64 overflow-hidden rounded-lg">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            whileHover={{ scale: 1 }}
                            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                          >
                            <ZoomIn className="w-8 h-8 text-white" />
                          </motion.div>
                        </div>
                        
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white font-semibold text-lg mb-1">
                            {image.alt}
                          </h3>
                          <span className="text-purple-300 text-sm font-medium">
                            {image.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none">
                    <motion.div
                      variants={modalVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="relative"
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                        <h3 className="text-white font-semibold text-xl mb-2">
                          {image.alt}
                        </h3>
                        <span className="text-purple-300 font-medium">
                          {image.category}
                        </span>
                      </div>
                    </motion.div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center mt-16">
            <p className="text-gray-300 mb-6 text-lg">
              Ready to be part of the next chapter?
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Join Us This Year
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Gallery
