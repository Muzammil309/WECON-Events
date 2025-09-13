'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Brain, 
  Network, 
  Rocket, 
  Users, 
  Trophy, 
  Zap,
  Target,
  Globe,
  BookOpen
} from 'lucide-react'

const reasons = [
  {
    icon: Brain,
    title: 'Cutting-Edge AI Research',
    description: 'Discover the latest breakthroughs in machine learning, deep learning, and neural networks from leading researchers worldwide.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Network,
    title: 'Industry Networking',
    description: 'Connect with AI pioneers, tech leaders, investors, and innovators who are shaping the future of artificial intelligence.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Rocket,
    title: 'Startup Showcase',
    description: 'Witness groundbreaking AI startups pitch their revolutionary solutions and discover the next unicorns in the AI space.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Users,
    title: 'Expert Workshops',
    description: 'Participate in hands-on workshops led by industry experts and gain practical skills in AI implementation.',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Trophy,
    title: 'Innovation Awards',
    description: 'Celebrate the most innovative AI solutions and breakthrough technologies that are transforming industries.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Zap,
    title: 'Live Demonstrations',
    description: 'Experience cutting-edge AI technologies in action with live demos and interactive exhibitions.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Target,
    title: 'Business Applications',
    description: 'Learn how to implement AI solutions in your business with real-world case studies and success stories.',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    icon: Globe,
    title: 'Global Perspective',
    description: 'Gain insights into AI development and adoption across different countries and cultural contexts.',
    color: 'from-rose-500 to-pink-500'
  },
  {
    icon: BookOpen,
    title: 'Educational Content',
    description: 'Access comprehensive learning materials, research papers, and educational resources from top institutions.',
    color: 'from-violet-500 to-purple-500'
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
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <section id="why-attend" className="section-padding relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
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
            <Trophy className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-gray-300">Why Attend</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            Why Join{' '}
            <span className="aivent-text-gradient">AI Summit 2025</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover compelling reasons to be part of the most influential AI event of the year, 
            where innovation meets opportunity and the future takes shape.
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="group relative"
            >
              <div className="card-aivent h-full p-8 relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${reason.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${reason.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <reason.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                  {reason.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {reason.description}
                </p>

                {/* Hover Effect Border */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${reason.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-16"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Shape the Future?
            </h3>
            <p className="text-gray-400 mb-8">
              Join thousands of AI enthusiasts, researchers, and industry leaders 
              at the most comprehensive AI summit of 2025.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <button
                onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-aivent-primary text-lg px-10 py-4"
              >
                Secure Your Spot Now
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
