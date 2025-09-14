'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

// Official AIvent Demo 1 speakers data
const speakers = [
  {
    id: 1,
    name: "Joshua Henry",
    title: "AI Research Lead, DeepTech Labs",
    image: "/assets/images/team/1.webp",
    session: "Opening Keynote – The State of AI 2025"
  },
  {
    id: 2,
    name: "Leila Zhang",
    title: "VP of Machine Learning, Google",
    image: "/assets/images/team/2.webp",
    session: "Building Human-Centered AI Products"
  },
  {
    id: 3,
    name: "Carlos Rivera",
    title: "Founder & CEO, NeuralCore",
    image: "/assets/images/team/3.webp",
    session: "AI Policy & Regulation – A Global Overview"
  },
  {
    id: 4,
    name: "Maria Gonzalez",
    title: "Founder & CEO, SynthCore AI",
    image: "/assets/images/team/4.webp",
    session: "Building a Startup with AI at the Core"
  },
  {
    id: 5,
    name: "Lisa Zhang",
    title: "AI Ethics Researcher, FairAI Group",
    image: "/assets/images/team/6.webp",
    session: "Bias in Data — Hidden Dangers in AI Pipelines"
  },
  {
    id: 6,
    name: "Markus Blom",
    title: "CTO, SynthMind AI",
    image: "/assets/images/team/7.webp",
    session: "Generative Models Beyond Text"
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
    <section id="section-speakers" className="section-padding bg-dark text-white">
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
            Our Speakers
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            World-Class <span className="aivent-text-gradient">Experts</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Learn from the brightest minds in artificial intelligence, machine learning, and technology innovation.
          </motion.p>
        </div>

        {/* Speakers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker, index) => (
            <motion.div
              key={speaker.id}
              variants={itemVariants}
              className="group"
            >
              <div className="card-aivent p-8 text-center h-full hover:scale-105 transition-all duration-300">
                {/* Speaker Image */}
                <div className="relative w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full">
                  <Image
                    src={speaker.image}
                    alt={speaker.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 128px, 128px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Speaker Info */}
                <div className="space-y-3">
                  <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                    {speaker.name}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {speaker.title}
                  </p>
                  <div className="pt-2">
                    <p className="text-primary text-sm font-medium">
                      {speaker.session}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
