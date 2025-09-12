'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Camera, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import type { GalleryImage } from '@/types'

const galleryImages: GalleryImage[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'AI Summit 2024 Main Stage',
    category: 'Keynotes',
    width: 800,
    height: 600
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    alt: 'Networking Session',
    category: 'Networking',
    width: 600,
    height: 800
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Workshop in Progress',
    category: 'Workshops',
    width: 800,
    height: 600
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    alt: 'Panel Discussion',
    category: 'Panels',
    width: 600,
    height: 400
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Tech Exhibition',
    category: 'Exhibition',
    width: 800,
    height: 600
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    alt: 'Innovation Showcase',
    category: 'Innovation',
    width: 600,
    height: 800
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Startup Presentations',
    category: 'Startups',
    width: 800,
    height: 600
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    alt: 'Team Collaboration',
    category: 'Collaboration',
    width: 600,
    height: 400
  },
  {
    id: '9',
    src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Awards Ceremony',
    category: 'Awards',
    width: 800,
    height: 600
  }
]

export default function Gallery() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image)
    setCurrentIndex(galleryImages.findIndex(img => img.id === image.id))
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % galleryImages.length
    setCurrentIndex(nextIndex)
    setSelectedImage(galleryImages[nextIndex])
  }

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length
    setCurrentIndex(prevIndex)
    setSelectedImage(galleryImages[prevIndex])
  }

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
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <>
      <section id="gallery" className="section-padding relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="container-custom relative z-10"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-white/20 mb-6"
            >
              <Camera className="w-5 h-5 text-pink-400" />
              <span className="text-sm font-medium text-gray-300">Event Gallery</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
              Moments of{' '}
              <span className="aivent-text-gradient">Innovation</span>
            </h2>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Relive the highlights from previous AI Summit events and get a glimpse 
              of the incredible experiences waiting for you.
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
                className={`relative group cursor-pointer overflow-hidden rounded-xl ${
                  index % 5 === 0 ? 'md:col-span-2' : ''
                } ${
                  index % 7 === 0 ? 'lg:row-span-2' : ''
                }`}
                onClick={() => openLightbox(image)}
              >
                <div className="relative aspect-square overflow-hidden rounded-xl">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
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
              </motion.div>
            ))}
          </motion.div>

          {/* View More CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="inline-block glass-effect rounded-2xl p-8 border border-white/10"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                More Photos Coming Soon
              </h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Follow us on social media for live updates and behind-the-scenes 
                content from AI Summit 2025.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
              >
                Follow @aisummit2025
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image */}
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white font-semibold text-xl mb-2">
                  {selectedImage.alt}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-purple-300 font-medium">
                    {selectedImage.category}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {currentIndex + 1} of {galleryImages.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
