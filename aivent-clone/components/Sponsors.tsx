'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Building2, Star, Award, Crown } from 'lucide-react'
import type { Sponsor } from '@/types'

const sponsors: Sponsor[] = [
  // Platinum Sponsors
  {
    id: '1',
    name: 'Google',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    tier: 'platinum',
    website: 'https://google.com'
  },
  {
    id: '2',
    name: 'Microsoft',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    tier: 'platinum',
    website: 'https://microsoft.com'
  },
  {
    id: '3',
    name: 'OpenAI',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    tier: 'platinum',
    website: 'https://openai.com'
  },
  // Gold Sponsors
  {
    id: '4',
    name: 'NVIDIA',
    logo: 'https://upload.wikimedia.org/wikipedia/en/2/21/Nvidia_logo.svg',
    tier: 'gold',
    website: 'https://nvidia.com'
  },
  {
    id: '5',
    name: 'Tesla',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg',
    tier: 'gold',
    website: 'https://tesla.com'
  },
  {
    id: '6',
    name: 'Meta',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    tier: 'gold',
    website: 'https://meta.com'
  },
  {
    id: '7',
    name: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    tier: 'gold',
    website: 'https://amazon.com'
  },
  // Silver Sponsors
  {
    id: '8',
    name: 'IBM',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
    tier: 'silver',
    website: 'https://ibm.com'
  },
  {
    id: '9',
    name: 'Intel',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg',
    tier: 'silver',
    website: 'https://intel.com'
  },
  {
    id: '10',
    name: 'Adobe',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.svg',
    tier: 'silver',
    website: 'https://adobe.com'
  },
  {
    id: '11',
    name: 'Salesforce',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
    tier: 'silver',
    website: 'https://salesforce.com'
  },
  {
    id: '12',
    name: 'Oracle',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg',
    tier: 'silver',
    website: 'https://oracle.com'
  },
  {
    id: '13',
    name: 'Spotify',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    tier: 'silver',
    website: 'https://spotify.com'
  }
]

const getTierIcon = (tier: string) => {
  switch (tier) {
    case 'platinum':
      return Crown
    case 'gold':
      return Award
    case 'silver':
      return Star
    default:
      return Building2
  }
}

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'platinum':
      return 'from-gray-300 to-gray-100'
    case 'gold':
      return 'from-yellow-400 to-yellow-200'
    case 'silver':
      return 'from-gray-400 to-gray-300'
    default:
      return 'from-orange-400 to-orange-200'
  }
}

const getTierSize = (tier: string) => {
  switch (tier) {
    case 'platinum':
      return 'h-20 md:h-24'
    case 'gold':
      return 'h-16 md:h-20'
    case 'silver':
      return 'h-12 md:h-16'
    default:
      return 'h-10 md:h-12'
  }
}

export default function Sponsors() {
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
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const sponsorsByTier = {
    platinum: sponsors.filter(s => s.tier === 'platinum'),
    gold: sponsors.filter(s => s.tier === 'gold'),
    silver: sponsors.filter(s => s.tier === 'silver'),
    bronze: sponsors.filter(s => s.tier === 'bronze'),
  }

  return (
    <section id="sponsors" className="section-padding relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
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
            <Building2 className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">Our Partners</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            Powered by{' '}
            <span className="aivent-text-gradient">Industry Leaders</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            AI Summit 2025 is made possible by the generous support of leading 
            technology companies and organizations driving AI innovation.
          </p>
        </motion.div>

        {/* Platinum Sponsors */}
        {sponsorsByTier.platinum.length > 0 && (
          <motion.div variants={itemVariants} className="mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <Crown className="w-6 h-6 text-gray-300" />
                <h3 className="text-2xl font-bold text-white">Platinum Partners</h3>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {sponsorsByTier.platinum.map((sponsor, index) => (
                <motion.a
                  key={sponsor.id}
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass-effect rounded-2xl p-8 border border-white/10 hover:border-gray-300/50 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-center h-24">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="max-h-full max-w-full object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
                    />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Gold Sponsors */}
        {sponsorsByTier.gold.length > 0 && (
          <motion.div variants={itemVariants} className="mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <Award className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">Gold Partners</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {sponsorsByTier.gold.map((sponsor, index) => (
                <motion.a
                  key={sponsor.id}
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass-effect rounded-xl p-6 border border-white/10 hover:border-yellow-400/50 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-center h-20">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="max-h-full max-w-full object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
                    />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Silver Sponsors */}
        {sponsorsByTier.silver.length > 0 && (
          <motion.div variants={itemVariants} className="mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <Star className="w-6 h-6 text-gray-400" />
                <h3 className="text-2xl font-bold text-white">Silver Partners</h3>
              </div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-6xl mx-auto">
              {sponsorsByTier.silver.map((sponsor, index) => (
                <motion.a
                  key={sponsor.id}
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="glass-effect rounded-lg p-4 border border-white/10 hover:border-gray-400/50 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-center h-16">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="max-h-full max-w-full object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
                    />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Become a Sponsor CTA */}
        <motion.div
          variants={itemVariants}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-block glass-effect rounded-2xl p-8 border border-white/10"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Become a Sponsor
            </h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Join leading companies in supporting the future of AI. 
              Multiple sponsorship packages available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
              >
                Sponsorship Packages
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Contact Sales
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Marquee of Sponsor Logos */}
        <motion.div
          variants={itemVariants}
          className="mt-20 overflow-hidden"
        >
          <div className="marquee-container">
            <motion.div
              animate={{ x: [0, -100 + '%'] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex gap-12 items-center"
            >
              {[...sponsors, ...sponsors].map((sponsor, index) => (
                <div
                  key={`${sponsor.id}-${index}`}
                  className="flex-shrink-0 w-32 h-16 flex items-center justify-center opacity-30 hover:opacity-60 transition-opacity"
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="max-h-full max-w-full object-contain filter brightness-0 invert"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
